/**
 * ================================================================
 * CHARLIE MJ DEVOPS EXPLORER
 * Documentation Library
 * ================================================================
 *
 * File:
 * pages/devops-documentation/js/devops-documentation.js
 *
 * Shared Database:
 * ../../data/official-documentation.json
 *
 * ================================================================
 *
 * IMPORTANT DATABASE ARCHITECTURE
 * ----------------------------------------------------------------
 *
 * The SAME official-documentation.json file is now shared between:
 *
 *     1. Charlie MJ DevOps Explorer Website
 *     2. Charlie MJ DevOps Explorer Chrome Extension
 *
 * The current JSON structure is:
 *
 * {
 *     "version": 1,
 *     "generatedAt": "...",
 *     "count": 749,
 *     "documentation": [
 *         {
 *             "id": "doc-aws",
 *             "technologyId": "aws",
 *             "technology": "Amazon Web Services",
 *             "title": "Amazon Web Services Documentation",
 *             "url": "https://docs.aws.amazon.com/",
 *             "type": "official-documentation",
 *             "source": "official-website",
 *             "status": "active",
 *             "health": "unknown",
 *             "lastChecked": null,
 *             "notes": "",
 *             "updatedAt": "..."
 *         }
 *     ]
 * }
 *
 * Therefore this website MUST read:
 *
 *     database.documentation
 *
 * instead of:
 *
 *     database.tools
 *
 * This JavaScript converts the documentation records into the
 * internal "tool" format used by the website UI.
 *
 * ================================================================
 *
 * FEATURES
 * ----------------------------------------------------------------
 *
 * ✓ Shared official-documentation.json support
 * ✓ documentation[] database support
 * ✓ Legacy tools[] compatibility
 * ✓ Dynamic technology count
 * ✓ Dynamic categories
 * ✓ Dynamic providers
 * ✓ Dynamic category sidebar
 * ✓ Category counts
 * ✓ Category search
 * ✓ Technology search
 * ✓ Provider filtering
 * ✓ Category filtering
 * ✓ Subcategory filtering
 * ✓ Learning level filtering
 * ✓ Tool type filtering
 * ✓ Favorites
 * ✓ Recently Viewed
 * ✓ Sorting
 * ✓ Pagination
 * ✓ Explore More
 * ✓ Grid/List view
 * ✓ Active filters
 * ✓ Tool details modal
 * ✓ Official documentation links
 * ✓ Official website links
 * ✓ GitHub links when available
 * ✓ Related technologies
 * ✓ Copy technology link
 * ✓ URL deep linking
 * ✓ Mobile category sidebar
 * ✓ LocalStorage persistence
 * ✓ Safe URL handling
 * ✓ Keyboard shortcuts
 * ✓ Dynamic database architecture
 *
 * ================================================================
 */

"use strict";


/* ================================================================
   1. CONFIGURATION
   ================================================================ */

const CONFIG = {

    /**
     * Shared JSON database.
     *
     * IMPORTANT:
     *
     * This path is relative to:
     *
     * pages/devops-documentation/js/
     */
    dataUrl: "../../data/official-documentation.json",


    /**
     * LocalStorage keys.
     */
    storageKeys: {

        favorites:
            "charlieMJDevOpsFavorites",

        recent:
            "charlieMJDevOpsRecent",

        viewMode:
            "charlieMJDevOpsDocumentationView"
    },


    /**
     * Default number of technologies per page.
     */
    defaultItemsPerPage: 24,


    /**
     * Maximum recently viewed technologies.
     */
    maxRecentTools: 12,


    /**
     * Maximum related technologies.
     */
    maxRelatedTools: 6,


    /**
     * Search debounce delay.
     */
    searchDelay: 120
};


/* ================================================================
   2. APPLICATION STATE
   ================================================================ */

const state = {

    /**
     * Normalized technology records.
     *
     * Every record displayed by the website exists here.
     */
    tools: [],


    /**
     * Current filtered results.
     */
    filteredTools: [],


    /**
     * Original database metadata.
     */
    databaseMeta: {

        version: null,

        generatedAt: null,

        declaredCount: 0
    },


    /**
     * Main search query.
     */
    searchQuery: "",


    /**
     * Active filters.
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
     * Sorting.
     */
    sortBy: "name-asc",


    /**
     * Pagination.
     */
    currentPage: 1,

    itemsPerPage:
        CONFIG.defaultItemsPerPage,


    /**
     * Grid or list.
     */
    viewMode: "grid",


    /**
     * Sidebar category search.
     */
    categorySearch: "",


    /**
     * Currently open technology.
     */
    activeToolId: null,


    /**
     * Database loading status.
     */
    isLoading: false
};


/* ================================================================
   3. DOM REFERENCES
   ================================================================ */

