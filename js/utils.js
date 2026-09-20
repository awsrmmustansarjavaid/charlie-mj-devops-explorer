/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
utils.js
============================================================

Purpose:
    Shared helper functions used throughout the application.

This file does NOT contain application-specific logic.

It provides reusable functions for:

    - DOM selection
    - HTML escaping
    - Text normalization
    - Debouncing
    - Number formatting
    - Date formatting
    - GitHub URL handling
    - Slug generation
    - Query parameters
    - Initial generation
    - Notifications
    - Safe JSON parsing

Other JavaScript files can import these functions.

Example:

    import {
        qs,
        escapeHtml,
        formatNumber
    } from "./utils.js";

============================================================
*/


/* ==========================================================
   1. DOM HELPERS
   ========================================================== */

/**
 * Select one element from the page.
 *
 * @param {string} selector
 * @param {HTMLElement|Document} root
 * @returns {HTMLElement|null}
 */
export function qs(selector, root = document) {
    return root.querySelector(selector);
}


/**
 * Select multiple elements from the page.
 *
 * Converts NodeList into a normal JavaScript array.
 *
 * @param {string} selector
 * @param {HTMLElement|Document} root
 * @returns {HTMLElement[]}
 */
export function qsa(selector, root = document) {
    return [...root.querySelectorAll(selector)];
}


/* ==========================================================
   2. HTML SAFETY
   ========================================================== */

/**
 * Escape text before inserting it into innerHTML.
 *
 * This is extremely important when displaying GitHub data.
 *
 * GitHub repository names, descriptions, usernames, etc.
 * come from an external API.
 *
 * We should never blindly insert API data into innerHTML.
 *
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value = "") {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* ==========================================================
   3. TEXT HELPERS
   ========================================================== */

/**
 * Normalize text for searching/comparison.
 *
 * Example:
 *
 *     "AWS EKS" -> "aws eks"
 *     "Kubernetes" -> "kubernetes"
 *
 * @param {*} value
 * @returns {string}
 */
export function normalizeText(value = "") {

    return String(value)
        .toLowerCase()
        .trim()
        .replace(/\s+/g, " ");
}


/**
 * Create a URL-friendly slug.
 *
 * Example:
 *
 *     "AWS EKS" -> "aws-eks"
 *     "GitHub Actions" -> "github-actions"
 *
 * @param {*} value
 * @returns {string}
 */
export function slugify(value = "") {

    return normalizeText(value)
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


/**
 * Truncate long text.
 *
 * @param {*} value
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(value = "", maxLength = 160) {

    const text = String(value);

    if (text.length <= maxLength) {
        return text;
    }

    return `${text.slice(0, maxLength - 3)}...`;
}


/* ==========================================================
   4. DEBOUNCE
   ========================================================== */

/**
 * Delay execution until the user stops triggering a function.
 *
 * Useful for:
 *
 *     - Search input
 *     - API requests
 *     - Filters
 *
 * @param {Function} functionToDelay
 * @param {number} wait
 * @returns {Function}
 */
export function debounce(functionToDelay, wait = 300) {

    let timeoutId;

    return function (...args) {

        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {

            functionToDelay.apply(this, args);

        }, wait);
    };
}


/* ==========================================================
   5. NUMBER FORMATTING
   ========================================================== */

/**
 * Format large numbers into readable values.
 *
 * Examples:
 *
 *     950      -> 950
 *     1200     -> 1.2k
 *     1500000  -> 1.5M
 *
 * @param {*} value
 * @returns {string}
 */
