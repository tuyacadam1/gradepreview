// Replace with your Google Apps Script Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbw92W3A30tsfcMwdmVrJXFKXcgMjbIgMPLdRy_z55dwfPAbCm8vWoBQm3pWTb6hTdrt/exec";

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

    const d = result.data;
    
    // Fill Student Information
    document.getElementById("infoName").innerText = d.name || "--";
    document.getElementById("infoCode").innerText = d.code || "--";
    document.getElementById("infoSex").innerText = d.sex || "--";
    document.getElementById("infoSection").innerText = d.section || "--";
    document.getElementById("infoQuarter").innerText = d.quarter || "1st Quarter";

    // Fill Subject Grades
    document.getElementById("gFilipino").innerText = d.filipino ?? "--";
    document.getElementById("gEnglish").innerText = d.english ?? "--";
    document.getElementById("gMath").innerText = d.math ?? "--";
    document.getElementById("gScience").innerText = d.science ?? "--";
    document.getElementById("gAP").innerText = d.aralingPanlipunan ?? "--";
    document.getElementById("gESP").innerText = d.esp ?? "--";
    document.getElementById("gTLE").innerText = d.tle ?? "--";
    document.getElementById("gMAPEH").innerText = d.mapeh ?? "--";
    document.getElementById("genAve").innerText = d.genAve ?? "--";

    content.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.innerText = "Unable to connect to the grade database. Check your connection or API URL.";
  }
}
