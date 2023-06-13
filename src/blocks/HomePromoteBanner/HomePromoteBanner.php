<?php
/**
 * HomePromoteBanner block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * HomePromoteBanner class.
 */
class HomePromoteBanner extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'home-promote-banner';

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
				'bg_image'    	 	=> $this->get_schema_string(),
				'banner_text'		=> $this->get_schema_string(),
				'banner_btn_txt'	=> $this->get_schema_string(),
				'visit_link' 		=> $this->get_schema_string(),
				'enable_visit_outlink' => $this->get_schema_boolean( false ),
				'banner_logo'    	=> $this->get_schema_string(),
				'logo_link'			=> $this->get_schema_string(),
				'enable_logo_outlink' => $this->get_schema_boolean( false ),
				'promote1_img' 		=> $this->get_schema_string(),
				'promote1_link' 	=> $this->get_schema_string(),
				'enable_promote1_outlink' => $this->get_schema_boolean( false ),
				'promote2_img' 		=> $this->get_schema_string(),
				'promote2_link' 	=> $this->get_schema_string(),
				'enable_promote2_outlink' => $this->get_schema_boolean( false ),
				'promote3_img' 		=> $this->get_schema_string(),
				'promote3_link' 	=> $this->get_schema_string(),
				'enable_promote3_outlink' => $this->get_schema_boolean( false ),
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
			'bg_image'    	 	=> isset( $attributes['bg_image'] ) ? $attributes['bg_image'] : '',
			'banner_text'		=> isset( $attributes['banner_text'] ) ? do_shortcode( $attributes['banner_text'] ) : '',
			'banner_text_tag'	=> isset( $attributes['banner_text_tag'] ) ? $attributes['banner_text_tag'] : 'p',
			'banner_btn_txt'	=> isset( $attributes['banner_btn_txt'] ) ? do_shortcode( $attributes['banner_btn_txt'] ) : '',
			'visit_link' 		=> isset( $attributes['visit_link'] ) ? $attributes['visit_link'] : '',
			'enable_visit_outlink' => ( isset( $attributes['enable_visit_outlink'] ) && $attributes['enable_visit_outlink'] ) ? true : false,
			'banner_logo'    	=> isset( $attributes['banner_logo'] ) ? $attributes['banner_logo'] : '',
			'logo_link'			=> isset( $attributes['logo_link'] ) ? $attributes['logo_link'] : '',
			'enable_logo_outlink' => ( isset( $attributes['enable_logo_outlink'] ) && $attributes['enable_logo_outlink'] ) ? true : false,
			'promote1_img' 		=> isset( $attributes['promote1_img'] ) ? $attributes['promote1_img'] : '',
			'promote1_link' 	=> isset( $attributes['promote1_link'] ) ? $attributes['promote1_link'] : '',
			'enable_promote1_outlink' => ( isset( $attributes['enable_promote1_outlink'] ) && $attributes['enable_promote1_outlink'] ) ? true : false,
			'promote2_img' 		=> isset( $attributes['promote2_img'] ) ? $attributes['promote2_img'] : '',
			'promote2_link' 	=> isset( $attributes['promote2_link'] ) ? $attributes['promote2_link'] : '',
			'enable_promote2_outlink' => ( isset( $attributes['enable_promote2_outlink'] ) && $attributes['enable_promote2_outlink'] ) ? true : false,
			'promote3_img' 		=> isset( $attributes['promote3_img'] ) ? $attributes['promote3_img'] : '',
			'promote3_link' 	=> isset( $attributes['promote3_link'] ) ? $attributes['promote3_link'] : '',
			'enable_promote3_outlink' => ( isset( $attributes['enable_promote3_outlink'] ) && $attributes['enable_promote3_outlink'] ) ? true : false,
		);
		return $filteredContent;
	}
}
