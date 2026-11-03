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

    // Display Student Profile Details
    const std = result.student;
    const fullName = `${std.lastName}, ${std.firstName} ${std.middleName || ''}`.trim();
    document.getElementById("infoName").innerText = fullName;
    document.getElementById("infoCode").innerText = std.code;
    document.getElementById("infoSection").innerText = std.section;

    // Display Grade Details
    const g = result.grades;
    if (g) {
      document.getElementById("infoQuarter").innerText = g.quarter || "1st Quarter";
      document.getElementById("gFilipino").innerText = g.filipino ?? "--";
      document.getElementById("gEnglish").innerText = g.english ?? "--";
      document.getElementById("gMath").innerText = g.math ?? "--";
      document.getElementById("gScience").innerText = g.science ?? "--";
      document.getElementById("gAP").innerText = g.aralingPanlipunan ?? "--";
      document.getElementById("gESP").innerText = g.esp ?? "--";
      document.getElementById("gTLE").innerText = g.tle ?? "--";
      document.getElementById("gMAPEH").innerText = g.mapeh ?? "--";
      document.getElementById("genAve").innerText = g.genAve ?? "--";
    } else {
      errorMsg.innerText = "Student found in enrollment, but grade record is missing.";
    }

    content.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.innerText = "Unable to load data. Please check your network or API URL.";
  }
}
