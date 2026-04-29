/**
 * xFact Solutions Grid — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	/**
	 * Build controls for a single sector card.
	 *
	 * @param {Array}    sectors Current sectors array.
	 * @param {number}   i       Index of this card.
	 * @param {Function} set     setAttributes helper.
	 * @return {Array} Array of React elements for this card.
	 */
	function cardControls( sectors, i, set ) {
		var card = sectors[ i ];

		function updateCard( key, value ) {
			var updated = sectors.slice();
			updated[ i ] = Object.assign( {}, updated[ i ] );
			updated[ i ][ key ] = value;
			set( { sectors: updated } );
		}

		function removeCard() {
			var updated = sectors.slice();
			updated.splice( i, 1 );
			set( { sectors: updated } );
		}

		return [
			el( 'hr', { key: 'sep-' + i, style: { margin: '16px 0', opacity: 0.3 } } ),
			el( 'div', {
				key: 'card-header-' + i,
				style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
			},
				el( 'strong', null, 'Card ' + ( i + 1 ) ),
				el( h.Button, {
					onClick: removeCard,
					variant: 'link',
					isDestructive: true,
					style: { fontSize: '12px' },
				}, '✕ Remove' )
			),
			el( h.TextControl, {
				key: 'title-' + i,
				label: 'Title',
				value: card.title || '',
				onChange: function ( v ) { updateCard( 'title', v ); },
			} ),
			el( h.TextControl, {
				key: 'badge-' + i,
				label: 'Badge',
				value: card.badge || '',
				onChange: function ( v ) { updateCard( 'badge', v ); },
			} ),
			el( h.TextControl, {
				key: 'headline-' + i,
				label: 'Headline',
				value: card.headline || '',
				onChange: function ( v ) { updateCard( 'headline', v ); },
			} ),
			el( h.TextareaControl, {
				key: 'desc-' + i,
				label: 'Description',
				value: card.description || '',
				onChange: function ( v ) { updateCard( 'description', v ); },
			} ),
			el( h.TextControl, {
				key: 'icon-' + i,
				label: 'Icon Name (Lucide)',
				value: card.iconName || '',
				onChange: function ( v ) { updateCard( 'iconName', v ); },
				help: 'e.g. Shield, Landmark, GraduationCap, HeartPulse, ServerCog',
			} ),
			el( h.TextControl, {
				key: 'href-' + i,
				label: 'Link URL',
				value: card.href || '',
				onChange: function ( v ) { updateCard( 'href', v ); },
			} ),
			h.imageControl(
				'Card Image',
				card.imageUrl || '',
				function ( media ) { updateCard( 'imageUrl', media.url ); },
				function () { updateCard( 'imageUrl', '' ); },
				'img-' + i
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/solutions-grid', {
		edit: h.createEdit( 'xfact/solutions-grid', 'Solutions Grid Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var sectors = attr.sectors || [];

			/* ── Section-level controls ── */
			var controls = [
				el( h.TextControl, {
					key: 'sectionLabel',
					label: 'Section Label',
					value: attr.sectionLabel,
					onChange: function ( v ) { set( { sectionLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'heading',
					label: 'Heading',
					value: attr.heading,
					onChange: function ( v ) { set( { heading: v } ); },
				} ),
				el( h.TextareaControl, {
					key: 'subtitle',
					label: 'Subtitle',
					value: attr.subtitle,
					onChange: function ( v ) { set( { subtitle: v } ); },
				} ),
				el( h.TextControl, {
					key: 'buttonLabel',
					label: 'Button Label',
					value: attr.buttonLabel,
					onChange: function ( v ) { set( { buttonLabel: v } ); },
				} ),
				el( h.TextControl, {
					key: 'buttonHref',
					label: 'Button Link',
					value: attr.buttonHref,
					onChange: function ( v ) { set( { buttonHref: v } ); },
				} ),
				h.imageControl(
					'Section Image',
					attr.sectionImage,
					function ( media ) { set( { sectionImage: media.url, sectionImageAlt: media.alt || '' } ); },
					function () { set( { sectionImage: '', sectionImageAlt: '' } ); },
					'sectionImage'
				),
			];

			/* ── Per-card controls ── */
			sectors.forEach( function ( _sector, i ) {
				controls = controls.concat( cardControls( sectors, i, set ) );
			} );

			/* ── Add card button ── */
			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add-card',
					onClick: function () {
						set( { sectors: sectors.concat( [ { title: '', description: '', iconName: 'Circle', href: '' } ] ) } );
					},
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Card' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
