// GIVEN a command-line application that accepts user input
import('inquirer').then(async (inquirerModule) => {
    const inquirer = inquirerModule.default;

    const mysql = require('./config/connection');

    // WHEN I start the application
    function start(){
        inquirer
        // THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        .prompt([{
                name: "Select One:",
                type: "list",
                choices: [
                    "View All Departments", 
                    "View All Roles", 
                    "View All Employees",
                    "Exit"
                ]
            }])
            .then(answer => {
                
                switch (answer['Select One:']) {
                    case "View All Departments":
                        viewDepartments();
                        break;
                    case "Add Department":
                        addDepartment();
                        break;
                    case "View All Roles":
                        viewRoles();
                        break;
                    case "Add Role":
                        addRole();
                        break;
                    case "View All Employees":
                        viewEmployees();
                        break;
                    case "Add Employee":
                        addEmployee();
                        break;
                    case "update Employee":
                        updateEmployee();
                        break;
                    case "Exit":
                        console.log("Exiting application.");
                        mysql.end();
                        break;
                }
            });
    }
        
    // Function to view all departments
    // WHEN I choose to view all departments
    function viewDepartments() {
        // logic to retrieve and display all departments from the database
        mysql.query("SELECT * FROM departments", (err, rows) => {
            if (err) throw err;
            // THEN I am presented with a formatted table showing department names and department ids
            console.table(rows);
            
        });
    }

    // Function to view all roles
    // WHEN I choose to view all roles
    function viewRoles() {
        // logic to retrieve and display all roles from the database
        mysql.query("SELECT * FROM roles", (err, rows) => {
            if (err) throw err;
            // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
            console.table(rows);
            
        });
    }

    // Function to view all employees
    // WHEN I choose to view all employees
    function viewEmployees() {
        // logic to retrieve and display all employees from the database
        mysql.query("SELECT * FROM employees", (err, rows) => {
            if (err) throw err;
            // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
            console.table(rows);
            

        });
    }

    // WHEN I choose to add a department
    function addDepartment() {
        
        // THEN I am prompted to enter the name of the department and that department is added to the database

    }      

    // WHEN I choose to add a role
    function addRole() {
        // THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database

    }

    // WHEN I choose to add an employee
    function addEmployee() {
        
        // THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    }

    // WHEN I choose to update an employee role
    function updateEmployee() {

        // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    } 

    // Start the application
    start();

});