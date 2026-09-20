/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
repository-card.js
============================================================

Purpose:
    Render GitHub repositories as visual cards.

The card supports:

    - Repository name
    - Owner
    - Description
    - Stars
    - Forks
    - Language
    - Topics
    - Last update
    - Creator
    - Save/bookmark
    - GitHub link
    - Internal repository detail page

============================================================
*/


import {

    escapeHtml,
    formatNumber,
    timeAgo,
    safeUrl,
    getRepositoryUrl,
    getUserUrl,
    getInitials,
    slugify

} from "./utils.js";


import {

    isRepositorySaved,
    toggleRepositorySaved

} from "./storage.js";


/* ==========================================================
   1. CREATE REPOSITORY CARD
   ========================================================== */

/**
 * Create one repository card.
 *
 * @param {object} repository
 * @returns {HTMLElement}
 */
export function createRepositoryCard(
    repository
) {

    const card =
        document.createElement("article");


    card.className =
        "repo-card";


    const saved =
        isRepositorySaved(
            repository
        );


    const owner =
        repository.owner?.login ||
        "unknown";


    const avatar =
        repository.owner?.avatar_url ||
        "";


    const description =
        repository.description ||
        "No repository description was provided.";


    const language =
        repository.language ||
        "Unknown";


    const topics =
        Array.isArray(
            repository.topics
        )
            ? repository.topics
            : [];


    const visibleTopics =
        topics.slice(0, 5);


    const topicHTML =
        visibleTopics
            .map(
                topic => `
                    <span class="tag">
                        ${escapeHtml(topic)}
                    </span>
                `
            )
            .join("");


    card.innerHTML = `

        <!-- Repository header -->
        <div class="repo-header">

            <div>

                <a
                    class="repo-name"
                    href="${safeUrl(
                        getRepositoryUrl(
                            repository
                        )
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ${escapeHtml(
                        repository.name ||
                        repository.full_name ||
                        "Unnamed repository"
                    )}
                </a>

                <div class="repo-owner">
                    ${escapeHtml(owner)}
                </div>

            </div>


            <!-- Bookmark -->
            <button
                class="
                    bookmark
                    ${saved ? "saved" : ""}
                "
                type="button"
                aria-label="${
                    saved
                        ? "Remove saved repository"
                        : "Save repository"
                }"
                title="${
                    saved
                        ? "Remove from saved"
                        : "Save repository"
                }"
                data-repository-id="${
                    repository.id
                }"
            >
                ${saved ? "★" : "☆"}
            </button>

        </div>


        <!-- Description -->
        <p class="repo-description">
            ${escapeHtml(description)}
        </p>


        <!-- Topics -->
        <div class="tags">

            <span class="tag">
                ${escapeHtml(language)}
            </span>

            ${topicHTML}

        </div>


        <!-- Repository statistics -->
        <div class="repo-stats">

            <span class="repo-stat">
                <span class="stat-stars">★</span>
                <strong>
                    ${formatNumber(
                        repository.stargazers_count || 0
                    )}
                </strong>
            </span>


            <span class="repo-stat">
                <span class="stat-forks">⑂</span>
                <strong>
                    ${formatNumber(
                        repository.forks_count || 0
                    )}
                </strong>
            </span>


            <span class="repo-stat">
                Updated
                <strong>
                    ${timeAgo(
                        repository.updated_at
                    )}
                </strong>
            </span>

        </div>


        <!-- Repository footer -->
        <div class="repo-footer">

            <a
                class="creator"
                href="${safeUrl(
                    `${getUserUrl(owner)}`
                )}"
                target="_blank"
                rel="noopener noreferrer"
            >

                ${
                    avatar
                        ? `
                            <img
                                class="avatar"
                                src="${safeUrl(
                                    avatar
                                )}"
                                alt="${escapeHtml(
                                    owner
                                )}"
                                loading="lazy"
                            >
                        `
                        : `
                            <span
                                class="
                                    avatar
                                    avatar-fallback
                                "
                            >
                                ${escapeHtml(
                                    getInitials(owner)
                                )}
                            </span>
                        `
                }


                <span class="creator-info">

                    <span class="creator-name">
                        ${escapeHtml(owner)}
                    </span>

                    <span class="creator-role">
                        GitHub creator
                    </span>

                </span>

            </a>


            <div class="repo-actions">

                <a
                    class="repo-action"
                    href="${safeUrl(
                        `../pages/repository.html?owner=${encodeURIComponent(owner)}&repo=${encodeURIComponent(repository.name || "")}`
                    )}"
                >
                    Details
                </a>

                <a
                    class="repo-action"
                    href="${safeUrl(
                        getRepositoryUrl(
                            repository
                        )
                    )}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub ↗
                </a>

            </div>

        </div>

    `;


    /* ======================================================
       2. BOOKMARK EVENT
       ====================================================== */

    const bookmark =
        card.querySelector(
            ".bookmark"
        );


    if (bookmark) {

        bookmark.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const isSaved =
                    toggleRepositorySaved(
                        repository
                    );


                bookmark.classList.toggle(
                    "saved",
                    isSaved
                );


                bookmark.textContent =
                    isSaved
                        ? "★"
                        : "☆";


                bookmark.setAttribute(
                    "aria-label",
                    isSaved
                        ? "Remove saved repository"
                        : "Save repository"
                );

            }
        );

    }


    return card;
}


/* ==========================================================
   3. RENDER MULTIPLE REPOSITORIES
   ========================================================== */

/**
 * Render repository cards into a container.
 *
 * @param {Array} repositories
 * @param {HTMLElement} container
 */
export function renderRepositories(
    repositories = [],
    container
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(repositories) ||
        repositories.length === 0
    ) {

        container.innerHTML = `

            <div class="
                empty-state
                no-results
            ">

                <div class="empty-state-icon">
                    ⌕
                </div>

                <div class="empty-state-title">
                    No repositories found
                </div>

                <p class="empty-state-description">
                    Try another DevOps technology,
                    project type, programming language,
                    or search phrase.
                </p>

            </div>

        `;

        return;
    }


    repositories.forEach(
        repository => {

            container.appendChild(
                createRepositoryCard(
                    repository
                )
            );

        }
    );
}


/* ==========================================================
   4. REFRESH BOOKMARK STATES
   ========================================================== */

/**
 * Refresh bookmark buttons on existing cards.
 *
 * Useful when the saved page changes repository state.
 */
export function refreshBookmarkStates() {

    document
        .querySelectorAll(
            ".repo-card"
        )
        .forEach(card => {

            const button =
                card.querySelector(
                    ".bookmark"
                );

            if (!button) {
                return;
            }

            const id =
                button.dataset.repositoryId;

            if (!id) {
                return;
            }

            /*
             * We cannot reconstruct the complete repository
             * object here, so the application normally
             * re-renders the card after storage changes.
             */
        });
}


/* ==========================================================
   END OF repository-card.js
   ========================================================== */