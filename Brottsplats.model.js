const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let Brotts = new Schema(
    {
        _id: {
            type: String
        },
        datetime: {
            type: String
        },
        summary: {
            type: String
        },
        description: {
            type: String
        },
        url: {
            type: String
        },
        type: {
            type: String
        },
        plats: {
            type: String
        },
        county: {
            type: String
        },
        city: {
            type: String
        },
        latitude: {
            type: String
        },
        longitude: {
            type: String
        }
    },
    { collection: "Brotts" }
);

module.exports = mongoose.model("Brotts", Brotts);