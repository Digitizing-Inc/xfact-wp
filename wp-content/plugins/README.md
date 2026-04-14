# Custom Plugins

Place your custom WordPress plugins here.

Each plugin should be in its own directory:

```
plugins/
├── my-plugin/
│   ├── my-plugin.php    # Main plugin file with plugin header
│   └── includes/        # Additional PHP files
└── another-plugin/
    └── another-plugin.php
```

Plugins placed here will be automatically mounted into the WordPress container
via Docker volumes and available for activation in `wp-admin/plugins.php`.

## Install via WP-CLI

```bash
make wp CMD="plugin install woocommerce --activate"
```
