import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDocs, setDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
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

async function fetchUserAccounts() {
    const tableBody = document.getElementById("accounts-table-body");
    tableBody.innerHTML = ""; // Clear previous entries

    try {
        const usersCollection = collection(db, "users"); // ✅ Correct Firestore v9+ syntax
        const querySnapshot = await getDocs(usersCollection);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const row = `
                <tr>
                    <td>${data.employeeNo || 'N/A'}</td>
                    <td>${data.lastName || 'N/A'}</td>
                    <td>${data.firstName || 'N/A'}</td>
                    <td>${data.position || 'N/A'}</td>
                    <td>${data.status || 'N/A'}</td>
                    <td>
                        <button class="edit">Edit</button>
                        <button class="remove">Remove</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

// Fetch data on page load
window.onload = fetchUserAccounts;