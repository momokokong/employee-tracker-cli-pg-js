/**
 *  index.js
 *  This is the start of the employee tracker and inits necessary stuff.
 *  Required modules:
 *    figlet: node.js module that handles ascii art
 *    ./helpers/prompt: the js file handles all the CLI prompts in the project
 *    ./helpers/query: the js file handles all interaction with the database in the project
*/
const figlet = require("figlet");
const cli = require("./helpers/prompt")
const DB = require("./helpers/query");

/**
 *  function printWelcomeScreen()
 *  Function to print the welcome ascii art by node module figlet
 */
function printWelcomeScreen() {
  console.log(
    figlet.textSync("Employee Tracker ========>", {
      horizontalLayout: "full",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
}

/**
 *  function printEndingScreen()
 *  Function to print the ending ascii art by node module figlet
 */
function printEndingScreen() {
  console.log(
    figlet.textSync("<======== Employee Tracker", {
      horizontalLayout: "full",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
}

/**
 *  async function init()
 *  init the database pool instance, welcome screen, CLI interaction, ending screen and end the pool.
 */
async function init() {
  const db = new DB();
  printWelcomeScreen();
  await cli.start(db);
  printEndingScreen();
  db.end();  
}

init();
