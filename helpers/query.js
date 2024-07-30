/**
 *  query.js
 *  The script contains the DB class to interact with the database for this project 
 *  Required modules:
 *    pg: node.js module that interacts with Postgres database
 *    console-table-printer: node.js module that pretty prints a table
*/
const { Pool } = require("pg");
const { printTable } = require('console-table-printer');

/**
 *  class DB
 *  inititiates a pool connection with the database by constructor and 
 *  contains queries and ending methods 
 */
class DB {
  constructor() {
    this.pool = new Pool({
      user: 'postgres',
      password: '12345678',
      host: 'localhost',
      database: 'hr_db'
    },
      console.log(`Connected to the hr_db database.`)
    )
  }

/**
 *  end()
 *  end the pool connection
 *  @returns {void}
 */
  end(){
    this.pool.end();
  }

/**
 *  async getDept()
 *  Get the currently available departments from the DB
 *  @returns {array} contains the names of the departments 
 */
  async getDept() {
    try {
      const { rows } = await this.pool.query("SELECT name FROM department");
      const deptList = [];
      rows.forEach((dept) =>  deptList.push(dept.name));
      // console.log(deptList);
      return deptList;
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async getRole()
 *  Get the currently available roles from the DB
 *  @returns {array} contains the roles
 */
  async getRole() {
    try {
      const { rows } = await this.pool.query("SELECT title FROM role");
      const roleList = [];
      rows.forEach((role) =>  roleList.push(role.title));
      // console.log(roleList);
      return roleList;
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async getEmployee()
 *  Get the currently available employees from the DB
 *  @returns {array} contains the employees
 */
  async getEmployee() {
    try {
      const { rows } = await this.pool.query(`
        SELECT 
          CONCAT(first_name, ' ', last_name) AS name 
        FROM 
          employee`);
      const employeeList = [];
      rows.forEach((employee) =>  employeeList.push(employee.name));
      employeeList.unshift("None");
      // console.log(employeeList);
      return employeeList;
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async showEmployeeByDept()
 *  show employees by department in a table.  Also shows those departments without an employee.
 *  @returns {void} 
 */
  async showEmployeeByDept() {
    try {
      const { rows } = await this.pool.query(`
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
          department.id ASC`
      );
      printTable(rows);
      console.log("");
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async showEmployeeByManager()
 *  show employees by manager in a table.
 *  @returns {void} 
 */
  async showEmployeeByManager() {
    try {
      const { rows } = await this.pool.query(`
        SELECT 
          employee.id,
          CONCAT(employee.first_name, ' ', employee.last_name) AS manager,
          CONCAT(e.first_name, ' ', e.last_name) AS employee
        FROM 
          employee
        JOIN 
          employee e ON employee.id = e.manager_id
        ORDER BY
          employee.id ASC`
      );
      printTable(rows);
      console.log("");
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async showUtilizedBudgetByDept()
 *  show utilized budget by department
 *  @returns {void} 
 */
  async showUtilizedBudgetByDept() {
    try {
      const { rows } = await this.pool.query(`
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
          department.id ASC`
      );
      console.log("");
      printTable(rows);
      console.log("");
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async showAllDepartments()
 *  show all departments in a table
 *  @returns {void} 
 */
async showAllDepartments() {
  try {
    const { rows } = await this.pool.query("SELECT * FROM department");
    console.log("");
    printTable(rows);
    console.log("");
  } catch (err) {
    console.log(err);
  }
}

/**
 *  async showAllRoles()
 *  show all roles in a table
 *  @returns {void} 
 */
  async showAllRoles() {
    try {
      const { rows } = await this.pool.query(`
        SELECT 
          role.id AS id,
          title,
          name AS department,
          salary
        FROM 
          role
        JOIN 
          department ON role.department_id = department.id`
      );
      console.log("");
      printTable(rows);
      console.log("");
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async showAllEmployees()
 *  show all employees in a table
 *  @returns {void} 
 */
  async showAllEmployees() {
    try {
      const { rows } = await this.pool.query(`
        SELECT 
          employee.id,
          employee.first_name,
          employee.last_name,
          title,
          name AS department,
          salary,
          CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM 
          employee
        JOIN 
          role ON employee.role_id = role.id
        JOIN 
          department ON role.department_id = department.id
        LEFT JOIN 
          employee m ON employee.manager_id = m.id`
      );
      console.log("");
      printTable(rows);
      console.log("");
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async addDept(name)
 *  Add a new depatment to the database
 *  @param {string} name The name of the new department
 *  @returns {void} 
 */
  async addDept(name) {
    try {
      await this.pool.query(`INSERT INTO department (name) VALUES ($1)`, [name]);
      console.log("\nAdded department " + name + ".");
      await this.showAllDepartments();
    } catch (err) {
      console.log(err);
    }
  }

 /**
 *  async addRole(newRole)
 *  Add a new role to the database and show all roles afterward
 *  @param {object} newRole Contains the info of the new role {title, salary, department}
 *  @returns {void} 
 */ 
  async addRole(newRole) {
    const {title, salary, department} = newRole;
    try {
      await this.pool.query(`
        INSERT INTO 
          role (title, salary, department_id) 
        VALUES 
          ($1, $2, (SELECT id FROM department WHERE name = $3))`, 
        [title, salary, department]
      );
      console.log("\nAdded role " + title + ".");
      await this.showAllRoles();
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async addEmployee(newEmployee)
 *  Add a new employee to the database and show all employees afterward
 *  @param {object} newEmployee Contains the info of the new employee {firstName, lastName, role, manager}
 *  @returns {void} 
 */ 
  async addEmployee(newEmployee) {
    const {firstName, lastName, role, manager} = newEmployee;
    try {
      // take different query based on whether the new employee has a manager
      switch (manager) {
        case "None":
          await this.pool.query(`
            INSERT INTO 
              employee (first_name, last_name, role_id) 
            VALUES 
              ($1, $2, (SELECT id FROM role WHERE title = $3))`,
            [firstName, lastName, role]
          );
          break;
        default:
          // if there is a manager, get the manager_id by the manager name
          const managerName = manager.split(" ");
          const managerID = (await this.pool.query(`
            SELECT 
              id 
            FROM 
              employee 
            WHERE 
              first_name = $1 AND last_name = $2`, 
            [...managerName])).rows[0].id;
          await this.pool.query(`
            INSERT INTO 
              employee (first_name, last_name, role_id, manager_id) 
            VALUES 
              ($1, $2, (SELECT id FROM role WHERE title = $3), $4)`,
            [firstName, lastName, role, managerID]
          );
          break;
      }
      console.log("\nAdded Employee " + firstName + " " + lastName + ".");
      await this.showAllEmployees();
    } catch (err) {
      console.log(err);
    }
  }

/**
 *  async updateEmployeeRole(chosenOne)
 *  Assign a new role to an employee and show all employees afterward
 *  @param {object} chosenOne Contains the selected employee and the new role {name, role}
 *  @returns {void} 
 */ 
  async updateEmployeeRole(chosenOne) {
    const {name, role} = chosenOne;
    const fullName = name.split(" ");

    try {
      // get the role_id by the title
      const roleID = (await this.pool.query(`
        SELECT 
          id 
        FROM 
          role 
        WHERE 
          title = $1`, 
        [role])).rows[0].id;
      await this.pool.query(`
        UPDATE 
          employee 
        SET 
          role_id = $1
        WHERE 
          first_name = $2 AND last_name = $3`,
        [roleID, ...fullName]
      );
      console.log("\nUpdated Employee " + name + "with a new role " + role + ".");
      await this.showAllEmployees();
    } catch (err) {
      console.log(err);
    }
  }
}

//expose the DB class as this should be used as an instance.
module.exports = DB;