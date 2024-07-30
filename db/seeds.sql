-- seeds the 3 tables - department, role and employee

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