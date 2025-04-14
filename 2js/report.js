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
      const pdfBytes = await createTimeSheetPDF(username);


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






async function createTimeSheetPDF(username) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([3.9 * 72, 10.5 * 72]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontbold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);


  // Starting Y offset
  let y = 730;
  const pageWidth = page.getWidth();


  // Top-right text: "CS FORM 48"
  const text = "CS FORM 48";
  const textWidth1 = font.widthOfTextAtSize(text, 7);
  page.drawText(text, {
    x: pageWidth - textWidth1 - 20,
    y,
    font,
    size: 7,
  });
  y -= 30;


  // Title: "DAILY TIME RECORD"
  const titleText = "DAILY TIME RECORD";
  const titleTextWidth = fontbold.widthOfTextAtSize(titleText, 9);
  page.drawText(titleText, {
    x: (pageWidth - titleTextWidth) / 2,
    y,
    font: fontbold,
    size: 9,
  });
  y -= 30;


  // Employee Name
  const nameText = username.toUpperCase();
  const nameTextWidth = fontbold.widthOfTextAtSize(nameText, 8);
  page.drawText(nameText, {
    x: (pageWidth - nameTextWidth) / 2,
    y,
    font: fontbold,
    size: 8,
  });


  // Underline below name
  y -= 5;
  const underlineText = "____________________________________";
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


  // Month and office hours info
  y -= 25;
  page.drawText(" For the month of", {
    x: 10,
    y,
    font,
    size: 6,
  });
  page.drawText(" February 1-15, 2025", {
    x: 80,
    y,
    font: fontbold,
    size: 6,
  });
  y -= 10;
  page.drawText(" Official hours for ARRIVALS and DEPARTURES", {
    x: 10,
    y,
    font,
    size: 6,
  });
  y -= 10;
  page.drawText(" REGULAR DAYS: Monday - Friday (Flexi Time)", {
    x: 10,
    y,
    font,
    size: 6,
  });


  // Set up table starting coordinates
  y -= 30;
  const tableX = 10;
  const tableY = y;
  const rowHeight = 12;
  const columnWidths = [24, 24, 24, 24, 24, 20, 20, 30, 30, 40];
  const fontSize = 4.5;

  // ------- Merged Row Above Table Header --------
const mergedHeaderHeight = 140;
const totalTableWidth1 = columnWidths.reduce((sum, w) => sum + w, 0);

