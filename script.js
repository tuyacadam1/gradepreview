// Replace with your published Apps Script Web App URL
const API_URL = "YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";

let studentQuarterRecords = [];

async function fetchStudentData() {
  const code = document.getElementById("studentCode").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  const loading = document.getElementById("loading");
  const content = document.getElementById("portalContent");

  if (!code) {
    errorMsg.innerText = "Please enter a student code.";
    return;
  }

  errorMsg.innerText = "";
  loading.classList.remove("hidden");
  content.classList.add("hidden");

  try {
    const response = await fetch(`${API_URL}?code=${encodeURIComponent(code)}`);
    const result = await response.json();

    loading.classList.add("hidden");

    if (result.status === "error") {
      errorMsg.innerText = result.message;
      return;
    }

    // Fill Student Information
    const std = result.student;
    document.getElementById("infoName").innerText = std.name || "--";
    document.getElementById("infoCode").innerText = std.code || "--";
    document.getElementById("infoSex").innerText = std.sex || "--";
    document.getElementById("infoSection").innerText = std.section || "--";

    // Store all quarter records and populate dropdown
    studentQuarterRecords = result.records || [];
    const select = document.getElementById("quarterSelect");
    select.innerHTML = "";

    studentQuarterRecords.forEach((rec, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.text = rec.quarter;
      select.appendChild(option);
    });

    // Default to the latest quarter (last entry in the sheet)
    if (studentQuarterRecords.length > 0) {
      select.value = studentQuarterRecords.length - 1;
      displaySelectedQuarter();
    }

    content.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.innerText = "Unable to connect to the grade database. Check your connection or API URL.";
  }
}

function displaySelectedQuarter() {
  const index = document.getElementById("quarterSelect").value;
  const g = studentQuarterRecords[index];
  if (!g) return;

  document.getElementById("gFilipino").innerText = g.filipino ?? "--";
  document.getElementById("gEnglish").innerText = g.english ?? "--";
  document.getElementById("gMath").innerText = g.math ?? "--";
  document.getElementById("gScience").innerText = g.science ?? "--";
  document.getElementById("gAP").innerText = g.aralingPanlipunan ?? "--";
  document.getElementById("gESP").innerText = g.esp ?? "--";
  document.getElementById("gTLE").innerText = g.tle ?? "--";
  document.getElementById("gMAPEH").innerText = g.mapeh ?? "--";
  document.getElementById("genAve").innerText = g.genAve ?? "--";
}