export function formatNumber(value) {

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return "0";
    }

    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1).replace(".0", "")}M`;
    }

    if (number >= 1000) {
        return `${(number / 1000).toFixed(1).replace(".0", "")}k`;
    }

    return String(number);
}


/* ==========================================================
   6. DATE / TIME
   ========================================================== */

/**
 * Convert GitHub ISO date into a relative time.
 *
 * Example:
 *
 *     Updated 2 days ago
 *
 * @param {string} dateString
 * @returns {string}
 */
export function timeAgo(dateString) {

    if (!dateString) {
        return "Unknown";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    const now = Date.now();

    const difference = Math.max(
        0,
        now - date.getTime()
    );

    const seconds = Math.floor(
        difference / 1000
    );

    if (seconds < 60) {
        return "just now";
    }

    const minutes = Math.floor(
        seconds / 60
    );

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(
        hours / 24
    );

    if (days < 30) {
        return `${days}d ago`;
    }

    const months = Math.floor(
        days / 30
    );

    if (months < 12) {
        return `${months}mo ago`;
    }

    const years = Math.floor(
        months / 12
    );

    return `${years}y ago`;
}


/**
 * Format a date in a readable format.
 *
 * @param {string} dateString
 * @returns {string}
 */
export function formatDate(dateString) {

    if (!dateString) {
        return "Unknown";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return "Unknown";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    ).format(date);
}


/* ==========================================================
   7. GITHUB HELPERS
   ========================================================== */

/**
 * Build a GitHub repository URL.
 *
 * @param {object} repo
 * @returns {string}
 */
export function getRepositoryUrl(repo) {

    if (repo?.html_url) {
        return repo.html_url;
    }

    if (
        repo?.owner?.login &&
        repo?.name
    ) {
        return `https://github.com/${encodeURIComponent(repo.owner.login)}/${encodeURIComponent(repo.name)}`;
    }

    return "#";
}


/**
 * Build GitHub user URL.
 *
 * @param {object|string} user
 * @returns {string}
 */
export function getUserUrl(user) {

    if (typeof user === "string") {

        return `https://github.com/${encodeURIComponent(user)}`;
    }

    if (user?.html_url) {
        return user.html_url;
    }

    if (user?.login) {

        return `https://github.com/${encodeURIComponent(user.login)}`;
    }

    return "#";
}


/**
 * Verify that a URL is safe to use.
 *
 * We only allow:
 *
 *     http://
 *     https://
 *
 * @param {*} url
 * @param {string} fallback
 * @returns {string}
 */
export function safeUrl(
    url,
    fallback = "#"
) {

    if (!url) {
        return fallback;
    }

    try {

        const parsed = new URL(
            url,
            window.location.origin
        );

        if (
            parsed.protocol === "http:" ||
            parsed.protocol === "https:"
        ) {
            return parsed.href;
        }

    } catch {
        return fallback;
    }

    return fallback;
}


/* ==========================================================
   8. USERNAME HELPERS
   ========================================================== */

/**
 * Generate initials from a name.
 *
 * Example:
 *
 *     Charlie MJ -> CM
 *
 * @param {*} name
 * @returns {string}
 */
