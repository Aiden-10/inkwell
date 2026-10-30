import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

const MAX_PAGE_SIZE = 100;

router.post("/posts", requireAuth, async (req, res, next) => {
    try {
        // Derive authorId from the verified JWT, not the request body.
        const post = await PostService.publish({
            ...req.body,
            authorId: req.user.id
        });

        res.status(201).json(post);
    } catch (err) {
        next(err);
    }
});

router.get("/posts", async (req, res, next) => {
    try {
        const { page = 1, pageSize = 10, search } = req.query;

        const parsedPage = Number(page);
        const parsedPageSize = Number(pageSize);

        // Reject invalid pagination values and oversized requests.
        if (
            !Number.isSafeInteger(parsedPage) ||
            parsedPage < 1 ||
            !Number.isSafeInteger(parsedPageSize) ||
            parsedPageSize < 1 ||
            parsedPageSize > MAX_PAGE_SIZE
        ) {
            return res.status(400).json({
                error: {
                    code: "INVALID_PAGINATION",
                    message: `pageSize must be between 1 and ${MAX_PAGE_SIZE}, and page must be a positive integer.`
                }
            });
        }

        const result = search
            ? await PostService.search({
                query: search,
                page: parsedPage,
                pageSize: parsedPageSize
            })
            : await PostService.listPublished({
                page: parsedPage,
                pageSize: parsedPageSize
            });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
});

export default router;