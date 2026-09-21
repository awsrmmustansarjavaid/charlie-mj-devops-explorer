/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
app.js
============================================================

MAIN APPLICATION CONTROLLER

Connects:

    index.html
        ↓
    app.js
        ↓
    categories.js
    technologies.js
    search.js
    filters.js
    github-api.js
    repository-card.js
    storage.js
    devops-data.js
    utils.js

Main responsibilities:

    - Application startup
    - Page detection
    - Navigation
    - Search
    - Search modes
    - Quick searches
    - Filters
    - Category cards
    - Technology cards
    - Technology modal
    - GitHub status
    - Repository rendering
    - Page-specific initialization
============================================================
*/


/* ============================================================
   01. IMPORTS
   ============================================================ */

import {
    qs,
    qsa,
    getQueryParam,
    getProjectRoot,
    getErrorMessage,
    showNotification
} from "./utils.js";


import {
    getRateLimit,
    getRepository,
    getUser
} from "./github-api.js";


import {
    initializeSearch,
    initializeSearchModes,
    initializeQuickSearches
} from "./search.js";


import {
    getFilters,
    initializeFilters
} from "./filters.js";


import {
    loadTechnologies,
    renderTechnologies,
    populateTechnologyFilter,
    initializeTechnologyCards,
    getTechnology
} from "./technologies.js";


import {
    loadCategories,
    renderCategories,
    initializeCategoryCards
} from "./categories.js";


import {
    renderRepositories
} from "./repository-card.js";


import {
    getSavedRepositories
} from "./storage.js";


import {
    devopsCategories,
    devopsTechnologies
} from "./devops-data.js";


/* ============================================================
   02. APPLICATION STATE
   ============================================================ */

const appState = {

    searchMode: "everything",

    repositories: [],

    categories: [],

    technologies: [],

    initialized: false,

    currentTechnology: null,

    currentCategory: null

};


/* ============================================================
   03. PAGE DETECTION
   ============================================================ */

function getCurrentPage() {

    const body = document.body;

    if (!body) {
        return "home";
    }

    const dataPage = body.dataset.page;

    if (dataPage) {
        return dataPage;
    }

    const path = window.location.pathname.toLowerCase();

    if (
        path.includes("/explorer")
    ) {
        return "explorer";
    }

    if (
        path.includes("/technologies")
    ) {
        return "technologies";
    }

    if (
        path.includes("/technology")
    ) {
        return "technology";
    }

    if (
        path.includes("/repository")
    ) {
        return "repository";
    }

    if (
        path.includes("/creator")
    ) {
        return "creator";
    }

    if (
        path.includes("/labs")
    ) {
        return "labs";
    }

    if (
        path.includes("/learning-path")
    ) {
        return "learning-path";
    }

    if (
        path.includes("/saved")
    ) {
        return "saved";
    }

    return "home";
}


/* ============================================================
   04. NAVIGATION
   ============================================================ */

