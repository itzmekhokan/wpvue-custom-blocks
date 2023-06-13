<?php
/**
 * LatestCasino block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * LatestCasino class.
 */
class LatestCasino extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'latest-casino';

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
		$enable_selected_posts = isset( $attributes['enable_selected_posts'] ) ? $attributes['enable_selected_posts'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$asset_category = ( isset( $attributes['asset_category'] ) && $attributes['asset_category'] ) ? $attributes['asset_category'] : 'product_logo_136x136';
		$no_display = ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : 4;
		$args = array(
			'posts_per_page' => -1,
			'post_type'   => 'review',
			'post_status'    => 'publish',
			'fields' => 'ids', 
		);

		if( $enable_selected_posts && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['posts_per_page'] = -1;
			$args['orderby'] = 'post__in';
		}

		if( isset( $attributes['post_id'] ) ) {
			$args['exclude'] = array( absint( $attributes['post_id'] ) );
		}

		$review_posts = get_posts( $args );
		$filteredData = array();
		if( $review_posts ) {
			$partners_id = array();
			foreach( $review_posts as $key => $post_id ) {
				$partner_id = get_field( 'partner_id' , $post_id );
				if( !$partner_id ) continue;
				if( in_array( $partner_id, $partners_id ) ) continue;
				$partners_id[] = $partner_id;
				$group_id = get_theme_option( 'cas_toplist_group_id' );
				$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" asset-category-name="'.$asset_category.'" procons-visible="1" return="json"]');
				$toplist_data = json_decode(urldecode($toplist_data), true);
				if( $toplist_data && isset( $toplist_data[0] ) ) {
					$toplist_data = $toplist_data[0];
					if( empty( $toplist_data['procons'] ) ) continue;
					// filtered data
					unset( $toplist_data['primary_colour'] );
					unset( $toplist_data['secondary_colour'] );
					unset( $toplist_data['online_since'] );
					unset( $toplist_data['supported_language'] );
					unset( $toplist_data['supported_platform'] );
					unset( $toplist_data['product_licences'] );

					$filteredData[] = $toplist_data;
				}
				if( count( $filteredData ) == $no_display ) break;
			}
		}
		
		if( count( $filteredData ) >= 3 ) {
			if( count( $filteredData ) > $no_display ) {
				return array_slice( $filteredData, 0, $no_display );
			}else{
				return $filteredData;
			}
		}else {
			return array();
		}

	}
}