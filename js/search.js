/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
search.js
============================================================

Purpose:
    Convert the user's search into a GitHub repository search.

Example:

    User enters:

        Kubernetes

    Search module builds something similar to:

        Kubernetes

Or:

        Kubernetes
        language:yaml

Or:

        Terraform
        language:hcl

Special search modes:

    everything
    labs
    projects
    tutorials
    notes
    cicd
    gitops

============================================================
*/


import {
    searchRepositories
} from "./github-api.js";


import {
    getGitHubSort
} from "./filters.js";


import {
    addSearchHistory
} from "./storage.js";


import {
    escapeHtml,
    formatNumber,
    timeAgo,
    showNotification,
    debounce
} from "./utils.js";


import {
    renderRepositories
} from "./repository-card.js";


/* ==========================================================
   1. SEARCH MODE DEFINITIONS
   ========================================================== */

const SEARCH_MODES = {

    everything: "",

    labs:
        '(lab OR "hands-on" OR "hands-on-lab" OR laboratory)',

    projects:
        '(project OR application OR implementation)',

    tutorials:
        '(tutorial OR tutorial-project OR guide OR learning)',

    notes:
        '(notes OR cheatsheet OR "study material" OR documentation)',

    cicd:
        '("CI/CD" OR Jenkins OR "GitHub Actions" OR "GitLab CI" OR pipeline)',

    gitops:
        '(GitOps OR ArgoCD OR "Argo CD" OR Flux)'

};


/* ==========================================================
   2. SEARCH ALIASES
   ========================================================== */

const SEARCH_ALIASES = {

    k8s:
        "kubernetes",

    k8:
        "kubernetes",

    tf:
        "terraform",

    cicd:
        '"CI/CD"',

    ci:
        '"continuous integration"',

    cd:
        '"continuous deployment"',

    eks:
        '"Amazon EKS"',

    aks:
        '"Azure Kubernetes Service"',

    gke:
        '"Google Kubernetes Engine"',

    kustom:
        "kustomize",

    argocd:
        '"Argo CD"',

    argo:
        '"Argo CD"',

    gha:
        '"GitHub Actions"',

    gitlabci:
        '"GitLab CI"',

    powershell:
        'PowerShell',

    pwsh:
        'PowerShell',

    cfn:
        '"CloudFormation"',

    cloudformation:
        '"CloudFormation"',

    tofu:
        'OpenTofu',

    ghactions:
        '"GitHub Actions"',

    eso:
        '"External Secrets Operator"',

    otel:
        'OpenTelemetry',

    elk:
        '"Elastic Stack"',

    k3s:
        'k3s'

};


/* ==========================================================
   3. NORMALIZE SEARCH TERM
   ========================================================== */

/**
 * Normalize aliases in search term.
 *
 * @param {string} query
 * @returns {string}
 */
export function normalizeSearchQuery(
    query
) {

    let normalized =
        String(query || "")
            .trim();


    Object.entries(
        SEARCH_ALIASES
    ).forEach(
        ([alias, replacement]) => {

            const pattern =
                new RegExp(
                    `\\b${alias}\\b`,
                    "gi"
                );

            normalized =
                normalized.replace(
                    pattern,
                    replacement
                );

        }
    );


    return normalized;
}


/* ==========================================================
   4. BUILD GITHUB QUERY
   ========================================================== */

/**
 * Build GitHub repository query.
 *
 * @param {object} options
 * @returns {string}
 */
export function buildGitHubQuery({

    query = "",

    mode = "everything",

    filters = {}

} = {}) {

    const parts = [];


    /* ------------------------------------------------------
       Main query
       ------------------------------------------------------ */

    const normalized =
        normalizeSearchQuery(query);


    if (normalized) {

        parts.push(
            normalized
        );
    }


    /* ------------------------------------------------------
       Search mode
       ------------------------------------------------------ */

    const modeQuery =
        SEARCH_MODES[mode];

    if (modeQuery) {

        parts.push(
            modeQuery
        );
    }


    /* ------------------------------------------------------
       Technology filter
       ------------------------------------------------------ */

    if (
        filters.technology &&
        filters.technology !== "any"
    ) {

        parts.push(
            `"${filters.technology}"`
        );
    }


    /* ------------------------------------------------------
       Language filter
       ------------------------------------------------------ */

    if (
        filters.language &&
        filters.language !== "any"
    ) {

        parts.push(
            `language:${filters.language}`
        );
    }


    /* ------------------------------------------------------
       Resource type
       ------------------------------------------------------ */

    if (
        filters.resourceType &&
        filters.resourceType !== "everything"
    ) {

        const resourceQueries = {

            labs:
                '(lab OR "hands-on")',

            projects:
                '(project OR application)',

            tutorials:
                '(tutorial OR guide)',

            study:
                '(notes OR learning OR documentation)',

            cheatsheets:
                '(cheatsheet OR "cheat sheet")'

        };


        const resourceQuery =
            resourceQueries[
                filters.resourceType
            ];


        if (resourceQuery) {

            parts.push(
                resourceQuery
            );
        }
    }


    /* ------------------------------------------------------
       Avoid searching empty query
       ------------------------------------------------------ */

    if (parts.length === 0) {

        return "devops";
    }


    return parts.join(" ");
}


