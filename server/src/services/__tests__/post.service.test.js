// server/src/services/__tests__/post.service.test.js

import { jest } from "@jest/globals";

const mockPostRepository = {
    createWithTags: jest.fn(),
};

const mockEventBus = {
    emit: jest.fn(),
};

const mockSearchStrategy = {
    search: jest.fn(),
};

jest.unstable_mockModule("../../repositories/post.repository.js", () => ({
    PostRepository: mockPostRepository,
}));

jest.unstable_mockModule("../../events/event-bus.js", () => ({
    EventBus: mockEventBus,
}));

jest.unstable_mockModule("../search/substring-search.strategy.js", () => ({
    SubstringSearchStrategy: mockSearchStrategy,
}));

const { PostService } = await import("../post.service.js");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("PostService.publish", () => {
    test("publish() creates a PUBLISHED post and emits post.published", async () => {
        mockPostRepository.createWithTags.mockResolvedValue({
            id: "p1",
            title: "Hello",
            status: "PUBLISHED",
        });

        const post = await PostService.publish({
            authorId: "u1",
            title: "Hello",
            body: "World",
        });

        expect(post.status).toBe("PUBLISHED");

        expect(mockEventBus.emit).toHaveBeenCalledWith(
            "post.published",
            expect.objectContaining({ postId: "p1" })
        );
    });

    test("publish() rejects an empty title", async () => {
        await expect(
            PostService.publish({
                authorId: "u1",
                title: "",
                body: "World",
            })
        ).rejects.toThrow();
    });
});

describe("PostService.search", () => {
    test("returns matching posts (row 1)", async () => {
        const posts = [
            { id: "p1", title: "JavaScript Basics" },
            { id: "p2", title: "Advanced JavaScript" },
        ];

        mockSearchStrategy.search.mockResolvedValue(posts);

        const result = await PostService.search({
            query: "javascript",
        });

        expect(result).toEqual(posts);

        expect(mockSearchStrategy.search).toHaveBeenCalledWith(
            "javascript",
            { page: 1, pageSize: 10 }
        );
    });

    test("returns an empty array when no posts match (row 2)", async () => {
        mockSearchStrategy.search.mockResolvedValue([]);

        const result = await PostService.search({
            query: "nonexistent",
        });

        expect(result).toEqual([]);

        expect(mockSearchStrategy.search).toHaveBeenCalledWith(
            "nonexistent",
            { page: 1, pageSize: 10 }
        );
    });

    test("uses custom pagination parameters (row 3)", async () => {
        mockSearchStrategy.search.mockResolvedValue([]);

        await PostService.search({
            query: "node",
            page: 2,
            pageSize: 5,
        });

        expect(mockSearchStrategy.search).toHaveBeenCalledWith(
            "node",
            { page: 2, pageSize: 5 }
        );
    });

    test("propagates search strategy errors (row 4)", async () => {
        mockSearchStrategy.search.mockRejectedValue(
            new Error("Search failed")
        );

        await expect(
            PostService.search({
                query: "error",
            })
        ).rejects.toThrow("Search failed");
    });
});