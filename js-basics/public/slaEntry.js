document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("slaForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // Filter out empty SLA entries
    for (let i = 1; i <= 5; i++) {
      if (!data[`sla${i}`]) {
        delete data[`sla${i}`];
        delete data[`customerRes${i}`];
        delete data[`serviceLevel${i}`];
      }
    }

    fetch("/api/sla", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          alert("SLA data saved successfully!");
          clearForm();
        } else {
          alert("Error: " + result.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while saving the SLA data.");
      });
  });
});

function clearForm() {
  document.getElementById("slaForm").reset();
}

function exitPage() {
  // Implement exit functionality (e.g., redirect to another page)
  window.location.href = "login.html";
}

function toggleMenu() {
  var menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}
