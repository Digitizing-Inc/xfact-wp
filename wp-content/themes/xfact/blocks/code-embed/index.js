/**
 * xFact Code Embed — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    wp.blocks.registerBlockType('xfact/code-embed', {
        edit: h.createEdit(
            'xfact/code-embed',
            'Code Embed Settings',
            (props) => {
                const attr = props.attributes;
                const set = props.setAttributes;

                return [
                    el(h.TextareaControl, {
                        key: 'code',
                        label: 'Raw HTML/JS Code',
                        value: attr.code,
                        onChange: (v) => {
                            set({ code: v });
                        },
                        help: 'Enter raw HTML or scripts. It will be rendered inside the theme container.',
                        rows: 10,
                    }),
                ];
            },
        ),
        save: () => null,
    });
})();
