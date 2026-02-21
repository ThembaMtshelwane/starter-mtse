import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import User from "../user/user.model";
import { HttpError } from "../../utils/http.error";
import { HTTP_CODES } from "../../constants/http.codes";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt";
import { ACCESS_COOKIE_OPTIONS, REFRESH_COOKIE_OPTIONS } from "../../utils/cookie";
import { sendResponse } from "../../utils/http.success";
import { verifyToken } from "../token/token.service";
import ENV_VARS from "../../constants/env.const";


// ────────────────────────────────────────────────
// REGISTER USER
// ────────────────────────────────────────────────
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  // 1. Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser)
    throw new HttpError(HTTP_CODES.BAD_REQUEST, "Email already in use");

  // 2. Hash Password (never store plain text)
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Create User
  const user = await User.create({
    firstName,
    lastName,
    email,
    role,
    password: hashedPassword,
    access_token_secret: crypto.randomBytes(32).toString("hex"),
    refresh_token_secret: crypto.randomBytes(32).toString("hex"),
    tokenVersion: 0,
  });

  if (!user)
    throw new HttpError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Registration failed",
    );

  res
    .status(HTTP_CODES.CREATED)
    .json({ message: "User registered successfully" });
});

// ────────────────────────────────────────────────
// LOGIN USER
// ────────────────────────────────────────────────
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select(
    "+tokenVersion +access_token_secret +refresh_token_secret ",
  );

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(HTTP_CODES.BAD_REQUEST, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // Set Cookie for Refresh Token and  Access Token in JSON
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
  res.cookie("accessToken", accessToken, ACCESS_COOKIE_OPTIONS);

  sendResponse(res, HTTP_CODES.OK, "Successfully logged in", {
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

// ────────────────────────────────────────────────
// REFRESH ACCESS TOKEN
// ────────────────────────────────────────────────
export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HttpError(HTTP_CODES.UNAUTHORIZED, "Session expired");
    }

    const user = await verifyToken(refreshToken, {
      userSecretField: "refresh_token_secret",
      globalSecret: ENV_VARS.GLOBAL_REFRESH_SECRET as string,
    });

    // Token Rotation: Generate new token pair
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    await user.save();

    // Set new tokens in cookies
    res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
    res.cookie("accessToken", newAccessToken, ACCESS_COOKIE_OPTIONS);

    sendResponse(res, HTTP_CODES.OK, "Token refreshed successfully");
  },
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("accessToken", ACCESS_COOKIE_OPTIONS);
  res.clearCookie("refreshToken", REFRESH_COOKIE_OPTIONS);
  sendResponse(res, HTTP_CODES.OK, "User logged out successfully");
});
