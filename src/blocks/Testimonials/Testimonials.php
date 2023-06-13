<?php
/**
 * Testimonials block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Testimonials class.
 */
class Testimonials extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonials';

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
				'post_id'			=> $this->get_schema_number(),
				'block_title'    	=> $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'enable_selected_posts' => $this->get_schema_boolean( false ),
				'post__in'    		=> $this->get_schema_string(),
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
		$block_title = isset( $attributes['block_title'] ) ? $attributes['block_title'] : '';
		$block_subtitle = isset( $attributes['block_subtitle'] ) ? $attributes['block_subtitle'] : '';
		$testimonial_id = isset( $attributes['testimonial_id'] ) ? $attributes['testimonial_id'] : '';
		$no_display = ( isset( $attributes['quantity'] ) && $attributes['quantity'] ) ? absint( $attributes['quantity'] ) : '';
		
		$filteredContent = array(
			'heading' => $block_title,
			'sub_heading' => $block_subtitle,
			'testimonials' => array(),
		);

		$testimonials = wpvue_get_testimonials_data();
		if( $testimonials && isset( $testimonials[$testimonial_id] ) ) {
			$testimonial_data = isset( $testimonials[$testimonial_id]['testimonial'] ) ? $testimonials[$testimonial_id]['testimonial'] : array();
			if( !$no_display ) {
				$filteredContent['testimonials'] = $testimonial_data;
			}else{
				$filteredContent['testimonials'] = ( count( $testimonial_data ) < $no_display ) ? $testimonial_data : array_slice( $testimonial_data, 0, $no_display );
			}
		}
		return $filteredContent;
	}
}