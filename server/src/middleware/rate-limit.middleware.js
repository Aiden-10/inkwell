import rateLimit from "express-rate-limit";

// Limit authentication attempts to 5 requests per 10 minutes.
export const authRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        error: {
            code: "TOO_MANY_ATTEMPTS",
            message: "Too many attempts. Try again later."
        }
    },
    standardHeaders: true,
    legacyHeaders: false
});