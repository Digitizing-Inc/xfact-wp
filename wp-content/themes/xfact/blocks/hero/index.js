/**
 * xFact Hero — editor script.
 */
(() => {
    const h = window.xfactBlockHelpers;
    const el = h.el;

    wp.blocks.registerBlockType('xfact/hero', {
        edit: h.createEdit('xfact/hero', 'Hero Settings', (props) => {
            const attr = props.attributes;
            const set = props.setAttributes;
            const slides = attr.slides || [];
            const buttons = attr.buttons || [];
            const variant = attr.heroVariant || 'standard';

            let controls = [
                el(h.SelectControl, {
                    key: 'heroVariant',
                    label: 'Variant',
                    value: variant,
                    options: [
                        { label: 'Content-Focused Layout', value: 'standard' },
                        {
                            label: 'Multimedia Layout (Slideshow/Video)',
                            value: 'media',
                        },
                    ],
                    onChange: (v) => {
                        set({ heroVariant: v });
                    },
                }),
            ];

            if (variant === 'standard' || variant === 'page') {
                controls.push(
                    el(h.ToggleControl, {
                        key: 'useBreadcrumbs',
                        label: 'Replace Pre-Title with Breadcrumb Navigation',
                        checked: attr.useBreadcrumbs,
                        onChange: (v) => {
                            set({ useBreadcrumbs: v });
                        },
                    }),
                    !attr.useBreadcrumbs
                        ? el(h.TextControl, {
                              key: 'sectionLabel',
                              label: 'Pre-Title Label',
                              value: attr.sectionLabel,
                              onChange: (v) => {
                                  set({ sectionLabel: v });
                              },
                          })
                        : el(
                              'div',
                              {
                                  key: 'breadcrumb-group',
                                  style: {
                                      background:
                                          'var(--xfact-semantic-surface)',
                                      border: '1px solid #e2e8f0',
                                      borderRadius: '4px',
                                      padding: '12px',
                                      marginBottom: '24px',
                                      marginTop: '-8px',
                                  },
                              },
                              el(h.TextControl, {
                                  label: 'Breadcrumb Parent Label (Optional)',
                                  value: attr.breadcrumbParentLabel,
                                  onChange: (v) => {
                                      set({ breadcrumbParentLabel: v });
                                  },
                              }),
                              el(h.TextControl, {
                                  label: 'Breadcrumb Parent URL (Optional)',
                                  value: attr.breadcrumbParentHref,
                                  onChange: (v) => {
                                      set({ breadcrumbParentHref: v });
                                  },
                              }),
                          ),
                    el(h.TextControl, {
                        key: 'badgeText',
                        label: 'Badge Text',
                        value: attr.badgeText,
                        onChange: (v) => {
                            set({ badgeText: v });
                        },
                    }),
                    el(h.TextControl, {
                        key: 'title',
                        label: 'Title',
                        help: 'Wrap text in *asterisks* to apply accent color',
                        value: attr.title,
                        onChange: (v) => {
                            set({ title: v });
                        },
                    }),
                    el(h.TextareaControl, {
                        key: 'subtitle',
                        label: 'Subtitle',
                        value: attr.subtitle,
                        onChange: (v) => {
                            set({ subtitle: v });
                        },
                    }),
                    el(h.TextareaControl, {
                        key: 'bodyText',
                        label: 'Body Text',
                        value: attr.bodyText,
                        onChange: (v) => {
                            set({ bodyText: v });
                        },
                    }),
                    h.imageControl(
                        'Background Image',
                        attr.backgroundImage,
                        (media) => {
                            set({
                                backgroundImage: media.url,
                                imageAlt: media.alt || attr.imageAlt,
                            });
                        },
                        () => {
                            set({ backgroundImage: '' });
                        },
                        'backgroundImage',
                    ),
                    el(h.TextControl, {
                        key: 'imageAlt',
                        label: 'Image Alt Text',
                        value: attr.imageAlt,
                        onChange: (v) => {
                            set({ imageAlt: v });
                        },
                    }),
                );
            } else {
                controls.push(
                    el(h.TextControl, {
                        key: 'title',
                        label: 'Title',
                        help: 'Wrap text in *asterisks* to apply accent color',
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
                    h.imageControl(
                        'Video Poster Image',
                        attr.posterImage,
                        (media) => {
                            set({ posterImage: media.url });
                        },
                        () => {
                            set({ posterImage: '' });
                        },
                        'posterImage',
                    ),
                    el(h.TextControl, {
                        key: 'videoUrl',
                        label: 'Video URL',
                        value: attr.videoUrl,
                        onChange: (v) => {
                            set({ videoUrl: v });
                        },
                    }),
                    h.galleryControl(
                        'Slideshow Images',
                        slides,
                        (media) => {
                            set({
                                slides: slides.concat({
                                    url: media.url,
                                    id: media.id,
                                    alt: media.alt || '',
                                }),
                            });
                        },
                        (index) => {
                            const updated = slides.slice();
                            updated.splice(index, 1);
                            set({ slides: updated });
                        },
                        'slides',
                    ),
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
            }

            return controls;
        }),
        save: () => null,
    });
})();
