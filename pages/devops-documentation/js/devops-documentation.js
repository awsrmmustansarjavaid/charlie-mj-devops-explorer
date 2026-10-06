/*
================================================================
Charlie MJ DevOps Explorer
DevOps Documentation Library
================================================================

File:
    pages/devops-documentation/js/devops-documentation.js

Purpose:
    Controls the documentation library interface.

Data:
    ../../data/devops-tools.json

Responsibilities:
    - Load JSON database
    - Render tools
    - Search tools
    - Filter tools
    - Sort tools
    - Category quick filters
    - Grid/list switching
    - Favorites
    - Recently viewed
    - Tool details modal
    - Official resource links
    - Related tools
    - Statistics
    - Empty states
    - LocalStorage persistence

Important:
    This script does not contain the tool database.

    The database lives in:

        data/devops-tools.json

    This makes the same dataset reusable by the Chrome extension.
================================================================
*/

"use strict";


/* ================================================================
   APPLICATION CONFIGURATION
   ================================================================ */

const CONFIG = {

    /*
     * Relative path from:
     * pages/devops-documentation/js/
     *
     * to:
     * data/devops-tools.json
     */
    dataUrl: "../../data/devops-tools.json",

    /*
     * LocalStorage keys.
     */
    favoritesKey: "charlieMjDevOpsDocumentationFavorites",
    recentKey: "charlieMjDevOpsDocumentationRecent",
    viewKey: "charlieMjDevOpsDocumentationView",

    /*
     * Maximum number of recently viewed technologies.
     */
    maxRecentTools: 12

};


/* ================================================================
   APPLICATION STATE
   ================================================================ */

const state = {

    /*
     * Complete database.
     */
    tools: [],

    /*
     * Current filtered result.
     */
    filteredTools: [],

    /*
     * Search value.
     */
    search: "",

    /*
     * Current filters.
     */
    provider: "all",
    category: "all",
    subcategory: "all",
    level: "all",
    type: "all",
    personal: "all",

    /*
     * Current sorting.
     */
    sort: "name-asc",

    /*
     * Current display mode.
     */
    view: "grid"

};


/* ================================================================
   DOM REFERENCES
   ================================================================ */

const elements = {

    search:
        document.getElementById("toolSearch"),

    clearSearch:
        document.getElementById("clearSearch"),

    providerFilter:
        document.getElementById("providerFilter"),

    categoryFilter:
        document.getElementById("categoryFilter"),

    subcategoryFilter:
        document.getElementById("subcategoryFilter"),

    levelFilter:
        document.getElementById("levelFilter"),

    typeFilter:
        document.getElementById("typeFilter"),

    favoriteFilter:
        document.getElementById("favoriteFilter"),

    clearFilters:
        document.getElementById("clearFilters"),

    categoryChips:
        document.getElementById("categoryChips"),

    sortSelect:
        document.getElementById("sortSelect"),

    gridViewButton:
        document.getElementById("gridViewButton"),

    listViewButton:
        document.getElementById("listViewButton"),

    toolGrid:
        document.getElementById("toolGrid"),

    emptyState:
        document.getElementById("emptyState"),

    emptyResetButton:
        document.getElementById("emptyResetButton"),

    resultCount:
        document.getElementById("resultCount"),

    totalTools:
        document.getElementById("totalTools"),

    totalCategories:
        document.getElementById("totalCategories"),

    totalProviders:
        document.getElementById("totalProviders"),

    favoriteCount:
        document.getElementById("favoriteCount"),

    modal:
        document.getElementById("toolModal"),

    closeModal:
        document.getElementById("closeModal"),

    modalToolIcon:
        document.getElementById("modalToolIcon"),

    modalToolName:
        document.getElementById("modalToolName"),

    modalToolCategory:
        document.getElementById("modalToolCategory"),

    modalToolProvider:
        document.getElementById("modalToolProvider"),

    modalToolDescription:
        document.getElementById("modalToolDescription"),

    modalToolMeta:
        document.getElementById("modalToolMeta"),

    modalToolLinks:
        document.getElementById("modalToolLinks"),

    modalToolTags:
        document.getElementById("modalToolTags"),

    modalRelatedTools:
        document.getElementById("modalRelatedTools")

};


/* ================================================================
   LOCAL STORAGE HELPERS
   ================================================================ */

