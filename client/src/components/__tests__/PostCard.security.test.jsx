// Verifies that malicious post content is rendered as plain text.
// Ensures script tags cannot execute when displayed in PostCard.
// Regression test for stored XSS prevention.

import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { PostCard } from "../PostCard";

test("renders post body as text, never as executable HTML", () => {
    const maliciousPost = {
        id: "1",
        title: "Test",
        body: "<script>window.__xss = true;</script>",
        author: {
            displayName: "Attacker"
        }
    };

    render(<PostCard post={maliciousPost} />);

    expect(screen.getByText(/<script>/)).toBeInTheDocument();
    expect(window.__xss).toBeUndefined();
});