function initializeNavigation() {

    const navLinks = qsa(".nav-link");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            const mobileMenu = qs(".main-nav");

            if (mobileMenu) {
                mobileMenu.classList.remove("open");
            }

        });

    });


    const mobileButton = qs(".mobile-menu-button");

    const mainNav = qs(".main-nav");


    if (
        mobileButton &&
        mainNav
    ) {

        mobileButton.addEventListener("click", () => {

            const isOpen =
                mainNav.classList.toggle("open");

            mobileButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    }

}


/* ============================================================
   05. GITHUB STATUS
   ============================================================ */

async function initializeGitHubStatus() {

    const statusElements = qsa(".github-status");

    if (!statusElements.length) {
        return;
    }


    try {

        const rateLimit = await getRateLimit();

        statusElements.forEach(element => {

            element.classList.add("online");

            const text =
                element.querySelector(
                    ".github-status-text"
                );

            if (text) {

                if (
                    rateLimit &&
                    typeof rateLimit.remaining !== "undefined"
                ) {

                    text.textContent =
                        `GitHub API ${rateLimit.remaining} requests remaining`;

                } else {

                    text.textContent =
                        "GitHub API connected";

                }

            }

        });

    } catch (error) {

        console.warn(
            "GitHub status check failed:",
            error
        );

        statusElements.forEach(element => {

            element.classList.remove("online");

            const text =
                element.querySelector(
                    ".github-status-text"
                );

            if (text) {
                text.textContent =
                    "GitHub API unavailable";
            }

        });

    }

}


/* ============================================================
   06. CATEGORY → TECHNOLOGY SYSTEM
   ============================================================ */

/*
    This function was missing from the old app.js.

    categories.js intentionally does NOT attach category
    click listeners.

    Therefore app.js must control:

        Category card
             ↓
        openCategory()
             ↓
        Technology cards
*/


function initializeCategoryTechnologyInteractions(
    categoryContainer,
    technologyContainer
) {


    /* --------------------------------------------------------
       CATEGORY CLICK
    -------------------------------------------------------- */

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

                openCategory(categoryId);

            }
        );


        /* ----------------------------------------------------
           CATEGORY KEYBOARD
        ---------------------------------------------------- */

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

                openCategory(categoryId);

            }
        );

    }


    /* --------------------------------------------------------
       TECHNOLOGY CLICK
    -------------------------------------------------------- */

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

                openTechnology(technologyId);

            }
        );


        /* ----------------------------------------------------
           TECHNOLOGY KEYBOARD
        ---------------------------------------------------- */

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

                openTechnology(technologyId);

            }
        );

    }


    /* --------------------------------------------------------
       STATIC TECHNOLOGY CARDS

       Handles cards already present in index.html:

           data-technology="aws"
           data-technology="kubernetes"
           data-technology="docker"
           etc.
    -------------------------------------------------------- */

    document.addEventListener(
        "click",
        event => {

            const element =
                event.target.closest(
                    "[data-technology]"
                );

            if (!element) {
                return;
            }


            if (
                technologyContainer &&
                technologyContainer.contains(element)
            ) {
                return;
            }


            const technologyId =
                element.dataset.technology;

            if (!technologyId) {
                return;
            }

            openTechnology(technologyId);

        }
    );


    /* --------------------------------------------------------
       STATIC TECHNOLOGY KEYBOARD SUPPORT
    -------------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {
                return;
            }


            const element =
                event.target.closest(
                    "[data-technology]"
                );

            if (!element) {
                return;
            }


            if (
                technologyContainer &&
                technologyContainer.contains(element)
            ) {
                return;
            }


            event.preventDefault();


            const technologyId =
                element.dataset.technology;

            if (!technologyId) {
                return;
            }


            openTechnology(technologyId);

        }
    );

}


/* ============================================================
   07. OPEN CATEGORY
   ============================================================ */

