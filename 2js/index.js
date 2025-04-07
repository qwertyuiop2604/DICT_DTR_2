import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration
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

const popup_not_verified = document.getElementById('popup_not_verified');
const btn_ok_not_verified = document.getElementById('btn_ok_not_verified');
const popup_loading = document.getElementById('popup_loading');
const loginContainer = document.querySelector('.login-container');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registrationLink = document.getElementById('registration');

// New elements for User Not Found popup
const popup_user_not_found = document.getElementById('popup_user_not_found');
const btn_ok_user_not_found = document.getElementById('btn_ok_user_not_found');

console.log("Firebase initialized successfully!");

// Ensure script runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting

        let email = emailInput.value.trim();
        let password = passwordInput.value.trim();

        let emailError = document.getElementById("emailError");
        let passwordError = document.getElementById("passwordError");

        // Clear previous error messages and remove error styles
        emailError.textContent = "";
        passwordError.textContent = "";
        emailInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");

        let isValid = true;

        // Validate email
        if (email === "") {
            emailError.textContent = "Field is required";
            emailInput.classList.add("input-error");
            isValid = false;
        }

        // Validate password
        if (password === "") {
            passwordError.textContent = "Field is required";
            passwordInput.classList.add("input-error");
            isValid = false;
        }

        // If all fields are valid, attempt login
        if (isValid) {
            popup_loading.classList.add('active'); // Show loading

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    popup_loading.classList.remove('active'); // Hide loading

                    const user = userCredential.user;
                    if (user.emailVerified) {
                        alert("Login successful!");
                        console.log("User logged in:", user);
                        window.location.href = "dash.html"; // Redirect to dashboard
                    } else {
                        // Email is not verified
                        loginContainer.classList.add('blurred');
                        popup_not_verified.classList.add('active');
                    }
                })
                .catch((error) => {
                    popup_loading.classList.remove('active'); // Hide loading

                    console.error("Login failed:", error.message);

                    if (error.code === "auth/user-not-found") {
                        emailError.textContent = "User not found.";
                        emailInput.classList.add("input-error");
                        // Show user not found popup
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
                });
        }
    });

    // Close the 'Email Not Verified' popup
    btn_ok_not_verified.addEventListener('click', () => {
        loginContainer.classList.remove('blurred');
        popup_not_verified.classList.remove('active');
        emailInput.value = '';
        passwordInput.value = '';
    });

    // Close the 'User Not Found' popup
    btn_ok_user_not_found.addEventListener('click', () => {
        loginContainer.classList.remove('blurred');
        popup_user_not_found.classList.remove('active');
        emailInput.value = '';
        passwordInput.value = '';
    });
});
