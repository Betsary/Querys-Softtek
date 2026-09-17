const pool = require('../db');

const getVisitorsService = async (req, res) => {
    const { service } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visitors WHERE service = ${1}',
            [service]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitantes por servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getVisitorsBoth = async (req, res) => {
    const { service1, service2 } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visitors WHERE service = ${1} AND service = ${2}',
            [service1, service2]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitantes por ambos servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getVisitorsNone = async (req, res) => {
    const { service1, service2 } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visitors WHERE service != ${1} AND service != ${2}',
            [service1, service2]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitantes por ningun servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getVisitorsByAgeRange = async (req, res) => {
    const { minAge, maxAge } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visitors WHERE age >= ${1} AND age <= ${2}',
            [minAge, maxAge]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitantes por rango de edad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getVisitorsByGender = async (req, res) => {
    const { gender } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visitors WHERE gender = ${1}',
            [gender]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitantes por género:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getVisitorsByDepartment = async (req, res) => {
    const { department } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visitors WHERE department = ${1}',
            [department]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitantes por departamento:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getVisitsUser = async (req, res) => {
    const { userId } = req.query;

    try {
        const result = await pool.query(
            'SELECT * FROM visits WHERE user_id = ${1}',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener visitas por usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    getVisitorsService,
    getAllUsers,
    getVisitorsBoth,
    getVisitorsNone,
    getVisitorsByAgeRange,
    getVisitorsByGender,
    getVisitorsByDepartment,
    getVisitsUser
};