// Import and connection
import('inquirer').then(async (inquirerModule) => {
    const inquirer = inquirerModule.default;

    const connection = require('./config/connection');

    // graphic to display when booting application
    function Art() {
        const asciiArt = `
        ___________              .__                               ___________                     __                 
        \\_   _____/ _____ ______ |  |   ____ ___.__. ____   ____   \\__    ___/___________    ____ |  | __ ___________ 
        |    __)_ /     \\____ \\|  |  /  _ <   |  |/ __ \\_/ __ \\    |    |  \\_  __ \\__  \\ _/ ___\\|  |/ // __ \\_  __ \\
        |        \\  Y Y  \\  |_> >  |_(  <_> )___  \\  ___/\\  ___/    |    |   |  | \\// __ \\\\  \\___|    <\\  ___/|  | \\/
        /_______  /__|_|  /   __/|____/\\____// ____|\\___  >\\___  >   |____|   |__|  (____  /\\___  >__|_ \\\\___  >__|   
                \\/      \\/|__|               \\/         \\/     \\/                        \\/     \\/     \\/    \\/       
        `;
        
        console.log(asciiArt);
        
        // run applpication
        start();
    };
    
    // Start application function
    
    function start(){

        inquirer
            // Prompt to select initial operation
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
                    // Switch case to run function aligning with user selected operation
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
                            connection.end();
                            break;
                    }
                });
    }

    // Function to view all departments
    function viewDepartments() {
        // Sql query
        const sql = `
            SELECT
                id,
                name AS department
            FROM
                departments
        
        `
        // Logic to retrieve and display all departments from the database
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            // Formatted table showing department names and department ids
            console.table(rows);
            start();
        });
    }

    // Function to view all roles
    function viewRoles() {
        // Sql query
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
        // Query to retrieve and display all roles from the database
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            // Formatted table with the job title, role id, the department that role belongs to, and the salary for that role
            console.table(rows);
            start();
        });
    }

    // Function to view all employees
    function viewEmployees() {
        // Sql query
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
        // Query to retrieve and display all employees from the database
        connection.query(sql, (err, rows) => {
            if (err) throw err;
            // Table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
            console.table(rows);
            start();

        });
    }

    // Function to choose to add a department
    function addDepartment() {
        
        // Prompt to enter the name of the department
        inquirer
            .prompt({
                name: "name",
                type: "input",
                message: "What is the name of the department?"
            })
            // Department is added to the database
            .then(answer => {
                const departmentName = answer.name;
                connection.query("INSERT INTO departments (name) VALUES (?)", [departmentName], (err, result) => {
                    if (err) throw err;
                    console.log("Department added successfully!");
                    // Go back to the main menu
                    start();
                });
            });
    }
    
    // function to add role
    function addRole() {
        // Query the list of existing departments
        connection.query("SELECT * FROM departments", (err, rows) => {
            if (err) throw err;
            
            // get departments names and push into const
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
                            // Push answer into const
                            const roleName = answer.name;
    
                            // Prompt to enter the salary for the role
                            inquirer
                                .prompt({
                                    name: "salary",
                                    type: "input",
                                    message: "What is the salary of the role?"
                                })
                                .then(answer => {
                                    // Push answer into const
                                    const salary = answer.salary;
    
                                    // Find the ID of the selected department
                                    const departmentId = rows.find(department => department.name === departmentName).id;
    
                                    // Query to push the role into the database
                                    connection.query("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)", [roleName, salary, departmentId], (err, result) => {
                                        if (err) throw err;
                                        console.log("Role added successfully!");
                                        // Go back to the main menu
                                        start();
                                    });
                                });
                        });
                });
        });
    }
    
    function addEmployee() {
        // Query all roles
        connection.query("SELECT * FROM roles", (err, roleRows) => {
            if (err) throw err;
    
            // Get role title and push into const
            const roleChoices = roleRows.map(role => role.title);
    
            // Prompt user for employee's first name
            inquirer
                .prompt({
                    name: "first",
                    type: "input",
                    message: "What is the employee's first name?"
                })
                // Push answer into const
                .then(answer => {
                    const first = answer.first;
    
                    // Prompt user for employee's last name
                    inquirer
                        .prompt({
                            name: "last",
                            type: "input",
                            message: "What is the employee's last name?"
                        })
                        // Push answer into const
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
                                // Push answer into const
                                .then(answer => {
                                    const selectedRole = roleRows.find(role => role.title === answer.role);
    
                                    // Push selected role salary into const
                                    const salary = selectedRole.salary;
    
                                    // Query employees table to get distinct manager full names and their IDs
                                    connection.query("SELECT DISTINCT id, CONCAT(first_name, ' ', last_name) AS manager_name FROM employees WHERE manager_id IS NULL", (err, managerRows) => {
                                        if (err) throw err;
    
                                        // Get manager names to use as choices
                                        const managerChoices = managerRows.map(manager => manager.manager_name);
    
                                        // Prompt user to select the employee's manager
                                        inquirer
                                            .prompt({
                                                name: "manager",
                                                type: "list",
                                                message: "Who is the employee's manager?",
                                                choices: managerChoices
                                            })
                                            // Push answer into const
                                            .then(answer => {
                                                const selectedManager = managerRows.find(manager => manager.manager_name === answer.manager);
    
                                                // Push the new employee into the database with the  role ID, selected manager ID, and salary
                                                connection.query("INSERT INTO employees (first_name, last_name, role_id, manager_id, salary) VALUES (?, ?, ?, ?, ?)", [first, last, selectedRole.id, selectedManager.id, salary], (err, result) => {
                                                    if (err) throw err;
                                                    console.log("Employee added successfully!");
                                                    // Go back to the main menu
                                                    start();
                                                });
                                            });
                                    });
                                });
                        });
                });
        });
    }
    
    
    

    function updateEmployee() {
        // Query employees table to fetch all employees
        connection.query("SELECT * FROM employees", (err, employeeRows) => {
            if (err) throw err;
    
            // Push employees full name into const 
            const employeeChoices = employeeRows.map(employee => `${employee.first_name} ${employee.last_name}`);
    
            // Prompt user to select the employee to update
            inquirer
                .prompt({
                    name: "employee",
                    type: "list",
                    message: "Which employee's role do you want to update?",
                    choices: employeeChoices
                })
                // Push answer into const
                .then(answer => {
                    const selectedEmployee = employeeRows.find(employee => `${employee.first_name} ${employee.last_name}` === answer.employee);
    
                    // Get all roles
                    connection.query("SELECT * FROM roles", (err, roleRows) => {
                        if (err) throw err;
    
                        // Extract role titles to use as choices in the role selection prompt
                        const roleChoices = roleRows.map(role => role.title);
    
                        // Prompt user to select the new role for the employee
                        inquirer
                            .prompt({
                                name: "role",
                                type: "list",
                                message: `What is ${selectedEmployee.first_name} ${selectedEmployee.last_name}'s new role?`,
                                choices: roleChoices
                            })
                            // Push answer into const
                            .then(answer => {
                                const selectedRole = roleRows.find(role => role.title === answer.role);
    
                                // Update the employee's role in the database
                                connection.query("UPDATE employees SET role_id = ? WHERE id = ?", [selectedRole.id, selectedEmployee.id], (err, result) => {
                                    if (err) throw err;
                                    console.log(`${selectedEmployee.first_name} ${selectedEmployee.last_name}'s role has been updated successfully!`);
                                    // Go back to the main menu
                                    start();
                                });
                            });
                    });
                });
        });
    }
    

    // Run graphic
    Art();

});