/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
storage.js
============================================================

Purpose:
    Browser-side persistence.

Uses:
    localStorage

Stores:

    - Saved repositories
    - Search history
    - Recently viewed resources
    - Saved technologies

No backend/database is required for this functionality.

============================================================
*/


/* ==========================================================
   1. STORAGE KEYS
   ========================================================== */

const STORAGE_KEYS = {

    SAVED_REPOSITORIES:
        "charlie_devops_saved_repositories",

    SEARCH_HISTORY:
        "charlie_devops_search_history",

    RECENTLY_VIEWED:
        "charlie_devops_recently_viewed",

    SAVED_TECHNOLOGIES:
        "charlie_devops_saved_technologies"

};


/* ==========================================================
   2. SAFE STORAGE READ
   ========================================================== */

/**
 * Read JSON from localStorage.
 *
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
function readStorage(
    key,
    fallback = []
) {

    try {

        const value =
            localStorage.getItem(key);

        if (!value) {
            return fallback;
        }

        return JSON.parse(value);

    } catch {

        return fallback;
    }
}


/* ==========================================================
   3. SAFE STORAGE WRITE
   ========================================================== */

/**
 * Write JSON to localStorage.
 *
 * @param {string} key
 * @param {*} value
 * @returns {boolean}
 */
function writeStorage(
    key,
    value
) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

        return true;

    } catch {

        return false;
    }
}


/* ==========================================================
   4. SAVED REPOSITORIES
   ========================================================== */

/**
 * Get all saved repositories.
 *
 * @returns {Array}
 */
export function getSavedRepositories() {

    return readStorage(
        STORAGE_KEYS.SAVED_REPOSITORIES,
        []
    );
}


/**
 * Check whether a repository is saved.
 *
 * We use GitHub's repository ID when available.
 *
 * @param {object} repository
 * @returns {boolean}
 */
export function isRepositorySaved(
    repository
) {

    if (!repository) {
        return false;
    }

    const saved =
        getSavedRepositories();

    return saved.some(
        item =>
            String(item.id) ===
            String(repository.id)
    );
}


/**
 * Save a repository.
 *
 * @param {object} repository
 * @returns {boolean}
 */
export function saveRepository(
    repository
) {

    if (!repository) {
        return false;
    }

    const saved =
        getSavedRepositories();

    if (
        saved.some(
            item =>
                String(item.id) ===
                String(repository.id)
        )
    ) {

        return true;
    }

    const lightweightRepository = {

        id: repository.id,

        name: repository.name,

        full_name:
            repository.full_name,

        html_url:
            repository.html_url,

        description:
            repository.description,

        language:
            repository.language,

        stargazers_count:
            repository.stargazers_count || 0,

        forks_count:
            repository.forks_count || 0,

        updated_at:
            repository.updated_at,

        owner: {

            login:
                repository.owner?.login || "",

            avatar_url:
                repository.owner?.avatar_url || "",

            html_url:
                repository.owner?.html_url || ""
        },

        topics:
            repository.topics || [],

        saved_at:
            new Date().toISOString()
    };

    saved.unshift(
        lightweightRepository
    );

    return writeStorage(
        STORAGE_KEYS.SAVED_REPOSITORIES,
        saved
    );
}


/**
 * Remove a saved repository.
 *
 * @param {number|string} repositoryId
 * @returns {boolean}
 */
export function removeSavedRepository(
    repositoryId
) {

    const saved =
        getSavedRepositories();

    const filtered =
        saved.filter(
            item =>
                String(item.id) !==
                String(repositoryId)
        );

    return writeStorage(
        STORAGE_KEYS.SAVED_REPOSITORIES,
        filtered
    );
}


/**
 * Toggle saved state.
 *
 * @param {object} repository
 * @returns {boolean}
 */
export function toggleRepositorySaved(
    repository
) {

    if (
        isRepositorySaved(repository)
    ) {

        removeSavedRepository(
            repository.id
        );

        return false;
    }

    saveRepository(
        repository
    );

    return true;
}


/* ==========================================================
   5. SEARCH HISTORY
   ========================================================== */

/**
 * Add search to history.
 *
 * @param {object} search
 * @param {number} limit
 */
