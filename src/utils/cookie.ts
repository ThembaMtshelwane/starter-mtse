import type { CookieOptions } from "express";

export const ACCESS_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // Prevents JS from reading the cookie (XSS protection)
  secure: true, // Only send over HTTPS in production
  sameSite: "none", // Prevents CSRF
  maxAge: 15 * 60 * 1000, //15 min
  path: "/", // Cookie valid for entire API
};

export const REFRESH_COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true, // Prevents JS from reading the cookie (XSS protection)
  secure: true, // Only send over HTTPS in production
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/", // Cookie valid for entire API
};
