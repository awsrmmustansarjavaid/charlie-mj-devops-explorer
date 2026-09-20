/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
github-api.js
============================================================

Purpose:
    Communicate with GitHub's public REST API.

Important:
    This frontend does NOT contain a GitHub personal access
    token.

The public GitHub API can be used without authentication,
but unauthenticated requests have stricter rate limits.

For a production version with higher API limits, a backend
or serverless API proxy should be added later.

============================================================
*/


/* ==========================================================
   1. API CONFIGURATION
   ========================================================== */

const GITHUB_API_BASE =
    "https://api.github.com";


const DEFAULT_PER_PAGE = 12;


/* ==========================================================
   2. GENERIC REQUEST
   ========================================================== */

/**
 * Make a request to GitHub API.
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {Promise<object>}
 */
export async function githubRequest(
    endpoint,
    options = {}
) {

    const response =
        await fetch(
            `${GITHUB_API_BASE}${endpoint}`,
            {
                ...options,

                headers: {

                    Accept:
                        "application/vnd.github+json",

                    "X-GitHub-Api-Version":
                        "2022-11-28",

                    ...(options.headers || {})
                }
            }
        );


    /* ------------------------------------------------------
       Rate limit handling
       ------------------------------------------------------ */

    if (
        response.status === 403 ||
        response.status === 429
    ) {

        throw new Error(
            "GitHub API rate limit reached. Please wait and try again later."
        );
    }


    /* ------------------------------------------------------
       Other errors
       ------------------------------------------------------ */

    if (!response.ok) {

        let message =
            `GitHub API error: ${response.status}`;

        try {

            const errorData =
                await response.json();

            if (errorData?.message) {
                message =
                    errorData.message;
            }

        } catch {
            // Ignore invalid JSON error response.
        }

        throw new Error(message);
    }


    return response.json();
}


/* ==========================================================
   3. SEARCH REPOSITORIES
   ========================================================== */

/**
 * Search GitHub repositories.
 *
 * @param {object} options
 * @returns {Promise<object>}
 */
export async function searchRepositories({

    query = "",
    page = 1,
    perPage = DEFAULT_PER_PAGE,
    sort = "",
    order = "desc"

} = {}) {

    if (!query.trim()) {

        return {

            total_count: 0,

            incomplete_results: false,

            items: []

        };
    }


    const params =
        new URLSearchParams();

    params.set(
        "q",
        query
    );

    params.set(
        "page",
        String(page)
    );

    params.set(
        "per_page",
        String(perPage)
    );


    if (sort) {

        params.set(
            "sort",
            sort
        );

        params.set(
            "order",
            order
        );
    }


    return githubRequest(
        `/search/repositories?${params.toString()}`
    );
}


/* ==========================================================
   4. SEARCH USERS
   ========================================================== */

/**
 * Search GitHub users/creators.
 *
 * @param {object} options
 * @returns {Promise<object>}
 */
export async function searchUsers({

    query = "",
    page = 1,
    perPage = 12

} = {}) {

    if (!query.trim()) {

        return {

            total_count: 0,

            incomplete_results: false,

            items: []

        };
    }


    const params =
        new URLSearchParams();

    params.set(
        "q",
        query
    );

    params.set(
        "page",
        String(page)
    );

    params.set(
        "per_page",
        String(perPage)
    );


    return githubRequest(
        `/search/users?${params.toString()}`
    );
}


/* ==========================================================
   5. GET REPOSITORY
   ========================================================== */

/**
 * Get one repository.
 *
 * @param {string} owner
 * @param {string} repository
 * @returns {Promise<object>}
 */
export async function getRepository(
    owner,
    repository
) {

    if (!owner || !repository) {

        throw new Error(
            "Repository owner and name are required."
        );
    }

    return githubRequest(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`
    );
}


/* ==========================================================
   6. GET REPOSITORY LANGUAGES
   ========================================================== */

/**
 * Get languages used by a repository.
 *
 * @param {string} owner
 * @param {string} repository
 * @returns {Promise<object>}
 */
export async function getRepositoryLanguages(
    owner,
    repository
) {

    return githubRequest(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/languages`
    );
}


