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

    append = false,

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


    if (container && !append) {

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
            query.trim() &&
            !append
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
                container,
                { append }
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

        if (container && !append) {

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
    onResults,
    paginationContainer = null
} = {}) {

    if (!input) {
        return null;
    }

    /*
     * Keep pagination state inside the search controller so every
     * caller (main search, card search, quick search, filters) uses
     * exactly the same GitHub query and pagination behavior.
     */
    let currentPage = 1;
    let lastQuery = "";
    let lastMode = "everything";
    let lastFilters = {};
    let lastTotal = 0;
    let lastPerPage = 12;
    let displayedItems = [];
    let showingAppendedPages = false;

    const pagination =
        paginationContainer ||
        document.getElementById("repositoryPagination");

    function notify(state) {
        if (typeof onResults === "function") {
            onResults(state);
        }
    }

    function renderPagination() {
        if (!pagination) {
            return;
        }

        pagination.innerHTML = "";

        if (!lastTotal || !lastQuery) {
            return;
        }

        /* GitHub repository search is capped at 1,000 results. */
        const totalPages = Math.min(
            Math.ceil(lastTotal / lastPerPage),
            100
        );

        const pageFirstItem =
            ((currentPage - 1) * lastPerPage) + 1;

        const pageLastItem =
            Math.min(currentPage * lastPerPage, lastTotal);

        const firstItem = showingAppendedPages
            ? 1
            : pageFirstItem;

        const lastItem = showingAppendedPages
            ? Math.min(displayedItems.length, lastTotal)
            : pageLastItem;

        const summary = document.createElement("div");
        summary.className = "pagination-summary";
        summary.textContent =
            `Showing ${formatNumber(firstItem)}–${formatNumber(lastItem)} of ${formatNumber(lastTotal)} repositories`;

        pagination.appendChild(summary);

        const controls = document.createElement("div");
        controls.className = "pagination-controls";

        /* See More appends the next GitHub page to the grid. */
        if (currentPage < totalPages) {
            const more = document.createElement("button");
            more.type = "button";
            more.className = "pagination-more";
            more.textContent = "See more";
            more.addEventListener("click", async () => {
                more.disabled = true;
                more.textContent = "Loading...";
                try {
                    await executeSearch({
                        page: currentPage + 1,
                        append: true
                    });
                } catch {
                    more.disabled = false;
                    more.textContent = "See more";
                }
            });
            controls.appendChild(more);
        }

        /* Page-number navigation replaces the visible page. */
        if (totalPages > 1) {
            const pages = document.createElement("div");
            pages.className = "pagination-pages";

            const addPage = (page, label = String(page)) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "pagination-page";
                button.textContent = label;
                button.setAttribute("aria-label", `Go to page ${page}`);
                if (page === currentPage) {
                    button.classList.add("active");
                    button.setAttribute("aria-current", "page");
                }
                button.addEventListener("click", () => {
                    executeSearch({ page, append: false });
                });
                pages.appendChild(button);
            };

            const addEllipsis = () => {
                const span = document.createElement("span");
                span.className = "pagination-ellipsis";
                span.textContent = "…";
                pages.appendChild(span);
            };

            const visible = new Set([1, totalPages]);
            for (let page = currentPage - 2; page <= currentPage + 2; page += 1) {
                if (page > 0 && page <= totalPages) {
                    visible.add(page);
                }
            }

            const ordered = [...visible].sort((a, b) => a - b);
            let previous = 0;
            ordered.forEach(page => {
                if (previous && page - previous > 1) {
                    addEllipsis();
                }
                addPage(page);
                previous = page;
            });

            controls.appendChild(pages);
        }

        pagination.appendChild(controls);
    }

    async function executeSearch({ page = 1, append = false } = {}) {
        const query = input.value.trim();
        const mode = typeof getMode === "function" ? getMode() : "everything";
        const filters = typeof getFilters === "function" ? getFilters() : {};
        const previousPage = currentPage;
        const previousAppendState = showingAppendedPages;

        lastQuery = query;
        lastMode = mode;
        lastFilters = filters;
        currentPage = Math.max(1, Number(page) || 1);
        lastPerPage = 12;
        showingAppendedPages = append;

        try {
            const data = await performSearch({
                query,
                mode,
                filters,
                page: currentPage,
                perPage: lastPerPage,
                container,
                append,
                onStateChange: state => {
                    if (state.state === "success") {
                        const items = state.items || [];
                        lastTotal = state.total || 0;

                        if (append) {
                            displayedItems = [...displayedItems, ...items];
                            showingAppendedPages = true;
                        } else {
                            displayedItems = items;
                            showingAppendedPages = false;
                        }

                        renderPagination();

                        notify({
                            ...state,
                            items: displayedItems,
                            page: currentPage,
                            perPage: lastPerPage
                        });
                        return;
                    }

                    notify({
                        ...state,
                        page: currentPage
                    });
                }
            });

            return data;
        } catch (error) {
            if (append) {
                currentPage = previousPage;
                showingAppendedPages = previousAppendState;
            }

            if (container && !append) {
                container.innerHTML = `
                    <div class="error-message">
                        ${escapeHtml(error.message || "Unable to search GitHub.")}
                    </div>
                `;
            }

            showNotification(
                error.message || "GitHub search failed.",
                "error"
            );

            notify({ state: "error", error, page: currentPage });
            throw error;
        }
    }

    if (button) {
        button.addEventListener("click", () => executeSearch());
    }

    input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            executeSearch();
        }
    });

    return {
        search: executeSearch,
        getState: () => ({
            page: currentPage,
            total: lastTotal,
            query: lastQuery,
            mode: lastMode,
            filters: lastFilters,
            items: displayedItems
        })
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
export function initializeCardAndTagSearch(onSearch) {

    if (typeof onSearch !== "function") {
        return;
    }

    /*
     * Read the title of a card. The title is deliberately preferred
     * over the whole card text so descriptions do not pollute queries.
     */
    function getElementLabel(element) {
        const preferred = element.querySelector(
            ".technology-name, .cloud-card h3, .category-name, h3, .pipeline-node strong, .stack-node strong, .cluster-title strong"
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
     * Build the exact relationship the user expects:
     *
     *     Amazon Web Services + DevOps
     *     Microsoft Azure + AKS
     *     Version Control + Git
     *     Containers + Docker
     *
     * Technology-specific data attributes still win when a pill is
     * already explicitly mapped to a technology.
     */
    function buildPillQuery(pill) {
        const pillText = pill.textContent.trim();
        const parent = pill.closest(
            ".cloud-card, .category-card, .feature-card, .split-card, .pipeline-card, .cluster-level, .cluster-panel"
        );

        let parentTitle = "";

        if (parent) {
            const titleElement = parent.querySelector(
                ".category-name, .cloud-card h3, .feature-card h3, .cluster-panel h3, .cluster-level strong, .pipeline-card h3"
            );
            parentTitle = titleElement?.textContent?.trim() || "";
        }

        /* Some sections (for example Infrastructure as Code) use a
           plain feature card without an internal h3. In that case the
           section heading is the correct context. */
        if (!parentTitle) {
            const section = pill.closest("section");
            parentTitle =
                section?.querySelector(".section-title, h2")?.textContent?.trim() || "";
        }

        if (
            parentTitle &&
            pillText &&
            parentTitle.toLowerCase() !== pillText.toLowerCase()
        ) {
            return `${parentTitle} ${pillText}`;
        }

        return pillText || parentTitle;
    }

    function resolveQuery(interactive) {
        /* Explicit search query is the strongest source. */
        if (interactive.dataset.searchQuery?.trim()) {
            return interactive.dataset.searchQuery.trim();
        }

        /* A technology pill with its own ID searches that technology. */
        /* All pills use the same parent-context behavior as the cloud
           provider cards. This makes Git under Version Control become
           "Version Control Git", Jenkins under CI/CD become "CI/CD Jenkins",
           and Terraform under Infrastructure as Code become
           "Infrastructure as Code Terraform". */
        if (interactive.matches(".technology-pill")) {
            return buildPillQuery(interactive);
        }

        if (interactive.dataset.technology?.trim()) {
            const categoryContext = interactive.dataset.categoryContext?.trim();
            const visibleLabel = getElementLabel(interactive);
            return categoryContext
                ? `${categoryContext} ${visibleLabel}`
                : visibleLabel;
        }

        /* Category cards search their category name. */
        if (interactive.dataset.category?.trim()) {
            return getElementLabel(interactive);
        }

        return getElementLabel(interactive);
    }

    function handle(interactive, event) {
        if (!interactive) {
            return;
        }

        /* Never intercept real links, form controls, or bookmark buttons. */
        if (event.target.closest("a, button, input, select, textarea")) {
            return;
        }

        const query = resolveQuery(interactive);
        if (!query) {
            return;
        }

        event.preventDefault();
        onSearch(query);
    }

    document.addEventListener("click", event => {
        const interactive = event.target.closest(
            "[data-technology], [data-category], [data-search-query], .technology-pill, .feature-card, .flow-card, .pipeline-node, .stack-node, .cluster-title"
        );
        handle(interactive, event);
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        const interactive = event.target.closest(
            "[data-technology], [data-category], [data-search-query], .technology-pill, .feature-card, .flow-card, .pipeline-node, .stack-node, .cluster-title"
        );

        if (!interactive || event.target.closest("a, button, input, select, textarea")) {
            return;
        }

        event.preventDefault();
        handle(interactive, event);
    });
}


/* ==========================================================
   END OF search.js
   ========================================================== */