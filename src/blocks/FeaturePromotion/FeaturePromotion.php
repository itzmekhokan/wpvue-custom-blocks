<?php
/**
 * FeaturePromotion block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * FeaturePromotion class.
 */
class FeaturePromotion extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'feature-promotion';

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
		$post_id = ( isset( $attributes['post_id'] ) && $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$promotion = ( isset( $attributes['promotion'] ) && $attributes['promotion'] ) ? json_decode( $attributes['promotion'] ) : array();
		$promotion_id = 0;
		if( $promotion ) {
			if( isset( $promotion->value ) ) {
				$promotion_id = $promotion->value;
			}
		}
		if( !$promotion_id ) return array();
		$promotion = get_post( $promotion_id );
		// get valid promotion
		$promotion = wpvue_get_latest_valid_promotion( $promotion, $post_id );
		$promo = array();
		if( $promotion ) {
			$promotion = (array)$promotion;
			$promo = $promotion;
			$promo['title'] = do_shortcode( $promotion['post_title'] );
			$promo['slug'] = $promotion['post_name'];
			$promo['type'] = $promotion['post_type'];
			$promo['short_descrp'] = do_shortcode( $promotion['post_excerpt'] );
			$promo['image'] = ( wp_get_attachment_url( get_post_thumbnail_id( $promotion['ID'] ) , 'full' ) ) ? wp_get_attachment_url( get_post_thumbnail_id( $promotion['ID'] ) , 'full' ) : '';

			$acf_metadata = get_field( 'metadata', $promotion['ID'] );
			$promo['metadata'] = $acf_metadata;
			if( isset( $acf_metadata['partner'] ) && $acf_metadata['partner'] ){
				$review_post_ID = $acf_metadata['partner']->ID;
				$group_id = get_theme_option('cas_toplist_group_id');
				$partner_id = get_field( 'partner_id' , $review_post_ID );
				// Partner Information
				$product_info = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" return="json"]');
				$product_info = json_decode(urldecode($product_info), true);
				$product_info = ( $product_info ) ? $product_info[0] : array();
				$promo['partner_information'] = $product_info;
			}
		}
		return $promo;
	}
}
