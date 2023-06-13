<?php
/**
 * ContentIcon block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * ContentIcon class.
 */
class ContentIcon extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'content-icon-block';

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
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$post_partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;

		$filtered_content['icon'] = ( isset( $attributes['logo'] ) && $attributes['logo'] ) ? $attributes['logo'] : get_template_directory_uri() . '/assets/images/gift-box.svg';
		$filtered_content['content'] = isset( $attributes['content'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['content'] ), $post_partner_id ) : '';
		$partner_id = ( isset( $attributes['cta_partner'] ) && $attributes['cta_partner'] ) ? $attributes['cta_partner'] : 0;
		if( $partner_id ) {
			$cta_partner = do_shortcode('[cas-toplist-group id="'.get_theme_option('cas_toplist_group_id').'" pid="'.$partner_id.'" return="json"]');
			$cta_partner = json_decode(urldecode($cta_partner), true);
			if( isset( $cta_partner[0] ) ) {
				$filtered_content['cta_partner'] = $cta_partner[0];
			}
		}
		$post_id = ( isset( $attributes['post_id'] ) && $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		if( get_post_type( $post_id ) == 'review' ) {
			$partner_id = get_field( 'partner_id' , $post_id );
			if( $partner_id ) {
				$cta_partner = do_shortcode('[cas-toplist-group id="'.get_theme_option('cas_toplist_group_id').'" pid="'.$partner_id.'" return="json"]');
				$cta_partner = json_decode(urldecode($cta_partner), true);
				if( isset( $cta_partner[0] ) ) {
					$filtered_content['cta_partner'] = $cta_partner[0];
				}
			}
		}
		
		return $filtered_content;
	}
}
