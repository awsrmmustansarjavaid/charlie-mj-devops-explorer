/**
 * ============================================================
 * CHARLIE MJ DEVOPS EXPLORER
 * Documentation Library JavaScript
 * ============================================================
 *
 * File:
 * pages/devops-documentation/js/devops-documentation.js
 *
 * Database:
 * ../../data/official-documentation.json
 *
 * Main responsibilities:
 * ------------------------------------------------------------
 * 1. Load DevOps tools from JSON
 * 2. Generate statistics dynamically
 * 3. Generate category sidebar dynamically
 * 4. Generate category quick filters
 * 5. Search tools
 * 6. Filter tools
 * 7. Sort tools
 * 8. Paginate results
 * 9. Explore More
 * 10. Grid / List view
 * 11. Favorites
 * 12. Recently viewed tools
 * 13. Active filter indicators
 * 14. Tool details modal
 * 15. Related technologies
 * 16. Official resources
 * 17. Mobile category sidebar
 * 18. Copy/share tool links
 * 19. LocalStorage persistence
 * 20. Keyboard accessibility
 *
 * IMPORTANT:
 * ------------------------------------------------------------
 * This file does NOT hard-code DevOps tools or categories.
 *
 * Everything is generated from:
 *
 *     ../../data/official-documentation.json
 *
 * Therefore, when you add a new category or tool to JSON,
 * the UI automatically discovers it.
 * ============================================================
 */

"use strict";

/* ============================================================
   1. CONFIGURATION
   ============================================================ */

const CONFIG = {
    /**
     * JSON database location relative to:
     *
     * pages/devops-documentation/js/
     */
    dataUrl: "../../data/official-documentation.json",

    /**
     * LocalStorage keys.
     */
    storageKeys: {
        favorites: "charlieMJDevOpsFavorites",
        recent: "charlieMJDevOpsRecent",
        viewMode: "charlieMJDevOpsDocumentationView"
    },

    /**
     * Default number of tools displayed per page.
     */
    defaultItemsPerPage: 24,

    /**
     * Maximum recently viewed tools stored.
     */
    maxRecentTools: 12,

    /**
     * Maximum related technologies displayed.
     */
    maxRelatedTools: 6,

    /**
     * Debounce delay for search.
     */
    searchDelay: 120
};


/* ============================================================
   2. APPLICATION STATE
   ============================================================ */

const state = {

    /**
     * All tools loaded from JSON.
     */
    tools: [],

    /**
     * Tools after search + filters + sorting.
     */
    filteredTools: [],

    /**
     * Current search text.
     */
    searchQuery: "",

    /**
     * Current selected filters.
     */
    filters: {
        provider: "all",
        category: "all",
        subcategory: "all",
        level: "all",
        type: "all",
        favorite: "all"
    },

    /**
     * Current sorting option.
     */
    sortBy: "name-asc",

    /**
     * Current page.
     */
    currentPage: 1,

    /**
     * Current page size.
     */
    itemsPerPage: CONFIG.defaultItemsPerPage,

    /**
     * Grid or list.
     */
    viewMode: "grid",

    /**
     * Category sidebar search.
     */
    categorySearch: "",

    /**
     * Currently opened tool.
     */
    activeToolId: null,

    /**
     * Loading state.
     */
    isLoading: false
};


/* ============================================================
   3. DOM REFERENCES
   ============================================================ */

const elements = {

    /* --------------------------------------------------------
       Main search
       -------------------------------------------------------- */

    toolSearch:
        document.getElementById("toolSearch"),


    /* --------------------------------------------------------
       Statistics
       -------------------------------------------------------- */

    totalTools:
        document.getElementById("totalTools"),

    totalCategories:
        document.getElementById("totalCategories"),

    totalProviders:
        document.getElementById("totalProviders"),

    favoriteCount:
        document.getElementById("favoriteCount"),


    /* --------------------------------------------------------
       Category sidebar
       -------------------------------------------------------- */

    categorySidebar:
        document.getElementById("categorySidebar"),

    categorySidebarToggle:
        document.getElementById("categorySidebarToggle"),

    categorySidebarClose:
        document.getElementById("categorySidebarClose"),

    categorySearch:
        document.getElementById("categorySearch"),

    categorySidebarList:
        document.getElementById("categorySidebarList"),

    sidebarCategoryCount:
        document.getElementById("sidebarCategoryCount"),

    categorySidebarOverlay:
        document.getElementById("categorySidebarOverlay"),


    /* --------------------------------------------------------
       Filters
       -------------------------------------------------------- */

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


    /* --------------------------------------------------------
       Category chips
       -------------------------------------------------------- */

    categoryChips:
        document.getElementById("categoryChips"),


    /* --------------------------------------------------------
       Results
       -------------------------------------------------------- */

    resultCount:
        document.getElementById("resultCount"),

    sortSelect:
        document.getElementById("sortSelect"),

    itemsPerPage:
        document.getElementById("itemsPerPage"),

    activeFilters:
        document.getElementById("activeFilters"),

    toolGrid:
        document.getElementById("toolGrid"),


    /* --------------------------------------------------------
       Explore More
       -------------------------------------------------------- */

    exploreMoreContainer:
        document.getElementById("exploreMoreContainer"),

    exploreMoreButton:
        document.getElementById("exploreMoreButton"),


    /* --------------------------------------------------------
       Pagination
       -------------------------------------------------------- */

    pagination:
        document.getElementById("pagination"),

    paginationInfo:
        document.getElementById("paginationInfo"),


    /* --------------------------------------------------------
       Empty state
       -------------------------------------------------------- */

    emptyState:
        document.getElementById("emptyState"),

    resetFiltersButton:
        document.getElementById("resetFiltersButton"),


    /* --------------------------------------------------------
       View buttons
       -------------------------------------------------------- */

    gridViewButton:
        document.getElementById("gridViewButton"),

    listViewButton:
        document.getElementById("listViewButton"),


    /* --------------------------------------------------------
       Tool modal
       -------------------------------------------------------- */

    toolModal:
        document.getElementById("toolModal"),

    closeModal:
        document.getElementById("closeModal"),

    modalToolIcon:
        document.getElementById("modalToolIcon"),

    modalToolCategory:
        document.getElementById("modalToolCategory"),

    modalToolName:
        document.getElementById("modalToolName"),

    modalToolProvider:
        document.getElementById("modalToolProvider"),

    modalToolDescription:
        document.getElementById("modalToolDescription"),

    modalToolMeta:
        document.getElementById("modalToolMeta"),

    modalExploreMore:
        document.getElementById("modalExploreMore"),

    modalToolLinks:
        document.getElementById("modalToolLinks"),

    modalToolTags:
        document.getElementById("modalToolTags"),

    modalRelatedTools:
        document.getElementById("modalRelatedTools")
};


/* ============================================================
   4. INITIALIZATION
   ============================================================ */

document.addEventListener("DOMContentLoaded", init);


/**
 * Main application initialization.
 */
async function init() {

    /**
     * Restore saved view mode.
     */
    restoreViewMode();

    /**
     * Bind all buttons, inputs and controls.
     */
    bindEvents();

    /**
     * Load the JSON database.
     */
    await loadDatabase();
}


/* ============================================================
   5. LOAD JSON DATABASE
   ============================================================ */

/**
 * Load the DevOps documentation database.
 *
 * Supports both:
 *
 * {
 *     "tools": [...]
 * }
 *
 * and:
 *
 * [
 *     {...},
 *     {...}
 * ]
 */