/**
 * Safely retrieves a JSON array from localStorage.
 *
 * @param {string} key
 * @returns {Array}
 */
function readStorageArray(key) {

    try {

        const value = localStorage.getItem(key);

        if (!value) {
            return [];
        }

        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : [];

    } catch (error) {

        console.warn(
            "Could not read localStorage:",
            error
        );

        return [];
    }
}


/**
 * Saves an array into localStorage.
 *
 * @param {string} key
 * @param {Array} value
 */
function writeStorageArray(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.warn(
            "Could not write localStorage:",
            error
        );
    }
}


/**
 * Returns favorite tool IDs.
 *
 * @returns {Array<string>}
 */
function getFavorites() {

    return readStorageArray(
        CONFIG.favoritesKey
    );

}


/**
 * Returns recently viewed tool IDs.
 *
 * @returns {Array<string>}
 */
function getRecentTools() {

    return readStorageArray(
        CONFIG.recentKey
    );

}


/* ================================================================
   DATA LOADING
   ================================================================ */

/**
 * Loads the shared DevOps JSON database.
 */
async function loadDatabase() {

    try {

        const response =
            await fetch(CONFIG.dataUrl, {
                cache: "no-cache"
            });

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }

        const database =
            await response.json();

        /*
         * Support the recommended object format:
         *
         * {
         *     "version": "...",
         *     "tools": [...]
         * }
         *
         * Also support a direct array for flexibility.
         */
        if (Array.isArray(database)) {

            state.tools = database;

        } else {

            state.tools =
                Array.isArray(database.tools)
                    ? database.tools
                    : [];

        }

        updateStatistics();

        populateFilters();

        renderCategoryChips();

        applyFilters();

    } catch (error) {

        console.error(
            "DevOps documentation database failed to load:",
            error
        );

        showDatabaseError();

    }

}


/* ================================================================
   DATABASE ERROR
   ================================================================ */

/**
 * Displays an error if the JSON database cannot be loaded.
 */
function showDatabaseError() {

    elements.toolGrid.innerHTML = `
        <article class="empty-state">
            <div class="empty-icon">!</div>

            <h2>
                Documentation database unavailable
            </h2>

            <p>
                The DevOps tool database could not be loaded.
                Check the data/devops-tools.json path.
            </p>
        </article>
    `;

}


/* ================================================================
   STATISTICS
   ================================================================ */

/**
 * Updates the overview statistics.
 */
function updateStatistics() {

    const tools =
        state.tools;

    const categories =
        new Set(
            tools
                .map(tool => tool.category)
                .filter(Boolean)
        );

    const providers =
        new Set(
            tools
                .map(tool => tool.provider)
                .filter(Boolean)
        );

    elements.totalTools.textContent =
        tools.length;

    elements.totalCategories.textContent =
        categories.size;

    elements.totalProviders.textContent =
        providers.size;

    elements.favoriteCount.textContent =
        getFavorites().length;

}


/* ================================================================
   FILTER DATA
   ================================================================ */

/**
 * Returns sorted unique values from tools.
 *
 * @param {string} property
 * @returns {string[]}
 */
function uniqueValues(property) {

    return [
        ...new Set(
            state.tools
                .map(tool => tool[property])
                .filter(Boolean)
        )
    ].sort(
        (a, b) =>
            String(a).localeCompare(
                String(b)
            )
    );

}


/**
 * Adds options to a select element.
 *
 * @param {HTMLSelectElement} select
 * @param {string[]} values
 * @param {string} defaultText
 */
function populateSelect(
    select,
    values,
    defaultText
) {

    select.innerHTML = `
        <option value="all">
            ${defaultText}
        </option>
    `;

    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        select.appendChild(option);

    });

}


/**
 * Populates all dropdown filters.
 */
function populateFilters() {

    populateSelect(
        elements.providerFilter,
        uniqueValues("provider"),
        "All Providers"
    );

    populateSelect(
        elements.categoryFilter,
        uniqueValues("category"),
        "All Categories"
    );

    populateSelect(
        elements.subcategoryFilter,
        uniqueValues("subcategory"),
        "All Subcategories"
    );

    populateSelect(
        elements.typeFilter,
        uniqueValues("type"),
        "All Types"
    );

}


