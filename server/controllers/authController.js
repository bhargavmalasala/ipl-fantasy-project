import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

export const loginAdmin = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // first i will check if the email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // checking email
    if (email !== process.env.ADMIN_EMAIL) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // checking password
    const isValid = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH,
    );

    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Bane try chesav invalid credentials" });
    }

    // keeping shorter default sessions but allowing longer trusted-device sessions
    const defaultExpiry = process.env.JWT_EXPIRES_IN || "2h";
    const trustedDeviceExpiry =
      process.env.JWT_TRUSTED_DEVICE_EXPIRES_IN || "30d";
    const expiresIn = rememberMe ? trustedDeviceExpiry : defaultExpiry;

    // generating JWT token
    const token = jwt.sign({ role: "admin" }, process.env.JWT_SECRET, {
      expiresIn,
    });

    return res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
