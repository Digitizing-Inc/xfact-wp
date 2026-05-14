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

( function () {
	'use strict';

	var toggle = document.querySelector( '.xfact-mobile-toggle' );
	var mobileNav = document.querySelector( '.xfact-mobile-nav' );
	var header = document.querySelector( '.xfact-header' );

	if ( ! toggle || ! mobileNav ) {
		return;
	}

	/* ── Populate mobile nav from desktop wp:navigation ── */
	var linksContainer = mobileNav.querySelector( '.xfact-mobile-nav__links' );
	var desktopNav = document.querySelector( '.xfact-desktop-nav' );
	var ctaLink = mobileNav.querySelector( '[data-xfact-mobile-cta]' );

	if ( linksContainer && desktopNav ) {
		// Use Next.js hierarchical generation
		var buildNav = function ( ulContainer, isSubmenu ) {
			var wrapper = document.createElement( isSubmenu ? 'ul' : 'div' );
			if ( isSubmenu ) {
				wrapper.className = 'xfact-mobile-nav__submenu';
				wrapper.style.display = 'none'; // Hidden by default
			} else {
				wrapper.className = 'xfact-mobile-nav__list';
			}

			// Find immediate li items
			var items = Array.prototype.filter.call( ulContainer.children, function ( node ) {
				return node.tagName === 'LI';
			} );

			for ( var i = 0; i < items.length; i++ ) {
				var li = items[ i ];
				var linkNode = li.querySelector( ':scope > .wp-block-navigation-item__content' );
				var subContainer = li.querySelector( ':scope > .wp-block-navigation__submenu-container' );

				if ( ! linkNode ) {
					continue;
				}

				var hasSubmenu = li.classList.contains( 'has-child' ) && subContainer;

				var itemWrapper = document.createElement( 'div' );
				itemWrapper.className = 'xfact-mobile-nav__item-wrapper';

				if ( hasSubmenu ) {
					var headerDiv = document.createElement( 'div' );
					headerDiv.className = 'xfact-mobile-nav__item-header';

					var a = document.createElement( 'a' );
					a.href = linkNode.getAttribute( 'href' ) || '#';
					a.className = 'xfact-mobile-nav__link';
					a.textContent = linkNode.textContent;

					var toggleBtn = document.createElement( 'button' );
					toggleBtn.className = 'xfact-mobile-nav__submenu-toggle';
					toggleBtn.setAttribute( 'type', 'button' );
					toggleBtn.setAttribute( 'aria-label', 'Toggle submenu' );
					toggleBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';

					headerDiv.appendChild( a );
					headerDiv.appendChild( toggleBtn );
					itemWrapper.appendChild( headerDiv );

					var submenuEl = buildNav( subContainer, true );
					itemWrapper.appendChild( submenuEl );

					// Add toggle listener
					( function ( btn, subEl ) {
						btn.addEventListener( 'click', function ( e ) {
							e.preventDefault();
							var isClosed = subEl.style.display === 'none';
							subEl.style.display = isClosed ? 'flex' : 'none';
							btn.classList.toggle( 'is-open', isClosed );
						} );
					} )( toggleBtn, submenuEl );
				} else {
					var singleLink = document.createElement( 'a' );
					singleLink.href = linkNode.getAttribute( 'href' ) || '#';
					singleLink.className = isSubmenu ? 'xfact-mobile-nav__sublink' : 'xfact-mobile-nav__link';
					singleLink.textContent = linkNode.textContent;
					itemWrapper.appendChild( singleLink );
				}

				wrapper.appendChild( itemWrapper );
			}
			return wrapper;
		};

		var topLevelUl = desktopNav.querySelector( '.wp-block-navigation__container' );
		if ( topLevelUl ) {
			linksContainer.appendChild( buildNav( topLevelUl, false ) );
		}
	}

	/* Sync the CTA button from the desktop header */
	if ( ctaLink ) {
		var desktopCta = desktopNav
			? desktopNav.querySelector( '.wp-block-button__link' )
			: null;
		if ( desktopCta ) {
			ctaLink.href = desktopCta.getAttribute( 'href' ) || ctaLink.href;
			ctaLink.textContent = desktopCta.textContent || ctaLink.textContent;
		}
	}

	/* ── Toggle logic ─────────────────────────────────── */
	var isOpen = false;

	toggle.addEventListener( 'click', function () {
		isOpen = ! isOpen;
		mobileNav.classList.toggle( 'xfact-mobile-nav--open', isOpen );
		toggle.classList.toggle( 'xfact-mobile-toggle--open', isOpen );
		if ( header ) {
			header.classList.toggle( 'xfact-header--mobile-open', isOpen );
		}
		toggle.setAttribute( 'aria-expanded', String( isOpen ) );

		/* Prevent scroll when menu is open */
		document.body.style.overflow = isOpen ? 'hidden' : '';
	} );

	/* Close when a nav link is clicked */
	var links = mobileNav.querySelectorAll( 'a' );
	for ( var j = 0; j < links.length; j++ ) {
		links[ j ].addEventListener( 'click', function () {
			isOpen = false;
			mobileNav.classList.remove( 'xfact-mobile-nav--open' );
			toggle.classList.remove( 'xfact-mobile-toggle--open' );
			if ( header ) {
				header.classList.remove( 'xfact-header--mobile-open' );
			}
			toggle.setAttribute( 'aria-expanded', 'false' );
			document.body.style.overflow = '';
		} );
	}
} )();
