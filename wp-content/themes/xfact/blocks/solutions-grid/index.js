/**
 * xFact Solutions Grid — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    /**
     * Build controls for a single sector card.
     *
     * @param {Array}    sectors Current sectors array.
     * @param {number}   i       Index of this card.
     * @param {Function} set     setAttributes helper.
     * @return {Array} Array of React elements for this card.
     */
    function cardControls(sectors, i, set) {
        const card = sectors[i];

        function updateCard(key, value) {
            const updated = sectors.slice();
            updated[i] = Object.assign({}, updated[i]);
            updated[i][key] = value;
            set({ sectors: updated });
        }

        function removeCard() {
            const updated = sectors.slice();
            updated.splice(i, 1);
            set({ sectors: updated });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const updated = sectors.slice();
            if (intent === 'swap') {
                const temp = updated[fromIndex];
                updated[fromIndex] = updated[toIndex];
                updated[toIndex] = temp;
            } else {
                let insertAt =
                    intent === 'shift-bottom' ? toIndex + 1 : toIndex;
                if (insertAt > fromIndex) insertAt--;
                const itm = updated.splice(fromIndex, 1)[0];
                updated.splice(insertAt, 0, itm);
            }
            set({ sectors: updated });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: sectors.length,
                    label: `Card ${i + 1}`,
                    titleText:
                        card.title ||
                        card.name ||
                        card.label ||
                        card.heading ||
                        '',
                    onRemove: removeCard,
                    onMoveItem: moveItem,
                    iconName: card.iconName,
                },
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: card.title || '',
                    onChange: (v) => {
                        updateCard('title', v);
                    },
                }),
                el(h.TextControl, {
                    key: `badge-${i}`,
                    label: 'Badge',
                    value: card.badge || '',
                    onChange: (v) => {
                        updateCard('badge', v);
                    },
                }),
                el(h.TextControl, {
                    key: `headline-${i}`,
                    label: 'Headline',
                    value: card.headline || '',
                    onChange: (v) => {
                        updateCard('headline', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `desc-${i}`,
                    label: 'Description',
                    value: card.description || '',
                    onChange: (v) => {
                        updateCard('description', v);
                    },
                }),
                h.iconControl(
                    'Icon (Lucide)',
                    card.iconName || '',
                    (v) => {
                        updateCard('iconName', v);
                    },
                    `icon-${i}`,
                ),

                el(h.TextControl, {
                    key: `href-${i}`,
                    label: 'Link URL',
                    value: card.href || '',
                    onChange: (v) => {
                        updateCard('href', v);
                    },
                }),
                h.imageControl(
                    'Card Image',
                    card.imageUrl || '',
                    (media) => {
                        updateCard('imageUrl', media.url);
                    },
                    () => {
                        updateCard('imageUrl', '');
                    },
                    `img-${i}`,
                ),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/solutions-grid', {
        edit: h.createEdit(
            'xfact/solutions-grid',
            'Solutions Grid Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const sectors = attr.sectors || [];
                const buttons = attr.buttons || [];

                /* ── Section-level controls ── */
                let controls = [
                    el(h.TextControl, {
                        key: 'sectionLabel',
                        label: 'Pre-Title Label',
                        value: attr.sectionLabel,
                        onChange: (v) => {
                            set({ sectionLabel: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'heading',
                        label: 'Title',
                        value: attr.heading,
                        onChange: (v) => {
                            set({ heading: v });
                        },
                    }),
                    el(h.TextareaControl, {
                        key: 'subtitle',
                        label: 'Description',
                        value: attr.subtitle,
                        onChange: (v) => {
                            set({ subtitle: v });
                        },
                    }),
                ];

                /* ── Per-card controls ── */
                if (sectors.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'cards-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'cards-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Cards (${sectors.length})`,
                        ),
                    );
                    sectors.forEach((_sector, i) => {
                        controls = controls.concat(
                            cardControls(sectors, i, set),
                        );
                    });
                }

                /* ── Add card button ── */
                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add-card',
                            onClick: () => {
                                set({
                                    sectors: sectors.concat([
                                        {
                                            title: '',
                                            description: '',
                                            iconName: 'Circle',
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
                        '+ Add Card',
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

                return controls;
            },
        ),
        save: () => null,
    });
})();
