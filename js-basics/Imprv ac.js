document.addEventListener('DOMContentLoaded', function() {
    // Get all dropdown containers
    var dropdownContainers = document.querySelectorAll('.dropdown-container');
    
    dropdownContainers.forEach(function(container) {
        var dropdown = container.querySelector('.dropdown');
        var dropdownList = container.querySelector('.dropdown-list');
        var textElement = container.querySelector('.text');

        dropdown.addEventListener('click', function(event) {
            // Toggle the display of the corresponding dropdown list
            dropdownList.style.display = dropdownList.style.display === 'block' ? 'none' : 'block';
            event.stopPropagation();
        });

        // Hide the dropdown list when clicking outside of it
        document.addEventListener('click', function(event) {
            if (!container.contains(event.target)) {
                dropdownList.style.display = 'none';
            }
        });

        // Handle selection for each dropdown list item
        var dropdownItems = dropdownList.querySelectorAll('li');
        dropdownItems.forEach(function(item) {
            item.addEventListener('click', function() {
                // Update the text of the corresponding dropdown
                textElement.innerText = this.innerText;
                dropdownList.style.display = 'none';
            });
        });
    });

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

    // Displays SLAs From previous page
    for (let i = 1; i <= 5; i++) {
        document.getElementById(`display-sla${i}`).textContent = localStorage.getItem(`sla${i}`) || 'N/A';
    }
});

// Function to toggle the menu
function toggleMenu() {
    var menu = document.getElementById("menu");
    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}

// Function to handle clicks outside the menu
function handleClickOutside(event) {
    var menu = document.getElementById("menu");
    var menuIcon = document.querySelector(".menu-icon");
    if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.display = "none";
    }
}

// Function to toggle a class for an element
function myFunction(x) {
    x.classList.toggle("change");
}

// Add event listener for clicks outside the menu
document.addEventListener('click', handleClickOutside);
