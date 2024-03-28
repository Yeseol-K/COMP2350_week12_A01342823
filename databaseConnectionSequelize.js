const is_heroku = process.env.IS_HEROKU || false;

const dbConfigHeroku = "mysql://b1ab7fb2ee03bc:2a484a2d@us-cdbr-east-03.cleardb.com/heroku_3d208ad4bd6f421";

const dbConfigLocal = "mysql://root:Password@localhost/lab_example";

if (is_heroku) {
	var databaseConnectionString = dbConfigHeroku;
}
else {
	var databaseConnectionString = dbConfigLocal;
}

module.exports = databaseConnectionString;
		