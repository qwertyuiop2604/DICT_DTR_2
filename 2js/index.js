import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getAuth,
    signInWithEmailAndPassword,
    sendEmailVerification,
    updatePassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    where,
    getDocs,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAWnrqJZ3ih5ZVwm8kmTW6VPW1WHzuSe98",
    authDomain: "dict-dtr.firebaseapp.com",
    projectId: "dict-dtr",
    storageBucket: "dict-dtr.appspot.com",
    messagingSenderId: "813571675102",
    appId: "1:813571675102:web:c985fef4b1bac2c4f2c34f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);



// DOM elements
const popup_not_verified = document.getElementById('popup_not_verified');
const btn_ok_not_verified = document.getElementById('btn_ok_not_verified');
const popup_loading = document.getElementById('popup_loading');
const loginContainer = document.querySelector('.login-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const popup_sending_email = document.getElementById('popup_sending_email');
const popup_email_sent = document.getElementById('popup_email_sent');
const btn_ok_email_sent = document.getElementById('btn_ok_email_sent');
const popup_user_not_found = document.getElementById('popup_user_not_found');
const btn_ok_user_not_found = document.getElementById('btn_ok_user_not_found');
const popup_changePassword = document.getElementById('popup_changePassword');



// Store employee ID globally
let employeeIdForPasswordUpdate = null;

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded.");

    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();

        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();

        

        let emailError = document.getElementById("emailError");
        let passwordError = document.getElementById("passwordError");

        emailError.textContent = "";
        passwordError.textContent = "";
        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");

        if (email === "" || password === "") {
            if (email === "") {
                emailError.textContent = "Field is required";
                emailInput.classList.add("input-error");
            }
            if (password === "") {
                passwordError.textContent = "Field is required";
                passwordInput.classList.add("input-error");
            }
            return;
        }

        popup_loading.classList.add('active');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            popup_loading.classList.remove('active');
            const user = userCredential.user;
   

            if (user.emailVerified) {
                // 🔍 Query user by email
                const q = query(collection(db, "users"), where("email", "==", user.email));
                const querySnapshot = await getDocs(q);

           // After a successful login
if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const userData = docSnap.data();
    employeeIdForPasswordUpdate = docSnap.id; // Save the employeeId for later use

    if (userData.status === "Pending") {
        const overlay = document.querySelector('.overlay_changePassword');
        if (overlay) {
            overlay.classList.add('active');  // Ensure the overlay is visible
        }
        if (popup_changePassword) {
            popup_changePassword.style.display = 'flex'; // Keep this line for popup visibility
        }
    } else {
        alert("Login successful!");
        // Save the user data or employeeId in localStorage/sessionStorage for use in the dashboard
        sessionStorage.setItem("employeeId", employeeIdForPasswordUpdate);
        window.location.href = "dashboard.html";  // Redirect to dashboard
    }
} else {
    console.error("User document not found in Firestore.");
}

            } else {
                loginContainer.classList.add('blurred');
                popup_not_verified.classList.add('active');
            }
        } catch (error) {
            popup_loading.classList.remove('active');
            console.error("Login failed:", error);

            if (error.code === "auth/user-not-found") {
                emailError.textContent = "User not found.";
                emailInput.classList.add("input-error");
                loginContainer.classList.add('blurred');
                popup_user_not_found.classList.add('active');
            } else if (error.code === "auth/wrong-password") {
                passwordError.textContent = "Incorrect password.";
                passwordInput.classList.add("input-error");
            } else {
                passwordError.textContent = "Invalid email or password.";
                emailInput.classList.add("input-error");
                passwordInput.classList.add("input-error");
            }
        }
    });
});

// Popup buttons
btn_ok_not_verified.addEventListener('click', () => {
    loginContainer.classList.remove('blurred');
    popup_not_verified.classList.remove('active');
    emailInput.value = '';
    passwordInput.value = '';
});

btn_ok_email_sent.addEventListener('click', () => {
    popup_email_sent.classList.remove('active');
});

// Resend verification
document.getElementById('resend_verification_link').addEventListener('click', (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
        popup_sending_email.classList.add('active');

        if (popup_not_verified.classList.contains('active')) {
            popup_not_verified.classList.remove('active');
        }

        user.reload().then(() => {
            if (!user.emailVerified) {
                sendEmailVerification(user)
                    .then(() => {
                        popup_sending_email.classList.remove('active');
                        popup_email_sent.classList.add('active');
                    })
                    .catch((error) => {
                        popup_sending_email.classList.remove('active');
                        alert('Failed to resend verification email.');
                        console.error('Error:', error);
                    });
            } else {
                popup_sending_email.classList.remove('active');
                alert('Your email is already verified.');
            }
        });
    } else {
        alert('No authenticated user found. Please log in again.');
    }
});

// Confirm password change
// Declare hasError flags
let hasError = false;

// Confirm password change
window.confirmPasswordChange = function () {
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;

    // Clear previous error styles and messages
    const errorMessageContainer = document.getElementById('errorMessageContainer');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    newPasswordInput.classList.remove('input-error');
    confirmPasswordInput.classList.remove('input-error');
    if (errorMessageContainer) {
        errorMessageContainer.textContent = ''; // Clear any previous error
    }

    // Reset hasError flag
    let hasError = false;

    if (!newPass || !confirm) {
        hasError = true;
        const errorMessage = 'Please fill in both password fields.';
        displayError(errorMessage);
        newPasswordInput.classList.add('input-error');
        confirmPasswordInput.classList.add('input-error');
        return;
    }

    if (newPass !== confirm) {
        hasError = true;
        const errorMessage = 'Passwords do not match.';
        displayError(errorMessage);
        newPasswordInput.classList.add('input-error');
        confirmPasswordInput.classList.add('input-error');
        return;
    }

    // Check if the new password matches the employeeId (default password)
    if (newPass === employeeIdForPasswordUpdate) {
        hasError = true;
        const errorMessage = 'Password should not match the default password';
        displayError(errorMessage);
        newPasswordInput.classList.add('input-error');
        confirmPasswordInput.classList.add('input-error');
        return;
    }

    const user = auth.currentUser;
    if (user) {
        updatePassword(user, newPass).then(() => {
            console.log("Password updated.");

            if (employeeIdForPasswordUpdate) {
                const userDocRef = doc(db, "users", employeeIdForPasswordUpdate);
                updateDoc(userDocRef, { status: "Active" }).then(() => {
                    displaySuccess('Password changed successfully!');
                    window.location.href = "dashboard.html";
                }).catch((err) => {
                    console.error("Error updating status:", err);
                    hasError = true;
                    displayError("Failed to update user status.");
                });
            }
        }).catch((error) => {
            console.error("Error changing password:", error);
            hasError = true;
            displayError("Failed to change password. Please try again.");
        });
    } else {
        hasError = true;
        displayError("No user is currently logged in.");
    }
};

// Function to display error message
function displayError(message) {
    const errorMessageContainer = document.getElementById('errorMessageContainer');
    if (errorMessageContainer) {
        errorMessageContainer.textContent = message;
    }
}


// Display success messages in the DOM
function displaySuccess(message) {
    const successMessageContainer = document.getElementById('successMessageContainer');
    if (successMessageContainer) {
        successMessageContainer.textContent = message;
    }
}


window.closePopup_changePassword = function () {
    const overlay = document.querySelector('.overlay_changePassword');
    const popup = document.getElementById('popup_changePassword');
    
    if (overlay) {
        overlay.classList.remove('active');  // Hide the overlay
    }
    if (popup) {
        popup.style.display = 'none';  // Hide the popup
    }
};

