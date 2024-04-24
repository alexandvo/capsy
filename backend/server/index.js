require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const supabaseUrl = "https://gnudqrzanwdybazsbclh.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const multer = require("multer");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

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
  try {
    // Query for overdue capsules that haven't had an email sent
    const { data, error } = await supabase
      .from("capsules")
      .select()
      .eq("emailSent", false)
      .lte("openDate", new Date().toDateString());

    if (error) {
      console.error("Error querying capsules:", error.message);
      return;
    }

    // Process each overdue capsule
    for (const capsule of data) {
      // Send email to the recipient (assuming capsule.creator_id is the user's ID)
      // Fetch user email from the users table or wherever it's stored
      const userRecord = await admin.auth().getUser(capsule.creator_id);
      const email = userRecord.email;

      function formatDate(inputDate) {
        // Create a new Date object from the input string
        var date = new Date(inputDate);

        // Get day, month, and year from the Date object
        var day = date.getDate();
        var month = date.toLocaleString("en-us", { month: "long" });
        var year = date.getFullYear();

        // Construct the formatted date string
        var formattedDate = month + " " + day + ", " + year;

        // Return the formatted date string
        return formattedDate;
      }

      var formattedDateString = formatDate(capsule.createDate);

      // Send email code remains the same
      await transporter.sendMail({
        to: email,
        subject: `Your time capsule is ready to be opened!`,
        html: `
            <p>Your virtual time capsule named <strong>${capsule.title}</strong> that was created on <strong>${formattedDateString}</strong> is ready to be opened!</p>
            <p>Visit the Capsy website <a href="https://alexandvo.github.io/capsy/">here</a> to open your capsule.</p>
          `,
      });

      // Update database to mark email as sent
      const { error } = await supabase
        .from("capsules")
        .update({ emailSent: true })
        .eq("capsule_id", capsule.capsule_id);

      if (error) {
        console.error("Error updating capsule:", error.message);
      }
    }

    console.log("Emails sent for overdue capsules:", data.length);
  } catch (error) {
    console.error("Error sending emails:", error.message);
  }
};

// const sendEmailsForOverdueCapsules = async () => {
//   const client = await pool.connect(); // Acquire a client from the pool
//   try {
//     // Query for overdue capsules that haven't had an email sent
//     const query = `
//       SELECT *
//       FROM capsules
//       WHERE openDate <= NOW()
//       AND emailSent = false
//     `;
//     const result = await client.query(query);
//     const capsules = result.rows;

//     // Process each overdue capsule
//     for (const capsule of capsules) {
//       // Send email to the recipient
//       const userRecord = await admin.auth().getUser(capsule.creator_id);
//       const email = userRecord.email;
//       await transporter.sendMail({
//         to: email,
//         subject: `Your time capsule is ready to be opened!`,
//         html: `
//     <p>Your virtual time capsule named <strong>${capsule.title}</strong> that was created on <strong>${capsule.createdate.toDateString()}</strong> is ready to be opened!</p>
//     <p>Visit the Capsy website <a href="http://localhost:3000/">here</a> to open your capsule.</p>
//   `,
//       });

//       // Update database to mark email as sent
//       await client.query(
//         "UPDATE capsules SET emailSent = true WHERE capsule_id = $1",
//         [capsule.capsule_id]
//       );
//     }

//     console.log("Emails sent for overdue capsules:", capsules.length);
//   } catch (error) {
//     console.error("Error sending emails:", error);
//   } finally {
//     client.release(); // Release the client back to the pool
//   }
// };

// Schedule the task to run every minute

cron.schedule("*/10 * * * * *", sendEmailsForOverdueCapsules);

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
// app.post(
//   "/capsules",
//   verifyToken,
//   // upload.array("content"),
//   upload.any(),
//   async (req, res) => {
//     try {
//       let totalSize = 0;
//       req.files.forEach((file) => {
//         totalSize += file.size;
//       });

//       // Set maximum total size allowed
//       const maxTotalSize = 15 * 1024 * 1024; // Example limit: 50MB

//       // Check if total size exceeds the maximum limit
//       if (totalSize > maxTotalSize) {
//         return res.status(400).send("Total file size exceeds the limit.");
//       }

//       const files = req.files;
//       const coverFile = req.files[0];
//       const folderName = "capsules";
//       if (!files || files.length === 0) {
//         return res.status(400).json({ error: "No files provided" });
//       }

