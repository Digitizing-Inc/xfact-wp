/**
 * xFact Team Grid — editor script.
 */
( function () {
	'use strict';

	var h = window.xfactBlockHelpers;
	var el = h.el;

	function memberControls( members, i, set ) {
		var member = members[ i ];
		function update( key, value ) {
			var arr = members.slice();
			arr[ i ] = Object.assign( {}, arr[ i ] );
			arr[ i ][ key ] = value;
			set( { teamMembers: arr } );
		}
		function remove() {
			var arr = members.slice();
			arr.splice( i, 1 );
			set( { teamMembers: arr } );
		}
		function moveItem( fromIndex, toIndex, intent ) {
			var arr = members.slice();
			if ( intent === 'swap' ) {
				var temp = arr[fromIndex];
				arr[fromIndex] = arr[toIndex];
				arr[toIndex] = temp;
			} else {
				var insertAt = intent === 'shift-bottom' ? toIndex + 1 : toIndex;
				if ( insertAt > fromIndex ) insertAt--;
				var itm = arr.splice( fromIndex, 1 )[ 0 ];
				arr.splice( insertAt, 0, itm );
			}
			set( { teamMembers: arr } );
		}

		// Social links handling
		var socialLinks = member.socialLinks || [];
		function updateSocial( sIdx, key, value ) {
			var sArr = socialLinks.slice();
			sArr[ sIdx ] = Object.assign( {}, sArr[ sIdx ] );
			sArr[ sIdx ][ key ] = value;
			update( 'socialLinks', sArr );
		}
		function addSocial() {
			update( 'socialLinks', socialLinks.concat( [ { type: 'linkedin', url: '' } ] ) );
		}
		function removeSocial( sIdx ) {
			var sArr = socialLinks.slice();
			sArr.splice( sIdx, 1 );
			update( 'socialLinks', sArr );
		}

		var socialControls = socialLinks.map( function( link, sIdx ) {
			return el( 'div', { key: 'social-' + sIdx, style: { paddingLeft: '10px', borderLeft: '2px solid #ddd', marginBottom: '8px' } },
				el( h.SelectControl, {
					label: 'Social Type',
					value: link.type || 'linkedin',
					options: [
						{ label: 'LinkedIn', value: 'linkedin' },
						{ label: 'X (Twitter)', value: 'x' },
						{ label: 'Website', value: 'website' },
						{ label: 'Email', value: 'email' },
						{ label: 'Telegram', value: 'telegram' }
					],
					onChange: function(v) { updateSocial( sIdx, 'type', v ); }
				} ),
				el( h.TextControl, { label: 'URL', value: link.url || '', onChange: function(v) { updateSocial( sIdx, 'url', v ); } } ),
				el( h.Button, { onClick: function() { removeSocial( sIdx ); }, isDestructive: true, variant: 'link' }, 'Remove Social' )
			);
		});

		socialControls.push( el( h.Button, { key: 'add-social', onClick: addSocial, variant: 'secondary' }, '+ Add Social Link' ) );
		return [
			el( h.ArrayItemWrapper, {
				key: 'card-' + i,
				index: i,
				total: members.length,
				label: 'Member ' + ( i + 1 ),
				titleText: member.title || member.name || member.label || member.heading || '',
				onRemove: remove,
				onMoveItem: moveItem
			},
				h.imageControl(
				'Profile Image',
				member.imageUrl || '',
				function ( media ) { update( 'imageUrl', media.url ); },
				function () { update( 'imageUrl', '' ); },
				'img-' + i
			),
			el( h.TextControl, { key: 'name-' + i, label: 'Name', value: member.name || '', onChange: function ( v ) { update( 'name', v ); } } ),
			el( h.TextControl, { key: 'title-' + i, label: 'Title', value: member.title || '', onChange: function ( v ) { update( 'title', v ); } } ),
				el( 'div', { key: 'socials-' + i, style: { marginTop: '12px', padding: '10px', background: '#f5f5f5' } },
					el( 'strong', { style: { display: 'block', marginBottom: '8px' } }, 'Social Links' ),
					socialControls
				)
			) ];
	}

	wp.blocks.registerBlockType( 'xfact/team-grid', {
		edit: h.createEdit( 'xfact/team-grid', 'Team Grid Settings', function ( props ) {
			var attr = props.attributes;
			var set = props.setAttributes;
			var members = attr.teamMembers || [];

			var controls = [
				el( h.TextControl, { key: 'sectionLabel', label: 'Section Label', value: attr.sectionLabel, onChange: function ( v ) { set( { sectionLabel: v } ); } } ),
				el( h.TextControl, { key: 'heading', label: 'Heading', value: attr.heading, onChange: function ( v ) { set( { heading: v } ); } } )
			];

			members.forEach( function ( _mem, i ) {
				controls = controls.concat( memberControls( members, i, set ) );
			} );

			controls.push(
				el( 'hr', { key: 'add-sep', style: { margin: '16px 0', opacity: 0.3 } } ),
				el( h.Button, {
					key: 'add',
					onClick: function () { set( { teamMembers: members.concat( [ { name: '', title: '', imageUrl: '', socialLinks: [] } ] ) } ); },
					variant: 'secondary',
					style: { width: '100%', justifyContent: 'center' },
				}, '+ Add Member' )
			);

			return controls;
		} ),
		save: function () { return null; },
	} );
} )();
