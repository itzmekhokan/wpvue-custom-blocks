<?php
/**
 * TopPromotions block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * TopPromotions class.
 */
class TopPromotions extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'top-promotions';

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
		
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$show_expire_promotions = isset( $attributes['show_expire_promotions'] ) ? $attributes['show_expire_promotions'] : false;
		$enable_selected_promotions = isset( $attributes['enable_selected_promotions'] ) ? $attributes['enable_selected_promotions'] : false;
		$expire_days_limit = ( isset( $attributes['expire_days_limit'] ) && $attributes['expire_days_limit'] ) ? $attributes['expire_days_limit'] : 0;
		$enable_exclude_promotions = isset( $attributes['enable_exclude_promotions'] ) ? $attributes['enable_exclude_promotions'] : false;
		$exclude_days_limit = ( isset( $attributes['exclude_days_limit'] ) && $attributes['exclude_days_limit'] ) ? (int)$attributes['exclude_days_limit'] : 0;
		$no_of_posts = ( isset($attributes['no_of_posts']) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : 0;
		$order = ( isset( $attributes['order'] ) && $attributes['order'] ) ? $attributes['order'] : '';
		//$show_only_calendar = ( isset( $attributes['show_only_calendar'] ) && $attributes['show_only_calendar'] ) ? true : false;
		$args = array(
			'numberposts' => -1,
			'post_type'   => 'promotions',
			'post_status' => 'publish',
		);

		if( $order ) {
			$args['order'] = $order;
		}

		// if( $show_only_calendar ) {
		// 	$args['meta_query'] = array(
        //         array(
        //             'key' => 'metadata_use_for_calendar',
        //             'value' => '',
        //             'compare' => '!=' 
		// 		)
		// 	);
		// 	$args['meta_key'] = 'metadata_promotion_start_date';
		// 	$args['orderby'] = 'meta_value_num';
		// 	$args['order'] = 'ASC';
		// }else{
		// 	global $wpdb;
		// 	$post_ids_results = $wpdb->get_results( "SELECT post_id FROM $wpdb->postmeta WHERE meta_key='metadata_use_for_calendar' AND meta_value !=''", ARRAY_A );
		// 	$post_not_in = wp_list_pluck( $post_ids_results, 'post_id' );
		// 	$args['exclude'] = $post_not_in;
		// }

		if( $enable_selected_promotions && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['orderby'] = 'post__in';
		}
		$promotions = get_posts( $args );
		$filteredData = $expirePromotions = array();
		
		if( $promotions ) {
			foreach( $promotions as $key => $post ) {
				$acf_metadata = get_field( 'metadata', $post->ID );
				// bind expire promotions
				if( $enable_exclude_promotions && $exclude_days_limit ) {
					if( isset( $acf_metadata['promotion_end_date'] ) && $acf_metadata['promotion_end_date'] ){
						$time_diff = strtotime( $acf_metadata['promotion_end_date'] ) - strtotime( date( 'Y-m-d') );
						$daysleft = abs( round( $time_diff / 86400 ) );
						if( $daysleft > $exclude_days_limit ) {
							continue;
						}
					}
				}
				
				//$promo = (array)$post;
				$promo = array();
				//if( isset( $promo['post_content'] ) ) unset( $promo['post_content'] );
				$promo['title'] = do_shortcode( $post->post_title );
				$promo['slug'] = $post->post_name;
				$promo['type'] = $post->post_type;
				$promo['short_descrp'] = do_shortcode( $post->post_excerpt );
				$promo['image'] = ( wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) ) ? wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) : '';

				$acf_metadata = get_field( 'metadata', $post->ID );
				
				// if( isset( $promo['metadata']['enable_show_yet_to_activate'] ) && $promo['metadata']['enable_show_yet_to_activate'] ) {
				// 	//$promo['metadata']['desktop_header_image'] = $acf_metadata['coming_soon_background'];
				// 	//$promo['metadata']['mobile_header_image'] = $acf_metadata['coming_soon_background'];
				// 	$promo['metadata']['enable_show_yet_to_activate'] = true;
				// }else{
				// 	$promo['metadata']['enable_show_yet_to_activate'] = false;
				// }

				if( isset( $acf_metadata['partner'] ) && $acf_metadata['partner'] ){
					$review_post_ID = $acf_metadata['partner']->ID;
					$group_id = get_theme_option('cas_toplist_group_id');
					$partner_id = get_field( 'partner_id' , $review_post_ID );
					// Partner Information
					$product_info = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" return="json"]');
					$product_info = json_decode(urldecode($product_info), true);
					$product_info = ( $product_info ) ? $product_info[0] : array();
					if( !$product_info ) continue;
					$promo['partner_information'] = $product_info;
					// unset partner post data
					$partner_post_title = '';
					if( isset( $acf_metadata['partner']->post_title ) )
						$partner_post_title = $acf_metadata['partner']->post_title;
					unset( $acf_metadata['partner'] );
					$acf_metadata['partner']['post_title'] = $partner_post_title;
					$promo['metadata'] = $acf_metadata;
				}else{
					continue;
				}
				// bind expire promotions
				if( isset( $acf_metadata['promotion_end_date'] ) && $acf_metadata['promotion_end_date'] ){
					$time = strtotime( $acf_metadata['promotion_end_date'] );
					if( strtotime( date( 'Ymd' ) ) > $time ) {
						$expirePromotions[] = $promo;
						continue;
					}
				}

				// country restrict
				$country = ( isset( $_COOKIE['wp-country'] ) && $_COOKIE['wp-country'] ) ? $_COOKIE['wp-country'] : '';
				$country_state = get_wpvue_current_country_state();
				$country = isset( $country_state['country'] ) ? $country_state['country'] : $country;
				
				if( isset( $acf_metadata['country_code'] ) && $acf_metadata['country_code'] ) {
					$country_arr = explode( ',', $acf_metadata['country_code'] );
					if( $country && !in_array( $country, $country_arr ) ) {
						continue;
					}
				}

				$filteredData[] = $promo;

				if( $no_of_posts && count( $filteredData ) == $no_of_posts ) break;
			}
			// add expire promo
			if( $show_expire_promotions && $expirePromotions ) {
				foreach ( $expirePromotions as $key => $promo ) {
					if( $expire_days_limit ) {
						$acf_metadata = get_field( 'metadata', $promo['ID'] );
						if( isset( $acf_metadata['promotion_end_date'] ) && $acf_metadata['promotion_end_date'] ){
							if(strtotime( $acf_metadata['promotion_end_date'] ) < strtotime("$expire_days_limit day ago") ) {
								//days over
							}else{
								$filteredData[] = $promo;
							}
						}
					}else {
						$filteredData[] = $promo;
					}
				}
			}
		}
		if( $no_of_posts ) {
			return ( count( $filteredData ) >= $no_of_posts ) ? array_slice( $filteredData, 0, $no_of_posts ) : $filteredData;
		}
		return $filteredData;
	}
}