/* ================================================================
   CATEGORY CHIPS
   ================================================================ */

/**
 * Creates quick category filter buttons.
 */
function renderCategoryChips() {

    const categories =
        uniqueValues("category");

    elements.categoryChips.innerHTML = "";

    const allButton =
        createCategoryChip(
            "All",
            "all"
        );

    allButton.classList.add("active");

    elements.categoryChips.appendChild(
        allButton
    );

    categories.forEach(category => {

        elements.categoryChips.appendChild(
            createCategoryChip(
                category,
                category
            )
        );

    });

}


/**
 * Creates a category chip.
 *
 * @param {string} label
 * @param {string} value
 * @returns {HTMLButtonElement}
 */
function createCategoryChip(
    label,
    value
) {

    const button =
        document.createElement("button");

    button.type = "button";

    button.className =
        "category-chip";

    button.dataset.category =
        value;

    button.textContent =
        label;

    button.addEventListener(
        "click",
        () => {

            state.category =
                value;

            elements.categoryFilter.value =
                value;

            updateCategoryChipState();

            applyFilters();

        }
    );

    return button;

}


/**
 * Updates active category chip.
 */
function updateCategoryChipState() {

    document
        .querySelectorAll(".category-chip")
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                state.category
            );

        });

}


/* ================================================================
   SEARCH MATCHING
   ================================================================ */

/**
 * Creates searchable text for a tool.
 *
 * @param {Object} tool
 * @returns {string}
 */
function getSearchText(tool) {

    const values = [

        tool.name,

        tool.description,

        tool.category,

        tool.subcategory,

        tool.provider,

        tool.type,

        tool.learningLevel,

        ...(tool.tags || []),

        ...(tool.relatedTools || [])

    ];

    return values
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

}


/**
 * Determines whether a tool matches the current filters.
 *
 * @param {Object} tool
 * @returns {boolean}
 */
function matchesFilters(tool) {

    const search =
        state.search
            .trim()
            .toLowerCase();

    if (
        search &&
        !getSearchText(tool)
            .includes(search)
    ) {

        return false;

    }


    if (
        state.provider !== "all" &&
        tool.provider !== state.provider
    ) {

        return false;

    }


    if (
        state.category !== "all" &&
        tool.category !== state.category
    ) {

        return false;

    }


    if (
        state.subcategory !== "all" &&
        tool.subcategory !== state.subcategory
    ) {

        return false;

    }


    if (
        state.level !== "all" &&
        tool.learningLevel !== state.level
    ) {

        return false;

    }


    if (
        state.type !== "all" &&
        tool.type !== state.type
    ) {

        return false;

    }


    const favorites =
        getFavorites();

    const recent =
        getRecentTools();


    if (
        state.personal === "favorites" &&
        !favorites.includes(tool.id)
    ) {

        return false;

    }


    if (
        state.personal === "recent" &&
        !recent.includes(tool.id)
    ) {

        return false;

    }


    return true;

}


/* ================================================================
   SORTING
   ================================================================ */

/**
 * Sorts the filtered tools.
 *
 * @param {Object[]} tools
 * @returns {Object[]}
 */
function sortTools(tools) {

    const result =
        [...tools];

    switch (state.sort) {

        case "name-desc":

            return result.sort(
                (a, b) =>
                    b.name.localeCompare(a.name)
            );


        case "category":

            return result.sort(
                (a, b) =>
                    `${a.category} ${a.name}`
                        .localeCompare(
                            `${b.category} ${b.name}`
                        )
            );


        case "level": {

            const order = {
                Beginner: 1,
                Intermediate: 2,
                Advanced: 3
            };

            return result.sort(
                (a, b) =>
                    (order[a.learningLevel] || 99) -
                    (order[b.learningLevel] || 99)
            );

        }


        case "name-asc":
        default:

            return result.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );

    }

}


/* ================================================================
   APPLY FILTERS
   ================================================================ */

/**
 * Applies all active filters and renders results.
 */
function applyFilters() {

    const matchingTools =
        state.tools.filter(
            matchesFilters
        );

    state.filteredTools =
        sortTools(
            matchingTools
        );

    elements.resultCount.textContent =
        state.filteredTools.length;

    renderTools();

}


/* ================================================================
   TOOL RENDERING
   ================================================================ */

