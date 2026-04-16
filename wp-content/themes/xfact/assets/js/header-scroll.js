/**
 * xFact — Header Scroll Effect
 *
 * Toggles `.xfact-header--scrolled` on the site header when the user
 * scrolls past 20px, matching the source template's transparent-to-opaque
 * header transition.
 *
 * @package xfact
 */

( function () {
	'use strict';

	var SCROLL_THRESHOLD = 20;

	document.addEventListener( 'DOMContentLoaded', function () {
		var header = document.querySelector( '.xfact-header' );
		if ( ! header ) {
			return;
		}

		function onScroll() {
			if ( window.scrollY > SCROLL_THRESHOLD ) {
				header.classList.add( 'xfact-header--scrolled' );
			} else {
				header.classList.remove( 'xfact-header--scrolled' );
			}
		}

		window.addEventListener( 'scroll', onScroll, { passive: true } );

		/* Run once on load in case page loads mid‑scroll. */
		onScroll();
	} );
} )();
