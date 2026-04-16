/**
 * xFact — Scroll Fade-In (Progressive Enhancement)
 *
 * Uses IntersectionObserver to reveal elements with the
 * .xfact-fade-in class when they enter the viewport.
 *
 * Progressive enhancement strategy:
 * 1. CSS default: .xfact-fade-in is visible (opacity: 1)
 * 2. JS adds .xfact-has-fade class to <html>, enabling the hidden state
 * 3. IntersectionObserver adds .is-visible to reveal on scroll
 * 4. Safety timer: after 1.5s, any still-hidden element is force-revealed
 *
 * This ensures content is NEVER permanently hidden regardless of
 * IntersectionObserver quirks, script loading order, or JS failures.
 *
 * @package xfact
 */

( function () {
	'use strict';

	if ( ! ( 'IntersectionObserver' in window ) ) {
		/* No observer support — just leave everything visible */
		return;
	}

	/* Enable the hidden-by-default state now that JS is confirmed working */
	document.documentElement.classList.add( 'xfact-has-fade' );

	var observer = new IntersectionObserver(
		function ( entries ) {
			for ( var i = 0; i < entries.length; i++ ) {
				if ( entries[ i ].isIntersecting ) {
					entries[ i ].target.classList.add( 'is-visible' );
					observer.unobserve( entries[ i ].target );
				}
			}
		},
		{
			threshold: 0.01,
			rootMargin: '0px 0px 200px 0px',
		}
	);

	/**
	 * Observe all fade-in targets.
	 * Script loads in footer, so the DOM is already available.
	 */
	function observeAll() {
		var elements = document.querySelectorAll( '.xfact-fade-in:not(.is-visible)' );
		for ( var i = 0; i < elements.length; i++ ) {
			observer.observe( elements[ i ] );
		}
	}

	/**
	 * Safety net: force-reveal any elements that the observer missed
	 * after 1.5 seconds. This handles edge cases where the observer
	 * does not fire (e.g. unusual viewport states, certain browsers).
	 */
	function forceRevealAll() {
		var hidden = document.querySelectorAll( '.xfact-fade-in:not(.is-visible)' );
		for ( var i = 0; i < hidden.length; i++ ) {
			hidden[ i ].classList.add( 'is-visible' );
		}
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', observeAll );
	} else {
		observeAll();
	}

	/* Safety timer — ensure nothing stays hidden */
	setTimeout( forceRevealAll, 1500 );
} )();