const elements = {

    /* ------------------------------------------------------------
       Main search
       ------------------------------------------------------------ */

    toolSearch:
        document.getElementById("toolSearch"),


    /* ------------------------------------------------------------
       Statistics
       ------------------------------------------------------------ */

    totalTools:
        document.getElementById("totalTools"),

    totalCategories:
        document.getElementById("totalCategories"),

    totalProviders:
        document.getElementById("totalProviders"),

    favoriteCount:
        document.getElementById("favoriteCount"),


    /* ------------------------------------------------------------
       Category sidebar
       ------------------------------------------------------------ */

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


    /* ------------------------------------------------------------
       Filters
       ------------------------------------------------------------ */

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


    /* ------------------------------------------------------------
       Category chips
       ------------------------------------------------------------ */

    categoryChips:
        document.getElementById("categoryChips"),


    /* ------------------------------------------------------------
       Results
       ------------------------------------------------------------ */

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


    /* ------------------------------------------------------------
       Explore More
       ------------------------------------------------------------ */

    exploreMoreContainer:
        document.getElementById("exploreMoreContainer"),

    exploreMoreButton:
        document.getElementById("exploreMoreButton"),


    /* ------------------------------------------------------------
       Pagination
       ------------------------------------------------------------ */

    pagination:
        document.getElementById("pagination"),

    paginationInfo:
        document.getElementById("paginationInfo"),


    /* ------------------------------------------------------------
       Empty state
       ------------------------------------------------------------ */

    emptyState:
        document.getElementById("emptyState"),

    resetFiltersButton:
        document.getElementById("resetFiltersButton"),


    /* ------------------------------------------------------------
       View controls
       ------------------------------------------------------------ */

    gridViewButton:
        document.getElementById("gridViewButton"),

    listViewButton:
        document.getElementById("listViewButton"),


    /* ------------------------------------------------------------
       Modal
       ------------------------------------------------------------ */

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


/* ================================================================
   4. APPLICATION START
   ================================================================ */

document.addEventListener(
    "DOMContentLoaded",
    init
);


/**
 * Main initialization.
 */
async function init() {

    /**
     * Restore saved view mode.
     */
    restoreViewMode();


    /**
     * Connect all UI events.
     */
    bindEvents();


    /**
     * Load shared database.
     */
    await loadDatabase();


    /**
     * Check whether URL contains:
     *
     * ?tool=technology-id
     */
    openToolFromUrl();
}


/* ================================================================
   5. DATABASE LOADING
   ================================================================ */

/**
 * Load official-documentation.json.
 *
 * Supported database structures:
 *
 * NEW:
 *
 * {
 *     "documentation": [...]
 * }
 *
 * LEGACY:
 *
 * {
 *     "tools": [...]
 * }
 *
 * DIRECT ARRAY:
 *
 * [...]
 */
async function loadDatabase() {

    state.isLoading = true;


    try {

        /**
         * Fetch shared JSON.
         */
        const response =
            await fetch(
                CONFIG.dataUrl,
                {
                    cache: "no-cache"
                }
            );


        /**
         * HTTP error.
         */
        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        /**
         * Parse JSON.
         */
        const database =
            await response.json();


        /**
         * Save database metadata.
         */
        state.databaseMeta = {

            version:
                database?.version ?? null,

            generatedAt:
                database?.generatedAt ?? null,

            declaredCount:
                Number(
                    database?.count || 0
                )
        };


        /**
         * --------------------------------------------------------
         * NEW SHARED DATABASE
         * --------------------------------------------------------
         *
         * This is the important part.
         *
         * Your new JSON uses:
         *
         * database.documentation
         */
        if (
            database &&
            Array.isArray(
                database.documentation
            )
        ) {

            state.tools =
                normalizeDocumentationRecords(
                    database.documentation
                );


        /**
         * --------------------------------------------------------
         * LEGACY DATABASE
         * --------------------------------------------------------
         */
        } else if (
            database &&
            Array.isArray(
                database.tools
            )
        ) {

            state.tools =
                normalizeLegacyTools(
                    database.tools
                );


        /**
         * --------------------------------------------------------
         * DIRECT ARRAY
         * --------------------------------------------------------
         */
        } else if (
            Array.isArray(database)
        ) {

            state.tools =
                normalizeDocumentationRecords(
                    database
                );


        /**
         * --------------------------------------------------------
         * UNKNOWN FORMAT
         * --------------------------------------------------------
         */
        } else {

            throw new Error(
                "Unsupported documentation database format."
            );
        }


        /**
         * Remove invalid records.
         */
        state.tools =
            state.tools.filter(
                isValidToolRecord
            );


        /**
         * Remove duplicate records.
         *
         * technologyId is preferred as the unique identity.
         */
        state.tools =
            deduplicateTools(
                state.tools
            );


        /**
         * Build the dynamic UI.
         */
        updateStatistics();

        populateFilters();

        renderCategorySidebar();

        renderCategoryChips();

        applyFilters();


        /**
         * Helpful development information.
         */
        console.info(
            "Charlie MJ DevOps Explorer database loaded:",
            {
                records:
                    state.tools.length,

                declaredCount:
                    state.databaseMeta.declaredCount,

                categories:
                    getCategoryCount(),

                providers:
                    getProviderCount(),

                generatedAt:
                    state.databaseMeta.generatedAt
            }
        );


    } catch (error) {

        console.error(
            "Charlie MJ DevOps Explorer database failed:",
            error
        );


        showDatabaseError();


    } finally {

        state.isLoading = false;
    }
}


/* ================================================================
   6. NORMALIZE NEW DOCUMENTATION RECORDS
   ================================================================ */

/**
 * Convert the new documentation[] structure into the
 * internal structure expected by the website.
 *
 * Example source:
 *
 * {
 *     "id": "doc-aws-ec2",
 *     "technologyId": "aws-ec2",
 *     "technology": "Amazon EC2",
 *     "title": "Amazon EC2 Documentation",
 *     "url": "https://docs.aws.amazon.com/ec2/",
 *     "type": "official-documentation",
 *     "source": "official-website",
 *     "status": "active",
 *     "health": "unknown",
 *     "lastChecked": null,
 *     "notes": "",
 *     "updatedAt": "..."
 * }
 *
 * becomes an internal website record:
 *
 * {
 *     id,
 *     technologyId,
 *     name,
 *     title,
 *     documentation,
 *     ...
 * }
 */
function normalizeDocumentationRecords(
    documentation
) {

    return documentation
        .map(record => {

            if (
                !record ||
                typeof record !== "object"
            ) {

                return null;
            }


            /**
             * Stable technology ID.
             */
            const technologyId =
                String(
                    record.technologyId ||
                    record.id ||
                    slugify(
                        record.technology ||
                        record.title ||
                        "technology"
                    )
                );


            /**
             * Human-readable technology name.
             */
            const technology =
                String(
                    record.technology ||
                    record.title ||
                    technologyId
                );


            /**
             * Documentation title.
             */
            const title =
                String(
                    record.title ||
                    `${technology} Documentation`
                );


            /**
             * Official documentation URL.
             */
            const documentationUrl =
                safeUrl(
                    record.url
                );


            /**
             * Return normalized record.
             */
            return {

                /**
                 * Preserve original database ID.
                 */
                id:
                    String(
                        record.id ||
                        `doc-${technologyId}`
                    ),


                /**
                 * Technology identity.
                 */
                technologyId:
                    technologyId,


                /**
                 * Main display name.
                 */
                name:
                    technology,


                technology:
                    technology,


                title:
                    title,


                /**
                 * Documentation URL.
                 */
                documentation:
                    documentationUrl,


                officialDocumentation:
                    documentationUrl,


                /**
                 * Official website.
                 *
                 * The current documentation database only provides
                 * "url", so documentation is used as the primary
                 * official resource.
                 *
                 * If future records provide website/homepage,
                 * those are automatically supported.
                 */
                officialWebsite:
                    safeUrl(
                        record.officialWebsite ||
                        record.website ||
                        record.homepage ||
                        record.officialUrl
                    ),


                /**
                 * GitHub if future database records provide it.
                 */
                github:
                    safeUrl(
                        record.github ||
                        record.githubUrl
                    ),


                /**
                 * Existing database metadata.
                 */
                type:
                    String(
                        record.type ||
                        "official-documentation"
                    ),


                source:
                    String(
                        record.source ||
                        "official-website"
                    ),


                status:
                    String(
                        record.status ||
                        "active"
                    ),


                health:
                    String(
                        record.health ||
                        "unknown"
                    ),


                lastChecked:
                    record.lastChecked ||
                    null,


                notes:
                    String(
                        record.notes ||
                        ""
                    ),


                updatedAt:
                    record.updatedAt ||
                    null,


                /**
                 * Category compatibility.
                 *
                 * The new documentation records do not currently
                 * have a category field.
                 *
                 * Therefore we dynamically infer a useful category
                 * from the technology ID/name.
                 */
                category:
                    inferCategory(
                        record
                    ),


                /**
                 * Subcategory.
                 */
                subcategory:
                    String(
                        record.subcategory ||
                        inferSubcategory(
                            record
                        ) ||
                        ""
                    ),


                /**
                 * Learning level.
                 *
                 * If future database records provide "level",
                 * it will automatically be used.
                 */
                level:
                    String(
                        record.level ||
                        record.difficulty ||
                        ""
                    ),


                /**
                 * Tags.
                 */
                tags:
                    normalizeTags(
                        record.tags ||
                        []
                    ),


                /**
                 * Keep original record available.
                 * Useful for future features.
                 */
                _sourceRecord:
                    record
            };
        })
        .filter(Boolean);
}


/* ================================================================
   7. LEGACY DATABASE NORMALIZER
   ================================================================ */

/**
 * Keep compatibility with the previous tools[] database.
 */
function normalizeLegacyTools(
    tools
) {

    return tools
        .map(tool => {

            if (
                !tool ||
                typeof tool !== "object"
            ) {

                return null;
            }


            const name =
                String(
                    tool.name ||
                    tool.title ||
                    "Unnamed Technology"
                );


            const id =
                String(
                    tool.id ||
                    tool.slug ||
                    slugify(name)
                );


            const documentation =
                safeUrl(
                    tool.documentation ||
                    tool.officialDocumentation
                );


            return {

                ...tool,

                id,

                technologyId:
                    String(
                        tool.technologyId ||
                        id
                    ),

                name,

                technology:
                    String(
                        tool.technology ||
                        name
                    ),

                title:
                    String(
                        tool.title ||
                        `${name} Documentation`
                    ),

                documentation,

                officialDocumentation:
                    documentation,

                officialWebsite:
                    safeUrl(
                        tool.officialWebsite ||
                        tool.website ||
                        tool.homepage
                    ),

                github:
                    safeUrl(
                        tool.github ||
                        tool.githubUrl
                    ),

                category:
                    String(
                        tool.category ||
                        inferCategory(tool)
                    ),

                subcategory:
                    String(
                        tool.subcategory ||
                        ""
                    ),

                level:
                    String(
                        tool.level ||
                        tool.difficulty ||
                        ""
                    ),

                type:
                    String(
                        tool.type ||
                        "technology"
                    ),

                tags:
                    normalizeTags(
                        tool.tags ||
                        []
                    )
            };
        })
        .filter(Boolean);
}


/* ================================================================
   8. CATEGORY INFERENCE
   ================================================================ */

/**
 * The new official-documentation.json currently focuses on
 * official documentation records and does not contain a category
 * property.
 *
 * The website nevertheless has a category-based UI.
 *
 * Therefore we infer categories from technology names/IDs.
 *
 * This keeps the website fully functional without modifying the
 * shared extension database.
 *
 * IMPORTANT:
 *
 * When you later add an explicit "category" field to the JSON,
 * this function automatically gives priority to it.
 */
function inferCategory(record) {

    /**
     * Explicit category always wins.
     */
    if (
        record?.category
    ) {

        return String(
            record.category
        );
    }


    const text =
        [
            record?.technology,
            record?.title,
            record?.technologyId
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


    /**
     * AWS.
     */
    if (
        text.includes("aws") ||
        text.includes("amazon ")
    ) {

        return "Cloud";
    }


    /**
     * Azure.
     */
    if (
        text.includes("azure") ||
        text.includes("microsoft azure")
    ) {

        return "Cloud";
    }


    /**
     * Google Cloud.
     */
    if (
        text.includes("google cloud") ||
        text.includes("gcp") ||
        text.includes("google kubernetes")
    ) {

        return "Cloud";
    }


    /**
     * Kubernetes.
     */
    if (
        text.includes("kubernetes") ||
        text.includes("k8s") ||
        text.includes("eks") ||
        text.includes("aks") ||
        text.includes("gke")
    ) {

        return "Container Orchestration";
    }


    /**
     * Docker / containers.
     */
    if (
        text.includes("docker") ||
        text.includes("podman") ||
        text.includes("container")
    ) {

        return "Containers";
    }


    /**
     * Terraform / IaC.
     */
    if (
        text.includes("terraform") ||
        text.includes("cloudformation") ||
        text.includes("pulumi") ||
        text.includes("infrastructure as code")
    ) {

        return "Infrastructure as Code";
    }


    /**
     * CI/CD.
     */
    if (
        text.includes("jenkins") ||
        text.includes("github actions") ||
        text.includes("gitlab ci") ||
        text.includes("circleci") ||
        text.includes("travis ci") ||
        text.includes("ci/cd")
    ) {

        return "CI/CD";
    }


    /**
     * Git.
     */
    if (
        text === "git" ||
        text.includes(" github ") ||
        text.includes("github")
    ) {

        return "Version Control";
    }


    /**
     * Prometheus.
     */
    if (
        text.includes("prometheus") ||
        text.includes("grafana")
    ) {

        return "Monitoring";
    }


    /**
     * Argo CD / GitOps.
     */
    if (
        text.includes("argo cd") ||
        text.includes("argocd") ||
        text.includes("gitops")
    ) {

        return "GitOps";
    }


    /**
     * Security tools.
     */
    if (
        text.includes("trivy") ||
        text.includes("sonarqube") ||
        text.includes("vault") ||
        text.includes("security")
    ) {

        return "Security";
    }


    /**
     * Ansible / configuration.
     */
    if (
        text.includes("ansible") ||
        text.includes("puppet") ||
        text.includes("chef")
    ) {

        return "Configuration Management";
    }


    /**
     * Networking.
     */
    if (
        text.includes("network") ||
        text.includes("nginx") ||
        text.includes("haproxy") ||
        text.includes("istio") ||
        text.includes("envoy")
    ) {

        return "Networking";
    }


    /**
     * Database technologies.
     */
    if (
        text.includes("database") ||
        text.includes("mysql") ||
        text.includes("postgres") ||
        text.includes("mongodb") ||
        text.includes("redis") ||
        text.includes("dynamodb")
    ) {

        return "Databases";
    }


    /**
     * Operating systems.
     */
    if (
        text.includes("linux") ||
        text.includes("ubuntu") ||
        text.includes("debian") ||
        text.includes("red hat") ||
        text.includes("windows server")
    ) {

        return "Operating Systems";
    }


    /**
     * Generic fallback.
     */
    return "DevOps";
}


/**
 * Infer subcategory where useful.
 */
function inferSubcategory(record) {

    const text =
        [
            record?.technology,
            record?.title,
            record?.technologyId
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();


    if (
        text.includes("kubernetes")
    ) {

        return "Kubernetes";
    }


    if (
        text.includes("ec2")
    ) {

        return "Compute";
    }


    if (
        text.includes("s3")
    ) {

        return "Storage";
    }


    if (
        text.includes("rds")
    ) {

        return "Database";
    }


    if (
        text.includes("vpc") ||
        text.includes("network")
    ) {

        return "Networking";
    }


    if (
        text.includes("lambda")
    ) {

        return "Serverless";
    }


    return "";
}


/* ================================================================
   9. TAG NORMALIZATION
   ================================================================ */

/**
 * Normalize tags regardless of whether JSON contains:
 *
 * ["AWS", "Cloud"]
 *
 * or:
 *
 * "AWS, Cloud"
 */
function normalizeTags(
    tags
) {

    if (Array.isArray(tags)) {

        return tags
            .map(
                tag =>
                    String(tag).trim()
            )
            .filter(Boolean);
    }


    if (
        typeof tags === "string"
    ) {

        return tags
            .split(",")
            .map(
                tag =>
                    tag.trim()
            )
            .filter(Boolean);
    }


    return [];
}


/* ================================================================
   10. VALIDATION
   ================================================================ */

/**
 * Make sure a record has enough information to display.
 */
function isValidToolRecord(
    tool
) {

    return Boolean(
        tool &&
        typeof tool === "object" &&
        getToolName(tool)
    );
}


/**
 * Remove duplicate technologies.
 *
 * Priority:
 *
 * technologyId
 * then id
 * then name
 */
function deduplicateTools(
    tools
) {

    const seen =
        new Set();


    return tools.filter(
        tool => {

            const identity =
                String(
                    tool.technologyId ||
                    tool.id ||
                    getToolName(tool)
                )
                .toLowerCase();


            if (
                seen.has(identity)
            ) {

                return false;
            }


            seen.add(identity);

            return true;
        }
    );
}


/* ================================================================
   11. BASIC DATA HELPERS
   ================================================================ */

function getToolName(tool) {

    return String(
        tool?.name ||
        tool?.technology ||
        tool?.title ||
        "Unnamed Technology"
    );
}


function getCategory(tool) {

    return String(
        tool?.category ||
        "DevOps"
    );
}


function getProvider(tool) {

    /**
     * New documentation records do not currently contain
     * "provider".
     *
     * We derive it from the technology name/category.
     */
    if (
        tool?.provider
    ) {

        return String(
            tool.provider
        );
    }


    const name =
        getToolName(tool)
            .toLowerCase();


    if (
        name.includes("amazon") ||
        name.includes("aws")
    ) {

        return "Amazon Web Services";
    }


    if (
        name.includes("azure") ||
        name.includes("microsoft")
    ) {

        return "Microsoft Azure";
    }


    if (
        name.includes("google cloud") ||
        name.includes("google kubernetes")
    ) {

        return "Google Cloud";
    }


    if (
        name.includes("github")
    ) {

        return "GitHub";
    }


    if (
        name.includes("gitlab")
    ) {

        return "GitLab";
    }


    /**
     * Vendor/community tools.
     */
    return String(
        tool?.source ||
        "Community"
    );
}


function getSubcategory(tool) {

    return String(
        tool?.subcategory ||
        ""
    );
}


function getLevel(tool) {

    return String(
        tool?.level ||
        tool?.difficulty ||
        ""
    );
}


function getType(tool) {

    return String(
        tool?.type ||
        "technology"
    );
}


function getDescription(tool) {

    /**
     * The new documentation database does not currently contain
     * descriptions.
     *
     * We therefore create a useful fallback description from
     * available fields.
     */
    if (
        tool?.description
    ) {

        return String(
            tool.description
        );
    }


    if (
        tool?.notes
    ) {

        return String(
            tool.notes
        );
    }


    return `${getToolName(tool)} official documentation and resources.`;
}


function getToolIcon(tool) {

    if (
        tool?.icon
    ) {

        return String(
            tool.icon
        );
    }


    /**
     * Simple technology-specific visual fallback.
     */
    const text =
        getToolName(tool)
            .toLowerCase();


    if (
        text.includes("aws") ||
        text.includes("amazon")
    ) {

        return "☁";
    }


    if (
        text.includes("azure")
    ) {

        return "☁";
    }


    if (
        text.includes("google")
    ) {

        return "G";
    }


    if (
        text.includes("kubernetes")
    ) {

        return "⎈";
    }


    if (
        text.includes("docker")
    ) {

        return "◈";
    }


    if (
        text.includes("terraform")
    ) {

        return "⌘";
    }


    if (
        text.includes("jenkins")
    ) {

        return "⚙";
    }


    if (
        text.includes("github")
    ) {

        return "◉";
    }


    return "⌘";
}


function getToolTags(tool) {

    return normalizeTags(
        tool?.tags ||
        []
    );
}


function getDocumentationUrl(tool) {

    return safeUrl(
        tool?.documentation ||
        tool?.officialDocumentation ||
        tool?.url
    );
}


function getOfficialWebsite(tool) {

    return safeUrl(
        tool?.officialWebsite ||
        tool?.website ||
        tool?.homepage
    );
}


function getGithubUrl(tool) {

    return safeUrl(
        tool?.github ||
        tool?.githubUrl
    );
}


function getToolId(tool) {

    return String(
        tool?.technologyId ||
        tool?.id ||
        tool?.slug ||
        slugify(
            getToolName(tool)
        )
    );
}


/* ================================================================
   12. STATISTICS
   ================================================================ */

function getCategoryCount() {

    return new Set(
        state.tools
            .map(getCategory)
            .filter(Boolean)
    ).size;
}


function getProviderCount() {

    return new Set(
        state.tools
            .map(getProvider)
            .filter(Boolean)
    ).size;
}


/**
 * Update dashboard statistics.
 *
 * IMPORTANT:
 *
 * We use the ACTUAL number of documentation records:
 *
 *     state.tools.length
 *
 * rather than blindly displaying JSON "count".
 */
function updateStatistics() {

    const toolCount =
        state.tools.length;


    const categoryCount =
        getCategoryCount();


    const providerCount =
        getProviderCount();


    if (elements.totalTools) {

        elements.totalTools.textContent =
            formatNumber(
                toolCount
            );
    }


    if (elements.totalCategories) {

        elements.totalCategories.textContent =
            formatNumber(
                categoryCount
            );
    }


    if (elements.totalProviders) {

        elements.totalProviders.textContent =
            formatNumber(
                providerCount
            );
    }


    if (elements.favoriteCount) {

        elements.favoriteCount.textContent =
            formatNumber(
                getFavorites().length
            );
    }
}


/* ================================================================
   13. FILTER DROPDOWNS
   ================================================================ */

function uniqueValues(
    tools,
    getter
) {

    return [
        ...new Set(
            tools
                .map(getter)
                .map(
                    value =>
                        String(
                            value || ""
                        ).trim()
                )
                .filter(Boolean)
        )
    ].sort(
        (a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity:
                        "base"
                }
            )
    );
}


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


function populateSelect(
    select,
    values,
    firstLabel
) {

    if (!select) {
        return;
    }


    const currentValue =
        select.value ||
        "all";


    select.innerHTML = `
        <option value="all">
            ${escapeHtml(firstLabel)}
        </option>
    `;


    values.forEach(
        value => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                value;


            option.textContent =
                value;


            select.appendChild(
                option
            );
        }
    );


    if (
        [...select.options]
            .some(
                option =>
                    option.value ===
                    currentValue
            )
    ) {

        select.value =
            currentValue;

    } else {

        select.value =
            "all";
    }
}


/* ================================================================
   14. CATEGORY SIDEBAR
   ================================================================ */

/**
 * Generate the sidebar completely from the database.
 *
 * Example:
 *
 * All Categories              749
 * Cloud                       250
 * Containers                   20
 * CI/CD                        30
 *
 * No category is hard-coded.
 */
function renderCategorySidebar() {

    if (
        !elements.categorySidebarList
    ) {

        return;
    }


    const categoryCounts =
        {};


    /**
     * Count every technology.
     */
    state.tools.forEach(
        tool => {

            const category =
                getCategory(tool);


            categoryCounts[category] =
                (
                    categoryCounts[
                        category
                    ] || 0
                ) + 1;
        }
    );


    /**
     * Sort alphabetically.
     */
    const categories =
        Object.entries(
            categoryCounts
        )
        .sort(
            (a, b) =>
                a[0].localeCompare(
                    b[0],
                    undefined,
                    {
                        sensitivity:
                            "base"
                    }
                )
        );


    /**
     * Clear sidebar.
     */
    elements.categorySidebarList.innerHTML =
        "";


    /**
     * All categories button.
     */
    const allButton =
        document.createElement(
            "button"
        );


    allButton.type =
        "button";


    allButton.className =
        "category-sidebar-button";


    allButton.dataset.category =
        "all";


    allButton.innerHTML = `
        <span class="category-sidebar-name">
            All Categories
        </span>

        <span class="category-sidebar-count">
            ${formatNumber(
                state.tools.length
            )}
        </span>
    `;


    elements.categorySidebarList
        .appendChild(
            allButton
        );


    /**
     * Individual categories.
     */
    categories.forEach(
        ([category, count]) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "category-sidebar-button";


            button.dataset.category =
                category;


            button.innerHTML = `
                <span class="category-sidebar-name">
                    ${escapeHtml(
                        category
                    )}
                </span>

                <span class="category-sidebar-count">
                    ${formatNumber(
                        count
                    )}
                </span>
            `;


            elements.categorySidebarList
                .appendChild(
                    button
                );
        }
    );


    /**
     * Sidebar footer count.
     */
    if (
        elements.sidebarCategoryCount
    ) {

        const count =
            categories.length;


        elements.sidebarCategoryCount.textContent =
            `${count} categor${
                count === 1
                    ? "y"
                    : "ies"
            }`;
    }


    updateCategorySidebarState();
}


