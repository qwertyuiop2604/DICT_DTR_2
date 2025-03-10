import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

console.log("Firebase initialized successfully!");

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
                    // Successful login
                    alert("Login successful!");
                    console.log("User logged in:", userCredential.user);
                    window.location.href = "dashboard.html"; // Redirect to another page
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
});
