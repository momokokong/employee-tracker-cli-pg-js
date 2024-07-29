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

        break;
      case "Add an employee":

        break;
      case "Update an employee role":

        break;
      case "Buh-bye!":
        return;
    }
  }

}


module.exports = { start } ;