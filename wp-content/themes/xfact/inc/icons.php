<?php
/**
 * Lucide-style SVG icon helper.
 *
 * Returns an inline SVG string for the given icon name.
 * Icons are a curated subset of Lucide (https://lucide.dev)
 * used throughout xFact blocks.
 *
 * @package xfact
 */

declare(strict_types=1);

/**
 * Get an inline SVG icon by name.
 *
 * @param string $name    Icon name (e.g. 'Shield', 'Server').
 * @param string $classes Extra CSS classes for the <svg> element.
 * @return string SVG markup or empty string if icon not found.
 */
function xfact_get_icon( string $name, string $classes = '' ): string {
	/*
	 * Map icon names to Lucide SVG path data.
	 * Each entry is an array of <path> / <circle> / <rect> / <line> elements.
	 * All icons sit in a 24×24 viewBox, stroke-based, no fill.
	 */
	$icons = array(
		/* ── Solutions Grid icons ─────────────────────────── */
		'Shield'        => '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
		'Landmark'      => '<line x1="3" y1="22" x2="21" y2="22"/><line x1="6" y1="18" x2="6" y2="11"/><line x1="10" y1="18" x2="10" y2="11"/><line x1="14" y1="18" x2="14" y2="11"/><line x1="18" y1="18" x2="18" y2="11"/><polygon points="12 2 20 7 4 7"/>',
		'GraduationCap' => '<path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1 4 3 6 3s6-2 6-3v-5"/>',
		'HeartPulse'    => '<path d="M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 0 1 12 6.006a5 5 0 0 1 7.5 6.572z"/><path d="M12 6v4l1.5 2 1.5-4 1.5 2H20"/>',
		'ServerCog'     => '<circle cx="12" cy="12" r="3"/><path d="M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5"/><path d="M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5"/><path d="M6 6h.01M6 18h.01M20.83 9.02l-1.67.98M3.17 14.98l-1.67.98M20.83 14.98l1.67.98M3.17 9.02l1.67.98"/>',

		/* ── Capabilities Pipeline icons ──────────────────── */
		'Server'        => '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>',
		'ShieldCheck'   => '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
		'AppWindow'     => '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M10 4v4"/><path d="M2 8h20"/>',
		'Database'      => '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>',
		'Compass'       => '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',

		/* ── DataServ tag icons ───────────────────────────── */
		'Monitor'       => '<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>',
		'Cloud'         => '<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>',
		'School'        => '<path d="M14 22v-4a2 2 0 1 0-4 0v4"/><path d="m18 10 3.5 3"/><path d="M2.5 13 6 10"/><path d="m2 17 10-7 10 7"/><path d="M18 22V16"/><path d="M6 22V16"/>',
		'Building2'     => '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
		'Users'         => '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',

		/* ── Support channel icons ───────────────────────── */
		'Ticket'        => '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/>',
		'Phone'         => '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
		'BookOpen'      => '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',

		/* ── Careers feature card icons ──────────────────── */
		'Target'        => '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
		'Zap'           => '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
		'TrendingUp'    => '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>',

		/* ── Contact page icons ─────────────────────────── */
		'CheckCircle'   => '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
	);

	if ( ! isset( $icons[ $name ] ) ) {
		return '';
	}

	$class_attr = $classes ? ' class="' . esc_attr( $classes ) . '"' : '';

	return sprintf(
		'<svg%s xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">%s</svg>',
		$class_attr,
		$icons[ $name ]
	);
}
