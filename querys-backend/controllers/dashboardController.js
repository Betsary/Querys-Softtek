const pool = require('../db');

const getVisitorsServiceA = async (req, res) => {

}

const getVisitorsServiceB = async (req, res) => {

}

const getVisitorsBoth = async (req, res) => {
    
}

const getVisitorsNone = async (req, res) => {

}

const getVisitorsByAgeRange = async (req, res) => {
    const { minAge, maxAge } = req.query;


}

const getVisitorsByGender = async (req, res) => {
    const { gender } = req.query;

    
}

const getVisitorsByDepartment = async (req, res) => {
    const { department } = req.query;

}

const getVisitsUser = async (req, res) => {
    const { userId } = req.query;
}

module.exports = {
    getVisitorsServiceA,
    getVisitorsServiceB,
    getVisitorsBoth,
    getVisitorsNone,
    getVisitorsByAgeRange,
    getVisitorsByGender,
    getVisitorsByDepartment,
    getVisitsUser
};