document.addEventListener("DOMContentLoaded", () => {
  // --- Element References ---
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("error-message");

  // --- API Configuration ---
  const API_BASE_URL = "/api/user"; // Corrected to plural 'users'

  function showMessage(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = "red";
  }

  // Handles the user login process, including form submission and role-based redirection.

  async function handleLogin(event) {
    event.preventDefault();
    showMessage(""); // Clear any previous messages

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      showMessage("Email and password are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Always get the JSON data from the response to check the role or error message.
      const data = await response.json();

      if (!response.ok) {
        // If the login fails, the server sends an error. Display it.
        showMessage(
          data.message || "Login failed. Please check your credentials.",
        );
        return;
      }

      // --- ROLE-BASED REDIRECT LOGIC ---
      // On successful login, the server has set the secure HttpOnly cookie.
      // Now, we use the 'role' from the response data to decide where to redirect the user.

      if (data.role === "admin") {
        // If the user's role is 'admin', redirect to the admin dashboard.
        window.location.href = "/admin.html";
      } else {
        // For any other role (e.g., 'user'), redirect to the main application.
        window.location.href = "/";
      }
    } catch (error) {
      // This catches network errors or other issues with the fetch call itself.
      console.error("Login Error:", error);
      showMessage("An error occurred. Please try again later.");
    }
  }

  // Attach the login handler to the form's submit event.
  loginForm.addEventListener("submit", handleLogin);
});