export function getInitials(name = "") {

    const parts = String(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (parts.length === 0) {
        return "?";
    }

    if (parts.length === 1) {
        return parts[0]
            .slice(0, 2)
            .toUpperCase();
    }

    return (
        parts[0][0] +
        parts[parts.length - 1][0]
    ).toUpperCase();
}


/* ==========================================================
   9. QUERY PARAMETERS
   ========================================================== */

/**
 * Get one query parameter.
 *
 * Example:
 *
 * URL:
 *     technology.html?name=Kubernetes
 *
 * getQueryParam("name")
 *
 * returns:
 *     Kubernetes
 *
 * @param {string} name
 * @returns {string}
 */
export function getQueryParam(name) {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get(name) || "";
}


/**
 * Set query parameters without reloading.
 *
 * @param {object} values
 */
export function setQueryParams(values = {}) {

    const url =
        new URL(window.location.href);

    Object.entries(values).forEach(
        ([key, value]) => {

            if (
                value === undefined ||
                value === null ||
                value === ""
            ) {

                url.searchParams.delete(key);

            } else {

                url.searchParams.set(
                    key,
                    value
                );
            }
        }
    );

    window.history.replaceState(
        {},
        "",
        url
    );
}


/* ==========================================================
   10. DATA PATH
   ========================================================== */

/**
 * Return the correct project root.
 *
 * index.html:
 *
 *     ./data/
 *
 * pages/technology.html:
 *
 *     ../data/
 *
 * This allows the same JavaScript modules to work from both
 * the root page and pages inside /pages/.
 *
 * @returns {string}
 */
export function getProjectRoot() {

    return window.location.pathname
        .includes("/pages/")
        ? "../"
        : "./";
}


/**
 * Return path to the data folder.
 *
 * @returns {string}
 */
export function getDataPath() {

    return `${getProjectRoot()}data/`;
}


/* ==========================================================
   11. JSON FETCH HELPER
   ========================================================== */

/**
 * Fetch a local JSON file.
 *
 * @param {string} filename
 * @returns {Promise<any>}
 */
export async function fetchJson(filename) {

    const response = await fetch(
        `${getDataPath()}${filename}`
    );

    if (!response.ok) {

        throw new Error(
            `Unable to load ${filename} (${response.status})`
        );
    }

    return response.json();
}


/* ==========================================================
   12. NOTIFICATIONS
   ========================================================== */

/**
 * Display a temporary application notification.
 *
 * @param {string} message
 * @param {"success"|"error"|"warning"|"info"} type
 * @param {number} duration
 */
export function showNotification(
    message,
    type = "info",
    duration = 3000
) {

    let container =
        document.querySelector(
            ".notification-container"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.className =
            "notification-container";

        document.body.appendChild(
            container
        );
    }

    const notification =
        document.createElement("div");

    notification.className =
        `notification ${type}`;

    const icon =
        type === "success"
            ? "✓"
            : type === "error"
                ? "!"
                : type === "warning"
                    ? "⚠"
                    : "i";

    notification.innerHTML = `
        <span class="notification-icon">
            ${icon}
        </span>

        <span>
            ${escapeHtml(message)}
        </span>
    `;

    container.appendChild(
        notification
    );

    setTimeout(() => {

        notification.classList.add(
            "removing"
        );

        setTimeout(() => {

            notification.remove();

        }, 200);

    }, duration);
}


/* ==========================================================
   13. COPY TO CLIPBOARD
   ========================================================== */

/**
 * Copy text to the user's clipboard.
 *
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

        showNotification(
            "Copied to clipboard.",
            "success"
        );

        return true;

    } catch {

        showNotification(
            "Unable to copy text.",
            "error"
        );

        return false;
    }
}


/* ==========================================================
   14. ARRAY HELPERS
   ========================================================== */

/**
 * Remove duplicate values from an array.
 *
 * @param {Array} values
 * @returns {Array}
 */
export function unique(values = []) {

    return [...new Set(values)];
}


/**
 * Safely sort an array without mutating original data.
 *
 * @param {Array} values
 * @param {Function} compareFunction
 * @returns {Array}
 */
export function safeSort(
    values = [],
    compareFunction
) {

    return [...values].sort(
        compareFunction
    );
}


/* ==========================================================
   15. ERROR HELPERS
   ========================================================== */

/**
 * Get a readable error message.
 *
 * @param {*} error
 * @returns {string}
 */
export function getErrorMessage(error) {

    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }

    return "Something went wrong.";
}


/* ==========================================================
   16. HTML ELEMENT CREATION
   ========================================================== */

/**
 * Create an HTML element with optional class.
 *
 * @param {string} tag
 * @param {string} className
 * @param {string} text
 * @returns {HTMLElement}
 */
export function createElement(
    tag,
    className = "",
    text = ""
) {

    const element =
        document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
        element.textContent = text;
    }

    return element;
}


/* ==========================================================
   END OF utils.js
   ========================================================== */