import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Missing username,email or password",
        });
    }

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return res
        .status(401)
        .json({ success: false, message: "user already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      username,
      email,
      password: hashPassword,
    });
    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "sucessfully Register" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing email or password" });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User does not Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    const token = jwt.sign(
      { id: user?._id, email: user?.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "5m" }
    );

    const refreshToken = jwt.sign(
      { id: user?._id, email: user?.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" }
    );

    user.refreshToken = refreshToken; // save new refresh token
    await user.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7days
    });

    return res
      .status(200)
      .json({
        success: true,
        data: user,
        acessToken: token,
        refreshToken: refreshToken,
        message: "sucessfully Login",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res
      .status(200)
      .json({ success: true, message: "LOGOUT Successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
