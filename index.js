
const figlet = require("figlet");
const cli = require("./helpers/prompt")
const DB = require("./helpers/query");

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

async function init() {
  const db = new DB();
  printWelcomeScreen();
  await cli.start(db);
  printEndingScreen();
  db.end();  
}

init();
