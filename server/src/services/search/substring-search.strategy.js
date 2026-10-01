import { PostRepository } from "../../repositories/post.repository.js";
export const SubstringSearchStrategy = {
    async search(query, { page = 1, pageSize = 10 }) {
        return PostRepository.searchPublished({ query, page, pageSize });
    },
};