// GIVEN a command-line application that accepts user input
import('inquirer').then(async (inquirerModule) => {
    const inquirer = inquirerModule.default;

    const connection = require('./config/connection');

    // WHEN I start the application
    function start(){
        inquirer
        // THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
        .prompt([{
                name: "Select One:",
                type: "list",
                choices: [
                    "View All Departments",
                    "Add Department",
                    "View All Roles",
                    "Add Role",
                    "View All Employees",
                    "Add Employee",
                    "Update Employee",
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
                    case "Update Employee":
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
        const sql = `
            SELECT
                id,
                name AS department
            FROM
                departments
        
        `
        // logic to retrieve and display all departments from the database
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            // THEN I am presented with a formatted table showing department names and department ids
            console.table(rows);
            start();
        });
    }

    // Function to view all roles
    // WHEN I choose to view all roles
    function viewRoles() {
        const sql = `
            SELECT
                roles.id,
                roles.title,
                roles.salary,
                roles.department_id,
                departments.name AS department_id
            FROM
                roles

            INNER JOIN
                departments ON roles.department_id = departments.id
        `
        // logic to retrieve and display all roles from the database
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            // THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
            console.table(rows);
            start();
        });
    }

    // Function to view all employees
    // WHEN I choose to view all employees
    function viewEmployees() {
        const sql = `
            SELECT
                employees.id,
                employees.first_name,
                employees.last_name,
                roles.title AS roles,
                departments.name AS department,
                roles.salary AS salary,
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager
            FROM 
                employees
                
            INNER JOIN
                roles ON employees.role_id = roles.id
            INNER JOIN
                departments ON roles.department_id = departments.id
            LEFT JOIN
                employees AS manager ON employees.manager_id = manager.id
        `
        // logic to retrieve and display all employees from the database
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            // THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
            console.table(rows);
            start();

        });
    }

    // WHEN I choose to add a department
    function addDepartment() {
        
        // THEN I am prompted to enter the name of the department and that department is added to the database
        inquirer
            .prompt({
                name: "name",
                type: "input",
                message: "What is the name of the department?"
            })
            .then(answer => {
                const departmentName = answer.name;
                connection.query("INSERT INTO departments (name) VALUES (?)", [departmentName], (err, result) => {
                    if (err) throw err;
                    console.log("Department added successfully!");
                    start(); // Go back to the main menu
                });
            });
    }

    function addRole() {
        // Get the list of existing departments
        connection.query("SELECT * FROM departments", (err, rows) => {
            if (err) throw err;
            
            const departmentChoices = rows.map(department => department.name);
    
            // Prompt to select the department for the role
            inquirer
                .prompt({
                    name: "department",
                    type: "list",
                    message: "Which department does this role belong to?",
                    choices: departmentChoices
                })
                .then(answer => {
                    const departmentName = answer.department;
    
                    // Prompt to enter the name for the role
                    inquirer
                        .prompt({
                            name: "name",
                            type: "input",
                            message: "What is the name of the role?"
                        })
                        .then(answer => {
                            const roleName = answer.name;
    
                            // Prompt to enter the salary for the role
                            inquirer
                                .prompt({
                                    name: "salary",
                                    type: "input",
                                    message: "What is the salary of the role?"
                                })
                                .then(answer => {
                                    const salary = answer.salary;
    
                                    // Find the ID of the selected department
                                    const departmentId = rows.find(department => department.name === departmentName).id;
    
                                    // Insert the role into the database
                                    connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [roleName, salary, departmentId], (err, result) => {
                                        if (err) throw err;
                                        console.log("Role added successfully!");
                                        start(); // Go back to the main menu
                                    });
                                });
                        });
                });
        });
    }
    
    function addEmployee() {
        // Query roles table to fetch all roles
        connection.query("SELECT * FROM roles", (err, roleRows) => {
            if (err) throw err;
    
            // Extract role titles to use as choices in the inquirer prompt
            const roleChoices = roleRows.map(role => role.title);
    
            // Prompt user for employee's first name
            inquirer
                .prompt({
                    name: "first",
                    type: "input",
                    message: "What is the employee's first name?"
                })
                .then(answer => {
                    const first = answer.first;
    
                    // Prompt user for employee's last name
                    inquirer
                        .prompt({
                            name: "last",
                            type: "input",
                            message: "What is the employee's last name?"
                        })
                        .then(answer => {
                            const last = answer.last;
    
                            // Prompt user to select the employee's role
                            inquirer
                                .prompt({
                                    name: "role",
                                    type: "list",
                                    message: "What is the employee's role?",
                                    choices: roleChoices
                                })
                                .then(answer => {
                                    const selectedRole = roleRows.find(role => role.title === answer.role);
    
                                    // Fetch the corresponding salary from roles table based on the selected role
                                    const salary = selectedRole.salary;
    
                                    // Query employees table to fetch distinct manager names and their corresponding IDs
                                    connection.query("SELECT DISTINCT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees WHERE manager_id IS NULL", (err, managerRows) => {
                                        if (err) throw err;
    
                                        // Extract manager names to use as choices in the manager selection prompt
                                        const managerChoices = managerRows.map(manager => manager.manager_name);
    
                                        // Prompt user to select the employee's manager
                                        inquirer
                                            .prompt({
                                                name: "manager",
                                                type: "list",
                                                message: "Who is the employee's manager?",
                                                choices: managerChoices
                                            })
                                            .then(answer => {
                                                const selectedManager = managerRows.find(manager => manager.manager_name === answer.manager);
    
                                                // Insert the new employee into the database with the retrieved role ID, selected manager ID, and salary
                                                connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id, salary) VALUES (?, ?, ?, ?, ?)", [first, last, selectedRole.id, selectedManager.id, salary], (err, result) => {
                                                    if (err) throw err;
                                                    console.log("Employee added successfully!");
                                                    start(); // Go back to the main menu
                                                });
                                            });
                                    });
                                });
                        });
                });
        });
    }
    
    
    

    // WHEN I choose to update an employee role
    function updateEmployee() {

        // THEN I am prompted to select an employee to update and their new role and this information is updated in the database
    }

    // Start the application
    start();

});