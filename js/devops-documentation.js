/**
 * ============================================================
 * DEVOPS DOCUMENTATION NAVIGATION
 * ============================================================
 *
 * Purpose:
 *     Handles navigation to the dedicated DevOps Documentation
 *     page.
 *
 * Documentation page:
 *
 *     pages/devops-documentation/index.html
 *
 * Note:
 *     No JavaScript is required for the actual navigation.
 *     The browser handles the link normally.
 *
 * This function is intentionally lightweight so it does not
 * interfere with the existing DevOps Explorer JavaScript.
 * ============================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    /**
     * Find all links that point to the documentation page.
     */
    const documentationLinks = document.querySelectorAll(
        'a[href="pages/devops-documentation/index.html"]'
    );


    /**
     * Confirm that the documentation links exist.
     *
     * This check prevents unnecessary errors if the homepage
     * version does not contain the documentation section yet.
     */
    if (!documentationLinks.length) {
        return;
    }


    /**
     * Add a small accessibility enhancement.
     *
     * Users navigating with a keyboard can clearly identify
     * the documentation destination.
     */
    documentationLinks.forEach((link) => {

        link.setAttribute(
            "aria-label",
            "Open DevOps Official Documentation"
        );

    });

});