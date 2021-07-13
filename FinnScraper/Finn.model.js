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
        },
        location: {
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
          }
    },
    { collection: "testCollection" }
);

module.exports = mongoose.model("testCollection", FinnCollection);