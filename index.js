const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // Import bodyParser

const app = express();
const port = 3000;

const User = require("./model/company_data");

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add the body parser middleware

mongoose.connect("mongodb+srv://SaifySheikh:Sharif4565@cluster0.xbgnrhv.mongodb.net/employee", {})
  .then(() => {
    console.log("Database Connected");
  })
  .catch((e) => {
    console.error(e);
    console.log("Database Can't Be Connected");
  });

app.use(express.static("public"));
app.use(express.static("templates"));
app.use(express.static("src"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/templates/admin.html");
});

app.get("/client", async (req, res) => {
  try {
    const data = await User.find();
    console.log("Fetched Data:", data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



app.post("/", async (req, res) => {
  const userData = new User(req.body);
  try {
    await userData.save();
    res.redirect("/client");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




app.post("/add_company_data", async (req, res) => {
  const companyData = new User(req.body);
  try {
    await companyData.save();
    console.log("Company data saved:", companyData);
    res.redirect("/admin.html"); // or wherever you want to redirect after saving
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Update route in index.js
app.put("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  const newData = req.body;

  try {
    // Update user data in MongoDB
    const updatedUser = await User.findByIdAndUpdate(userId, newData, { new: true });

    // Log the updated user data for verification
    console.log("Updated User:", updatedUser);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});



// Add this route to fetch admin data

const recruiterModel = require("./model/recruiter");

app.get("/admin_data", async (req, res) => {
  try {
    const admins = await recruiterModel.find().populate("recruitedCandidates");

    // Process the data to extract relevant information
    const formattedAdmins = admins.map(admin => ({
      name: admin.name,
      hiredCandidates: admin.recruitedCandidates.length,
      activeCandidates: admin.recruitedCandidates.filter(candidate => candidate.active).length,
      month:admin.month.toLowerCase(),
    }));

    res.json(formattedAdmins);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});







// Add this route to fetch recruiter details
app.get("/recruiter_details", async (req, res) => {
  console.log("DON - SRK")
  const recruiterName = req.query.name;

  try {
    // Find the recruiter in the database based on the provided name
    const recruiter = await recruiterModel.findOne({ name: recruiterName }).populate("recruitedCandidates");

    if (!recruiter) {
      // If the recruiter is not found, return a 404 response
      return res.status(404).json({ error: "Recruiter not found" });
    }

    // Process the data to extract relevant information
    const formattedRecruiterData = {
      name: recruiter.name,
      recruitedCandidates: recruiter.recruitedCandidates.map(candidate => ({
        name: candidate.name,
        phone: candidate.phone,
        location: candidate.location,
        jobInterest: candidate.jobInterest,
        Status: candidate.Status,
        joinedAt: candidate.joinedAt,
        isActive: candidate.isActive,
      })),
    };

    res.json(formattedRecruiterData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


//yha se

const Candidate = require("./model/candidate");

// ... (existing code)

// Add this route to fetch candidate details
// app.get("/candidate_details", async (req, res) => {
//   try {
//     const candidates = await Candidate.find();
//     res.json(candidates);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Add this route to fetch candidate details
app.get("/candidate_details", async (req, res) => {
  try {
    const candidates = await Candidate.find();

    // Process the data to extract relevant information
    const formattedCandidates = candidates.map(candidate => ({
      name: candidate.name,
      phone: candidate.phone,
      location: candidate.location,
      jobInterest: candidate.jobInterest,
      status: candidate.status,
      joinedAt: candidate.joinedAt,
      isActive: candidate.isActive,
    }));

    res.json(formattedCandidates);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


//yha tak

app.listen(port, () => {
  console.log("App Running on port: ", port);
});
