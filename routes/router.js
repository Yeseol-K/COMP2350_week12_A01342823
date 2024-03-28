const router = require("express").Router();
const database = include("databaseConnection");
//const dbModel = include('databaseAccessLayer');
//const dbModel = include('staticData');

// const userModel = include('models/web_user');
// const petModel = include('models/pet');

const crypto = require("crypto");
const { v4: uuid } = require("uuid");

const passwordPepper = "SeCretPeppa4MySal+";

router.get("/", async (req, res) => {
  console.log("page hit");
  try {
    // const users = await userModel.findAll({ attributes: ["web_user_id", "first_name", "last_name", "email"] }); //{where: {web_user_id: 1}}
    const userCollection = database.db("lab_example").collection("users");
    const users = await userCollection.find().project({ first_name: 1, last_name: 1, email: 1, _id: 1 }).toArray();
    if (users === null) {
      res.render("error", { message: "Error connecting to MongoDB" });
      console.log("Error connecting to userModel");
    } else {
      console.log(users);
      res.render("index", { allUsers: users });
    }
  } catch (ex) {
    res.render("error", { message: "Error connecting to MongoDB" });
    console.log("Error connecting to MongoDB");
    console.log(ex);
  }
});

router.get("/pets", async (req, res) => {
  console.log("page hit");
  try {
    const pets = await petModel.findAll({ attributes: ["name"] }); //{where: {web_user_id: 1}}
    if (pets === null) {
      res.render("error", { message: "Error connecting to MongoDB" });
      console.log("Error connecting to userModel");
    } else {
      console.log(pets);
      res.render("pets", { allPets: pets });
    }
  } catch (ex) {
    res.render("error", { message: "Error connecting to MongoDB" });
    console.log("Error connecting to MongoDB");
    console.log(ex);
  }
});

router.get("/showPets", async (req, res) => {
  console.log("page hit");
  try {
    let userId = req.query.id;
    const user = await userModel.findByPk(userId);
    if (user === null) {
      res.render("error", { message: "Error connecting to MongoDB" });
      console.log("Error connecting to userModel");
    } else {
      let pets = await user.getPets();
      console.log(pets);
      let owner = await pets[0].getOwner();
      console.log(owner);

      res.render("pets", { allPets: pets });
    }
  } catch (ex) {
    res.render("error", { message: "Error connecting to MongoDB" });
    console.log("Error connecting to MongoDB");
    console.log(ex);
  }
});

router.get("/deleteUser", async (req, res) => {
  try {
    console.log("delete user");

    let userId = req.query.id;
    if (userId) {
      console.log("userId: " + userId);
      let deleteUser = await userModel.findByPk(userId);
      console.log("deleteUser: ");
      console.log(deleteUser);
      // if (deleteUser !== null) {
      //   await deleteUser.destroy();
      // }
    }
    res.redirect("/");
  } catch (ex) {
    res.render("error", { message: "Error connecting to MongoDB" });
    console.log("Error connecting to MongoDB");
    console.log(ex);
  }
});

router.post("/addUser", async (req, res) => {
  try {
    console.log("form submit");

    const password_salt = crypto.createHash("sha512");

    password_salt.update(uuid());

    const password_hash = crypto.createHash("sha512");

    password_hash.update(req.body.password + passwordPepper + password_salt);

    let newUser = userModel.build({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password_salt: password_salt.digest("hex"),
      password_hash: password_hash.digest("hex"),
    });
    await newUser.db.collection.insertOne(newUser);
    // await newUser.save();
    res.redirect("/");
  } catch (ex) {
    res.render("error", { message: "Error connecting to MongoDB" });
    console.log("Error connecting to MongoDB");
    console.log(ex);
  }
});

/*
router.get('/', (req, res) => {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MongoDB'});
			console.log("Error connecting to MongoDB");
			console.log(err);
		}
		else {
			
			dbModel.getAllUsers((err, result) => {
				if (err) {
					res.render('error', {message: 'Error reading from MongoDB'});
					console.log("Error reading from MongoDB");
					console.log(err);
				}
				else { //success
					res.render('index', {allUsers: result});

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
});
*/

/*
router.post('/addUser', (req, res) => {
	console.log("form submit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MongoDB'});
			console.log("Error connecting to MongoDB");
			console.log(err);
		}
		else {
			console.log(req.body);
			dbModel.addUser(req.body, (err, result) => {
				if (err) {
					res.render('error', {message: 'Error writing to MongoDB'});
					console.log("Error writing to MongoDB");
					console.log(err);
				}
				else { //success
					res.redirect("/");

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			
			dbConnection.release();
		}
	});

});
*/

/*
router.get('/deleteUser', (req, res) => {
	console.log("delete user");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			res.render('error', {message: 'Error connecting to MongoDB'});
			console.log("Error connecting to MongoDB");
			console.log(err);
		}
		else {
			console.log(req.query);

			let userId = req.query.id;
			if (userId) {
				dbModel.deleteUser(userId, (err, result) => {
					if (err) {
						res.render('error', {message: 'Error writing to MongoDB'});
						console.log("Error writing to MongoDB");
						console.log(err);
					}
					else { //success
						res.redirect("/");

						//Output the results of the query to the Heroku Logs
						console.log(result);
					}
				});
			}
			else {
				res.render('error', {message: 'Error on Delete'});
			}
		
			dbConnection.release();
		}
	});
});
*/

module.exports = router;