/**
 * Escapes text before inserting it into HTML.
 *
 * @param {*} value
 * @returns {string}
 */
function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/**
 * Creates a short abbreviation for a tool.
 *
 * @param {Object} tool
 * @returns {string}
 */
function getToolIcon(tool) {

    if (tool.shortName) {
        return tool.shortName;
    }

    return tool.name
        .split(/\s+/)
        .slice(0, 2)
        .map(word => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 4);

}


/**
 * Creates a tool card.
 *
 * @param {Object} tool
 * @returns {HTMLElement}
 */
function createToolCard(tool) {

    const card =
        document.createElement("article");

    card.className =
        "tool-card";

    card.dataset.toolId =
        tool.id;


    const favorites =
        getFavorites();

    const isFavorite =
        favorites.includes(tool.id);


    const tags =
        (tool.tags || [])
            .slice(0, 6)
            .map(tag => `
                <span class="tool-tag">
                    #${escapeHtml(tag)}
                </span>
            `)
            .join("");


    card.innerHTML = `

        <div class="tool-card-header">

            <div class="tool-icon">
                ${escapeHtml(
                    getToolIcon(tool)
                )}
            </div>

            <button
                type="button"
                class="favorite-button ${
                    isFavorite ? "active" : ""
                }"
                data-favorite-id="${escapeHtml(tool.id)}"
                aria-label="${
                    isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }"
                title="${
                    isFavorite
                        ? "Remove favorite"
                        : "Add favorite"
                }"
            >
                ${isFavorite ? "★" : "☆"}
            </button>

        </div>


        <span class="tool-category">
            ${escapeHtml(
                tool.category || "DevOps"
            )}
        </span>


        <h3 class="tool-name">
            ${escapeHtml(tool.name)}
        </h3>


        <div class="tool-provider">
            ${
                escapeHtml(
                    tool.provider ||
                    "Independent"
                )
            }
        </div>


        <p class="tool-description">
            ${escapeHtml(
                tool.description ||
                "DevOps technology."
            )}
        </p>


        <div class="tool-tags">
            ${tags}
        </div>


        <div class="tool-card-footer">

            <span class="level-badge">
                ${escapeHtml(
                    tool.learningLevel ||
                    "General"
                )}
            </span>

            <button
                type="button"
                class="tool-open-button"
                data-open-tool="${escapeHtml(tool.id)}"
            >
                View Documentation →
            </button>

        </div>
    `;


    return card;

}


/**
 * Renders the current result set.
 */
