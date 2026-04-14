<?php
/**
 * Title: Footer Copyright
 * Slug: starter-theme/footer-copyright
 * Categories: footer
 * Keywords: copyright, footer, year
 * Description: Copyright line with dynamic year.
 * Inserter: false
 *
 * @package starter-theme
 */

?>

<!-- wp:paragraph {"fontSize":"small"} -->
<p class="has-small-font-size">© <?php echo esc_html( gmdate( 'Y' ) ); ?> · Built with <a href="https://wordpress.org" rel="nofollow">WordPress</a></p>
<!-- /wp:paragraph -->
