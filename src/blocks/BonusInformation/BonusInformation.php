<?php
/**
 * BonusInformation block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * BonusInformation class.
 */
class BonusInformation extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'bonus-information-block';

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
		$post_id = ( isset( $attributes['post_id'] ) && $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = get_field( 'partner_id' , $post_id );
		$filtered_content = array();
		$filtered_content['title'] = isset( $attributes['title'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['title'] ), $partner_id ) : '';
		$filtered_content['make_first_deposit_to_claim'] = isset( $attributes['make_first_deposit_to_claim'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['make_first_deposit_to_claim'] ), $partner_id ) : '';
		
		return $filtered_content;
	}
}
