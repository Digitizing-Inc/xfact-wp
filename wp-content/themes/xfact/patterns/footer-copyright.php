<?php
/**
 * Title: Footer Copyright
 * Slug: xfact/footer-copyright
 * Categories: footer
 * Description: Dynamic copyright with current year.
 *
 * @package xfact
 */

declare(strict_types=1);
?>

<!-- wp:paragraph {"textColor":"text-muted","fontSize":"small"} -->
<p class="has-text-muted-color has-text-color has-small-font-size">© <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php esc_html_e( 'xFact. All rights reserved.', 'xfact' ); ?></p>
<!-- /wp:paragraph -->