function openCategory(categoryId) {

    if (!categoryId) {
        return;
    }


    const normalizedId =
        String(categoryId)
            .trim()
            .toLowerCase();


    let category =
        appState.categories.find(
            item =>
                String(
                    item.slug ||
                    item.id ||
                    item.name ||
                    ""
                )
                .trim()
                .toLowerCase()
                === normalizedId
        );


    if (!category) {

        category =
            devopsCategories.find(
                item =>
                    String(
                        item.slug ||
                        item.id ||
                        item.name ||
                        ""
                    )
                    .trim()
                    .toLowerCase()
                    === normalizedId
            );

    }


    if (!category) {

        console.warn(
            "Category not found:",
            categoryId
        );

        return;
    }


    appState.currentCategory = category;


    const technologyContainer =
        qs("#technologyGrid");


    if (!technologyContainer) {
        return;
    }


    const technologiesSection =
        document.querySelector(
            ".technologies-map"
        );


    const heading =
        technologiesSection?.querySelector(
            "h2"
        );


    const description =
        technologiesSection?.querySelector(
            ".section-heading p"
        );


    if (heading) {

        heading.textContent =
            category.name ||
            category.title ||
            "Technologies";

    }


    if (description) {

        description.textContent =
            category.description ||
            "Explore technologies in this category.";

    }


    const technologyIds =
        Array.isArray(category.technologies)
            ? category.technologies
            : [];


    const technologies = [];


    technologyIds.forEach(
        technologyId => {

            const normalizedTechnologyId =
                String(technologyId)
                    .trim()
                    .toLowerCase();


            const technology =
                devopsTechnologies[
                    normalizedTechnologyId
                ];


            if (technology) {

                technologies.push({
                    ...technology,
                    id:
                        technology.id ||
                        normalizedTechnologyId
                });

            }

        }
    );


    /* --------------------------------------------------------
       If the category contains no direct technology list,
       try matching devops-data.js category references.
    -------------------------------------------------------- */

    if (!technologies.length) {

        Object.entries(
            devopsTechnologies
        ).forEach(
            ([id, technology]) => {

                const technologyCategories =
                    technology.categories ||
                    technology.category ||
                    [];


                const categories =
                    Array.isArray(
                        technologyCategories
                    )
                        ? technologyCategories
                        : [technologyCategories];


                const matches =
                    categories.some(
                        value =>
                            String(value)
                                .trim()
                                .toLowerCase()
                            === normalizedId
                    );


                if (matches) {

                    technologies.push({
                        ...technology,
                        id:
                            technology.id ||
                            id
                    });

                }

            }
        );

    }


    if (technologies.length) {

        renderTechnologies(
            technologies,
            technologyContainer
        );

    } else {

        technologyContainer.innerHTML = `
            <div class="empty-state">
                <h3>No technologies found</h3>
                <p>
                    No technologies are currently
                    assigned to this category.
                </p>
            </div>
        `;

    }


    /* --------------------------------------------------------
       Highlight selected category
    -------------------------------------------------------- */

    qsa(
        "[data-category]",
        document
    ).forEach(element => {

        const value =
            String(
                element.dataset.category || ""
            )
            .trim()
            .toLowerCase();


        element.classList.toggle(
            "active",
            value === normalizedId
        );

    });


    /* --------------------------------------------------------
       Initialize newly rendered technology cards
    -------------------------------------------------------- */

    try {

        initializeTechnologyCards(
            technologyContainer
        );

    } catch (error) {

        console.warn(
            "Technology card initialization warning:",
            error
        );

    }


    /* --------------------------------------------------------
       Scroll to technologies
    -------------------------------------------------------- */

    if (technologiesSection) {

        technologiesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* ============================================================
   08. TECHNOLOGY LOOKUP
   ============================================================ */

function findTechnology(technologyId) {

    if (!technologyId) {
        return null;
    }


    const normalizedId =
        String(technologyId)
            .trim()
            .toLowerCase();


    /* --------------------------------------------------------
       Direct devops-data.js lookup
    -------------------------------------------------------- */

    if (
        devopsTechnologies[
            normalizedId
        ]
    ) {

        return {
            ...devopsTechnologies[
                normalizedId
            ],
            id:
                devopsTechnologies[
                    normalizedId
                ].id ||
                normalizedId
        };

    }


    /* --------------------------------------------------------
       Search loaded technologies
    -------------------------------------------------------- */

    const found =
        appState.technologies.find(
            technology => {

                const id =
                    String(
                        technology.id ||
                        technology.slug ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                const name =
                    String(
                        technology.name ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    id === normalizedId ||
                    name === normalizedId
                );

            }
        );


    if (found) {
        return found;
    }


    return null;

}


/* ============================================================
   09. OPEN TECHNOLOGY
   ============================================================ */

function openTechnology(technologyId) {

    const technology =
        findTechnology(
            technologyId
        );


    if (!technology) {

        console.warn(
            "Technology not found:",
            technologyId
        );

        return;

    }


    appState.currentTechnology =
        technology;


    const modal =
        qs("#technologyModal");


    if (!modal) {

        /*
            If no modal exists on the current page,
            navigate to technology detail when possible.
        */

        const technologySlug =
            technology.slug ||
            technology.id ||
            technology.name;


        if (technologySlug) {

            const root =
                getProjectRoot();


            const target =
                `${root}/technology.html?technology=${encodeURIComponent(
                    technologySlug
                )}`;


            window.location.href =
                target;

        }

        return;

    }


    const title =
        qs("#technologyModalTitle");


    const description =
        qs("#technologyModalDescription");


    if (title) {

        title.textContent =
            technology.name ||
            technology.title ||
            technology.id ||
            "Technology";

    }


    if (description) {

        description.textContent =
            technology.description ||
            technology.summary ||
            "Explore this DevOps technology.";

    }


    modal.hidden = false;

    modal.classList.add("open");

    document.body.classList.add(
        "modal-open"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    /* --------------------------------------------------------
       Optional modal extra content
    -------------------------------------------------------- */

    const modalContent =
        modal.querySelector(
            ".technology-modal-content"
        );


    if (
        modalContent &&
        !modalContent.querySelector(
            ".technology-modal-details"
        )
    ) {

        const details =
            document.createElement(
                "div"
            );


        details.className =
            "technology-modal-details";


        const website =
            technology.url ||
            technology.website ||
            technology.homepage;


        if (website) {

            const link =
                document.createElement("a");


            link.href = website;

            link.target = "_blank";

            link.rel = "noopener noreferrer";

            link.textContent =
                "Official Website →";


            details.appendChild(link);

        }


        modalContent.appendChild(
            details
        );

    }

}


/* ============================================================
   10. CLOSE TECHNOLOGY MODAL
   ============================================================ */

function closeTechnologyModal() {

    const modal =
        qs("#technologyModal");


    if (!modal) {
        return;
    }


    modal.classList.remove("open");

    modal.hidden = true;

    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* ============================================================
   11. INITIALIZE TECHNOLOGY MODAL
   ============================================================ */

function initializeTechnologyModal() {

    const modal =
        qs("#technologyModal");


    if (!modal) {
        return;
    }


    const closeButton =
        qs("#technologyModalClose");


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeTechnologyModal
        );

    }


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeTechnologyModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeTechnologyModal();

            }

        }
    );

}