// Draw merged rectangle
page.drawRectangle({
  x: tableX,
  y: tableY + rowHeight * 2, // above the two-row header
  width: totalTableWidth1,
  height: mergedHeaderHeight,
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});



  // ------- Draw Table Header --------


  let x = tableX;
  // Header for DAYS (spanning two rows)
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[0],
    height: rowHeight * 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("DAYS", {
    x: x + 3,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[0];


  // Header for AM (span two columns in two rows)
  page.drawRectangle({
    x,
    y: tableY + rowHeight,
    width: columnWidths[1] + columnWidths[2],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("AM", {
    x: x + 18,
    y: tableY + rowHeight + 4,
    font: fontbold,
    size: fontSize,
  });
  // AM IN
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[1],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("IN", {
    x: x + 8,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[1];


  // AM OUT
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[2],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("OUT", {
    x: x + 5,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[2];


  // Header for PM (span two columns in two rows)
  page.drawRectangle({
    x,
    y: tableY + rowHeight,
    width: columnWidths[3] + columnWidths[4],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("PM", {
    x: x + 18,
    y: tableY + rowHeight + 4,
    font: fontbold,
    size: fontSize,
  });
  // PM IN
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[3],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("IN", {
    x: x + 8,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[3];


  // PM OUT
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[4],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("OUT", {
    x: x + 5,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[4];


  // Header for Undertime (spanning two columns)
  page.drawRectangle({
    x,
    y: tableY + rowHeight,
    width: columnWidths[5] + columnWidths[6],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("Undertime", {
    x: x + 4,
    y: tableY + rowHeight + 4,
    font: fontbold,
    size: fontSize,
  });
  // Undertime HOURS
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[5],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("HOURS", {
    x: x + 2,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[5];


  // Undertime MINS
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[6],
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("MINS", {
    x: x + 4,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[6];


  // Header for Total Hours AM (spanning two rows)
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[7],
    height: rowHeight * 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("Total", {
    x: x + 10,
    y: tableY + rowHeight + 4,
    font,
    size: fontSize,
  });
  page.drawText("Hours AM", {
    x: x + 2,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[7];


  // Header for Total Hours PM (spanning two rows)
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[8],
    height: rowHeight * 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("Total", {
    x: x + 10,
    y: tableY + rowHeight + 4,
    font: fontbold,
    size: fontSize,
  });
  page.drawText("Hours PM", {
    x: x + 2,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });
  x += columnWidths[8];


  // Header for TOTAL NO. OF HOURS (spanning two rows)
  page.drawRectangle({
    x,
    y: tableY,
    width: columnWidths[9],
    height: rowHeight * 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });
  page.drawText("TOTAL", {
    x: x + 12,
    y: tableY + rowHeight + 4,
    font: fontbold,
    size: fontSize,
  });
  page.drawText("NO. OF HOURS", {
    x: x + 2,
    y: tableY + 4,
    font: fontbold,
    size: fontSize,
  });


  // ------- Draw 31 Daily Rows -------
  // Sample data for certain dates
  const data = {
   
  };


  for (let i = 1; i <= 31; i++) {
    const rowY = tableY - i * rowHeight;
    let xPos = tableX;
    const row = data[i] || ["", "", "", "", "", "", "", ""];
    columnWidths.forEach((width, colIndex) => {
      // Draw each cell in the row
      page.drawRectangle({
        x: xPos,
        y: rowY,
        width,
        height: rowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
      // In the first column, fill with the day number; otherwise, the data for that cell (or blank)
      let cellText = colIndex === 0 ? String(i) : row[colIndex - 1] || "";
      page.drawText(cellText, {
        x: xPos + 2,
        y: rowY + 4,
        font,
        size: 5,
      });
      xPos += width;
    });
  }


// ------- Draw Leave Type Rows (Below Day 31) -------
const leaveTypes = ["VL", "T/UT", "PL/SPL", "SL"];
const leaveStartY = tableY - 31 * rowHeight;


// Merge the leftmost cell vertically (leave it empty)
const mergedHeight = rowHeight * leaveTypes.length;
page.drawRectangle({
  x: tableX,
  y: leaveStartY - mergedHeight,
  width: columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3],
  height: mergedHeight,
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});


// Draw each leave type row (only for columns 4 and onward)
leaveTypes.forEach((type, i) => {
  const rowY = leaveStartY - (i + 1) * rowHeight;
  let xPos = tableX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3];


  // Column 4 (where the leave type text appears)
  const col4Width = columnWidths[4];
  page.drawRectangle({
    x: xPos,
    y: rowY,
    width: col4Width,
    height: rowHeight,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });


  page.drawText(type, {
    x: xPos + 2,         // small left padding (2 is better for left-align)
    y: rowY + rowHeight - 7,  // align closer to top (rowY + height - offset)
    font,
    size: 6,
  });
 


  // Columns 5 to end (draw empty boxes)
  xPos += col4Width;
  for (let col = 5; col < columnWidths.length; col++) {
    const width = columnWidths[col];
    page.drawRectangle({
      x: xPos,
      y: rowY,
      width,
      height: rowHeight,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });
    xPos += width;
  }
});

// ------- Draw Merged Row After Leave Types -------

// Set a taller height to fit certification + signatures
const mergedRowHeight = 150; // Increase to fit all content

const mergedRowY = leaveStartY - leaveTypes.length * rowHeight - mergedRowHeight;
const totalTableWidth = columnWidths.reduce((sum, width) => sum + width, 0);

// Draw the full-width merged row
page.drawRectangle({
  x: tableX,
  y: mergedRowY,
  width: totalTableWidth,
  height: mergedRowHeight,
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

// ------- Certification Statement & Signatures inside Merged Row -------

let certY = mergedRowY + mergedRowHeight - 10; // Start near the top inside the merged cell

const certText =
  "  I certify on my honor that the above is true and correct report of the hours\n" +
  "of work performed. Record of which was made daily at the time of arrival and\n" +
  "departure from office.";
const certLines = certText.split("\n");
certLines.forEach((line, idx) => {
  page.drawText(line, {
    x: tableX + 10,
    y: certY - idx * 10,
    font,
    size: 5,
  });
});
certY -= certLines.length * 11 + 10;

// Mary Joy D. Soliven signature block (centered)
let sigLineWidth = font.widthOfTextAtSize("_______________________________", 6);
page.drawText("_______________________________", {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font,
  size: 6,
});
certY -= 10;
sigLineWidth = fontbold.widthOfTextAtSize(username, 6);
page.drawText(username, {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font: fontbold,
  size: 6,
});
certY -= 10;
sigLineWidth = font.widthOfTextAtSize("(Signature of official or employee)", 6);
page.drawText("(Signature of official or employee)", {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font,
  size: 6,
});
certY -= 20;
sigLineWidth = font.widthOfTextAtSize("Verified as to the prescribe office hours.", 6);
page.drawText("Verified as to the prescribe office hours.", {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font,
  size: 6,
});
certY -= 30;

// Jonathan Von A. Rabot signature block (centered)
sigLineWidth = font.widthOfTextAtSize("_______________________________", 6);
page.drawText("_______________________________", {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font,
  size: 6,
});
certY -= 10;
sigLineWidth = fontbold.widthOfTextAtSize("JONATHAN VON A. RABOT", 6);
page.drawText("JONATHAN VON A. RABOT", {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font: fontbold,
  size: 6,
});
certY -= 10;
sigLineWidth = font.widthOfTextAtSize("OIC, Ilocos Sur Provincial Head", 6);
page.drawText("OIC, Ilocos Sur Provincial Head", {
  x: tableX + (totalTableWidth - sigLineWidth) / 2,
  y: certY,
  font,
  size: 6,
});




  return await pdfDoc.save();
}





loadUsers();

