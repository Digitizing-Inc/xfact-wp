/**
 * xFact Admin Settings — Media uploader integration.
 */
(($) => {
    $(() => {
        $('.xfact-admin-upload-btn').on('click', function (e) {
            e.preventDefault();

            var $btn = $(this);
            var $input = $($btn.data('target'));
            var $preview = $($btn.data('preview'));

            const frame = wp.media({
                title: 'Select Logo',
                button: { text: 'Use this logo' },
                multiple: false,
                library: { type: 'image' },
            });

            frame.on('select', () => {
                const attachment = frame
                    .state()
                    .get('selection')
                    .first()
                    .toJSON();
                $input.val(attachment.url);
                $preview.attr('src', attachment.url);
            });

            frame.open();
        });

        $('.xfact-admin-reset-btn').on('click', function (e) {
            e.preventDefault();

            var $btn = $(this);
            var $input = $($btn.data('target'));
            var $preview = $($btn.data('preview'));
            const defaultUrl = $btn.data('default');

            $input.val('');
            $preview.attr('src', defaultUrl);
        });

        // Initialize color pickers
        if (typeof $.fn.wpColorPicker !== 'undefined') {
            $('.xfact-color-picker').wpColorPicker();
        }
        // Custom Fonts Manager
        $('#xfact-add-font-btn').on('click', (e) => {
            e.preventDefault();
            var $container = $('#xfact-custom-fonts-container');
            const index = $container.children().length;

            const html =
                '<div class="xfact-custom-font-row" data-index="' +
                index +
                '">' +
                '<input type="text" name="xfact_custom_fonts[' +
                index +
                '][name]" placeholder="Font Name (e.g. Comic Sans)" required />' +
                '<input type="text" name="xfact_custom_fonts[' +
                index +
                '][fontFamily]" placeholder="CSS font-family value" required />' +
                '<input type="text" name="xfact_custom_fonts[' +
                index +
                '][weight]" placeholder="Weight (e.g. 400)" />' +
                '<input type="text" name="xfact_custom_fonts[' +
                index +
                '][url]" class="xfact-font-url" placeholder="URL to .woff2 file" required readonly style="width: 300px;" />' +
                '<button type="button" class="button button-secondary xfact-upload-font-btn">Upload .woff2</button>' +
                '<button type="button" class="button xfact-btn-danger xfact-remove-font-btn">Remove</button>' +
                '</div>';
            $container.append(html);
        });

        $(document).on('click', '.xfact-remove-font-btn', function (e) {
            e.preventDefault();
            $(this).closest('.xfact-custom-font-row').remove();
        });

        $(document).on('click', '.xfact-upload-font-btn', function (e) {
            e.preventDefault();
            var $btn = $(this);
            var $input = $btn.siblings('.xfact-font-url');

            const fontFrame = wp.media({
                title: 'Select Font File',
                button: { text: 'Use this font' },
                multiple: false,
            });

            fontFrame.on('select', () => {
                const attachment = fontFrame
                    .state()
                    .get('selection')
                    .first()
                    .toJSON();
                $input.val(attachment.url);
            });

            fontFrame.open();
        });

        // Reset Individual Fonts
        $('.xfact-reset-font-btn').on('click', function (e) {
            e.preventDefault();
            const targetSelect = $(`#${$(this).data('target')}`);
            const defaultVal = $(this).data('default');
            targetSelect.val(defaultVal);
            targetSelect.trigger('change'); // trigger change so live preview updates if applicable
        });
        // Reset Individual Colors
        $('.xfact-reset-color-btn').on('click', function (e) {
            e.preventDefault();
            const targetInput = $(`#${$(this).data('target')}`);
            const defaultVal = $(this).data('default');

            // If wpColorPicker is active, update via its method
            if (
                typeof $.fn.wpColorPicker !== 'undefined' &&
                targetInput.hasClass('wp-color-picker')
            ) {
                targetInput.wpColorPicker('color', defaultVal);
            } else {
                targetInput.val(defaultVal);
            }
            targetInput.trigger('change'); // trigger change so live preview updates if applicable
        });

        // Tab Switching Logic
        var $tabs = $('#xfact-tabs .xfact-tab');
        var $contents = $('.xfact-tab-content');

        function activateTab(target) {
            $tabs.removeClass('xfact-active-tab');
            $tabs.filter(`[href="${target}"]`).addClass('xfact-active-tab');

            $contents.removeClass('xfact-active-tab-content').hide();
            $(target).addClass('xfact-active-tab-content').show();

            // Store active tab in localStorage
            if (window.localStorage) {
                localStorage.setItem('xfact_active_settings_tab', target);
            }
        }

        $tabs.on('click', function (e) {
            e.preventDefault();
            const target = $(this).attr('href');
            activateTab(target);
            // Update URL hash without jumping
            if (history.pushState) {
                history.pushState(null, null, target);
            } else {
                window.location.hash = target;
            }

            // Scroll to top of the settings container
            $('html, body').animate(
                {
                    scrollTop: $('.xfact-settings-container').offset().top - 40,
                },
                300,
            );
        });

        // Load active tab on page load
        const hash = window.location.hash;
        if (hash && $tabs.filter(`[href="${hash}"]`).length) {
            activateTab(hash);
        } else if (window.localStorage) {
            const storedTab = localStorage.getItem('xfact_active_settings_tab');
            if (storedTab && $tabs.filter(`[href="${storedTab}"]`).length) {
                activateTab(storedTab);
            }
        }

        // --- LIVE PREVIEW LOGIC ---

        var $previewIframe = $('#xfact-live-preview-iframe');
        var $themeBtns = $('.xfact-theme-btn');

        // Jump to preview button
        $('#xfact-jump-to-preview').on('click', (e) => {
            e.preventDefault();
            $('html, body').animate(
                {
                    scrollTop:
                        $('#xfact-live-preview-section').offset().top - 40,
                },
                500,
            );
        });

        // Back to settings button
        $('#xfact-back-to-settings').on('click', (e) => {
            e.preventDefault();
            $('html, body').animate(
                {
                    scrollTop: $('.xfact-settings-container').offset().top - 40,
                },
                500,
            );
        });

        // Initialize the active theme button based on localStorage to avoid iframe race conditions
        const storedTheme = localStorage.getItem('xfact-theme');
        const initialTheme =
            storedTheme === 'dark' || storedTheme === 'light'
                ? storedTheme
                : window.matchMedia('(prefers-color-scheme: light)').matches
                  ? 'light'
                  : 'dark';
        $themeBtns.filter(`[data-theme="${initialTheme}"]`).addClass('active');

        function checkThemeSettings() {
            const disabled = $('#xfact_disable_dark_mode').is(':checked');
            const defaultMode =
                $('input[name="xfact_theme_mode"]:checked').val() ||
                $('#xfact_theme_mode').val();

            if (disabled) {
                $('.xfact-preview-theme-toggle').hide();
                $themeBtns.removeClass('active');
                $themeBtns.filter('[data-theme="light"]').addClass('active');
                sendPreviewUpdate({ type: 'theme', value: 'light' });

                // Disable dark and system options in the default theme mode radio group
                $('input[name="xfact_theme_mode"][value="dark"]')
                    .prop('disabled', true)
                    .closest('label')
                    .addClass('disabled');
                $('input[name="xfact_theme_mode"][value="system"]')
                    .prop('disabled', true)
                    .closest('label')
                    .addClass('disabled');

                // Force default to light if not already
                if (defaultMode !== 'light') {
                    $('input[name="xfact_theme_mode"][value="light"]').prop(
                        'checked',
                        true,
                    );
                }
            } else {
                $('.xfact-preview-theme-toggle').show();

                // Enable all options
                $('input[name="xfact_theme_mode"]')
                    .prop('disabled', false)
                    .closest('label')
                    .removeClass('disabled');
            }
        }

        $('#xfact_disable_dark_mode, input[name="xfact_theme_mode"]').on(
            'change',
            () => {
                checkThemeSettings();
                const disabled = $('#xfact_disable_dark_mode').is(':checked');
                if (!disabled) {
                    const defaultMode =
                        $('input[name="xfact_theme_mode"]:checked').val() ||
                        $('#xfact_theme_mode').val();
                    const newTheme =
                        defaultMode === 'system' ? initialTheme : defaultMode;
                    $themeBtns.removeClass('active');
                    $themeBtns
                        .filter(`[data-theme="${newTheme}"]`)
                        .addClass('active');
                    sendPreviewUpdate({ type: 'theme', value: newTheme });
                }
            },
        );

        // Toggle Theme
        $themeBtns.on('click', function (e) {
            e.preventDefault();
            $themeBtns.removeClass('active');
            var $btn = $(this);
            $btn.addClass('active');

            const theme = $btn.data('theme');
            sendPreviewUpdate({ type: 'theme', value: theme });
        });

        // Listen for theme changes triggered from inside the iframe
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'xfact_theme_changed') {
                $themeBtns.removeClass('active');
                $themeBtns
                    .filter(`[data-theme="${event.data.value}"]`)
                    .addClass('active');

                // Echo the theme change back to the iframe so preview-receiver.js
                // updates its internal currentTheme state and re-renders the custom color variables
                sendPreviewUpdate({ type: 'theme', value: event.data.value });
            }
        });

        // Send form state to iframe
        function sendPreviewUpdate(explicitPayload) {
            if (!$previewIframe.length || !$previewIframe[0].contentWindow) {
                return;
            }

            const payload = explicitPayload || { type: 'styles', vars: {} };
            payload.disableDarkMode = $('#xfact_disable_dark_mode').is(
                ':checked',
            );

            if (!explicitPayload) {
                // Gather Primitive Colors
                payload.primitives = {};
                $('.xfact-primitive-input').each(function () {
                    const slug = $(this).data('slug');
                    payload.primitives[slug] = $(this).val();
                });

                // Gather Semantic Colors
                payload.semantics = {};
                $('.xfact-semantic-input').each(function () {
                    const id = $(this).attr('id'); // e.g. xfact_semantic_primary
                    if (id && id.indexOf('xfact_semantic_') === 0) {
                        const slug = id
                            .replace('xfact_semantic_', '')
                            .replace(/_/g, '-');
                        payload.semantics[slug] = $(this).val(); // This will be the primitive slug
                    }
                });

                // Gather Dark Semantic Colors
                payload.darkSemantics = {};
                $('.xfact-dark-semantic-input').each(function () {
                    const id = $(this).attr('id'); // e.g. xfact_dark_semantic_primary
                    if (id && id.indexOf('xfact_dark_semantic_') === 0) {
                        const slug = id
                            .replace('xfact_dark_semantic_', '')
                            .replace(/_/g, '-');
                        payload.darkSemantics[slug] = $(this).val();
                    }
                });

                // Gather Typography
                const headingFont = $('#xfact_font_heading').val();
                const bodyFont = $('#xfact_font_body').val();

                // Resolve custom fonts
                const fontMap = {
                    inter: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    'ibm-plex-mono': "'IBM Plex Mono', monospace",
                };

                // Map any custom font inputs
                $('.xfact-custom-font-row').each(function () {
                    const name = $(this).find('input[name$="[name]"]').val();
                    const family = $(this)
                        .find('input[name$="[fontFamily]"]')
                        .val();
                    if (name && family) {
                        const slug = name
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)+/g, '');
                        fontMap[slug] = `'${family}'`;
                    }
                });

                if (fontMap[headingFont]) {
                    payload.vars['--wp--preset--font-family--heading'] =
                        `${fontMap[headingFont]} !important`;
                }
                if (fontMap[bodyFont]) {
                    payload.vars['--wp--preset--font-family--body'] =
                        `${fontMap[bodyFont]} !important`;
                }
            }

            // Send postMessage
            $previewIframe[0].contentWindow.postMessage(payload, '*');
        }

        // Swatch Picker Logic
        $(document).on('click', '.xfact-swatch-trigger', function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $popover = $(this).siblings('.xfact-swatch-popover');
            const isVisible = $popover.is(':visible');

            // Close all other popovers
            $('.xfact-swatch-popover').hide();

            // Toggle this popover correctly
            if (!isVisible) {
                $popover.show();
            }
        });

        // Close popovers when clicking outside
        $(document).on('click', (e) => {
            if (!$(e.target).closest('.xfact-swatch-picker').length) {
                $('.xfact-swatch-popover').hide();
            }
        });

        $(document).on('click', '.xfact-swatch-popover-item', function (e) {
            e.preventDefault();
            var $swatch = $(this);
            var $picker = $swatch.closest('.xfact-swatch-picker');
            var $input = $picker.find('input[type="hidden"]');
            var $trigger = $picker.find('.xfact-swatch-trigger');

            // Update UI
            $picker.find('.xfact-swatch-popover-item').removeClass('active');
            $swatch.addClass('active');

            // Update Trigger UI
            $trigger
                .find('.xfact-swatch-preview')
                .css('background-color', $swatch.data('hex'));
            $trigger.find('.xfact-swatch-label').text($swatch.data('value'));

            // Close popover
            $picker.find('.xfact-swatch-popover').hide();

            // Update value
            $input.val($swatch.data('value')).trigger('change');

            // Explicitly trigger preview update
            if (typeof sendPreviewUpdate === 'function') {
                sendPreviewUpdate();
            }
        });

        // Sync Swatch UI when input changes programmatically (e.g. reset)
        $('.xfact-semantic-input, .xfact-dark-semantic-input').on(
            'change',
            function () {
                const val = $(this).val();
                var $picker = $(this).closest('.xfact-swatch-picker');
                if ($picker.length === 0) {
                    $picker = $(this).parent().find('.xfact-swatch-picker');
                }
                if ($picker.length === 0) {
                    $picker = $(this)
                        .closest('td')
                        .find('.xfact-swatch-picker');
                }

                $picker = $(this).closest('.xfact-swatch-picker');

                var $swatch = $picker.find(
                    `.xfact-swatch-popover-item[data-value="${val}"]`,
                );

                $picker
                    .find('.xfact-swatch-popover-item')
                    .removeClass('active');
                $swatch.addClass('active');

                var $trigger = $picker.find('.xfact-swatch-trigger');
                if ($swatch.length && $trigger.length) {
                    $trigger
                        .find('.xfact-swatch-preview')
                        .css('background-color', $swatch.data('hex'));
                    $trigger.find('.xfact-swatch-label').text(val);
                }
            },
        );

        // Listen to all inputs
        let updateTimer;
        $('#xfact-settings-form').on('change keyup', 'input, select', () => {
            clearTimeout(updateTimer);
            updateTimer = setTimeout(() => {
                sendPreviewUpdate();
            }, 250);
        });

        // Color picker change event (wpColorPicker)
        if (typeof $.fn.wpColorPicker !== 'undefined') {
            $('.xfact-color-picker').wpColorPicker({
                change: (_event, _ui) => {
                    hasUnsavedChanges = true;
                    clearTimeout(updateTimer);
                    updateTimer = setTimeout(() => {
                        sendPreviewUpdate();
                    }, 50);
                },
            });
        }

        // Send initial payload when iframe loads
        $previewIframe.on('load', () => {
            sendPreviewUpdate();
            const currentTheme =
                $themeBtns.filter('.active').data('theme') || 'light';
            sendPreviewUpdate({ type: 'theme', value: currentTheme });
        });

        // Unsaved Changes Warning
        let hasUnsavedChanges = false;

        $('#xfact-settings-form').on('change input', () => {
            hasUnsavedChanges = true;
        });

        // Catch reset buttons and media upload triggers
        $(
            '.xfact-admin-upload-btn, .xfact-admin-reset-btn, .xfact-reset-color-btn, .xfact-reset-font-btn',
        ).on('click', () => {
            hasUnsavedChanges = true;
        });

        $(window).on('beforeunload', () => {
            if (hasUnsavedChanges) {
                return 'You have unsaved changes. Are you sure you want to leave without saving?';
            }
        });

        $('#xfact-settings-form').on('submit', () => {
            hasUnsavedChanges = false;
        });
    });
})(jQuery);