async function loadDatabase() {

    state.isLoading = true;

    try {

        const response = await fetch(CONFIG.dataUrl, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status} while loading database`
            );
        }

        const database = await response.json();

        /**
         * Support both database formats.
         */
        if (Array.isArray(database)) {

            state.tools = database;

        } else if (
            database &&
            Array.isArray(database.tools)
        ) {

            state.tools = database.tools;

        } else {

            state.tools = [];
        }


        /**
         * Remove invalid/null records.
         */
        state.tools = state.tools.filter(
            tool =>
                tool &&
                typeof tool === "object"
        );


        /**
         * Prepare all dynamic UI.
         */
        updateStatistics();

        populateFilters();

        renderCategorySidebar();

        renderCategoryChips();

        applyFilters();

    } catch (error) {

        console.error(
            "DevOps documentation database failed to load:",
            error
        );

        showDatabaseError();

    } finally {

        state.isLoading = false;
    }
}


/* ============================================================
   6. DATABASE ERROR
   ============================================================ */

/**
 * Display a friendly error message if JSON cannot load.
 */
function showDatabaseError() {

    if (elements.toolGrid) {

        elements.toolGrid.innerHTML = `
            <div class="database-error">
                <div class="database-error-icon">!</div>

                <h3>Documentation database unavailable</h3>

                <p>
                    The DevOps documentation database could not
                    be loaded.
                </p>

                <p>
                    Please verify:
                </p>

                <ul>
                    <li>
                        <code>data/official-documentation.json</code>
                    </li>

                    <li>
                        The JSON syntax
                    </li>

                    <li>
                        The GitHub Pages deployment
                    </li>
                </ul>

                <button
                    type="button"
                    class="reset-filters-button"
                    onclick="window.location.reload()"
                >
                    Retry
                </button>
            </div>
        `;
    }


    if (elements.resultCount) {
        elements.resultCount.textContent =
            "Database unavailable";
    }
}


/* ============================================================
   7. STATISTICS
   ============================================================ */

/**
 * Calculate statistics directly from the loaded tools.
 *
 * IMPORTANT:
 * We intentionally DO NOT trust:
 *
 *     database.totalTools
 *
 * because the real number of records is:
 *
 *     state.tools.length
 */
function updateStatistics() {

    const tools = state.tools;


    /**
     * Unique categories.
     */
    const categories = new Set(
        tools
            .map(tool => getCategory(tool))
            .filter(Boolean)
    );


    /**
     * Unique providers.
     */
    const providers = new Set(
        tools
            .map(tool => getProvider(tool))
            .filter(Boolean)
    );


    /**
     * Update statistics.
     */
    if (elements.totalTools) {
        elements.totalTools.textContent =
            formatNumber(tools.length);
    }

    if (elements.totalCategories) {
        elements.totalCategories.textContent =
            formatNumber(categories.size);
    }

    if (elements.totalProviders) {
        elements.totalProviders.textContent =
            formatNumber(providers.size);
    }

    if (elements.favoriteCount) {
        elements.favoriteCount.textContent =
            formatNumber(getFavorites().length);
    }
}


/* ============================================================
   8. DATA HELPERS
   ============================================================ */

/**
 * Safely get a tool name.
 */
function getToolName(tool) {

    return String(
        tool?.name ||
        tool?.title ||
        "Unnamed Tool"
    );
}


/**
 * Safely get category.
 */
function getCategory(tool) {

    return String(
        tool?.category ||
        "Uncategorized"
    );
}


/**
 * Safely get provider.
 */
function getProvider(tool) {

    return String(
        tool?.provider ||
        "Community"
    );
}


/**
 * Safely get subcategory.
 */
function getSubcategory(tool) {

    return String(
        tool?.subcategory ||
        ""
    );
}


/**
 * Safely get learning level.
 */
function getLevel(tool) {

    return String(
        tool?.level ||
        tool?.difficulty ||
        ""
    );
}


/**
 * Safely get tool type.
 */
function getType(tool) {

    return String(
        tool?.type ||
        ""
    );
}


/**
 * Get description.
 */
function getDescription(tool) {

    return String(
        tool?.description ||
        tool?.summary ||
        "No description available."
    );
}


/**
 * Get icon.
 */
function getToolIcon(tool) {

    return String(
        tool?.icon ||
        tool?.logo ||
        tool?.emoji ||
        "⚙"
    );
}


/**
 * Get tags.
 */
function getToolTags(tool) {

    if (Array.isArray(tool?.tags)) {
        return tool.tags
            .map(tag => String(tag))
            .filter(Boolean);
    }

    if (typeof tool?.tags === "string") {

        return tool.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);
    }

    return [];
}


/**
 * Get documentation URL.
 *
 * Supports both:
 *
 * documentation
 *
 * and future:
 *
 * officialDocumentation
 */
function getDocumentationUrl(tool) {

    return safeUrl(
        tool?.documentation ||
        tool?.officialDocumentation
    );
}


/**
 * Get official website.
 */
function getOfficialWebsite(tool) {

    return safeUrl(
        tool?.officialWebsite ||
        tool?.website ||
        tool?.homepage
    );
}


/**
 * Get GitHub URL.
 */
function getGithubUrl(tool) {

    return safeUrl(
        tool?.github ||
        tool?.githubUrl
    );
}


/* ============================================================
   9. UNIQUE VALUES
   ============================================================ */

/**
 * Return unique non-empty values from tools.
 */
function uniqueValues(
    tools,
    getter
) {

    return [
        ...new Set(
            tools
                .map(getter)
                .map(value => String(value || "").trim())
                .filter(Boolean)
        )
    ].sort(
        (a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity: "base"
                }
            )
    );
}


/* ============================================================
   10. FILTER DROPDOWNS
   ============================================================ */

/**
 * Populate all dynamic filter dropdowns.
 */
function populateFilters() {

    populateSelect(
        elements.providerFilter,
        uniqueValues(
            state.tools,
            getProvider
        ),
        "All Providers"
    );


    populateSelect(
        elements.categoryFilter,
        uniqueValues(
            state.tools,
            getCategory
        ),
        "All Categories"
    );


    populateSelect(
        elements.subcategoryFilter,
        uniqueValues(
            state.tools,
            getSubcategory
        ),
        "All Subcategories"
    );


    populateSelect(
        elements.levelFilter,
        uniqueValues(
            state.tools,
            getLevel
        ),
        "All Levels"
    );


    populateSelect(
        elements.typeFilter,
        uniqueValues(
            state.tools,
            getType
        ),
        "All Types"
    );
}


/**
 * Populate a select element.
 */
function populateSelect(
    select,
    values,
    firstLabel
) {

    if (!select) {
        return;
    }

    const currentValue =
        select.value || "all";


    select.innerHTML = `
        <option value="all">
            ${escapeHtml(firstLabel)}
        </option>
    `;


    values.forEach(value => {

        const option =
            document.createElement("option");

        option.value = value;

        option.textContent = value;

        select.appendChild(option);
    });


    /**
     * Restore previous value if it still exists.
     */
    if (
        [...select.options]
            .some(option =>
                option.value === currentValue
            )
    ) {

        select.value = currentValue;

    } else {

        select.value = "all";
    }
}


/* ============================================================
   11. CATEGORY SIDEBAR
   ============================================================ */

/**
 * Build the category directory dynamically.
 *
 * THIS FIXES THE MAIN ISSUE:
 *
 * The HTML contains:
 *
 * #categorySidebarList
 *
 * but JavaScript previously never populated it.
 *
 * This function reads every tool's category and generates
 * the complete directory automatically.
 */
function renderCategorySidebar() {

    if (!elements.categorySidebarList) {
        return;
    }


    /**
     * Count tools by category.
     */
    const categoryCounts = {};


    state.tools.forEach(tool => {

        const category =
            getCategory(tool);

        categoryCounts[category] =
            (categoryCounts[category] || 0) + 1;
    });


    /**
     * Sort alphabetically.
     */
    const categories =
        Object.entries(categoryCounts)
            .sort(
                (a, b) =>
                    a[0].localeCompare(
                        b[0],
                        undefined,
                        {
                            sensitivity: "base"
                        }
                    )
            );


    /**
     * Clear old sidebar.
     */
    elements.categorySidebarList.innerHTML = "";


    /**
     * Create "All Categories".
     */
    const allButton =
        document.createElement("button");

    allButton.type = "button";

    allButton.className =
        "category-sidebar-button";

    allButton.dataset.category = "all";

    allButton.innerHTML = `
        <span class="category-sidebar-name">
            All Categories
        </span>

        <span class="category-sidebar-count">
            ${state.tools.length}
        </span>
    `;

    elements.categorySidebarList
        .appendChild(allButton);


    /**
     * Create individual category buttons.
     */
    categories.forEach(
        ([category, count]) => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "category-sidebar-button";

            button.dataset.category =
                category;

            button.innerHTML = `
                <span class="category-sidebar-name">
                    ${escapeHtml(category)}
                </span>

                <span class="category-sidebar-count">
                    ${count}
                </span>
            `;

            elements.categorySidebarList
                .appendChild(button);
        }
    );


    /**
     * Update sidebar footer.
     */
    if (elements.sidebarCategoryCount) {

        const count =
            categories.length;

        elements.sidebarCategoryCount.textContent =
            `${count} categor${count === 1 ? "y" : "ies"}`;
    }


    /**
     * Highlight currently selected category.
     */
    updateCategorySidebarState();
}


/**
 * Filter category sidebar using its search field.
 */
function filterCategorySidebar() {

    if (!elements.categorySidebarList) {
        return;
    }


    const query =
        state.categorySearch
            .trim()
            .toLowerCase();


    const buttons =
        elements.categorySidebarList
            .querySelectorAll(
                ".category-sidebar-button"
            );


    buttons.forEach(button => {

        const category =
            String(
                button.dataset.category || ""
            ).toLowerCase();


        /**
         * Always keep All Categories visible.
         */
        if (category === "all") {

            button.hidden = false;

            return;
        }


        button.hidden =
            query.length > 0 &&
            !category.includes(query);
    });
}


/**
 * Highlight active category in sidebar.
 */
function updateCategorySidebarState() {

    if (!elements.categorySidebarList) {
        return;
    }


    const buttons =
        elements.categorySidebarList
            .querySelectorAll(
                ".category-sidebar-button"
            );


    buttons.forEach(button => {

        const category =
            button.dataset.category || "all";

        button.classList.toggle(
            "active",
            category === state.filters.category
        );
    });
}


/* ============================================================
   12. CATEGORY CHIPS
   ============================================================ */

/**
 * Generate quick category chips.
 */
function renderCategoryChips() {

    if (!elements.categoryChips) {
        return;
    }


    const categories =
        uniqueValues(
            state.tools,
            getCategory
        );


    elements.categoryChips.innerHTML = "";


    /**
     * All categories chip.
     */
    elements.categoryChips.appendChild(
        createCategoryChip(
            "All",
            "all"
        )
    );


    /**
     * Add categories.
     */
    categories.forEach(category => {

        elements.categoryChips.appendChild(
            createCategoryChip(
                category,
                category
            )
        );
    });


    updateCategoryChipState();
}


/**
 * Create one category chip.
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

    return button;
}


/**
 * Update active category chip.
 */
function updateCategoryChipState() {

    if (!elements.categoryChips) {
        return;
    }


    const chips =
        elements.categoryChips
            .querySelectorAll(
                ".category-chip"
            );


    chips.forEach(chip => {

        chip.classList.toggle(
            "active",
            chip.dataset.category ===
            state.filters.category
        );
    });
}


/* ============================================================
   13. SEARCH
   ============================================================ */

/**
 * Determine whether a tool matches search text.
 *
 * Searches:
 * - Name
 * - Description
 * - Provider
 * - Category
 * - Subcategory
 * - Level
 * - Type
 * - Tags
 */
function toolMatchesSearch(
    tool,
    query
) {

    if (!query) {
        return true;
    }


    const searchableText = [

        getToolName(tool),

        getDescription(tool),

        getProvider(tool),

        getCategory(tool),

        getSubcategory(tool),

        getLevel(tool),

        getType(tool),

        ...getToolTags(tool)

    ]
        .join(" ")
        .toLowerCase();


    return searchableText.includes(
        query.toLowerCase()
    );
}


/* ============================================================
   14. APPLY FILTERS
   ============================================================ */

/**
 * Apply search, category, provider and other filters.
 */
function applyFilters() {

    let results =
        [...state.tools];


    /**
     * Search.
     */
    results =
        results.filter(tool =>
            toolMatchesSearch(
                tool,
                state.searchQuery
            )
        );


    /**
     * Provider.
     */
    if (
        state.filters.provider !== "all"
    ) {

        results =
            results.filter(
                tool =>
                    getProvider(tool) ===
                    state.filters.provider
            );
    }


    /**
     * Category.
     */
    if (
        state.filters.category !== "all"
    ) {

        results =
            results.filter(
                tool =>
                    getCategory(tool) ===
                    state.filters.category
            );
    }


    /**
     * Subcategory.
     */
    if (
        state.filters.subcategory !== "all"
    ) {

        results =
            results.filter(
                tool =>
                    getSubcategory(tool) ===
                    state.filters.subcategory
            );
    }


    /**
     * Level.
     */
    if (
        state.filters.level !== "all"
    ) {

        results =
            results.filter(
                tool =>
                    getLevel(tool) ===
                    state.filters.level
            );
    }


    /**
     * Type.
     */
    if (
        state.filters.type !== "all"
    ) {

        results =
            results.filter(
                tool =>
                    getType(tool) ===
                    state.filters.type
            );
    }


    /**
     * Favorites.
     */
    if (
        state.filters.favorite === "favorites"
    ) {

        const favorites =
            getFavorites();

        results =
            results.filter(
                tool =>
                    favorites.includes(
                        getToolId(tool)
                    )
            );
    }


    /**
     * Recently viewed.
     */
    if (
        state.filters.favorite === "recent"
    ) {

        const recent =
            getRecentTools();

        results =
            results.filter(
                tool =>
                    recent.includes(
                        getToolId(tool)
                    )
            );
    }


    /**
     * Sort results.
     */
    results =
        sortTools(results);


    /**
     * Save results.
     */
    state.filteredTools =
        results;


    /**
     * Prevent invalid page.
     */
    const totalPages =
        getTotalPages();


    if (
        state.currentPage >
        totalPages &&
        totalPages > 0
    ) {

        state.currentPage =
            totalPages;
    }


    /**
     * Render everything.
     */
    renderTools();

    renderPagination();

    renderActiveFilters();

    updateCategoryChipState();

    updateCategorySidebarState();

    updateExploreMore();
}


/* ============================================================
   15. SORTING
   ============================================================ */

/**
 * Sort tools according to current sort selection.
 */
function sortTools(tools) {

    const sorted =
        [...tools];


    sorted.sort((a, b) => {

        const nameA =
            getToolName(a).toLowerCase();

        const nameB =
            getToolName(b).toLowerCase();


        switch (state.sortBy) {

            case "name-desc":

                return nameB.localeCompare(nameA);


            case "provider":

                return getProvider(a)
                    .localeCompare(
                        getProvider(b)
                    );


            case "category":

                return getCategory(a)
                    .localeCompare(
                        getCategory(b)
                    );


            case "recent":

                return compareRecent(a, b);


            case "newest":

                return compareDates(
                    b,
                    a
                );


            case "oldest":

                return compareDates(
                    a,
                    b
                );


            case "name-asc":
            default:

                return nameA.localeCompare(
                    nameB
                );
        }
    });


    return sorted;
}


/**
 * Compare recently viewed order.
 */
function compareRecent(a, b) {

    const recent =
        getRecentTools();


    const indexA =
        recent.indexOf(
            getToolId(a)
        );


    const indexB =
        recent.indexOf(
            getToolId(b)
        );


    const safeA =
        indexA === -1
            ? Number.MAX_SAFE_INTEGER
            : indexA;


    const safeB =
        indexB === -1
            ? Number.MAX_SAFE_INTEGER
            : indexB;


    return safeA - safeB;
}


/**
 * Compare created/updated dates when available.
 */
function compareDates(a, b) {

    const dateA =
        getToolDate(a);

    const dateB =
        getToolDate(b);


    return (
        dateA.getTime() -
        dateB.getTime()
    );
}


/**
 * Extract a date from a tool.
 */
function getToolDate(tool) {

    const raw =
        tool?.updatedAt ||
        tool?.createdAt ||
        tool?.dateAdded ||
        tool?.date ||
        "";


    const date =
        new Date(raw);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return new Date(0);
    }


    return date;
}


/* ============================================================
   16. RENDER TOOLS
   ============================================================ */

/**
 * Render the current page of tools.
 */
function renderTools() {

    if (!elements.toolGrid) {
        return;
    }


    const total =
        state.filteredTools.length;


    /**
     * Update result count.
     */
    if (elements.resultCount) {

        elements.resultCount.textContent =
            `${formatNumber(total)} ${
                total === 1
                    ? "technology"
                    : "technologies"
            }`;
    }


    /**
     * Empty state.
     */
    if (total === 0) {

        elements.toolGrid.innerHTML = "";

        showEmptyState();

        return;
    }


    hideEmptyState();


    /**
     * Calculate page range.
     */
    const start =
        (
            state.currentPage - 1
        ) *
        state.itemsPerPage;


    const end =
        start +
        state.itemsPerPage;


    const pageTools =
        state.filteredTools.slice(
            start,
            end
        );


    /**
     * Render cards.
     */
    elements.toolGrid.innerHTML =
        pageTools
            .map(tool =>
                createToolCard(tool)
            )
            .join("");


    /**
     * Apply grid/list class.
     */
    elements.toolGrid.classList.toggle(
        "list-view",
        state.viewMode === "list"
    );


    elements.toolGrid.classList.toggle(
        "grid-view",
        state.viewMode === "grid"
    );


    /**
     * Refresh favorite buttons.
     */
    updateFavoriteButtons();
}


/* ============================================================
   17. TOOL CARD
   ============================================================ */

/**
 * Create one tool card.
 */
function createToolCard(tool) {

    const id =
        getToolId(tool);

    const name =
        getToolName(tool);

    const category =
        getCategory(tool);

    const provider =
        getProvider(tool);

    const description =
        getDescription(tool);

    const icon =
        getToolIcon(tool);

    const tags =
        getToolTags(tool);

    const isFavorite =
        isToolFavorite(id);

    const isRecent =
        getRecentTools().includes(id);


    const visibleTags =
        tags.slice(0, 4);


    return `
        <article
            class="tool-card"
            data-tool-id="${escapeHtml(id)}"
        >

            <div class="tool-card-header">

                <div class="tool-icon">
                    ${escapeHtml(icon)}
                </div>

                <div class="tool-card-heading">

                    <span class="tool-category">
                        ${escapeHtml(category)}
                    </span>

                    <h3 class="tool-name">
                        ${highlightSearch(
                            escapeHtml(name)
                        )}
                    </h3>

                </div>

                <button
                    type="button"
                    class="favorite-button ${
                        isFavorite
                            ? "active"
                            : ""
                    }"
                    data-favorite-tool="${escapeHtml(id)}"
                    aria-label="${
                        isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }"
                    title="${
                        isFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }"
                >
                    ${isFavorite ? "★" : "☆"}
                </button>

            </div>


            ${
                isRecent
                    ? `
                        <span class="recent-badge">
                            Recently Viewed
                        </span>
                    `
                    : ""
            }


            <p class="tool-description">
                ${highlightSearch(
                    escapeHtml(description)
                )}
            </p>


            <div class="tool-card-meta">

                <span class="tool-provider">
                    ${escapeHtml(provider)}
                </span>

                ${
                    getLevel(tool)
                        ? `
                            <span>
                                ${escapeHtml(
                                    getLevel(tool)
                                )}
                            </span>
                        `
                        : ""
                }

            </div>


            ${
                visibleTags.length
                    ? `
                        <div class="tool-tags">
                            ${visibleTags
                                .map(
                                    tag => `
                                        <span class="tool-tag">
                                            ${escapeHtml(tag)}
                                        </span>
                                    `
                                )
                                .join("")}
                        </div>
                    `
                    : ""
            }


            <div class="tool-card-actions">

                <button
                    type="button"
                    class="tool-open-button"
                    data-open-tool="${escapeHtml(id)}"
                >
                    View Documentation →
                </button>

                <button
                    type="button"
                    class="copy-link-button"
                    data-copy-tool="${escapeHtml(id)}"
                    title="Copy tool link"
                >
                    Copy
                </button>

            </div>

        </article>
    `;
}


/* ============================================================
   18. TOOL ID
   ============================================================ */

/**
 * Get stable ID for a tool.
 *
 * Preferred:
 * tool.id
 *
 * Fallback:
 * name converted into a slug.
 */
function getToolId(tool) {

    if (tool?.id !== undefined) {

        return String(tool.id);
    }


    if (tool?.slug) {

        return String(tool.slug);
    }


    return slugify(
        getToolName(tool)
    );
}


/**
 * Convert text into a URL-friendly ID.
 */
function slugify(value) {

    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(
            /^-+|-+$/g,
            ""
        );
}


/* ============================================================
   19. SEARCH HIGHLIGHT
   ============================================================ */

/**
 * Highlight matching search terms.
 *
 * The input is already HTML escaped.
 */
function highlightSearch(value) {

    if (
        !state.searchQuery ||
        !value
    ) {

        return value;
    }


    const query =
        escapeRegExp(
            state.searchQuery.trim()
        );


    if (!query) {
        return value;
    }


    return value.replace(
        new RegExp(
            `(${query})`,
            "gi"
        ),
        `<mark class="search-highlight">$1</mark>`
    );
}


/**
 * Escape regular-expression characters.
 */
function escapeRegExp(value) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


/* ============================================================
   20. FAVORITES
   ============================================================ */

/**
 * Read favorites.
 */
function getFavorites() {

    try {

        const value =
            localStorage.getItem(
                CONFIG.storageKeys.favorites
            );


        if (!value) {
            return [];
        }


        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed.map(String)
            : [];

    } catch (error) {

        console.warn(
            "Could not read favorites:",
            error
        );

        return [];
    }
}


/**
 * Save favorites.
 */
function saveFavorites(favorites) {

    try {

        localStorage.setItem(
            CONFIG.storageKeys.favorites,
            JSON.stringify(
                favorites
            )
        );

    } catch (error) {

        console.warn(
            "Could not save favorites:",
            error
        );
    }
}


/**
 * Check whether a tool is favorite.
 */
function isToolFavorite(id) {

    return getFavorites()
        .includes(
            String(id)
        );
}


/**
 * Toggle favorite state.
 */
function toggleFavorite(id) {

    const toolId =
        String(id);

    let favorites =
        getFavorites();


    if (
        favorites.includes(toolId)
    ) {

        favorites =
            favorites.filter(
                item =>
                    item !== toolId
            );

    } else {

        favorites.push(toolId);
    }


    saveFavorites(favorites);


    /**
     * Update statistics.
     */
    updateStatistics();


    /**
     * Reapply favorite filter if active.
     */
    if (
        state.filters.favorite ===
        "favorites"
    ) {

        state.currentPage = 1;

        applyFilters();

    } else {

        updateFavoriteButtons();
    }


    /**
     * Update modal favorite button if necessary.
     */
    updateModalFavoriteState();
}


/**
 * Refresh all favorite buttons.
 */
function updateFavoriteButtons() {

    if (!elements.toolGrid) {
        return;
    }


    const buttons =
        elements.toolGrid
            .querySelectorAll(
                "[data-favorite-tool]"
            );


    buttons.forEach(button => {

        const id =
            String(
                button.dataset.favoriteTool
            );


        const active =
            isToolFavorite(id);


        button.classList.toggle(
            "active",
            active
        );


        button.textContent =
            active ? "★" : "☆";


        button.setAttribute(
            "aria-label",
            active
                ? "Remove from favorites"
                : "Add to favorites"
        );
    });
}


/* ============================================================
   21. RECENTLY VIEWED
   ============================================================ */

/**
 * Read recently viewed tool IDs.
 */
function getRecentTools() {

    try {

        const value =
            localStorage.getItem(
                CONFIG.storageKeys.recent
            );


        if (!value) {
            return [];
        }


        const parsed =
            JSON.parse(value);


        return Array.isArray(parsed)
            ? parsed.map(String)
            : [];

    } catch (error) {

        console.warn(
            "Could not read recent tools:",
            error
        );

        return [];
    }
}


/**
 * Save a recently viewed tool.
 */
function saveRecentTool(id) {

    const toolId =
        String(id);


    let recent =
        getRecentTools();


    /**
     * Remove existing occurrence.
     */
    recent =
        recent.filter(
            item =>
                item !== toolId
        );


    /**
     * Put latest item first.
     */
    recent.unshift(toolId);


    /**
     * Keep list small.
     */
    recent =
        recent.slice(
            0,
            CONFIG.maxRecentTools
        );


    try {

        localStorage.setItem(
            CONFIG.storageKeys.recent,
            JSON.stringify(recent)
        );

    } catch (error) {

        console.warn(
            "Could not save recent tool:",
            error
        );
    }
}


/* ============================================================
   22. MODAL
   ============================================================ */

/**
 * Open a tool modal.
 */
function openToolModal(id) {

    const tool =
        findToolById(id);


    if (!tool) {
        return;
    }


    state.activeToolId =
        getToolId(tool);


    /**
     * Save recently viewed.
     */
    saveRecentTool(
        getToolId(tool)
    );


    /**
     * Populate modal.
     */
    if (elements.modalToolIcon) {

        elements.modalToolIcon.textContent =
            getToolIcon(tool);
    }


    if (elements.modalToolCategory) {

        elements.modalToolCategory.textContent =
            getCategory(tool);
    }


    if (elements.modalToolName) {

        elements.modalToolName.textContent =
            getToolName(tool);
    }


    if (elements.modalToolProvider) {

        elements.modalToolProvider.textContent =
            getProvider(tool);
    }


    if (elements.modalToolDescription) {

        elements.modalToolDescription.textContent =
            getDescription(tool);
    }


    renderModalMeta(tool);

    renderModalLinks(tool);

    renderModalTags(tool);

    renderRelatedTools(tool);


    /**
     * Configure Explore More.
     */
    if (elements.modalExploreMore) {

        const documentation =
            getDocumentationUrl(tool);


        if (documentation) {

            elements.modalExploreMore.href =
                documentation;

            elements.modalExploreMore.hidden =
                false;

        } else {

            elements.modalExploreMore.hidden =
                true;
        }
    }


    /**
     * Show modal.
     */
    if (elements.toolModal) {

        elements.toolModal.classList.add(
            "open"
        );

        elements.toolModal.setAttribute(
            "aria-hidden",
            "false"
        );

        document.body.classList.add(
            "modal-open"
        );
    }


    /**
     * Refresh cards so Recent badge appears.
     */
    renderTools();
}


/**
 * Close tool modal.
 */
function closeToolModal() {

    if (!elements.toolModal) {
        return;
    }


    elements.toolModal.classList.remove(
        "open"
    );


    elements.toolModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    state.activeToolId = null;
}


/**
 * Find tool by ID.
 */
function findToolById(id) {

    const target =
        String(id);


    return state.tools.find(
        tool =>
            getToolId(tool) === target
    );
}


/* ============================================================
   23. MODAL META
   ============================================================ */

/**
 * Render tool metadata.
 */
function renderModalMeta(tool) {

    if (!elements.modalToolMeta) {
        return;
    }


    const metadata = [];


    if (getSubcategory(tool)) {

        metadata.push(
            ["Subcategory", getSubcategory(tool)]
        );
    }


    if (getLevel(tool)) {

        metadata.push(
            ["Level", getLevel(tool)]
        );
    }


    if (getType(tool)) {

        metadata.push(
            ["Type", getType(tool)]
        );
    }


    if (tool?.license) {

        metadata.push(
            ["License", String(tool.license)]
        );
    }


    elements.modalToolMeta.innerHTML =
        metadata
            .map(
                ([label, value]) => `
                    <div class="modal-meta-item">

                        <span class="modal-meta-label">
                            ${escapeHtml(label)}
                        </span>

                        <strong>
                            ${escapeHtml(value)}
                        </strong>

                    </div>
                `
            )
            .join("");
}


/* ============================================================
   24. MODAL LINKS
   ============================================================ */

/**
 * Render official resources.
 */
function renderModalLinks(tool) {

    if (!elements.modalToolLinks) {
        return;
    }


    const links = [

        {
            label: "Official Website",
            url: getOfficialWebsite(tool)
        },

        {
            label: "Official Documentation",
            url: getDocumentationUrl(tool)
        },

        {
            label: "GitHub",
            url: getGithubUrl(tool)
        }

    ]
        .filter(
            item =>
                item.url
        );


    if (!links.length) {

        elements.modalToolLinks.innerHTML = `
            <span class="modal-no-links">
                No official resources available.
            </span>
        `;

        return;
    }


    elements.modalToolLinks.innerHTML =
        links
            .map(
                link => `
                    <a
                        href="${escapeHtml(link.url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="modal-resource-link"
                    >
                        ${escapeHtml(
                            link.label
                        )}
                        ↗
                    </a>
                `
            )
            .join("");
}


/* ============================================================
   25. MODAL TAGS
   ============================================================ */

/**
 * Render tags in modal.
 */
function renderModalTags(tool) {

    if (!elements.modalToolTags) {
        return;
    }


    const tags =
        getToolTags(tool);


    elements.modalToolTags.innerHTML =
        tags
            .map(
                tag => `
                    <span class="tool-tag">
                        ${escapeHtml(tag)}
                    </span>
                `
            )
            .join("");
}


/* ============================================================
   26. RELATED TECHNOLOGIES
   ============================================================ */

/**
 * Find related tools.
 *
 * Related tools are selected using:
 *
 * 1. Same category
 * 2. Same provider
 * 3. Shared tags
 */
function renderRelatedTools(tool) {

    if (!elements.modalRelatedTools) {
        return;
    }


    const currentId =
        getToolId(tool);

    const category =
        getCategory(tool);

    const provider =
        getProvider(tool);

    const currentTags =
        getToolTags(tool)
            .map(tag =>
                tag.toLowerCase()
            );


    const related =
        state.tools
            .filter(
                candidate =>
                    getToolId(candidate) !==
                    currentId
            )
            .map(candidate => {

                let score = 0;


                if (
                    getCategory(candidate) ===
                    category
                ) {

                    score += 5;
                }


                if (
                    getProvider(candidate) ===
                    provider
                ) {

                    score += 3;
                }


                const candidateTags =
                    getToolTags(candidate)
                        .map(tag =>
                            tag.toLowerCase()
                        );


                candidateTags.forEach(tag => {

                    if (
                        currentTags.includes(tag)
                    ) {

                        score += 1;
                    }
                });


                return {
                    tool: candidate,
                    score
                };
            })
            .filter(item =>
                item.score > 0
            )
            .sort(
                (a, b) =>
                    b.score - a.score
            )
            .slice(
                0,
                CONFIG.maxRelatedTools
            );


    if (!related.length) {

        elements.modalRelatedTools.innerHTML = `
            <span class="modal-no-related">
                No related technologies found.
            </span>
        `;

        return;
    }


    elements.modalRelatedTools.innerHTML =
        related
            .map(
                ({ tool: relatedTool }) => `
                    <button
                        type="button"
                        class="related-tool"
                        data-open-tool="${escapeHtml(
                            getToolId(relatedTool)
                        )}"
                    >
                        <span class="related-tool-icon">
                            ${escapeHtml(
                                getToolIcon(
                                    relatedTool
                                )
                            )}
                        </span>

                        <span>
                            ${escapeHtml(
                                getToolName(
                                    relatedTool
                                )
                            )}
                        </span>
                    </button>
                `
            )
            .join("");
}


/* ============================================================
   27. MODAL FAVORITE STATE
   ============================================================ */

/**
 * Update modal favorite state if HTML contains a
 * modal favorite button.
 */
function updateModalFavoriteState() {

    if (!state.activeToolId) {
        return;
    }


    const button =
        elements.toolModal?.querySelector(
            "[data-modal-favorite]"
        );


    if (!button) {
        return;
    }


    const active =
        isToolFavorite(
            state.activeToolId
        );


    button.classList.toggle(
        "active",
        active
    );


    button.textContent =
        active ? "★" : "☆";
}


/* ============================================================
   28. PAGINATION
   ============================================================ */

/**
 * Calculate total pages.
 */
function getTotalPages() {

    if (
        state.filteredTools.length === 0
    ) {

        return 0;
    }


    return Math.ceil(
        state.filteredTools.length /
        state.itemsPerPage
    );
}


/**
 * Render pagination controls.
 */
function renderPagination() {

    if (!elements.pagination) {
        return;
    }


    const total =
        state.filteredTools.length;


    const totalPages =
        getTotalPages();


    /**
     * Nothing to paginate.
     */
    if (
        total === 0 ||
        totalPages <= 1
    ) {

        elements.pagination.innerHTML = "";


        if (elements.paginationInfo) {

            elements.paginationInfo.textContent =
                total === 0
                    ? "No results"
                    : `Page 1 of 1`;
        }


        return;
    }


    /**
     * Build controls.
     */
    const parts = [];


    /**
     * Previous.
     */
    parts.push(`
        <button
            type="button"
            class="pagination-button pagination-previous"
            data-page="${
                Math.max(
                    1,
                    state.currentPage - 1
                )
            }"
            ${
                state.currentPage === 1
                    ? "disabled"
                    : ""
            }
        >
            ← Previous
        </button>
    `);


    /**
     * Page numbers.
     */
    getPaginationPages(
        totalPages,
        state.currentPage
    ).forEach(item => {

        if (item === "...") {

            parts.push(`
                <span class="pagination-ellipsis">
                    …
                </span>
            `);

            return;
        }


        parts.push(`
            <button
                type="button"
                class="
                    pagination-button
                    pagination-number
                    ${
                        item ===
                        state.currentPage
                            ? "active"
                            : ""
                    }
                "
                data-page="${item}"
                ${
                    item ===
                    state.currentPage
                        ? 'aria-current="page"'
                        : ""
                }
            >
                ${item}
            </button>
        `);
    });


    /**
     * Next.
     */
    parts.push(`
        <button
            type="button"
            class="pagination-button pagination-next"
            data-page="${
                Math.min(
                    totalPages,
                    state.currentPage + 1
                )
            }"
            ${
                state.currentPage ===
                totalPages
                    ? "disabled"
                    : ""
            }
        >
            Next →
        </button>
    `);


    elements.pagination.innerHTML =
        parts.join("");


    /**
     * Page information.
     */
    if (elements.paginationInfo) {

        const start =
            (
                state.currentPage - 1
            ) *
            state.itemsPerPage +
            1;


        const end =
            Math.min(
                state.currentPage *
                state.itemsPerPage,
                total
            );


        elements.paginationInfo.textContent =
            `Showing ${start}–${end} of ${total} · Page ${state.currentPage} of ${totalPages}`;
    }
}


/**
 * Generate compact page numbers.
 */
function getPaginationPages(
    totalPages,
    currentPage
) {

    /**
     * Small number of pages:
     * show everything.
     */
    if (totalPages <= 7) {

        return Array.from(
            {
                length: totalPages
            },
            (_, index) =>
                index + 1
        );
    }


    const pages = [];


    pages.push(1);


    if (currentPage > 4) {
        pages.push("...");
    }


    const start =
        Math.max(
            2,
            currentPage - 1
        );


    const end =
        Math.min(
            totalPages - 1,
            currentPage + 1
        );


    for (
        let page = start;
        page <= end;
        page++
    ) {

        pages.push(page);
    }


    if (
        currentPage <
        totalPages - 3
    ) {

        pages.push("...");
    }


    pages.push(totalPages);


    return pages;
}


/**
 * Go to page.
 */
function goToPage(page) {

    const totalPages =
        getTotalPages();


    if (
        totalPages === 0
    ) {

        state.currentPage = 1;

        return;
    }


    state.currentPage =
        Math.max(
            1,
            Math.min(
                Number(page),
                totalPages
            )
        );


    renderTools();

    renderPagination();


    /**
     * Scroll results into view.
     */
    scrollToResults();
}


/* ============================================================
   29. EXPLORE MORE
   ============================================================ */

/**
 * Update Explore More button.
 *
 * Explore More loads the next page of results.
 */
function updateExploreMore() {

    if (
        !elements.exploreMoreContainer ||
        !elements.exploreMoreButton
    ) {

        return;
    }


    const totalPages =
        getTotalPages();


    const hasMore =
        state.currentPage <
        totalPages;


    elements.exploreMoreContainer.hidden =
        !hasMore;


    if (hasMore) {

        elements.exploreMoreButton.textContent =
            `Explore More · Page ${
                state.currentPage + 1
            }`;
    }
}


/**
 * Load the next page using Explore More.
 */
function exploreMore() {

    const totalPages =
        getTotalPages();


    if (
        state.currentPage >=
        totalPages
    ) {

        return;
    }


    state.currentPage += 1;


    renderTools();

    renderPagination();

    updateExploreMore();


    scrollToResults();
}


/* ============================================================
   30. ACTIVE FILTERS
   ============================================================ */

/**
 * Display active filters as removable badges.
 */
function renderActiveFilters() {

    if (!elements.activeFilters) {
        return;
    }


    const active = [];


    /**
     * Search.
     */
    if (state.searchQuery) {

        active.push({
            key: "search",
            label: `Search: ${state.searchQuery}`
        });
    }


    /**
     * Standard filters.
     */
    const filterDefinitions = [

        {
            key: "provider",
            label: "Provider"
        },

        {
            key: "category",
            label: "Category"
        },

        {
            key: "subcategory",
            label: "Subcategory"
        },

        {
            key: "level",
            label: "Level"
        },

        {
            key: "type",
            label: "Type"
        },

        {
            key: "favorite",
            label: "View"
        }

    ];


    filterDefinitions.forEach(
        ({ key, label }) => {

            const value =
                state.filters[key];


            if (
                value &&
                value !== "all"
            ) {

                let displayValue =
                    value;


                if (
                    key === "favorite"
                ) {

                    if (
                        value ===
                        "favorites"
                    ) {

                        displayValue =
                            "Favorites";

                    } else if (
                        value === "recent"
                    ) {

                        displayValue =
                            "Recently Viewed";
                    }
                }


                active.push({
                    key,
                    label:
                        `${label}: ${displayValue}`
                });
            }
        }
    );


    /**
     * Nothing active.
     */
    if (!active.length) {

        elements.activeFilters.innerHTML =
            "";

        elements.activeFilters.hidden =
            true;

        return;
    }


    elements.activeFilters.hidden =
        false;


    elements.activeFilters.innerHTML =
        active
            .map(
                item => `
                    <button
                        type="button"
                        class="active-filter"
                        data-remove-filter="${escapeHtml(
                            item.key
                        )}"
                    >
                        <span>
                            ${escapeHtml(
                                item.label
                            )}
                        </span>

                        <span
                            class="active-filter-remove"
                            aria-hidden="true"
                        >
                            ×
                        </span>
                    </button>
                `
            )
            .join("");


    /**
     * Add clear-all button.
     */
    elements.activeFilters.insertAdjacentHTML(
        "beforeend",
        `
            <button
                type="button"
                class="clear-active-filters"
                data-clear-filters
            >
                Clear all
            </button>
        `
    );
}


/**
 * Remove one active filter.
 */
function removeFilter(key) {

    if (key === "search") {

        state.searchQuery = "";

        if (elements.toolSearch) {
            elements.toolSearch.value = "";
        }

    } else if (
        Object.prototype.hasOwnProperty.call(
            state.filters,
            key
        )
    ) {

        state.filters[key] =
            "all";


        syncFilterControls();
    }


    state.currentPage = 1;

    applyFilters();
}


/* ============================================================
   31. EMPTY STATE
   ============================================================ */

/**
 * Show empty results state.
 */
function showEmptyState() {

    if (!elements.emptyState) {
        return;
    }


    elements.emptyState.hidden =
        false;
}


/**
 * Hide empty results state.
 */
function hideEmptyState() {

    if (!elements.emptyState) {
        return;
    }


    elements.emptyState.hidden =
        true;
}


/* ============================================================
   32. RESET FILTERS
   ============================================================ */

/**
 * Reset all filters and search.
 */
function resetFilters() {

    state.searchQuery = "";


    state.filters = {
        provider: "all",
        category: "all",
        subcategory: "all",
        level: "all",
        type: "all",
        favorite: "all"
    };


    state.currentPage = 1;


    /**
     * Reset search field.
     */
    if (elements.toolSearch) {
        elements.toolSearch.value = "";
    }


    /**
     * Reset category search.
     */
    state.categorySearch = "";


    if (elements.categorySearch) {
        elements.categorySearch.value = "";
    }


    /**
     * Reset filter controls.
     */
    syncFilterControls();


    /**
     * Clear sidebar search.
     */
    filterCategorySidebar();


    applyFilters();
}


/**
 * Synchronize HTML filter controls with state.
 */
function syncFilterControls() {

    if (elements.providerFilter) {

        elements.providerFilter.value =
            state.filters.provider;
    }


    if (elements.categoryFilter) {

        elements.categoryFilter.value =
            state.filters.category;
    }


    if (elements.subcategoryFilter) {

        elements.subcategoryFilter.value =
            state.filters.subcategory;
    }


    if (elements.levelFilter) {

        elements.levelFilter.value =
            state.filters.level;
    }


    if (elements.typeFilter) {

        elements.typeFilter.value =
            state.filters.type;
    }


    if (elements.favoriteFilter) {

        elements.favoriteFilter.value =
            state.filters.favorite;
    }
}


/* ============================================================
   33. VIEW MODE
   ============================================================ */

/**
 * Restore saved grid/list view.
 */
function restoreViewMode() {

    try {

        const saved =
            localStorage.getItem(
                CONFIG.storageKeys.viewMode
            );


        if (
            saved === "grid" ||
            saved === "list"
        ) {

            state.viewMode =
                saved;
        }

    } catch (error) {

        console.warn(
            "Could not restore view mode:",
            error
        );
    }


    applyViewMode();
}


/**
 * Save view mode.
 */
function saveViewMode() {

    try {

        localStorage.setItem(
            CONFIG.storageKeys.viewMode,
            state.viewMode
        );

    } catch (error) {

        console.warn(
            "Could not save view mode:",
            error
        );
    }
}


/**
 * Apply current view mode.
 */
function applyViewMode() {

    if (!elements.toolGrid) {
        return;
    }


    elements.toolGrid.classList.toggle(
        "list-view",
        state.viewMode === "list"
    );


    elements.toolGrid.classList.toggle(
        "grid-view",
        state.viewMode === "grid"
    );


    if (elements.gridViewButton) {

        elements.gridViewButton.classList.toggle(
            "active",
            state.viewMode === "grid"
        );

        elements.gridViewButton.setAttribute(
            "aria-pressed",
            state.viewMode === "grid"
                ? "true"
                : "false"
        );
    }


    if (elements.listViewButton) {

        elements.listViewButton.classList.toggle(
            "active",
            state.viewMode === "list"
        );

        elements.listViewButton.setAttribute(
            "aria-pressed",
            state.viewMode === "list"
                ? "true"
                : "false"
        );
    }
}


/**
 * Change view mode.
 */
function setViewMode(mode) {

    if (
        mode !== "grid" &&
        mode !== "list"
    ) {

        return;
    }


    state.viewMode =
        mode;


    saveViewMode();

    applyViewMode();
}


/* ============================================================
   34. SIDEBAR
   ============================================================ */

/**
 * Open category sidebar on mobile.
 */
function openCategorySidebar() {

    if (!elements.categorySidebar) {
        return;
    }


    elements.categorySidebar.classList.add(
        "open"
    );


    if (elements.categorySidebarOverlay) {

        elements.categorySidebarOverlay.classList.add(
            "open"
        );
    }


    document.body.classList.add(
        "sidebar-open"
    );
}


/**
 * Close category sidebar.
 */
function closeCategorySidebar() {

    if (elements.categorySidebar) {

        elements.categorySidebar.classList.remove(
            "open"
        );
    }


    if (elements.categorySidebarOverlay) {

        elements.categorySidebarOverlay.classList.remove(
            "open"
        );
    }


    document.body.classList.remove(
        "sidebar-open"
    );
}


/* ============================================================
   35. CATEGORY SELECTION
   ============================================================ */

/**
 * Select a category from sidebar or chips.
 */
function selectCategory(category) {

    state.filters.category =
        category || "all";


    /**
     * Sync dropdown.
     */
    if (elements.categoryFilter) {

        elements.categoryFilter.value =
            state.filters.category;
    }


    /**
     * Reset page.
     */
    state.currentPage = 1;


    /**
     * Update UI.
     */
    updateCategorySidebarState();

    updateCategoryChipState();

    applyFilters();


    /**
     * Close mobile sidebar.
     */
    closeCategorySidebar();
}


/* ============================================================
   36. EVENT BINDING
   ============================================================ */

/**
 * Bind all UI events.
 */
function bindEvents() {

    /* --------------------------------------------------------
       Main search
       -------------------------------------------------------- */

    if (elements.toolSearch) {

        elements.toolSearch.addEventListener(
            "input",
            debounce(() => {

                state.searchQuery =
                    elements.toolSearch.value
                        .trim();

                state.currentPage = 1;

                applyFilters();

            }, CONFIG.searchDelay)
        );
    }


    /* --------------------------------------------------------
       Provider filter
       -------------------------------------------------------- */

    if (elements.providerFilter) {

        elements.providerFilter.addEventListener(
            "change",
            () => {

                state.filters.provider =
                    elements.providerFilter.value;

                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Category filter
       -------------------------------------------------------- */

    if (elements.categoryFilter) {

        elements.categoryFilter.addEventListener(
            "change",
            () => {

                state.filters.category =
                    elements.categoryFilter.value;

                state.currentPage = 1;

                updateCategorySidebarState();

                updateCategoryChipState();

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Subcategory
       -------------------------------------------------------- */

    if (elements.subcategoryFilter) {

        elements.subcategoryFilter.addEventListener(
            "change",
            () => {

                state.filters.subcategory =
                    elements.subcategoryFilter.value;

                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Level
       -------------------------------------------------------- */

    if (elements.levelFilter) {

        elements.levelFilter.addEventListener(
            "change",
            () => {

                state.filters.level =
                    elements.levelFilter.value;

                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Type
       -------------------------------------------------------- */

    if (elements.typeFilter) {

        elements.typeFilter.addEventListener(
            "change",
            () => {

                state.filters.type =
                    elements.typeFilter.value;

                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Favorites / recent filter
       -------------------------------------------------------- */

    if (elements.favoriteFilter) {

        elements.favoriteFilter.addEventListener(
            "change",
            () => {

                state.filters.favorite =
                    elements.favoriteFilter.value;

                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Category sidebar search
       -------------------------------------------------------- */

    if (elements.categorySearch) {

        elements.categorySearch.addEventListener(
            "input",
            debounce(() => {

                state.categorySearch =
                    elements.categorySearch.value;

                filterCategorySidebar();

            }, CONFIG.searchDelay)
        );
    }


    /* --------------------------------------------------------
       Category sidebar buttons
       -------------------------------------------------------- */

    if (elements.categorySidebarList) {

        elements.categorySidebarList
            .addEventListener(
                "click",
                event => {

                    const button =
                        event.target.closest(
                            ".category-sidebar-button"
                        );


                    if (!button) {
                        return;
                    }


                    selectCategory(
                        button.dataset.category ||
                        "all"
                    );
                }
            );
    }


    /* --------------------------------------------------------
       Category chips
       -------------------------------------------------------- */

    if (elements.categoryChips) {

        elements.categoryChips
            .addEventListener(
                "click",
                event => {

                    const chip =
                        event.target.closest(
                            ".category-chip"
                        );


                    if (!chip) {
                        return;
                    }


                    selectCategory(
                        chip.dataset.category ||
                        "all"
                    );
                }
            );
    }


    /* --------------------------------------------------------
       Sorting
       -------------------------------------------------------- */

    if (elements.sortSelect) {

        elements.sortSelect.addEventListener(
            "change",
            () => {

                state.sortBy =
                    elements.sortSelect.value;

                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Items per page
       -------------------------------------------------------- */

    if (elements.itemsPerPage) {

        elements.itemsPerPage.addEventListener(
            "change",
            () => {

                const value =
                    Number(
                        elements.itemsPerPage.value
                    );


                if (
                    Number.isFinite(value) &&
                    value > 0
                ) {

                    state.itemsPerPage =
                        value;

                } else {

                    state.itemsPerPage =
                        CONFIG.defaultItemsPerPage;
                }


                state.currentPage = 1;

                applyFilters();
            }
        );
    }


    /* --------------------------------------------------------
       Reset filters
       -------------------------------------------------------- */

    if (elements.resetFiltersButton) {

        elements.resetFiltersButton
            .addEventListener(
                "click",
                resetFilters
            );
    }


    /* --------------------------------------------------------
       Grid view
       -------------------------------------------------------- */

    if (elements.gridViewButton) {

        elements.gridViewButton.addEventListener(
            "click",
            () => setViewMode("grid")
        );
    }


    /* --------------------------------------------------------
       List view
       -------------------------------------------------------- */

    if (elements.listViewButton) {

        elements.listViewButton.addEventListener(
            "click",
            () => setViewMode("list")
        );
    }


    /* --------------------------------------------------------
       Tool grid events
       -------------------------------------------------------- */

    if (elements.toolGrid) {

        elements.toolGrid.addEventListener(
            "click",
            event => {

                /**
                 * Favorite button.
                 */
                const favoriteButton =
                    event.target.closest(
                        "[data-favorite-tool]"
                    );


                if (favoriteButton) {

                    event.preventDefault();

                    event.stopPropagation();


                    toggleFavorite(
                        favoriteButton.dataset
                            .favoriteTool
                    );

                    return;
                }


                /**
                 * Copy link button.
                 */
                const copyButton =
                    event.target.closest(
                        "[data-copy-tool]"
                    );


                if (copyButton) {

                    event.preventDefault();

                    event.stopPropagation();


                    copyToolLink(
                        copyButton.dataset
                            .copyTool,
                        copyButton
                    );

                    return;
                }


                /**
                 * Open tool.
                 */
                const openButton =
                    event.target.closest(
                        "[data-open-tool]"
                    );


                if (openButton) {

                    openToolModal(
                        openButton.dataset
                            .openTool
                    );

                    return;
                }


                /**
                 * Clicking card itself.
                 */
                const card =
                    event.target.closest(
                        ".tool-card"
                    );


                if (card) {

                    openToolModal(
                        card.dataset.toolId
                    );
                }
            }
        );
    }


    /* --------------------------------------------------------
       Pagination
       -------------------------------------------------------- */

    if (elements.pagination) {

        elements.pagination.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-page]"
                    );


                if (!button) {
                    return;
                }


                if (button.disabled) {
                    return;
                }


                const page =
                    Number(
                        button.dataset.page
                    );


                if (
                    Number.isFinite(page)
                ) {

                    goToPage(page);
                }
            }
        );
    }


    /* --------------------------------------------------------
       Explore More
       -------------------------------------------------------- */

    if (elements.exploreMoreButton) {

        elements.exploreMoreButton
            .addEventListener(
                "click",
                exploreMore
            );
    }


    /* --------------------------------------------------------
       Active filters
       -------------------------------------------------------- */

    if (elements.activeFilters) {

        elements.activeFilters
            .addEventListener(
                "click",
                event => {

                    const removeButton =
                        event.target.closest(
                            "[data-remove-filter]"
                        );


                    if (removeButton) {

                        removeFilter(
                            removeButton.dataset
                                .removeFilter
                        );

                        return;
                    }


                    const clearButton =
                        event.target.closest(
                            "[data-clear-filters]"
                        );


                    if (clearButton) {

                        resetFilters();
                    }
                }
            );
    }


    /* --------------------------------------------------------
       Sidebar open
       -------------------------------------------------------- */

    if (elements.categorySidebarToggle) {

        elements.categorySidebarToggle
            .addEventListener(
                "click",
                openCategorySidebar
            );
    }


    /* --------------------------------------------------------
       Sidebar close
       -------------------------------------------------------- */

    if (elements.categorySidebarClose) {

        elements.categorySidebarClose
            .addEventListener(
                "click",
                closeCategorySidebar
            );
    }


    /* --------------------------------------------------------
       Sidebar overlay
       -------------------------------------------------------- */

    if (elements.categorySidebarOverlay) {

        elements.categorySidebarOverlay
            .addEventListener(
                "click",
                closeCategorySidebar
            );
    }


    /* --------------------------------------------------------
       Modal close
       -------------------------------------------------------- */

    if (elements.closeModal) {

        elements.closeModal.addEventListener(
            "click",
            closeToolModal
        );
    }


    /* --------------------------------------------------------
       Modal background
       -------------------------------------------------------- */

    if (elements.toolModal) {

        elements.toolModal.addEventListener(
            "click",
            event => {

                /**
                 * Only close when the outer modal backdrop
                 * itself is clicked.
                 */
                if (
                    event.target ===
                    elements.toolModal
                ) {

                    closeToolModal();
                }
            }
        );


        /**
         * Related tools inside modal.
         */
        elements.toolModal.addEventListener(
            "click",
            event => {

                const related =
                    event.target.closest(
                        "[data-open-tool]"
                    );


                if (!related) {
                    return;
                }


                openToolModal(
                    related.dataset.openTool
                );
            }
        );
    }


    /* --------------------------------------------------------
       Global keyboard shortcuts
       -------------------------------------------------------- */

    document.addEventListener(
        "keydown",
        event => {

            /**
             * Escape closes modal/sidebar.
             */
            if (
                event.key === "Escape"
            ) {

                closeToolModal();

                closeCategorySidebar();
            }


            /**
             * "/" focuses search unless the user is
             * already typing in an input.
             */
            if (
                event.key === "/" &&
                !isTypingTarget(event.target)
            ) {

                event.preventDefault();

                elements.toolSearch?.focus();
            }
        }
    );


    /* --------------------------------------------------------
       Window resize
       -------------------------------------------------------- */

    window.addEventListener(
        "resize",
        debounce(() => {

            /**
             * On desktop, remove mobile drawer state.
             */
            if (
                window.innerWidth > 900
            ) {

                closeCategorySidebar();
            }

        }, 150)
    );
}


/* ============================================================
   37. COPY TOOL LINK
   ============================================================ */

/**
 * Copy a direct URL to the current tool.
 *
 * The link uses a query parameter:
 *
 * ?tool=tool-id
 */
async function copyToolLink(
    id,
    button
) {

    const url =
        new URL(
            window.location.href
        );


    url.searchParams.set(
        "tool",
        String(id)
    );


    try {

        await navigator.clipboard.writeText(
            url.toString()
        );


        if (button) {

            const original =
                button.textContent;


            button.textContent =
                "Copied!";


            button.classList.add(
                "copied"
            );


            setTimeout(() => {

                button.textContent =
                    original;

                button.classList.remove(
                    "copied"
                );

            }, 1400);
        }

    } catch (error) {

        console.warn(
            "Clipboard API unavailable:",
            error
        );


        /**
         * Fallback for older browsers.
         */
        fallbackCopyText(
            url.toString()
        );
    }
}


/**
 * Clipboard fallback.
 */
function fallbackCopyText(text) {

    const textarea =
        document.createElement("textarea");


    textarea.value =
        text;


    textarea.style.position =
        "fixed";

    textarea.style.left =
        "-9999px";


    document.body.appendChild(
        textarea
    );


    textarea.select();


    try {

        document.execCommand("copy");

    } catch (error) {

        console.warn(
            "Fallback copy failed:",
            error
        );
    }


    textarea.remove();
}


/* ============================================================
   38. OPEN TOOL FROM URL
   ============================================================ */

/**
 * Automatically open a tool when URL contains:
 *
 * ?tool=aws-cloudformation
 *
 * This allows shareable direct tool links.
 */
function openToolFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const toolId =
        params.get("tool");


    if (!toolId) {
        return;
    }


    const tool =
        findToolById(toolId);


    if (!tool) {
        return;
    }


    openToolModal(
        getToolId(tool)
    );
}


/* ============================================================
   39. SCROLL TO RESULTS
   ============================================================ */

/**
 * Scroll back to the tool result area.
 */
function scrollToResults() {

    if (!elements.toolGrid) {
        return;
    }


    const top =
        elements.toolGrid.getBoundingClientRect()
            .top +
        window.scrollY -
        120;


    window.scrollTo({
        top,
        behavior: "smooth"
    });
}


/* ============================================================
   40. SAFE URL
   ============================================================ */

/**
 * Validate external URLs.
 *
 * Only HTTP and HTTPS URLs are allowed.
 */
function safeUrl(value) {

    if (!value) {
        return "";
    }


    try {

        const url =
            new URL(
                String(value),
                window.location.href
            );


        if (
            url.protocol !== "http:" &&
            url.protocol !== "https:"
        ) {

            return "";
        }


        return url.href;

    } catch (error) {

        return "";
    }
}


/* ============================================================
   41. HTML ESCAPING
   ============================================================ */

/**
 * Escape user/database-controlled text before inserting
 * into HTML.
 */
function escapeHtml(value) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* ============================================================
   42. NUMBER FORMAT
   ============================================================ */

/**
 * Format numbers nicely.
 */
function formatNumber(value) {

    return Number(
        value || 0
    ).toLocaleString();
}


/* ============================================================
   43. DEBOUNCE
   ============================================================ */

/**
 * Small debounce helper.
 */
function debounce(
    callback,
    delay
) {

    let timeout;


    return (...args) => {

        clearTimeout(timeout);


        timeout =
            setTimeout(
                () =>
                    callback(...args),
                delay
            );
    };
}


/* ============================================================
   44. KEYBOARD TARGET HELPER
   ============================================================ */

/**
 * Determine whether the user is currently typing.
 */
function isTypingTarget(element) {

    if (!element) {
        return false;
    }


    const tag =
        element.tagName?.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );
}


/* ============================================================
   45. INITIAL URL HANDLING
   ============================================================ */

/**
 * Wait until database has loaded before trying to open
 * ?tool=...
 *
 * This is called after database initialization.
 */
const originalInitDatabaseAware =
    loadDatabase;


/**
 * We use a small post-load hook by observing the current
 * database state after initialization.
 *
 * Since loadDatabase() is async and called from init(),
 * this function is also safe to call manually.
 */
async function initializeDeepLink() {

    if (!state.tools.length) {
        return;
    }


    openToolFromUrl();
}


/* ============================================================
   46. FINAL INITIALIZATION HOOK
   ============================================================ */

/**
 * Re-run the deep-link check after the page has loaded.
 *
 * A small timeout allows the JSON rendering pipeline to finish.
 */
window.addEventListener(
    "load",
    () => {

        setTimeout(
            initializeDeepLink,
            0
        );
    }
);


/* ============================================================
   47. GLOBAL OPTIONAL API
   ============================================================ */

/**
 * Expose a small API for future buttons or other scripts.
 *
 * Example:
 *
 * window.CharlieMJDevOps.openTool("docker");
 *
 * This does NOT expose internal state.
 */
window.CharlieMJDevOps = {

    /**
     * Open a documentation modal.
     */
    openTool(id) {

        openToolModal(id);
    },


    /**
     * Search programmatically.
     */
    search(query) {

        state.searchQuery =
            String(query || "").trim();

        state.currentPage = 1;


        if (elements.toolSearch) {

            elements.toolSearch.value =
                state.searchQuery;
        }


        applyFilters();
    },


    /**
     * Select category programmatically.
     */
    selectCategory(category) {

        selectCategory(
            category || "all"
        );
    },


    /**
     * Reset the documentation library.
     */
    reset() {

        resetFilters();
    },


    /**
     * Return currently loaded tool count.
     */
    getToolCount() {

        return state.tools.length;
    }
};


/* ============================================================
   END OF CHARLIE MJ DEVOPS EXPLORER DOCUMENTATION JS
   ============================================================ */