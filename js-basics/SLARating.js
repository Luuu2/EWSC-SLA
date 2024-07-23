function myFunction(x) {
    x.classList.toggle("change");
  }
  
  function toggleMenu() {
    var menu = document.getElementById("menu");
    if (menu.style.display === "block") {
      menu.style.display = "none";
    } else {
      menu.style.display = "block";
    }
  }
  
  // Function to hide the menu when clicking outside of it
  function handleClickOutside(event) {
    var menu = document.getElementById("menu");
    var menuIcon = document.querySelector(".menu-icon");
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
      menu.style.display = "none";
    }
  }
  
  // Function to toggle the department dropdown
  function toggleDropdown() {
    var dropdown = document.getElementById("department-dropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }
  
  // Add event listener to the document
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("click", function (event) {
    var dropdown = document.getElementById("department-dropdown");
    var dropdownBtn = document.querySelector(".dropdown-btn");
    if (!dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
      dropdown.style.display = "none";
    }
  });
  
  document.addEventListener("DOMContentLoaded", function () {
    // Handle login form submission
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        localStorage.setItem("username", username); // Store username in localStorage
        window.location.href = "dashboard.html"; // Redirect to dashboard or next page
      });
    }
  
    // Display username or default message on subsequent pages
    const username = localStorage.getItem("username") || "Guest"; // Change 'Guest' to your desired default message
    const usernameBox = document.getElementById("usernameBox");
    if (usernameBox) {
      usernameBox.textContent = username; // Only display the username or "Guest"
      usernameBox.style.display = "flex";
    }
  });
  // Displays SLAs From previous page
  document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 5; i++) {
      document.getElementById(`display-sla${i}`).textContent =
        localStorage.getItem(`sla${i}`) ||
        "This SLA between internal Service Provider and Internal customer states that....";
    }
  });

   // Displays Service levels From previous page
   document.addEventListener("DOMContentLoaded", () => {
    for (let i = 1; i <= 5; i++) {
      document.getElementById(`display-service-level${i}`).textContent =
        localStorage.getItem(`servicelevel${i}`) ||
        "This Service level proposed by  internal Service Provider states that....";
    }
  });