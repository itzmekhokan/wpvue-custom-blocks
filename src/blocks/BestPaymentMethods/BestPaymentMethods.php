<?php
/**
 * Best Payment Methods block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * BestPaymentMethods class.
 */
class BestPaymentMethods extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'best-payment-methods';

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
				'style'    			=> $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'enable_selected_games' => $this->get_schema_boolean( false ),
				'post__in'    		=> $this->get_schema_string(),
				'enable_asset_cat_name' => $this->get_schema_boolean( false ),
				'asset_cat_name'    	=> $this->get_schema_string(),
				'enable_show_all_link' => $this->get_schema_boolean( false ),
				'show_all_label'    	=> $this->get_schema_string(),
				'show_all_link'    	=> $this->get_schema_string(),
				'bg_pattern' 		=> $this->get_schema_string(),
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
		
		$enable_selected_games = isset( $attributes['enable_selected_games'] ) ? $attributes['enable_selected_games'] : false;
		$enable_asset_cat_name = isset( $attributes['enable_asset_cat_name'] ) ? $attributes['enable_asset_cat_name'] : false;
		$asset_cat_name = ( isset( $attributes['asset_cat_name'] ) && $attributes['asset_cat_name'] ) ? $attributes['asset_cat_name'] : '';
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$remove_cascount = ( get_theme_option( 'remove_casino_count_paymentblk' ) ) ? true : false;
		$args = array(
			'numberposts' => ( isset($attributes['no_of_posts']) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : -1,
			'post_type'   => 'payment_options',
			'post_status'    => 'publish',
		);
		if( $enable_selected_games && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}
		if( isset( $attributes['post_id'] ) ) {
			$args['exclude'] = array( absint( $attributes['post_id'] ) );
		}
		$payment_methods = get_posts( $args );
		$filteredData = array();
		if( $payment_methods ) {
			$_group_id = get_theme_option('cas_toplist_group_id');
			$showcount_attr = ( $remove_cascount) ? '' : 'showcount=true';
			foreach( $payment_methods as $key => $post ) {
				//$filteredData[$key] = (array)$post;
				$_payment_method_id = get_field('payment_method_id',$post->ID );
				if( $enable_asset_cat_name && $asset_cat_name ) {
					$st = "[cas-payment-options-meta poid='".$_payment_method_id."' toplistgroup='".$_group_id."' asset-category-name='".$asset_cat_name."' ".$showcount_attr." return='json']";
				}else{
					$st = "[cas-payment-options-meta poid='".$_payment_method_id."' toplistgroup='".$_group_id."' ".$showcount_attr." return='json']";
				}
				$pom_data = wcra_compile_shortcode($st);
				if( !$pom_data ) continue;
				$payment = array();
				$payment['title'] = do_shortcode( $post->post_title );
				$payment['slug'] = $post->post_name;
				$payment['type'] = $post->post_type;
				$payment['short_descrp'] = do_shortcode( $post->post_excerpt );
				$payment['image'] = ( wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) ) ? wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) : '';
				$payment['casino_count'] = $pom_data;

				$filteredData[] = $payment;
			}
		}
		return $filteredData;
	}
}
