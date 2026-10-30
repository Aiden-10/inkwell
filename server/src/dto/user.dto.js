export function toPublicUser(user) {
    return {
        id: user.id,
        displayName: user.displayName
        // Sensitive fields like email and passwordHash are excluded.
        // Using an allowlist prevents future sensitive fields from being exposed.
    };
}