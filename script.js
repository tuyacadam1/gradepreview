const API_URL = "https://script.google.com/macros/s/AKfycbw92W3A30tsfcMwdmVrJXFKXcgMjbIgMPLdRy_z55dwfPAbCm8vWoBQm3pWTb6hTdrt/exec";

let currentTargetSheet = null;
let currentStudentRow = null;

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

    // Populate Student Info & Section
    const std = result.student;
    document.getElementById("infoName").innerText = `${std.lastName}, ${std.firstName} ${std.middleName || ''}`;
    document.getElementById("infoCode").innerText = std.code;
    document.getElementById("infoSection").innerText = std.section;

    // Populate Grade Form Inputs
    const g = result.grades;
    if (g) {
      currentTargetSheet = g.sheetName;
      currentStudentRow = g.rowIndex;

      document.getElementById("filipino").value = g.filipino;
      document.getElementById("english").value = g.english;
      document.getElementById("math").value = g.math;
      document.getElementById("science").value = g.science;
      document.getElementById("aralingPanlipunan").value = g.aralingPanlipunan;
      document.getElementById("esp").value = g.esp;
      document.getElementById("tle").value = g.tle;
      document.getElementById("mapeh").value = g.mapeh;
      document.getElementById("genAve").innerText = g.genAve;
    }

    content.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    errorMsg.innerText = "Error fetching data from Google Sheets.";
  }
}

async function updateGrades(e) {
  e.preventDefault();

  const payload = {
    sheetName: currentTargetSheet,
    rowIndex: currentStudentRow,
    filipino: parseFloat(document.getElementById("filipino").value),
    english: parseFloat(document.getElementById("english").value),
    math: parseFloat(document.getElementById("math").value),
    science: parseFloat(document.getElementById("science").value),
    aralingPanlipunan: parseFloat(document.getElementById("aralingPanlipunan").value),
    esp: parseFloat(document.getElementById("esp").value),
    tle: parseFloat(document.getElementById("tle").value),
    mapeh: parseFloat(document.getElementById("mapeh").value)
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const res = await response.json();
    if (res.status === "success") {
      alert("Grades updated successfully!");
      fetchStudentData(); // Refresh displayed values
    } else {
      alert("Failed to update: " + res.message);
    }
  } catch (err) {
    alert("Error updating grades.");
  }
}
