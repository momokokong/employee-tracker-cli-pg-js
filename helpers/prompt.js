const inquire = require("inquirer");
const validator = require("validator");



const topList = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
  "Buh-bye!"
]

async function collectNewDept() {
  const newDept = await inquire.prompt([
    {
      type: 'input',
      message: "What is the new department?\n",
      name: "name",
    }
  ]);
  return newDept.name;
}

async function collectNewRole(db) {
  const departments = await db.getDept();
  const newRole = await inquire.prompt([
    {
      type: 'input',
      message: "What is the title of the new role?\n",
      name: "title"
    },
    {
      type: 'input',
      message: "What is the salary of the new role?\n",
      name: "salary"
    },
    {
      type: 'list',
      message: "What is the department of the new role?\n",
      name: "department",
      choices: departments
    }
  ]);
  console.log(newRole);
  return newRole;
}

async function collectNewEmployee(db) {
  const roles = await db.getRole();
  const managers = await db.getEmployee();
  const newRole = await inquire.prompt([
    {
      type: 'input',
      message: "First name of the new employee?\n",
      name: "firstName"
    },
    {
      type: 'input',
      message: "Last name of the new employee?\n",
      name: "lastName"
    },
    {
      type: 'list',
      message: "Role of the new employee?\n",
      name: "role",
      choices: roles
    },
    {
      type: 'list',
      message: "Manager of the new employee?\n",
      name: "manager",
      choices: managers
    }
  ]);
  console.log(newRole);
  return newRole;
}

async function start(db) {
  while (true) { 
    const what = await inquire.prompt([
      {
        type: 'list',
        message: "What do you want to do?\n",
        name: "todo",
        choices: topList
      }
    ]);

    switch (what.todo) {
      case "View all departments":
        await db.showAllDepartments();
        break;
      case "View all roles":
        await db.showAllRoles();
        break;
      case "View all employees":
        await db.showAllEmployees();
        break;
      case "Add a department":
        const newDept = await collectNewDept();
        await db.addDept(newDept);
        break;
      case "Add a role":
        const newRole = await collectNewRole(db);
        await db.addRole(newRole);
        break;
      case "Add an employee":
        const newEmployee = await collectNewEmployee(db);
        await db.addEmployee(newEmployee);
        break;
      case "Update an employee role":

        break;
      case "Buh-bye!":
        return;
    }
  }

}


module.exports = { start } ;