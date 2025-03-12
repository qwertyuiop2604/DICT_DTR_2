


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

function showModal(message) {
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('timeModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('timeModal').style.display = 'none';
}

function displayLog() {
    let logData = localStorage.getItem('timeLog');
    logData = logData ? JSON.parse(logData) : [];

    if (logData.length === 0) {
        document.getElementById('log').innerText = "No records yet";
        return;
    }

    let logHTML = "";
    logData.forEach((entry, index) => {
        logHTML += `<div><strong>${index + 1}. ${entry.name}</strong> (ID: ${entry.employeeNumber}) - ${entry.action}: ${entry.time}</div>`;
    });

    document.getElementById('log').innerHTML = logHTML;
}

function clearLog() {
    if (confirm("Are you sure you want to clear all records?")) {
        localStorage.removeItem('timeLog');
        displayLog();
    }
}

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

window.onload = displayLog;