/* ==========================================================
   5. SEARCH GITHUB
   ========================================================== */

/**
 * Execute GitHub repository search.
 *
 * @param {object} options
 * @returns {Promise<object>}
 */
export async function performSearch({

    query = "",

    mode = "everything",

    filters = {},

    page = 1,

    perPage = 12,

    container = null,

    onStateChange = null

} = {}) {

    const githubQuery =
        buildGitHubQuery({
            query,
            mode,
            filters
        });


    /* ------------------------------------------------------
       Notify application
       ------------------------------------------------------ */

    if (
        typeof onStateChange ===
        "function"
    ) {

        onStateChange({
            state: "loading",
            query: githubQuery
        });
    }


    if (container) {

        container.innerHTML = `
            <div class="loading">
                Searching GitHub...
            </div>
        `;
    }


    try {

        const sort =
            getGitHubSort(
                filters.sort
            );


        const data =
            await searchRepositories({

                query:
                    githubQuery,

                page,

                perPage,

                sort:
                    sort.sort,

                order:
                    sort.order

            });


        /* --------------------------------------------------
           Save search history
           -------------------------------------------------- */

        if (
            query &&
            query.trim()
        ) {

            addSearchHistory({

                query,

                mode,

                filters

            });
        }


        /* --------------------------------------------------
           Render results
           -------------------------------------------------- */

        if (container) {

            renderRepositories(
                data.items || [],
                container
            );
        }


        if (
            typeof onStateChange ===
            "function"
        ) {

            onStateChange({

                state: "success",

                query:
                    githubQuery,

                total:
                    data.total_count || 0,

                items:
                    data.items || [],

                incomplete:
                    data.incomplete_results ||
                    false

            });
        }


        return data;

    } catch (error) {

        if (container) {

            container.innerHTML = `
                <div class="error-message">
                    ${escapeHtml(
                        error.message ||
                        "Unable to search GitHub."
                    )}
                </div>
            `;
        }


        showNotification(
            error.message ||
            "GitHub search failed.",
            "error"
        );


        if (
            typeof onStateChange ===
            "function"
        ) {

            onStateChange({

                state: "error",

                error

            });
        }


        throw error;
    }
}


/* ==========================================================
   6. INITIALIZE SEARCH UI
   ========================================================== */

/**
 * Connect search input/button with application.
 *
 * @param {object} options
 */
export function initializeSearch({
    input,
    button,
    container,
    getMode,
    getFilters,
    onResults
} = {}) {

    if (!input) {
        return;
    }


    /* ------------------------------------------------------
       Search function
       ------------------------------------------------------ */

    const executeSearch = async () => {

        const query =
            input.value.trim();


        const mode =
            typeof getMode ===
            "function"
                ? getMode()
                : "everything";


        const filters =
            typeof getFilters ===
            "function"
                ? getFilters()
                : {};


        try {

            await performSearch({

                query,

                mode,

                filters,

                container,

                onStateChange:
                    state => {

                        if (
                            typeof onResults ===
                            "function"
                        ) {

                            onResults(
                                state
                            );
                        }

                    }

            });

        } catch {
            // Error is already handled.
        }
    };


    /* ------------------------------------------------------
       Search button
       ------------------------------------------------------ */

    if (button) {

        button.addEventListener(
            "click",
            executeSearch
        );
    }


    /* ------------------------------------------------------
       Enter key
       ------------------------------------------------------ */

    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                executeSearch();
            }

        }
    );


    return {
        search:
            executeSearch
    };
}


/* ==========================================================
   7. SEARCH MODE INITIALIZATION
   ========================================================== */

/**
 * Initialize search type buttons.
 *
 * @param {Function} onModeChange
 * @returns {Function}
 */
export function initializeSearchModes(
    onModeChange
) {

    const buttons =
        document.querySelectorAll(
            ".search-type"
        );


    let activeMode =
        "everything";


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                buttons.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                button.classList.add(
                    "active"
                );


                activeMode =
                    button.dataset.search ||
                    "everything";


                if (
                    typeof onModeChange ===
                    "function"
                ) {

                    onModeChange(
                        activeMode
                    );
                }

            }
        );

    });


    return () =>
        activeMode;
}


