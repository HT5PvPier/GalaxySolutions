const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/insurance");

const UserSchema = new mongoose.Schema({
  name: String,
  carNumber: String,
  phone: String,
  plan: String
});

const User = mongoose.model("User", UserSchema);

// Save form data
app.post("/submit", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send("Saved!");
});

// Admin route
app.get("/admin/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.listen(3000, () => console.log("Server running"));
