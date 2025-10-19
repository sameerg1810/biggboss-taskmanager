document.addEventListener("DOMContentLoaded", () => {
  // --- Element References ---
  const registerForm = document.getElementById("registerForm");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageElement = document.getElementById("error-message");

  // --- API Configuration ---
  const API_BASE_URL = "/api/user";

  /**
   * Displays a message to the user.
   * @param {string} message - The message to display.
   * @param {boolean} isError - If true, the message is styled as an error.
   */
  function showMessage(message, isError = true) {
    messageElement.textContent = message;
    messageElement.style.color = isError ? "red" : "green";
  }

  // --- Registration Logic ---
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showMessage("", false); // Clear previous messages

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!name || !email || !password) {
      showMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showMessage(data.message || "Registration failed. Please try again.");
        return;
      }

      // On success, notify the user and redirect to the login page after a delay
      showMessage("Registration successful! Redirecting to login...", false);
      setTimeout(() => {
        window.location.href = "/login.html"; // Redirect to the login page
      }, 3000); // 3-second delay
    } catch (error) {
      console.error("Registration Error:", error);
      showMessage("An error occurred. Please try again later.");
    }
  });
});
