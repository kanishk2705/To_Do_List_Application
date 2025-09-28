const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTask");
const taskText = document.getElementById("taskText");
const taskCategory = document.getElementById("taskCategory");
const taskDate = document.getElementById("taskDate");
const filters = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "All";

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";
  tasks
    .filter((t) => {
      if (filter === "All") return true;
      if (filter === "Active") return !t.completed;
      if (filter === "Completed") return t.completed;
      return t.category === filter;
    })
    .forEach((task) => {
      const li = document.createElement("li");

      const left = document.createElement("div");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.onchange = () => toggleTask(task.id);

      const text = document.createElement("span");
      text.textContent = `${task.text} (${task.category})`;
      text.className = "task-text" + (task.completed ? " completed" : "");

      left.appendChild(checkbox);
      left.appendChild(text);

      if (task.dueDate) {
        const daysLeft = Math.ceil(
          (new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        const badge = document.createElement("span");
        badge.className = "badge " + (daysLeft >= 0 ? "warning" : "danger");
        badge.textContent = daysLeft >= 0 ? `${daysLeft}d left` : "Overdue";
        left.appendChild(badge);
      }

      const delBtn = document.createElement("button");
      delBtn.textContent = "🗑️";
      delBtn.onclick = () => deleteTask(task.id);

      li.appendChild(left);
      li.appendChild(delBtn);

      taskList.appendChild(li);
    });
}

// Add task
addTaskBtn.onclick = () => {
  if (!taskText.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: taskText.value,
    category: taskCategory.value,
    completed: false,
    dueDate: taskDate.value || null,
  });

  taskText.value = "";
  taskDate.value = "";
  saveTasks();
  renderTasks();
};

// Toggle complete
function toggleTask(id) {
  tasks = tasks.map((t) =>
    t.id === id ? { ...t, completed: !t.completed } : t
  );
  saveTasks();
  renderTasks();
}

// Delete task
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
}

// Filter buttons
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    renderTasks();
  })
);

// Theme toggle
themeToggle.onclick = () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
};

// Initial render
renderTasks();
