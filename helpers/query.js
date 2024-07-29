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

  async showAllDepartments() {
    try {
      const { rows } = await this.pool.query("SELECT * from department");
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async showAllRoles() {
    try {
      const { rows } = await this.pool.query("SELECT * from role");
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async showAllEmployees() {
    try {
      const { rows } = await this.pool.query("SELECT * from employee");
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }

  async addDept(name) {
    try {
      console.log(name +"lalalala");
      await this.pool.query(`INSERT INTO department (name) VALUES ($1)`, [name]);
      const { rows } = await this.pool.query("SELECT * from department");
      console.log("\n");
      printTable(rows);
      console.log("\n");
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = DB;