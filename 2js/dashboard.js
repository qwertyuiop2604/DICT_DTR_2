import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Function to construct the full name and set it in the input field
async function setUserName() {
  const user = auth.currentUser;

  if (user) {
    // Get the employeeId from the authenticated user (assuming it's stored in the user's metadata or custom claims)
    const employeeId = user.uid; // Using user.uid as the employeeId (adjust if needed)

    // Query the "users" collection where the employeeId field matches the user's employeeId
    const q = query(collection(db, "users"), where("employeeId", "==", employeeId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0]; // Assume there's only one document per employeeId
      const userData = userDoc.data();

      // Construct the full name (first name + middle name + last name + extension)
      let fullName = userData.firstName + " " + userData.middleName + " " + userData.lastName;
      if (userData.extensionName) {
        fullName += " " + userData.extensionName;
      }

      // Set the input field value (making it readonly)
      document.getElementById('name').value = fullName;
    } else {
      console.log('No user document found with the given employeeId');
    }
  } else {
    console.log('No user is logged in');
  }
}

// Listen for authentication state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Set the user's name in the input field
    setUserName();
  } else {
    console.log('No user is logged in');
  }
});

// Dashboard script to get user details using employeeId
document.addEventListener("DOMContentLoaded", async function () {
    // Get employeeId from sessionStorage
    const employeeId = sessionStorage.getItem("employeeId");

    if (employeeId) {
        const userDocRef = doc(db, "users", employeeId);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            // Construct the full name
            let fullName = `${userData.firstName} ${userData.middleName} ${userData.lastName}`;
            if (userData.extensionName) {
                fullName += ` ${userData.extensionName}`;
            }

            // Set the full name in the readonly input field
            document.getElementById('name').value = fullName;
        } else {
            console.log("No user document found for this employeeId.");
        }
    } else {
        console.log("No employeeId found in sessionStorage.");
    }
});
