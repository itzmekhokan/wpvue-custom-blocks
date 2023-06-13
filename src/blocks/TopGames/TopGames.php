<?php
/**
 * TopGames block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * TopGames class.
 */
class TopGames extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'top-games';

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
				'style'				=> $this->get_schema_string(),
				'game_type'    		=> $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'enable_selected_games' => $this->get_schema_boolean( false ),
				'enable_filter_provider' => $this->get_schema_boolean( false ),
				'post__in'    		=> $this->get_schema_string(),
				'provider'    		=> $this->get_schema_string(),
				'enable_filters' 	=> $this->get_schema_boolean( false ),
				'disable_review'	=> $this->get_schema_boolean( false ),
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
		$enable_selected_games = isset( $attributes['enable_selected_games'] ) ? $attributes['enable_selected_games'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$enable_filter_provider = isset( $attributes['enable_filter_provider'] ) ? $attributes['enable_filter_provider'] : false;
		$provider = ( isset( $attributes['provider'] ) && $attributes['provider'] ) ? json_decode( $attributes['provider'] ) : array();
		$enable_selected_game_cats = ( isset( $attributes['enable_selected_game_cats'] ) && $attributes['enable_selected_game_cats'] ) ? true : false;
		$term__in = ( isset( $attributes['term__in'] ) && $attributes['term__in'] ) ? json_decode( $attributes['term__in'] ) : array();
		
		$filteredData = array();
		$filteredData['attrs'] = array(
			'enable_selected_games'		=> $enable_selected_games,
			'post__in' 					=> $post_in_data,
			'enable_filter_provider'	=> $enable_filter_provider,
			'provider'					=> $provider,
			'enable_selected_game_cats'	=> $enable_selected_game_cats,
			'term__in'					=> $term__in,
		);

		$provider_id = 0;
		if( $provider ) {
			if( isset( $provider->value ) ) {
				$provider_id = $provider->value;
			}
		}
		
		$args = array(
			'numberposts' => ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : -1,
			'post_type'   => ( isset( $attributes['game_type'] ) && $attributes['game_type'] ) ? $attributes['game_type'] : array( 'game_free', 'game_paid' ),
		);
		if( $enable_selected_games && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}
		if( isset( $attributes['post_id'] ) ) {
			$args['exclude'] = array( absint( $attributes['post_id'] ) );
		}

		if( $enable_filter_provider && $provider_id ) {
			$args['meta_key'] = 'provider_link';
			$args['meta_value'] = $provider_id;
		}

		if( $enable_selected_game_cats && $term__in ) {
			$args['tax_query'] = array(
				array(
					'taxonomy' => 'game_cat',
					'field' => 'term_id',
					'terms' => wp_list_pluck( $term__in, 'value' ),
					'operator' => 'IN',
				)
			);
			if( count( wp_list_pluck( $term__in, 'value' ) ) == 1 ) {
				$filteredData['attrs']['single_cat'] = true;
				$filteredData['attrs']['single_cat_name'] = $term__in[0]->label;
			}else{
				$filteredData['attrs']['single_cat'] = false;
			}
		}
		
		$games_posts = get_posts( $args );
	
		$data = array();
		if( $games_posts ) {
			foreach( $games_posts as $key => $post ) {
				//$game = (array)$post;
				$game = array();
				$game['title'] = do_shortcode( $post->post_title );
				$game['post_title'] = do_shortcode( $post->post_title );
				$game['slug'] = $post->post_name;
				$game['post_type'] = $post->post_type;
				$game['post_date'] = $post->post_date;
				$game['type'] = (get_field('slug', $post->ID )) ? get_field('slug', $post->ID ) : '';
				$game['short_descrp'] = do_shortcode( $post->post_excerpt );
				$game['image'] = ( wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) ) ? wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) : '';
				// banner
				$banner_id = get_post_meta( $post->ID, 'banner_image', true );
				if( $banner_id ) $game['banner'] = wp_get_attachment_url( absint($banner_id), 'full' );
				if( $game['image'] ) {
					$game['banner'] = $game['image'];
				}
				$game['geo_provider_partners'] = get_field('provider_partner',$post->ID);
				$partner = get_game_geotarget_providers($post->ID);
				if( isset( $partner['current'] ) ) {
					$current = (array)$partner['current'];
					$partnerdata = array();
					$partnerdata['product_id'] = $current['product_id'];
					$partnerdata['product_name'] = $current['product_name'];
					$partnerdata['slug'] = $current['slug'];
					$partnerdata['go_link'] = $current['go_link'];
					$partnerdata['product_assets'] = $current['product_assets'];
					$partnerdata['review_link'] = $current['review_link'];
					$game['geo_provider_partners_data']['current'] = $partnerdata;
				}
				
				// $game['provider_img'] = get_field('provider_image', $post->ID );
				// $game['provider_link'] = get_field('provider_link', $post->ID );
				$imgdata = wcra_get_provider_img_src_from_cas($post->ID);
				// $game['provider_img'] = ( isset( $imgdata['url'] ) && $imgdata['url'] ) ? $imgdata['url'] : wp_get_attachment_url( get_theme_option( 'game_provider_img' ) );
				// $game['provider_link'] = ( isset( $imgdata['url'] ) && $imgdata['url'] ) ? get_permalink( get_field( 'provider_link', $post->ID ) ) : get_theme_option( 'game_provider_link' );
				// $game['provider_name'] = ( isset( $imgdata['url'] ) && isset( $imgdata['name'] ) && $imgdata['name'] ) ? $imgdata['name'] : get_theme_option( 'breadcrumb_home_label' );

				$game['provider_img'] = ( isset( $imgdata['url'] ) && $imgdata['url'] ) ? $imgdata['url'] : '';
				$game['provider_link'] = ( isset( $imgdata['url'] ) && $imgdata['url'] ) ? get_permalink( get_field( 'provider_link', $post->ID ) ) : '';
				$game['provider_name'] = ( isset( $imgdata['url'] ) && isset( $imgdata['name'] ) && $imgdata['name'] ) ? $imgdata['name'] : '';


				// game category
				$post_categories = get_the_terms( $post->ID, 'game_cat' );
				if ( ! empty( $post_categories ) && ! is_wp_error( $post_categories ) ) {
					$categories = wp_list_pluck( $post_categories, 'name', 'term_id' );
					$game['category'] = $categories;
				}
				
				//$game['play_for_real_link'] = get_field('play_for_real_url', $post->ID );
				$game['play_for_free_link'] = get_field('play_for_free_url', $post->ID );
				$game['play_for_real_label'] = get_field('play_for_real_label', $post->ID );
				$game['play_for_free_label'] = get_field('play_for_free_label', $post->ID );
				//$game['meta'] = get_post_meta( $post->ID );
				$game['meta']['play_for_free_url'][0] = get_field('play_for_free_url', $post->ID );
				
				// Game tag
				$games_tags = get_field( 'games_tags', 'option' );
				$game_tag = get_field('game_tag', $post->ID );
				if( isset( $games_tags[$game_tag] ) ) {
					$game['game_tag'] = $games_tags[$game_tag];
				}

				$data[] = $game;
			}
			$filteredData['data'] = $data;
		}
		return $filteredData;
	}
}
