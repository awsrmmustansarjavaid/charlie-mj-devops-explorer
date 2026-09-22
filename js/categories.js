/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
categories.js
============================================================

Purpose:
    Load and render DevOps engineering categories.

Data source:

    data/devops-categories.json

Examples:

    Linux
    Networking
    Git
    Cloud
    Containers
    Kubernetes
    CI/CD
    IaC
    DevSecOps
    Observability
    GitOps
    SRE
    Platform Engineering

IMPORTANT:

    categories.js is responsible for:

        Load categories
        ↓
        Find categories
        ↓
        Create category cards
        ↓
        Render category cards

    app.js is responsible for:

        Category click
        ↓
        Technology selection
        ↓
        GitHub search

============================================================
*/


/* ==========================================================
   IMPORTS
   ========================================================== */

import {

    fetchJson,
    escapeHtml

} from "./utils.js";


/* ==========================================================
   1. CACHE
   ========================================================== */

let categoryCache = [];


/* ==========================================================
   2. LOAD CATEGORIES
   ========================================================== */

/**
 * Load category database.
 *
 * @returns {Promise<Array>}
 */
export async function loadCategories() {

    /*
     * Return cached categories when
     * they have already been loaded.
     */

    if (
        categoryCache.length > 0
    ) {

        return categoryCache;

    }


    /*
     * Load categories from JSON.
     */

    const data =
        await fetchJson(
            "devops-categories.json"
        );


    /*
     * Support both possible JSON formats:
     *
     * [
     *     {...},
     *     {...}
     * ]
     *
     * OR:
     *
     * {
     *     "categories": [...]
     * }
     */

    categoryCache =
        Array.isArray(data)
            ? data
            : data.categories || [];


    return categoryCache;

}


/* ==========================================================
   3. GET CATEGORY
   ========================================================== */

/**
 * Find category by slug or name.
 *
 * @param {string} value
 * @returns {Promise<object|null>}
 */
export async function getCategory(
    value
) {

    const categories =
        await loadCategories();


    const normalized =
        String(value || "")
            .trim()
            .toLowerCase();


    return (

        categories.find(
            category => {

                const slug =
                    String(
                        category.slug ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                const name =
                    String(
                        category.name ||
                        ""
                    )
                    .trim()
                    .toLowerCase();


                return (
                    slug === normalized ||
                    name === normalized
                );

            }
        ) || null

    );

}


/* ==========================================================
   4. CREATE CATEGORY CARD
   ========================================================== */

/**
 * Create category card.
 *
 * IMPORTANT:
 *
 * data-category is required by app.js.
 *
 * Example:
 *
 *     data-category="kubernetes"
 *
 * This connects the visual card to:
 *
 *     devopsCategories
 *
 * in:
 *
 *     devops-data.js
 *
 * @param {object} category
 * @param {number} index
 * @returns {HTMLElement}
 */
export function createCategoryCard(
    category,
    index = 0
) {

    const card =
        document.createElement(
            "article"
        );


    /*
     * Main card class.
     */

    card.className =
        "category-card";


    /*
     * Category ID.
     *
     * app.js uses:
     *
     *     card.dataset.category
     *
     * to determine which category
     * the user selected.
     */

    const categoryId =
        category.slug ||
        category.id ||
        category.name ||
        "";


    card.dataset.category =
        String(categoryId)
            .trim()
            .toLowerCase();


    /*
     * Make card keyboard accessible.
     */

    card.setAttribute(
        "tabindex",
        "0"
    );


    card.setAttribute(
        "role",
        "button"
    );


    card.setAttribute(
        "aria-label",
        `Explore ${
            category.name ||
            "category"
        }`
    );

    /*
     * The category itself is also a valid GitHub search entry
     * point. Clicking it therefore reveals its tools and lets
     * the delegated search system discover related repositories.
     */
    card.dataset.searchQuery =
        category.name ||
        "DevOps";


    /*
     * Category number.
     */

    const number =
        String(index + 1)
            .padStart(2, "0");


    /*
     * Category technology count.
     */

    const technologyCount =
        category.technologyCount ||
        (
            Array.isArray(
                category.technologies
            )
                ? category.technologies.length
                : 0
        );


    /*
     * Build card HTML.
     */

    card.innerHTML = `

        <div class="category-number">
            // ${number}
        </div>


        <div class="category-name">
            ${escapeHtml(
                category.name ||
                "Category"
            )}
        </div>


        <p class="category-description">
            ${escapeHtml(
                category.description ||
                ""
            )}
        </p>


        ${
            technologyCount
                ? `
                    <div class="category-count">
                        ${escapeHtml(
                            String(
                                technologyCount
                            )
                        )}
                        tools
                    </div>
                `
                : ""
        }

    `;


    return card;

}


/* ==========================================================
   5. RENDER CATEGORIES
   ========================================================== */

/**
 * Render categories.
 *
 * @param {Array} categories
 * @param {HTMLElement} container
 */
export function renderCategories(
    categories,
    container
) {

    if (!container) {
        return;
    }


    /*
     * Clear previous categories.
     */

    container.innerHTML = "";


    /*
     * Empty state.
     */

    if (
        !categories ||
        categories.length === 0
    ) {

        container.innerHTML = `

            <div class="
                empty-state
                no-results
            ">

                <div class="empty-state-title">
                    No categories available
                </div>

            </div>

        `;

        return;
    }


    /*
     * Create each category card.
     */

    categories.forEach(
        (
            category,
            index
        ) => {

            container.appendChild(
                createCategoryCard(
                    category,
                    index
                )
            );

        }
    );

}


/* ==========================================================
   6. CATEGORY CARD INITIALIZATION
   ========================================================== */

/**
 * Initialize category cards.
 *
 * IMPORTANT:
 *
 * Category click behavior is now handled
 * centrally by app.js.
 *
 * This function is intentionally kept
 * for compatibility with app.js:
 *
 *     initializeCategoryCards(
 *         categoryContainer,
 *         searchInput
 *     );
 *
 * No separate click listener is added here.
 *
 * This prevents duplicate click behavior.
 *
 * @param {HTMLElement} container
 * @param {HTMLInputElement} searchInput
 */
export function initializeCategoryCards(
    container,
    searchInput
) {

    if (!container) {
        return;
    }


    /*
     * The actual category interaction
     * is handled by app.js.
     *
     * Keeping this function exported
     * means the existing app.js code
     * does not need to be changed.
     */

    return container;

}


/* ==========================================================
   END OF categories.js
   ========================================================== */
