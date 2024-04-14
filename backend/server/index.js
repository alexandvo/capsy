const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

var admin = require("firebase-admin");

var serviceAccount = require("./capsy-4e418-firebase-adminsdk-v0xvu-f14fb66dd8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//middleware
app.use(cors());
app.use(express.json());

const verifyToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

//ROUTES

//create a capsule

app.post("/capsules", verifyToken, async (req, res) => {
  try {
    const {uid} = req.user;
    const { title, notes, opendate, cover_url, contents} =
      req.body;
    const newCapsule = await pool.query(
      "INSERT INTO capsules (title, notes, opendate, cover_url, contents, creator_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, notes, opendate, cover_url, contents, uid]
    );
    res.json(newCapsule.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all capsules

app.get("/capsules", verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const capsulesList = await pool.query(
      "SELECT * FROM capsules WHERE creator_id = $1",
      [uid]
    );
    res.json(capsulesList.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a capsule

app.get("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;
    const capsule = await pool.query(
      "SELECT * FROM capsules WHERE creator_id = $1 AND capsule_id = $2",
      [uid, id]
    );
    res.json(capsule.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a capsule

app.put("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { cover_url, title } = req.body;
    const capsule = await pool.query(
      "UPDATE capsules SET cover_url = $1, title = $2 WHERE capsule_id = $3 RETURNING *",
      [cover_url, title, id]
    );
    // res.json(`Capsule id: ${id} created by User id: ${creator_id} creator_id was updated.`);
    res.json(capsule.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a capsule

app.delete("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const capsule = await pool.query(
      "DELETE FROM capsules WHERE capsule_id = $1 RETURNING *",
      [id]
    );
    res.json(capsule.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create a user

app.post("/users", async (req, res) => {
  try {
    const { email, pfp_url } = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (email, pfp_url) VALUES ($1, $2) RETURNING *",
      [email, pfp_url]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all users

app.get("/users", async (req, res) => {
  try {
    const usersList = await pool.query("SELECT * FROM users");
    res.json(usersList.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a user

app.get("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a user

app.put("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, pfp_url } = req.body;
    const user = await pool.query(
      "UPDATE users SET email = $1, pfp_url = $2 WHERE user_id = $3 RETURNING *",
      [email, pfp_url, id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/users/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
