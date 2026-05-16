/**
 * xFact Section Heading — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    wp.blocks.registerBlockType('xfact/section-heading', {
        edit: h.createEdit(
            'xfact/section-heading',
            'Section Heading Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;

                return [
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
            },
        ),
        save: () => null,
    });
})();
