/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
filters.js
============================================================

Purpose:
    Manage the search filter controls.

Filters:

    Resource Type
    Technology
    Language
    Sort

This module does not directly perform GitHub searches.

It only manages filter state and notifies the application
when filters change.

============================================================
*/


/* ==========================================================
   1. FILTER ELEMENT IDS
   ========================================================== */

const FILTER_IDS = {

    resourceType:
        "resourceTypeFilter",

    technology:
        "technologyFilter",

    language:
        "languageFilter",

    sort:
        "sortFilter"

};


/* ==========================================================
   2. DEFAULT FILTER STATE
   ========================================================== */

const DEFAULT_FILTERS = {

    resourceType:
        "everything",

    technology:
        "any",

    language:
        "any",

    sort:
        "best"

};


/* ==========================================================
   3. GET FILTER ELEMENT
   ========================================================== */

/**
 * Get a filter select element.
 *
 * @param {string} name
 * @returns {HTMLSelectElement|null}
 */
function getFilterElement(name) {

    const id =
        FILTER_IDS[name];

    if (!id) {
        return null;
    }

    return document.getElementById(id);
}


/* ==========================================================
   4. GET CURRENT FILTERS
   ========================================================== */

/**
 * Read current filter values from UI.
 *
 * @returns {object}
 */
export function getFilters() {

    return {

        resourceType:
            getFilterElement(
                "resourceType"
            )?.value ||
            DEFAULT_FILTERS.resourceType,

        technology:
            getFilterElement(
                "technology"
            )?.value ||
            DEFAULT_FILTERS.technology,

        language:
            getFilterElement(
                "language"
            )?.value ||
            DEFAULT_FILTERS.language,

        sort:
            getFilterElement(
                "sort"
            )?.value ||
            DEFAULT_FILTERS.sort

    };
}


/* ==========================================================
   5. SET FILTERS
   ========================================================== */

/**
 * Apply filter state to UI.
 *
 * @param {object} filters
 */
export function setFilters(
    filters = {}
) {

    const merged = {

        ...DEFAULT_FILTERS,

        ...filters

    };


    Object.entries(
        FILTER_IDS
    ).forEach(
        ([name, id]) => {

            const element =
                document.getElementById(id);

            if (!element) {
                return;
            }

            const value =
                merged[name];

            if (
                [...element.options]
                    .some(
                        option =>
                            option.value === value
                    )
            ) {

                element.value = value;
            }

        }
    );
}


/* ==========================================================
   6. RESET FILTERS
   ========================================================== */

/**
 * Reset all filters.
 */
export function resetFilters() {

    setFilters(
        DEFAULT_FILTERS
    );
}


/* ==========================================================
   7. INITIALIZE FILTERS
   ========================================================== */

/**
 * Initialize filter listeners.
 *
 * @param {Function} onChange
 * @returns {Function}
 */
export function initializeFilters(
    onChange
) {

    const elements =
        Object.values(
            FILTER_IDS
        )
        .map(
            id =>
                document.getElementById(id)
        )
        .filter(Boolean);


    elements.forEach(element => {

        element.addEventListener(
            "change",
            () => {

                if (
                    typeof onChange ===
                    "function"
                ) {

                    onChange(
                        getFilters()
                    );
                }

            }
        );

    });


    return () => {

        elements.forEach(
            element => {

                element.replaceWith(
                    element.cloneNode(true)
                );

            }
        );
    };
}


/* ==========================================================
   8. SORT MAPPING
   ========================================================== */

/**
 * Convert UI sort option to GitHub API sort.
 *
 * GitHub repository search supports:
 *
 *     stars
 *     forks
 *     help-wanted-issues
 *     updated
 *     best-match
 *     created
 *
 * @param {string} sort
 * @returns {object}
 */
export function getGitHubSort(
    sort
) {

    switch (sort) {

        case "stars":

            return {
                sort: "stars",
                order: "desc"
            };

        case "updated":

            return {
                sort: "updated",
                order: "desc"
            };

        case "created":

            return {
                sort: "created",
                order: "desc"
            };

        default:

            return {
                sort: "",
                order: "desc"
            };
    }
}


/* ==========================================================
   9. FILTER LABELS
   ========================================================== */

/**
 * Human-readable filter labels.
 *
 * @param {object} filters
 * @returns {object}
 */
export function getFilterLabels(
    filters = {}
) {

    return {

        resourceType:
            filters.resourceType ===
            "everything"
                ? ""
                : filters.resourceType,

        technology:
            filters.technology ===
            "any"
                ? ""
                : filters.technology,

        language:
            filters.language ===
            "any"
                ? ""
                : filters.language,

        sort:
            filters.sort ===
            "best"
                ? ""
                : filters.sort

    };
}


/* ==========================================================
   END OF filters.js
   ========================================================== */