/* ============================================================
   12. RESULT UI
   ============================================================ */

function updateResultUI(state) {

    const resultCount =
        qs("#resultCount");


    const resultsStatus =
        qs("#resultsStatus");


    const items =
        Array.isArray(state?.items)
            ? state.items
            : [];


    if (resultCount) {

        resultCount.textContent =
            String(items.length);

    }


    if (resultsStatus) {

        if (
            state?.state === "loading"
        ) {

            resultsStatus.textContent =
                "Searching GitHub...";

        } else if (
            state?.state === "success"
        ) {

            resultsStatus.textContent =
                items.length
                    ? `${items.length} repositories found`
                    : "No repositories found";

        } else if (
            state?.state === "error"
        ) {

            resultsStatus.textContent =
                getErrorMessage(
                    state.error ||
                    state.message ||
                    "Search failed."
                );

        } else {

            resultsStatus.textContent =
                "";

        }

    }

}


/* ============================================================
   13. INITIALIZE HOME PAGE
   ============================================================ */

async function initializeHomePage() {

    const searchInput =
        qs("#searchInput");


    const searchButton =
        qs("#searchButton");


    const repositoryContainer =
        qs("#repositoryResults");


    const repositoryGrid =
        qs("#repositoryGrid");


    const technologyContainer =
        qs("#technologyGrid");


    const categoryContainer =
        qs("#categoryGrid");


    /* --------------------------------------------------------
       Category + technology interactions

       IMPORTANT:
       This must happen before search initialization,
       but it must never stop the rest of the application.
    -------------------------------------------------------- */

    initializeCategoryTechnologyInteractions(
        categoryContainer,
        technologyContainer
    );


    initializeTechnologyModal();


    /* ========================================================
       LOAD TECHNOLOGIES
    ======================================================== */

    try {

        const technologies =
            await loadTechnologies();


        appState.technologies =
            Array.isArray(technologies)
                ? technologies
                : [];


        if (technologyContainer) {

            renderTechnologies(
                appState.technologies,
                technologyContainer
            );


            initializeTechnologyCards(
                technologyContainer
            );

        }


        await populateTechnologyFilter();

    } catch (error) {

        console.error(
            "Failed to load technologies:",
            error
        );

    }


    /* ========================================================
       LOAD CATEGORIES
    ======================================================== */

    try {

        const categories =
            await loadCategories();


        appState.categories =
            Array.isArray(categories)
                ? categories
                : [];


        if (categoryContainer) {

            renderCategories(
                appState.categories.slice(
                    0,
                    12
                ),
                categoryContainer
            );


            initializeCategoryCards(
                categoryContainer,
                searchInput
            );

        }

    } catch (error) {

        console.error(
            "Failed to load categories:",
            error
        );

    }


    /* ========================================================
       SEARCH MODE
    ======================================================== */

    let getSearchMode =
        () =>
            appState.searchMode;


    try {

        const modeGetter =
            initializeSearchModes(
                mode => {

                    appState.searchMode =
                        mode ||
                        "everything";

                }
            );


        if (
            typeof modeGetter === "function"
        ) {

            getSearchMode =
                modeGetter;

        }

    } catch (error) {

        console.warn(
            "Search mode initialization warning:",
            error
        );

    }


    /* ========================================================
       FILTERS
    ======================================================== */

    try {

        initializeFilters(
            () => {

                if (
                    searchInput &&
                    searchInput.value.trim()
                ) {

                    executeSearch();

                }

            }
        );

    } catch (error) {

        console.warn(
            "Filter initialization warning:",
            error
        );

    }


    /* ========================================================
       SEARCH
    ======================================================== */

    let searchController = null;


    try {

        searchController =
            initializeSearch({

                input:
                    searchInput,

                button:
                    searchButton,

                container:
                    repositoryContainer ||
                    repositoryGrid,

                getMode:
                    getSearchMode,

                getFilters,

                onResults:
                    state => {

                        if (!state) {
                            return;
                        }


                        if (
                            state.state ===
                            "success"
                        ) {

                            appState.repositories =
                                state.items ||
                                [];


                            updateResultUI(
                                state
                            );

                        }


                        if (
                            state.state ===
                            "loading"
                        ) {

                            updateResultUI(
                                state
                            );

                        }


                        if (
                            state.state ===
                            "error"
                        ) {

                            updateResultUI(
                                state
                            );

                        }

                    }

            });

    } catch (error) {

        console.error(
            "Search initialization failed:",
            error
        );

        showNotification(
            "Search system could not be initialized.",
            "error"
        );

    }


    /* ========================================================
       SEARCH EXECUTION
    ======================================================== */

    function executeSearch() {

        if (
            searchController &&
            typeof searchController.search ===
                "function"
        ) {

            return searchController.search();

        }

    }


    /* ========================================================
       QUICK SEARCHES
    ======================================================== */

    try {

        initializeQuickSearches(
            searchInput,
            executeSearch
        );

    } catch (error) {

        console.warn(
            "Quick search initialization warning:",
            error
        );

    }


    /* ========================================================
       URL SEARCH
    ======================================================== */

    const query =
        getQueryParam("q");


    if (
        query &&
        searchInput
    ) {

        searchInput.value =
            query;


        /*
            Give the search controller a moment
            after all components have initialized.
        */

        setTimeout(
            () => {

                executeSearch();

            },
            0
        );

    } else {

        updateResultUI({
            state: "success",
            items: []
        });

    }

}


