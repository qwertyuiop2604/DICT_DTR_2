import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
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
const db = getFirestore(app);

// Function to generate a random userId (Document ID)
function generateRandomUserId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 28; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

document.addEventListener('DOMContentLoaded', function () {
    const employeeId = document.getElementById('EmployeeId');
    const lastname = document.getElementById('LastName');
    const firstname = document.getElementById('FirstName');
    const middlename = document.getElementById('MiddleName');
    const extensionname = document.getElementById('Extensionname');
    const email = document.getElementById('Email');
    const positionSelect = document.getElementById('Position');
    const saveBtn = document.getElementById('save');
    const popup = document.querySelector('.popup'); // Ensure this is in the HTML
    const addpersonnel = document.querySelector('.container'); 

    // Initially hide the popup container
    popup.style.display = 'none';

    // Populate the Position select dropdown with options
    const positions = [
        "Manager", "Engineer", "Assistant", "Secretary", "Sales", "Technician", "HR", "Accountant"
    ];
    positions.forEach(position => {
        const option = document.createElement('option');
        option.value = position;
        option.textContent = position;
        positionSelect.appendChild(option);
    });

  // Event listeners to clear error messages
const inputs = [employeeId, lastname, firstname, middlename, extensionname, email, positionSelect];

inputs.forEach(input => {
    input.addEventListener('input', () => {
        document.getElementById(`${input.id}Error`).textContent = '';
    });
});


    saveBtn.addEventListener('click', async function (e) {
        e.preventDefault(); // Prevent form submission

        
        // Generate a random userId
        const userId = generateRandomUserId();

        // Get values from the form
        const employeeIdValue = employeeId.value.trim();
        const firstnameValue = firstname.value.trim();
        const middlenameValue = middlename.value.trim();
        const lastnameValue = lastname.value.trim();
        const extensionnameValue = extensionname.value.trim();
        const emailValue = email.value.trim();
        const positionValue = positionSelect.value.trim();

        

        // Validation checks
        let hasError = false;
        if (!employeeIdValue) document.getElementById('EmployeeIdError').textContent = "Employee Id is required.", hasError = true;
        if (!firstnameValue) document.getElementById('FirstNameError').textContent = "First Name is required.", hasError = true;
        if (!lastnameValue)  document.getElementById('LastNameError').textContent = "Last Name is required.", hasError = true;
        if (!emailValue)  document.getElementById('EmailError').textContent = "Email is required.",hasError = true;
        if (!positionValue) document.getElementById('PositionError').textContent = "Position is required",hasError = true;
        if (!middlenameValue) document.getElementById('MiddleNameError').textContent = "Middle Name is required", hasError = true;
        if (hasError) return; // Stop execution if there are validation errors

        try {

            // Store personnel data in Firestore
            const docRef = await setDoc(doc(db, "personnel", userId ), {  // Using email as the document ID
                firstName: firstnameValue,
                lastName: lastnameValue,
                middleName: middlenameValue,
                extensionName: extensionnameValue,
                position: positionValue,
                email: emailValue,
                userId: userId,
                createdAt: new Date(),
            });

            console.log("Personnel data stored in Firestore!");

            // Show success popup
            addpersonnel.classList.add('blurred'); // Add blur effect to the form container
            popup.style.display = 'block'; // Show the popup

        } catch (error) {
            console.error("Error storing personnel data:", error.message);
            document.getElementById('EmailError').textContent = error.message;
        }
    });

    // Event listener to close the popup
    const btn_ok = document.getElementById('btn_ok'); // Ensure you have a button with this ID
    btn_ok.addEventListener('click', () => {
        addpersonnel.classList.remove('blurred');
        popup.style.display = 'none';
        inputs.forEach(input => input.value = ''); // Reset all input fields
    });
});