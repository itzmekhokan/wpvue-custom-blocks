<?php
/**
 * LanguagesAndSupports block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * LanguagesAndSupports class.
 */
class LanguagesAndSupports extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'languages-supports-block';

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
		$filtered_content = array();
		$filtered_content['icon'] = ( isset( $attributes['icon'] ) && $attributes['icon'] ) ? $attributes['icon'] : get_template_directory_uri() . '/assets/images/support.png';
		$filtered_content['customer_support_information_label'] = isset( $attributes['customer_support_information_label'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['customer_support_information_label'] ), $partner_id ) : '';
		$filtered_content['live_chat_available_label'] = isset( $attributes['live_chat_available_label'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['live_chat_available_label'] ), $partner_id ) : '';
		$filtered_content['phone_is_not_available_label'] = isset( $attributes['phone_is_not_available_label'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['phone_is_not_available_label'] ), $partner_id ) : '';
		$filtered_content['supported_languages_label'] = isset( $attributes['supported_languages_label'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['supported_languages_label'] ), $partner_id ) : '';
		return $filtered_content;
	}
}