/* ============================================================
   14. EXPLORER PAGE
   ============================================================ */

async function initializeExplorerPage() {

    const searchInput =
        qs("#searchInput");


    const searchButton =
        qs("#searchButton");


    const repositoryContainer =
        qs("#repositoryResults");


    let searchController = null;


    try {

        await loadTechnologies();

        await populateTechnologyFilter();

    } catch (error) {

        console.warn(
            "Explorer data initialization warning:",
            error
        );

    }


    try {

        initializeFilters(
            () => {

                if (
                    searchInput?.value.trim()
                ) {

                    searchController?.search();

                }

            }
        );

    } catch (error) {

        console.warn(
            "Explorer filters warning:",
            error
        );

    }


    let getSearchMode =
        () =>
            appState.searchMode;


    try {

        const getter =
            initializeSearchModes(
                mode => {

                    appState.searchMode =
                        mode ||
                        "everything";

                }
            );


        if (
            typeof getter === "function"
        ) {

            getSearchMode =
                getter;

        }

    } catch (error) {

        console.warn(
            "Explorer search mode warning:",
            error
        );

    }


    try {

        searchController =
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
                            state?.state ===
                            "success"
                        ) {

                            appState.repositories =
                                state.items ||
                                [];

                            updateResultUI(
                                state
                            );

                        }

                    }

            });

    } catch (error) {

        console.error(
            "Explorer search failed to initialize:",
            error
        );

    }


    const executeSearch =
        () => {

            return searchController?.search();

        };


    try {

        initializeQuickSearches(
            searchInput,
            executeSearch
        );

    } catch (error) {

        console.warn(
            "Explorer quick search warning:",
            error
        );

    }


    const query =
        getQueryParam("q");


    if (
        query &&
        searchInput
    ) {

        searchInput.value =
            query;


        setTimeout(
            executeSearch,
            0
        );

    }

}


