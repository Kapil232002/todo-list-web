import React, { useState, useEffect } from "react";


function App() {
  const [todos, setTodos] = useState([]);
  const [username, setUsername] = useState("");
  const [task, setTask] = useState("");
  const apiBase = "http://localhost:8000";

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(`${apiBase}/tasks`);
    const data = await res.json();
    setTodos(data.tasks);
  };

  // Add task
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { username, todo: task };
    await fetch(`${apiBase}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setUsername("");
    setTask("");
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${apiBase}/delete/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  return (
    <div>
      {/* Form Section */}
      <div id="container" className="d-flex justify-content-center align-items-center p-4">
        <form id="todoForm" onSubmit={handleSubmit}>
          <h1 className="text-center text-primary">Create Todos</h1>
          <hr />
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label><br />
            <input
              type="text"
              name="username"
              className="form-control"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="todos" className="form-label">Enter your Task</label><br />
            <textarea
              name="todos"
              className="form-control"
              id="todos"
              rows="4"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            ></textarea>
          </div>
          <br />
          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>

      <hr />
      <h1 className="text-center text-success">List</h1>

      {/* Table Section */}
      <div id="container1" className="p-4">
        <table className="table table-bordered table-striped table-hover w-100">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Username</th>
              <th scope="col">Task's List</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody id="todoTable">
            {todos.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.username}</td>
                <td>
                  <ul>
                    {item.todo
                      .split("\n")
                      .filter((line) => line.trim() !== "")
                      .map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteTask(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
