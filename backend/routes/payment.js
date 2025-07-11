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
  const user = await User.findById(userId);
  const go = !user.isplan || new Date(user.planexp) < Date.now();
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
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency , isOk: go});
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
  const secret = process.env.RZR_WEB; // You set this in Razorpay dashboard

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const event = req.body.event;
    const payload = req.body.payload;

    if (event === "payment.captured") {
      const paymentData = payload.payment.entity;
      const months = { basePrice: 1, threeMonth: 3, sixMonth: 6 }
      const details = paymentData.notes;
      const user = await User.findById(details.userId);
      sendPromoEmail(user.email,user.name);

      if (user && user.planexp && user.planexp > Date.now()) {
        return res.status(200).json({ message: "Already updated" });
        
      }else{
      await User.findByIdAndUpdate(details.userId, {
        $set: {
          isplan: true,
          plan: `${details.plan} for ${months[details.duration]} Months`,
          planstart: new Date('2025-07-01'),
          planexp: addMonths(new Date('2025-07-01'), months[details.duration])
        }
      })
    }}

    res.status(200).json({ status: "ok" });
  } else {
    res.status(400).send("Invalid signature");
  }
});



const sendPromoEmail = async (userEmail,userName='student') => {
  try {
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {
      sender: {
        name: "Crewtor Team",
        email: "lovunaruto@gmail.com",  // Use your verified sender
      },
      to: [
        {
          email: userEmail.trim(),
          name: userName,
        },
      ],
      subject: `Payment Successful – Welcome to Crewtor`,
      htmlContent: `
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border: 1px solid #dddddd;">
            <tr>
              <td>
                <h2 style="color: #2c3e50;">🎉 Welcome to Crewtor!</h2>

                <p style="font-size: 16px; color: #333;">
                  Dear <strong>${userName}</strong>,
                </p>

                <p style="font-size: 16px; color: #333;">
                  We’re excited to welcome you aboard 🚀
                </p>

                <p style="font-size: 16px; color: #333;">
                  Your payment has been successfully received — thank you for choosing <strong>Crewtor</strong> to guide you on your learning journey!
                </p>

                <p style="font-size: 16px; color: #333;">
                  Our team is now preparing your onboarding, and you’ll be added to your respective Crew and assigned a dedicated Captain shortly. You’ll receive all further communication (including session timings, crew details, and Telegram links) via email and Telegram very soon.
                </p>

                <h3 style="color: #2c3e50;">🔑 What happens next?</h3>
                <ul style="font-size: 16px; color: #333; line-height: 1.6;">
                  <li>🧑‍🏫 You’ll be assigned a Captain (your mentor)</li>
                  <li>👥 You’ll be added to your Crew</li>
                  <li>📅 You’ll get access to live sessions, guidance, and growth resources</li>
                </ul>

                <p style="font-size: 16px; color: #333;">
                  If you have any questions or need help at any point, just reply to this email or reach out to us via Telegram or WhatsApp.
                </p>

                <p style="font-size: 16px; color: #333;">
                  Thank you once again for trusting us. Let's grow together — one session at a time.
                </p>

                <p style="margin-top: 30px; font-size: 16px; color: #333;">
                  Warm regards,<br />
                  <strong>Team Crewtor</strong><br />
                  🌐 <a href="https://sauhardrai.github.io/Crewtor/" style="color: #007bff;">www.crewtor.in</a><br />
                </p>
              </td>
            </tr>
          </table>
        </body>

    </html>
    `
    }, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': process.env.EMAIL_API, // replace this with your actual Brevo API key
      }
    });

    console.log("✅ Email sent successfully to", userEmail);
  
  } catch (error) {
    console.error("❌ Failed to send email:", error.response?.data || error.message);
  }
};

export default router;