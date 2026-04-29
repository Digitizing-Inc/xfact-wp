/**
 * xFact Capability Areas — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function areaControls( areas, i, set ) {
		var area = areas[ i ];
		function update( key, value ) {
			var arr = areas.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { areas: arr } );
		}
		function remove() {
			var arr = areas.slice();
			arr.splice( i, 1 );
			set( { areas: arr } );
		}

		return [
			el( 'hr', { key: 'sep-' + i, style: { margin: '8px 0', opacity: 0.3 } } ),
			el( 'div', {
				key: 'hdr-' + i,
				style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
			},
				el( 'strong', null, 'Area ' + ( i + 1 ) ),
				el( h.Button, { onClick: remove, variant: 'link', isDestructive: true, style: { fontSize: '12px' } }, '✕ Remove' )
			),
			el( h.TextControl, {
				key: 'title-' + i,
				label: 'Title',
				value: area.title || '',
				onChange: function ( v ) { update( 'title', v ); }
			} ),
			el( h.TextControl, {
				key: 'headline-' + i,
				label: 'Headline',
				value: area.headline || '',
				onChange: function ( v ) { update( 'headline', v ); }
			} ),
			el( h.TextareaControl, {
				key: 'body-' + i,
				label: 'Body',
				value: area.body || '',
				onChange: function ( v ) { update( 'body', v ); }
			} ),
			el( h.TextControl, {
				key: 'iconName-' + i,
				label: 'Icon Name (Lucide)',
				value: area.iconName || '',
				onChange: function ( v ) { update( 'iconName', v ); }
			} ),
			el( h.TextControl, {
				key: 'anchor-' + i,
				label: 'HTML Anchor (ID)',
				value: area.anchor || '',
				onChange: function ( v ) { update( 'anchor', v ); }
			} ),
			el( h.TextareaControl, {
				key: 'services-' + i,
				label: 'Services (comma separated)',
				value: ( area.services || [] ).join( ', ' ),
				onChange: function ( v ) { update( 'services', v.split( ',' ).map( function ( s ) { return s.trim(); } ).filter( Boolean ) ); }
			} ),
		];
	}

	wp.blocks.registerBlockType( 'xfact/capability-areas', {
		edit: h.createEdit( 'xfact/capability-areas', 'Capability Areas', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var areas = attr.areas || [];

			var controls = [];

			if ( areas.length > 0 ) {
				controls.push( el( 'strong', { key: 'areas-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Areas (' + areas.length + ')' ) );
				areas.forEach( function ( _area, i ) {
					controls = controls.concat( areaControls( areas, i, set ) );
				} );
			}

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add',
					onClick: function () {
						set( {
							areas: areas.concat( [ {
								title: '',
								headline: '',
								body: '',
								iconName: 'Circle',
								anchor: '',
								services: []
							} ] )
						} );
					},
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Area' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
