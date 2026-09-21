```javascript
/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
app.js
============================================================

MAIN APPLICATION CONTROLLER

This is the entry point of the application.

HTML loads this file:

    <script
        type="module"
        src="js/app.js"
    ></script>

app.js connects:

    Search
       ↓
    Filters
       ↓
    GitHub API
       ↓
    Repository Cards

and:

    Local JSON
       ↓
    Technologies
       ↓
    Categories

and:

    localStorage
       ↓
    Saved Resources
       ↓
    Search History

and:

    DevOps Categories
       ↓
    Technologies
       ↓
    GitHub Search

============================================================
*/


/* ==========================================================
   IMPORTS
   ========================================================== */


/*
 * General utilities.
 */

import {

    qs,
    qsa,
    getQueryParam,
    getProjectRoot,
    getErrorMessage,
    showNotification

} from "./utils.js";


/*
 * GitHub API.
 */

import {

    getRateLimit,
    getRepository,
    getUser

} from "./github-api.js";


/*
 * Search system.
 */

import {

    initializeSearch,
    initializeSearchModes,
    initializeQuickSearches

} from "./search.js";


/*
 * Filters.
 */

import {

    getFilters,
    initializeFilters

} from "./filters.js";


/*
 * Technology database.
 */

import {

    loadTechnologies,
    renderTechnologies,
    populateTechnologyFilter,
    initializeTechnologyCards

} from "./technologies.js";


/*
 * Categories.
 */

import {

    loadCategories,
    renderCategories,
    initializeCategoryCards

} from "./categories.js";


/*
 * Repository rendering.
 */

import {

    renderRepositories

} from "./repository-card.js";


/*
 * Storage.
 */

import {

    getSavedRepositories

} from "./storage.js";


/*
 * Central DevOps database.
 *
 * This database connects:
 *
 * Category
 *     ↓
 * Technology
 *     ↓
 * GitHub Search
 */

import {

    devopsCategories,
    devopsTechnologies

} from "./devops-data.js";


/* ==========================================================
   1. APPLICATION STATE
   ========================================================== */

const appState = {

    /*
     * Current search mode.
     */

    searchMode:
        "everything",


    /*
     * Last search results.
     */

    repositories:
        [],


    /*
     * Application initialized.
     */

    initialized:
        false

};


/* ==========================================================
   2. DETECT CURRENT PAGE
   ========================================================== */

/**
 * Determine which page is currently open.
 *
 * @returns {string}
 */
function getCurrentPage() {

    const page =
        document.body.dataset.page;


    if (page) {
        return page;
    }


    const pathname =
        window.location.pathname;


    if (
        pathname.endsWith(
            "index.html"
        ) ||
        pathname.endsWith("/")
    ) {

        return "home";
    }


    if (
        pathname.includes(
            "explorer.html"
        )
    ) {

        return "explorer";
    }


    if (
        pathname.includes(
            "technologies.html"
        )
    ) {

        return "technologies";
    }


    if (
        pathname.includes(
            "technology.html"
        )
    ) {

        return "technology";
    }


    if (
        pathname.includes(
            "repository.html"
        )
    ) {

        return "repository";
    }


    if (
        pathname.includes(
            "creator.html"
        )
    ) {

        return "creator";
    }


    if (
        pathname.includes(
            "labs.html"
        )
    ) {

        return "labs";
    }


    if (
        pathname.includes(
            "learning-path.html"
        )
    ) {

        return "learning-path";
    }


    if (
        pathname.includes(
            "saved.html"
        )
    ) {

        return "saved";
    }


    return "unknown";
}


/* ==========================================================
   3. NAVIGATION
   ========================================================== */

/**
 * Initialize navbar.
 */
function initializeNavigation() {

    const links =
        qsa(".nav-link");


    links.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                links.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                link.classList.add(
                    "active"
                );

            }
        );

    });


    /*
     * Mobile menu.
     */

    const menuButton =
        qs(
            ".mobile-menu-button"
        );


    const navLinks =
        qs(".main-nav");


    if (
        menuButton &&
        navLinks
    ) {

        menuButton.addEventListener(
            "click",
            () => {

                const isOpen =
                    navLinks.classList.toggle(
                        "mobile-open"
                    );

                menuButton.classList.toggle(
                    "active",
                    isOpen
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );

            }
        );


        /*
         * Close the mobile menu after
         * a navigation link is tapped.
         */

        navLinks.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.closest(
                        ".nav-link"
                    )
                ) {

                    navLinks.classList.remove(
                        "mobile-open"
                    );

                    menuButton.classList.remove(
                        "active"
                    );

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }

}


/* ==========================================================
   4. GITHUB STATUS
   ========================================================== */

/**
 * Update GitHub API status indicator.
 */
async function initializeGitHubStatus() {

    const status =
        qs(".github-status");


    if (!status) {
        return;
    }


    try {

        const rate =
            await getRateLimit();


        const core =
            rate.resources?.core;


        if (!core) {

            status.textContent =
                "GitHub API online";

            status.classList.add(
                "online"
            );

            return;
        }


        const remaining =
            core.remaining;


        const limit =
            core.limit;


        status.textContent =
            `GitHub API ${remaining}/${limit}`;


        status.classList.add(
            remaining > 100
                ? "online"
                : "warning"
        );


    } catch {

        status.textContent =
            "GitHub API unavailable";


        status.classList.add(
            "offline"
        );

    }

}


/* ==========================================================
   5. CATEGORY → TECHNOLOGY
   ========================================================== */

/**
 * Open a DevOps category.
 *
 * Flow:
 *
 * Category
 *    ↓
 * Find category in devops-data.js
 *    ↓
 * Get technology IDs
 *    ↓
 * Find technology details
 *    ↓
 * Render technology cards
 *    ↓
 * Scroll to technology section
 *
 * @param {string} categoryId
 */
function openCategory(
    categoryId
) {

    /*
     * Find selected category.
     */

    const category =
        devopsCategories.find(
            item =>
                item.id === categoryId
        );


    /*
     * Stop if category does not exist.
     */

    if (!category) {

        console.warn(
            "Category not found:",
            categoryId
        );

        return;
    }


    /*
     * Find technology grid.
     */

    const technologyGrid =
        document.getElementById(
            "technologyGrid"
        );


    if (!technologyGrid) {

        console.warn(
            "Technology grid not found."
        );

        return;
    }


    /*
     * Update section heading if
     * a category heading exists.
     */

    const technologySection =
        document.querySelector(
            ".technologies-map"
        );


    const heading =
        technologySection?.querySelector(
            "h2"
        );


    const description =
        technologySection?.querySelector(
            ".section-heading p"
        );


    if (heading) {

        heading.textContent =
            category.name;
    }


    if (description) {

        description.textContent =
            category.description ||
            "Explore technologies in this DevOps category.";
    }


    /*
     * Build technology cards.
     */

    const technologyCards =
        category.technologies
            .map(
                id => {

                    const technology =
                        devopsTechnologies[id];


                    /*
                     * Skip technologies that
                     * do not exist in the database.
                     */

                    if (!technology) {

                        console.warn(
                            `Technology "${id}" is missing from devopsTechnologies.`
                        );

                        return "";
                    }


                    return `

                        <article
                            class="technology-card"
                            data-technology="${id}"
                            tabindex="0"
                            role="button"
                            aria-label="Explore ${technology.name}"
                        >

                            <h3>
                                ${technology.name}
                            </h3>


                            <p>
                                ${technology.description}
                            </p>


                            <span>
                                ${technology.category}
                            </span>


                            <strong>
                                Explore →
                            </strong>

                        </article>

                    `;

                }
            )
            .join("");


    /*
     * Render cards.
     */

    technologyGrid.innerHTML =
        technologyCards ||
        `

            <div class="empty-state no-results">

                <div class="empty-state-icon">
                    &gt;_
                </div>

                <div class="empty-state-title">
                    No technologies found
                </div>

                <p class="empty-state-description">
                    No technologies are currently configured
                    for this category.
                </p>

            </div>

        `;


    /*
     * Add active state to the
     * selected category card.
     */

    qsa(
        "[data-category]"
    ).forEach(
        card => {

            card.classList.toggle(
                "active",
                card.dataset.category ===
                    categoryId
            );

        }
    );


    /*
     * Scroll to technology section.
     */

    technologySection?.scrollIntoView({

        behavior:
            "smooth",

        block:
            "start"

    });

}


/**
 * Open a technology.
 *
 * The technology is converted into a
 * GitHub search query.
 *
 * Example:
 *
 * Kubernetes
 *     ↓
 * Search GitHub
 *
 * @param {string} technologyId
 */
function openTechnology(
    technologyId
) {

    const technology =
        devopsTechnologies[
            technologyId
        ];


    if (!technology) {

        console.warn(
            "Technology not found:",
            technologyId
        );

        return;
    }


    /*
     * Find homepage search input.
     */

    const searchInput =
        qs("#searchInput");


    /*
     * If the homepage search exists,
     * use the existing search system.
     */

    if (searchInput) {

        searchInput.value =
            technology.githubSearch ||
            technology.name;


        /*
         * Scroll to search section.
         */

        const exploreSection =
            qs("#explore");


        if (exploreSection) {

            exploreSection.scrollIntoView({

                behavior:
                    "smooth",

                block:
                    "start"

            });

        }


        /*
         * Trigger the existing search button.
         */

        const searchButton =
            qs("#searchButton");


        if (searchButton) {

            setTimeout(
                () => {

                    searchButton.click();

                },
                300
            );

            return;
        }

    }


    /*
     * Fallback:
     *
     * If the search system is not available,
     * open the explorer page with the query.
     */

    const query =
        encodeURIComponent(
            technology.githubSearch ||
            technology.name
        );


    const root =
        getProjectRoot();


    window.location.href =
        `${root}explorer.html?q=${query}`;

}


/**
 * Initialize category and technology
 * interaction.
 *
 * This uses event delegation so it also
 * works after the technology grid is
 * replaced dynamically.
 *
 * @param {HTMLElement|null} categoryContainer
 * @param {HTMLElement|null} technologyContainer
 */
function initializeCategoryTechnologyInteractions(
    categoryContainer,
    technologyContainer
) {

    /*
     * Category click handling.
     */

    if (categoryContainer) {

        categoryContainer.addEventListener(
            "click",
            event => {

                const card =
                    event.target.closest(
                        "[data-category]"
                    );


                if (!card) {
                    return;
                }


                const categoryId =
                    card.dataset.category;


                if (!categoryId) {
                    return;
                }


                openCategory(
                    categoryId
                );

            }
        );


        /*
         * Keyboard accessibility.
         */

        categoryContainer.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;
                }


                const card =
                    event.target.closest(
                        "[data-category]"
                    );


                if (!card) {
                    return;
                }


                event.preventDefault();


                const categoryId =
                    card.dataset.category;


                if (!categoryId) {
                    return;
                }


                openCategory(
                    categoryId
                );

            }
        );

    }


    /*
     * Technology click handling.
     *
     * Event delegation is important because
     * openCategory() replaces the technology
     * cards dynamically.
     */

    if (technologyContainer) {

        technologyContainer.addEventListener(
            "click",
            event => {

                const card =
                    event.target.closest(
                        "[data-technology]"
                    );


                if (!card) {
                    return;
                }


                const technologyId =
                    card.dataset.technology;


                if (!technologyId) {
                    return;
                }


                openTechnology(
                    technologyId
                );

            }
        );


        /*
         * Keyboard accessibility.
         */

        technologyContainer.addEventListener(
            "keydown",
            event => {

                if (
                    event.key !== "Enter" &&
                    event.key !== " "
                ) {

                    return;
                }


                const card =
                    event.target.closest(
                        "[data-technology]"
                    );


                if (!card) {
                    return;
                }


                event.preventDefault();


                const technologyId =
                    card.dataset.technology;


                if (!technologyId) {
                    return;
                }


                openTechnology(
                    technologyId
                );

            }
        );

    }

}


/* ==========================================================
   6. HOME PAGE
   ========================================================== */

/**
 * Initialize homepage.
 */
async function initializeHomePage() {

    const searchInput =
        qs("#searchInput");


    const searchButton =
        qs("#searchButton");


    const repositoryContainer =
        qs("#repositoryResults");


    const technologyContainer =
        qs("#technologyGrid");


    const categoryContainer =
        qs("#categoryGrid");


    /* ------------------------------------------------------
       Category / Technology interactions
       ------------------------------------------------------ */

    initializeCategoryTechnologyInteractions(
        categoryContainer,
        technologyContainer
    );


    /* ------------------------------------------------------
       Technologies
       ------------------------------------------------------ */

    try {

        const technologies =
            await loadTechnologies();


        if (
            technologyContainer
        ) {

            /*
             * Display the first 24 technologies
             * on the homepage.
             */

            renderTechnologies(
                technologies.slice(0, 24),
                technologyContainer
            );


            initializeTechnologyCards(
                technologyContainer
            );

        }


        await populateTechnologyFilter();

    } catch (error) {

        console.error(
            "Technology loading failed:",
            error
        );

    }


    /* ------------------------------------------------------
       Categories
       ------------------------------------------------------ */

    try {

        const categories =
            await loadCategories();


        if (
            categoryContainer
        ) {

            renderCategories(
                categories.slice(0, 12),
                categoryContainer
            );


            initializeCategoryCards(
                categoryContainer,
                searchInput
            );

        }

    } catch (error) {

        console.error(
            "Category loading failed:",
            error
        );

    }


    /* ------------------------------------------------------
       Search modes
       ------------------------------------------------------ */

    const getSearchMode =
        initializeSearchModes(
            mode => {

                appState.searchMode =
                    mode;

            }
        );


    /* ------------------------------------------------------
       Filters
       ------------------------------------------------------ */

    initializeFilters(
        () => {

            /*
             * If there are already results,
             * search again automatically.
             */

            if (
                searchInput?.value.trim()
            ) {

                executeSearch();

            }

        }
    );


    /* ------------------------------------------------------
       Search
       ------------------------------------------------------ */

    const searchController =
        initializeSearch({

            input:
                searchInput,

            button:
                searchButton,

            container:
                repositoryContainer,

            getMode:
                getSearchMode,

            getFilters,

            onResults:
                state => {

                    if (
                        state.state ===
                        "success"
                    ) {

                        appState.repositories =
                            state.items || [];


                        updateResultUI(
                            state
                        );

                    }

                }

        });


    /*
     * Store search function.
     */

    function executeSearch() {

        if (
            searchController?.search
        ) {

            return searchController.search();

        }

    }


    /* ------------------------------------------------------
       Quick searches
       ------------------------------------------------------ */

    initializeQuickSearches(
        searchInput,
        executeSearch
    );


    /* ------------------------------------------------------
       Optional initial search
       ------------------------------------------------------ */

    const query =
        getQueryParam("q");


    if (
        query &&
        searchInput
    ) {

        searchInput.value =
            query;


        executeSearch();

    }


    /*
     * If no query exists,
     * show initial empty state.
     */

    if (
        repositoryContainer &&
        !query
    ) {

        repositoryContainer.innerHTML = `

            <div class="
                empty-state
                no-results
            ">

                <div class="empty-state-icon">
                    &gt;_
                </div>

                <div class="empty-state-title">
                    Ready to explore GitHub
                </div>

                <p class="empty-state-description">
                    Search for Kubernetes, AWS,
                    Terraform, Jenkins, Docker,
                    Argo CD, DevSecOps and more.
                </p>

            </div>

        `;

    }

}


/* ==========================================================
   7. UPDATE SEARCH UI
   ========================================================== */

/**
 * Update search result count/status.
 *
 * @param {object} state
 */
function updateResultUI(
    state
) {

    const resultCount =
        qs("#resultCount");


    const resultStatus =
        qs("#resultsStatus");


    if (resultCount) {

        resultCount.textContent =
            Number(
                state.total || 0
            ).toLocaleString();

    }


    if (resultStatus) {

        resultStatus.textContent =
            state.incomplete
                ? "GitHub returned an incomplete result set."
                : "GitHub search complete.";

    }

}


/* ==========================================================
   8. TECHNOLOGIES PAGE
   ========================================================== */

/**
 * Initialize technologies listing page.
 */
async function initializeTechnologiesPage() {

    const container =
        qs("#technologyGrid");


    if (!container) {
        return;
    }


    const searchInput =
        qs("#technologySearch");


    try {

        const technologies =
            await loadTechnologies();


        renderTechnologies(
            technologies,
            container
        );


        initializeTechnologyCards(
            container
        );


        /*
         * Local technology search.
         */

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                () => {

                    const query =
                        searchInput.value
                            .trim()
                            .toLowerCase();


                    const filtered =
                        technologies.filter(
                            technology => {

                                const text = [

                                    technology.name,

                                    technology.category,

                                    technology.subcategory,

                                    technology.description,

                                    ...(technology.aliases || []),

                                    ...(technology.keywords || [])

                                ]
                                    .filter(Boolean)
                                    .join(" ")
                                    .toLowerCase();


                                return text.includes(
                                    query
                                );

                            }
                        );


                    renderTechnologies(
                        filtered,
                        container
                    );

                }
            );

        }

    } catch (error) {

        container.innerHTML = `

            <div class="error-message">

                ${getErrorMessage(error)}

            </div>

        `;

    }

}


/* ==========================================================
   9. TECHNOLOGY DETAIL PAGE
   ========================================================== */

/**
 * Initialize technology detail page.
 */
async function initializeTechnologyPage() {

    const name =
        getQueryParam("name");


    if (!name) {
        return;
    }


    try {

        const technology =
            await import(
                "./technologies.js"
            );


        const data =
            await technology.getTechnology(
                name
            );


        if (!data) {

            showNotification(
                "Technology not found.",
                "error"
            );

            return;
        }


        /*
         * Populate generic elements
         * when they exist.
         */

        const title =
            qs("#technologyName");


        const description =
            qs("#technologyDescription");


        const category =
            qs("#technologyCategory");


        if (title) {

            title.textContent =
                data.name;

        }


        if (description) {

            description.textContent =
                data.description ||
                "DevOps technology.";

        }


        if (category) {

            category.textContent =
                data.category ||
                "DevOps";

        }


        /*
         * Render keywords.
         */

        const keywordContainer =
            qs("#technologyKeywords");


        if (
            keywordContainer &&
            Array.isArray(
                data.keywords
            )
        ) {

            keywordContainer.innerHTML =
                data.keywords
                    .map(
                        keyword => `

                            <span class="tag">
                                ${keyword}
                            </span>

                        `
                    )
                    .join("");

        }

    } catch (error) {

        console.error(
            "Technology detail failed:",
            error
        );

    }

}


/* ==========================================================
   10. REPOSITORY DETAIL PAGE
   ========================================================== */

/**
 * Initialize repository detail page.
 */
async function initializeRepositoryPage() {

    const owner =
        getQueryParam("owner");


    const repo =
        getQueryParam("repo");


    if (
        !owner ||
        !repo
    ) {

        return;
    }


    try {

        const repository =
            await getRepository(
                owner,
                repo
            );


        /*
         * Populate elements.
         */

        const title =
            qs("#repositoryName");


        const description =
            qs("#repositoryDescription");


        const stars =
            qs("#repositoryStars");


        const forks =
            qs("#repositoryForks");


        const language =
            qs("#repositoryLanguage");


        const updated =
            qs("#repositoryUpdated");


        const githubLink =
            qs("#repositoryGithub");


        if (title) {

            title.textContent =
                repository.full_name;

        }


        if (description) {

            description.textContent =
                repository.description ||
                "No description available.";

        }


        if (stars) {

            stars.textContent =
                Number(
                    repository.stargazers_count ||
                    0
                ).toLocaleString();

        }


        if (forks) {

            forks.textContent =
                Number(
                    repository.forks_count ||
                    0
                ).toLocaleString();

        }


        if (language) {

            language.textContent =
                repository.language ||
                "Unknown";

        }


        if (updated) {

            updated.textContent =
                repository.updated_at ||
                "Unknown";

        }


        if (githubLink) {

            githubLink.href =
                repository.html_url;

        }


        /*
         * Render topics.
         */

        const topics =
            qs("#repositoryTopics");


        if (
            topics &&
            Array.isArray(
                repository.topics
            )
        ) {

            topics.innerHTML =
                repository.topics
                    .map(
                        topic => `

                            <span class="tag">
                                ${topic}
                            </span>

                        `
                    )
                    .join("");

        }

    } catch (error) {

        const container =
            qs("#repositoryDetail");


        if (container) {

            container.innerHTML = `

                <div class="error-message">
                    ${getErrorMessage(error)}
                </div>

            `;

        }

    }

}


/* ==========================================================
   11. CREATOR DETAIL PAGE
   ========================================================== */

/**
 * Initialize creator page.
 */
async function initializeCreatorPage() {

    const username =
        getQueryParam(
            "username"
        );


    if (!username) {
        return;
    }


    try {

        const user =
            await getUser(
                username
            );


        const name =
            qs("#creatorName");


        const bio =
            qs("#creatorBio");


        const avatar =
            qs("#creatorAvatar");


        const repos =
            qs("#creatorRepos");


        const followers =
            qs("#creatorFollowers");


        const github =
            qs("#creatorGithub");


        if (name) {

            name.textContent =
                user.name ||
                user.login;

        }


        if (bio) {

            bio.textContent =
                user.bio ||
                "GitHub developer.";

        }


        if (avatar) {

            avatar.src =
                user.avatar_url;

            avatar.alt =
                user.login;

        }


        if (repos) {

            repos.textContent =
                user.public_repos;

        }


        if (followers) {

            followers.textContent =
                user.followers;

        }


        if (github) {

            github.href =
                user.html_url;

        }

    } catch (error) {

        showNotification(
            getErrorMessage(error),
            "error"
        );

    }

}


/* ==========================================================
   12. SAVED PAGE
   ========================================================== */

/**
 * Render locally saved repositories.
 */
function initializeSavedPage() {

    const container =
        qs("#savedRepositoryResults");


    if (!container) {
        return;
    }


    const saved =
        getSavedRepositories();


    renderRepositories(
        saved,
        container
    );


    const count =
        qs("#savedCount");


    if (count) {

        count.textContent =
            saved.length;

    }

}


/* ==========================================================
   13. LAB PAGE
   ========================================================== */

/**
 * Labs page simply initializes the normal search system,
 * but defaults the mode to labs.
 */
async function initializeLabsPage() {

    const input =
        qs("#searchInput");


    const button =
        qs("#searchButton");


    const container =
        qs("#repositoryResults");


    if (!input) {
        return;
    }


    const getSearchMode =
        initializeSearchModes(
            mode => {

                appState.searchMode =
                    mode;

            }
        );


    appState.searchMode =
        "labs";


    const searchController =
        initializeSearch({

            input,

            button,

            container,

            getMode:
                () =>
                    "labs",

            getFilters,

            onResults:
                updateResultUI

        });


    initializeFilters(
        () => {

            searchController.search();

        }
    );


    initializeQuickSearches(
        input,
        () =>
            searchController.search()
    );


    /*
     * Automatically search for DevOps labs.
     */

    input.value =
        input.value ||
        "DevOps Kubernetes";


    searchController.search();

}


/* ==========================================================
   14. GLOBAL BACK TO TOP
   ========================================================== */

/**
 * Initialize back-to-top button.
 */
function initializeBackToTop() {

    const button =
        qs(".back-to-top");


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        () => {

            button.classList.toggle(
                "visible",
                window.scrollY > 500
            );

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({

                top: 0,

                behavior:
                    "smooth"

            });

        }
    );

}


/* ==========================================================
   15. PAGE INITIALIZATION
   ========================================================== */

/**
 * Start application.
 */
async function initializeApp() {

    /*
     * Prevent duplicate initialization.
     */

    if (
        appState.initialized
    ) {

        return;
    }


    appState.initialized =
        true;


    const page =
        getCurrentPage();


    /*
     * Global components.
     */

    initializeNavigation();

    initializeBackToTop();


    /*
     * GitHub API status can run on pages
     * where the status element exists.
     */

    initializeGitHubStatus();


    /*
     * Page-specific initialization.
     */

    switch (page) {

        case "home":

            await initializeHomePage();

            break;


        case "explorer":

            await initializeHomePage();

            break;


        case "technologies":

            await initializeTechnologiesPage();

            break;


        case "technology":

            await initializeTechnologyPage();

            break;


        case "repository":

            await initializeRepositoryPage();

            break;


        case "creator":

            await initializeCreatorPage();

            break;


        case "labs":

            await initializeLabsPage();

            break;


        case "saved":

            initializeSavedPage();

            break;


        case "learning-path":

            /*
             * Learning path is primarily populated by
             * the page's HTML/data in the current V1.
             */

            break;


        default:

            /*
             * Unknown page.
             */

            break;

    }


    /*
     * Global page-enter animation.
     */

    document.body.classList.add(
        "page-enter"
    );

}


/* ==========================================================
   16. START APPLICATION
   ========================================================== */

/*
 * Wait until the DOM is ready.
 */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp
    );

} else {

    initializeApp();

}


/* ==========================================================
   END OF app.js
   ========================================================== */
```
