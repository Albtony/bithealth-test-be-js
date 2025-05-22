const db = require('../models');
const Employee = db.Employee;

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.findAll();
        res.status(200).json({
            status: 'success',
            message: 'Employees fetched successfully.',
            data: employees,
            meta: { totalRecords: employees.length },
        });
    } catch (error) {
        console.error('[EmployeeController]: Error fetching employees:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching employees', 
            error: error.message,
        });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found.', 
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Employee fetched successfully.',
            data: employee,
            meta: {},
        });
    } catch (error) {
        console.error('[EmployeeController]: Error fetching employee by ID:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error fetching employee', 
            error: error.message,
        });
    }
};

const createEmployee = async (req, res) => {
    try {
        const {
            username,
            password_hash,
            email,
            first_name,
            last_name,
            phone_number,
            hire_date,
            job_title,
            role_id,
        } = req.body;

        if (!username || !password_hash || !email || !phone_number || !job_title || !role_id) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required employee fields.',
                data: null,
                meta: {},
            });
        }

        const newEmployee = await Employee.create({
            username,
            password_hash,
            email,
            first_name,
            last_name,
            phone_number,
            hire_date,
            job_title,
            role_id,
        });

        res.status(201).json({
            status: 'success',
            message: 'Employee created successfully.',
            data: newEmployee,
            meta: {},
        });
    } catch (error) {
        console.error('[EmployeeController]: Error creating employee:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Username or email already exists.', 
                error: error.message,
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error creating employee', 
            error: error.message,
        });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        delete updateData.employee_id;

        const [affectedRowsCount] = await Employee.update(updateData, {
            where: { employee_id: id },
        });

        if (affectedRowsCount === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found or no changes were made.', 
                data: null,
                meta: {},
            });
        }

        const updatedEmployee = await Employee.findByPk(id);
        res.status(200).json({
            status: 'success',
            message: 'Employee updated successfully.',
            data: updatedEmployee,
            meta: {},
        });
    } catch (error) {
        console.error('[EmployeeController]: Error updating employee:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                status: 'fail',
                message: 'Username or email already exists.', 
                error: error.message,
            });
        }
        res.status(500).json({
            status: 'error',
            message: 'Error updating employee', 
            error: error.message,
        });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRows = await Employee.destroy({
            where: { employee_id: id },
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                status: 'fail',
                message: 'Employee not found.', 
                data: null,
                meta: {},
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Employee deleted successfully.',
            data: null,
            meta: {},
        });
    } catch (error) {
        console.error('[EmployeeController]: Error deleting employee:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error deleting employee',
            error: error.message,
        });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};