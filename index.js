// index.js
// This file is the starting point of the SVG generator which prepares the required modules, 

// init the modules as global variables
const figlet = require("figlet");
const cli = require("./helpers/prompt")

function printWelcomeScreen() {
  console.log(
    figlet.textSync("Employee Tracker <========>", {
      horizontalLayout: "full",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
}

function printEndingScreen() {
  console.log(
    figlet.textSync("<========> Employee Tracker", {
      horizontalLayout: "full",
      verticalLayout: "default",
      width: 80,
      whitespaceBreak: true,
    })
  );
}

// function init()
// Prep the user and initiate the generator
function init() {

  printWelcomeScreen();
  cli.start();
  // printEndingScreen();

}

// Function call to initialize app
init();
