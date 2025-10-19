document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const descriptionInput = document.getElementById("description-input");
  const categorySelect = document.getElementById("category-select");
  const addButton = document.getElementById("add-button");
  const pendingList = document.getElementById("pending-list");
  const completedList = document.getElementById("completed-list");

  const editModal = document.getElementById("edit-modal");
  const editForm = document.getElementById("edit-form");
  const closeModalButton = document.querySelector(".close-button");
  const editTaskId = document.getElementById("edit-task-id");
  const editTaskName = document.getElementById("edit-task-name");
  const editTaskDesc = document.getElementById("edit-task-desc");

  const API_BASE_URL = "http://localhost:5000/api/todos";

  // --- Modal Logic ---
  function openEditModal(task) {
    editTaskId.value = task._id;
    editTaskName.value = task.task;
    editTaskDesc.value = task.description || "";
    editModal.style.display = "flex";
    editTaskName.focus();
  }

  function closeEditModal() {
    editModal.style.display = "none";
  }

  closeModalButton.addEventListener("click", closeEditModal);
  window.addEventListener("click", (e) => {
    if (e.target == editModal) closeEditModal();
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskId = editTaskId.value;
    const updatedData = {
      task: editTaskName.value.trim(),
      description: editTaskDesc.value.trim(),
    };
    updateTask(taskId, updatedData);
    closeEditModal();
  });

  // --- Create Task Element ---
  function createTaskElement(task) {
    const listItem = document.createElement("li");
    listItem.setAttribute("data-id", task._id);
    if (task.isCompleted) listItem.classList.add("completed");

    listItem.innerHTML = `
      <div class="task-content">
        <input type="checkbox" class="complete-checkbox" ${
          task.isCompleted ? "checked" : ""
        }>
        <strong class="task-name">${task.task}</strong>
        <p class="task-description">${task.description || "No description"}</p>
      </div>
      <div class="task-buttons">
        <button class="edit-btn"><i class="fas fa-edit"></i></button>
        <button class="delete-btn"><i class="fas fa-trash"></i></button>
      </div>
    `;

    // --- Event Listeners ---
    listItem.querySelector(".edit-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      openEditModal(task);
    });

    listItem.querySelector(".delete-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(task._id, listItem);
    });

    //  Toggle completion state
    const checkbox = listItem.querySelector(".complete-checkbox");
    checkbox.addEventListener("change", async () => {
      await toggleComplete(task._id);
    });

    return listItem;
  }

  // --- CREATE ---
  async function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return alert("Please enter a task name.");

    const newTask = {
      task: taskText,
      description: descriptionInput.value.trim(),
      category: categorySelect.value,
      isCompleted: false,
    };

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) throw new Error((await response.json()).message);
      fetchTasks();
      taskInput.value = "";
      descriptionInput.value = "";
    } catch (error) {
      alert(`Error adding task: ${error.message}`);
    }
  }

  // --- UPDATE ---
  async function updateTask(taskId, updatedData) {
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error((await response.json()).message);
      fetchTasks();
    } catch (error) {
      alert(`Error updating task: ${error.message}`);
    }
  }

  //  TOGGLE COMPLETE
  async function toggleComplete(taskId) {
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}/complete`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Error updating completion status");
      fetchTasks();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  }

  // --- READ ---
  async function fetchTasks() {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch tasks.");

      const tasks = await response.json();
      pendingList.innerHTML = "";
      completedList.innerHTML = "";

      tasks.forEach((task) => {
        const listItem = createTaskElement(task);
        if (task.isCompleted) {
          completedList.appendChild(listItem);
        } else {
          pendingList.appendChild(listItem);
        }
      });
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
    }
  }

  // --- DELETE ---
  async function deleteTask(taskId, listItem) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${taskId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error((await response.json()).message);
      listItem.remove();
    } catch (error) {
      alert(`Error deleting task: ${error.message}`);
    }
  }

  // --- Initialize ---
  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", (e) => e.key === "Enter" && addTask());
  window.fetchTasks = fetchTasks;

  fetchTasks();
});
