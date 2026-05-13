/**
 * xFact — Header Scroll Effect
 *
 * Toggles `.xfact-header--scrolled` on the site header when the user
 * scrolls past 20px, matching the source template's transparent-to-opaque
 * header transition.
 *
 * Also handles the WP admin bar on mobile (≤782px): the admin bar becomes
 * position:absolute after scrolling, so we adjust the header's top offset
 * to prevent a gap.
 *
 * @package xfact
 */

( function () {
	'use strict';

	var SCROLL_THRESHOLD = 20;
	var ADMIN_BAR_HEIGHT = 46; /* WP admin bar height on mobile */
	var ADMIN_BAR_DESKTOP = 32; /* WP admin bar height on desktop */
	var MOBILE_BREAKPOINT = 782;

	document.addEventListener( 'DOMContentLoaded', function () {
		var header = document.querySelector( '.xfact-header' );
		if ( ! header ) {
			return;
		}

		var isAdminBar = document.body.classList.contains( 'admin-bar' );

		/* Active Navigation State logic */
		var currentPath = window.location.pathname.replace(/\/+$/, '');
		if (currentPath === '') currentPath = '/';

		var navLinks = header.querySelectorAll( 'nav.wp-block-navigation a' );
		navLinks.forEach( function( link ) {
			try {
				var linkPath = new URL( link.href, window.location.origin ).pathname.replace(/\/+$/, '');
				if (linkPath === '') linkPath = '/';

				// Highlight if it's an exact match
				if ( linkPath === currentPath ) {
					link.setAttribute( 'aria-current', 'page' );
					
					// Also mark parent if it's a submenu
					var parentMenuItem = link.closest( '.wp-block-navigation-item.has-child' );
					if ( parentMenuItem ) {
						parentMenuItem.classList.add( 'current-menu-ancestor' );
					}
				}
			} catch ( e ) {}
		} );


		function onScroll() {
			var scrollY = window.scrollY;

			/* Toggle scrolled state */
			if ( scrollY > SCROLL_THRESHOLD ) {
				header.classList.add( 'xfact-header--scrolled' );
			} else {
				header.classList.remove( 'xfact-header--scrolled' );
			}

			/* Admin bar offset on mobile: the admin bar starts as position:fixed
			   but becomes position:absolute after scrolling past its height.
			   Adjust the header top to compensate. */
			if ( isAdminBar && window.innerWidth <= MOBILE_BREAKPOINT ) {
				var offset = Math.max( 0, ADMIN_BAR_HEIGHT - scrollY );
				header.style.top = offset + 'px';
			} else if ( isAdminBar ) {
				header.style.top = ADMIN_BAR_DESKTOP + 'px';
			} else {
				header.style.top = '0px';
			}
		}

		window.addEventListener( 'scroll', onScroll, { passive: true } );

		/* Run once on load in case page loads mid-scroll. */
		onScroll();
	} );
} )();
