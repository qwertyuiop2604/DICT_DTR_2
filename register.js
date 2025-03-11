import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification  } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.querySelector('.Log_in_Container');
    const firstnameInput = document.getElementById('FirstName');
    const lastnameInput = document.getElementById('LastName');
    const emailInput = document.getElementById('Email');
    const passwordInput = document.getElementById('Password');
    const confirmPasswordInput = document.getElementById('ConfirmPassword');
    const registerButton = document.getElementById('register');
    const Login = document.getElementById('LOGIN_btn');
    const btn_ok = document.getElementById('btn_ok');
    const popup = document.querySelector('.popup');
    const body = document.querySelector('body');

    // Initially hide the popup container
    popup.style.display = 'none';

    // Event listeners to clear error messages
    const inputs = [firstnameInput, lastnameInput, emailInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            document.getElementById(`${input.id}Error`).textContent = '';
        });
    });

    registerButton.addEventListener('click', async function (e) {
        e.preventDefault(); // Prevent form submission

        // Get values from the form
        const firstname = firstnameInput.value.trim();
        const lastname = lastnameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validation checks
        let hasError = false;
        if (!firstname) document.getElementById('FirstNameError').textContent = "First Name is required.", hasError = true;
        if (!lastname) document.getElementById('LastNameError').textContent = "Last Name is required.", hasError = true;
        if (!email) document.getElementById('EmailError').textContent = "Email is required.", hasError = true;
        if (!password) document.getElementById('PasswordError').textContent = "Password is required.", hasError = true;
        if (password !== confirmPassword) document.getElementById('ConfirmPasswordError').textContent = "Passwords do not match.", hasError = true;
        if (password.length < 6) document.getElementById('PasswordError').textContent = "Password should be at least 6 characters long.", hasError = true;

        if (hasError) return; // Stop execution if there are validation errors

        try {
            // Register user with Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user profile (optional)
            await updateProfile(user, { displayName: `${firstname} ${lastname}` });
            await sendEmailVerification(user);

            // Store user data in Firestore
            await setDoc(doc(db, "users", user.uid), {
                firstName: firstname,
                lastName: lastname,
                email: email,
                userId: user.uid, // Store user ID for reference
                createdAt: new Date()
            });

            console.log("User registered and data stored in Firestore!");

            // Show popup and clear form
            
            registrationForm.classList.add('blurred');
            popup.style.display = 'block';

        } catch (error) {
            console.error("Registration Error:", error.message);
            document.getElementById('EmailError').textContent = error.message;
        }
    });

    // Event listeners for buttons
    Login.addEventListener('click', () => alert("Going to login page"));
    btn_ok.addEventListener('click', () => {
        registrationForm.classList.remove('blurred');
        popup.style.display = 'none';
        inputs.forEach(input => input.value = '');
    });
});
