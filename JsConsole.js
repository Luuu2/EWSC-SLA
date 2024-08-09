document.addEventListener("DOMContentLoaded", function () {
    // Handle form submission
    function handleFormSubmit(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        if (!validateUsername(username) || !validatePassword(password)) {
            alert("Please enter a valid username and password.");
            return false;
        }

        console.log("Username:", username);
        console.log("Password:", password);

        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        window.location.href = "SLAEntry.html";
        return false;
    }

    function validateUsername(username) {
        return username.trim().length > 0;
    }

    function validatePassword(password) {
        return password.trim().length > 0;
    }

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleFormSubmit);
    }

    const username = localStorage.getItem("username") || "Guest";
    const usernameBox = document.getElementById("usernameBox");
    if (usernameBox) {
        usernameBox.textContent = username;
        usernameBox.style.display = "flex";
    }

    // Handle dropdowns
    var dropdownContainers = document.querySelectorAll('.dropdown-container');
    dropdownContainers.forEach(function (container) {
        var dropdown = container.querySelector('.dropdown');
        var dropdownList = container.querySelector('.dropdown-list');
        var textElement = container.querySelector('.text');

        dropdown.addEventListener('click', function (event) {
            dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation();
        });

        document.addEventListener('click', function (event) {
            if (!container.contains(event.target)) {
                dropdownList.style.display = 'none';
            }
        });

        var dropdownItems = dropdownList.querySelectorAll('li');
        dropdownItems.forEach(function (item) {
            item.addEventListener('click', function () {
                textElement.innerText = this.innerText;
                dropdownList.style.display = 'none';
            });
        });
    });

    // Display SLAs and Service Levels
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`display-sla${i}`).textContent =
            localStorage.getItem(`sla${i}`) || 'This SLA between internal Service Provider and Internal customer states that....';
        document.getElementById(`display-service-level${i}`).textContent =
            localStorage.getItem(`servicelevel${i}`) || 'This Service level proposed by internal Service Provider states that....';
    }
});

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

document.addEventListener('click', handleClickOutside);

// Handle department dropdown
function toggleDropdown() {
    var dropdown = document.getElementById("department-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener('click', function (event) {
    var dropdown = document.getElementById("department-dropdown");
    var dropdownBtn = document.querySelector(".dropdown-btn");
    if (!dropdown.contains(event.target) && !dropdownBtn.contains(event.target)) {
        dropdown.style.display = "none";
    }
});

// Handle date input change
document.getElementById('dateInput').addEventListener('change', function () {
    console.log('Selected date: ' + this.value);
});

// Save input and redirect
function saveServiceLevels() {
    const serviceLevels = ['serviceLevel1', 'serviceLevel2', 'serviceLevel3', 'serviceLevel4', 'serviceLevel5'];
    serviceLevels.forEach(level => {
        const value = document.getElementById(level).value;
        localStorage.setItem(level, value);
    });
    window.location.href = 'SLARating.html';
}

// Save and clear inputs
function saveInput() {
    if (confirm('Do you want to save the inputs?')) {
        const dateInput = document.getElementById('dateInput').value;
        const slaInputs = ['sla1', 'sla2', 'sla3', 'sla4', 'sla5'].map(id => document.getElementById(id).value);
        
        localStorage.setItem('dateInput', dateInput);
        slaInputs.forEach((value, index) => {
            localStorage.setItem(`sla${index + 1}`, value);
        });

        alert('Inputs saved successfully.');
    }
}

function clearInput() {
    if (confirm('Do you want to clear all inputs?')) {
        ['dateInput', 'sla1', 'sla2', 'sla3', 'sla4', 'sla5'].forEach(id => {
            document.getElementById(id).value = '';
        });

        alert('All inputs cleared.');
    }
}

function exitPage() {
    if (confirm('Do you want to exit to the login page?')) {
        window.location.href = 'login.html';
    }
}
