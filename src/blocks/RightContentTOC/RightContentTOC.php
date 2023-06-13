<?php
/**
 * RightContentTOC block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * RightContentTOC class.
 */
class RightContentTOC extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'right-content-simpletoc';

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
				'title'    	 		=> $this->get_schema_string(),
				'has_title_icon'	=> $this->get_schema_boolean(),
				'title_icon' 		=> $this->get_schema_string(),
				'content'    		=> $this->get_schema_string(),
				'has_content_icon'	=> $this->get_schema_boolean(),
				'content_icon' 		=> $this->get_schema_string(),
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
		$filteredContent = array(
			'content' => isset( $attributes['content'] ) ? do_shortcode( $attributes['content'] ) : '',
		);
		return $filteredContent;
	}
}