//       const { uid } = req.user;
//       const { title, notes, opendate } = req.body;
//       const newDate = new Date(opendate);

//       const newCapsule = await pool.query(
//         "INSERT INTO capsules (title, notes, createDate, opendate, creator_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
//         [title, notes, new Date(), newDate, uid]
//       );

//       const subFolderName = newCapsule.rows[0].capsule_id;

//       if (coverFile) {
//         const blob = bucket.file(`covers/${subFolderName}`);
//         const blobStream = blob.createWriteStream({
//           metadata: {
//             contentType: "image/" + coverFile.originalname.split(".").pop(),
//           },
//         });
//         blobStream.end(coverFile.buffer);
//       }

//       for (const file of files.slice(1)) {
//         const fileName = file.originalname;
//         const blob = bucket.file(`${folderName}/${subFolderName}/${fileName}`);
//         const blobStream = blob.createWriteStream();

//         blobStream.on("error", (err) => {
//           console.error("Error uploading file:", err);
//         });

//         blobStream.end(file.buffer);
//       }

//       res.json(newCapsule.rows[0]);
//     } catch (err) {
//       console.error(err.message);
//     }
//   }
// );

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

      const { data, error } = await supabase
        .from("capsules")
        .insert({
          title,
          notes,
          createDate: new Date().toDateString(),
          openDate: newDate,
          creator_id: uid,
          unlocked: false,
          emailSent: false,
        })
        .select();

      if (error) {
        console.error("Error inserting new capsule:", error.message);
        return res.status(500).send("Error inserting new capsule");
      }
      const subFolderName = data[0].capsule_id;

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

      res.json(data[0]);
    } catch (err) {
      console.error(err.message);
    }
  }
);

// app.get("/capsules", verifyToken, async (req, res) => {
//   try {
//     const { uid } = req.user;
//     const capsulesList = await pool.query(
//       "SELECT * FROM capsules WHERE creator_id = $1 ORDER BY CASE WHEN unlocked = true THEN 2 ELSE 1 END, opendate",
//       [uid]
//     );
//     res.json(capsulesList.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.get("/capsules", verifyToken, async (req, res) => {
  try {
    const { uid } = req.user;

    const { data, error } = await supabase
      .from("capsules")
      .select("*")
      .eq("creator_id", uid)
      .order("unlocked", { ascending: true })
      .order("openDate", { ascending: true });
    if (error) {
      console.error("Error querying capsules:", error.message);
      return;
    }

    res.json(data);
  } catch (err) {
    console.error(err.message);
  }
});

//get a capsule

// app.get("/capsules/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { uid } = req.user;
//     const capsule = await pool.query(
//       "SELECT * FROM capsules WHERE creator_id = $1 AND capsule_id = $2",
//       [uid, id]
//     );
//     res.json(capsule.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.get("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { uid } = req.user;

    const { data, error } = await supabase
      .from("capsules")
      .select()
      .eq("creator_id", uid)
      .eq("capsule_id", id);
    if (error) {
      console.error("Error querying capsules:", error.message);
      return;
    }

    res.json(data[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a capsule to be unlocked

// app.put("/capsules/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const capsule = await pool.query(
//       "UPDATE capsules SET unlocked = $1 WHERE capsule_id = $2 RETURNING *",
//       [true, id]
//     );
//     // res.json(`Capsule id: ${id} created by User id: ${creator_id} creator_id was updated.`);
//     res.json(capsule.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.put("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("capsules")
      .update({ unlocked: true })
      .eq("capsule_id", id)
      .select();

    if (error) {
      console.error(error);
    }

    // res.json(`Capsule id: ${id} created by User id: ${creator_id} creator_id was updated.`);
    res.json(data[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a capsule

// app.delete("/capsules/:id", verifyToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const capsule = await pool.query(
//       "DELETE FROM capsules WHERE capsule_id = $1 RETURNING *",
//       [id]
//     );
//     await bucket.file(`covers/${id}`).delete();
//     await bucket.deleteFiles({
//       prefix: `capsules/${id}`,
//     });
//     res.json(capsule.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.delete("/capsules/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("capsules")
      .delete()
      .eq("capsule_id", id)
      .select();

    if (error) {
      console.error(error);
    }

    await bucket.file(`covers/${id}`).delete();
    await bucket.deleteFiles({
      prefix: `capsules/${id}`,
    });
    res.json(data[0]);
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
