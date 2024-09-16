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
// Add task when Enter key is pressed
taskInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent the default action of the Enter key
    const taskText = taskInput.value;
    if (taskText !== "") {
      addTask(taskText, false);
      taskInput.value = "";
    }
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
  const taskSpan = document.createElement("span");
  taskSpan.className = "task-text";
  taskSpan.appendChild(textNode);
  taskSpan.addEventListener("click", function () {
    editTask(taskSpan);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.className = "delete-btn";
  deleteBtn.addEventListener("click", function () {
    taskList.removeChild(li);
    saveTasks();
  });

  li.appendChild(checkbox);
  li.appendChild(taskSpan);
  li.appendChild(deleteBtn);

  if (completed) {
    li.classList.add("completed");
  }

  taskList.appendChild(li);

  addDragAndDropHandlers(li);

  saveTasks();
}

// Function to handle task editing
function editTask(taskSpan) {
  const currentText = taskSpan.textContent;

  const input = document.createElement("input");
  input.type = "text";
  input.value = currentText;
  input.className = "edit-input";

  taskSpan.innerHTML = "";
  taskSpan.appendChild(input);

  input.focus();

  // Save edited task on Enter or blur
  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.value.trim() !== "") {
        saveEditedTask(taskSpan, input.value);
      } else {
        taskSpan.textContent = currentText;
      }
    }
  });

  input.addEventListener("blur", function () {
    if (input.value.trim() !== "") {
      saveEditedTask(taskSpan, input.value);
    } else {
      taskSpan.textContent = currentText;
    }
  });
}

// Function to save the edited task
function saveEditedTask(taskSpan, newText) {
  taskSpan.textContent = newText;
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
    try {
      const draggingTask = document.querySelector(".dragging");
      if (draggingTask !== taskItem) {
        taskItem.classList.add("drag-over");
        const bounding = taskItem.getBoundingClientRect();
        const offset = bounding.y + bounding.height / 2;
        if (e.clientY - offset > 0) {
          taskItem.style["border-bottom"] = "solid 2px #555";
          taskItem.style["border-top"] = "";
        } else {
          taskItem.style["border-top"] = "solid 2px #555";
          taskItem.style["border-bottom"] = "";
        }
      }
    } catch (error) {
      console.error("Error during dragover operation:", error.message);
    }
  });

  taskItem.addEventListener("dragleave", function () {
    taskItem.classList.remove("drag-over");
    taskItem.style["border-bottom"] = "";
    taskItem.style["border-top"] = "";
  });

  taskItem.addEventListener("drop", function (e) {
    e.preventDefault();
    try {
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
      taskItem.classList.remove("drag-over");
      taskItem.style["border-bottom"] = "";
      taskItem.style["border-top"] = "";
      draggingTask.classList.remove("dragging");
      saveTasks();
    } catch (error) {
      console.error("Error during drop operation:", error.message);
    }
  });

  taskItem.addEventListener("dragend", function () {
    try {
      taskItem.classList.remove("dragging");
      taskItem.classList.remove("drag-over");
      const tasks = taskList.querySelectorAll("li");
      tasks.forEach((task) => {
        task.style["border-bottom"] = "";
        task.style["border-top"] = "";
      });
    } catch (error) {
      console.error("Error during dragend operation:", error.message);
    }
  });
}
