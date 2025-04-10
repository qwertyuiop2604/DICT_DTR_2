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
  const page = pdfDoc.addPage([3.9 * 72, 8.5 * 72]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontbold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let y = 590;

  const text = "CS FORM 48";
  const textWidth1 = font.widthOfTextAtSize(text, 7);
  const pageWidth = page.getWidth();

  page.drawText(text, {
    x: pageWidth - textWidth1 - 10,
    y,
    font,
    size: 7,
  });
  
  y -= 25;

  const titleText = "DAILY TIME RECORD";
  const titleTextWidth = fontbold.widthOfTextAtSize(titleText, 9);
  page.drawText(titleText, {
    x: (pageWidth - titleTextWidth) / 2,
    y,
    font: fontbold,
    size: 9,
  });
  
  y -= 15;


 // Name (already correct)
const nameText = username.toUpperCase();
const nameTextWidth = fontbold.widthOfTextAtSize(nameText, 8);
page.drawText(nameText, {
  x: (pageWidth - nameTextWidth) / 2,
  y,
  font: fontbold,
  size: 8,
});

// Line under name
y -= 5;
const underlineText = "_____________________";
const underlineTextWidth = font.widthOfTextAtSize(underlineText, 8);
page.drawText(underlineText, {
  x: (pageWidth - underlineTextWidth) / 2,
  y,
  font,
  size: 8,
});

// (NAME) under the line
y -= 10;
const labelText = "(NAME)";
const labelTextWidth = font.widthOfTextAtSize(labelText, 6);
page.drawText(labelText, {
  x: (pageWidth - labelTextWidth) / 2,
  y,
  font,
  size: 6,
});


  y -= 25;
  page.drawText("For the month of", {
    x: 10,
    y,
    font,
    size: 6,
  });

  page.drawText("February 1-15, 2025", {
    x: 80,
    y,
    font: fontbold,
    size: 6,
  });

  y -= 10;
  page.drawText("Official hours for ARRIVALS and DEPARTURES", {
    x: 10,
    y,
    font,
    size: 6,
  });

  y -= 10;
  page.drawText("REGULAR DAYS: Monday - Friday (Flexi Time)", {
    x: 10,
    y,
    font,
    size: 6,
  });

  y -= 30;
  const tableX = 10;
  const tableY = y;
  const rowHeight = 12;

  const columnWidths = [24, 24, 24, 24, 24, 20, 20, 30, 30, 40]; // 50 for LEAVE TYPES
  const fontSize = 4.5;

  let x = tableX;

  page.drawRectangle({ x, y: tableY, width: columnWidths[0], height: rowHeight * 2, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("DAYS", { x: x + 3, y: tableY + 4,   font: fontbold, size: fontSize });
  x += columnWidths[0];

  page.drawRectangle({ x, y: tableY + rowHeight, width: columnWidths[1] + columnWidths[2], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("AM", { x: x + 18, y: tableY + rowHeight + 4, font: fontbold, size: fontSize });

  page.drawRectangle({ x, y: tableY, width: columnWidths[1], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("IN", { x: x + 8, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[1];

  page.drawRectangle({ x, y: tableY, width: columnWidths[2], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("OUT", { x: x + 5, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[2];

  page.drawRectangle({ x, y: tableY + rowHeight, width: columnWidths[3] + columnWidths[4], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("PM", { x: x + 18, y: tableY + rowHeight + 4, font: fontbold, size: fontSize });

  page.drawRectangle({ x, y: tableY, width: columnWidths[3], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("IN", { x: x + 8, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[3];

  page.drawRectangle({ x, y: tableY, width: columnWidths[4], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("OUT", { x: x + 5, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[4];

  page.drawRectangle({ x, y: tableY + rowHeight, width: columnWidths[5] + columnWidths[6], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("Undertime", { x: x + 4, y: tableY + rowHeight + 4, font: fontbold, size: fontSize });

  page.drawRectangle({ x, y: tableY, width: columnWidths[5], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("HOURS", { x: x + 2, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[5];

  page.drawRectangle({ x, y: tableY, width: columnWidths[6], height: rowHeight, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("MINS", { x: x + 4, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[6];

  page.drawRectangle({ x, y: tableY, width: columnWidths[7], height: rowHeight * 2, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("Total", { x: x + 10, y: tableY + rowHeight + 4, font, size: fontSize });
  page.drawText("Hours AM", { x: x + 2, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[7];

  page.drawRectangle({ x, y: tableY, width: columnWidths[8], height: rowHeight * 2, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("Total", { x: x + 10, y: tableY + rowHeight + 4, font: fontbold, size: fontSize });
  page.drawText("Hours PM", { x: x + 2, y: tableY + 4, font: fontbold, size: fontSize });
  x += columnWidths[8];

  page.drawRectangle({ x, y: tableY, width: columnWidths[9], height: rowHeight * 2, borderColor: rgb(0, 0, 0), borderWidth: 1 });
  page.drawText("TOTAL", { x: x + 12, y: tableY + rowHeight + 4, font: fontbold, size: fontSize });
  page.drawText("NO. OF HOURS", { x: x + 2, y: tableY + 4, font: fontbold, size: fontSize });




  const data = {
    3: ["", "", "4:00", "4:00", "4", "0", "8:00"],
    4: ["12:01 ", "12:34 PM", "", "", "4:02", "4:19", "8:21"],
    6: ["12:11 ", "12:38 PM", "", "", "4:06", "4:08", "8:14"],
    7: ["12:22 ", "12:43 PM", "", "", "4:14", "4:05", "8:19"],
    10: ["12:08 PM", "12:34 PM", "", "", "4:23", "4:05", "8:28"],
    11: ["12:03 PM", "12:44 PM", "", "", "4:01", "4:07", "8:08"],
    12: ["12:11 PM", "12:45 PM", "", "", "4:10", "4:11", "8:21"],
    13: ["12:16 PM", "12:37 PM", "", "", "4:01", "4:10", "8:11"],
    14: ["12:03 PM", "12:50 PM", "", "", "4:03", "4:06", "8:09"],
    17: ["12:04 PM", "12:35 PM", "", "", "4:13", "4:31", "8:44"],
    18: ["12:06 PM", "12:28 PM", "", "", "4:27", "4:50", "9:17"],
    19: ["12:07 PM", "12:29 PM", "", "", "4:17", "4:47", "9:04"],
    20: ["12:07 PM", "12:19 PM", "", "", "4:23", "4:57", "9:20"],
    23: ["12:04 PM", "12:29 PM", "", "", "4:27", "4:24", "8:51"],
    26: ["12:07 PM", "12:47 PM", "", "", "4:32", "4:15", "8:47"],
    27: ["12:19 PM", "12:39 PM", "", "", "4:23", "4:08", "8:31"],
  };

  for (let i = 1; i <= 31; i++) {
    const rowY = tableY - i * rowHeight;
    let x = tableX;
    const row = data[i] || ["", "", "", "", "", "", "", ""];

    columnWidths.forEach((width, colIndex) => {
      page.drawRectangle({
        x,
        y: rowY,
        width,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      let text = colIndex === 0 ? String(i) : row[colIndex - 1] || "";

      page.drawText(text, {
        x: x + 2,
        y: rowY + 4,
        font,
        size: 5,
      });

      x += width;
    });
  }

  // After the Day 31 entries
const leaveTypes = ["VL", "T/UT", "PL/SPL", "SL"];
let leaveY = y - 10; // adjust this depending on spacing

leaveTypes.forEach((type, index) => {
  page.drawText(type, {
    x: 350, // adjust X position depending on your table's location
    y: leaveY,
    size: 8,
    font,
  });
  leaveY -= 12;
});


// Draws the footer on the given PDF page
function drawFooter({ page, font, fontbold, pageWidth, leaveY }) {
  let y;

  // Certification text
  const certText =
    "I certify on my honor that the above is true and correct report of the hours of work performed. Record of which was made daily at the time of arrival and departure from office.";
  const certFontSize = 8;
  const certTextWidth = font.widthOfTextAtSize(certText, certFontSize);

  y = leaveY - 20;
  page.drawText(certText, {
    x: 40, // left padding
    y,
    size: certFontSize,
    font,
    maxWidth: pageWidth - 80,
    lineHeight: 10,
  });

  // Helper function to center text
  const centerX = (text, size, font) =>
    (pageWidth - font.widthOfTextAtSize(text, size)) / 2;

  // First signature block (Mary Joy)
  y -= 60;

  const sigName1 = "MARY JOY D. SOLIVEN";
  const sigFontSize = 8;
  const sigNameWidth1 = fontbold.widthOfTextAtSize(sigName1, sigFontSize);
  const sigX1 = (pageWidth - sigNameWidth1) / 2;

  // Signature line
  page.drawLine({
    start: { x: sigX1 - 10, y: y + 12 },
    end: { x: sigX1 + sigNameWidth1 + 10, y: y + 12 },
    thickness: 0.5,
  });

  // Name
  page.drawText(sigName1, {
    x: sigX1,
    y,
    font: fontbold,
    size: sigFontSize,
  });

  // Label
  y -= 12;
  const label1 = "(Signature of official or employee)";
  page.drawText(label1, {
    x: centerX(label1, 6, font),
    y,
    font,
    size: 6,
  });

  // Verification text
  y -= 15;
  const verifyText = "Verified as to the prescribed office hours.";
  page.drawText(verifyText, {
    x: centerX(verifyText, 6, font),
    y,
    font,
    size: 6,
  });

  // Second signature block (Jonathan)
  y -= 40;

  const sigName2 = "JONATHAN VON A. RABOT";
  const sigNameWidth2 = fontbold.widthOfTextAtSize(sigName2, sigFontSize);
  const sigX2 = (pageWidth - sigNameWidth2) / 2;

  // Signature line
  page.drawLine({
    start: { x: sigX2 - 10, y: y + 12 },
    end: { x: sigX2 + sigNameWidth2 + 10, y: y + 12 },
    thickness: 0.5,
  });

  // Name
  page.drawText(sigName2, {
    x: sigX2,
    y,
    font: fontbold,
    size: sigFontSize,
  });

  // Position/title
  y -= 12;
  const position2 = "OIC, Ilocos Sur Provincial Head";
  page.drawText(position2, {
    x: centerX(position2, 6, font),
    y,
    font,
    size: 6,
  });
}



  return await pdfDoc.save();
}




loadUsers();