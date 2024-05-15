USE employeetracker_db;

INSERT INTO employees (id, first_name, last_name, role_id, department_id, salary, manager_id) VALUES 
(1, 'John', 'Doe', 1, 1, 1, NULL),
(2, 'Mike', 'Chan', 2, 1, 2, 1),
(3, 'Ashley', 'Rodriguez', 3, 2, 3, NULL),
(4, 'Kevin', 'Tupik', 4, 2, 4, 3),
(5, 'Kunal', 'Singh', 5, 3, 5, NULL),
(6, 'Malia', 'Brown', 6, 3, 6, 5),
(7, 'Sarah', 'Lourd', 7, 4, 7, NULL),
(8, 'Tom', 'Allen', 8, 4, 8, 7);