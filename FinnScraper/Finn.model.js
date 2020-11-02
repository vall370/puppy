const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let FinnCollection = new Schema(
    {
        _id: {
            type: String,
        },
        jobTitle: {
            type: String
        },
        jobDescription: {
            type: String
        },
        jobApplyLink: {
            type: String
        },
        jobLink: {
            type: String
        },
        jobCompany: {
            type: String
        },
        jobPosition: {
            type: String
        },
        jobLatestDate: {
            type: String
        },
        jobFormOfEmployment: {
            type: Array
        },
        jobPosition: {
            type: Array
        },
        jobNetwork: {
            type: String
        },
        jobSector: {
            type: String
        },
        jobCity: {
            type: String
        },
        jobBranch: {
            type: Array
        },
        jobAlternativePositions: {
            type: Array
        },
        jobContactInfo: {
            type: Array
        },
        jobDate: {
            type: Date
        },
        jobPastDate: {
            type: String
        },
        jobEmployerLogo: {
            type: String
        }
    },
    { collection: "testCollection" }
);

module.exports = mongoose.model("testCollection", FinnCollection);