/* ==========================================================
   8. QUICK SEARCH
   ========================================================== */

/**
 * Initialize quick-search buttons.
 *
 * @param {HTMLInputElement} input
 * @param {Function} search
 */
export function initializeQuickSearches(
    input,
    search
) {

    if (!input) {
        return;
    }


    const buttons =
        document.querySelectorAll(
            ".quick-search"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const query =
                    button.dataset.query ||
                    button.textContent.trim();


                input.value =
                    query;


                if (
                    typeof search ===
                    "function"
                ) {

                    search();
                }

            }
        );

    });
}


/* ==========================================================
   9. SEARCH RESULT SUMMARY
   ========================================================== */

/**
 * Update result counter.
 *
 * Looks for:
 *
 *     #resultCount
 *
 * @param {number} total
 */
export function updateResultCount(
    total
) {

    const element =
        document.getElementById(
            "resultCount"
        );


    if (!element) {
        return;
    }


    element.textContent =
        formatNumber(total);
}




/* ==========================================================
   11. CARD / TAG GITHUB SEARCH INTERACTIONS
   ========================================================== */

/**
 * Make technology cards, technology pills, pipeline nodes,
 * learning cards, and similar UI elements perform a GitHub
 * search instead of navigating to dead placeholder pages.
 *
 * @param {Function} onSearch Function that accepts a query.
 */
export function initializeCardAndTagSearch(
    onSearch
) {

    if (typeof onSearch !== "function") {
        return;
    }

    /*
     * Return useful visible text from a card without including
     * its full description. This keeps GitHub queries focused.
     */
    function getElementLabel(element) {

        const preferred =
            element.querySelector(
                ".technology-name, .cloud-card h3, h3, .pipeline-node strong, .stack-node strong, .cluster-title strong, .feature-index"
            );

        if (preferred?.textContent?.trim()) {
            return preferred.textContent.trim();
        }

        return (
            element.getAttribute("aria-label") ||
            element.textContent ||
            ""
        ).trim();
    }

    /*
     * Find a meaningful parent card for generic pills such as:
     *
     *     AWS + Cloud
     *     AWS + Infrastructure
     *     Azure + AKS
     *     GCP + GKE
     *
     * The pill itself becomes the search refinement.
     */
    function buildPillQuery(pill) {

        const pillText =
            pill.textContent.trim();

        const parent =
            pill.closest(
                ".cloud-card, .feature-card, .split-card, .cluster-level"
            );

        const parentTitle =
            parent
                ? getElementLabel(parent)
                : "";

        if (
            parentTitle &&
            pillText &&
            parentTitle.toLowerCase() !==
                pillText.toLowerCase()
        ) {
            return `${parentTitle} ${pillText}`;
        }

        return pillText || parentTitle;
    }

    /*
     * One delegated listener covers both existing and
     * dynamically-rendered technology cards.
     */
    document.addEventListener("click", event => {

        const interactive =
            event.target.closest(
                "[data-technology], [data-search-query], .technology-pill, .feature-card, .flow-card, .pipeline-node, .stack-node, .cluster-title"
            );

        if (!interactive) {
            return;
        }

        /*
         * Do not hijack normal links/buttons placed inside
         * a card. Those controls have their own behavior.
         */
        if (
            event.target.closest(
                "a, button, input, select, textarea"
            )
        ) {
            return;
        }

        let query =
            interactive.dataset.searchQuery ||
            "";

        if (!query && interactive.matches(".technology-pill")) {
            query = buildPillQuery(interactive);
        }

        if (!query) {
            query = getElementLabel(interactive);
        }

        if (!query) {
            return;
        }

        event.preventDefault();

        onSearch(query);

    });

    /*
     * Mirror click behavior for keyboard users.
     */
    document.addEventListener("keydown", event => {

        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        const interactive =
            event.target.closest(
                "[data-technology], [data-search-query], .technology-pill, .feature-card, .flow-card, .pipeline-node, .stack-node, .cluster-title"
            );

        if (!interactive) {
            return;
        }

        if (
            event.target.closest(
                "a, button, input, select, textarea"
            )
        ) {
            return;
        }

        event.preventDefault();

        let query =
            interactive.dataset.searchQuery ||
            "";

        if (!query && interactive.matches(".technology-pill")) {
            query = buildPillQuery(interactive);
        }

        if (!query) {
            query = getElementLabel(interactive);
        }

        if (query) {
            onSearch(query);
        }

    });

}


/* ==========================================================
   END OF search.js
   ========================================================== */