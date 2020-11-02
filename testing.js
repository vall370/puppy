const cluster = require('cluster');
const forks = require('os').cpus().length;
const hugeData = [
    98, 29, 43, 51, 36, 97, 67, 56, 48, 94, 24, 74,
    2, 33, 15, 42, 17, 27, 69, 25, 73, 7, 5, 85,
    39, 71, 10, 79, 55, 99, 91, 21, 65, 82, 47, 40,
    22, 60, 59, 9, 50, 41, 1, 28, 49, 78, 3, 35,
    4, 46, 26, 54, 75, 63, 80, 68, 34, 52, 66, 61,
    23, 31, 38, 86, 44, 6, 18, 13, 87, 57, 58, 11,
    53, 16, 30, 20, 88, 64, 72, 93, 37, 95, 19, 90,
    100, 92, 8, 62, 12, 77, 70, 14, 76, 32, 96, 84,
    45, 89, 83, 81
];

const main = async () => {
	const files = await hugeData;
	const clusterFiles = files.filter(
		(_, index) => index % forks === cluster.worker.id - 1
	)

	for (const file of clusterFiles) {
        async function makeGetRequest() {

            let res = await axios.get(`https://jsonplaceholder.typicode.com/todos/${file[i]}`);

            let data = res.data;
              console.log(i, worker.id);
        }
        makeGetRequest();
	}
}

if (cluster.isMaster) {
	console.log(`[${process.pid}] I am master`)

	for (let i = 0; i < forks; i++) {
		cluster.fork()
	}
} else {
	// console.log(`[${process.pid}] I am worker ${cluster.worker.id}`)
	main()
		.then(() => process.exit(0))
		.catch((err) => {
			console.error(err)
			process.exit(1)
		})
}
