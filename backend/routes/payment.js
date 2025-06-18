import dotenv from 'dotenv';
dotenv.config();

import Razorpay from 'razorpay';
import express from 'express';
import crypto from 'crypto';
import User from '../models/user.js';
const router = express.Router();


const razorpay = new Razorpay({
  key_id: process.env.RZR_Key_Id,
  key_secret: process.env.RZR_Key_Secret,
});



router.post("/create-order", async (req, res) => {
  const { amount, currency = "INR", receipt, userId, plan, duration } = req.body;
  const options = {
    amount: amount * 100, // in paisa
    currency,
    receipt,
    notes: {
      userId,
      plan,
      duration
    }
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Order creation failed" });
  }
});



router.post("/verify-payment", (req, res) => {
  const { order_id, payment_id, signature } = req.body;
  const expectedSignature = crypto
    .createHmac("sha256", `${process.env.RZR_Key_Secret}`)
    .update(order_id + "|" + payment_id)
    .digest("hex");

  if (expectedSignature === signature) {
    // Success, update DB here
    res.json({ status: "success" });
  } else {
    res.status(400).json({ status: "failed", reason: "Invalid signature" });
  }
});

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}



router.post("/razorpay-webhook", async (req, res) => {
  const secret = "yN23GHaDw4TQ@Pr"; // You set this in Razorpay dashboard

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
      const paymentData = payload.payment.entity;
      const months = { basePrice: 1, threeMonth: 3, sixMonth: 6 }
      const user = await User.findById(details.userId);

      if (user && user.planexp && user.planexp > Date.now()) {
        return res.status(200).json({ message: "Already updated" });
        
      }else{
      const details = paymentData.notes;
      await User.findByIdAndUpdate(details.userId, {
        $set: {
          isplan: true,
          plan: `${details.plan} for ${months[details.duration]} Months`,
          planstart: Date.now(),
          planexp: addMonths(Date.now(), months[details.duration])
        }
      })
    }}

    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).send("Invalid signature");
  }
});





export default router;