/**
 * xFact Logo Strip — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    function logoControls(logos, i, set) {
        const logo = logos[i];
        function update(key, value) {
            const arr = logos.slice();
            arr[i] = Object.assign({}, arr[i]);
            arr[i][key] = value;
            set({ logos: arr });
        }
        function remove() {
            const arr = logos.slice();
            arr.splice(i, 1);
            set({ logos: arr });
        }
        function moveItem(fromIndex, toIndex, intent) {
            const arr = logos.slice();
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
            set({ logos: arr });
        }
        return [
            el(
                h.ArrayItemWrapper,
                {
                    key: `card-${i}`,
                    index: i,
                    total: logos.length,
                    label: `Logo ${i + 1}`,
                    titleText:
                        logo.title ||
                        logo.name ||
                        logo.label ||
                        logo.heading ||
                        '',
                    onRemove: remove,
                    onMoveItem: moveItem,
                },
                el(h.TextControl, {
                    key: `name-${i}`,
                    label: 'Name',
                    value: logo.name || '',
                    onChange: (v) => {
                        update('name', v);
                    },
                }),
                h.imageControl(
                    'Logo Image',
                    logo.imageUrl || '',
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

    wp.blocks.registerBlockType('xfact/logo-strip', {
        edit: h.createEdit(
            'xfact/logo-strip',
            'Logo Strip Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;
                const logos = attr.logos || [];

                let controls = [
                    el(h.TextControl, {
                        key: 'heading',
                        label: 'Title',
                        value: attr.heading,
                        onChange: (v) => {
                            set({ heading: v });
                        },
                    }),
                ];

                if (logos.length > 0) {
                    controls.push(
                        el('hr', {
                            key: 'logos-sep',
                            style: { margin: '16px 0', opacity: 0.3 },
                        }),
                        el(
                            'strong',
                            {
                                key: 'logos-hdr',
                                style: {
                                    display: 'block',
                                    marginBottom: '8px',
                                },
                            },
                            `Logos (${logos.length})`,
                        ),
                    );
                    logos.forEach((_logo, i) => {
                        controls = controls.concat(logoControls(logos, i, set));
                    });
                }

                controls.push(
                    el(
                        h.Button,
                        {
                            key: 'add',
                            onClick: () => {
                                set({
                                    logos: logos.concat([
                                        { name: '', imageUrl: '' },
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
                        '+ Add Logo',
                    ),
                );

                return controls;
            },
        ),
        save: () => null,
    });
})();
