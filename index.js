import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

const popup = document.querySelector('.popup_error');
const loginContainer = document.querySelector('.login-container');  // The login form
const btn_ok = document.getElementById('btn_ok');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const registrationLink = document.getElementById('registration');


console.log("Firebase initialized successfully!");

 // Initially hide the popup container
 popup.style.display = 'none';

// Ensure script runs after DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form from submitting

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();

        let emailError = document.getElementById("emailError");
        let passwordError = document.getElementById("passwordError");

        // Clear previous error messages
        emailError.textContent = "";
        passwordError.textContent = "";

        let isValid = true;

        // Validate email
        if (email === "") {
            emailError.textContent = "Field is required";
            isValid = false;
        }

        // Validate password
        if (password === "") {
            passwordError.textContent = "Field is required";
            isValid = false;
        }

        // If all fields are valid, attempt login
        if (isValid) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    // Check if email is verified
                    if (user.emailVerified) {
                        // Successful login and email is verified
                        alert("Login successful!");
                        console.log("User logged in:", user);
                        window.location.href = "dash.html"; // Redirect to dashboard
                    } else {
                        // Email is not verified, show a notification
                        loginContainer.classList.add('blurred');
                        popup.style.display = 'block';
                    }
                })
                .catch((error) => {
                    console.error("Login failed:", error.message);
                    
                    // Show appropriate error messages
                    if (error.code === "auth/user-not-found") {
                        emailError.textContent = "User not found.";
                    } else if (error.code === "auth/wrong-password") {
                        passwordError.textContent = "Incorrect password.";
                    } else {
                        passwordError.textContent = "Invalid email or password.";
                    }
                });
        }
    });

      // Handle registration link click
      registrationLink.addEventListener('click', () => {
        window.location.href = 'register.html'; // Redirect to the register page
    });

    btn_ok.addEventListener('click', () => {
        loginContainer.classList.remove('blurred');
        popup.style.display = 'none';
        emailInput.value = '';  // Clear email input
        passwordInput.value = '';  // Clear password input
    });

});