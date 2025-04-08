import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { PDFDocument, rgb, StandardFonts } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm';

const firebaseConfig = {
  apiKey: "AIzaSyAWnrqJZ3ih5ZVwm8kmTW6VPW1WHzuSe98",
  authDomain: "dict-dtr.firebaseapp.com",
  projectId: "dict-dtr",
  storageBucket: "dict-dtr.appspot.com",
  messagingSenderId: "813571675102",
  appId: "1:813571675102:web:c985fef4b1bac2c4f2c34f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersCollection = collection(db, "users");
const tableBody = document.getElementById("accounts-table-body");


async function loadUsers() {
  const querySnapshot = await getDocs(usersCollection);
  tableBody.innerHTML = ""; // Clear table

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    const empNo = data.employeeId || "N/A";
    const firstName = data.firstname || "";
    const middleName = data.middlename ? ` ${data.middlename}` : "";
    const lastName = data.lastname || "";
    const extName = data.extensionname ? ` ${data.extensionname}` : "";

    const fullName = `${firstName}${middleName} ${lastName}${extName}`.trim();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td><input type="checkbox" class="select-checkbox"></td>
      <td>${empNo}</td>
      <td>${fullName}</td>
      <td>
        <button class="table-btn"><i class="fa fa-file-excel"></i></button>
        <button class="table-btn pdf-btn" data-username="${fullName}"><i class="fa fa-file-pdf"></i></button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Attach PDF generation to buttons
  document.querySelectorAll('.pdf-btn').forEach(button => {
    button.addEventListener('click', async () => {
      const username = button.getAttribute('data-username') || 'Timesheet';
      const pdfBytes = await createTimeSheetPDF();

      // Download PDF
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${username.replace(/\s+/g, '_')}_DTR.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });
}




async function createTimeSheetPDF(username = "Employee Name") {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 1000]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 960;

  // CS FORM 48 (top right)
  page.drawText("CS FORM 48", {
    x: 700,
    y,
    font,
    size: 10,
  });

  // Title: DAILY TIME RECORD (centered)
  y -= 40;
  page.drawText("DAILY TIME RECORD", {
    x: 280,
    y,
    font,
    size: 14,
  });

  // Employee Name (centered with line below)
  y -= 30;
  page.drawText(username.toUpperCase(), {
    x: 250,
    y,
    font,
    size: 12,
  });

  // (NAME) label under name
  y -= 15;
  page.drawText("( NAME )", {
    x: 330,
    y,
    font,
    size: 10,
  });

  // For the month of / Official hours
  y -= 40;
  page.drawText("For the month of", {
    x: 50,
    y,
    font,
    size: 10,
  });

  page.drawText("February 1-15, 2025", {
    x: 180,
    y,
    font,
    size: 10,
  });

  y -= 20;
  page.drawText("Official hours for ARRIVALS and DEPARTURES", {
    x: 50,
    y,
    font,
    size: 10,
  });

  y -= 20;
  page.drawText("REGULAR DAYS: Monday – Friday (Flexi Time)", {
    x: 50,
    y,
    font,
    size: 10,
  });

  // === DTR Table Start ===
  const tableX = 50;
  const tableY = y - 30;
  const rowHeight = 25;
  const columnWidths = [40, 60, 60, 60, 60, 80, 60]; // Day, AM IN, etc.
  const headers = ['Day', 'AM IN', 'AM OUT', 'PM IN', 'PM OUT', 'UNDERTIME', 'TOTAL'];

  let currentX = tableX;
  headers.forEach((header, i) => {
    page.drawRectangle({
      x: currentX,
      y: tableY,
      width: columnWidths[i],
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    page.drawText(header, {
      x: currentX + 5,
      y: tableY + 7,
      font,
      size: 10,
    });
    currentX += columnWidths[i];
  });

  for (let i = 1; i <= 15; i++) { // For Feb 1-15
    let rowY = tableY - i * rowHeight;
    let x = tableX;

    columnWidths.forEach((width, colIndex) => {
      page.drawRectangle({
        x,
        y: rowY,
        width,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      if (colIndex === 0) {
        page.drawText(String(i), {
          x: x + 5,
          y: rowY + 7,
          font,
          size: 10,
        });
      }

      x += width;
    });
  }

  return await pdfDoc.save();
}

loadUsers();