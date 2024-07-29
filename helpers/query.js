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
      console.log(rows);
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async showAllRoles() {
    try {
      const { rows } = await this.pool.query("SELECT * FROM role");
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async showAllEmployees() {
    try {
      const { rows } = await this.pool.query("SELECT * FROM employee");
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
}

module.exports = DB;