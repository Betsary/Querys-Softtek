const express = require('express');

const router = express.Router();

const dashBoardController = require('../controllers/dashboardController');


// Todos los empleados que fueron a ambos servicios
router.get(
    '/services/repetidores',
    dashBoardController.getTodosLosEmpleadosRepetidores
);


// Cantidad de mujeres que fueron a ambos servicios
router.get(
    '/services/repetidores/mujeres',
    dashBoardController.getMujeresRepetidores
);


// Cantidad de hombres que fueron a ambos servicios
router.get(
    '/services/repetidores/hombres',
    dashBoardController.getHombresRepetidores
);


// Cantidad total de empleados que fueron a ambos servicios
router.get(
    '/services/repetidores/total',
    dashBoardController.getTotalRepetidores
);


// Cantidad de empleados que fueron a masaje
router.get(
    '/services/masaje/total',
    dashBoardController.getTotalMasaje
);


// Cantidad de empleados que fueron al spa
router.get(
    '/services/spa/total',
    dashBoardController.getTotalSpa
);


// Distribución de edades de empleados que fueron a ambos servicios
router.get(
    '/services/repetidores/edades',
    dashBoardController.getRepetidoresPorEdad
);


// Promedio de edad de empleados que fueron a ambos servicios
router.get(
    '/services/repetidores/promedio-edad',
    dashBoardController.getPromedioEdad
);


module.exports = router;