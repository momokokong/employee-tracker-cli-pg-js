-- contains some test queries used by this project.  

-- Show all employees
\echo 'Show all employees'
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
\echo 'Show all roles'
SELECT 
  role.id AS id,
  title,
  name AS department,
  salary
FROM role
JOIN department ON role.department_id = department.id;

-- show employees by department, including departments with no employee
\echo 'show employees by department, including departments with no employee'
SELECT 
  department.id,
  name AS department,
  CONCAT(employee.first_name, ' ', employee.last_name) AS employee
FROM 
  department
LEFT JOIN 
  role ON department.id = role.department_id
LEFT JOIN 
  employee ON role.id = employee.role_id
ORDER BY
  department.id ASC;

-- show employees by manager
\echo 'show employees by manager'
SELECT 
  employee.id,
  CONCAT(employee.first_name, ' ', employee.last_name) AS manager,
  CONCAT(e.first_name, ' ', e.last_name) AS employee
FROM 
  employee
JOIN 
  employee e ON employee.id = e.manager_id
ORDER BY
  employee.id ASC;

-- show utilized budget by department
\echo 'show utilized budget by department'
SELECT 
  department.id,
  name AS department,
  SUM(salary) AS "utilized budget",
  COUNT(employee.id) AS "Employees"
FROM 
  department
LEFT JOIN 
  role ON department.id = role.department_id
JOIN 
  employee ON role.id = employee.role_id
GROUP BY
  department.id
ORDER BY
  department.id ASC;