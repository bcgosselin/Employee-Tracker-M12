USE employeetracker_db;

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
    employees AS manager ON employees.manager_id = manager.id;
