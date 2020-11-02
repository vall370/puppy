const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let jobscollected = new Schema(
    {
        jobID: {
            type: String
        },
        jobTitle: {
            type: String
        },
        jobTitleInfo: {
            type: String
        },
        jobDescription: {
            type: String
        },
        jobSector: {
            type: String
        },
        jobContactInfo: {
            type: Array
        },
        jobInfo: {
            type: Array
        },
        jobApplyLink: {
            type: String,
            required: false,
        },
        jobLink: {
            type: String
        },
        jobAppliedBy: {
            type: Array,
            required: false
        }
    },
    { collection: "jobscollected" }
);

module.exports = mongoose.model("jobscollected", jobscollected);