/**
 * Search inside category sidebar.
 */
function filterCategorySidebar() {

    if (
        !elements.categorySidebarList
    ) {

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


    buttons.forEach(
        button => {

            const category =
                String(
                    button.dataset.category ||
                    ""
                )
                .toLowerCase();


            /**
             * Always show All Categories.
             */
            if (
                category === "all"
            ) {

                button.hidden =
                    false;

                return;
            }


            button.hidden =
                Boolean(
                    query &&
                    !category.includes(
                        query
                    )
                );
        }
    );
}


/**
 * Highlight active sidebar category.
 */
function updateCategorySidebarState() {

    if (
        !elements.categorySidebarList
    ) {

        return;
    }


    const buttons =
        elements.categorySidebarList
            .querySelectorAll(
                ".category-sidebar-button"
            );


    buttons.forEach(
        button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                    state.filters.category
            );
        }
    );
}


/* ================================================================
   15. QUICK CATEGORY CHIPS
   ================================================================ */

function renderCategoryChips() {

    if (
        !elements.categoryChips
    ) {

        return;
    }


    const categories =
        uniqueValues(
            state.tools,
            getCategory
        );


    elements.categoryChips.innerHTML =
        "";


    /**
     * All.
     */
    elements.categoryChips.appendChild(
        createCategoryChip(
            "All",
            "all"
        )
    );


    /**
     * Categories.
     */
    categories.forEach(
        category => {

            elements.categoryChips.appendChild(
                createCategoryChip(
                    category,
                    category
                )
            );
        }
    );


    updateCategoryChipState();
}


