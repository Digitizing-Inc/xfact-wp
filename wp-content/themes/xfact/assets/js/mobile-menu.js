/**
 * xFact — Mobile Menu Toggle
 *
 * Shows/hides the mobile navigation overlay when the hamburger button
 * is clicked. Matches the source template's slide-down behavior.
 *
 * @package xfact
 */

( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		var toggle = document.querySelector( '.xfact-mobile-toggle' );
		var mobileNav = document.querySelector( '.xfact-mobile-nav' );

		if ( ! toggle || ! mobileNav ) {
			return;
		}

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
		for ( var i = 0; i < links.length; i++ ) {
			links[ i ].addEventListener( 'click', function () {
				isOpen = false;
				mobileNav.classList.remove( 'xfact-mobile-nav--open' );
				toggle.classList.remove( 'xfact-mobile-toggle--open' );
				toggle.setAttribute( 'aria-expanded', 'false' );
				document.body.style.overflow = '';
			} );
		}
	} );
} )();
