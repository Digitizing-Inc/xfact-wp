/**
 * xFact — Dark Mode Toggle
 *
 * Reads preference from localStorage; falls back to system preference.
 * Loaded in <head> to prevent flash of wrong theme.
 *
 * @package xfact
 */

( function () {
	'use strict';

	var STORAGE_KEY = 'xfact-theme';

	function getPreference() {
		var stored = localStorage.getItem( STORAGE_KEY );
		if ( stored === 'dark' || stored === 'light' ) {
			return stored;
		}
		// Default to 'dark' if no preference is set, matching the Vercel theme.
		return window.matchMedia( '(prefers-color-scheme: light)' ).matches ? 'light' : 'dark';
	}

	function apply( theme, isExplicit = true ) {
		var isDark = theme === 'dark';
		document.documentElement.setAttribute( 'data-theme', theme );
		document.documentElement.setAttribute( 'data-xfact-dark', String( isDark ) );
		
		if ( isExplicit ) {
			localStorage.setItem( STORAGE_KEY, theme );
		}

		/* Update all toggle buttons' aria-label */
		var toggles = document.querySelectorAll( '.xfact-dark-mode-toggle, .xfact-theme-toggle' );
		for ( var i = 0; i < toggles.length; i++ ) {
			toggles[ i ].setAttribute(
				'aria-label',
				isDark ? 'Switch to light mode' : 'Switch to dark mode'
			);
		}
		/* Sync with parent frame if in iframe (e.g. Theme Settings Live Preview) */
		if ( window !== window.parent ) {
			window.parent.postMessage( { type: 'xfact_theme_changed', value: theme }, '*' );
		}
	}

	/* Apply immediately (runs in <head> so no FOUC), don't set explicit storage */
	apply( getPreference(), false );

	/* Bind toggle buttons after DOM ready */
	document.addEventListener( 'DOMContentLoaded', function () {
		var toggles = document.querySelectorAll( '.xfact-dark-mode-toggle, .xfact-theme-toggle' );
		for ( var i = 0; i < toggles.length; i++ ) {
			toggles[ i ].addEventListener( 'click', function () {
				var current = document.documentElement.getAttribute( 'data-theme' );
				apply( current === 'dark' ? 'light' : 'dark' );
			} );
		}
	} );

	/* Listen for system preference changes */
	window.matchMedia( '(prefers-color-scheme: dark)' ).addEventListener( 'change', function ( e ) {
		if ( ! localStorage.getItem( STORAGE_KEY ) ) {
			apply( e.matches ? 'dark' : 'light' );
		}
	} );
} )();
