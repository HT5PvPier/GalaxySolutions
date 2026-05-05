const express = require("express");
const Razorpay = require("razorpay");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("public"));

// 🔗 MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/galaxy");

// 📊 Schema
const PaymentSchema = new mongoose.Schema({
  name: String,
  email: String,
  amount: Number,
  paymentId: String,
  status: String
});

const Payment = mongoose.model("Payment", PaymentSchema);

// 💳 Razorpay setup
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",
  key_secret: "YOUR_KEY_SECRET"
});

// 🔥 Create order
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR"
  };

  const order = await razorpay.orders.create(options);
  res.json(order);
});

// ✅ Save payment
app.post("/verify-payment", async (req, res) => {
  const { name, email, amount, paymentId } = req.body;

  const payment = new Payment({
    name,
    email,
    amount,
    paymentId,
    status: "Success"
  });

  await payment.save();
  res.json({ status: "saved" });
});

// 📊 Admin: get all payments
app.get("/admin/payments", async (req, res) => {
  const data = await Payment.find();
  res.json(data);
});

app.listen(3000, () => console.log("Server running on 3000"));
