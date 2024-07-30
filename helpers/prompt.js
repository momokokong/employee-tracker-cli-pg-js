/**
 *  prompt.js
 *  The script file handles all CLI interactions 
 *  Required modules:
 *    inquirer: node.js module that handles prompts
 *    validator: node.js module that validate the input from users
*/
const inquire = require("inquirer");
const validator = require("validator");

/**
 *  Global variable
 *  menu is an array of strings that contains the hard coded questions for the top menu
*/
const menu = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
  "View employees by manager",
  "View employees by department",
  "View utilized budget by department",
  "Buh-bye!"
]

/**
 *  function checkInputNumber(str)
 *  validate the user input as numbers
 *  @param {string} str The user input
 *  @returns {boolean} validity of the user input
 */
function checkInputNumber(str) {
  if (!validator.isEmpty(str.trim()) && validator.isNumeric(str.trim())) {
    return true;
  }
  return "You must enter a number.  Try again.";
}

/**
 *  function checkInputText(str)
 *  validate the user input as Text less than 31 chars
 *  @param {string} str The user input
 *  @returns {boolean} validity of the user input
 */
function checkInputText(str) {
  if (!validator.isEmpty(str.trim()) && str.trim().length < 31) {
    return true;
  }
  return "You must enter something up to 30 characters.  Try again.";
}

/**
 *  function checkInputName(str)
 *  validate the user input as Text less than 31 chars
 *  @param {string} str The user input
 *  @returns {boolean} validity of the user input
 */
function checkInputName(str) {
  if (!validator.contains(str.trim(), [" "])) {
    return true;
  }
  return "You must enter a name that does not contain a space.  Try again.";
}

/**
 *  async function collectNewDept()
 *  prompt the user and collect the name of the new departmemnt
 *  @returns {string} the name of the new department
 */
async function collectNewDept() {
  const newDept = await inquire.prompt([
    {
      type: 'input',
      message: "What is the new department?\n",
      name: "name",
      validate: checkInputText
    }
  ]);
  return newDept.name;
}

/**
 *  async function collectNewRole(db)
 *  prompt the user and collect the info of the new role
 *  @param {object} db The database instance used by this proejct
 *  @returns {object} contains role info collected from the user { title, salary, department }
 */
async function collectNewRole(db) {
  // get a list of current departments from the DB
  const departments = await db.getDept();

  const newRole = await inquire.prompt([
    {
      type: 'input',
      message: "What is the title of the new role?\n",
      name: "title",
      validate: checkInputText
    },
    {
      type: 'input',
      message: "What is the salary of the new role?\n",
      name: "salary",
      validate: checkInputNumber
    },
    {
      type: 'list',
      message: "What is the department of the new role?\n",
      name: "department",
      choices: departments
    }
  ]);
  // console.log(newRole);
  return newRole;
}

/**
 *  async function collectNewEmployee(db)
 *  prompt the user and collect the info of the new employee
 *  @param {object} db The database instance used by this proejct
 *  @returns {object} contains employee info collected from the user { firstName, lastName, role, manager }
 */
async function collectNewEmployee(db) {
  // get a list of current roles and manager candidates from the DB
  const roles = await db.getRole();
  const managers = await db.getEmployee();

  const newEmployee = await inquire.prompt([
    {
      type: 'input',
      message: "First name of the new employee?\n",
      name: "firstName",
      validate: checkInputName
    },
    {
      type: 'input',
      message: "Last name of the new employee?\n",
      name: "lastName",
      validate: checkInputName
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
  // console.log(newEmployee);
  return newEmployee;
}

/**
 *  async function pickEmployeeRole(db)
 *  prompt the user and collect the info of the new role for the selected employee
 *  @param {object} db The database instance used by this proejct
 *  @returns {object} contains role update info { name, role }
 */
async function pickEmployeeRole(db) {
  // get a list of current roles and employees from the DB
  const roles = await db.getRole();
  const employees = await db.getEmployee();

  const chosenOne = await inquire.prompt([
    {
      type: 'list',
      message: "Who has a new role?\n",
      name: "name",
      choices: employees
    },
    {
      type: 'list',
      message: "What's the new role?\n",
      name: "role",
      choices: roles
    }
  ]);
  // console.log(chosenOne);
  return chosenOne;
}

/**
 *  async function start(db)
 *  prompt the user with the main menu and and trigger the chosen action
 *  @param {object} db The database instance used by this proejct
 *  @returns {void} when the function ends it break the loop therfore end the CLI interaction
 */
async function start(db) {
  while (true) { 
    const what = await inquire.prompt([
      {
        type: 'list',
        message: "What do you want to do?\n",
        name: "todo",
        choices: menu
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
        const chosenOne = await pickEmployeeRole(db);
        await db.updateEmployeeRole(chosenOne);
        break;
      case "View employees by manager":
        await db.showEmployeeByManager();
        break;
      case "View employees by department":
        await db.showEmployeeByDept();
        break;
      case "View utilized budget by department":
        await db.showUtilizedBudgetByDept();
        break;
      case "Buh-bye!":
        return;
    }
  }
}

// only expose start()
module.exports = { start } ;