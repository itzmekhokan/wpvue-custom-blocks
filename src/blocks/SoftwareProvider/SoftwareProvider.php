<?php
/**
 * SoftwareProvider block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * SoftwareProvider class.
 */
class SoftwareProvider extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'software-provider-block';

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
		$filtered_content = array();
		$filtered_content['icon'] = ( isset( $attributes['icon'] ) && $attributes['icon'] ) ? $attributes['icon'] : get_template_directory_uri() . '/assets/images/software.png';
		$filtered_content['software_providers_on_label'] = isset( $attributes['software_providers_on_label'] ) ? do_shortcode( $attributes['software_providers_on_label'] ) : '';
		$filtered_content['online_since_label'] = isset( $attributes['online_since_label'] ) ? do_shortcode( $attributes['online_since_label'] ) : '';
		$filtered_content['is_licensed_under_label'] = isset( $attributes['is_licensed_under_label'] ) ? do_shortcode( $attributes['is_licensed_under_label'] ) : '';
		return $filtered_content;
	}
}
