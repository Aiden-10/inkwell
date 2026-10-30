import { TokenService } from "../services/token.service.js";

export function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [scheme, token] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({
            error: {
                code: "UNAUTHENTICATED",
                message: "Missing or invalid Authorization header."
            }
        });
    }

    try {
        const payload = TokenService.verifyAccessToken(token);

        req.user = {
            id: payload.sub,
            email: payload.email
        };

        next();
    } catch {
        return res.status(401).json({
            error: {
                code: "UNAUTHENTICATED",
                message: "Invalid or expired token."
            }
        });
    }
}