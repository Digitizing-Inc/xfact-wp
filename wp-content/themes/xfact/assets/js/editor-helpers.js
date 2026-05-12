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
	var useState = wp.element.useState;
	var useEffect = wp.element.useEffect;
	var useRef = wp.element.useRef;
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
	var Modal = wp.components.Modal;
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

	/**
	 * Render an SVG safely with a wrapper.
	 */
	function renderSvg( innerHtml ) {
		if ( ! innerHtml ) {
			return '';
		}
		return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="fill: none; stroke: currentColor;">' + innerHtml + '</svg>';
	}

	/**
	 * Build a visual Icon Picker control for use in InspectorControls.
	 *
	 * @param {string}   label    Label shown above the control.
	 * @param {string}   value    Current icon name (e.g. 'Shield').
	 * @param {Function} onChange Callback( iconName ).
	 * @param {string}   [key]    Optional React key.
	 * @return {Object} React element.
	 */
	function iconControl( label, value, onChange, key ) {
		return el( IconPickerControl, {
			key: key || 'icon-ctrl-' + label,
			label: label,
			value: value,
			onChange: onChange,
		} );
	}

	function IconPickerControl( props ) {
		var isModalOpenState = useState( false );
		var isModalOpen = isModalOpenState[ 0 ];
		var setIsModalOpen = isModalOpenState[ 1 ];

		var searchQueryState = useState( '' );
		var searchQuery = searchQueryState[ 0 ];
		var setSearchQuery = searchQueryState[ 1 ];

		var visibleCountState = useState( 100 );
		var visibleCount = visibleCountState[ 0 ];
		var setVisibleCount = visibleCountState[ 1 ];

		var icons = window.xfactLucideIcons || {};
		var iconNames = Object.keys( icons );

		var filteredIcons = iconNames.filter( function ( name ) {
			return name.toLowerCase().indexOf( searchQuery.toLowerCase() ) !== -1;
		} ).slice( 0, visibleCount );

		var loaderRef = useRef( null );

		useEffect( function () {
			if ( ! isModalOpen ) return;

			var observer = new IntersectionObserver( function ( entries ) {
				if ( entries[ 0 ].isIntersecting ) {
					setVisibleCount( function ( prev ) { return prev + 100; } );
				}
			}, { rootMargin: '200px' } );

			if ( loaderRef.current ) {
				observer.observe( loaderRef.current );
			}

			return function () {
				observer.disconnect();
			};
		}, [ isModalOpen, filteredIcons.length ] );

		// Current selected SVG or a fallback empty placeholder
		var currentSvg = renderSvg( icons[ props.value ] );

		// Button to open modal
		var openButton = el( Button, {
			variant: 'secondary',
			onClick: function () { setIsModalOpen( true ); },
			style: { display: 'flex', alignItems: 'center', gap: '8px', flex: '1', justifyContent: 'flex-start' },
		},
			el( 'div', {
				dangerouslySetInnerHTML: { __html: currentSvg },
				style: { width: '24px', height: '24px', display: 'flex' },
			} ),
			el( 'span', null, props.value || 'Select Icon...' )
		);

		var removeButton = null;
		if ( props.value ) {
			removeButton = el( Button, {
				variant: 'link',
				isDestructive: true,
				onClick: function () { props.onChange( '' ); },
				style: { padding: '0 8px' },
			}, 'Remove' );
		}

		var triggerArea = el( 'div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
			openButton,
			removeButton
		);

		var modal = null;
		if ( isModalOpen ) {
			modal = el( Modal, {
				title: 'Select an Icon',
				onRequestClose: function () { setIsModalOpen( false ); },
				style: { width: '600px', maxWidth: '90vw', height: '80vh', display: 'flex', flexDirection: 'column' },
			},
				el( 'div', { style: { paddingBottom: '16px' } },
					el( TextControl, {
						label: 'Search icons...',
						value: searchQuery,
						onChange: function ( val ) {
							setSearchQuery( val );
							setVisibleCount( 100 );
						},
						placeholder: 'e.g. Shield, User, Arrow...',
					} )
				),
				el( 'div', {
					style: {
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
						gap: '8px',
						overflowY: 'auto',
						flex: '1',
						padding: '4px',
					},
				},
					filteredIcons.map( function ( name ) {
						return el( Button, {
							key: name,
							variant: 'secondary',
							onClick: function () {
								props.onChange( name );
								setIsModalOpen( false );
							},
							style: {
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: '8px',
								height: 'auto',
								padding: '12px 8px',
								justifyContent: 'center',
								background: props.value === name ? '#f0f0f0' : undefined,
								border: props.value === name ? '1px solid #1e1e1e' : undefined,
							},
						},
							el( 'div', {
								dangerouslySetInnerHTML: { __html: renderSvg( icons[ name ] ) },
								style: { width: '24px', height: '24px', display: 'flex' },
							} ),
							el( 'span', {
								style: { fontSize: '10px', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%', whiteSpace: 'nowrap' },
							}, name )
						);
					} ).concat( [
						el( 'div', {
							key: 'loader',
							ref: loaderRef,
							style: { height: '20px', gridColumn: '1 / -1' }
						} )
					] )
				)
			);
		}

		return el( 'div', { style: { marginBottom: '16px' } },
			el( 'label', {
				style: {
					display: 'block',
					marginBottom: '8px',
					fontWeight: 600,
					fontSize: '11px',
					textTransform: 'uppercase',
					letterSpacing: '0.5px',
				},
			}, props.label ),
			triggerArea,
			modal
		);
	}

	// Expose to window for use by individual block scripts.
	window.xfactBlockHelpers = {
		el: el,
		createEdit: createEdit,
		imageControl: imageControl,
		galleryControl: galleryControl,
		iconControl: iconControl,
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
