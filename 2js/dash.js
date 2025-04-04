<<<<<<< HEAD
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
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

// Function to record time
=======



>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
function recordTime(type) {
    const name = document.getElementById('name').value.trim();
    const employeeNumber = document.getElementById('employeeNumber').value.trim();
    
    if (!name || !employeeNumber) {
        alert('Please enter both your name and employee number before proceeding.');
        return;
    }

    const now = new Date();
    const timeString = now.toLocaleString();
    
    let logData = localStorage.getItem('timeLog');
    logData = logData ? JSON.parse(logData) : [];
    logData.push({ name, employeeNumber, action: type.toUpperCase(), time: timeString });
    localStorage.setItem('timeLog', JSON.stringify(logData));

    displayLog();
    showModal(`${type.toUpperCase()} RECORDED AT: ${timeString}`);
}

<<<<<<< HEAD
// Expose function globally
window.recordTime = recordTime;

=======
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
function showModal(message) {
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('timeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('timeModal').style.display = 'none';
}

<<<<<<< HEAD
// Expose function globally
window.closeModal = closeModal;

=======
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
function displayLog() {
    let logData = localStorage.getItem('timeLog');
    logData = logData ? JSON.parse(logData) : [];

    if (logData.length === 0) {
        document.getElementById('log').innerText = "No records yet";
        return;
    }

    let logHTML = "";
    logData.forEach((entry, index) => {
<<<<<<< HEAD
        logHTML += `<div><strong>${index + 1}. ${entry.name} (ID: ${entry.employeeNumber})</strong> - ${entry.action}: ${entry.time}</div>`;
=======
        logHTML += `<div><strong>${index + 1}. ${entry.name}</strong> (ID: ${entry.employeeNumber}) - ${entry.action}: ${entry.time}</div>`;
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
    });

    document.getElementById('log').innerHTML = logHTML;
}

<<<<<<< HEAD
window.onload = displayLog;

=======
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
function clearLog() {
    if (confirm("Are you sure you want to clear all records?")) {
        localStorage.removeItem('timeLog');
        displayLog();
    }
}

<<<<<<< HEAD
// Dropdown button event listener
=======
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
document.querySelectorAll(".dropdown-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
        this.parentElement.classList.toggle("active");
    });
});

// Function to handle export
function exportFile(format) {
    if (format === "excel") {
        exportToExcel();
    } else if (format === "pdf") {
        exportToPDF();
    }
    document.querySelector(".custom-dropdown").classList.remove("active");
}

<<<<<<< HEAD
// Expose function globally
window.exportFile = exportFile;

=======
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
function exportToExcel() {
    let logData = localStorage.getItem('timeLog');
    logData = logData ? JSON.parse(logData) : [];

    if (logData.length === 0) {
        alert("No records to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,No.,Name,Employee Number,Action,Time\n";
    logData.forEach((entry, index) => {
        csvContent += `${index + 1},${entry.name},${entry.employeeNumber},${entry.action},${entry.time}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TimeLog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let logData = localStorage.getItem('timeLog');
    logData = logData ? JSON.parse(logData) : [];

    if (logData.length === 0) {
        alert("No records to export.");
        return;
    }

    // Load image from local storage (or base64 if needed)
    const img = new Image();
    img.src = "/images/logo.png"; // Ensure the image is accessible

    img.onload = function () {
        doc.addImage(img, 'PNG', 10, 10, 40, 20);
        doc.text("Daily Time Record", 80, 20);
        doc.line(10, 25, 200, 25);

        let y = 40;
        logData.forEach((entry, index) => {
            doc.text(`${index + 1}. ${entry.name} | ${entry.employeeNumber} | ${entry.action} | ${entry.time}`, 10, y);
            y += 7;
        });

        doc.save("TimeLog.pdf");
    };
}

<<<<<<< HEAD
// Function to fetch user data from Firestore
async function fetchUserData(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            console.log("User Data:", userData);

            // Populate only the 'name' input field
            document.getElementById('name').value = `${userData.firstName} ${userData.lastName}`;
        } else {
            console.log("No user found in Firestore!");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}
=======
window.onload = displayLog;
>>>>>>> 9386fb55e03ec3a6d4e9bc1ef5d191472ecdd08b