function renderTools() {

    elements.toolGrid.innerHTML = "";

    if (
        state.filteredTools.length === 0
    ) {

        elements.emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    elements.emptyState.classList.add(
        "hidden"
    );


    const fragment =
        document.createDocumentFragment();


    state.filteredTools.forEach(tool => {

        fragment.appendChild(
            createToolCard(tool)
        );

    });


    elements.toolGrid.appendChild(
        fragment
    );

}


/* ================================================================
   FAVORITES
   ================================================================ */

/**
 * Toggles favorite status.
 *
 * @param {string} toolId
 */
function toggleFavorite(toolId) {

    const favorites =
        getFavorites();

    const index =
        favorites.indexOf(toolId);


    if (index === -1) {

        favorites.push(toolId);

    } else {

        favorites.splice(
            index,
            1
        );

    }


    writeStorageArray(
        CONFIG.favoritesKey,
        favorites
    );

    updateStatistics();

    applyFilters();

}


/* ================================================================
   RECENTLY VIEWED
   ================================================================ */

/**
 * Adds a tool to recently viewed.
 *
 * @param {string} toolId
 */
function addToRecent(toolId) {

    let recent =
        getRecentTools();

    recent =
        recent.filter(
            id => id !== toolId
        );

    recent.unshift(toolId);

    recent =
        recent.slice(
            0,
            CONFIG.maxRecentTools
        );

    writeStorageArray(
        CONFIG.recentKey,
        recent
    );

}


/* ================================================================
   TOOL DETAILS MODAL
   ================================================================ */

/**
 * Finds a tool by ID.
 *
 * @param {string} id
 * @returns {Object|null}
 */
function findTool(id) {

    return (
        state.tools.find(
            tool => tool.id === id
        ) ||
        null
    );

}


/**
 * Creates a safe external URL.
 *
 * @param {string} url
 * @returns {string}
 */
function safeUrl(url) {

    if (!url) {
        return null;
    }

    try {

        const parsed =
            new URL(url);

        if (
            parsed.protocol === "https:" ||
            parsed.protocol === "http:"
        ) {

            return parsed.href;

        }

    } catch (_) {

        return null;

    }

    return null;

}


/**
 * Opens a tool detail modal.
 *
 * @param {string} toolId
 */
function openToolModal(toolId) {

    const tool =
        findTool(toolId);

    if (!tool) {
        return;
    }


    addToRecent(toolId);


    elements.modalToolIcon.textContent =
        getToolIcon(tool);

    elements.modalToolName.textContent =
        tool.name;

    elements.modalToolCategory.textContent =
        tool.category ||
        "DevOps";

    elements.modalToolProvider.textContent =
        tool.provider ||
        "Independent";

    elements.modalToolDescription.textContent =
        tool.description ||
        "No description available.";


    elements.modalToolMeta.innerHTML = `

        <span class="meta-item">
            ${escapeHtml(
                tool.subcategory ||
                "General"
            )}
        </span>

        <span class="meta-item">
            ${escapeHtml(
                tool.type ||
                "Technology"
            )}
        </span>

        <span class="meta-item">
            ${escapeHtml(
                tool.learningLevel ||
                "General"
            )}
        </span>

        ${
            tool.openSource
                ? `
                    <span class="meta-item">
                        Open Source
                    </span>
                  `
                : ""
        }

    `;


    renderModalLinks(tool);

    renderModalTags(tool);

    renderRelatedTools(tool);


    elements.modal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";

}


/**
 * Renders official resource links.
 *
 * @param {Object} tool
 */
function renderModalLinks(tool) {

    const links = [

        {
            label: "Official Website",
            url: safeUrl(
                tool.officialWebsite
            )
        },

        {
            label: "Official Documentation",
            url: safeUrl(
                tool.documentation
            )
        },

        {
            label: "GitHub",
            url: safeUrl(
                tool.github
            )
        }

    ].filter(
        item => item.url
    );


    if (!links.length) {

        elements.modalToolLinks.innerHTML = `
            <span class="meta-item">
                No external resources available.
            </span>
        `;

        return;

    }


    elements.modalToolLinks.innerHTML =
        links
            .map(link => `
                <a
                    class="resource-link"
                    href="${escapeHtml(link.url)}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHtml(link.label)}
                </a>
            `)
            .join("");

}


/**
 * Renders tags inside the modal.
 *
 * @param {Object} tool
 */
function renderModalTags(tool) {

    const tags =
        tool.tags || [];


    elements.modalToolTags.innerHTML =
        tags
            .map(tag => `
                <span class="tool-tag">
                    #${escapeHtml(tag)}
                </span>
            `)
            .join("");

}


/**
 * Renders related technologies.
 *
 * @param {Object} tool
 */
function renderRelatedTools(tool) {

    const related =
        tool.relatedTools || [];


    elements.modalRelatedTools.innerHTML = "";


    if (!related.length) {

        elements.modalRelatedTools.innerHTML = `
            <span class="meta-item">
                No related technologies listed.
            </span>
        `;

        return;

    }


    related.forEach(relatedId => {

        const relatedTool =
            findTool(relatedId);


        if (!relatedTool) {
            return;
        }


        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "related-tool";

        button.textContent =
            relatedTool.name;


        button.addEventListener(
            "click",
            () => {

                openToolModal(
                    relatedTool.id
                );

            }
        );


        elements.modalRelatedTools
            .appendChild(button);

    });

}


/**
 * Closes the tool modal.
 */
function closeToolModal() {

    elements.modal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

}


/* ================================================================
   FILTER RESET
   ================================================================ */

/**
 * Resets every filter to its default state.
 */
function resetFilters() {

    state.search = "";

    state.provider = "all";
    state.category = "all";
    state.subcategory = "all";
    state.level = "all";
    state.type = "all";
    state.personal = "all";

    elements.search.value = "";

    elements.providerFilter.value =
        "all";

    elements.categoryFilter.value =
        "all";

    elements.subcategoryFilter.value =
        "all";

    elements.levelFilter.value =
        "all";

    elements.typeFilter.value =
        "all";

    elements.favoriteFilter.value =
        "all";

    updateCategoryChipState();

    applyFilters();

}


/* ================================================================
   VIEW MODE
   ================================================================ */

/**
 * Applies grid or list view.
 *
 * @param {"grid"|"list"} view
 */
function setView(view) {

    state.view =
        view;

    elements.toolGrid.classList.toggle(
        "list-view",
        view === "list"
    );

    elements.gridViewButton.classList.toggle(
        "active",
        view === "grid"
    );

    elements.listViewButton.classList.toggle(
        "active",
        view === "list"
    );


    try {

        localStorage.setItem(
            CONFIG.viewKey,
            view
        );

    } catch (_) {
        // Ignore storage errors.
    }

}


/**
 * Restores saved view mode.
 */
function restoreView() {

    try {

        const saved =
            localStorage.getItem(
                CONFIG.viewKey
            );

        if (
            saved === "grid" ||
            saved === "list"
        ) {

            setView(saved);

        }

    } catch (_) {
        // Default remains grid.
    }

}


/* ================================================================
   EVENT HANDLERS
   ================================================================ */

function bindEvents() {


    /* Search */

    elements.search.addEventListener(
        "input",
        event => {

            state.search =
                event.target.value;

            applyFilters();

        }
    );


    elements.clearSearch.addEventListener(
        "click",
        () => {

            state.search = "";

            elements.search.value = "";

            applyFilters();

            elements.search.focus();

        }
    );


    /* Provider */

    elements.providerFilter.addEventListener(
        "change",
        event => {

            state.provider =
                event.target.value;

            applyFilters();

        }
    );


    /* Category */

    elements.categoryFilter.addEventListener(
        "change",
        event => {

            state.category =
                event.target.value;

            updateCategoryChipState();

            applyFilters();

        }
    );


    /* Subcategory */

    elements.subcategoryFilter.addEventListener(
        "change",
        event => {

            state.subcategory =
                event.target.value;

            applyFilters();

        }
    );


    /* Learning level */

    elements.levelFilter.addEventListener(
        "change",
        event => {

            state.level =
                event.target.value;

            applyFilters();

        }
    );


    /* Tool type */

    elements.typeFilter.addEventListener(
        "change",
        event => {

            state.type =
                event.target.value;

            applyFilters();

        }
    );


    /* Favorites / recent */

    elements.favoriteFilter.addEventListener(
        "change",
        event => {

            state.personal =
                event.target.value;

            applyFilters();

        }
    );


    /* Sorting */

    elements.sortSelect.addEventListener(
        "change",
        event => {

            state.sort =
                event.target.value;

            applyFilters();

        }
    );


    /* Reset */

    elements.clearFilters.addEventListener(
        "click",
        resetFilters
    );


    elements.emptyResetButton.addEventListener(
        "click",
        resetFilters
    );


    /* View */

    elements.gridViewButton.addEventListener(
        "click",
        () => setView("grid")
    );


    elements.listViewButton.addEventListener(
        "click",
        () => setView("list")
    );


    /* Tool cards */

    elements.toolGrid.addEventListener(
        "click",
        event => {

            const favoriteButton =
                event.target.closest(
                    "[data-favorite-id]"
                );


            if (favoriteButton) {

                toggleFavorite(
                    favoriteButton
                        .dataset
                        .favoriteId
                );

                return;

            }


            const openButton =
                event.target.closest(
                    "[data-open-tool]"
                );


            if (openButton) {

                openToolModal(
                    openButton
                        .dataset
                        .openTool
                );

            }

        }
    );


    /* Modal */

    elements.closeModal.addEventListener(
        "click",
        closeToolModal
    );


    elements.modal
        .querySelector(".modal-overlay")
        .addEventListener(
            "click",
            closeToolModal
        );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                !elements.modal.classList.contains(
                    "hidden"
                )
            ) {

                closeToolModal();

            }

        }
    );

}


/* ================================================================
   INITIALIZATION
   ================================================================ */

/**
 * Starts the documentation application.
 */
async function initializeDocumentation() {

    restoreView();

    bindEvents();

    await loadDatabase();

}


/*
 * Start application after the document is ready.
 */
if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeDocumentation
    );

} else {

    initializeDocumentation();

}