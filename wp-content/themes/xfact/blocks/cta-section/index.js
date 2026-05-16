/**
 * xFact CTA Section — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    wp.blocks.registerBlockType('xfact/cta-section', {
        edit: h.createEdit('xfact/cta-section', 'CTA Settings', (props) => {
            const attr = props.attributes;
            const set = props.setAttributes;
            const buttons = attr.buttons || [];

            let controls = [
                el(h.TextControl, {
                    key: 'title',
                    label: 'Title',
                    value: attr.title,
                    onChange: (v) => {
                        set({ title: v });
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
                el(h.SelectControl, {
                    key: 'variant',
                    label: 'Theme Variant',
                    value: attr.variant || 'dark',
                    options: [
                        { label: 'Dark (Default)', value: 'dark' },
                        { label: 'Light', value: 'light' },
                    ],
                    onChange: (v) => {
                        set({ variant: v });
                    },
                }),
            );

            return controls;
        }),
        save: () => null,
    });
})();
