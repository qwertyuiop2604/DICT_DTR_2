import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAWnrqJZ3ih5ZVwm8kmTW6VPW1WHzuSe98",
  authDomain: "dict-dtr.firebaseapp.com",
  projectId: "dict-dtr",
  storageBucket: "dict-dtr.appspot.com",
  messagingSenderId: "813571675102",
  appId: "1:813571675102:web:c985fef4b1bac2c4f2c34f"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get user ID from URL
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("userId");

const fields = {
  employeeId: document.getElementById("employeeId"),
  firstname: document.getElementById("firstname"),
  middlename: document.getElementById("middlename"),
  lastname: document.getElementById("lastname"),
  extensionname: document.getElementById("extensionname"),
  email: document.getElementById("email"),
  position: document.getElementById("position"),
  usertype: document.getElementById("usertype")
};

// Auto-fill form on load
async function loadUserData() {
  if (!userId) return;

  const userRef = doc(db, "users", userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    fields.employeeId.value = data.employeeId || "";
    fields.firstname.value = data.firstname || "";
    fields.middlename.value = data.middlename || "";
    fields.lastname.value = data.lastname || "";
    fields.extensionname.value = data.extensionname || "N/A";
    fields.email.value = data.email || "";
    fields.position.value = data.position || "";
    fields.usertype.value = data.userType || "";
    fields.employeeId.readOnly = true; // Prevent editing
  } else {
    alert("User not found.");
  }
}

document.addEventListener("DOMContentLoaded", loadUserData);

const popupSuccess = document.getElementById("popup");
const popupError = document.getElementById("popup_error");
const closePopupBtn = document.getElementById("closePopupBtn");
const closePopupErrorBtn = document.getElementById("closePopup_error");

// Close buttons
closePopupBtn.addEventListener("click", () => {
  popupSuccess.style.display = "none";
});

closePopupErrorBtn.addEventListener("click", () => {
  popupError.style.display = "none";
});

// Update Button: When user clicks update
document.getElementById("updateBtn").addEventListener("click", async () => {
  if (!userId) return;

  const userRef = doc(db, "users", userId);

  // Gather input values
  const employeeId = fields.employeeId.value.trim();
  const firstname = fields.firstname.value.trim();
  const middlename = fields.middlename.value.trim();
  const lastname = fields.lastname.value.trim();
  const extensionname = fields.extensionname.value.trim();
  const email = fields.email.value.trim();
  const position = fields.position.value;
  const usertype = fields.usertype.value;

  // Basic validation
  if (!employeeId || !firstname || !lastname || !email || !position || !usertype) {
    popupError.style.display = "flex";
    return;
  }

  try {
    await updateDoc(userRef, {
      firstname: firstname,
      middlename: middlename,
      lastname: lastname,
      extensionname: extensionname,
      email: email,
      position: position,
      userType: usertype
    });

    // Show success popup
    popupSuccess.style.display = "flex";

    // Optionally redirect or close after a few seconds
    setTimeout(() => {
      window.location.href = "/1html/user_accounts.html"; // redirect to list
    }, 2000);

  } catch (error) {
    console.error("Error updating user:", error);
    popupError.style.display = "flex";
  }
});
