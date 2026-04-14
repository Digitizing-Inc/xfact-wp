# WordPress Template

A production-ready WordPress starter template with a custom block theme, Docker-based infrastructure, and automated code quality tooling. Clone, customize, and deploy anywhere.

## Stack

| Service | Image | Purpose |
|---------|-------|---------|
| **WordPress** | `wordpress:6.9-php8.3-apache` + custom | PHP 8.3, WP-CLI, Redis extension, OPcache |
| **MariaDB** | `mariadb:11` | Database with optimized InnoDB settings |
| **Redis** | `redis:7-alpine` | Persistent object caching |
| **Nginx** | `nginx:alpine` | Reverse proxy, gzip, static caching, security headers |
| **WP-Setup** | `wordpress:cli-php8.3` + custom | One-shot sidecar: auto-installs WP, activates theme, configures Redis |

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/seyLu/wordpress-template.git
cd wordpress-template

# 2. Create environment file
cp .env.example .env
# Edit .env with your values (especially passwords for production)

# 3. Install PHP dev dependencies
composer install

# 4. Start the stack (WordPress auto-installs via wp-setup sidecar)
make up

# 5. Visit your site
open http://localhost:8080
```

## Project Structure

```
wordpress-template/
├── .agents/skills/                 # AI agent skills (coding standards reference)
├── .editorconfig                   # Editor formatting rules (tabs for PHP, spaces for data files)
├── .env.example                    # Environment variable template
├── .github/workflows/lint.yml      # CI: runs Lefthook pre-commit checks
├── blueprint.json                  # WordPress Playground configuration
├── composer.json                   # Dev dependencies (PHPStan, WPCS, PHPCompatibility)
├── config/php.ini                  # PHP tuning (uploads, memory, execution limits)
├── docker/
│   ├── nginx/default.conf          # Reverse proxy, gzip, security headers, caching
│   ├── scripts/setup.sh            # WP auto-install script (runs via wp-setup sidecar)
│   ├── wp-cli/Dockerfile           # Custom WP-CLI image (adds Redis PHP extension)
│   └── wordpress/Dockerfile        # Custom WP image (WP-CLI, Redis ext, OPcache)
├── docker-compose.yml              # Full stack definition (WP, MariaDB, Redis, Nginx)
├── docker-compose.override.yml     # Dev overrides (debug mode, Xdebug constants, ports)
├── lefthook.yml                    # Git hooks: auto-format → lint → static analysis
├── Makefile                        # Developer command shortcuts
├── phpcs.xml.dist                  # PHPCS ruleset (WordPress standards + PHPCompatibility)
├── phpstan.neon.dist               # PHPStan config (level 6, WordPress stubs)
├── wp-cli.yml                      # WP-CLI defaults (path, allow-root, apache_modules)
└── wp-content/
    ├── mu-plugins/
    │   └── starter-mu-plugin.php   # Always-active security hardening + performance tweaks
    ├── plugins/                    # Drop custom plugins here
    │   └── README.md
    └── themes/
        └── starter-theme/          # ← The block theme described below
```

## Theme Structure

The **Starter Theme** is a [WordPress block theme](https://developer.wordpress.org/themes/block-themes/) targeting WordPress 6.9+ and PHP 8.0+. All visual configuration is centralized in `theme.json` v3 and editable through the **Site Editor** (`/wp-admin/site-editor.php`).

```
starter-theme/
├── style.css          # Theme metadata header (name, version, text domain, tags)
├── theme.json         # Global settings & styles — the design system source of truth
├── functions.php      # Theme setup: block styles support, editor styles, style enqueue
├── templates/         # Full-page layouts (block markup)
│   ├── index.html     # Blog listing with query loop, pagination, and no-results fallback
│   ├── single.html    # Single post: title, meta, featured image, content, comments
│   ├── page.html      # Static page: title + content
│   ├── archive.html   # Category/tag/date archives with query loop
│   ├── search.html    # Search results with query loop and search form fallback
│   └── 404.html       # Not-found page with search form
├── parts/             # Reusable template parts (must NOT be nested in subdirectories)
│   ├── header.html    # Site title + navigation (Home, Blog, About, Contact)
│   └── footer.html    # Copyright line + legal links (Privacy Policy, Terms)
├── patterns/          # Block patterns registered via PHP file headers
│   └── hero.php       # Full-width hero: heading, description, two CTA buttons
└── styles/            # Style variations (alternative color schemes)
    └── dark.json      # Dark mode: light text on dark surfaces
