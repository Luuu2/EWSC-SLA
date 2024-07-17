document.addEventListener("DOMContentLoaded", function () {
  window.handleFormSubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission

    // Retrieve form data
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Validate username and password
    if (!validateUsername(username) || !validatepassword(password)) {
      alert("Please enter a valid username and password.");
      return false;
    }

    // Process the form data as needed
    console.log("Username:", username);
    console.log("password:", password);

    // Optionally, store the data or perform other actions
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    // Redirect to SLAEntry.html
    window.location.href = "SLAEntry.html";

    return false; // Prevent form submission
  };

  // Function to validate username
  function validateUsername(username) {
    return username.trim().length > 0; // Check that username is not empty
  }

  // Function to validate password
  function validatepassword(password) {
    return password.trim().length > 0; // Check that password follows a basic pattern
  }
  // Handle login form submission
  /**const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const username = document.getElementById("username").value;
      localStorage.setItem("username", username); // Store username in localStorage
      window.location.href = "SLAEntry.html"; // Redirect to dashboard or next page
    });
  }

  // Display username or default message on subsequent pages
  const username = localStorage.getItem("username") || "Guest"; // Change 'Guest' to your desired default message
  const usernameBox = document.getElementById("usernameBox");
  if (usernameBox) { 
    usernameBox.textContent = username; // Only display the username or "Guest"
    usernameBox.style.display = "flex";
  }**/
});
