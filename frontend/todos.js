const form = document.querySelector("form");
const tableBody = document.getElementById("todoTable");

function fetchTasks() {
    fetch("http://localhost:8000/tasks")
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = "";
            data.tasks.forEach((item, index) => {
                const todoLines = item.todo.split('\n');
                let todoHTML = "<ul>";
                todoLines.forEach(line => {
                    if (line.trim() !== "") todoHTML += `<li>${line}</li>`;
                });
                todoHTML += "</ul>";

                tableBody.innerHTML += `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${item.username}</td>
                    <td>${todoHTML}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" data-id="${item.id}">Delete</button>
                    </td>
                </tr>`;
            });

            const deleteButtons = tableBody.querySelectorAll("button[data-id]");
            deleteButtons.forEach(btn => {
                btn.addEventListener("click", function() {
                    const id = this.getAttribute("data-id");
                    deleteTask(id);
                });
            });
        });
}

// Delete single todo by ID
function deleteTask(id) {
    fetch(`http://localhost:8000/delete/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            fetchTasks();
        })
        .catch(err => console.error("Error:", err));
}

// Initial load
fetchTasks();

// Handle form submission
form.addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const todo = document.getElementById("todos").value;

    fetch("http://localhost:8000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, todo: todo })
    })
    .then(response => response.json())
    .then(data => {
        fetchTasks();
        form.reset();
    })
    .catch(error => console.error("Error:", error));
});