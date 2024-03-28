const database = include('/databaseConnection');

const passwordPepper = "SeCretPeppa4MySal+";

function getAllUsers(callback) {
	let sqlQuery = "SELECT web_user_id, first_name, last_name, email FROM web_user";
	database.query(sqlQuery, (err, results, fields) => {
		if (err) {
			callback(err, null);
		}
		else {
			console.log(results);
			callback(null, results);
		}		
	});
}

function addUser(postData, callback) {
	let sqlInsertSalt = "INSERT INTO web_user (first_name, last_name, email, password_salt) VALUES (:first_name, :last_name, :email, sha2(UUID(),512));";
	let params = {	
			first_name: postData.first_name,
			last_name: postData.last_name,
			email: postData.email
		};
	console.log(sqlInsertSalt);
	database.query(sqlInsertSalt, params, (err, results, fields) => {
		if (err) {
			console.log(err);
			callback(err, null);
		}
		else {
			let insertedID = results.insertId;
			let updatePasswordHash = "UPDATE web_user SET password_hash = sha2(concat(:password,:pepper,password_salt),512) WHERE web_user_id = :userId;"
			let params2 = {
				password: postData.password,
				pepper: passwordPepper,
				userId: insertedID
			}
			console.log(updatePasswordHash);
			database.query(updatePasswordHash, params2, (err, results, fields) => {
				if (err) {
					console.log(err);
					callback(err, null);
				}
				else {
					console.log(results);
					callback(null, results);
				}
			});
		}
	});
}

function deleteUser(webUserId, callback) {
	let sqlDeleteUser = "DELETE FROM web_user WHERE web_user_id = :userID";
	let params = {
		userID: webUserId
	};
	console.log(sqlDeleteUser);
	database.query(sqlDeleteUser, params, (err, results, fields) => {
		if (err) {
			callback(err, null);
		}
		else {
			console.log(results);
			callback(null, results);
		}		
	});	
}

module.exports = {getAllUsers, addUser, deleteUser}
