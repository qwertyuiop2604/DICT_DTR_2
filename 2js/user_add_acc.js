import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const closePopupBtn = document.getElementById("closePopupBtn"); // Correctly selects the success popup button

  const popup_error = document.getElementById("popup_error");
  const closePopupErrorBtn = document.getElementById("closePopup_error"); // Correctly selects the error popup button

  
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form field elements
    const employeeId = document.getElementById("employeeId");
    const firstname = document.getElementById("firstname");
    const middlename = document.getElementById("middlename");
    const lastname = document.getElementById("lastname");
    const extensioname = document.getElementById("extensionname");
    const email = document.getElementById("email");
    const password = "TemporaryPassword123"; // You can replace this with a generated or user-defined password.
    const position = document.getElementById("position");
    const usertype = document.getElementById("usertype");
    

    // Helper function to show error
    const showError = (input, errorId, message) => {
      const errorElement = document.getElementById(errorId);

      if (!input.value.trim()) {
        errorElement.textContent = message;
        errorElement.style.display = "block";
        input.classList.add("input-error"); // Highlight input with error
        return true;
      } else {
        errorElement.textContent = "";
        errorElement.style.display = "none";
        input.classList.remove("input-error"); // Remove error highlight
        return false;
      }
    };

    // Initialize error flag
    let hasError = false;

    // Validate fields
    hasError |= showError(employeeId, "EmployeeIdError", "Employee Number cannot be blank.");
    hasError |= showError(firstname, "FirstNameError", "First Name cannot be blank.");
    hasError |= showError(middlename, "MiddleNameError", "Middle Name cannot be blank.");
    hasError |= showError(lastname, "LastNameError", "Last Name cannot be blank.");
    hasError |= showError(email, "EmailError", "Email cannot be blank.");
    hasError |= showError(position, "PositionError", "Position cannot be blank.");
    hasError |= showError(usertype, "UsertypeError", "User Type cannot be blank");

    // Stop if validation fails
    if (hasError) return;

    // Form is valid, collect data
    const formData = {
      employeeId: employeeId.value.trim(),
      firstname: firstname.value.trim(),
      middlename: middlename.value.trim(),
      lastname: lastname.value.trim(),
      extensioname:extensioname.value.trim(),
      email: email.value.trim(),
      position: position.value.trim(),
      usertype: usertype.value.trim(),
      status: "Pending"
    };

    console.log("Form submitted successfully:", formData);

    try {
      await createUserWithEmailAndPassword(auth, formData.email, password);

// Send email verification
const user = auth.currentUser;
if (user) {
  await sendEmailVerification(user);
  console.log("Verification email sent.");
}

const userDoc = doc(collection(db, "users"), formData.employeeId);
await setDoc(userDoc, formData);


      console.log("User created and data saved successfully!");
      popup.classList.add("active");
      form.reset();
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        popup_error.classList.add('active');

      } 
      else {
        console.error("Error saving user data:", error);
        alert("An error occurred while saving user data. Please try again.");
      }
    }
  });

  closePopupBtn.addEventListener("click", () => {
    popup.classList.remove("active"); // Hide the popup when "OK" is clicked
  });

  closePopupErrorBtn.addEventListener("click", () => {
    popup_error.classList.remove("active");
  });
  
});