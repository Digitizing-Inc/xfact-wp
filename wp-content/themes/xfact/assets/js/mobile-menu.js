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

	if ( ! toggle || ! mobileNav ) {
		return;
	}

	/* ── Populate mobile nav from desktop wp:navigation ── */
	var linksContainer = mobileNav.querySelector( '.xfact-mobile-nav__links' );
	var desktopNav = document.querySelector( '.xfact-desktop-nav' );
	var ctaLink = mobileNav.querySelector( '[data-xfact-mobile-cta]' );

	if ( linksContainer && desktopNav ) {
		var navLinks = desktopNav.querySelectorAll( '.wp-block-navigation-item__content' );
		for ( var i = 0; i < navLinks.length; i++ ) {
			var a = document.createElement( 'a' );
			a.href = navLinks[ i ].getAttribute( 'href' ) || '#';
			a.className = 'xfact-mobile-nav__link';
			a.textContent = navLinks[ i ].textContent;
			linksContainer.appendChild( a );
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
			toggle.setAttribute( 'aria-expanded', 'false' );
			document.body.style.overflow = '';
		} );
	}
} )();
