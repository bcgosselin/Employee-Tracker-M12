USE employeetracker_db;

INSERT INTO employees (id, first_name, last_name, role_id, department_id, salary, manager_id) VALUES 
(1, 'John', 'Doe', 1, 1, 100000, NULL),
(2, 'Mike', 'Chan', 2, 1, 80000, 1),
(3, 'Ashley', 'Rodriguez', 3, 2, 150000, NULL),
(4, 'Kevin', 'Tupik', 4, 2, 120000, 3),
(5, 'Kunal', 'Singh', 5, 3, 160000, NULL),
(6, 'Malia', 'Brown', 6, 3, 125000, 5),
(7, 'Sarah', 'Lourd', 7, 4, 250000, NULL),
(8, 'Tom', 'Allen', 8, 4, 190000, 7);