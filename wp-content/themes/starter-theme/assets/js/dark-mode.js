/**
 * Dark mode toggle.
 *
 * Handles the frontend toggle button, persists preference to localStorage,
 * and respects the user's OS-level prefers-color-scheme setting.
 *
 * @package starter-theme
 */

( function () {
	var STORAGE_KEY = 'starter-theme-dark-mode';

	/**
	 * Get the user's dark mode preference.
	 *
	 * @return {boolean} True if dark mode should be active.
	 */
	function getPreference() {
		var saved = localStorage.getItem( STORAGE_KEY );
		if ( saved !== null ) {
			return saved === 'true';
		}
		return window.matchMedia( '(prefers-color-scheme: dark)' ).matches;
	}

	/**
	 * Apply dark mode state to the document.
	 *
	 * @param {boolean} isDark Whether dark mode is active.
	 */
	function applyDarkMode( isDark ) {
		document.documentElement.setAttribute( 'data-dark-mode', isDark );
		localStorage.setItem( STORAGE_KEY, isDark );
	}

	/**
	 * Update the toggle button icon and aria-label.
	 *
	 * @param {boolean} isDark Whether dark mode is active.
	 */
	function updateButton( isDark ) {
		var btn = document.getElementById( 'dark-mode-toggle' );
		if ( ! btn ) {
			return;
		}
		btn.setAttribute(
			'aria-label',
			isDark ? 'Switch to light mode' : 'Switch to dark mode'
		);
	}

	// Apply preference immediately (inline in <head> prevents FOUC).
	applyDarkMode( getPreference() );

	// Bind toggle button after DOM is ready.
	document.addEventListener( 'DOMContentLoaded', function () {
		var btn = document.getElementById( 'dark-mode-toggle' );
		if ( ! btn ) {
			return;
		}
		updateButton( getPreference() );
		btn.addEventListener( 'click', function () {
			var isDark =
				document.documentElement.getAttribute( 'data-dark-mode' ) !== 'true';
			applyDarkMode( isDark );
			updateButton( isDark );
		} );
	} );

	// Listen for OS-level preference changes (only if no manual preference saved).
	window
		.matchMedia( '(prefers-color-scheme: dark)' )
		.addEventListener( 'change', function ( e ) {
			if ( localStorage.getItem( STORAGE_KEY ) === null ) {
				applyDarkMode( e.matches );
				updateButton( e.matches );
			}
		} );
} )();
