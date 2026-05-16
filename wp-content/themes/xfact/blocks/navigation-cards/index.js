/**
 * xFact Navigation Cards — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function cardControls(items, i, set) {
        const item = items[i];
        function update(key, value) {
            const arr = items.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ items: arr });
        }
        function remove() {
            const arr = items.slice();
            arr.splice(i, 1);
            set({ items: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = items.slice();
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
            set({ items: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: items.length,
                    label: `Card ${i + 1}`,
                    titleText:
                        item.title ||
                        item.name ||
                        item.label ||
                        item.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                    iconName: item.icon,
                },
                el(h.TextControl, {
                    label: 'Title',
                    value: item.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(h.TextControl, {
                    label: 'Subtitle',
                    value: item.subtitle || '',
                    onChange: (v) => {
                        update('subtitle', v);
                    },
                }),
                h.iconControl('Icon (Lucide name)', item.icon || '', (v) => {
                    update('icon', v);
                }),
                el(h.TextControl, {
                    label: 'Link URL',
                    value: item.href || '',
                    onChange: (v) => {
                        update('href', v);
                    },
                }),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/navigation-cards', {
        edit: h.createEdit(
            'xfact/navigation-cards',
            'Navigation Cards Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const items = attr.items || [];
                const buttons = attr.buttons || [];

                let controls = [
                    el(h.TextControl, {
                        key: 'heading',
                        label: 'Title',
                        value: attr.heading || '',
                        onChange: (v) => {
                            set({ heading: v });
                        },
                    }),
                ];

                if (items.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'items-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'items-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Cards (${items.length})`,
                        ),
                    );
                    items.forEach((_item, i) => {
                        controls = controls.concat(cardControls(items, i, set));
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-card',
                            onClick: () => {
                                set({
                                    items: items.concat([
                                        {
                                            title: '',
                                            subtitle: '',
                                            icon: '',
                                            href: '',
                                        },
                                    ]),
                                });
                            },
                            variant: 'secondary',
                            style: {
                                width: '100%',
                                justifyContent: 'center',
                                marginTop: '15px',
                            },
                        },
                        '+ Add Navigation Card',
                    ),
                );

                /* Buttons section */
                controls.push(
                    el('hr', {
                        key: 'buttons-sep',
                        style: { margin: '16px 0', opacity: 0.3 },
                    }),
                    el(
                        'strong',
                        {
                            key: 'buttons-hdr',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        `Buttons (${buttons.length})`,
                    ),
                );
                controls = controls.concat(
                    h.buttonArrayControls(buttons, set, 'buttons'),
                );

                /* Settings section */
                controls.push(
                    el('hr', {
                        key: 'settings-sep',
                        style: { margin: '24px 0', opacity: 0.3 },
                    }),
                    el(
                        'strong',
                        {
                            key: 'settings-hdr',
                            style: { display: 'block', marginBottom: '8px' },
                        },
                        'Settings',
                    ),
                    el(h.TextControl, {
                        key: 'anchor',
                        label: 'HTML Anchor (ID)',
                        value: attr.anchor || '',
                        onChange: (v) => {
                            set({ anchor: v });
                        },
                    }),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
