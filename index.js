const inquirer = require('inquirer');
const {
  validateInput
} = require("./src/utils.js");

// Node v10+ includes a promises module as an alternative to using callbacks with file system methods.
const { writeFile } = require('fs').promises;

const Employee = require('./lib/Employee.js')
const Manager = require('./lib/Manager.js')
const Engineer = require('./lib/Engineer.js')
const Intern = require('./lib/Intern.js');

// Use writeFileSync method to use promises instead of a callback function
/*
1. main menu - (options: Add employee, Exit)
2. Add employee: what is your role
  - if intern - ask for school
  - if engineer - ask for github
  - if manager - ask for office number (it's not phone number per mockup in instructions)
3. main menu (again)
*/
//employees array initialized
const EMPLOYEES = [];

//changed name: 'name' to name: 'empname' below to prevent deprecated error
//pass variable so can see employee type in the messages without having to 
//write separate question sets
//12/24/22 try to pass emptype to baseQuestions so don't have to repeat same array for Inqurier
//https://stackoverflow.com/questions/58548293/how-to-pass-parameters-to-a-inquirer-question
(async function () {
let emptype = ``; //initialize - below will be set to manager, intern or engineer to not have to repeat questions array
let baseQuestions = [

  {
    message: `Enter [emptype] name: `,
    name: 'empname',
    type: 'input',
    validate: validateInput(`${emptype} name`),  
  },
  {
    message: `Enter ${emptype} id: `,
    name: 'id',
    type: 'input',
    validate: validateInput(`${emptype} id`),  
  },
  {
    message: `Enter ${emptype} email: `,
    name: 'email',
    type: 'input',
    validate: validateInput(`${emptype} email`),  

  },
]
 //only use these questions in addManager so can customize the prompts and messages better

// const baseQuestionsManager = [
//   {
//     message: 'Enter manager name: ',
//     name: 'empname',
//     type: 'input',
//     validate: validateInput("manager name"),  
//   },
//   {
//     message: 'Enter manager employee id: ',
//     name: 'id',
//     type: 'input',
//     validate: validateInput("manager employee id"),  
//   },
//   {
//     message: 'Enter manager email: ',
//     name: 'email',
//     type: 'input',
//     validate: validateInput("manager email"),  

//   },
// ]

//----------------------------------------------------------------------------
const addManager = async () => {
  emptype = `manager`; 
  let answers
  try{

    answers = await inquirer.prompt([
      ...baseQuestions,
      {  
        message: 'Enter manager office number: ',
        name: 'officeNumber',
        type: 'input',
        validate: validateInput("manager office number"), 
      }
    ]);

    // mainMenu()
  }catch(err){
    console.log('ERROR PROMPTING USER::: \n', err)
  }

  try{
    console.log('answers:', answers)
    // pass the whole answers object as "config" to the class
    // because the structure matches exactly { name: '', id:'', ...}
    // create a new manager
    let newManager = new Manager(answers)
    // push the new employee to the array
    EMPLOYEES.push(newManager)
    mainMenu()
  }catch(err){
    console.log('ERROR CREATING MANAGER CLASS::: \n', err)
  }
}

const addIntern = async () => {
  let emptype = "intern"; 
  let answers
  try{
    answers = await inquirer.prompt([
      ...baseQuestions,
      {
        message: 'Enter school: ',
        name: 'school',
        type: 'input',
        validate: validateInput("school"), 
      }
    ]);
  }catch(err){
    console.log('ERROR PROMPTING USER::: \n', err)
  }

  try{
    console.log('answers:', answers)
    // pass the whole answers object as "config" to the class
    // because the structure matches exactly { name: '', id:'', ...}
    // create a new manager
    let newIntern = new Intern(answers)
    // push the new employee to the array
    EMPLOYEES.push(newIntern)
    mainMenu()
  }catch(err){
    console.log('ERROR CREATING INTERN CLASS::: \n', err)
  }
}

const addEngineer = async () => {
  let emptype = `engineer`; 
  let answers
  try{
    answers = await inquirer.prompt([
      ...baseQuestions,
      {
        message: 'Enter GitHub username: ',
        name: 'githubUsername',
        type: 'input',
        validate: validateInput("GitHub username"), 
      }
    ]);
  }catch(err){
    console.log('ERROR PROMPTING USER::: \n', err)
  }

  try{
    console.log('answers:', answers)
    // pass the whole answers object as "config" to the class
    // because the structure matches exactly { name: '', id:'', ...}
    // create a new manager
    let newEngineer = new Engineer(answers)
    // push the new employee to the array
    EMPLOYEES.push(newEngineer)
    mainMenu()
  }catch(err){
    console.log('ERROR CREATING ENGINEER CLASS::: \n', err)
  }
}

//----------------------------------------------------------------------------
const addEmployee = async () => {
  // ask for the role, and call other functions to handle the chosen role
  let answers = await inquirer.prompt([
    {
      name: 'role',
      type: 'list',
      choices: ['Manager', 'Engineer', 'Intern'],
      default: 'Intern'
    }
  ]);


  switch(answers.role){
    case 'Manager': return addManager()
    case 'Engineer': return addIntern()
    default: addIntern()
  }
}



//----------------------------------------------------------------------------

const mainMenu = async () => {
  //Acceptance criteria state that after starting the app, first prompt is to enter team's manager info
  //check for empty employees array to know the app was just started
  if(!EMPLOYEES.length){   
    return addManager()
  }
  //now enter the other employees
  let answers = await inquirer.prompt([
    {
      name: 'main',
      type: 'list',
      message: 'Would you like to add another Employee?',
      choices: ['Add Engineer', 'Add Intern','Generate HTML (team build complete)','Exit']
     // default: 'Add Engineer'
    }
  ]);
  if(answers.main === 'Exit'){
    if(EMPLOYEES.length === 0){
      console.log('No data, exiting...')
      process.exit(0)
    }
    generateHTML()
  }else{
    addEmployee()
  }
};

const generateHTML = () => {

 let htmlString =  `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${empname}</h1>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${github}</li>
      <li class="list-group-item">LinkedIn: ${linkedin}</li>
    </ul>
  </div>
</div>
</body>
</html>`;
fs.writeFile('index.html', htmlString)
}

// Bonus using writeFileSync as a promise
// const init = () => {
//   promptUser()
//     // Use writeFile method imported from fs.promises to use promises instead of
//     // a callback function
//     .then((answers) => writeFile('index.html', generateHTML(answers)))
//     .then(() => console.log('Successfully wrote to index.html'))
//     .catch((err) => console.error(err));
// };

// init();


mainMenu();
// -------------------------- main menu
// - Add employee or exit
// add employee:
// ------------------------------- addEmployee()
// - choose employee type:
// > manager
// - intern
// - engineer
// => Manager - addManager()
// ---------------------------------------------- addManager()
// enter name:
// enter email:
// enter id:
// enter office number:

// addManager()
})();  //end of async function on line 30