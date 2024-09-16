// Select elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Load tasks from localStorage when the page loads
window.addEventListener("load", function () {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    addTask(task.text, task.completed);
  });
});

// Add task on button click
addTaskBtn.addEventListener("click", function () {
  const taskText = taskInput.value;
  if (taskText !== "") {
    addTask(taskText, false);
    taskInput.value = "";
  }
});

// Function to add a task to the list
function addTask(taskText, completed) {
  const li = document.createElement("li");
  li.draggable = true;
  li.classList.add("draggable");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "checkbox";
  checkbox.checked = completed;
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      li.classList.add("completed");
    } else {
      li.classList.remove("completed");
    }
    saveTasks();
  });

  const textNode = document.createTextNode(taskText);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", function () {
    taskList.removeChild(li);
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(textNode);
  li.appendChild(deleteBtn);

  if (completed) {
    li.classList.add("completed");
  }

  taskList.appendChild(li);

  addDragAndDropHandlers(li);

  saveTasks();
}

// Function to save tasks to localStorage
function saveTasks() {
  const tasks = [];
  const taskItems = taskList.querySelectorAll("li");
  taskItems.forEach((item) => {
    const checkbox = item.querySelector(".checkbox");
    tasks.push({
      text: item.textContent.replace("Delete", "").trim(),
      completed: checkbox.checked,
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Add drag-and-drop event handlers to a task
function addDragAndDropHandlers(taskItem) {
  taskItem.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", taskItem.innerHTML);
    taskItem.classList.add("dragging");
  });

  taskItem.addEventListener("dragover", function (e) {
    e.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    if (draggingTask !== taskItem) {
      const bounding = taskItem.getBoundingClientRect();
      const offset = bounding.y + bounding.height / 2;
      if (e.clientY - offset > 0) {
        taskItem.style["border-bottom"] = "solid 2px #ccc";
        taskItem.style["border-top"] = "";
      } else {
        taskItem.style["border-top"] = "solid 2px #ccc";
        taskItem.style["border-bottom"] = "";
      }
    }
  });

  taskItem.addEventListener("dragleave", function () {
    taskItem.style["border-bottom"] = "";
    taskItem.style["border-top"] = "";
  });

  taskItem.addEventListener("drop", function (e) {
    e.preventDefault();
    const draggingTask = document.querySelector(".dragging");
    if (draggingTask !== taskItem) {
      taskItem.parentNode.insertBefore(
        draggingTask,
        e.clientY - taskItem.getBoundingClientRect().y >
          taskItem.clientHeight / 2
          ? taskItem.nextSibling
          : taskItem
      );
    }
    taskItem.style["border-bottom"] = "";
    taskItem.style["border-top"] = "";
    draggingTask.classList.remove("dragging");
    saveTasks();
  });

  taskItem.addEventListener("dragend", function () {
    taskItem.classList.remove("dragging");
    const tasks = taskList.querySelectorAll("li");
    tasks.forEach((task) => {
      task.style["border-bottom"] = "";
      task.style["border-top"] = "";
    });
  });
}
