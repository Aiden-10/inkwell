import { Router } from "express";
import { getPublishedPostCount } from "../events/listeners/count-published-posts.listener.js";

const router = Router();

router.get("/stats", (req, res) => {
    res.status(200).json({
        totalPostsPublished: getPublishedPostCount(),
    });
});

export default router;