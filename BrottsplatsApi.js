const axios = require("axios");
const cluster = require("cluster");
const axiosRetry = require("axios-retry");
const mongoose = require("mongoose");
const BrottsplatsModel = require('./Brottsplats.model');

const uri = "mongodb://localhost:27017/brottisverige";
mongoose.connect(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("MongoDB database connection established successfully");
});
const forks = 16;
const hugeData = [];

axiosRetry(axios, {
  retries: 3, // number of retries
  retryDelay: (retryCount) => {
    console.log(`retry attempt: ${retryCount}`);
    return 65000; // time interval between retries
  },
  retryCondition: (error) => {
    // if retry condition is not specified, by default idempotent requests are retried
    return error.response.status === 429;
  },
});

for (let i = 1; i < 2000000; i++) {
  hugeData.push(i);
}
axios.interceptors.request.use((x) => {
  // to avoid overwriting if another interceptor
  // already defined the same object (meta)
  x.meta = x.meta || {};
  x.meta.requestStartedAt = new Date().getTime();
  return x;
});

axios.interceptors.response.use(
  (x) => {
    console.log(
      `Execution time for: ${x.config.url} - ${
        new Date().getTime() - x.config.meta.requestStartedAt
      } ms`
    );
    return x;
  },
  // Handle 4xx & 5xx responses
  (x) => {
    console.error(
      `Execution time for: ${x.config.url} - ${
        new Date().getTime() - x.config.meta.requestStartedAt
      } ms`
    );
    throw x;
  }
);

const main = async () => {
  const files = hugeData;
  const clusterFiles = files.filter(
    (_, index) => index % forks === cluster.worker.id - 1
  );

  for (const file of clusterFiles) {
    try {
      await axios
        .get(`https://brottsplatskartan.se/api/event/${file}`)
        .then((result) => {
          // console.log("200 res: ", result.data, file);
          let data = result.data.data;
          console.log(data.id);
          var object = {
              _id: data.id,
              datetime: data.parsed_date,
              summary: data.parsed_teaser,
              description: data.parsed_content,
              url: data.permalink,
              type: data.parsed_title,
              plats: data.parsed_title_location,
              county: data.administrative_area_level_1,
              city: data.administrative_area_level_2,
              latitude: data.location_lat,
              longitude: data.location_lng, 
          };
          BrottsplatsModel.findOneAndUpdate(
            { _id: object._id },
            object,
            { upsert: true, new: true },
            function (err, result) {
              if (err) {
                // console.log(err);
                // console.log('%c%s', 'color: #ff0000', object._id);
              } else {
                // console.log(result);
                // console.log('%c%s', 'color: #00e600', object._id);
              }
            }
          );
        })
        .catch((e) => {
          console.log("200 e: ", file);
        });
    } catch (err) {
      // Handle Error Here
      if (err.response.status !== 200) {
        throw new Error(
          `API call failed with status code: ${err.response.status} after 3 retry attempts`
        );
      }
      console.error(err);
    }
  }
};

if (cluster.isMaster) {
  console.log(`[${process.pid}] I am master`);

  for (let i = 0; i < forks; i++) {
    cluster.fork();
  }
} else {
  console.log(`[${process.pid}] I am worker ${cluster.worker.id}`);
  main()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
