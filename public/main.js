document.addEventListener("DOMContentLoaded", () => {
  // --- Element References ---
  const appHeader = document.getElementById("app-header");
  const appContainer = document.getElementById("app-container");
  const userNameSpan = document.getElementById("user-name");

  // --- API Configuration ---
  const API_BASE_URL = "/api/user"; // Ensure this is correct

  
   // Checks the user's session by calling the /me endpoint. This is the core of the gatekeeper logic.
 
  async function checkUserSession() {
    try {
      // The browser automatically sends the secure HttpOnly cookie with this request.
      const response = await fetch(`${API_BASE_URL}/me`);

      if (!response.ok) {
        // If the server responds with an error (e.g., 401 Unauthorized), the user is not authenticated.
        throw new Error("Not authenticated");
      }

      const user = await response.json();

      // --- User is Authenticated: Set Up the UI ---

      // 1. Populate the user's name in the header.
      userNameSpan.textContent = user.name;

      // 2. Attach the logout functionality to the logout button.
      document
        .getElementById("logout-btn")
        .addEventListener("click", handleLogout);

      // 3. CRITICAL STEP: Call the fetchTasks function from script.js.
      // This ensures tasks are only fetched after authentication is confirmed.
      if (window.fetchTasks) {
        window.fetchTasks();
      }
    } catch (error) {
      // If the session check fails for any reason, redirect to the login page.
      console.error("Session check failed, redirecting to login:", error);
      window.location.href = "/login.html";
    }
  }


   // Logs the user out by calling the server to clear the session cookie, then redirects.

  async function handleLogout() {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: "POST" });
    } catch (error) {
      console.error("Logout API call failed, but redirecting anyway:", error);
    } finally {
      // Always redirect to the login page after attempting to log out.
      window.location.href = "/login.html";
    }
  }

  // --- Initial Page Load ---
  // Run the session check as soon as the page is ready.
  checkUserSession();
});
