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

// function checkText(str)
// validate str on whether the user entered something and is less than 4 chars.  Used by the prompts.
// parameter:
//   str: string, the user's current input
function checkText(str) {
  if (!validator.isEmpty(str.trim()) && str.trim().length < 4) {
    return true;
  }
  return "You must enter something up to 3 characters.  Try again.";
}

// function 
// invoke prompts  
async function start() {
  let loop = true;
    // do {
      inquire.prompt([
      {
        type: 'list',
        message: "What do you want to do?\n",
        name: "todo",
        choices: topList
      }
    ])
    .then((what) => {
      switch (what.todo) {
        case "View all departments":
          console.log(what.todo);
          break;
        case "View all roles":

          break;
        case "View all employees":

          break;
        case "Add a department":

          break;
        case "Add a role":

          break;
        case "Add an employee":

          break;
        case "Update an employee role":

          break;
        case "Buh-bye!":
          process.exit(0);
      }
    })
    .catch((error) => 
      console.log(error)
    ).finally (() => start());
  // } while (loop)
}

module.exports = { start } ;