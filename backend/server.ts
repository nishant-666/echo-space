import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import twilio from "twilio";
import User from "./models/Users";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

if (!accountSid || !authToken || !verifyServiceSid) {
  console.error("Missing Twilio credentials in environment variables.");
  process.exit(1);
}

const client = twilio(accountSid, authToken);

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || "";
mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// 1. Endpoint to send OTP
app.post("/api/send-otp", async (req: Request, res: Response): Promise<any> => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, error: "Phone number is required" });
  }

  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    return res.json({ success: true, status: verification.status });
  } catch (error: any) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Endpoint to verify OTP & Save User
app.post(
  "/api/verify-otp",
  async (req: Request, res: Response): Promise<any> => {
    const { phoneNumber, code } = req.body;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: "Phone number and verification code are required",
      });
    }

    try {
      const verificationCheck = await client.verify.v2
        .services(verifyServiceSid)
        .verificationChecks.create({ to: phoneNumber, code });

      if (verificationCheck.status === "approved") {
        // Save or update user in MongoDB upon successful verification
        await User.findOneAndUpdate(
          { phoneNumber },
          { phoneNumber },
          { upsert: true, new: true },
        );

        // Generate a unique JWT token for the user session
        const token = jwt.sign(
          { phoneNumber: phoneNumber },
          process.env.JWT_SECRET || "YOUR_SUPER_SECRET_KEY",
          { expiresIn: "30d" },
        );

        return res.json({
          success: true,
          message: "Phone number verified successfully!",
          token: token,
        });
      } else {
        return res
          .status(400)
          .json({ success: false, message: "Invalid verification code" });
      }
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
);

// 3. Endpoint to match contacts against the DB
app.post(
  "/api/match-contacts",
  async (req: Request, res: Response): Promise<any> => {
    const { phoneNumbers } = req.body;

    if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
      return res.status(400).json({
        success: false,
        error: "Invalid or missing 'phoneNumbers' array.",
      });
    }

    try {
      // Query MongoDB for any users whose phone number matches the user's phonebook
      const matchedUsers = await User.find({
        phoneNumber: { $in: phoneNumbers },
      }).select("fullName phoneNumber image");

      const formattedContacts = matchedUsers.map((user) => ({
        id: user._id,
        fullName: user.fullName || "Unknown User",
        phones: [{ number: user.phoneNumber }],
        image: { uri: user.image || "" },
        imageAvailable: !!user.image,
      }));

      return res.json({ success: true, contacts: formattedContacts });
    } catch (error: any) {
      console.error("Error matching contacts:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  },
);

const normalizePhone = (num: string) => {
  if (!num) return "";
  return num.replace(/\D/g, "");
};

app.post(
  "/api/update-name",
  async (req: Request, res: Response): Promise<any> => {
    const { phoneNumber, userName } = req.body;

    if (!phoneNumber || !userName) {
      return res.status(400).json({
        success: false,
        error: "Phone number and User Name are required",
      });
    }

    try {
      const normalizedPhone = normalizePhone(phoneNumber);

      // Find user by matching the last 10 digits (safe against country code/formatting mismatches)
      // Note: Change `fullName` below to `userName` if that's the exact property name in your Mongoose schema
      const updatedUser = await User.findOneAndUpdate(
        {
          phoneNumber: { $regex: new RegExp(normalizedPhone.slice(-10) + "$") },
        },
        { $set: { fullName: userName } },
        { new: true }, // Returns the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({
          success: false,
          error: "User not found with this phone number.",
        });
      }

      return res.json({
        success: true,
        message: "User name updated successfully!",
        user: updatedUser,
      });
    } catch (error: any) {
      console.error("Error updating user name:", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
