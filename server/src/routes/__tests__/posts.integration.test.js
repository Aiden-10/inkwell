import request from "supertest";
import { app } from "../../app.js";
import { prisma } from "../../db/client.js";
import { resetDatabase } from "../../test-utils/fixtures.js";

beforeEach(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await prisma.$disconnect();
});

test("full flow: register, publish, and browse (US-01, US-03, US-04 validation)", async () => {
    // Arrange + Act (Section 4.6's AAA pattern): register a real user
    const registerRes = await request(app)
        .post("/api/auth/register")
        .send({
            email: "alice@example.com",
            displayName: "Alice",
            password: "correcthorse"
        });

    expect(registerRes.status).toBe(201);
    const { user, accessToken } = registerRes.body;

    // Act: publish a real post as that user
    const publishRes = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${accessToken}`)
        .send({
            authorId: user.id,
            title: "Hello, Inkwell",
            body: "My first real post."
        });

    expect(publishRes.status).toBe(201);

    // Act: browse the feed
    const feedRes = await request(app).get("/api/posts?page=1");

    // Assert: the published post is genuinely visible, end to end
    expect(feedRes.status).toBe(200);
    expect(feedRes.body.posts).toHaveLength(1);
    expect(feedRes.body.posts[0].title).toBe("Hello, Inkwell");
});

test("registering with a duplicate email fails end to end (US-01 extension 3a, validated)", async () => {
    await request(app)
        .post("/api/auth/register")
        .send({
            email: "alice@example.com",
            displayName: "Alice",
            password: "correcthorse"
        });

    const secondAttempt = await request(app)
        .post("/api/auth/register")
        .send({
            email: "alice@example.com",
            displayName: "Alice Two",
            password: "correcthorse"
        });

    expect(secondAttempt.status).toBe(400);
    expect(secondAttempt.body.error.code).toBe("EMAIL_ALREADY_REGISTERED");
});

test("registering a user and logging in works end to end (US-01, US-02 validation)", async () => {
    const credentials = {
        email: "bob@example.com",
        displayName: "Bob",
        password: "correcthorse"
    };

    const registerRes = await request(app)
        .post("/api/auth/register")
        .send(credentials);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.user.email).toBe(credentials.email);
    expect(registerRes.body.accessToken).toBeDefined();

    const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
            email: credentials.email,
            password: credentials.password
        });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.accessToken).toBeDefined();
    expect(loginRes.body.user.id).toBe(registerRes.body.user.id);
});

test("rejects oversized pageSize requests", async () => {
    const response = await request(app)
        .get("/api/posts?page=1&pageSize=100000");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_PAGINATION");
});

test("accepts pageSize values within the allowed limit", async () => {
    const response = await request(app)
        .get("/api/posts?page=1&pageSize=100");

    expect(response.status).toBe(200);
});