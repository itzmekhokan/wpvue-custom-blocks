<?php
/**
 * PageMenuBlocksScroll block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * PageMenuBlocksScroll class.
 */
class PageMenuBlocksScroll extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'page-menu-blocks-scroll';

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
		$text_tag = ( isset( $attributes['text_tag'] ) && $attributes['text_tag'] ) ? $attributes['text_tag'] : 'h2';
		$content = ( isset( $attributes['content'] ) && $attributes['content'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['content'] ), $partner_id ) : '';
		$filtered_content = array(
			'menu' => array()
		);
		if( isset( $attributes['info'] ) ) {
			foreach( $attributes['info'] as $info ) {
				$info['menu_name'] = ( isset( $info['menu_name'] ) && $info['menu_name'] ) ? wpvue_tag_compiler( do_shortcode( $info['menu_name'] ), $partner_id ) : '';
				$filtered_content['menu'][] = $info;
			}
		}
		return $filtered_content;
	}
}
