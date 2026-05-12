/**
 * xFact Block Editor — shared utilities.
 *
 * Provides helpers used by all xFact block editor scripts.
 * Must be enqueued BEFORE individual block scripts.
 */
( function () {
	'use strict';

	var el = wp.element.createElement;
	var Fragment = wp.element.Fragment;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var MediaUpload = wp.blockEditor.MediaUpload;
	var MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
	var useBlockProps = wp.blockEditor.useBlockProps;
	var PanelBody = wp.components.PanelBody;
	var TextControl = wp.components.TextControl;
	var TextareaControl = wp.components.TextareaControl;
	var Button = wp.components.Button;
	var Disabled = wp.components.Disabled;
	var ToggleControl = wp.components.ToggleControl;
	var SelectControl = wp.components.SelectControl;
	var ComboboxControl = wp.components.ComboboxControl;
	var useSelect = wp.data ? wp.data.useSelect : null;

	/* ServerSideRender can be a default export in some WP versions */
	var SSR = wp.serverSideRender;
	if ( typeof SSR !== 'function' && SSR && typeof SSR.default === 'function' ) {
		SSR = SSR.default;
	}

	/**
	 * Build a simple edit component for an xFact dynamic block.
	 *
	 * @param {string}   blockName  Fully qualified block name, e.g. "xfact/hero".
	 * @param {string}   panelTitle Panel title shown in the sidebar.
	 * @param {Function} controlsFn A function( props ) returning an array of elements.
	 * @return {Function} React edit component.
	 */
	function createEdit( blockName, panelTitle, controlsFn ) {
		return function EditComponent( props ) {
			var blockProps = useBlockProps();
			var inspectorChildren;

			try {
				inspectorChildren = controlsFn ? controlsFn( props ) : [];
			} catch ( e ) {
				// eslint-disable-next-line no-console
				console.error( '[xfact] Error in controls for ' + blockName, e );
				inspectorChildren = [
					el( 'p', { key: 'err', style: { color: 'red' } },
						'Error rendering controls: ' + e.message
					),
				];
			}

			return el(
				Fragment,
				null,
				el(
					InspectorControls,
					null,
					el(
						PanelBody,
						{ title: panelTitle, initialOpen: true },
						inspectorChildren
					)
				),
				el(
					'div',
					blockProps,
					el( Disabled, null,
						el( SSR, {
							block: blockName,
							attributes: props.attributes,
						} )
					)
				)
			);
		};
	}

	/**
	 * Build a single-image upload control for use in InspectorControls.
	 *
	 * @param {string}   label     Label shown above the control.
	 * @param {string}   imageUrl  Current image URL (or empty string).
	 * @param {Function} onSelect  Callback( mediaObject ) when an image is chosen.
	 * @param {Function} onRemove  Callback() when "Remove" is clicked.
	 * @param {string}   [key]     Optional React key.
	 * @return {Object} React element.
	 */
	function imageControl( label, imageUrl, onSelect, onRemove, key ) {
		var children = [
			el( 'label', {
				key: 'lbl',
				style: {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, label ),
		];

		if ( imageUrl ) {
			children.push(
				el( 'div', { key: 'preview', style: { marginBottom: '8px' } },
					el( 'img', {
						src: imageUrl,
						alt: label,
						style: {
							maxWidth: '100%',
							height: 'auto',
							borderRadius: '4px',
							border: '1px solid #ddd',
						},
					} )
				)
			);
		}

		children.push(
			el( MediaUploadCheck, { key: 'upload-check' },
				el( MediaUpload, {
					onSelect: onSelect,
					allowedTypes: [ 'image' ],
					render: function ( obj ) {
						return el(
							Button,
							{
								onClick: obj.open,
								variant: imageUrl ? 'secondary' : 'primary',
								style: { marginRight: '8px' },
							},
							imageUrl ? 'Replace Image' : 'Upload Image'
						);
					},
				} )
			)
		);

		if ( imageUrl ) {
			children.push(
				el( Button, {
					key: 'remove',
					onClick: onRemove,
					variant: 'link',
					isDestructive: true,
				}, 'Remove' )
			);
		}

		return el( 'div', {
			key: key || 'img-ctrl-' + label,
			style: { marginBottom: '16px' },
		}, children );
	}

	/**
	 * Build a multi-image gallery control for use in InspectorControls.
	 *
	 * @param {string}   label    Label shown above the control.
	 * @param {Array}    images   Array of { url, id, alt } objects.
	 * @param {Function} onAdd    Callback( mediaObject ) when a new image is added.
	 * @param {Function} onRemove Callback( index ) when an image is removed.
	 * @param {string}   [key]    Optional React key.
	 * @return {Object} React element.
	 */
	function galleryControl( label, images, onAdd, onRemove, key ) {
		var safeImages = images || [];
		var items = safeImages.map( function ( img, i ) {
			return el( 'div', {
				key: 'gi-' + i,
				style: {
					display: 'inline-block',
					position: 'relative',
					marginRight: '8px',
					marginBottom: '8px',
				},
			},
				el( 'img', {
					src: img.url || img.src || '',
					alt: img.alt || '',
					style: {
						width: '80px',
						height: '60px',
						objectFit: 'cover',
						borderRadius: '4px',
						border: '1px solid #ddd',
						display: 'block',
					},
				} ),
				el( Button, {
					onClick: function () { onRemove( i ); },
					variant: 'link',
					isDestructive: true,
					style: { fontSize: '11px', padding: '0', display: 'block' },
				}, '×' )
			);
		} );

		return el( 'div', {
			key: key || 'gallery-ctrl-' + label,
			style: { marginBottom: '16px' },
		},
			el( 'label', {
				style: {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, label + ' (' + safeImages.length + ')' ),
			el( 'div', null, items ),
			el( MediaUploadCheck, null,
				el( MediaUpload, {
					onSelect: onAdd,
					allowedTypes: [ 'image' ],
					render: function ( obj ) {
						return el( Button, {
							onClick: obj.open,
							variant: 'secondary',
						}, 'Add Image' );
					},
				} )
			)
		);
	}

	// Expose to window for use by individual block scripts.
	window.xfactBlockHelpers = {
		el: el,
		createEdit: createEdit,
		imageControl: imageControl,
		galleryControl: galleryControl,
		Fragment: Fragment,
		InspectorControls: InspectorControls,
		MediaUpload: MediaUpload,
		MediaUploadCheck: MediaUploadCheck,
		useBlockProps: useBlockProps,
		PanelBody: PanelBody,
		TextControl: TextControl,
		TextareaControl: TextareaControl,
		Button: Button,
		Disabled: Disabled,
		ToggleControl: ToggleControl,
		SelectControl: SelectControl,
		ComboboxControl: ComboboxControl,
		useSelect: useSelect,
		ServerSideRender: SSR,
	};
} )();
