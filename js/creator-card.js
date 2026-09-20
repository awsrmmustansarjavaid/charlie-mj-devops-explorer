/*
============================================================
CHARLIE MJ DEVOPS EXPLORER
creator-card.js
============================================================

Purpose:
    Render GitHub users/creators.

Used for:

    - GitHub creator search
    - Creator page
    - Developer/resource author sections

============================================================
*/


import {

    escapeHtml,
    formatNumber,
    safeUrl,
    getUserUrl,
    getInitials

} from "./utils.js";


/* ==========================================================
   1. CREATE CREATOR CARD
   ========================================================== */

/**
 * Create a creator card.
 *
 * @param {object} user
 * @returns {HTMLElement}
 */
export function createCreatorCard(
    user
) {

    const card =
        document.createElement("article");


    card.className =
        "creator-card";


    const username =
        user.login ||
        user.name ||
        "unknown";


    const avatar =
        user.avatar_url ||
        "";


    card.innerHTML = `

        ${
            avatar
                ? `
                    <img
                        class="avatar"
                        src="${safeUrl(avatar)}"
                        alt="${escapeHtml(username)}"
                        loading="lazy"
                    >
                `
                : `
                    <div
                        class="
                            avatar
                            avatar-fallback
                        "
                    >
                        ${escapeHtml(
                            getInitials(
                                username
                            )
                        )}
                    </div>
                `
        }


        <div class="creator-card-name">

            ${escapeHtml(username)}

        </div>


        ${
            user.bio
                ? `
                    <p class="creator-card-bio">
                        ${escapeHtml(
                            user.bio
                        )}
                    </p>
                `
                : `
                    <p class="creator-card-bio">
                        GitHub developer
                    </p>
                `
        }


        <div class="creator-card-stats">

            ${
                typeof user.public_repos ===
                "number"
                    ? `
                        <span>
                            ${formatNumber(
                                user.public_repos
                            )}
                            repos
                        </span>
                    `
                    : ""
            }


            ${
                typeof user.followers ===
                "number"
                    ? `
                        <span>
                            ${formatNumber(
                                user.followers
                            )}
                            followers
                        </span>
                    `
                    : ""
            }

        </div>


        <div style="
            margin-top: 15px;
        ">

            <a
                class="link-button"
                href="${safeUrl(
                    getUserUrl(user)
                )}"
                target="_blank"
                rel="noopener noreferrer"
            >
                View GitHub profile
            </a>

        </div>

    `;


    return card;
}


/* ==========================================================
   2. RENDER CREATORS
   ========================================================== */

/**
 * Render multiple creators.
 *
 * @param {Array} users
 * @param {HTMLElement} container
 */
export function renderCreators(
    users = [],
    container
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (
        !Array.isArray(users) ||
        users.length === 0
    ) {

        container.innerHTML = `

            <div class="
                empty-state
                no-results
            ">

                <div class="empty-state-icon">
                    ◉
                </div>

                <div class="empty-state-title">
                    No creators found
                </div>

                <p class="empty-state-description">
                    Try another username or search phrase.
                </p>

            </div>

        `;

        return;
    }


    users.forEach(
        user => {

            container.appendChild(
                createCreatorCard(
                    user
                )
            );

        }
    );
}


/* ==========================================================
   END OF creator-card.js
   ========================================================== */