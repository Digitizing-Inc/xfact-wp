/**
 * xFact — Mobile Menu Toggle
 *
 * Shows/hides the mobile navigation overlay when the hamburger button
 * is clicked. Dynamically clones links from the desktop wp:navigation
 * block so editing the nav in wp-admin updates both views.
 *
 * This script loads in the footer (after all DOM content), so no
 * DOMContentLoaded wrapper is needed.
 *
 * @package xfact
 */

(() => {
    const toggle = document.querySelector('.xfact-mobile-toggle');
    const mobileNav = document.querySelector('.xfact-mobile-nav');
    const header = document.querySelector('.xfact-header');

    if (!toggle || !mobileNav) {
        return;
    }

    /* ── Populate mobile nav from desktop wp:navigation ── */
    const linksContainer = mobileNav.querySelector('.xfact-mobile-nav__links');
    const desktopNav = document.querySelector('.xfact-desktop-nav');
    const ctaLink = mobileNav.querySelector('[data-xfact-mobile-cta]');

    if (linksContainer && desktopNav) {
        // Use Next.js hierarchical generation
        const buildNav = (ulContainer, isSubmenu) => {
            const wrapper = document.createElement(isSubmenu ? 'ul' : 'div');
            if (isSubmenu) {
                wrapper.className = 'xfact-mobile-nav__submenu';
                wrapper.style.display = 'none'; // Hidden by default
            } else {
                wrapper.className = 'xfact-mobile-nav__list';
            }

            // Find immediate li items
            const items = Array.prototype.filter.call(
                ulContainer.children,
                (node) => node.tagName === 'LI',
            );

            for (let i = 0; i < items.length; i++) {
                const li = items[i];
                const linkNode = li.querySelector(
                    ':scope > .wp-block-navigation-item__content',
                );
                const subContainer = li.querySelector(
                    ':scope > .wp-block-navigation__submenu-container',
                );

                if (!linkNode) {
                    continue;
                }

                const hasSubmenu =
                    li.classList.contains('has-child') && subContainer;

                const itemWrapper = document.createElement('div');
                itemWrapper.className = 'xfact-mobile-nav__item-wrapper';

                if (hasSubmenu) {
                    const headerDiv = document.createElement('div');
                    headerDiv.className = 'xfact-mobile-nav__item-header';

                    const a = document.createElement('a');
                    a.href = linkNode.getAttribute('href') || '#';
                    a.className = 'xfact-mobile-nav__link';
                    const span = document.createElement('span');
                    span.className = 'xfact-mobile-nav__text';
                    span.textContent = linkNode.textContent;
                    a.appendChild(span);

                    const toggleBtn = document.createElement('button');
                    toggleBtn.className = 'xfact-mobile-nav__submenu-toggle';
                    toggleBtn.setAttribute('type', 'button');
                    toggleBtn.setAttribute('aria-label', 'Toggle submenu');
                    toggleBtn.innerHTML =
                        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

                    headerDiv.appendChild(a);
                    headerDiv.appendChild(toggleBtn);
                    itemWrapper.appendChild(headerDiv);

                    const submenuEl = buildNav(subContainer, true);
                    itemWrapper.appendChild(submenuEl);

                    // Add toggle listener
                    ((btn, subEl) => {
                        btn.addEventListener('click', (e) => {
                            e.preventDefault();
                            const isClosed = subEl.style.display === 'none';
                            subEl.style.display = isClosed ? 'flex' : 'none';
                            btn.classList.toggle('is-open', isClosed);
                        });
                    })(toggleBtn, submenuEl);
                } else {
                    const singleLink = document.createElement('a');
                    singleLink.href = linkNode.getAttribute('href') || '#';
                    singleLink.className = isSubmenu
                        ? 'xfact-mobile-nav__sublink'
                        : 'xfact-mobile-nav__link';
                    const singleSpan = document.createElement('span');
                    singleSpan.className = 'xfact-mobile-nav__text';
                    singleSpan.textContent = linkNode.textContent;
                    singleLink.appendChild(singleSpan);
                    itemWrapper.appendChild(singleLink);
                }

                wrapper.appendChild(itemWrapper);
            }
            return wrapper;
        };

        const topLevelUl = desktopNav.querySelector(
            '.wp-block-navigation__container',
        );
        if (topLevelUl) {
            linksContainer.appendChild(buildNav(topLevelUl, false));
        }
    }

    /* Sync the CTA button from the desktop header */
    if (ctaLink) {
        const desktopCta = desktopNav
            ? desktopNav.querySelector('.wp-block-button__link')
            : null;
        if (desktopCta) {
            ctaLink.href = desktopCta.getAttribute('href') || ctaLink.href;
            ctaLink.textContent = desktopCta.textContent || ctaLink.textContent;
        }
    }

    /* ── Toggle logic ─────────────────────────────────── */
    let isOpen = false;

    toggle.addEventListener('click', () => {
        isOpen = !isOpen;
        mobileNav.classList.toggle('xfact-mobile-nav--open', isOpen);
        toggle.classList.toggle('xfact-mobile-toggle--open', isOpen);
        if (header) {
            header.classList.toggle('xfact-header--mobile-open', isOpen);
        }
        toggle.setAttribute('aria-expanded', String(isOpen));

        /* Prevent scroll when menu is open */
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    /* Close when a nav link is clicked */
    const links = mobileNav.querySelectorAll('a');
    for (let j = 0; j < links.length; j++) {
        links[j].addEventListener('click', () => {
            isOpen = false;
            mobileNav.classList.remove('xfact-mobile-nav--open');
            toggle.classList.remove('xfact-mobile-toggle--open');
            if (header) {
                header.classList.remove('xfact-header--mobile-open');
            }
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    }
})();
