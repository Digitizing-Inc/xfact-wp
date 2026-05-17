/**
 * Intercepts "Add New" clicks for specific post types and prompts for a title.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Select all "Add New" links for Page and Case Study.
    const addNewLinks = document.querySelectorAll(
        'a[href*="post-new.php?post_type=page"], a[href*="post-new.php?post_type=case_study"]',
    );

    addNewLinks.forEach((link) => {
        link.addEventListener('click', (event) => {
            const url = new URL(link.href, window.location.origin);
            const postType = url.searchParams.get('post_type');

            // If the URL already has a title, don't prompt again.
            if (url.searchParams.has('post_title')) {
                return;
            }

            let typeName = 'Post';
            if (postType === 'page') {
                typeName = 'Page';
            } else if (postType === 'case_study') {
                typeName = 'Case Study';
            }

            const title = window.prompt(
                `Enter a title for this new ${typeName}:`,
            );

            if (title === null) {
                // User clicked Cancel
                event.preventDefault();
                return;
            }

            if (title.trim() !== '') {
                event.preventDefault();
                url.searchParams.set('post_title', title.trim());
                window.location.href = url.toString();
            }
        });
    });
});
