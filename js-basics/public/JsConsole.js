document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");

  // Check if the form element exists on the page
  if (form) {
    const usernameField = document.getElementById("username");
    const passwordField = document.getElementById("password");

    // Check if the necessary fields exist
    if (usernameField && passwordField) {
      form.addEventListener("submit", function (event) {
        handleFormSubmit(event);
      });
    } else {
      console.warn("Username or Password field not found.");
    }
  } else {
    console.warn("Form not found on this page.");
  }
});
// Handle form submission
function handleFormSubmit(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!validateUsername(username) || !validatePassword(password)) {
    alert("Please enter a valid username and password.");
    return false;
  }

  // Check username and password against the database via API
  fetch("/api/checkCredentials", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        console.log("Login successful:", data.message);
        window.location.href = "SLAentry.html";
      } else {
        alert("Invalid username or password.");
      }
    })
    .catch((error) => console.error("Error:", error));

  return false;
}

// Validate the username (add your own validation logic here)
function validateUsername(username) {
  // Example: check if the username is non-empty
  return username.trim().length > 0;
}

// Validate the password (add your own validation logic here)
function validatePassword(password) {
  // Example: check if the password is non-empty
  return password.trim().length > 0;
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", handleFormSubmit);
}

const slaForm = document.getElementById("slaForm");
slaForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(slaForm);
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

function fetchUsername() {
  fetch("/api/getUsername")
    .then((response) => response.json())
    .then((data) => {
      const usernameBoxes = document.querySelectorAll(".username-box");
      const username = data.username || "Guest";
      usernameBoxes.forEach((usernameBox) => {
        usernameBox.textContent = username;
        usernameBox.style.display = "flex";
      });
    })
    .catch((error) => console.error("Error fetching username:", error));
}

fetchUsername();
/**const username = localStorage.getItem("username") || "Guest";
const usernameBox = document.getElementById("usernameBox");
if (usernameBox) {
  usernameBox.textContent = username;
  usernameBox.style.display = "flex";
}**/

// Handle dropdowns
var dropdownContainers = document.querySelectorAll(".dropdown-container");
dropdownContainers.forEach(function (container) {
  var dropdown = container.querySelector(".dropdown");
  var dropdownList = container.querySelector(".dropdown-list");
  var textElement = container.querySelector(".text");

  dropdown.addEventListener("click", function (event) {
    dropdownList.style.display =
      dropdownList.style.display === "block" ? "none" : "block";
    event.stopPropagation();
  });

  document.addEventListener("click", function (event) {
    if (!container.contains(event.target)) {
      dropdownList.style.display = "none";
    }
  });

  var dropdownItems = dropdownList.querySelectorAll("li");
  dropdownItems.forEach(function (item) {
    item.addEventListener("click", function () {
      textElement.innerText = this.innerText;
      dropdownList.style.display = "none";
    });
  });
});

// Display SLAs and Service Levels
for (let i = 1; i <= 5; i++) {
  document.getElementById(`display-sla${i}`).textContent =
    localStorage.getItem(`sla${i}`) ||
    "This SLA between internal Service Provider and Internal customer states that....";
  document.getElementById(`display-service-level${i}`).textContent =
    localStorage.getItem(`servicelevel${i}`) ||
    "This Service level proposed by internal Service Provider states that....";
}

// Handle menu toggling and outside clicks
function toggleMenu() {
  var menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "block" ? "none" : "block";
}

function handleClickOutside(event) {
  var menu = document.getElementById("menu");
  var menuIcon = document.querySelector(".menu-icon");
  if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
    menu.style.display = "none";
  }
}

function myFunction(x) {
  x.classList.toggle("change");
}

document.addEventListener("click", handleClickOutside);

// Handle department dropdown
function toggleDropdown() {
  var dropdown = document.getElementById("department-dropdown");
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", function (event) {
  var dropdown = document.getElementById("department-dropdown");
  var dropdownBtn = document.querySelector(".dropdown-btn");
  if (!dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

// Handle date input change
document.getElementById("dateInput").addEventListener("change", function () {
  console.log("Selected date: " + this.value);
});

// Save input and redirect
function saveServiceLevels() {
  const serviceLevels = [
    "serviceLevel1",
    "serviceLevel2",
    "serviceLevel3",
    "serviceLevel4",
    "serviceLevel5",
  ];
  serviceLevels.forEach((level) => {
    const value = document.getElementById(level).value;
    localStorage.setItem(level, value);
  });
  window.location.href = "SLARating.html";
}

// Save and clear inputs
/**function saveInput() {
  if (confirm("Do you want to save the inputs?")) {
    const dateInput = document.getElementById("dateInput").value;
    const slaInputs = ["sla1", "sla2", "sla3", "sla4", "sla5"].map(
      (id) => document.getElementById(id).value
    );

    localStorage.setItem("dateInput", dateInput);
    slaInputs.forEach((value, index) => {
      localStorage.setItem(`sla${index + 1}`, value);
    });

    alert("Inputs saved successfully.");
  }
}**/

// Determines the quarter we are in
function getFinancialQuarter(date) {
  date = new Date(date);

  if (isNaN(date.getTime())) {
    console.error("Invalid date");
    return null;
  }

  const month = date.getMonth() + 1; // getMonth() returns month from 0-11, so add 1 to get 1-12
  let quarter;

  if (month >= 4 && month <= 6) {
    quarter = "Q1";
  } else if (month >= 7 && month <= 9) {
    quarter = "Q2";
  } else if (month >= 10 && month <= 12) {
    quarter = "Q3";
  } else {
    quarter = "Q4";
  }

  return quarter;
}

function saveInput() {
  const department = document.getElementById("department").value;
  const date = document.getElementById("dateInput").value;
  const quarter = getFinancialQuarter(date);
  const slaEntries = [];
  for (let i = 1; i <= 5; i++) {
    const sla = document.getElementById(`sla${i}`).value;
    const serviceLevel = document.getElementById(`service-level${i}`).value;
    const customerRes = document.getElementById(`customer-res${i}`).value;
    if (sla || serviceLevel) {
      slaEntries.push({ sla, customerRes, serviceLevel });
    }
  }

  const data = {
    department,
    quarter,
    date,
    slaEntries,
  };
  fetch("/api/saveSLA", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.success) {
        alert("Data saved successfully!");
      } else {
        alert("Failed to save data.");
      }
    })
    .catch((error) => console.error("Error:", error));
}

// clearing all inputs
function clearForm() {
  document.getElementById("slaForm").reset();
}

function exitPage() {
  // Implement exit functionality (e.g., redirect to another page)
  window.location.href = "login.html";
}
