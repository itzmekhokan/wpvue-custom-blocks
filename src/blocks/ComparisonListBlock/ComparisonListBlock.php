<?php
/**
 * ComparisonListBlock block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * ComparisonListBlock class.
 */
class ComparisonListBlock extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'comparison-list-block';

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
				'block_title'    	=> $this->get_schema_string(),
				'header_logo'    	=> $this->get_schema_boolean(),
				'style'    			=> $this->get_schema_string(),
				'left_heading'   	=> $this->get_schema_string(),
				'left_icon'   		=> $this->get_schema_string(),
				'left_list_content' => $this->get_schema_string(),
				'right_heading'   	=> $this->get_schema_string(),
				'right_icon'   		=> $this->get_schema_string(),
				'right_list_content'=> $this->get_schema_string(),
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
		$disabledIcon = isset( $attributes['header_logo'] ) && $attributes['header_logo'] == false;
		$data = array(
			'block_title' => isset( $attributes['block_title'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['block_title'] ), $partner_id ) : '',
			'enabled_review_partner_procons' => ( isset( $attributes['enabled_review_partner_procons'] ) && $attributes['enabled_review_partner_procons'] ) ? true : false,
			'style' => ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'pros_cons_comparison',
			'disabled_icon' => $disabledIcon,
			'left' => array(
				'icon' 	=> ( !$disabledIcon && isset( $attributes['left_icon'] ) ) ? $attributes['left_icon'] : false,
				'heading' => isset( $attributes['left_heading'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['left_heading'] ), $partner_id ) : '',
				'content' => isset( $attributes['left_list_content'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['left_list_content'] ), $partner_id ) : '',
			),
			'right' => array(
				'icon' 	=> ( !$disabledIcon && isset( $attributes['right_icon'] ) ) ? $attributes['right_icon'] : false,
				'heading' => isset( $attributes['right_heading'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['right_heading'] ), $partner_id ) : '',
				'content' => isset( $attributes['right_list_content'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['right_list_content'] ), $partner_id ) : '',
			),
		);
		return $data;
	}
}
