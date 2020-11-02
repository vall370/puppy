const axios = require('axios');
const PlatsbankenModel = require('./Platsbanken.model');
const mongoose = require("mongoose");
var uri = "mongodb://localhost:27017/jobHunter";
mongoose.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
const connection = mongoose.connection;
connection.once("open", function () {
    console.log("MongoDB database connection established successfully");
});

(async () => {
  const res = await  axios.get(`https://jobstream.api.jobtechdev.se/snapshot`, {
  headers: {
    'api-key': 'YidMXHhlN1x4OTF7Vlx4Y2FceGU3XHg5Zlx4OWFceGE1aFx4OWJOa3ZGXHgxOFx4ZDNcbnUn'
  }})
    // console.log("The data has been scraped and saved successfully! View it at './data.json'");
    let data = res.data;
for (let i = 0; i < data.length; i++) {
    let description
    if (data[i]['description']) {
        description = data[i]['description']['text_formatted']
    } else {
        description = null
    }
    let typeof_driving_license
    if (data[i]['driving_license']) {
        typeof_driving_license = data[i]['driving_license']['label']
    } else {
        typeof_driving_license = null
    }
    let employment_type
    if (data[i]['employment_type']) {
        employment_type = data[i]['employment_type']['label']
    } else {
        employment_type = null
    }

    let salary_type;
    if (data[i]['employment_type']) {
        salary_type = data[i]['salary_type']['label']
    } else {
        salary_type = null
    }
    let duration;
    if (data[i]['duration']) {
        duration = data[i]['duration']['label']
    } else {
        duration = null
    }
    let working_hours_type;
    if (data[i]['working_hours_type']) {
        working_hours_type = data[i]['working_hours_type']['label']
    } else {
        working_hours_type = null
    }
    let occupation;
    if (data[i]['occupation']) {
        occupation = data[i]['occupation']['label']
    } else {
        occupation = null
    }
    let occupation_group;
    if (data[i]['occupation_group']) {
        occupation_group = data[i]['occupation_group']['label']
    } else {
        occupation_group = null
    }
    let occupation_field;
    if (data[i]['occupation_field']) {
        occupation_field = data[i]['occupation_field']['label']
    } else {
        occupation_field = null
    }
    var object = {
        _id: data[i]['id'],
        external_id: data[i]['external_id'],
        webpage_url: data[i]['webpage_url'],
        logo_url: data[i]['logo_url'],
        headline: data[i]['headline'],
        application_deadline: data[i]['application_deadline'],
        number_of_vacancies: data[i]['number_of_vacancies'],
        description: description,
        employment_type: employment_type,
        salary_type: salary_type,
        salary_description: data[i]['salary_description'],
        duration: duration,
        working_hours_type: working_hours_type,
        scope_of_work: data[i]['scope_of_work'],
        access: data[i]['access'],
        employer: data[i]['employer'],
        application_details: data[i]['application_details'],
        experience_required: data[i]['experience_required'],
        access_to_own_car: data[i]['access_to_own_car'],
        driving_license_required: data[i]['driving_license_required'],
        driving_license: typeof_driving_license,
        occupation: occupation,
        occupation_group: occupation_group,
        occupation_field: occupation_field,
        workplace_address: data[i]['workplace_address'],
        must_have: data[i]['must_have'],
        nice_to_have: data[i]['nice_to_have'],
        publication_date: data[i]['publication_date'],
        last_publication_date: data[i]['last_publication_date'],
        removed: data[i]['removed'],
        removed_date: data[i]['removed_date'],
        source_type: data[i]['source_type'],
        timestamp: new Date(data[i]['timestamp']),
    };
    // console.log(object)
    PlatsbankenModel.findOneAndUpdate({_id: object._id},
        object,
        {upsert: true, new: true},
        function (err, result){
            if (err){
                // console.log(err);
                console.log('%c%s', 'color: #ff0000', object._id);
            } else{
                // console.log(result);
                console.log('%c%s', 'color: #00e600', result._id);
            }
        })
    // PlatsbankenModel.create(object, function (err, result) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         // console.log(result);
    //     }
    // });
}
// process.exit(0)

})();
// let data1 = JSON.stringify(array);

// fs.writeFile('platsbanken.json', data1, (err) => {
//     if (err) throw err;
//     console.log('Data written to file');
// });

// console.log('This is after the write call');