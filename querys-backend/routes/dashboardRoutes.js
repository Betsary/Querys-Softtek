const express = require('express');
const router = express.Router();
const dashBoardController = require('../controllers/dashboardController');

router.post('/services/service', dashBoardController.getVisitorsService);
router.post('/services/both', dashBoardController.getVisitorsBoth);
router.post('/services/none', dashBoardController.getVisitorsNone);
router.post('/services/age-range', dashBoardController.getVisitorsByAgeRange);
router.post('/services/gender', dashBoardController.getVisitorsByGender);
router.post('/services/department', dashBoardController.getVisitorsByDepartment);
router.post('/services/visits-user', dashBoardController.getVisitsUser);
router.get('/services/users', dashBoardController.getAllUsers);

module.exports = router;