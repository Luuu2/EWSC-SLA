
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

// function to save service level and redirict to rating page//
function saveServiceLevels() {
    const serviceLevel1 = document.getElementById('service-level1').value;
    const serviceLevel2 = document.getElementById('service-level2').value;
    const serviceLevel3 = document.getElementById('service-level3').value;
    const serviceLevel4 = document.getElementById('service-level4').value;
    const serviceLevel5 = document.getElementById('service-level5').value;

    // Save service levels to localStorage
    localStorage.setItem('serviceLevel1', serviceLevel1);
    localStorage.setItem('serviceLevel2', serviceLevel2);
    localStorage.setItem('serviceLevel2', serviceLevel3);
    localStorage.setItem('serviceLevel2', serviceLevel4);
    localStorage.setItem('serviceLevel2', serviceLevel5);
    // Redirect to the rating page
    window.location.href = 'SLARating.html';
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
document.addEventListener("click", function(event) {
    var dropdown = document.getElementById("department-dropdown");
    var dropdownBtn = document.querySelector(".dropdown-btn");
    if (!dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

document.getElementById('dateInput').addEventListener('change', function() {
    console.log('Selected date: ' + this.value);
});

document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            localStorage.setItem('username', username); // Store username in localStorage
            window.location.href = 'dashboard.html'; // Redirect to dashboard or next page
        });
    }

    // Display username or default message on subsequent pages
    const username = localStorage.getItem('username') || 'Guest'; // Change 'Guest' to your desired default message
    const usernameBox = document.getElementById('usernameBox');
    if (usernameBox) {
        usernameBox.textContent = username; // Only display the username or "Guest"
        usernameBox.style.display = 'flex';
    }
});

function saveInput() {
    if (confirm('Do you want to save the inputs?')) {
        const dateInput = document.getElementById('dateInput').value;
        const sla1 = document.getElementById('sla1').value;
        const sla2 = document.getElementById('sla2').value;
        const sla3 = document.getElementById('sla3').value;
        const sla4 = document.getElementById('sla4').value;
        const sla5 = document.getElementById('sla5').value;

        localStorage.setItem('dateInput', dateInput);
        localStorage.setItem('sla1', sla1);
        localStorage.setItem('sla2', sla2);
        localStorage.setItem('sla3', sla3);
        localStorage.setItem('sla4', sla4);
        localStorage.setItem('sla5', sla5);

        alert('Inputs saved successfully.');
    }
}

function clearInput() {
    if (confirm('Do you want to clear all inputs?')) {
        document.getElementById('dateInput').value = '';
        document.getElementById('sla1').value = '';
        document.getElementById('sla2').value = '';
        document.getElementById('sla3').value = '';
        document.getElementById('sla4').value = '';
        document.getElementById('sla5').value = '';

        alert('All inputs cleared.');
    }
}

function exitPage() {
    if (confirm('Do you want to exit to the login page?')) {
        window.location.href = 'login.html';
    }
}