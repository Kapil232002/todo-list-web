-- --------------------------------------------------
-- How to use this file:
-- --------------------------------------------------
-- 1. Open MySQL Workbench
-- 2. Connect to your MySQL server
-- 3. Open this file (init.sql)
-- 4. Click the lightning bolt icon to run
-- --------------------------------------------------

CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    todo TEXT
);
