import json
from http.server import BaseHTTPRequestHandler, HTTPServer

tasks = []
next_id = 1  # Unique ID for tasks

class SimpleHandler(BaseHTTPRequestHandler):
    def _set_headers(self, content_type="application/json"):
        self.send_response(200)
        self.send_header("Content-type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == "/tasks":
            self._set_headers()
            self.wfile.write(json.dumps({"tasks": tasks}).encode())
        else:
            self._set_headers("text/html")
            try:
                with open("todos.html", "rb") as f:
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.wfile.write(b"File not found.")

    def do_POST(self):
        global next_id
        if self.path == "/add":
            content_length = int(self.headers["Content-Length"])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data)

            tasks.append({
                "id": next_id,
                "username": data.get("username", ""),
                "todo": data.get("todo", "")
            })
            next_id += 1

            self._set_headers()
            self.wfile.write(json.dumps({"tasks": tasks}).encode())

    def do_DELETE(self):
        global tasks
        if self.path.startswith("/delete/"):
            try:
                task_id = int(self.path.split("/")[-1])
                before_count = len(tasks)
                tasks = [t for t in tasks if t["id"] != task_id]
                if len(tasks) == before_count:
                    self.send_error(404, "Task not found")
                    return
                self._set_headers()
                self.wfile.write(json.dumps({"tasks": tasks}).encode())
            except ValueError:
                self.send_error(400, "Invalid task ID")


def run():
    server = HTTPServer(("0.0.0.0", 8000), SimpleHandler)
    print("Server running on http://0.0.0.0:8000")
    server.serve_forever()

if __name__ == "__main__":
    run()