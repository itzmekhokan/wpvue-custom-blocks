<?php
/**
 * BonusCards block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * BonusCards class.
 */
class BonusCards extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'bonus-cards';

	/**
	 * Get block attributes.
	 *
	 * @return array
	 */
	protected function get_attributes() {
		return array_merge(
			parent::get_attributes(),
			array(
				'block_title'    	=> $this->get_schema_string(),
				'block_subtitle'    => $this->get_schema_string(),
				'block_tabletitle'  => $this->get_schema_string(),
				'enable_table_data' => $this->get_schema_boolean( false ),
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
		$style = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'default';
		$info = array();
		if( isset( $attributes['info'] ) ) {
			$bonus_info = array();
			foreach( $attributes['info'] as $info ) {
				$is_highlight_title = ( isset( $info['enable_highlight_title'] ) && $info['enable_highlight_title'] ) ? true : false;
				$info['keep_cta_text_hover'] = ( isset( $info['keep_cta_text_hover'] ) && $info['keep_cta_text_hover'] ) ? true : false;
				$info['image'] = ( isset( $info['image'] ) && $info['image'] ) ? $info['image'] : '';
				if( $is_highlight_title ) {
					$info['title_bg'] = get_theme_option( 'tag_bg_color' );
				}else{
					$info['title_bg'] = get_theme_option( 'block_blue_progressive_bg_color' );
				}
				$info['title_tag'] = ( isset( $info['title_tag'] ) && $info['title_tag'] ) ? $info['title_tag'] : 'h3';
				$info['title'] = ( isset( $info['title'] ) && $info['title'] ) ? wpvue_tag_compiler( do_shortcode( $info['title'] ), $partner_id ) : '';
				$info['content'] = ( isset( $info['content'] ) && $info['content'] ) ? wpvue_tag_compiler( do_shortcode( $info['content'] ), $partner_id ) : '';
				$info['cta_text'] = ( isset( $info['cta_text'] ) && $info['cta_text'] ) ? wpvue_tag_compiler( do_shortcode( $info['cta_text'] ), $partner_id ) : '';
				$bonus_info[] = $info;
			}
			return array( 'style' => $style, 'info' => $bonus_info );
		}
		return $info;
	}
}
