<?php
/**
 * AlternativePayemtOptions block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * AlternativePayemtOptions class.
 */
class AlternativePayemtOptions extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'alternative-payment-options';

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
                'block_description' => $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'style'    			=> $this->get_schema_string('list'),
				'enable_asset_cat_name' => $this->get_schema_boolean( false ),
				'asset_cat_name'    	=> $this->get_schema_string(),
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
		global $wpdb;
		$resource_id = 0;
        if( $block['blockName'] !== $this->namespace . '/' . $this->block_name ) return $content;
		$output = array();
		$attributes = $block['attrs'];

		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;

		$resource_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : $resource_id;
		$output['style'] = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'list';
        $output['title'] = ( isset( $attributes['block_title'] ) && $attributes['block_title'] ) ? wpvue_tag_compiler( do_shortcode($attributes['block_title']), $partner_id ) : '';
		$output['description'] = ( isset( $attributes['block_description'] ) && $attributes['block_description'] ) ? wpvue_tag_compiler( do_shortcode($attributes['block_description']), $partner_id ) : '';
		$enable_asset_cat_name = isset( $attributes['enable_asset_cat_name'] ) ? $attributes['enable_asset_cat_name'] : false;
		$asset_cat_name = ( isset( $attributes['asset_cat_name'] ) && $attributes['asset_cat_name'] ) ? $attributes['asset_cat_name'] : '';
		$enable_selected_posts = isset( $attributes['enable_selected_posts'] ) ? $attributes['enable_selected_posts'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$enable_payment_zero_partners = isset( $attributes['enable_payment_zero_partners'] ) ? $attributes['enable_payment_zero_partners'] : false;
		$orderby = isset( $attributes['orderby'] ) ? $attributes['orderby'] : '';
		$remove_cascount = ( get_theme_option( 'remove_casino_count_paymentblk' ) ) ? true : false;
		$payments_types = get_field('payment_tags','option');
		$payments_types_order = array();
		if( 'list_filter' == $output['style'] && $payments_types ) {
			foreach ( $payments_types as $key => $type ) {
				$name = '';
				if( isset( $type['name'] ) && $type['name'] ) {
					$trans_str = wpvue_get_transalated_strings( strtolower( $type['name'] ), true );
					$name = ( $trans_str ) ? $trans_str : $type['name'];
				}
				$t_arr = array(
					'name' => $name,
				);
				$payments_types_order[] = $t_arr;
			}
		}

		$output['payment_tags_order'] = $payments_types_order;

		$args = array(
			'numberposts' => isset( $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : -1,
			'post_type'   => 'payment_options',
			'post_status'    => 'publish',
			'exclude' => array($resource_id)
		);
		if( $enable_selected_posts && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}
		//return $args;
		$alt_payment_methods = get_posts( $args );

		if( $alt_payment_methods ) {
			$posts = array();
			$_group_id = get_theme_option('cas_toplist_group_id');
			$output['remove_cascount'] = $remove_cascount;
			$showcount_attr = ( $remove_cascount) ? '' : 'showcount=true';
			
			foreach( $alt_payment_methods as $key => $post ) {
				
				$_payment_method_id = get_field('payment_method_id',$post->ID );
				if( $enable_asset_cat_name && $asset_cat_name ) {
					$st = "[cas-payment-options-meta poid='".$_payment_method_id."' toplistgroup='".$_group_id."' asset-category-name='".$asset_cat_name."' ".$showcount_attr." return='json']";
				}else{
					$st = "[cas-payment-options-meta poid='".$_payment_method_id."' toplistgroup='".$_group_id."' ".$showcount_attr." return='json']";
				}
				$pom_data = wcra_compile_shortcode($st);
				if( !$pom_data ) continue;
				$pom_data = (array)$pom_data;
				if( !$remove_cascount ) {
					if( !$enable_payment_zero_partners ) {
						if( !$pom_data['toplist_count'] ) continue;
					}
				}
				//$payment = (array)$post;
				$payment = array();
				$payment['ID'] = $post->ID;
				$payment['title'] = do_shortcode( $post->post_title );
				$payment['post_title'] = do_shortcode( $post->post_title );
				$payment['slug'] = $post->post_name;
				$payment['post_name'] = $post->post_name;
				$payment['type'] = $post->post_type;
				$payment['post_type'] = $post->post_type;
				$payment['short_descrp'] = do_shortcode( $post->post_excerpt );
				$payment['image'] = ( wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) ) ? wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) : '';
				$payment['count'] = $pom_data;
				$payment['payment_name'] = isset( $pom_data['name'] ) ? $pom_data['name'] : do_shortcode( $post->post_title );
				$payment['payment_category'] = isset( $pom_data['payment_type'] ) ? $pom_data['payment_type'] : '';

				$posts[] = $payment;

			}
			// sorting
			if( $orderby ){
				if( $orderby == 'atoz' ) {
					usort($posts, function($a, $b) {
						return $a['payment_name'] <=> $b['payment_name']; // atoz
					});
				}elseif( $orderby == 'ztoa' ) {
					usort($posts, function($a, $b) {
						return $b['payment_name'] <=> $a['payment_name']; // ztoa	
					});
				}
			}
			
			$output['posts'] = $posts;
		}
		
		$response['alternative_payment_methods']= $output;
		return $response;
	}
}
