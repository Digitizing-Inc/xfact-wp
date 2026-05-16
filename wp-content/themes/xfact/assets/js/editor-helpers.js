/**
 * xFact Block Editor — shared utilities.
 *
 * Provides helpers used by all xFact block editor scripts.
 * Must be enqueued BEFORE individual block scripts.
 */
(() => {
    const el = wp.element.createElement;
    const Fragment = wp.element.Fragment;
    const useState = wp.element.useState;
    const useEffect = wp.element.useEffect;
    const useRef = wp.element.useRef;
    const InspectorControls = wp.blockEditor.InspectorControls;
    const MediaUpload = wp.blockEditor.MediaUpload;
    const MediaUploadCheck = wp.blockEditor.MediaUploadCheck;
    const useBlockProps = wp.blockEditor.useBlockProps;
    const PanelBody = wp.components.PanelBody;
    const TextControl = wp.components.TextControl;
    const TextareaControl = wp.components.TextareaControl;
    const Button = wp.components.Button;
    const Disabled = wp.components.Disabled;
    const ToggleControl = wp.components.ToggleControl;
    const SelectControl = wp.components.SelectControl;
    const ComboboxControl = wp.components.ComboboxControl;
    const Modal = wp.components.Modal;
    const useSelect = wp.data ? wp.data.useSelect : null;

    /* ServerSideRender can be a default export in some WP versions */
    let SSR = wp.serverSideRender;
    if (typeof SSR !== 'function' && SSR && typeof SSR.default === 'function') {
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
    function createEdit(blockName, panelTitle, controlsFn) {
        return function EditComponent(props) {
            const blockProps = useBlockProps();
            let inspectorChildren;

            try {
                inspectorChildren = controlsFn ? controlsFn(props) : [];
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(`[xfact] Error in controls for ${blockName}`, e);
                inspectorChildren = [
                    el(
                        'p',
                        { key: 'err', style: { color: 'red' } },
                        `Error rendering controls: ${e.message}`,
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
                        inspectorChildren,
                    ),
                ),
                el(
                    'div',
                    blockProps,
                    el(
                        Disabled,
                        null,
                        el(SSR, {
                            block: blockName,
                            attributes: props.attributes,
                        }),
                    ),
                ),
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
    function imageControl(label, imageUrl, onSelect, onRemove, key) {
        const children = [
            el(
                'label',
                {
                    key: 'lbl',
                    style: {
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    },
                },
                label,
            ),
        ];

        if (imageUrl) {
            children.push(
                el(
                    'div',
                    { key: 'preview', style: { marginBottom: '8px' } },
                    el('img', {
                        src: imageUrl,
                        alt: label,
                        style: {
                            maxWidth: '100%',
                            height: 'auto',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                        },
                    }),
                ),
            );
        }

        children.push(
            el(
                MediaUploadCheck,
                { key: 'upload-check' },
                el(MediaUpload, {
                    onSelect: onSelect,
                    allowedTypes: ['image'],
                    render: (obj) =>
                        el(
                            Button,
                            {
                                onClick: obj.open,
                                variant: imageUrl ? 'secondary' : 'primary',
                                style: { marginRight: '8px' },
                            },
                            imageUrl ? 'Replace Image' : 'Upload Image',
                        ),
                }),
            ),
        );

        if (imageUrl) {
            children.push(
                el(
                    Button,
                    {
                        key: 'remove',
                        onClick: onRemove,
                        variant: 'link',
                        isDestructive: true,
                    },
                    'Remove',
                ),
            );
        }

        return el(
            'div',
            {
                key: key || `img-ctrl-${label}`,
                style: { marginBottom: '16px' },
            },
            children,
        );
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
    function galleryControl(label, images, onAdd, onRemove, key) {
        const safeImages = images || [];
        const items = safeImages.map((img, i) =>
            el(
                'div',
                {
                    key: `gi-${i}`,
                    style: {
                        display: 'inline-block',
                        position: 'relative',
                        marginRight: '8px',
                        marginBottom: '8px',
                    },
                },
                el('img', {
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
                }),
                el(
                    Button,
                    {
                        onClick: () => {
                            onRemove(i);
                        },
                        variant: 'link',
                        isDestructive: true,
                        style: {
                            fontSize: '11px',
                            padding: '0',
                            display: 'block',
                        },
                    },
                    '×',
                ),
            ),
        );

        return el(
            'div',
            {
                key: key || `gallery-ctrl-${label}`,
                style: { marginBottom: '16px' },
            },
            el(
                'label',
                {
                    style: {
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    },
                },
                `${label} (${safeImages.length})`,
            ),
            el('div', null, items),
            el(
                MediaUploadCheck,
                null,
                el(MediaUpload, {
                    onSelect: onAdd,
                    allowedTypes: ['image'],
                    render: (obj) =>
                        el(
                            Button,
                            {
                                onClick: obj.open,
                                variant: 'secondary',
                            },
                            'Add Image',
                        ),
                }),
            ),
        );
    }

    /**
     * Render an SVG safely with a wrapper.
     */
    function renderSvg(innerHtml) {
        if (!innerHtml) {
            return '';
        }
        return (
            '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="fill: none; stroke: currentColor;">' +
            innerHtml +
            '</svg>'
        );
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
    function iconControl(label, value, onChange, key) {
        return el(IconPickerControl, {
            key: key || `icon-ctrl-${label}`,
            label: label,
            value: value,
            onChange: onChange,
        });
    }

    function IconPickerControl(props) {
        const isModalOpenState = useState(false);
        const isModalOpen = isModalOpenState[0];
        const setIsModalOpen = isModalOpenState[1];

        const searchQueryState = useState('');
        const searchQuery = searchQueryState[0];
        const setSearchQuery = searchQueryState[1];

        const visibleCountState = useState(100);
        const visibleCount = visibleCountState[0];
        const setVisibleCount = visibleCountState[1];

        const icons = window.xfactLucideIcons || {};
        const iconNames = Object.keys(icons);

        const filteredIcons = iconNames
            .filter(
                (name) =>
                    name.toLowerCase().indexOf(searchQuery.toLowerCase()) !==
                    -1,
            )
            .slice(0, visibleCount);

        const loaderRef = useRef(null);

        useEffect(() => {
            if (!isModalOpen) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setVisibleCount((prev) => prev + 100);
                    }
                },
                { rootMargin: '200px' },
            );

            if (loaderRef.current) {
                observer.observe(loaderRef.current);
            }

            return () => {
                observer.disconnect();
            };
        }, [isModalOpen, filteredIcons.length]);

        // Current selected SVG or a fallback empty placeholder
        const currentSvg = renderSvg(icons[props.value]);

        // Button to open modal
        const openButton = el(
            Button,
            {
                variant: 'secondary',
                onClick: () => {
                    setIsModalOpen(true);
                },
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flex: '1',
                    justifyContent: 'flex-start',
                },
            },
            el('div', {
                dangerouslySetInnerHTML: { __html: currentSvg },
                style: { width: '24px', height: '24px', display: 'flex' },
            }),
            el('span', null, props.value || 'Select Icon...'),
        );

        let removeButton = null;
        if (props.value) {
            removeButton = el(
                Button,
                {
                    variant: 'link',
                    isDestructive: true,
                    onClick: () => {
                        props.onChange('');
                    },
                    style: { padding: '0 8px' },
                },
                'Remove',
            );
        }

        const triggerArea = el(
            'div',
            { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
            openButton,
            removeButton,
        );

        let modal = null;
        if (isModalOpen) {
            modal = el(
                Modal,
                {
                    title: 'Select an Icon',
                    onRequestClose: () => {
                        setIsModalOpen(false);
                    },
                    style: {
                        width: '600px',
                        maxWidth: '90vw',
                        height: '80vh',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                },
                el(
                    'div',
                    { style: { paddingBottom: '16px' } },
                    el(TextControl, {
                        label: 'Search icons...',
                        value: searchQuery,
                        onChange: (val) => {
                            setSearchQuery(val);
                            setVisibleCount(100);
                        },
                        placeholder: 'e.g. Shield, User, Arrow...',
                    }),
                ),
                el(
                    'div',
                    {
                        style: {
                            display: 'grid',
                            gridTemplateColumns:
                                'repeat(auto-fill, minmax(80px, 1fr))',
                            gap: '8px',
                            overflowY: 'auto',
                            flex: '1',
                            padding: '4px',
                        },
                    },
                    filteredIcons
                        .map((name) =>
                            el(
                                Button,
                                {
                                    key: name,
                                    variant: 'secondary',
                                    onClick: () => {
                                        props.onChange(name);
                                        setIsModalOpen(false);
                                    },
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: '8px',
                                        height: 'auto',
                                        padding: '12px 8px',
                                        justifyContent: 'center',
                                        background:
                                            props.value === name
                                                ? '#f0f0f0'
                                                : undefined,
                                        border:
                                            props.value === name
                                                ? '1px solid #1e1e1e'
                                                : undefined,
                                    },
                                },
                                el('div', {
                                    dangerouslySetInnerHTML: {
                                        __html: renderSvg(icons[name]),
                                    },
                                    style: {
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                    },
                                }),
                                el(
                                    'span',
                                    {
                                        style: {
                                            fontSize: '10px',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            maxWidth: '100%',
                                            whiteSpace: 'nowrap',
                                        },
                                    },
                                    name,
                                ),
                            ),
                        )
                        .concat([
                            el('div', {
                                key: 'loader',
                                ref: loaderRef,
                                style: { height: '20px', gridColumn: '1 / -1' },
                            }),
                        ]),
                ),
            );
        }

        return el(
            'div',
            { style: { marginBottom: '16px' } },
            el(
                'label',
                {
                    style: {
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                    },
                },
                props.label,
            ),
            triggerArea,
            modal,
        );
    }

    /**
     * Build a header for an array item with reordering controls.
     *
     * @param {string}   label      Item label (e.g., 'Card 1').
     * @param {number}   index      Current index of the item.
     * @param {number}   total      Total number of items in the array.
     * @param {Function} onMoveItem Callback(fromIndex, toIndex, intent) for drag-and-drop.
     * @param {boolean}  [isOpen]   Whether the item is currently expanded.
     * @param {Function} [toggle]   Callback to toggle expansion.
     * @return {Object} React element.
     */
    function arrayItemHeader(
        label,
        index,
        _total,
        onMoveItem,
        isOpen,
        toggle,
        customProps,
    ) {
        customProps = customProps || {};
        const icons = window.xfactLucideIcons || {};
        const gripSvg = renderSvg(
            icons.GripVertical ||
                '<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
        );
        const chevronSvg = renderSvg(
            isOpen
                ? icons.ChevronUp ||
                      '<polyline points="18 15 12 9 6 15"></polyline>'
                : icons.ChevronDown ||
                      '<polyline points="6 9 12 15 18 9"></polyline>',
        );

        let iconSvg = null;
        if (customProps.iconName && icons[customProps.iconName]) {
            iconSvg = renderSvg(icons[customProps.iconName]);
        } else if (customProps.itemType === 'button') {
            iconSvg = renderSvg(
                icons.MousePointerClick ||
                    '<path d="M14 4.1 12 6"/><path d="m5.1 8-2.9-.8"/><path d="m6 12-1.9 2"/><path d="M7.2 2.2 8 5.1"/><path d="M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"/>',
            );
        }

        const dragProps = {};
        if (onMoveItem) {
            dragProps.draggable = true;
            dragProps.onDragStart = (e) => {
                e.stopPropagation();
                e.dataTransfer.setData('text/plain', index);
                e.dataTransfer.effectAllowed = 'move';
                if (e.target?.parentElement) {
                    const rect = e.target.parentElement.getBoundingClientRect();
                    window.__xfactDraggedHeight = rect.height;
                }

                // Add dragging style to the original element
                setTimeout(() => {
                    if (e.target?.parentElement) {
                        e.target.parentElement.style.opacity = '0.4';
                        e.target.parentElement.style.borderStyle = 'dashed';
                    }
                }, 0);
            };
            dragProps.onDragEnd = (e) => {
                if (e.target?.parentElement) {
                    e.target.parentElement.style.opacity = '1';
                    e.target.parentElement.style.borderStyle = 'solid';
                }
            };
        }

        return el(
            'div',
            Object.assign(
                {
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '0',
                        paddingBottom: '0',
                        borderBottom: 'none',
                    },
                },
                dragProps,
            ),
            el(
                'div',
                {
                    onClick: toggle,
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flex: '1',
                        minWidth: '0',
                        cursor: 'pointer',
                    },
                },
                el('div', {
                    dangerouslySetInnerHTML: { __html: gripSvg },
                    style: {
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        color: '#888',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: onMoveItem ? 'grab' : 'default',
                    },
                }),
                iconSvg
                    ? el('div', {
                          dangerouslySetInnerHTML: { __html: iconSvg },
                          style: {
                              width: '16px',
                              height: '16px',
                              display: 'flex',
                              color: '#007cba',
                              alignItems: 'center',
                              justifyContent: 'center',
                          },
                      })
                    : null,
                el(
                    'span',
                    {
                        style: {
                            flex: 1,
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontWeight: 'normal',
                        },
                    },
                    label,
                ),
            ),
            el(
                'div',
                {
                    style: {
                        display: 'flex',
                        gap: '4px',
                        alignItems: 'center',
                        flexShrink: 0,
                    },
                },
                toggle
                    ? el(
                          Button,
                          {
                              onClick: toggle,
                              variant: 'tertiary',
                              style: {
                                  minWidth: 'auto',
                                  padding: '2px',
                                  marginLeft: '8px',
                              }, // extra margin to separate chevron from arrows
                              title: isOpen ? 'Collapse' : 'Expand',
                          },
                          el('div', {
                              dangerouslySetInnerHTML: { __html: chevronSvg },
                              style: {
                                  width: '16px',
                                  height: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                              },
                          }),
                      )
                    : null,
            ),
        );
    }

    /**
     * Wrapper for array items to handle collapsed state and dynamic titles.
     */
    function ArrayItemWrapper(props) {
        const isNewState = useState(() => {
            const t = props.titleText;
            return !t || t === 'New Button' || t === 'New Metric';
        });
        const isNew = isNewState[0];

        const isOpenState = useState(isNew);
        const isOpen = isOpenState[0];
        const setIsOpen = isOpenState[1];

        const dropIntentState = useState(null);
        const dropIntent = dropIntentState[0];
        const setDropIntent = dropIntentState[1];

        const containerRef = wp.element.useRef(null);

        wp.element.useEffect(() => {
            if (isNew && containerRef.current) {
                setTimeout(() => {
                    if (containerRef.current) {
                        containerRef.current.scrollIntoView({
                            behavior: 'smooth',
                            block: 'nearest',
                        });
                        const input = containerRef.current.querySelector(
                            'input:not([type="hidden"]), textarea',
                        );
                        if (input) input.focus({ preventScroll: true });
                    }
                }, 100);
            }
        }, []);

        function toggle() {
            setIsOpen(!isOpen);
        }

        const displayTitle = props.titleText ? props.titleText : props.label;

        function handleRemove() {
            if (
                window.confirm(
                    'Are you sure you want to remove item "' +
                        displayTitle +
                        '"?',
                )
            ) {
                props.onRemove();
            }
        }

        const onMoveItem = props.onMoveItem;
        const index = props.index;

        const dragProps = {};
        if (onMoveItem) {
            dragProps.onDragOver = (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.dataTransfer.dropEffect = 'move';

                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;

                // Calculate bounds of the inner container to prevent flickering
                const placeholderHeight = window.__xfactDraggedHeight || 48;
                const innerTop =
                    dropIntent === 'shift-top' ? placeholderHeight : 0;
                const innerBottom =
                    dropIntent === 'shift-bottom'
                        ? rect.height - placeholderHeight
                        : rect.height;
                const innerHeight = innerBottom - innerTop;

                const threshold = Math.min(24, innerHeight * 0.25); // 25% of height, max 24px
                const innerY = y - innerTop;

                let intent = 'swap';
                if (innerY < threshold) intent = 'shift-top';
                else if (innerY > innerHeight - threshold)
                    intent = 'shift-bottom';

                if (dropIntent !== intent) setDropIntent(intent);
            };
            dragProps.onDragEnter = (e) => {
                e.preventDefault();
                e.stopPropagation();
            };
            dragProps.onDragLeave = (e) => {
                e.stopPropagation();
                if (!e.currentTarget.contains(e.relatedTarget)) {
                    setDropIntent(null);
                }
            };
            dragProps.onDrop = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const rect = e.currentTarget.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const placeholderHeight = window.__xfactDraggedHeight || 48;
                const innerTop =
                    dropIntent === 'shift-top' ? placeholderHeight : 0;
                const innerBottom =
                    dropIntent === 'shift-bottom'
                        ? rect.height - placeholderHeight
                        : rect.height;
                const innerHeight = innerBottom - innerTop;

                const threshold = Math.min(24, innerHeight * 0.25);
                const innerY = y - innerTop;

                let finalIntent = 'swap';
                if (innerY < threshold) finalIntent = 'shift-top';
                else if (innerY > innerHeight - threshold)
                    finalIntent = 'shift-bottom';

                setDropIntent(null);

                const draggedIdx = parseInt(
                    e.dataTransfer.getData('text/plain'),
                    10,
                );
                if (!Number.isNaN(draggedIdx) && draggedIdx !== index) {
                    onMoveItem(draggedIdx, index, finalIntent);
                }
            };
        }

        return el(
            'div',
            Object.assign(
                {
                    style: { position: 'relative' }, // Outer container for drop logic
                    ref: containerRef,
                },
                dragProps,
            ),
            dropIntent === 'shift-top'
                ? el('div', {
                      style: {
                          height: window.__xfactDraggedHeight || 48,
                          border: '2px dashed #007cba',
                          margin: '0',
                          borderRadius: '0',
                          background: 'rgba(0,124,186,0.05)',
                          position: 'relative',
                          zIndex: 1,
                      },
                  })
                : null,
            el(
                'div',
                {
                    // Inner visual container
                    style: {
                        border:
                            dropIntent === 'swap'
                                ? '2px solid #007cba'
                                : '1px solid #ddd',
                        padding: '8px',
                        marginBottom: '-1px',
                        position: 'relative',
                        borderRadius: '0',
                        transition: 'all 0.2s ease',
                        background:
                            dropIntent === 'swap'
                                ? 'rgba(0,124,186,0.05)'
                                : isOpen
                                  ? '#fff'
                                  : '#f8f9fa',
                        transform:
                            dropIntent === 'swap' ? 'scale(1.02)' : 'none',
                        boxShadow:
                            dropIntent === 'swap'
                                ? '0 0 0 2px rgba(0,124,186,0.3)'
                                : 'none',
                        zIndex: dropIntent === 'swap' ? 2 : 1,
                    },
                },
                arrayItemHeader(
                    displayTitle,
                    props.index,
                    props.total,
                    props.onMoveItem,
                    isOpen,
                    toggle,
                    { iconName: props.iconName, itemType: props.itemType },
                ),
                isOpen
                    ? el(
                          'div',
                          {
                              style: {
                                  marginTop: '12px',
                                  paddingTop: '12px',
                                  borderTop: '1px solid #eee',
                              },
                          },
                          props.children,
                          el(
                              'div',
                              {
                                  style: {
                                      marginTop: '16px',
                                      paddingTop: '16px',
                                      borderTop: '1px dashed #eee',
                                      textAlign: 'right',
                                  },
                              },
                              el(
                                  Button,
                                  {
                                      onClick: handleRemove,
                                      variant: 'link',
                                      isDestructive: true,
                                      style: { fontSize: '13px', padding: '0' },
                                  },
                                  'Remove Item',
                              ),
                          ),
                      )
                    : null,
            ),
            dropIntent === 'shift-bottom'
                ? el('div', {
                      style: {
                          height: window.__xfactDraggedHeight || 48,
                          border: '2px dashed #007cba',
                          margin: '0',
                          borderRadius: '0',
                          background: 'rgba(0,124,186,0.05)',
                          position: 'relative',
                          zIndex: 1,
                      },
                  })
                : null,
        );
    }

    /**
     * Build controls for an array of buttons.
     *
     * @param {Array}    buttons    The current array of buttons.
     * @param {Function} set        The setAttributes function.
     * @param {string}   attributeName The name of the attribute (e.g. 'buttons').
     * @return {Array} React elements.
     */
    function buttonArrayControls(buttons, set, attributeName) {
        const attrName = attributeName || 'buttons';
        const safeButtons = buttons || [];

        const controls = [];
        if (safeButtons.length > 0) {
            safeButtons.forEach((btn, i) => {
                function update(key, value) {
                    const arr = safeButtons.slice();
                    arr[i] = Object.assign({}, arr[i]);
                    arr[i][key] = value;
                    const updates = {};
                    updates[attrName] = arr;
                    set(updates);
                }
                function remove() {
                    const arr = safeButtons.slice();
                    arr.splice(i, 1);
                    const updates = {};
                    updates[attrName] = arr;
                    set(updates);
                }
                function moveItem(fromIndex, toIndex, intent) {
                    const arr = safeButtons.slice();
                    if (intent === 'swap') {
                        const temp = arr[fromIndex];
                        arr[fromIndex] = arr[toIndex];
                        arr[toIndex] = temp;
                    } else {
                        let insertAt =
                            intent === 'shift-bottom' ? toIndex + 1 : toIndex;
                        if (insertAt > fromIndex) insertAt--;
                        const itm = arr.splice(fromIndex, 1)[0];
                        arr.splice(insertAt, 0, itm);
                    }
                    const updates = {};
                    updates[attrName] = arr;
                    set(updates);
                }

                controls.push(
                    el(
                        ArrayItemWrapper,
                        {
                            key: `${attrName}-item-${i}`,
                            index: i,
                            total: safeButtons.length,
                            label: `Button ${i + 1}`,
                            titleText: btn.label || 'New Button',
                            onRemove: remove,
                            onMoveItem: moveItem,
                            itemType: 'button',
                        },
                        el(TextControl, {
                            label: 'Label',
                            value: btn.label || '',
                            onChange: (v) => {
                                update('label', v);
                            },
                        }),
                        el(TextControl, {
                            label: 'URL',
                            value: btn.url || '',
                            onChange: (v) => {
                                update('url', v);
                            },
                        }),
                        el(SelectControl, {
                            label: 'Variant',
                            value: btn.variant || 'primary',
                            options: [
                                { label: 'Primary', value: 'primary' },
                                { label: 'Secondary', value: 'secondary' },
                                { label: 'Text Link', value: 'link' },
                            ],
                            onChange: (v) => {
                                update('variant', v);
                            },
                        }),
                    ),
                );
            });
        }

        controls.push(
            el(
                Button,
                {
                    key: `${attrName}-add`,
                    onClick: () => {
                        const arr = safeButtons.slice();
                        arr.push({
                            label: 'New Button',
                            url: '',
                            variant: 'primary',
                        });
                        const updates = {};
                        updates[attrName] = arr;
                        set(updates);
                    },
                    variant: 'secondary',
                    style: {
                        width: '100%',
                        justifyContent: 'center',
                        marginTop: '15px',
                    },
                },
                '+ Add Button',
            ),
        );

        return controls;
    }

    /**
     * Build controls for an array of buttons.
     *
     * @param {Array}    buttons    The current array of buttons.
     * @param {Function} set        The setAttributes function.
     * @param {string}   attributeName The name of the attribute (e.g. 'buttons').
     * @return {Array} React elements.
     */

    // Expose to window for use by individual block scripts.
    window.xfactBlockHelpers = {
        el: el,
        createEdit: createEdit,
        imageControl: imageControl,
        galleryControl: galleryControl,
        iconControl: iconControl,
        arrayItemHeader: arrayItemHeader,
        ArrayItemWrapper: ArrayItemWrapper,
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
        buttonArrayControls: buttonArrayControls,
    };
})();
