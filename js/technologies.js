/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
technologies.js
============================================================

Purpose:
    Load and display the local DevOps technology database.

Data source:

    data/devops-technologies.json

This allows the project to maintain its own knowledge base
without requiring GitHub API requests for technology
information.

============================================================
*/


import {

    fetchJson,
    escapeHtml,
    slugify

} from "./utils.js";


/* ==========================================================
   1. TECHNOLOGY CACHE
   ========================================================== */

let technologyCache = [];


/* ==========================================================
   2. LOAD TECHNOLOGIES
   ========================================================== */

/**
 * Load DevOps technology database.
 *
 * @returns {Promise<Array>}
 */
export async function loadTechnologies() {

    if (
        technologyCache.length > 0
    ) {

        return technologyCache;
    }


    const data =
        await fetchJson(
            "devops-technologies.json"
        );


    /*
     * Support either:
     *
     *     [...]
     *
     * or:
     *
     *     {
     *         "technologies": [...]
     *     }
     */

    technologyCache =
        Array.isArray(data)
            ? data
            : data.technologies || [];


    return technologyCache;
}


/* ==========================================================
   3. GET TECHNOLOGY BY NAME
   ========================================================== */

/**
 * Find a technology.
 *
 * Supports:
 *
 *     name
 *     slug
 *     id
 *     aliases
 *
 * @param {string} name
 * @returns {Promise<object|null>}
 */
export async function getTechnology(
    name
) {

    const technologies =
        await loadTechnologies();


    const normalized =
        String(name || "")
            .trim()
            .toLowerCase();


    return (
        technologies.find(
            technology => {

                if (
                    technology.name
                        ?.toLowerCase() ===
                    normalized
                ) {
                    return true;
                }


                if (
                    technology.slug
                        ?.toLowerCase() ===
                    normalized
                ) {
                    return true;
                }


                if (
                    technology.id
                        ?.toLowerCase() ===
                    normalized
                ) {
                    return true;
                }


                return (
                    Array.isArray(
                        technology.aliases
                    ) &&
                    technology.aliases.some(
                        alias =>
                            String(alias)
                                .toLowerCase() ===
                            normalized
                    )
                );

            }
        ) || null
    );
}


/* ==========================================================
   4. FILTER TECHNOLOGIES
   ========================================================== */

/**
 * Filter technology database.
 *
 * @param {object} options
 * @returns {Promise<Array>}
 */
export async function filterTechnologies({

    category = "",

    search = "",

    skillLevel = ""

} = {}) {

    const technologies =
        await loadTechnologies();


    const normalizedSearch =
        search
            .trim()
            .toLowerCase();


    return technologies.filter(
        technology => {

            if (
                category &&
                technology.category !==
                category
            ) {

                return false;
            }


            if (
                skillLevel &&
                technology.skillLevel !==
                skillLevel
            ) {

                return false;
            }


            if (
                normalizedSearch
            ) {

                const searchable = [

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


                if (
                    !searchable.includes(
                        normalizedSearch
                    )
                ) {

                    return false;
                }
            }


            return true;
        }
    );
}


/* ==========================================================
   5. CREATE TECHNOLOGY CARD
   ========================================================== */

/**
 * Create technology card.
 *
 * @param {object} technology
 * @returns {HTMLElement}
 */
export function createTechnologyCard(
    technology
) {

    const card =
        document.createElement("article");


    card.className =
        "technology-card";


    card.dataset.technology =
        technology.slug ||
        slugify(
            technology.name
        );


    const shortSymbol =
        technology.name
            ?.replace(
                /[^A-Za-z0-9]/g,
                ""
            )
            .slice(0, 2)
            .toUpperCase() ||
        "DV";


    card.innerHTML = `

        <div>

            <div class="tech-symbol">
                ${escapeHtml(
                    shortSymbol
                )}
            </div>


            <div class="technology-name">
                ${escapeHtml(
                    technology.name ||
                    "Unknown"
                )}
            </div>


            <div class="technology-category">
                ${escapeHtml(
                    technology.category ||
                    "DevOps"
                )}
            </div>


            ${
                technology.description
                    ? `
                        <p class="
                            technology-description
                        ">
                            ${escapeHtml(
                                technology.description
                            )}
                        </p>
                    `
                    : ""
            }

        </div>

    `;


    return card;
}


/* ==========================================================
   6. RENDER TECHNOLOGIES
   ========================================================== */

/**
 * Render technology cards.
 *
 * @param {Array} technologies
 * @param {HTMLElement} container
 */
export function renderTechnologies(
    technologies,
    container
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !technologies ||
        technologies.length === 0
    ) {

        container.innerHTML = `

            <div class="
                empty-state
                no-results
            ">

                <div class="empty-state-icon">
                    ◫
                </div>

                <div class="empty-state-title">
                    No technologies found
                </div>

                <p class="empty-state-description">
                    Try another technology or category.
                </p>

            </div>

        `;

        return;
    }


    technologies.forEach(
        technology => {

            container.appendChild(
                createTechnologyCard(
                    technology
                )
            );

        }
    );
}


/* ==========================================================
   7. POPULATE TECHNOLOGY FILTER
   ========================================================== */

/**
 * Populate #technologyFilter from local database.
 *
 * @returns {Promise<void>}
 */
export async function populateTechnologyFilter() {

    const select =
        document.getElementById(
            "technologyFilter"
        );


    if (!select) {
        return;
    }


    const technologies =
        await loadTechnologies();


    /*
     * Keep original first option.
     */

    const originalFirstOption =
        select.querySelector(
            'option[value="any"]'
        );


    select.innerHTML = "";


    if (originalFirstOption) {

        select.appendChild(
            originalFirstOption
        );

    } else {

        const option =
            document.createElement(
                "option"
            );

        option.value = "any";

        option.textContent =
            "Any Technology";

        select.appendChild(
            option
        );
    }


    /*
     * Sort alphabetically.
     */

    const sorted =
        [...technologies].sort(
            (a, b) =>
                String(a.name)
                    .localeCompare(
                        String(b.name)
                    )
        );


    sorted.forEach(
        technology => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                technology.name;


            option.textContent =
                technology.name;


            select.appendChild(
                option
            );

        }
    );
}


/* ==========================================================
   8. INTERACTION NOTE
   ========================================================== */

/*
 * Technology click handling intentionally lives in search.js.
 *
 * This module is responsible only for loading, rendering and
 * filtering technology data. Keeping interaction logic in one
 * place prevents duplicate click handlers.
 */


/* ==========================================================
   END OF technologies.js
   ========================================================== */