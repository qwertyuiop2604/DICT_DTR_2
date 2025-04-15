import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, query, where, getDocs, collection, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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
      let fullName = userData.firstname + " " + userData.middlename + " " + userData.lastname;
      if (userData.extensionname) {
        fullName += " " + userData.extensionname;
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
      const userDocRef = doc(db, "users", user.uid);


        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
            const userData = docSnap.data();

            // Construct the full name
            let fullName = `${userData.firstname} ${userData.middlename} ${userData.lastname}`;
            if (userData.extensionname) {a
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

async function recordTime(type) {
  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  // Use user.uid as the document ID to get the user's data from the "users" collection
  const userDocRef = doc(db, "users", user.uid); // Document ID is user.uid
  const userDocSnap = await getDoc(userDocRef);

  // Check if user document exists
  if (!userDocSnap.exists()) {
    return alert("User not found in users collection");
  }

  // Retrieve the employeeId from the document
  const userData = userDocSnap.data();
  const employeeId = userData.employeeId;  // This is the field you need

  console.log("Employee ID from users collection:", employeeId);  // Logs the employeeId

  // Now proceed with your DTR logic...

  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = now.toTimeString().substring(0, 5); // "HH:MM"
  const year = now.getFullYear().toString();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // e.g., "04"
  const day = String(now.getDate()).padStart(2, '0');        // e.g., "14"

  let field = "";

  // Define time ranges and assign field
  if (type === "in") {
    if (currentHour >= 7 && currentHour <= 11) field = "amIn";
    else if (currentHour === 12 && currentMinute <= 30) field = "amOut";
    else if (currentHour === 12 && currentMinute > 30 || currentHour === 13 && currentMinute <= 0) field = "pmIn";
    else if (currentHour >= 13 && currentHour < 18) field = "pmOut";
    else return alert("Invalid Time In range");
  }

  if (type === "out") {
    if (currentHour === 12 && currentMinute <= 30) field = "amOut";
    else if ((currentHour === 13 && currentMinute >= 1) || currentHour >= 14 && currentHour <= 18) field = "pmOut";
    else return alert("Invalid Time Out range");
  }

  // Use employeeId to reference the DTR document for that user
  const dtrRef = doc(db, "dtrs", employeeId, year, month);

  const dtrSnap = await getDoc(dtrRef);
  let records = {};

  if (dtrSnap.exists()) {
    records = dtrSnap.data().records || {};
  }

  if (!records[day]) records[day] = {};
  if (records[day][field]) {
    return alert(`${field} already recorded as ${records[day][field]}`);
  }

  records[day][field] = currentTime;

  await setDoc(dtrRef, {
    year: parseInt(year),
    month: parseInt(month),
    records: records
  }, { merge: true });

  alert(`${field} recorded at ${currentTime}`);
}


// Make recordTime globally available
window.recordTime = recordTime;