/* ============================================================
   15. TECHNOLOGIES PAGE
   ============================================================ */

async function initializeTechnologiesPage() {

    const technologyContainer =
        qs("#technologyGrid");


    const searchInput =
        qs("#technologySearch");


    try {

        const technologies =
            await loadTechnologies();


        appState.technologies =
            Array.isArray(technologies)
                ? technologies
                : [];


        if (technologyContainer) {

            renderTechnologies(
                appState.technologies,
                technologyContainer
            );


            initializeTechnologyCards(
                technologyContainer
            );

        }


    } catch (error) {

        console.error(
            "Failed to initialize technologies page:",
            error
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                const query =
                    searchInput.value
                        .trim()
                        .toLowerCase();


                if (!technologyContainer) {
                    return;
                }


                const filtered =
                    appState.technologies.filter(
                        technology => {

                            const name =
                                String(
                                    technology.name ||
                                    ""
                                )
                                .toLowerCase();


                            const description =
                                String(
                                    technology.description ||
                                    ""
                                )
                                .toLowerCase();


                            const id =
                                String(
                                    technology.id ||
                                    technology.slug ||
                                    ""
                                )
                                .toLowerCase();


                            return (
                                !query ||
                                name.includes(query) ||
                                description.includes(query) ||
                                id.includes(query)
                            );

                        }
                    );


                renderTechnologies(
                    filtered,
                    technologyContainer
                );


                initializeTechnologyCards(
                    technologyContainer
                );

            }
        );

    }


    initializeTechnologyModal();

}


/* ============================================================
   16. TECHNOLOGY DETAIL PAGE
   ============================================================ */

async function initializeTechnologyPage() {

    initializeTechnologyModal();


    const technologyValue =
        getQueryParam(
            "technology"
        ) ||
        getQueryParam(
            "tech"
        ) ||
        getQueryParam(
            "name"
        );


    if (!technologyValue) {
        return;
    }


    let technology =
        findTechnology(
            technologyValue
        );


    if (!technology) {

        try {

            const loaded =
                await loadTechnologies();


            appState.technologies =
                Array.isArray(loaded)
                    ? loaded
                    : [];


            technology =
                findTechnology(
                    technologyValue
                );

        } catch (error) {

            console.error(
                "Technology loading failed:",
                error
            );

        }

    }


    if (!technology) {

        console.warn(
            "Technology not found:",
            technologyValue
        );

        return;

    }


    const title =
        qs(
            "#technologyTitle"
        ) ||
        qs(
            ".technology-title"
        );


    const description =
        qs(
            "#technologyDescription"
        ) ||
        qs(
            ".technology-description"
        );


    if (title) {

        title.textContent =
            technology.name ||
            technology.title ||
            technology.id;

    }


    if (description) {

        description.textContent =
            technology.description ||
            technology.summary ||
            "";

    }

}


