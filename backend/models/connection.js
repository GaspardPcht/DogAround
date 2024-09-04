const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString, {connectTimeoutMs: 2000})
	.then(() => console.log('Data Connected'))
		.catch(error => console.error('error'));