```

### How Templates Work

Each template is an HTML file containing [WordPress block markup](https://developer.wordpress.org/block-editor/). Templates compose the page by referencing template parts and core blocks:

```
┌─────────────────────────────┐
│  header (parts/header.html) │  ← wp:template-part
├─────────────────────────────┤
│                             │
│  main content area          │  ← wp:group + wp:query / wp:post-content
│                             │
├─────────────────────────────┤
│  footer (parts/footer.html) │  ← wp:template-part
└─────────────────────────────┘
```

## Customizing the Theme

### Design Tokens (`theme.json`)

The design system is declared entirely in `theme.json` v3. Change these values to rebrand the theme instantly:

#### Colors (13-color palette)

| Token | Default | Usage |
|-------|---------|-------|
| `primary` | `#1e40af` | Buttons, links, accents |
| `primary-light` | `#3b82f6` | Hover/focus states |
| `secondary` | `#7c3aed` | Secondary accents |
| `accent` | `#06b6d4` | Highlights, badges |
| `surface` | `#ffffff` | Page background |
| `surface-alt` | `#f8fafc` | Code blocks, alt sections |
| `border` | `#e2e8f0` | Borders, dividers |
| `text-primary` | `#0f172a` | Body text, headings |
| `text-secondary` | `#475569` | Excerpts, secondary text |
| `text-muted` | `#94a3b8` | Captions, dates |
| `success` | `#16a34a` | Success states |
| `warning` | `#d97706` | Warning states |
| `error` | `#dc2626` | Error states |

To change the primary color, edit `theme.json`:

```json
{
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "#059669",
          "name": "Primary"
        }
      ]
    }
  }
}
```

#### Typography

- **Font**: Inter (Google Fonts, loaded via `fontFace` — no external stylesheet dependency)
- **Fallback stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
- **Monospace**: JetBrains Mono / Fira Code / Cascadia Code (system fallback chain)
- **6 fluid font sizes**: `small` → `xxx-large` with `clamp()`-based fluid scaling

#### Spacing

A 7-step geometric scale (`1.5rem` base, `×1.5` multiplier) accessible as `var(--wp--preset--spacing--10)` through `var(--wp--preset--spacing--70)`.

#### Borders

| Preset | Size |
|--------|------|
| `small` | `4px` |
| `medium` | `8px` |
| `large` | `16px` |
| `full` | `9999px` (pill shape) |

#### Shadows

Four presets: `small`, `medium`, `large`, `xl` — from subtle (`0 1px 2px`) to dramatic (`0 20px 25px`).

### Adding a New Template

1. Create `templates/my-template.html` with block markup
2. Start with header/footer parts:
   ```html
   <!-- wp:template-part {"slug":"header","area":"header"} /-->

   <!-- wp:group {"tagName":"main","layout":{"type":"constrained"}} -->
   <main class="wp-block-group">
       <!-- Your blocks here -->
   </main>
   <!-- /wp:group -->

   <!-- wp:template-part {"slug":"footer","area":"footer"} /-->
   ```
3. The template is automatically available in the Site Editor

### Adding a New Template Part

1. Create `parts/my-part.html` (flat — **no subdirectories**)
2. Register it in `theme.json` under `templateParts`:
   ```json
   {
     "templateParts": [
       { "name": "my-part", "title": "My Part", "area": "uncategorized" }
     ]
   }
   ```
3. Use it in templates: `<!-- wp:template-part {"slug":"my-part"} /-->`

### Adding a New Pattern

Create a PHP file in `patterns/` with the required header comment:

```php
<?php
/**
 * Title: My Pattern
 * Slug: starter-theme/my-pattern
 * Categories: featured
 * Keywords: keyword1, keyword2
 * Description: A short description of the pattern.
 *
 * @package starter-theme
 */
?>

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- Your block markup here -->
</div>
<!-- /wp:group -->
```

Patterns appear automatically in the Block Editor inserter under their category.

### Style Variations

The theme ships with a **Dark** style variation (`styles/dark.json`). Users can switch between the default light theme and dark mode via **Appearance → Editor → Styles**.

To add a new style variation, create a JSON file in `styles/`:

```json
{
  "version": 3,
  "title": "My Variation",
  "settings": {
    "color": {
      "palette": [
        { "slug": "primary", "color": "#059669", "name": "Primary" }
      ]
    }
  },
  "styles": {
    "color": {
      "background": "#ffffff",
      "text": "#0f172a"
    }
  }
}
```

> **Note**: Once a user selects a style variation, their choice is stored in the database. Changing the JSON file won't update what the user already selected — they must re-select it.

### Using the Site Editor

Most customizations can be made visually without editing files:

1. Go to **Appearance → Editor** (`/wp-admin/site-editor.php`)
2. **Styles** — change colors, typography, spacing globally; switch style variations (e.g. Dark mode)
3. **Templates** — edit or create page layouts
4. **Patterns** — manage reusable content sections

> **Note**: User customizations made in the Site Editor are stored in the database and take priority over `theme.json` defaults. If your `theme.json` changes seem "ignored", check for user overrides in the Styles panel.

