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

============================================================
*/


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

    if (
        categoryCache.length > 0
    ) {

        return categoryCache;
    }


    const data =
        await fetchJson(
            "devops-categories.json"
        );


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
            category =>
                String(
                    category.slug ||
                    ""
                ).toLowerCase() ===
                normalized ||

                String(
                    category.name ||
                    ""
                ).toLowerCase() ===
                normalized
        ) || null
    );
}


/* ==========================================================
   4. CREATE CATEGORY CARD
   ========================================================== */

/**
 * Create category card.
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
        document.createElement("article");


    card.className =
        "category-card";


    card.dataset.category =
        category.slug ||
        category.name ||
        "";


    const number =
        String(index + 1)
            .padStart(2, "0");


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
            category.technologyCount
                ? `
                    <div class="category-count">
                        ${escapeHtml(
                            category.technologyCount
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


    container.innerHTML = "";


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


    categories.forEach(
        (category, index) => {

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
   6. CATEGORY CLICK HANDLER
   ========================================================== */

/**
 * Make category cards searchable.
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


    container.addEventListener(
        "click",
        event => {

            const card =
                event.target.closest(
                    ".category-card"
                );


            if (!card) {
                return;
            }


            const category =
                card.dataset.category;


            if (
                searchInput &&
                category
            ) {

                searchInput.value =
                    category;


                searchInput.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );
}


/* ==========================================================
   END OF categories.js
   ========================================================== */