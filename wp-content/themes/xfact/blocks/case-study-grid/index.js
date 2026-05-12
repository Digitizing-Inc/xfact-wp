/**
 * xFact Case Study Grid — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function itemControls( items, i, set, caseStudies ) {
		var item = items[ i ];
		function update( key, value ) {
			var arr = items.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { items: arr } );
		}
		function remove() {
			var arr = items.slice();
			arr.splice( i, 1 );
			set( { items: arr } );
		}

		var options = [];
		if ( caseStudies ) {
			caseStudies.forEach( function ( cs ) {
				var title = cs.title.rendered || 'Untitled';
				var txt = document.createElement( 'textarea' );
				txt.innerHTML = title;
				options.push( { label: txt.value, value: cs.id } );
			} );
		}

		// Handle legacy items: if postId is missing but linkUrl exists, try to match it
		var currentPostId = item.postId;
		if ( ! currentPostId && item.linkUrl && caseStudies ) {
			var matched = caseStudies.find( function ( cs ) {
				// Match if link ends with the same path, or exact match
				return cs.link === item.linkUrl || cs.link.indexOf( item.linkUrl ) > -1;
			} );
			if ( matched ) {
				currentPostId = matched.id;
			}
		}

		function onSelectCaseStudy( postId ) {
			if ( ! postId ) {
				update( 'postId', '' );
				return;
			}
			var selected = caseStudies.find( function ( cs ) { return cs.id === parseInt( postId, 10 ); } );
			if ( selected ) {
				var arr = items.slice();
				arr[ i ] = Object.assign( {}, arr[ i ] );
				arr[ i ].postId = selected.id;
				
				var txt = document.createElement( 'textarea' );
				txt.innerHTML = selected.title.rendered;
				arr[ i ].title = txt.value;
				
				arr[ i ].linkUrl = selected.link;

				// Try to extract summary and source from the case-study-details block
				var detailsSummary = '';
				var detailsSource = '';
				if ( selected.content && selected.content.raw && wp.blocks && wp.blocks.parse ) {
					var parsedBlocks = wp.blocks.parse( selected.content.raw );
					var detailsBlock = parsedBlocks.find( function ( b ) { return b.name === 'xfact/case-study-details'; } );
					if ( detailsBlock && detailsBlock.attributes ) {
						detailsSummary = detailsBlock.attributes.summary || '';
						detailsSource = detailsBlock.attributes.source || '';
					}
				}

				if ( detailsSummary ) {
					arr[ i ].summary = detailsSummary;
				} else if ( selected.excerpt ) {
					// Fallback to excerpt
					var tmp = document.createElement( 'DIV' );
					tmp.innerHTML = selected.excerpt.rendered;
					arr[ i ].summary = tmp.textContent || tmp.innerText || '';
				} else {
					arr[ i ].summary = '';
				}

				arr[ i ].source = detailsSource;

				set( { items: arr } );
			} else {
				update( 'postId', postId );
			}
		}

		return [
			el( 'div', {
				key: 'item-' + i,
				style: { border: '1px solid #ddd', padding: '12px', marginBottom: '12px', borderRadius: '4px' },
			},
				el( h.ComboboxControl, {
					label: 'Select Case Study',
					value: currentPostId || '',
					options: options,
					onChange: onSelectCaseStudy
				} ),
				el( h.Disabled, null,
					el( h.TextareaControl, { label: 'Summary (Auto-fetched)', value: item.summary || '', rows: 3 } ),
					el( h.TextControl, { label: 'Source (Auto-fetched)', value: item.source || '' } )
				),
				el( h.Button, { onClick: remove, variant: 'link', isDestructive: true }, 'Remove Case Study' )
			),
		];
	}

	wp.blocks.registerBlockType( 'xfact/case-study-grid', {
		edit: h.createEdit( 'xfact/case-study-grid', 'Case Study Grid Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var items = attr.items || [];

			var caseStudies = h.useSelect ? h.useSelect( function ( select ) {
				return select( 'core' ).getEntityRecords( 'postType', 'case_study', { per_page: -1 } );
			}, [] ) : [];

			var controls = [
				el( h.TextControl, { key: 'anchor', label: 'Section ID (HTML Anchor)', value: attr.anchor || '', onChange: function ( v ) { set( { anchor: v } ); } } ),
				el( 'hr', { key: 'sep1', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel || '', onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Section Heading', value: attr.heading || '', onChange: function ( v ) { set( { heading: v } ); } } ),
				el( h.TextareaControl, { key: 'description', label: 'Section Description', value: attr.description || '', onChange: function ( v ) { set( { description: v } ); } } )
			];

			if ( items.length > 0 ) {
				controls.push( el( 'strong', { key: 'items-hdr', style: { display: 'block', marginBottom: '8px' } }, 'Case Studies (' + items.length + ')' ) );
				items.forEach( function ( _item, i ) {
					controls = controls.concat( itemControls( items, i, set, caseStudies ) );
				} );
			}

			controls.push(
				el( h.Button, {
					key: 'add-item',
					onClick: function () { set( { items: items.concat( [ { title: '', summary: '', source: '', postId: '' } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center', marginTop: '8px' },
				}, '+ Add Case Study' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
}() );
