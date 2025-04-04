    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
    import { getFirestore, doc, getDocs, updateDoc, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

    

    document.querySelector('.add-account').addEventListener('click', function() {
    window.location.href = `/1html/user_update_acc.html?id=${employeeId}`;
    });

    function formatFullName(firstname, middlename, lastname, extensionname) {
        const ln = lastname || "";
        const fn = firstname || "";
        const mn = middlename || "";
        const en = extensionname ? `, ${extensionname}` : "";
        return `${fn} ${mn} ${ln}${en}`.trim();
    }
    
    
    async function fetchUserAccounts() {
        const tableBody = document.getElementById("accounts-table-body");
        tableBody.innerHTML = ""; 

        try {
            const usersCollection = collection(db, "users");
            const querySnapshot = await getDocs(usersCollection);

            querySnapshot.forEach((docSnapshot) => {
                const data = docSnapshot.data();
                const userId = docSnapshot.id;

                // If user is deactivated, do not display them
                if (data.status === "Deactivated") return; 

                let userStatus = "Pending"; 

                // Check if the authenticated user is in Firestore
                if (
                    auth.currentUser &&
                    auth.currentUser.email === data.email &&
                    auth.currentUser.emailVerified
                ) {
                    userStatus = "Active";
                }
                

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${data.employeeId || 'N/A'}</td>
                    <td>${formatFullName(data.firstname, data.middlename, data.lastname, data.extensionname )}</td>
                    <td>${data.position || 'N/A'}</td>
                    <td>${data.email || 'N/A'}</td>
                    <td class="user-status">${userStatus}</td>
                    <td>
                        <button class="edit" data-user-id="${userId}"><i class="fas fa-edit"></i></button>
                        <button class="remove" data-user-id="${userId}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Attach remove event listeners
            attachRemoveEventListeners();

        } catch (error) {
            console.error("Error fetching users:", error);
        
        }
        
        attachEditEventListeners();
    }

    function attachEditEventListeners() {
        document.querySelectorAll(".edit").forEach((button) => {
            button.addEventListener("click", (event) => {
                const userId = event.target.closest("button").getAttribute("data-user-id");
                window.location.href = `/1html/user_update_acc.html?userId=${userId}`;
            });
        });
    }
    

    // Function to show deactivation success popup
    function showDeactivationSuccessPopup() {
        const successPopup = document.getElementById("d_success");
        successPopup.classList.add("active"); // Show the popup
    }

    // Function to close the success popup
    function closeD_Success() {
        const successPopup = document.getElementById("d_success");
        successPopup.classList.remove("active");
    }

    // Function to deactivate user
    async function deactivateUser(userId) {
        try {
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: "Deactivated" });

            // Hide row from table
            const row = document.querySelector(`button[data-user-id='${userId}']`).closest("tr");
            row.style.display = "none"; 

            console.log(`User ${userId} deactivated.`);
            
            // Show success popup after deactivation
            showDeactivationSuccessPopup();
        } catch (error) {
            console.error("Error deactivating user:", error);
        }
    }

    // Attach event listener to success popup OK button
    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#d_success button").addEventListener("click", closeD_Success);
    });


    // Show the popup when the remove button is clicked
    function attachRemoveEventListeners() {
        document.querySelectorAll(".remove").forEach((button) => {
            button.addEventListener("click", (event) => {
                const userId = event.target.closest("button").getAttribute("data-user-id");
                showPopupDeactivate(userId);
            });
        });
    }

    const popup_deactivate = document.getElementById('popup_deactivate');
    let currentUserId = null;

    function showPopupDeactivate(userId) {
        currentUserId = userId;
        popup_deactivate.classList.add('active');
    }

    function closePopupDeactivate() {
        popup_deactivate.classList.remove('active');
    }

    function deactivateAccount() {
        if (currentUserId) {
            deactivateUser(currentUserId);
            closePopupDeactivate();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.querySelector(".deactivate").addEventListener("click", deactivateAccount);
        document.querySelector(".cancel").addEventListener("click", closePopupDeactivate);
    });


    // Fetch data on page load
    window.onload = () => {
        auth.onAuthStateChanged(() => {
            fetchUserAccounts();
        });
    };
