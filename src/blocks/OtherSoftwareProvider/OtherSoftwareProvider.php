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
class OtherSoftwareProvider extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'other-software-provider';

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
				'block_description' => $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'enable_selected_posts' => $this->get_schema_boolean( false ),
				'enable_asset_cat_name' => $this->get_schema_boolean( false ),
				'asset_cat_name'	=> $this->get_schema_string(),
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
		global $wcra_asset_sizes;
		if( $block['blockName'] !== $this->namespace . '/' . $this->block_name ) return $content;
		
		$attributes = $block['attrs'];
		$attrs = $attributes;
		$attrs['title'] = ( isset( $attributes['block_title'] ) && $attributes['block_title'] ) ? do_shortcode($attributes['block_title']) : '';
		$attrs['description'] = ( isset( $attributes['block_description'] ) && $attributes['block_description'] ) ? do_shortcode($attributes['block_description']) : '';
		// remove duplicate data
		if( isset( $attrs['block_title'] ) ) unset( $attrs['block_title'] );
		if( isset( $attrs['block_description'] ) ) unset( $attrs['block_description'] );

		$enable_selected_posts = isset( $attributes['enable_selected_posts'] ) ? $attributes['enable_selected_posts'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$enable_asset_cat_name = isset( $attributes['enable_asset_cat_name'] ) ? $attributes['enable_asset_cat_name'] : false;
		$asset_cat_name = ( isset( $attributes['asset_cat_name'] ) && $attributes['asset_cat_name'] ) ? $attributes['asset_cat_name'] : '';
		$orderby = isset( $attributes['orderby'] ) ? $attributes['orderby'] : '';

		$args = array(
			'numberposts' => ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : -1,
			'post_type'   => 'software_providers',
			'post_status'    => 'publish',
		);
		if( $enable_selected_posts && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}
		if( isset( $attributes['post_id'] ) ) {
			$args['exclude'] = array( absint( $attributes['post_id'] ) );
		}
		
		$all_software_providers = get_posts( $args );
		$filteredData = array();
		if( $all_software_providers ) {
			$posts = array();
			$_group_id = get_theme_option('cas_toplist_group_id');
			foreach( $all_software_providers as $key => $post ) {
				
				$s_id = get_field('software_provider_id',$post->ID);
				$asset_size = $wcra_asset_sizes['soft_asset_sizes']['medium'];
				if( $enable_asset_cat_name && $asset_cat_name ) {
					$soft_data_st_build = "[cas-software-provider-by-group-id id='".$_group_id."' swid='".$s_id."' software-asset-category-name='".$asset_cat_name."' return='json']";
				}else{
					$soft_data_st_build = "[cas-software-provider-by-group-id id='".$_group_id."' swid='".$s_id."' software-asset-category-name='".$asset_size."' return='json']";
				}
				
				$st_data = wcra_compile_shortcode($soft_data_st_build);
				if( !$st_data ) continue;
				$soft_info = (array)$st_data[0];
				$softdata['soft_info'] = $soft_info;
				$softdata['soft_name'] = isset( $soft_info['sw_name'] ) ? $soft_info['sw_name'] : do_shortcode( $post->post_title );
				$softdata['title'] = do_shortcode( $post->post_title );
				$softdata['slug'] = $post->post_name;
				$softdata['type'] = $post->post_type;
				$softdata['short_descrp'] = do_shortcode( $post->post_excerpt );
				$posts[] = $softdata;
			}
			// sorting
			if( $orderby ){
				if( $orderby == 'atoz' ) {
					usort($posts, function($a, $b) {
						return $a['soft_name'] <=> $b['soft_name']; // atoz
					});
				}elseif( $orderby == 'ztoa' ) {
					usort($posts, function($a, $b) {
						return $b['soft_name'] <=> $a['soft_name']; // ztoa	
					});
				}
			}
			$filteredData['attrs'] = $attrs;
			$filteredData['posts'] = $posts;
		}
		return $filteredData;
	}
}
