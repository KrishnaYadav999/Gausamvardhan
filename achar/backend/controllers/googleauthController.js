import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

// Load client from ENV
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    // ⭐ STEP 1 → find user by email
    let user = await User.findOne({ email });

    // ⭐ STEP 2 → if user exists but googleId not saved → update
    if (user && !user.googleId) {
      user.googleId = googleId;
      user.picture = picture;
      await user.save();
    }

    // ⭐ STEP 3 → if user does not exist → create new Google user
    if (!user) {
      user = await User.create({
        name,
        email,
        picture,
        googleId,
        authType: "google",
      });
    }

    // ⭐ Create JWT Token
    const jwtToken = jwt.sign(
      { id: user._id, google: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token: jwtToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        google: true,
      },
    });
  } catch (err) {
    console.error("Google Auth Error:", err.message);
    return res.status(401).json({ message: "Google login failed. Invalid token." });
  }
};