/* ==========================================================
   7. GET REPOSITORY TOPICS
   ========================================================== */

/**
 * Get repository topics.
 *
 * @param {string} owner
 * @param {string} repository
 * @returns {Promise<object>}
 */
export async function getRepositoryTopics(
    owner,
    repository
) {

    return githubRequest(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/topics`
    );
}


/* ==========================================================
   8. GET USER
   ========================================================== */

/**
 * Get GitHub user profile.
 *
 * @param {string} username
 * @returns {Promise<object>}
 */
export async function getUser(
    username
) {

    if (!username) {

        throw new Error(
            "GitHub username is required."
        );
    }

    return githubRequest(
        `/users/${encodeURIComponent(username)}`
    );
}


/* ==========================================================
   9. GET USER REPOSITORIES
   ========================================================== */

/**
 * Get repositories belonging to a user.
 *
 * @param {string} username
 * @param {object} options
 * @returns {Promise<Array>}
 */
export async function getUserRepositories(
    username,
    {
        page = 1,
        perPage = 30,
        sort = "updated"
    } = {}
) {

    const params =
        new URLSearchParams();

    params.set(
        "page",
        String(page)
    );

    params.set(
        "per_page",
        String(perPage)
    );

    params.set(
        "sort",
        sort
    );


    return githubRequest(
        `/users/${encodeURIComponent(username)}/repos?${params.toString()}`
    );
}


/* ==========================================================
   10. GET RATE LIMIT
   ========================================================== */

/**
 * Get current GitHub API rate limit.
 *
 * @returns {Promise<object>}
 */
export async function getRateLimit() {

    return githubRequest(
        "/rate_limit"
    );
}


/* ==========================================================
   11. SEARCH CODE
   ========================================================== */

/**
 * Search GitHub code.
 *
 * Note:
 * GitHub may require authentication for some code-search
 * scenarios and API limits can be stricter than repository
 * search.
 *
 * @param {string} query
 * @param {number} page
 * @param {number} perPage
 */
export async function searchCode(
    query,
    page = 1,
    perPage = 12
) {

    const params =
        new URLSearchParams();

    params.set(
        "q",
        query
    );

    params.set(
        "page",
        String(page)
    );

    params.set(
        "per_page",
        String(perPage)
    );


    return githubRequest(
        `/search/code?${params.toString()}`
    );
}


/* ==========================================================
   12. GET README
   ========================================================== */

/**
 * Get repository README metadata/content.
 *
 * GitHub returns the README as base64 encoded content.
 *
 * This function returns the raw GitHub response.
 *
 * @param {string} owner
 * @param {string} repository
 */
export async function getRepositoryReadme(
    owner,
    repository
) {

    return githubRequest(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/readme`
    );
}


/* ==========================================================
   13. GET COMMITS
   ========================================================== */

/**
 * Get recent repository commits.
 *
 * @param {string} owner
 * @param {string} repository
 * @param {number} perPage
 */
export async function getRepositoryCommits(
    owner,
    repository,
    perPage = 10
) {

    const params =
        new URLSearchParams();

    params.set(
        "per_page",
        String(perPage)
    );


    return githubRequest(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/commits?${params.toString()}`
    );
}


/* ==========================================================
   14. API HEALTH CHECK
   ========================================================== */

/**
 * Quickly test whether GitHub API is reachable.
 *
 * @returns {Promise<boolean>}
 */
export async function checkGitHubApi() {

    try {

        await githubRequest(
            "/zen"
        );

        return true;

    } catch {

        return false;
    }
}


/* ==========================================================
   END OF github-api.js
   ========================================================== */