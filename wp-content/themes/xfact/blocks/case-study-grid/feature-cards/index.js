/**
 * xFact Feature Cards — editor script.
 */
(() => {
    var h = window.xfactBlockHelpers;
    var el = h.el;

    function cardControls(cards, i, set) {
        var card = cards[i];
        function update(key, value) {
            var arr = cards.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ cards: arr });
        }
        function remove() {
            var arr = cards.slice();
            arr.splice(i, 1);
            set({ cards: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            var arr = cards.slice();
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
            set({ cards: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: cards.length,
                    label: `Card ${i + 1}`,
                    titleText:
                        card.title ||
                        card.name ||
                        card.label ||
                        card.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                    iconName: card.iconName,
                },
                el(h.TextControl, {
                    key: `title-${i}`,
                    label: 'Title',
                    value: card.title || '',
                    onChange: (v) => {
                        update('title', v);
                    },
                }),
                el(h.TextareaControl, {
                    key: `desc-${i}`,
                    label: 'Description',
                    value: card.description || '',
                    onChange: (v) => {
                        update('description', v);
                    },
                }),
                h.iconControl(
                    'Icon (Lucide)',
                    card.iconName || '',
                    (v) => {
                        update('iconName', v);
                    },
                    `icon-${i}`,
                ),
                h.imageControl(
                    'Card Image',
                    card.imageUrl || '',
                    (media) => {
                        update('imageUrl', media.url);
                    },
                    () => {
                        update('imageUrl', '');
                    },
                    `img-${i}`,
                ),
            ),
        ];
    }

    wp.blocks.registerBlockType('xfact/feature-cards', {
        edit: h.createEdit(
            'xfact/feature-cards',
            'Feature Cards Settings',
            (props) => {
                var attr = props.attributes;
                var set = props.setAttributes;
                var cards = attr.cards || [];

                var controls = [
                    el(h.TextControl, {
                        key: 'sectionLabel',
                        label: 'Section Label',
                        value: attr.sectionLabel,
                        onChange: (v) => {
                            set({ sectionLabel: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'heading',
                        label: 'Heading',
                        value: attr.heading,
                        onChange: (v) => {
                            set({ heading: v });
                        },
                    }),
                    h.imageControl(
                        'Section Image',
                        attr.sectionImage,
                        (media) => {
                            set({
                                sectionImage: media.url,
                                sectionImageAlt: media.alt || '',
                            });
                        },
                        () => {
                            set({ sectionImage: '', sectionImageAlt: '' });
                        },
                        'sectionImage',
                    ),
                ];

                if (cards.length > 0) {
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
                            `Cards (${cards.length})`,
                        ),
                    );
                    cards.forEach((_card, i) => {
                        controls = controls.concat(cardControls(cards, i, set));
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add',
                            onClick: () => {
                                set({
                                    cards: cards.concat([
                                        {
                                            title: '',
                                            description: '',
                                            iconName: 'Circle',
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

                return controls;
            },
        ),
        save: () => null,
    });
})();
