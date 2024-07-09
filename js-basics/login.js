

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