## Security (MU-Plugin)

The must-use plugin (`wp-content/mu-plugins/starter-mu-plugin.php`) applies hardening automatically — no activation needed:

| Measure | What it does |
|---------|-------------|
| XML-RPC disabled | Blocks the legacy API commonly targeted by brute-force attacks |
| Version hidden | Removes WordPress version from HTML head and RSS feeds |
| REST user enumeration blocked | `/wp/v2/users` returns nothing for unauthenticated requests |
| Security headers | `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` |
| Emoji scripts removed | Saves ~50KB per page load |
| oEmbed discovery disabled | Reduces external HTTP requests |
| `wp_head` cleanup | Removes shortlinks, REST link, adjacent post links, RSD/WLW |
| Auto-updates disabled (Docker) | Prevents container state drift; updates via image rebuilds |
| Image quality raised | Default quality increased from 82 → 90 |

## Available Commands

Run `make help` to see all commands:

| Command | Description |
|---------|-------------|
| `make up` | Start all containers (detached) |
| `make down` | Stop all containers |
| `make restart` | Restart all containers |
| `make logs` | Follow container logs |
| `make logs-wp` | Follow WordPress container logs only |
| `make shell` | Open bash in WordPress container |
| `make wp CMD="..."` | Run WP-CLI command |
| `make setup` | Re-run WordPress setup (via WP-CLI sidecar) |
| `make db-export` | Export database to `backup.sql` |
| `make db-import` | Import database from `backup.sql` |
| `make lint` | Run PHPStan + PHPCS |
| `make phpstan` | Run PHPStan static analysis |
| `make phpcs` | Run PHPCS coding standards check |
| `make phpcbf` | Auto-fix PHPCS violations |
| `make hooks` | Install Lefthook git hooks |
| `make playground` | Start WordPress Playground preview |
| `make clean` | Stop & remove all data ⚠️ |
| `make rebuild` | Force rebuild images and recreate containers |

## Code Quality

### Tools

| Tool | Config | Purpose |
|------|--------|---------|
| **PHPCS** | `phpcs.xml.dist` | WordPress Coding Standards + PHPCompatibility |
| **PHPStan** | `phpstan.neon.dist` | Static analysis (level 6) with WordPress stubs |
| **Lefthook** | `lefthook.yml` | Git pre-commit hooks |

### Pre-Commit Workflow

Lefthook runs these checks sequentially on every commit:

1. **`phpcbf-format`** — Auto-fix coding standard violations on staged PHP files
2. **`phpcs-lint`** — Check remaining violations (fails the commit if any remain)
3. **`phpstan-check`** — Run static type analysis

### Setup

```bash
# Install PHP dev dependencies
composer install

# Install git hooks
make hooks
# or: lefthook install

# Run checks manually
lefthook run pre-commit
# or: make lint
```

## WordPress Playground (Quick Preview)

Test the theme without Docker using [WordPress Playground](https://playground.wordpress.net):

```bash
make playground
# or
npx @wp-playground/cli@latest server --blueprint=./blueprint.json --blueprint-may-read-adjacent-files
```

The `blueprint.json` installs the starter theme, copies the mu-plugin, sets site options, and configures pretty permalinks.

## Deployment

### Docker Compose (VPS/Server)

1. Copy the repo to your server
2. Create `.env` with production values:
   - Strong passwords for `DB_PASSWORD` and `DB_ROOT_PASSWORD`
   - Real domain in `WP_SITE_URL`
   - `FORCE_SSL_ADMIN=true`
   - Generate salts at https://api.wordpress.org/secret-key/1.1/salt/
3. Remove `docker-compose.override.yml` (disables debug mode, Xdebug, exposed ports)
4. Set `NGINX_PORT=80` (or use a reverse proxy)
5. `docker compose up -d` (WordPress auto-installs via the `wp-setup` sidecar)

### Production Checklist

- [ ] Generate unique WordPress salts
- [ ] Use strong database passwords
- [ ] Set `WP_DEBUG=false`
- [ ] Remove `docker-compose.override.yml`
- [ ] Configure SSL (Let's Encrypt / Cloudflare)
- [ ] Set `FORCE_SSL_ADMIN=true`
- [ ] Set up automated backups (`make db-export` via cron)
- [ ] Consider external media storage (S3, CDN)

## WP-CLI Examples

```bash
# Check WordPress status
make wp CMD="core version"

# List active plugins
make wp CMD="plugin list --status=active"

# Install a plugin
make wp CMD="plugin install woocommerce --activate"

# Export database
make db-export

# Search-replace URLs (dry run first!)
make wp CMD="search-replace 'http://localhost:8080' 'https://yourdomain.com' --dry-run"
```

## License

GPL-2.0-or-later
