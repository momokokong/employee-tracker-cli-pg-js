-- Show all employees
SELECT 
  employee.id,
  employee.first_name,
  employee.last_name,
  title,
  name AS department,
  salary,
  CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee m ON employee.manager_id = m.id; 

-- Show all roles
SELECT 
  role.id AS id,
  title,
  name AS department,
  salary
FROM role
JOIN department ON role.department_id = department.id;

