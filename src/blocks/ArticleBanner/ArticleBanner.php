<?php
/**
 * ArticleBanner block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * ArticleBanner class.
 */
class ArticleBanner extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'article-banner';

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
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;

		$img_url = ( isset( $attributes['image'] ) && $attributes['image'] ) ? $attributes['image'] : '';
		$img_id = ( isset( $attributes['image_id'] ) && $attributes['image_id'] ) ? (int)$attributes['image_id'] : 0;
		$img_atts = wp_get_attachment_image_src( $img_id, 'full' );
		$img_alt = get_post_meta( $img_id, '_wp_attachment_image_alt', true );
		$img_alt = ( $img_alt ) ? $img_alt : get_the_title( $img_id );
		$filetype = wp_check_filetype( $img_url );
		$enable_text = ( isset( $attributes['enable_text'] ) && $attributes['enable_text'] ) ? true : false;
		$text = ( isset( $attributes['text'] ) && $attributes['text'] ) ? wpvue_tag_compiler( do_shortcode($attributes['text']), $partner_id ) : '';
		$content_width = ( isset( $attributes['content_width'] ) && $attributes['content_width'] ) ? $attributes['content_width'] : 'content_text';
		$enable_text_logo = ( isset( $attributes['enable_text_logo'] ) && $attributes['enable_text_logo'] ) ? true : false;
		$text_logo = ( isset( $attributes['text_logo'] ) && $attributes['text_logo'] ) ? wpvue_tag_compiler( do_shortcode($attributes['text_logo']), $partner_id ) : '';
		$text_align = ( isset( $attributes['text_align'] ) && $attributes['text_align'] ) ? $attributes['text_align'] : 'left';
		$text_tag = ( isset( $attributes['text_tag'] ) && $attributes['text_tag'] ) ? $attributes['text_tag'] : 'h2';
		
		$filter_content = array(
			'id'			=> $img_id,
			'url'			=> $img_url,
			'width'			=> isset( $img_atts[1] ) ? $img_atts[1] : '',
			'height'		=> isset( $img_atts[2] ) ? $img_atts[2] : '',
			'title' 		=> $img_alt,
			'ext'			=> strtolower( $filetype['ext'] ),
			'enable_text'	=> $enable_text,
			'text'			=> $text,
			'content_width'	=> $content_width,
			'enable_text_logo' => $enable_text_logo,
			'text_logo' 	=> $text_logo,
			'text_align'	=> $text_align,
			'text_tag'		=> $text_tag,
		);
		return $filter_content;
	}
}
