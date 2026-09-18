const pool = require('../db');


//Todos los empleados que fueron a ambos servicios

const getTodosLosEmpleadosRepetidores = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT id,
                nombre,
                apellido,
                genero,
                edad
            FROM vista_empleados_tramposos
        `);

        res.json(rows);

    } catch (error) {
        console.error('Error al obtener empleados repetidores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Todas las mujeres que repitieron

const getMujeresRepetidores = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(Distinct id) AS total_mujeres
            FROM vista_empleados_tramposos
            WHERE genero = 'M';
        `);

        res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener repetidores por género:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Todos los hombres que repitieron

const getHombresRepetidores = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(Distinct id) AS total_hombres
            FROM vista_empleados_tramposos
            WHERE genero = 'H';
        `);

        res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener repetidores por género:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};



//Cantidad total de personas que fueron a ambos servicios

const getTotalRepetidores = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(DISTINCT id) AS total_personas
            FROM vista_empleados_tramposos
        `);

        res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener total de repetidores:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Cantidad de personas que fueron al Masaje

const getTotalMasaje = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(DISTINCT empleados.id) AS total_masaje
            FROM Empleados
            INNER JOIN Masaje
                ON empleados.id = masaje.id_empleado
        `);

        res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener total de masaje:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Cantidad de personas que fueron al Spa

const getTotalSpa = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(DISTINCT empleados.id) AS total_spa
            FROM Empleados
            INNER JOIN Spa
                ON empleados.id = spa.id_empleado
        `);

        res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener total de spa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Distribución de edades 

const getRepetidoresPorEdad = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT
                edad,
                COUNT(DISTINCT id) AS cantidad,
                ROUND(
                    100.0 * COUNT(DISTINCT id) /
                    (
                        SELECT COUNT(DISTINCT id)
                        FROM vista_empleados_tramposos
                    ),
                    2
                ) AS porcentaje
            FROM vista_empleados_tramposos
            GROUP BY edad
            ORDER BY edad
        `);

        res.json(rows);

    } catch (error) {
        console.error('Error al obtener distribución por edad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//Promedio de edad de la gente que fue a ambos servicios

const getPromedioEdad = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT ROUND(AVG(edad), 2) AS promedio
            FROM (
                SELECT DISTINCT id, edad
                FROM vista_empleados_tramposos
            ) AS empleados_unicos
        `);

        res.json(rows[0]);

    } catch (error) {
        console.error('Error al obtener promedio de edad:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    getTodosLosEmpleadosRepetidores,
    getMujeresRepetidores,
    getHombresRepetidores,
    getTotalRepetidores,
    getTotalMasaje,
    getTotalSpa,
    getRepetidoresPorEdad,
    getPromedioEdad
};