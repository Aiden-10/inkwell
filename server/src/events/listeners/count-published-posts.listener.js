import { EventBus } from "../event-bus.js";

let publishedPostCount = 0;

EventBus.on("post.published", () => {
    publishedPostCount++;
});

export function getPublishedPostCount() {
    return publishedPostCount;
}