function createCategoryChip(
    label,
    value
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.className =
        "category-chip";


    button.dataset.category =
        value;


    button.textContent =
        label;


    return button;
}


function updateCategoryChipState() {

    if (
        !elements.categoryChips
    ) {

        return;
    }


    const chips =
        elements.categoryChips
            .querySelectorAll(
                ".category-chip"
            );


    chips.forEach(
        chip => {

            chip.classList.toggle(
                "active",
                chip.dataset.category ===
                    state.filters.category
            );
        }
    );
}


/* ================================================================
   16. SEARCH MATCHING
   ================================================================ */

function toolMatchesSearch(
    tool,
    query
) {

    if (!query) {
        return true;
    }


    const searchableText = [

        getToolName(tool),

        tool?.title || "",

        getDescription(tool),

        getProvider(tool),

        getCategory(tool),

        getSubcategory(tool),

        getLevel(tool),

        getType(tool),

        tool?.technologyId || "",

        tool?.source || "",

        tool?.status || "",

        tool?.health || "",

        ...getToolTags(tool)

    ]
        .join(" ")
        .toLowerCase();


    return searchableText.includes(
        query.toLowerCase()
    );
}


/* ================================================================
   17. APPLY ALL FILTERS
   ================================================================ */

function applyFilters() {

    let results =
        [...state.tools];


    /**
     * Search.
     */
    results =
        results.filter(
            tool =>
                toolMatchesSearch(
                    tool,
                    state.searchQuery
                )
        );


    /**
     * Provider.
     */
    if (
        state.filters.provider !==
        "all"
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
        state.filters.category !==
        "all"
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
        state.filters.subcategory !==
        "all"
    ) {

        results =
            results.filter(
                tool =>
                    getSubcategory(tool) ===
                    state.filters.subcategory
            );
    }


    /**
     * Learning level.
     */
    if (
        state.filters.level !==
        "all"
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
        state.filters.type !==
        "all"
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
        state.filters.favorite ===
        "favorites"
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
        state.filters.favorite ===
        "recent"
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
     * Sort.
     */
    results =
        sortTools(results);


    /**
     * Save results.
     */
    state.filteredTools =
        results;


    /**
     * Correct invalid page.
     */
    const totalPages =
        getTotalPages();


    if (
        totalPages > 0 &&
        state.currentPage >
            totalPages
    ) {

        state.currentPage =
            totalPages;
    }


    if (
        totalPages === 0
    ) {

        state.currentPage =
            1;
    }


    /**
     * Render UI.
     */
    renderTools();

    renderPagination();

    renderActiveFilters();

    updateCategoryChipState();

    updateCategorySidebarState();

    updateExploreMore();
}


/* ================================================================
   18. SORTING
   ================================================================ */

function sortTools(
    tools
) {

    const sorted =
        [...tools];


    sorted.sort(
        (a, b) => {

            const nameA =
                getToolName(a)
                    .toLowerCase();


            const nameB =
                getToolName(b)
                    .toLowerCase();


            switch (
                state.sortBy
            ) {

                case "name-desc":

                    return nameB.localeCompare(
                        nameA
                    );


                case "category":

                    return getCategory(a)
                        .localeCompare(
                            getCategory(b)
                        );


                case "provider":

                    return getProvider(a)
                        .localeCompare(
                            getProvider(b)
                        );


                case "recent":

                    return compareRecent(
                        a,
                        b
                    );


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
        }
    );


    return sorted;
}


function compareRecent(
    a,
    b
) {

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


function compareDates(
    a,
    b
) {

    return (
        getToolDate(a).getTime() -
        getToolDate(b).getTime()
    );
}


function getToolDate(
    tool
) {

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


/* ================================================================
   19. RENDER TECHNOLOGY CARDS
   ================================================================ */

function renderTools() {

    if (
        !elements.toolGrid
    ) {

        return;
    }


    const total =
        state.filteredTools.length;


    /**
     * Result count.
     */
    if (
        elements.resultCount
    ) {

        elements.resultCount.textContent =
            `${formatNumber(
                total
            )} ${
                total === 1
                    ? "technology"
                    : "technologies"
            }`;
    }


    /**
     * Empty state.
     */
    if (
        total === 0
    ) {

        elements.toolGrid.innerHTML =
            "";


        showEmptyState();


        return;
    }


    hideEmptyState();


    /**
     * Current page.
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
            .map(
                createToolCard
            )
            .join("");


    /**
     * View mode.
     */
    elements.toolGrid.classList.toggle(
        "list-view",
        state.viewMode ===
            "list"
    );


    elements.toolGrid.classList.toggle(
        "grid-view",
        state.viewMode ===
            "grid"
    );


    updateFavoriteButtons();
}


/* ================================================================
   20. TECHNOLOGY CARD
   ================================================================ */

function createToolCard(
    tool
) {

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


    const favorite =
        isToolFavorite(id);


    const recent =
        getRecentTools()
            .includes(id);


    const visibleTags =
        tags.slice(0, 4);


    return `
        <article
            class="tool-card"
            data-tool-id="${escapeHtml(
                id
            )}"
        >

            <div class="tool-card-header">

                <div class="tool-icon">
                    ${escapeHtml(
                        icon
                    )}
                </div>

                <div class="tool-card-heading">

                    <span class="tool-category">
                        ${escapeHtml(
                            category
                        )}
                    </span>

                    <h3 class="tool-name">
                        ${highlightSearch(
                            escapeHtml(
                                name
                            )
                        )}
                    </h3>

                </div>


                <button
                    type="button"
                    class="favorite-button ${
                        favorite
                            ? "active"
                            : ""
                    }"
                    data-favorite-tool="${escapeHtml(
                        id
                    )}"
                    aria-label="${
                        favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }"
                    title="${
                        favorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                    }"
                >
                    ${
                        favorite
                            ? "★"
                            : "☆"
                    }
                </button>

            </div>


            ${
                recent
                    ? `
                        <span class="recent-badge">
                            Recently Viewed
                        </span>
                    `
                    : ""
            }


            <p class="tool-description">
                ${highlightSearch(
                    escapeHtml(
                        description
                    )
                )}
            </p>


            <div class="tool-card-meta">

                <span class="tool-provider">
                    ${escapeHtml(
                        provider
                    )}
                </span>


                ${
                    getLevel(tool)
                        ? `
                            <span>
                                ${escapeHtml(
                                    getLevel(
                                        tool
                                    )
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
                                            ${escapeHtml(
                                                tag
                                            )}
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
                    data-open-tool="${escapeHtml(
                        id
                    )}"
                >
                    View Documentation →
                </button>


                <button
                    type="button"
                    class="copy-link-button"
                    data-copy-tool="${escapeHtml(
                        id
                    )}"
                    title="Copy technology link"
                >
                    Copy
                </button>

            </div>

        </article>
    `;
}


/* ================================================================
   21. SEARCH HIGHLIGHT
   ================================================================ */

function highlightSearch(
    value
) {

    if (
        !state.searchQuery ||
        !value
    ) {

        return value;
    }


    const query =
        escapeRegExp(
            state.searchQuery
                .trim()
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


function escapeRegExp(
    value
) {

    return value.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
    );
}


/* ================================================================
   22. FAVORITES
   ================================================================ */

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


        return Array.isArray(
            parsed
        )
            ? parsed.map(String)
            : [];

    } catch (error) {

        console.warn(
            "Unable to read favorites:",
            error
        );


        return [];
    }
}


function saveFavorites(
    favorites
) {

    try {

        localStorage.setItem(
            CONFIG.storageKeys.favorites,
            JSON.stringify(
                favorites
            )
        );

    } catch (error) {

        console.warn(
            "Unable to save favorites:",
            error
        );
    }
}


function isToolFavorite(
    id
) {

    return getFavorites()
        .includes(
            String(id)
        );
}


function toggleFavorite(
    id
) {

    const toolId =
        String(id);


    let favorites =
        getFavorites();


    if (
        favorites.includes(
            toolId
        )
    ) {

        favorites =
            favorites.filter(
                item =>
                    item !==
                    toolId
            );

    } else {

        favorites.push(
            toolId
        );
    }


    saveFavorites(
        favorites
    );


    updateStatistics();


    /**
     * If Favorites filter is active,
     * refresh complete result set.
     */
    if (
        state.filters.favorite ===
        "favorites"
    ) {

        state.currentPage =
            1;

        applyFilters();

    } else {

        updateFavoriteButtons();
    }
}


function updateFavoriteButtons() {

    if (
        !elements.toolGrid
    ) {

        return;
    }


    const buttons =
        elements.toolGrid
            .querySelectorAll(
                "[data-favorite-tool]"
            );


    buttons.forEach(
        button => {

            const id =
                String(
                    button.dataset
                        .favoriteTool
                );


            const active =
                isToolFavorite(id);


            button.classList.toggle(
                "active",
                active
            );


            button.textContent =
                active
                    ? "★"
                    : "☆";


            button.setAttribute(
                "aria-label",
                active
                    ? "Remove from favorites"
                    : "Add to favorites"
            );
        }
    );
}


/* ================================================================
   23. RECENTLY VIEWED
   ================================================================ */

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


        return Array.isArray(
            parsed
        )
            ? parsed.map(String)
            : [];

    } catch (error) {

        console.warn(
            "Unable to read recently viewed:",
            error
        );


        return [];
    }
}


function saveRecentTool(
    id
) {

    const toolId =
        String(id);


    let recent =
        getRecentTools();


    /**
     * Remove duplicate.
     */
    recent =
        recent.filter(
            item =>
                item !==
                toolId
        );


    /**
     * Newest first.
     */
    recent.unshift(
        toolId
    );


    /**
     * Limit history.
     */
    recent =
        recent.slice(
            0,
            CONFIG.maxRecentTools
        );


    try {

        localStorage.setItem(
            CONFIG.storageKeys.recent,
            JSON.stringify(
                recent
            )
        );

    } catch (error) {

        console.warn(
            "Unable to save recently viewed:",
            error
        );
    }
}


/* ================================================================
   24. TOOL MODAL
   ================================================================ */

function openToolModal(
    id
) {

    const tool =
        findToolById(id);


    if (!tool) {

        console.warn(
            "Technology not found:",
            id
        );


        return;
    }


    state.activeToolId =
        getToolId(tool);


    /**
     * Save recent history.
     */
    saveRecentTool(
        getToolId(tool)
    );


    /**
     * Icon.
     */
    if (
        elements.modalToolIcon
    ) {

        elements.modalToolIcon.textContent =
            getToolIcon(tool);
    }


    /**
     * Category.
     */
    if (
        elements.modalToolCategory
    ) {

        elements.modalToolCategory.textContent =
            getCategory(tool);
    }


    /**
     * Name.
     */
    if (
        elements.modalToolName
    ) {

        elements.modalToolName.textContent =
            getToolName(tool);
    }


    /**
     * Provider.
     */
    if (
        elements.modalToolProvider
    ) {

        elements.modalToolProvider.textContent =
            getProvider(tool);
    }


    /**
     * Description.
     */
    if (
        elements.modalToolDescription
    ) {

        elements.modalToolDescription.textContent =
            getDescription(tool);
    }


    renderModalMeta(
        tool
    );


    renderModalLinks(
        tool
    );


    renderModalTags(
        tool
    );


    renderRelatedTools(
        tool
    );


    /**
     * Main Explore More button.
     */
    if (
        elements.modalExploreMore
    ) {

        const documentation =
            getDocumentationUrl(
                tool
            );


        if (
            documentation
        ) {

            elements.modalExploreMore.href =
                documentation;


            elements.modalExploreMore.target =
                "_blank";


            elements.modalExploreMore.rel =
                "noopener noreferrer";


            elements.modalExploreMore.hidden =
                false;

        } else {

            elements.modalExploreMore.hidden =
                true;
        }
    }


    /**
     * Open modal.
     */
    if (
        elements.toolModal
    ) {

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
     * Update browser URL.
     *
     * This creates shareable technology links.
     */
    updateToolUrl(
        getToolId(tool)
    );


    /**
     * Re-render cards so Recently Viewed appears.
     */
    renderTools();
}


/**
 * Close modal.
 */
function closeToolModal() {

    if (
        !elements.toolModal
    ) {

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


    state.activeToolId =
        null;


    /**
     * Remove tool query from URL.
     */
    removeToolUrl();
}


/**
 * Find technology.
 */
function findToolById(
    id
) {

    const target =
        String(id);


    return state.tools.find(
        tool =>
            getToolId(tool) ===
            target
    );
}


/* ================================================================
   25. MODAL METADATA
   ================================================================ */

function renderModalMeta(
    tool
) {

    if (
        !elements.modalToolMeta
    ) {

        return;
    }


    const metadata = [];


    if (
        getSubcategory(tool)
    ) {

        metadata.push([
            "Subcategory",
            getSubcategory(tool)
        ]);
    }


    if (
        getLevel(tool)
    ) {

        metadata.push([
            "Level",
            getLevel(tool)
        ]);
    }


    if (
        getType(tool)
    ) {

        metadata.push([
            "Type",
            getType(tool)
        ]);
    }


    if (
        tool?.status
    ) {

        metadata.push([
            "Status",
            String(
                tool.status
            )
        ]);
    }


    if (
        tool?.health
    ) {

        metadata.push([
            "Health",
            String(
                tool.health
            )
        ]);
    }


    if (
        tool?.updatedAt
    ) {

        metadata.push([
            "Updated",
            formatDate(
                tool.updatedAt
            )
        ]);
    }


    elements.modalToolMeta.innerHTML =
        metadata
            .map(
                ([label, value]) => `
                    <div class="modal-meta-item">

                        <span class="modal-meta-label">
                            ${escapeHtml(
                                label
                            )}
                        </span>

                        <strong>
                            ${escapeHtml(
                                value
                            )}
                        </strong>

                    </div>
                `
            )
            .join("");
}


/* ================================================================
   26. MODAL RESOURCE LINKS
   ================================================================ */

function renderModalLinks(
    tool
) {

    if (
        !elements.modalToolLinks
    ) {

        return;
    }


    const links = [];


    const website =
        getOfficialWebsite(
            tool
        );


    const documentation =
        getDocumentationUrl(
            tool
        );


    const github =
        getGithubUrl(
            tool
        );


    if (
        website
    ) {

        links.push({
            label:
                "Official Website",

            url:
                website
        });
    }


    if (
        documentation
    ) {

        links.push({
            label:
                "Official Documentation",

            url:
                documentation
        });
    }


    if (
        github
    ) {

        links.push({
            label:
                "GitHub",

            url:
                github
        });
    }


    /**
     * The current shared JSON primarily contains documentation
     * URLs, so Official Documentation will normally be the
     * available resource.
     */
    if (
        !links.length
    ) {

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
                        href="${escapeHtml(
                            link.url
                        )}"
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


/* ================================================================
   27. MODAL TAGS
   ================================================================ */

function renderModalTags(
    tool
) {

    if (
        !elements.modalToolTags
    ) {

        return;
    }


    const tags =
        getToolTags(tool);


    elements.modalToolTags.innerHTML =
        tags
            .map(
                tag => `
                    <span class="tool-tag">
                        ${escapeHtml(
                            tag
                        )}
                    </span>
                `
            )
            .join("");
}


/* ================================================================
   28. RELATED TECHNOLOGIES
   ================================================================ */

function renderRelatedTools(
    tool
) {

    if (
        !elements.modalRelatedTools
    ) {

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
            .map(
                tag =>
                    tag.toLowerCase()
            );


    const related =
        state.tools
            .filter(
                candidate =>
                    getToolId(candidate) !==
                    currentId
            )
            .map(
                candidate => {

                    let score =
                        0;


                    /**
                     * Same category.
                     */
                    if (
                        getCategory(
                            candidate
                        ) ===
                        category
                    ) {

                        score += 5;
                    }


                    /**
                     * Same provider.
                     */
                    if (
                        getProvider(
                            candidate
                        ) ===
                        provider
                    ) {

                        score += 3;
                    }


                    /**
                     * Shared tags.
                     */
                    const candidateTags =
                        getToolTags(
                            candidate
                        )
                        .map(
                            tag =>
                                tag.toLowerCase()
                        );


                    candidateTags.forEach(
                        tag => {

                            if (
                                currentTags
                                    .includes(
                                        tag
                                    )
                            ) {

                                score += 1;
                            }
                        }
                    );


                    return {
                        tool:
                            candidate,

                        score:
                            score
                    };
                }
            )
            .filter(
                item =>
                    item.score > 0
            )
            .sort(
                (a, b) =>
                    b.score -
                    a.score
            )
            .slice(
                0,
                CONFIG.maxRelatedTools
            );


    if (
        !related.length
    ) {

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
                ({
                    tool:
                        relatedTool
                }) => `
                    <button
                        type="button"
                        class="related-tool"
                        data-open-tool="${escapeHtml(
                            getToolId(
                                relatedTool
                            )
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


/* ================================================================
   29. PAGINATION
   ================================================================ */

function getTotalPages() {

    if (
        state.filteredTools.length ===
        0
    ) {

        return 0;
    }


    return Math.ceil(
        state.filteredTools.length /
        state.itemsPerPage
    );
}


function renderPagination() {

    if (
        !elements.pagination
    ) {

        return;
    }


    const total =
        state.filteredTools.length;


    const totalPages =
        getTotalPages();


    /**
     * One page or no results.
     */
    if (
        total === 0 ||
        totalPages <= 1
    ) {

        elements.pagination.innerHTML =
            "";


        if (
            elements.paginationInfo
        ) {

            elements.paginationInfo.textContent =
                total === 0
                    ? "No results"
                    : "Page 1 of 1";
        }


        return;
    }


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
    )
    .forEach(
        page => {

            if (
                page === "..."
            ) {

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
                            page ===
                            state.currentPage
                                ? "active"
                                : ""
                        }
                    "
                    data-page="${page}"
                    ${
                        page ===
                        state.currentPage
                            ? 'aria-current="page"'
                            : ""
                    }
                >
                    ${page}
                </button>
            `);
        }
    );


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
     * Pagination information.
     */
    if (
        elements.paginationInfo
    ) {

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
 * Generate compact pagination.
 */
function getPaginationPages(
    totalPages,
    currentPage
) {

    if (
        totalPages <= 7
    ) {

        return Array.from(
            {
                length:
                    totalPages
            },
            (_, index) =>
                index + 1
        );
    }


    const pages = [];


    pages.push(1);


    if (
        currentPage > 4
    ) {

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

        pages.push(
            page
        );
    }


    if (
        currentPage <
        totalPages - 3
    ) {

        pages.push("...");
    }


    pages.push(
        totalPages
    );


    return pages;
}


function goToPage(
    page
) {

    const totalPages =
        getTotalPages();


    if (
        totalPages === 0
    ) {

        state.currentPage =
            1;


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

    updateExploreMore();

    scrollToResults();
}


/* ================================================================
   30. EXPLORE MORE
   ================================================================ */

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


    if (
        hasMore
    ) {

        elements.exploreMoreButton.textContent =
            `Explore More · Page ${
                state.currentPage + 1
            }`;
    }
}


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


/* ================================================================
   31. ACTIVE FILTERS
   ================================================================ */

function renderActiveFilters() {

    if (
        !elements.activeFilters
    ) {

        return;
    }


    const active = [];


    /**
     * Search.
     */
    if (
        state.searchQuery
    ) {

        active.push({

            key:
                "search",

            label:
                `Search: ${state.searchQuery}`
        });
    }


    /**
     * Filters.
     */
    const definitions = [

        {
            key:
                "provider",

            label:
                "Provider"
        },

        {
            key:
                "category",

            label:
                "Category"
        },

        {
            key:
                "subcategory",

            label:
                "Subcategory"
        },

        {
            key:
                "level",

            label:
                "Level"
        },

        {
            key:
                "type",

            label:
                "Type"
        },

        {
            key:
                "favorite",

            label:
                "View"
        }
    ];


    definitions.forEach(
        ({
            key,
            label
        }) => {

            const value =
                state.filters[
                    key
                ];


            if (
                value &&
                value !== "all"
            ) {

                let display =
                    value;


                if (
                    key ===
                    "favorite"
                ) {

                    if (
                        value ===
                        "favorites"
                    ) {

                        display =
                            "Favorites";

                    } else if (
                        value ===
                        "recent"
                    ) {

                        display =
                            "Recently Viewed";
                    }
                }


                active.push({

                    key,

                    label:
                        `${label}: ${display}`
                });
            }
        }
    );


    if (
        !active.length
    ) {

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


function removeFilter(
    key
) {

    if (
        key ===
        "search"
    ) {

        state.searchQuery =
            "";


        if (
            elements.toolSearch
        ) {

            elements.toolSearch.value =
                "";
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


    state.currentPage =
        1;


    applyFilters();
}


/* ================================================================
   32. EMPTY STATE
   ================================================================ */

function showEmptyState() {

    if (
        !elements.emptyState
    ) {

        return;
    }


    elements.emptyState.hidden =
        false;
}


function hideEmptyState() {

    if (
        !elements.emptyState
    ) {

        return;
    }


    elements.emptyState.hidden =
        true;
}


/* ================================================================
   33. RESET
   ================================================================ */

function resetFilters() {

    state.searchQuery =
        "";


    state.filters = {

        provider:
            "all",

        category:
            "all",

        subcategory:
            "all",

        level:
            "all",

        type:
            "all",

        favorite:
            "all"
    };


    state.currentPage =
        1;


    /**
     * Reset search.
     */
    if (
        elements.toolSearch
    ) {

        elements.toolSearch.value =
            "";
    }


    /**
     * Reset category search.
     */
    state.categorySearch =
        "";


    if (
        elements.categorySearch
    ) {

        elements.categorySearch.value =
            "";
    }


    /**
     * Reset filter controls.
     */
    syncFilterControls();


    /**
     * Refresh sidebar.
     */
    filterCategorySidebar();


    applyFilters();
}


function syncFilterControls() {

    if (
        elements.providerFilter
    ) {

        elements.providerFilter.value =
            state.filters.provider;
    }


    if (
        elements.categoryFilter
    ) {

        elements.categoryFilter.value =
            state.filters.category;
    }


    if (
        elements.subcategoryFilter
    ) {

        elements.subcategoryFilter.value =
            state.filters.subcategory;
    }


    if (
        elements.levelFilter
    ) {

        elements.levelFilter.value =
            state.filters.level;
    }


    if (
        elements.typeFilter
    ) {

        elements.typeFilter.value =
            state.filters.type;
    }


    if (
        elements.favoriteFilter
    ) {

        elements.favoriteFilter.value =
            state.filters.favorite;
    }
}


/* ================================================================
   34. VIEW MODE
   ================================================================ */

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
            "Unable to restore view mode:",
            error
        );
    }


    applyViewMode();
}


function saveViewMode() {

    try {

        localStorage.setItem(
            CONFIG.storageKeys.viewMode,
            state.viewMode
        );

    } catch (error) {

        console.warn(
            "Unable to save view mode:",
            error
        );
    }
}


function applyViewMode() {

    if (
        !elements.toolGrid
    ) {

        return;
    }


    elements.toolGrid.classList.toggle(
        "list-view",
        state.viewMode ===
            "list"
    );


    elements.toolGrid.classList.toggle(
        "grid-view",
        state.viewMode ===
            "grid"
    );


    if (
        elements.gridViewButton
    ) {

        elements.gridViewButton.classList.toggle(
            "active",
            state.viewMode ===
                "grid"
        );


        elements.gridViewButton.setAttribute(
            "aria-pressed",
            state.viewMode ===
                "grid"
                    ? "true"
                    : "false"
        );
    }


    if (
        elements.listViewButton
    ) {

        elements.listViewButton.classList.toggle(
            "active",
            state.viewMode ===
                "list"
        );


        elements.listViewButton.setAttribute(
            "aria-pressed",
            state.viewMode ===
                "list"
                    ? "true"
                    : "false"
        );
    }
}


function setViewMode(
    mode
) {

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


/* ================================================================
   35. MOBILE SIDEBAR
   ================================================================ */

function openCategorySidebar() {

    if (
        !elements.categorySidebar
    ) {

        return;
    }


    elements.categorySidebar.classList.add(
        "open"
    );


    if (
        elements.categorySidebarOverlay
    ) {

        elements.categorySidebarOverlay.classList.add(
            "open"
        );
    }


    document.body.classList.add(
        "sidebar-open"
    );
}


function closeCategorySidebar() {

    if (
        elements.categorySidebar
    ) {

        elements.categorySidebar.classList.remove(
            "open"
        );
    }


    if (
        elements.categorySidebarOverlay
    ) {

        elements.categorySidebarOverlay.classList.remove(
            "open"
        );
    }


    document.body.classList.remove(
        "sidebar-open"
    );
}


/* ================================================================
   36. CATEGORY SELECTION
   ================================================================ */

function selectCategory(
    category
) {

    state.filters.category =
        category ||
        "all";


    if (
        elements.categoryFilter
    ) {

        elements.categoryFilter.value =
            state.filters.category;
    }


    state.currentPage =
        1;


    updateCategorySidebarState();

    updateCategoryChipState();

    applyFilters();


    closeCategorySidebar();
}


/* ================================================================
   37. EVENT BINDING
   ================================================================ */

function bindEvents() {

    /* ------------------------------------------------------------
       Main search
       ------------------------------------------------------------ */

    if (
        elements.toolSearch
    ) {

        elements.toolSearch.addEventListener(
            "input",
            debounce(
                () => {

                    state.searchQuery =
                        elements.toolSearch
                            .value
                            .trim();


                    state.currentPage =
                        1;


                    applyFilters();

                },
                CONFIG.searchDelay
            )
        );
    }


    /* ------------------------------------------------------------
       Provider
       ------------------------------------------------------------ */

    if (
        elements.providerFilter
    ) {

        elements.providerFilter.addEventListener(
            "change",
            () => {

                state.filters.provider =
                    elements.providerFilter
                        .value;


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Category
       ------------------------------------------------------------ */

    if (
        elements.categoryFilter
    ) {

        elements.categoryFilter.addEventListener(
            "change",
            () => {

                state.filters.category =
                    elements.categoryFilter
                        .value;


                state.currentPage =
                    1;


                updateCategorySidebarState();

                updateCategoryChipState();

                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Subcategory
       ------------------------------------------------------------ */

    if (
        elements.subcategoryFilter
    ) {

        elements.subcategoryFilter.addEventListener(
            "change",
            () => {

                state.filters.subcategory =
                    elements.subcategoryFilter
                        .value;


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Learning level
       ------------------------------------------------------------ */

    if (
        elements.levelFilter
    ) {

        elements.levelFilter.addEventListener(
            "change",
            () => {

                state.filters.level =
                    elements.levelFilter
                        .value;


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Type
       ------------------------------------------------------------ */

    if (
        elements.typeFilter
    ) {

        elements.typeFilter.addEventListener(
            "change",
            () => {

                state.filters.type =
                    elements.typeFilter
                        .value;


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Favorites / recent
       ------------------------------------------------------------ */

    if (
        elements.favoriteFilter
    ) {

        elements.favoriteFilter.addEventListener(
            "change",
            () => {

                state.filters.favorite =
                    elements.favoriteFilter
                        .value;


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Category sidebar search
       ------------------------------------------------------------ */

    if (
        elements.categorySearch
    ) {

        elements.categorySearch.addEventListener(
            "input",
            debounce(
                () => {

                    state.categorySearch =
                        elements.categorySearch
                            .value;


                    filterCategorySidebar();

                },
                CONFIG.searchDelay
            )
        );
    }


    /* ------------------------------------------------------------
       Category sidebar
       ------------------------------------------------------------ */

    if (
        elements.categorySidebarList
    ) {

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


    /* ------------------------------------------------------------
       Quick category chips
       ------------------------------------------------------------ */

    if (
        elements.categoryChips
    ) {

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


    /* ------------------------------------------------------------
       Sort
       ------------------------------------------------------------ */

    if (
        elements.sortSelect
    ) {

        elements.sortSelect.addEventListener(
            "change",
            () => {

                state.sortBy =
                    elements.sortSelect
                        .value;


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Items per page
       ------------------------------------------------------------ */

    if (
        elements.itemsPerPage
    ) {

        elements.itemsPerPage.addEventListener(
            "change",
            () => {

                const value =
                    Number(
                        elements.itemsPerPage
                            .value
                    );


                if (
                    Number.isFinite(
                        value
                    ) &&
                    value > 0
                ) {

                    state.itemsPerPage =
                        value;

                } else {

                    state.itemsPerPage =
                        CONFIG.defaultItemsPerPage;
                }


                state.currentPage =
                    1;


                applyFilters();
            }
        );
    }


    /* ------------------------------------------------------------
       Reset
       ------------------------------------------------------------ */

    if (
        elements.resetFiltersButton
    ) {

        elements.resetFiltersButton
            .addEventListener(
                "click",
                resetFilters
            );
    }


    /* ------------------------------------------------------------
       Grid
       ------------------------------------------------------------ */

    if (
        elements.gridViewButton
    ) {

        elements.gridViewButton.addEventListener(
            "click",
            () =>
                setViewMode(
                    "grid"
                )
        );
    }


    /* ------------------------------------------------------------
       List
       ------------------------------------------------------------ */

    if (
        elements.listViewButton
    ) {

        elements.listViewButton.addEventListener(
            "click",
            () =>
                setViewMode(
                    "list"
                )
        );
    }


    /* ------------------------------------------------------------
       Tool cards
       ------------------------------------------------------------ */

    if (
        elements.toolGrid
    ) {

        elements.toolGrid.addEventListener(
            "click",
            event => {

                /**
                 * Favorite.
                 */
                const favoriteButton =
                    event.target.closest(
                        "[data-favorite-tool]"
                    );


                if (
                    favoriteButton
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    toggleFavorite(
                        favoriteButton
                            .dataset
                            .favoriteTool
                    );


                    return;
                }


                /**
                 * Copy.
                 */
                const copyButton =
                    event.target.closest(
                        "[data-copy-tool]"
                    );


                if (
                    copyButton
                ) {

                    event.preventDefault();

                    event.stopPropagation();


                    copyToolLink(
                        copyButton
                            .dataset
                            .copyTool,
                        copyButton
                    );


                    return;
                }


                /**
                 * Open documentation.
                 */
                const openButton =
                    event.target.closest(
                        "[data-open-tool]"
                    );


                if (
                    openButton
                ) {

                    openToolModal(
                        openButton
                            .dataset
                            .openTool
                    );


                    return;
                }


                /**
                 * Card itself.
                 */
                const card =
                    event.target.closest(
                        ".tool-card"
                    );


                if (
                    card
                ) {

                    openToolModal(
                        card.dataset
                            .toolId
                    );
                }
            }
        );
    }


    /* ------------------------------------------------------------
       Pagination
       ------------------------------------------------------------ */

    if (
        elements.pagination
    ) {

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


                if (
                    button.disabled
                ) {

                    return;
                }


                const page =
                    Number(
                        button.dataset.page
                    );


                if (
                    Number.isFinite(
                        page
                    )
                ) {

                    goToPage(
                        page
                    );
                }
            }
        );
    }


    /* ------------------------------------------------------------
       Explore More
       ------------------------------------------------------------ */

    if (
        elements.exploreMoreButton
    ) {

        elements.exploreMoreButton
            .addEventListener(
                "click",
                exploreMore
            );
    }


    /* ------------------------------------------------------------
       Active filters
       ------------------------------------------------------------ */

    if (
        elements.activeFilters
    ) {

        elements.activeFilters
            .addEventListener(
                "click",
                event => {

                    const remove =
                        event.target.closest(
                            "[data-remove-filter]"
                        );


                    if (
                        remove
                    ) {

                        removeFilter(
                            remove.dataset
                                .removeFilter
                        );


                        return;
                    }


                    const clear =
                        event.target.closest(
                            "[data-clear-filters]"
                        );


                    if (
                        clear
                    ) {

                        resetFilters();
                    }
                }
            );
    }


    /* ------------------------------------------------------------
       Mobile sidebar
       ------------------------------------------------------------ */

    if (
        elements.categorySidebarToggle
    ) {

        elements.categorySidebarToggle
            .addEventListener(
                "click",
                openCategorySidebar
            );
    }


    if (
        elements.categorySidebarClose
    ) {

        elements.categorySidebarClose
            .addEventListener(
                "click",
                closeCategorySidebar
            );
    }


    if (
        elements.categorySidebarOverlay
    ) {

        elements.categorySidebarOverlay
            .addEventListener(
                "click",
                closeCategorySidebar
            );
    }


    /* ------------------------------------------------------------
       Modal
       ------------------------------------------------------------ */

    if (
        elements.closeModal
    ) {

        elements.closeModal.addEventListener(
            "click",
            closeToolModal
        );
    }


    if (
        elements.toolModal
    ) {

        elements.toolModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    elements.toolModal
                ) {

                    closeToolModal();
                }
            }
        );


        /**
         * Related technology buttons.
         */
        elements.toolModal.addEventListener(
            "click",
            event => {

                const related =
                    event.target.closest(
                        "[data-open-tool]"
                    );


                if (
                    !related
                ) {

                    return;
                }


                openToolModal(
                    related.dataset
                        .openTool
                );
            }
        );
    }


    /* ------------------------------------------------------------
       Keyboard shortcuts
       ------------------------------------------------------------ */

    document.addEventListener(
        "keydown",
        event => {

            /**
             * Escape:
             *
             * Close modal and sidebar.
             */
            if (
                event.key ===
                "Escape"
            ) {

                closeToolModal();

                closeCategorySidebar();
            }


            /**
             * Slash:
             *
             * Focus main search.
             */
            if (
                event.key === "/" &&
                !isTypingTarget(
                    event.target
                )
            ) {

                event.preventDefault();


                elements.toolSearch?.focus();
            }
        }
    );


    /* ------------------------------------------------------------
       Window resize
       ------------------------------------------------------------ */

    window.addEventListener(
        "resize",
        debounce(
            () => {

                if (
                    window.innerWidth >
                    900
                ) {

                    closeCategorySidebar();
                }

            },
            150
        )
    );
}


/* ================================================================
   38. COPY TECHNOLOGY LINK
   ================================================================ */

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


        if (
            button
        ) {

            const original =
                button.textContent;


            button.textContent =
                "Copied!";


            button.classList.add(
                "copied"
            );


            setTimeout(
                () => {

                    button.textContent =
                        original;


                    button.classList.remove(
                        "copied"
                    );

                },
                1400
            );
        }

    } catch (error) {

        console.warn(
            "Clipboard API failed:",
            error
        );


        fallbackCopyText(
            url.toString()
        );
    }
}


function fallbackCopyText(
    text
) {

    const textarea =
        document.createElement(
            "textarea"
        );


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

        document.execCommand(
            "copy"
        );

    } catch (error) {

        console.warn(
            "Clipboard fallback failed:",
            error
        );
    }


    textarea.remove();
}


/* ================================================================
   39. URL DEEP LINKING
   ================================================================ */

/**
 * Open technology from:
 *
 * ?tool=aws-ec2
 *
 * The value can be either:
 *
 * technologyId
 *
 * or
 *
 * id
 */
function openToolFromUrl() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const toolId =
        params.get(
            "tool"
        );


    if (
        !toolId
    ) {

        return;
    }


    const tool =
        findToolById(
            toolId
        );


    if (
        !tool
    ) {

        return;
    }


    openToolModal(
        getToolId(
            tool
        )
    );
}


/**
 * Add tool query parameter.
 */
function updateToolUrl(
    id
) {

    try {

        const url =
            new URL(
                window.location.href
            );


        url.searchParams.set(
            "tool",
            String(id)
        );


        window.history.replaceState(
            {},
            "",
            url
        );

    } catch (error) {

        console.warn(
            "Unable to update URL:",
            error
        );
    }
}


/**
 * Remove tool query parameter.
 */
function removeToolUrl() {

    try {

        const url =
            new URL(
                window.location.href
            );


        url.searchParams.delete(
            "tool"
        );


        window.history.replaceState(
            {},
            "",
            url
        );

    } catch (error) {

        console.warn(
            "Unable to clean URL:",
            error
        );
    }
}


/* ================================================================
   40. SCROLL TO RESULTS
   ================================================================ */

function scrollToResults() {

    if (
        !elements.toolGrid
    ) {

        return;
    }


    const top =
        elements.toolGrid
            .getBoundingClientRect()
            .top +
        window.scrollY -
        120;


    window.scrollTo({
        top,
        behavior:
            "smooth"
    });
}


/* ================================================================
   41. SAFE URL
   ================================================================ */

/**
 * Only HTTP/HTTPS URLs are allowed.
 *
 * This protects the UI from unsafe protocols such as:
 *
 * javascript:
 * data:
 * file:
 * etc.
 */
function safeUrl(
    value
) {

    if (
        !value
    ) {

        return "";
    }


    try {

        const url =
            new URL(
                String(value),
                window.location.href
            );


        if (
            url.protocol !==
                "http:" &&
            url.protocol !==
                "https:"
        ) {

            return "";
        }


        return url.href;

    } catch (error) {

        return "";
    }
}


/* ================================================================
   42. HTML ESCAPING
   ================================================================ */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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


/* ================================================================
   43. SLUGIFY
   ================================================================ */

function slugify(
    value
) {

    return String(
        value
    )
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );
}


/* ================================================================
   44. NUMBER FORMATTING
   ================================================================ */

function formatNumber(
    value
) {

    return Number(
        value || 0
    ).toLocaleString();
}


/* ================================================================
   45. DATE FORMATTING
   ================================================================ */

function formatDate(
    value
) {

    if (
        !value
    ) {

        return "Unknown";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(
            value
        );
    }


    return date.toLocaleDateString(
        undefined,
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "numeric"
        }
    );
}


/* ================================================================
   46. DEBOUNCE
   ================================================================ */

function debounce(
    callback,
    delay
) {

    let timeout;


    return (
        ...args
    ) => {

        clearTimeout(
            timeout
        );


        timeout =
            setTimeout(
                () =>
                    callback(
                        ...args
                    ),
                delay
            );
    };
}


/* ================================================================
   47. INPUT TARGET CHECK
   ================================================================ */

function isTypingTarget(
    element
) {

    if (
        !element
    ) {

        return false;
    }


    const tag =
        element.tagName
            ?.toLowerCase();


    return (
        tag === "input" ||
        tag === "textarea" ||
        tag === "select" ||
        element.isContentEditable
    );
}


/* ================================================================
   48. DATABASE ERROR UI
   ================================================================ */

function showDatabaseError() {

    /**
     * Reset statistics.
     */
    if (
        elements.totalTools
    ) {

        elements.totalTools.textContent =
            "0";
    }


    if (
        elements.totalCategories
    ) {

        elements.totalCategories.textContent =
            "0";
    }


    if (
        elements.totalProviders
    ) {

        elements.totalProviders.textContent =
            "0";
    }


    if (
        elements.favoriteCount
    ) {

        elements.favoriteCount.textContent =
            formatNumber(
                getFavorites().length
            );
    }


    /**
     * Show database error.
     */
    if (
        elements.toolGrid
    ) {

        elements.toolGrid.innerHTML = `
            <div class="database-error">

                <div class="database-error-icon">
                    !
                </div>

                <h3>
                    Documentation database unavailable
                </h3>

                <p>
                    Charlie MJ DevOps Explorer could not
                    load the shared official documentation
                    database.
                </p>

                <p>
                    Expected database:
                </p>

                <p>
                    <code>
                        data/official-documentation.json
                    </code>
                </p>

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


    if (
        elements.resultCount
    ) {

        elements.resultCount.textContent =
            "Database unavailable";
    }


    if (
        elements.categorySidebarList
    ) {

        elements.categorySidebarList.innerHTML = `
            <div class="sidebar-empty">
                Database unavailable
            </div>
        `;
    }


    if (
        elements.sidebarCategoryCount
    ) {

        elements.sidebarCategoryCount.textContent =
            "0 categories";
    }
}


/* ================================================================
   49. GLOBAL CHARLIE MJ API
   ================================================================ */

/**
 * Small public API for future website components.
 *
 * Example:
 *
 * CharlieMJDevOps.openTool("aws-ec2");
 *
 * CharlieMJDevOps.search("kubernetes");
 *
 * CharlieMJDevOps.selectCategory("Cloud");
 */
window.CharlieMJDevOps = {

    /**
     * Open a technology.
     */
    openTool(id) {

        openToolModal(
            id
        );
    },


    /**
     * Search.
     */
    search(query) {

        state.searchQuery =
            String(
                query || ""
            )
            .trim();


        state.currentPage =
            1;


        if (
            elements.toolSearch
        ) {

            elements.toolSearch.value =
                state.searchQuery;
        }


        applyFilters();
    },


    /**
     * Select category.
     */
    selectCategory(
        category
    ) {

        selectCategory(
            category ||
            "all"
        );
    },


    /**
     * Reset.
     */
    reset() {

        resetFilters();
    },


    /**
     * Get actual loaded technology count.
     */
    getToolCount() {

        return state.tools.length;
    },


    /**
     * Get current database metadata.
     */
    getDatabaseInfo() {

        return {
            version:
                state.databaseMeta
                    .version,

            generatedAt:
                state.databaseMeta
                    .generatedAt,

            declaredCount:
                state.databaseMeta
                    .declaredCount,

            loadedCount:
                state.tools.length
        };
    }
};


/* ================================================================
   END OF CHARLIE MJ DEVOPS EXPLORER DOCUMENTATION JS
   ================================================================ */