/* ============================================================
   17. REPOSITORY DETAIL PAGE
   ============================================================ */

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


        if (!repository) {
            return;
        }


        const title =
            qs(
                "#repositoryTitle"
            ) ||
            qs(
                ".repository-title"
            );


        const description =
            qs(
                "#repositoryDescription"
            ) ||
            qs(
                ".repository-description"
            );


        if (title) {

            title.textContent =
                repository.full_name ||
                repository.name ||
                `${owner}/${repo}`;

        }


        if (description) {

            description.textContent =
                repository.description ||
                "No repository description available.";

        }

    } catch (error) {

        console.error(
            "Repository page failed:",
            error
        );

        showNotification(
            getErrorMessage(error),
            "error"
        );

    }

}


/* ============================================================
   18. CREATOR PAGE
   ============================================================ */

async function initializeCreatorPage() {

    const username =
        getQueryParam(
            "username"
        ) ||
        getQueryParam(
            "user"
        );


    if (!username) {
        return;
    }


    try {

        const user =
            await getUser(
                username
            );


        if (!user) {
            return;
        }


        const name =
            qs(
                "#creatorName"
            ) ||
            qs(
                ".creator-name"
            );


        const bio =
            qs(
                "#creatorBio"
            ) ||
            qs(
                ".creator-bio"
            );


        const avatar =
            qs(
                "#creatorAvatar"
            );


        if (name) {

            name.textContent =
                user.name ||
                user.login ||
                username;

        }


        if (bio) {

            bio.textContent =
                user.bio ||
                "";

        }


        if (
            avatar &&
            user.avatar_url
        ) {

            avatar.src =
                user.avatar_url;

            avatar.alt =
                user.login ||
                username;

        }

    } catch (error) {

        console.error(
            "Creator page failed:",
            error
        );

    }

}


/* ============================================================
   19. SAVED REPOSITORIES PAGE
   ============================================================ */

