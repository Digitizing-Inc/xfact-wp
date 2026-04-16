/**
 * xFact — Hero Image Slideshow
 *
 * Cross-fades hero background images every 5.5 seconds.
 * Targets elements with [data-xfact-slideshow].
 *
 * @package xfact
 */

( function () {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function () {
		var containers = document.querySelectorAll( '[data-xfact-slideshow]' );
		for ( var c = 0; c < containers.length; c++ ) {
			initSlideshow( containers[ c ] );
		}
	} );

	function initSlideshow( container ) {
		var slides = container.querySelectorAll( '.xfact-hero-slide' );
		if ( slides.length < 2 ) {
			return;
		}

		var current = 0;
		slides[ 0 ].style.opacity = '1';

		setInterval( function () {
			slides[ current ].style.opacity = '0';
			current = ( current + 1 ) % slides.length;
			slides[ current ].style.opacity = '1';
		}, 5500 );
	}
} )();
