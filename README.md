# xFact WordPress

A production-ready WordPress site for [xFact](https://xfact.com) — technology services for public-sector organizations. Built as a custom block theme with Docker-based infrastructure and automated code quality tooling.

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
git clone https://github.com/seyLu/xfact-wp.git
cd xfact-wp

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
xfact-wp/
├── .agents/skills/                 # AI agent skills (coding standards reference)
├── .design-guide/                  # Design System Documentation
│   ├── DESIGN-GUIDE.md             # Source markdown documentation
│   ├── DESIGN-GUIDE.pdf            # Exported PDF Design Guide
│   └── pdf-export-styles.css       # PDF rendering stylesheet
├── .editorconfig                   # Editor formatting rules (tabs for PHP, spaces for data files)
├── .env.example                    # Environment variable template
├── .github/workflows/lint.yml      # CI: runs Lefthook pre-commit checks
├── blueprint.json                  # WordPress Playground configuration
├── composer.json                   # Dev dependencies (PHPStan, WPCS, PHPCompatibility)
├── config/php.ini                  # PHP tuning (uploads, memory, execution limits)
├── docker/
│   ├── nginx/default.conf          # Reverse proxy, gzip, security headers, caching
│   ├── scripts/
│   │   ├── setup.sh                # WP auto-install script (runs via wp-setup sidecar)
│   │   ├── export-db.sh                # WP Engine database export and rewrite script
│   │   ├── seed-content.sh         # Seeding script for block-based content
│   │   └── seed-seo.php            # Yoast SEO migration script
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
        └── xfact/                  # ← The xFact block theme
```

## Theme Structure

The **xFact Theme** is a [WordPress block theme](https://developer.wordpress.org/themes/block-themes/) targeting WordPress 6.9+ and PHP 8.0+. All visual configuration is centralized in `theme.json` v3 and editable through the **Site Editor** (`/wp-admin/site-editor.php`).

```
xfact/
├── style.css          # Theme metadata header (name, version, text domain, tags)
├── theme.json         # Global settings & styles — the design system source of truth
├── functions.php      # Theme setup: block styles support, editor styles, asset enqueue
├── inc/
│   ├── admin-settings-page.php # Standalone admin settings page for the theme
│   ├── blocks.php     # Auto-registers all blocks from blocks/*/block.json
│   ├── dynamic-styles.php # Fetches configured colors and injects them as CSS variables
│   ├── enqueue.php    # Frontend CSS/JS enqueueing
│   ├── icons.php      # Lucide-style SVG icon helper
│   ├── images.php     # Shared image rendering helpers
│   ├── post-types.php # Registers custom post types (e.g., case_study)
│   ├── settings.php   # Registers theme settings via REST API
│   └── template-parts.php # Template-part render filters
├── assets/
│   ├── css/           # Global CSS (animations, dark mode, utilities)
│   ├── js/            # Dark mode toggle, fade-in, hero slideshow
│   └── images/        # Hero images, logos, video
├── blocks/            # 18 custom dynamic blocks (block.json + render.php + style.css)
│   ├── capability-areas/
│   ├── capabilities-pipeline/
│   ├── case-study-grid/
│   ├── case-study-details/
│   ├── code-embed/
│   ├── contact-form/
│   ├── cta-section/
│   ├── feature-cards/
│   ├── hero/
│   ├── logo-strip/
│   ├── metrics-strip/
│   ├── navigation-cards/
│   ├── section-heading/
│   ├── section-list/
│   ├── solutions-grid/
│   ├── support-channels/
│   ├── team-grid/
│   └── text-section/
├── templates/         # 14 full-page layouts (block markup)
│   ├── front-page.html    # Homepage (8 sections)
│   ├── page-solutions.html
│   ├── page-contact.html
│   ├── page-careers.html
│   ├── page-support.html
│   ├── page-privacy.html
│   ├── page-terms.html
│   ├── index.html         # Blog listing
│   ├── single.html        # Single post
│   ├── page.html          # Generic page
│   ├── archive.html       # Category/tag/date archives
│   ├── search.html        # Search results
│   ├── single-case_study.html # Single case study template
│   └── 404.html           # Not-found page
├── parts/             # Reusable template parts (must NOT be nested in subdirectories)
│   ├── header.html    # Sticky header with logo, navigation, CTA, dark mode toggle
│   └── footer.html    # 3-column footer with social links + copyright pattern
├── patterns/          # Block patterns registered via PHP file headers
│   ├── footer-copyright.php  # Dynamic copyright with current year
│   └── 404-content.php       # 404 error page content
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
│  main content area          │  ← wp:group + custom blocks / wp:post-content
│                             │
├─────────────────────────────┤
│  footer (parts/footer.html) │  ← wp:template-part
└─────────────────────────────┘
```

### Custom Blocks

All 18 blocks are **dynamic** (server-rendered via `render.php`), use `apiVersion: 3`, and follow WordPress coding standards:

| Block | Description |
|-------|-------------|
| `xfact/capability-areas` | Three-column capability layout |
| `xfact/capabilities-pipeline` | Horizontal pipeline with arrow connectors |
| `xfact/case-study-grid` | Alternating background case study card grid |
| `xfact/case-study-details` | Full case study page layout with sections |
| `xfact/code-embed` | Embed block for code snippets |
| `xfact/contact-form` | Contact form with email-based submission |
| `xfact/cta-section` | Call-to-action with gradient accent line and watermark |
| `xfact/feature-cards` | Card grid for values/features |
| `xfact/hero` | Unified hero block with media (slideshow/video) and standard (text focus) variants |
| `xfact/logo-strip` | Partner logo display strip |
| `xfact/metrics-strip` | 4-metric stats row on dark background |
| `xfact/navigation-cards` | Interactive routing cards (Other Industries) |
| `xfact/section-heading` | Reusable section label + heading + subtitle |
| `xfact/section-list` | Standard bulleted section list |
| `xfact/solutions-grid` | 5-card grid of sector solutions with hover effects |
| `xfact/support-channels` | Support channel cards with existing client CTA |
| `xfact/team-grid` | Grid of team members for the Leadership page |
| `xfact/text-section` | Content section with optional badge and tags |

## Customizing the Theme

### Design Tokens (`theme.json`)

The design system is declared entirely in `theme.json` v3. Change these values to rebrand the theme:

#### Colors (18-color palette)

| Token | Default | Usage |
|-------|---------|-------|
| `navy-950` | `#09172f` | Darkest background |
| `navy-900` | `#022038` | Dark background |
| `navy-800` | `#06384f` | Elevated surfaces |
| `navy-700` | `#0a4d6b` | Card backgrounds |
| `navy-600` | `#32558f` | Accent backgrounds |
| `accent` | `#5C8AE6` | Links, highlights |
| `accent-dark` | `#3A6BD4` | Hover/focus states |
| `accent-darkest` | `#123e99` | Buttons |
| `surface` | `#f5f7fa` | Page background |
| `surface-alt` | `#ffffff` | Cards, alt sections |
| `surface-dark` | `#0d1f35` | Dark sections |
| `surface-raised` | `#06384f` | Raised dark elements |
| `border` | `#e2e8f0` | Borders, dividers |
| `text-primary` | `#1a202c` | Body text, headings |
| `text-secondary` | `#4a5568` | Excerpts, descriptions |
| `text-muted` | `#718096` | Captions, dates |
| `dark-section` | `#0d2d6b` | Dark section backgrounds |
| `white` | `#ffffff` | White text/elements |

#### Typography

- **Font**: Inter (Google Fonts, loaded via `fontFace` — no external stylesheet)
- **Fallback stack**: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
- **Monospace**: JetBrains Mono / Fira Code / Cascadia Code (system fallback)
- **6 fluid font sizes**: `small` → `hero` with `clamp()`-based fluid scaling

#### Spacing

A 7-step geometric scale (`1.5rem` base, `×1.5` multiplier) accessible as `var(--wp--preset--spacing--10)` through `var(--wp--preset--spacing--70)`.

#### Shadows

Four presets: `small`, `medium`, `large`, `accent-glow` — from subtle to accent-colored.

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
 * Slug: xfact/my-pattern
 * Categories: featured
 * Keywords: keyword1, keyword2
 * Description: A short description of the pattern.
 *
 * @package xfact
 */
?>

<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group">
    <!-- Your block markup here -->
</div>
<!-- /wp:group -->
```

Patterns appear automatically in the Block Editor inserter under their category.

### Adding a New Block

Create a new directory under `blocks/` with at minimum:

```
blocks/my-block/
├── block.json      # Metadata (apiVersion 3, name, attributes, render, style)
├── render.php      # Server-side render template
└── style.css       # Block-specific styles
```

Blocks are auto-registered by `inc/blocks.php` — no additional PHP registration needed.

### Style Variations

The theme ships with a **Dark** style variation (`styles/dark.json`). Users can switch via **Appearance → Editor → Styles**.

To add a new style variation, create a JSON file in `styles/`:

```json
{
  "version": 3,
  "title": "My Variation",
  "settings": {
    "color": {
      "palette": [
        { "slug": "surface", "color": "#1a1a2e", "name": "Surface" }
      ]
    }
  },
  "styles": {
    "color": {
      "background": "#1a1a2e",
      "text": "#ffffff"
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
| **PHPCS** | `phpcs.xml.dist` | WordPress Coding Standards + PHPCompatibility (excludes third-party plugins) |
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

The `blueprint.json` installs the xFact theme, copies the mu-plugin, sets site options, and configures pretty permalinks.

## Deployment

### WP Engine (Managed Hosting)

To deploy this site from your local Docker environment to WP Engine:

1. **Export the Database**
   Run the export script to generate an SQL dump where your local URL is safely replaced with the staging/production domain.
   ```bash
   ./docker/scripts/export-db.sh
   # Optionally pass a custom domain: ./docker/scripts/export-db.sh xfact.com
   ```
   This creates a `.sql` file in the `backups/` directory.

2. **Deploy Code via Git Push (SSH)**
   WP Engine supports direct Git deployments. First, add your SSH key in the WP Engine User Portal, then add the environment as a git remote:
   ```bash
   git remote add production git@git.wpengine.com:production/your-environment-name.git
   git push production main
   ```

3. **Import the Database via phpMyAdmin**
   - Log in to your WP Engine User Portal.
   - Navigate to your environment and open **phpMyAdmin**.
   - Select your target database.
   - Click the **Import** tab.
   - Upload the `.sql` file generated in step 1 and execute the import.

4. **Final Steps**
   - Clear the WP Engine object and page caches in the user portal.
   - Visit your newly deployed site to verify everything is working!

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