export function addSearchHistory(
    search,
    limit = 20
) {

    if (!search?.query) {
        return;
    }

    const history =
        getSearchHistory();

    const normalizedQuery =
        String(search.query)
            .trim()
            .toLowerCase();

    const filtered =
        history.filter(
            item =>
                String(item.query)
                    .trim()
                    .toLowerCase() !==
                normalizedQuery
        );

    filtered.unshift({

        query:
            search.query,

        mode:
            search.mode || "everything",

        filters:
            search.filters || {},

        timestamp:
            new Date().toISOString()

    });

    writeStorage(
        STORAGE_KEYS.SEARCH_HISTORY,
        filtered.slice(0, limit)
    );
}


/**
 * Get search history.
 *
 * @param {number} limit
 * @returns {Array}
 */
export function getSearchHistory(
    limit = 20
) {

    return readStorage(
        STORAGE_KEYS.SEARCH_HISTORY,
        []
    ).slice(0, limit);
}


/**
 * Clear search history.
 */
export function clearSearchHistory() {

    localStorage.removeItem(
        STORAGE_KEYS.SEARCH_HISTORY
    );
}


/* ==========================================================
   6. RECENTLY VIEWED
   ========================================================== */

/**
 * Add a resource to recently viewed.
 *
 * @param {object} resource
 * @param {number} limit
 */
export function addRecentlyViewed(
    resource,
    limit = 20
) {

    if (!resource) {
        return;
    }

    const history =
        getRecentlyViewed();

    const identifier =
        resource.id ||
        resource.full_name ||
        resource.name;

    const filtered =
        history.filter(
            item =>
                (
                    item.id ||
                    item.full_name ||
                    item.name
                ) !== identifier
        );

    filtered.unshift({

        ...resource,

        viewed_at:
            new Date().toISOString()

    });

    writeStorage(
        STORAGE_KEYS.RECENTLY_VIEWED,
        filtered.slice(0, limit)
    );
}


/**
 * Get recently viewed resources.
 *
 * @param {number} limit
 * @returns {Array}
 */
export function getRecentlyViewed(
    limit = 20
) {

    return readStorage(
        STORAGE_KEYS.RECENTLY_VIEWED,
        []
    ).slice(0, limit);
}


/**
 * Clear recently viewed.
 */
export function clearRecentlyViewed() {

    localStorage.removeItem(
        STORAGE_KEYS.RECENTLY_VIEWED
    );
}


/* ==========================================================
   7. SAVED TECHNOLOGIES
   ========================================================== */

/**
 * Get saved technologies.
 *
 * @returns {Array}
 */
export function getSavedTechnologies() {

    return readStorage(
        STORAGE_KEYS.SAVED_TECHNOLOGIES,
        []
    );
}


/**
 * Save technology.
 *
 * @param {object} technology
 */
export function saveTechnology(
    technology
) {

    if (!technology) {
        return false;
    }

    const technologies =
        getSavedTechnologies();

    const identifier =
        technology.id ||
        technology.slug ||
        technology.name;

    if (
        technologies.some(
            item =>
                (
                    item.id ||
                    item.slug ||
                    item.name
                ) === identifier
        )
    ) {

        return true;
    }

    technologies.unshift(
        technology
    );

    return writeStorage(
        STORAGE_KEYS.SAVED_TECHNOLOGIES,
        technologies
    );
}


/**
 * Remove saved technology.
 *
 * @param {string} identifier
 */
export function removeSavedTechnology(
    identifier
) {

    const technologies =
        getSavedTechnologies();

    const filtered =
        technologies.filter(
            item =>
                (
                    item.id ||
                    item.slug ||
                    item.name
                ) !== identifier
        );

    return writeStorage(
        STORAGE_KEYS.SAVED_TECHNOLOGIES,
        filtered
    );
}


/* ==========================================================
   8. CLEAR EVERYTHING
   ========================================================== */

/**
 * Clear all application storage.
 *
 * Useful for a Settings / Reset button.
 */
export function clearApplicationStorage() {

    Object.values(
        STORAGE_KEYS
    ).forEach(key => {

        localStorage.removeItem(key);

    });
}


/* ==========================================================
   9. STORAGE STATISTICS
   ========================================================== */

/**
 * Return basic local storage statistics.
 *
 * @returns {object}
 */
export function getStorageStats() {

    return {

        savedRepositories:
            getSavedRepositories().length,

        searchHistory:
            getSearchHistory().length,

        recentlyViewed:
            getRecentlyViewed().length,

        savedTechnologies:
            getSavedTechnologies().length

    };
}


/* ==========================================================
   END OF storage.js
   ========================================================== */