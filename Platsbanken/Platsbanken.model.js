const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let platsbankenCollection = new Schema(
    {
        _id: {
            type: String
        },
        external_id: {
            type: String
        },
        webpage_url: {
            type: String
        },
        logo_url: {
            type: String
        },
        headline: {
            type: String
        },
        application_deadline: {
            type: String
        },
        number_of_vacancies: {
            type: String
        },
        description: {
            type: String
        },
        description: {
            type: String
        },
        conditions: {
            type: String
        },
        salary_type: {
            type: String
        },
        salary_description: {
            type: String
        },
        duration: {
            type: String
        },
        working_hours_type: {
            type: String
        },
        scope_of_work: {
            type: Array
        },
        access: {
            type: String
        },
        employer: {
            type: Array
        },
        application_details: {
            type: Array
        },
        experience_required: {
            type: String
        },
        access_to_own_car: {
            type: String
        },
        driving_license_required: {
            type: String
        },
        driving_license: {
            type: String
        },
        occupation: {
            type: String
        },
        occupation_group: {
            type: String
        },
        occupation_field: {
            type: String
        },
        workplace_address: {
            type: Array
        },
        must_have: {
            type: Array
        },
        nice_to_have: {
            type: Array
        },
        publication_date: {
            type: String
        },
        last_publication_date: {
            type: String
        },
        removed: {
            type: String
        },
        removed_date: {
            type: String
        },
        source_type: {
            type: String
        },
        timestamp: {
            type: Date
        }
    },
    { collection: "Platsbanken" }
);

module.exports = mongoose.model("Platsbanken", platsbankenCollection);