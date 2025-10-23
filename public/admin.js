document.addEventListener("DOMContentLoaded", () => {
  const userNameSpan = document.getElementById("user-name");
  const usersTbody = document.getElementById("users-tbody");
  const API_BASE_URL = "/api/user";

  //Fetches the current admin's data to display their name.

  const fetchAdminInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`);
      if (!res.ok) throw new Error("Not authorized");
      const admin = await res.json();
      if (admin.role !== "admin") throw new Error("Not an admin");
      userNameSpan.textContent = admin.name;
    } catch (error) {
      window.location.href = "/login.html"; // Redirect if not an authenticated admin
    }
  };

  /**
   * Fetches all users and populates the table.
   */
  const fetchAllUsers = async () => {
    try {
      const res = await fetch(API_BASE_URL); // GET /api/users
      if (!res.ok) throw new Error("Failed to fetch users.");
      const users = await res.json();

      usersTbody.innerHTML = ""; // Clear existing table rows
      users.forEach((user) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${
                      user.isVerified
                        ? '<span style="color:green;">Verified</span>'
                        : '<span style="color:orange;">Pending</span>'
                    }</td>
                    <td>
                        ${
                          !user.isVerified
                            ? `<button class="btn-verify" data-id="${user._id}">Verify</button>`
                            : "N/A"
                        }
                    </td>
                `;
        usersTbody.appendChild(row);
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Could not load user data.");
    }
  };

  // Handles the verification of a user.

  const handleVerifyUser = async (userId) => {
    if (!confirm("Are you sure you want to verify this user?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${userId}/verify`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Verification failed.");

      // Refresh the user list to show the updated status
      fetchAllUsers();
    } catch (error) {
      console.error("Error verifying user:", error);
      alert("Could not verify user.");
    }
  };

  // Handles logout for the admin.

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/logout`, { method: "POST" });
    } finally {
      window.location.href = "/login.html";
    }
  };

  // --- Initial Setup ---
  document.getElementById("logout-btn").addEventListener("click", handleLogout);

  // Add event listener to the table body for delegation
  usersTbody.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-verify")) {
      const userId = event.target.dataset.id;
      handleVerifyUser(userId);
    }
  });

  fetchAdminInfo();
  fetchAllUsers();
});
