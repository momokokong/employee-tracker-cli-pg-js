-- use this file to reset hr_db and seed it after some manipulation.

\c postgres;

DROP DATABASE IF EXISTS hr_db;
CREATE DATABASE hr_db;

\c hr_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) UNIQUE NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUES
    ('Engineering'),
    ('Marketing'),
    ('Warehouse'),
    ('CEO'),
    ('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Software Engineer', '95000', (SELECT id FROM department WHERE name = 'Engineering')),
    ('Frontend Developer', '85000', (SELECT id FROM department WHERE name = 'Engineering')),
    ('Database Administrator', '100000', (SELECT id FROM department WHERE name = 'Engineering')),
    ('Marketing Manager', '75000', (SELECT id FROM department WHERE name = 'Marketing')),
    ('Marketing Analyst', '60000', (SELECT id FROM department WHERE name = 'Marketing')),
    ('CEO', '300000', (SELECT id FROM department WHERE name = 'CEO')),
    ('Sales Manager', '80000', (SELECT id FROM department WHERE name = 'Sales')),
    ('Sales Representative', '65000', (SELECT id FROM department WHERE name = 'Sales')),
    ('Sales Associate', '55000', (SELECT id FROM department WHERE name = 'Sales'));

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Alice', 'Johnson', (SELECT id FROM role WHERE title = 'Software Engineer'), NULL),
    ('Bob', 'Smith', (SELECT id FROM role WHERE title = 'Frontend Developer'), 1),
    ('Charlie', 'Brown', (SELECT id FROM role WHERE title = 'Database Administrator'), 1),
    ('David', 'Lee', (SELECT id FROM role WHERE title = 'Marketing Manager'), NULL),
    ('Emma', 'Davis', (SELECT id FROM role WHERE title = 'Marketing Analyst'), 4),
    ('Frank', 'Wilson', (SELECT id FROM role WHERE title = 'Sales Manager'), NULL),
    ('Grace', 'Taylor', (SELECT id FROM role WHERE title = 'Sales Representative'), 6),
    ('Helen', 'Anderson', (SELECT id FROM role WHERE title = 'Sales Representative'), 6),
    ('Ivy', 'Jackson', (SELECT id FROM role WHERE title = 'Sales Associate'), 6),
    ('Jack', 'White', (SELECT id FROM role WHERE title = 'Sales Associate'), 6);