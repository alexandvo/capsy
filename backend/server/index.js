const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

require('dotenv').config();

var admin = require("firebase-admin");

var serviceAccount = require("./capsy-4e418-firebase-adminsdk-v0xvu-f14fb66dd8.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://capsy-4e418.appspot.com",
});

// Initialize multer middleware
const upload = multer({
  // storage: storage,
});

const bucket = admin.storage().bucket();

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  // Configure email transport (e.g., SMTP)
  service: "gmail",
  auth: {
    user: process.env.CAPSY_GMAIL, // Gmail address
    pass: process.env.CAPSY_GMAIL_APP_PASS, // Gmail password or App Password
  },
});

// Define function to send emails for overdue capsules
const sendEmailsForOverdueCapsules = async () => {
  const client = await pool.connect(); // Acquire a client from the pool
  try {
    // Query for overdue capsules that haven't had an email sent
    const query = `
      SELECT * 
      FROM capsules 
      WHERE openDate <= NOW() 
      AND emailSent = false
    `;
    const result = await client.query(query);
    const capsules = result.rows;

    // Process each overdue capsule
    for (const capsule of capsules) {
      // Send email to the recipient
      const userRecord = await admin.auth().getUser(capsule.creator_id);
      const email = userRecord.email;
      await transporter.sendMail({
        to: email,
        subject: `Your time capsule is ready to be opened!`,
        html: `
    <p>Your virtual time capsule named <strong>${capsule.title}</strong> that was created on <strong>${capsule.createdate.toDateString()}</strong> is ready to be opened!</p>
    <p>Visit the Capsy website <a href="http://localhost:3000/">here</a> to open your capsule.</p>
  `,
      });

      // Update database to mark email as sent
      await client.query(
        "UPDATE capsules SET emailSent = true WHERE capsule_id = $1",
        [capsule.capsule_id]
      );
    }

    console.log("Emails sent for overdue capsules:", capsules.length);
  } catch (error) {
    console.error("Error sending emails:", error);
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Schedule the task to run every minute
cron.schedule('0 0 * * *', sendEmailsForOverdueCapsules);

const verifyToken = async (req, res, next) => {
  try {
    const idToken = req.headers.authorization.split("Bearer ")[1];
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};

//ROUTES

//create a capsule
app.post(
  "/capsules",
  verifyToken,
  // upload.array("content"),
  upload.any(),
  async (req, res) => {
    try {
      let totalSize = 0;
      req.files.forEach((file) => {
        totalSize += file.size;
      });

      // Set maximum total size allowed
      const maxTotalSize = 15 * 1024 * 1024; // Example limit: 50MB

      // Check if total size exceeds the maximum limit
      if (totalSize > maxTotalSize) {
        return res.status(400).send("Total file size exceeds the limit.");
      }

      const files = req.files;
      const coverFile = req.files[0];
      const folderName = "capsules";
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "No files provided" });
      }

      const { uid } = req.user;
      const { title, notes, opendate } = req.body;
      const newDate = new Date(opendate);

      const newCapsule = await pool.query(
        "INSERT INTO capsules (title, notes, createDate, opendate, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [title, notes, new Date(), newDate, uid]
      );

      const subFolderName = newCapsule.rows[0].capsule_id;

      if (coverFile) {
        const blob = bucket.file(`covers/${subFolderName}`);
        const blobStream = blob.createWriteStream({
          metadata: {
            contentType: "image/" + coverFile.originalname.split(".").pop(),
          },
        });
        blobStream.end(coverFile.buffer);
      }

      for (const file of files.slice(1)) {
        const fileName = file.originalname;
        const blob = bucket.file(`${folderName}/${subFolderName}/${fileName}`);
        const blobStream = blob.createWriteStream();

        blobStream.on("error", (err) => {
          console.error("Error uploading file:", err);
        });

        blobStream.end(file.buffer);
      }

      res.json(newCapsule.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

app.get("/capsules", verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;
    const capsulesList = await pool.query(
      "SELECT * FROM capsules WHERE creator_id = $1 ORDER BY CASE WHEN unlocked = true THEN 2 ELSE 1 END, opendate",
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

//update a capsule to be unlocked

app.put("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const capsule = await pool.query(
      "UPDATE capsules SET unlocked = $1 WHERE capsule_id = $2 RETURNING *",
      [true, id]
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
    await bucket.file(`covers/${id}`).delete();
    await bucket.deleteFiles({
      prefix: `capsules/${id}`,
    });
    res.json(capsule.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//create a user

app.post("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE user_id = $1",
      [id]
    );
    if (!existingUser.rows.length) {
      const newUser = await pool.query(
        "INSERT INTO users (user_id, email) VALUES ($1, $2) RETURNING *",
        [id, email]
      );
      res.json(newUser.rows[0]);
    }
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

app.get("/users/:id", async (req, res) => {
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
