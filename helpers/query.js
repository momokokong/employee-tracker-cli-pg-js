const { Pool } = require("pg");
const { printTable } = require('console-table-printer');

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

  end(){
    this.pool.end();
  }

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

  async getEmployee() {
    try {
      const { rows } = await this.pool.query("SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee");
      const employeeList = [];
      rows.forEach((employee) =>  employeeList.push(employee.name));
      employeeList.unshift("None");
      console.log(employeeList);
      return employeeList;
    } catch (err) {
      console.log(err);
    }
  }

  async showAllDepartments() {
    try {
      const { rows } = await this.pool.query("SELECT * FROM department");
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

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
          department ON role.department_id = department.id`);
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

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
          employee m ON employee.manager_id = m.id`);
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async addDept(name) {
    try {
      await this.pool.query(`INSERT INTO department (name) VALUES ($1)`, [name]);
      console.log("\nAdded department " + name + ".");
      const { rows } = await this.pool.query("SELECT * from department");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async addRole(newRole) {
    const {title, salary, department} = newRole;
    try {
      await this.pool.query(`INSERT INTO role (title, salary, department_id) VALUES ($1, $2, (SELECT id FROM department WHERE name = $3))`, [title, salary, department]);
      console.log("\nAdded role " + title + ".");
      const { rows } = await this.pool.query("SELECT * from role");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async addEmployee(newEmployee) {
    const {firstName, lastName, role, manager} = newEmployee;
    try {
      switch (manager) {
        case "None":
          await this.pool.query(`
            INSERT INTO employee (first_name, last_name, role_id) 
            VALUES ($1, $2, (SELECT id FROM role WHERE title = $3))`,
            [firstName, lastName, role]);
          break;
        default:
          const managerName = manager.split(" ");
          const managerID = (await this.pool.query(`
            SELECT id from employee 
            WHERE first_name = $1 AND last_name = $2`, 
            [...managerName])).rows[0].id;
          await this.pool.query(`
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ($1, $2, (SELECT id FROM role WHERE title = $3), $4)`,
            [firstName, lastName, role, managerID]);
          break;
      }
      console.log("\nAdded Employee " + firstName + " " + lastName + ".");
      const { rows } = await this.pool.query("SELECT * from Employee");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async updateEmployeeRole(chosenOne) {
    const {name, role} = chosenOne;
    const fullName = name.split(" ");

    try {
      const roleID = (await this.pool.query(`
        SELECT id from role 
        WHERE title = $1`, 
        [role])).rows[0].id;
      await this.pool.query(`
        UPDATE employee 
        SET role_id = $1
        WHERE first_name = $2 AND last_name = $3`,
        [roleID, ...fullName]);
      console.log("\nUpdated Employee " + name + "with a new role " + role + ".");
      const { rows } = await this.pool.query("SELECT * from Employee");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

}

module.exports = DB;