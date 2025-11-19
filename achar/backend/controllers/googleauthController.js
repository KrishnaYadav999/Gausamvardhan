import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  "305496954434-ueg26cesqeoel50a5ctatrvv9sq0nbki.apps.googleusercontent.com"
);

export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token missing" });
    }

    // Verify token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "305496954434-ueg26cesqeoel50a5ctatrvv9sq0nbki.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    if (!email || !googleId) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    // ✔ Step 1 — find by email
    let user = await User.findOne({ email });

    // ✔ Step 2 — if exists but googleId not added → update
    if (user && !user.googleId) {
      user.googleId = googleId;
      user.picture = picture;
      await user.save();
    }

    // ✔ Step 3 — if no user, create new
    if (!user) {
      user = new User({
        name,
        email,
        picture,
        googleId,
      });
      await user.save();
    }

    // Create JWT
    const jwtToken = jwt.sign(
      { id: user._id, fromGoogle: true },
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
        fromGoogle: true,
      },
    });
  } catch (err) {
    console.error("Google Auth Error:", err);
    return res
      .status(401)
      .json({ message: "Google login failed. Invalid token." });
  }
};
