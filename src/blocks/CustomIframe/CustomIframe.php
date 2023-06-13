<?php
/**
 * CustomIframe block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * CustomIframe class.
 */
class CustomIframe extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'custom-iframe';

	/**
	 * Initiate class.
	 *
	 * @return Block Object
	 */
	public function __construct() {
		//parent::__construct();
	}

	/**
	 * Get block attributes.
	 *
	 * @return array
	 */
	protected function get_attributes() {
		return array_merge(
			parent::get_attributes(),
			array(
			)
		);
	}

	/**
	 * Render the block.
	 *
	 * @param array  $attributes Block attributes. Default empty array.
	 * @param string $content    Block content. Default empty string.
	 * @return string Rendered block type output.
	 */
	public function render( $attributes = array(), $content = '' ) {
		return '';
	}

	/**
	 * Render filtered Content for REST.
	 *
	 * @param string $content    Block content. Default empty string.
	 * @param array  $block Block array. Default empty array.
	 * @return array FilteredContent block type output.
	 */
	public function render_filtered_content( $content, $block ) {
		if( $block['blockName'] !== $this->namespace . '/' . $this->block_name ) return $content;

		$attributes = $block['attrs'];
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;
		$attributes['url'] = isset( $attributes['url'] ) ? $attributes['url'] : '';
		$attributes['enable_for_gamepage'] = ( isset( $attributes['enable_for_gamepage'] ) && $attributes['enable_for_gamepage'] ) ? true : false;
		$attributes['align'] = ( isset( $attributes['align'] ) && $attributes['align'] ) ? $attributes['align'] : '';
		$attributes['bg_color'] = isset( $attributes['bg_color'] ) ? $attributes['bg_color'] : '';
		$attributes['game_title'] = isset( $attributes['game_title'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['game_title'] ), $partner_id ) : '';
		$attributes['game_desktop_banner'] = isset( $attributes['game_desktop_banner'] ) ? $attributes['game_desktop_banner'] : '';
		$attributes['game_mobile_banner'] = isset( $attributes['game_mobile_banner'] ) ? $attributes['game_mobile_banner'] : '';
		$attributes['enable_different_game_url_for_mobile'] = ( isset( $attributes['enable_different_game_url_for_mobile'] ) && $attributes['enable_different_game_url_for_mobile'] ) ? true : false;
		$attributes['mobile_game_iframe_url'] = ( isset( $attributes['mobile_game_iframe_url'] ) && $attributes['mobile_game_iframe_url'] ) ? $attributes['mobile_game_iframe_url'] : '';
		$attributes['enable_overlay'] = ( isset( $attributes['enable_overlay'] ) && $attributes['enable_overlay'] ) ? true : false;

		return $attributes;
	}
}
