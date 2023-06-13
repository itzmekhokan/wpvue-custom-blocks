<?php
/**
 * IntroBlock block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * IntroBlock class.
 */
class IntroBlock extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'intro-block';

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
				'title'    	=> $this->get_schema_string(),
				'logo'    	=> $this->get_schema_string(),
				'content'   => $this->get_schema_string(),
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
		$attributes['title'] = ( isset( $attributes['title'] ) && $attributes['title'] ) ? do_shortcode( $attributes['title'] ) : '';
		$attributes['title_tag'] = ( isset( $attributes['title_tag'] ) && $attributes['title_tag'] ) ? $attributes['title_tag'] : 'h1';
		$attributes['alignment'] = ( isset( $attributes['alignment'] ) && $attributes['alignment'] ) ? $attributes['alignment'] : 'left';
		$attributes['content'] = ( isset( $attributes['content'] ) && $attributes['content'] ) ? do_shortcode( $attributes['content'] ) : '';
		$attributes['content_padding_lr'] = ( isset( $attributes['content_padding_lr'] ) && $attributes['content_padding_lr'] ) ? absint( $attributes['content_padding_lr'] ) : 0;
		$attributes['no_of_lines'] = ( isset( $attributes['no_of_lines'] ) && $attributes['no_of_lines'] ) ? $attributes['no_of_lines'] : '2';
		$attributes['no_of_lines_mobile'] = ( isset( $attributes['no_of_lines_mobile'] ) && $attributes['no_of_lines_mobile'] ) ? $attributes['no_of_lines_mobile'] : '2';
		$attributes['enable_bg_color'] = ( isset( $attributes['enable_bg_color'] ) && !$attributes['enable_bg_color'] ) ? false : true;
		$attributes['disable_showmore'] = ( isset( $attributes['disable_showmore'] ) && $attributes['disable_showmore'] ) ? true : false;
		$attributes['disable_showmore_mobile'] = ( isset( $attributes['disable_showmore_mobile'] ) && $attributes['disable_showmore_mobile'] ) ? true : false;
		$attributes['enable_top_space'] = ( isset( $attributes['enable_top_space'] ) && $attributes['enable_top_space'] ) ? true : false;
		$attributes['custom_bg_color'] = ( isset( $attributes['custom_bg_color'] ) && $attributes['custom_bg_color'] ) ? $attributes['custom_bg_color'] : '';
		//$attributes['bg_color'] = get_theme_option( 'primary_color' );
		return $attributes;
	}
}