async function initializeSavedPage() {

    const container =
        qs(
            "#repositoryResults"
        ) ||
        qs(
            "#repositoryGrid"
        );


    if (!container) {
        return;
    }


    try {

        const repositories =
            await getSavedRepositories();


        const items =
            Array.isArray(
                repositories
            )
                ? repositories
                : [];


        appState.repositories =
            items;


        renderRepositories(
            items,
            container
        );


        updateResultUI({
            state: "success",
            items
        });


    } catch (error) {

        console.error(
            "Saved repositories failed:",
            error
        );


        container.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load saved repositories</h3>
                <p>
                    ${getErrorMessage(error)}
                </p>
            </div>
        `;

    }

}


/* ============================================================
   20. LABS PAGE
   ============================================================ */

async function initializeLabsPage() {

    const searchInput =
        qs("#searchInput");


    const searchButton =
        qs("#searchButton");


    const repositoryContainer =
        qs("#repositoryResults");


    if (!searchInput) {
        return;
    }


    let searchController = null;


    try {

        searchController =
            initializeSearch({

                input:
                    searchInput,

                button:
                    searchButton,

                container:
                    repositoryContainer,

                getMode:
                    () => "labs",

                getFilters,

                onResults:
                    state => {

                        if (
                            state?.state ===
                            "success"
                        ) {

                            appState.repositories =
                                state.items ||
                                [];

                            updateResultUI(
                                state
                            );

                        }

                    }

            });

    } catch (error) {

        console.error(
            "Labs search initialization failed:",
            error
        );

        return;

    }


    const executeSearch =
        () =>
            searchController?.search();


    try {

        initializeQuickSearches(
            searchInput,
            executeSearch
        );

    } catch (error) {

        console.warn(
            "Labs quick search warning:",
            error
        );

    }


    const query =
        getQueryParam("q");


    if (query) {

        searchInput.value =
            query;


        setTimeout(
            executeSearch,
            0
        );

    }

}


/* ============================================================
   21. LEARNING PATH PAGE
   ============================================================ */

async function initializeLearningPathPage() {

    const technologyContainer =
        qs("#technologyGrid");


    if (!technologyContainer) {
        return;
    }


    try {

        const technologies =
            await loadTechnologies();


        appState.technologies =
            Array.isArray(
                technologies
            )
                ? technologies
                : [];


        renderTechnologies(
            appState.technologies,
            technologyContainer
        );


        initializeTechnologyCards(
            technologyContainer
        );

    } catch (error) {

        console.error(
            "Learning path initialization failed:",
            error
        );

    }

}


/* ============================================================
   22. BACK TO TOP
   ============================================================ */

function initializeBackToTop() {

    const button =
        qs(
            "#backToTop"
        ) ||
        qs(
            ".back-to-top"
        );


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY >
                500
            ) {

                button.classList.add(
                    "visible"
                );

            } else {

                button.classList.remove(
                    "visible"
                );

            }

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


/* ============================================================
   23. GLOBAL TECHNOLOGY INTERACTIONS
   ============================================================ */

function initializeGlobalTechnologyInteractions() {

    /*
        These elements are already in index.html.

        Examples:

            data-technology="aws"
            data-technology="docker"
            data-technology="kubernetes"
            data-technology="terraform"
            data-technology="jenkins"
            data-technology="argocd"
    */


    const elements =
        qsa(
            "[data-technology]"
        );


    elements.forEach(
        element => {

            /*
                Do not add duplicate listeners if this
                function is called again.
            */

            if (
                element.dataset.appTechnologyBound ===
                "true"
            ) {
                return;
            }


            element.dataset.appTechnologyBound =
                "true";


            if (
                element.getAttribute(
                    "role"
                ) === "button"
            ) {

                element.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key !== "Enter" &&
                            event.key !== " "
                        ) {
                            return;
                        }


                        event.preventDefault();


                        const technologyId =
                            element.dataset
                                .technology;


                        if (
                            technologyId
                        ) {

                            openTechnology(
                                technologyId
                            );

                        }

                    }
                );

            }

        }
    );

}


/* ============================================================
   24. GLOBAL APP INITIALIZATION
   ============================================================ */

async function initializeApp() {

    if (
        appState.initialized
    ) {

        return;

    }


    appState.initialized =
        true;


    const page =
        getCurrentPage();


    document.body.classList.add(
        "app-initialized"
    );


    /* --------------------------------------------------------
       Global systems
    -------------------------------------------------------- */

    initializeNavigation();

    initializeBackToTop();

    initializeGlobalTechnologyInteractions();

    initializeTechnologyModal();

    initializeGitHubStatus();


    /* --------------------------------------------------------
       Page systems
    -------------------------------------------------------- */

    try {

        switch (page) {

            case "home":

                await initializeHomePage();

                break;


            case "explorer":

                await initializeExplorerPage();

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


            case "saved":

                await initializeSavedPage();

                break;


            case "labs":

                await initializeLabsPage();

                break;


            case "learning-path":

                await initializeLearningPathPage();

                break;


            default:

                await initializeHomePage();

                break;

        }

    } catch (error) {

        console.error(
            "Application initialization failed:",
            error
        );


        showNotification(
            getErrorMessage(
                error ||
                "Application failed to initialize."
            ),
            "error"
        );

    }


    /* --------------------------------------------------------
       Page enter animation
    -------------------------------------------------------- */

    requestAnimationFrame(
        () => {

            document.body.classList.add(
                "page-enter"
            );

        }
    );

}


/* ============================================================
   25. START APPLICATION
   ============================================================ */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeApp,
        {
            once: true
        }
    );

} else {

    initializeApp();

}


/* ============================================================
   END OF APP.JS
============================================================ */