<?php
/**
 * AlternativeSoftwareProvider block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * AlternativeSoftwareProvider class.
 */
class AlternativeSoftwareProvider extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'alternative-software-provider';

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
		global $wpdb,$wcra_asset_sizes;
		$resource_id = 0;
        if( $block['blockName'] !== $this->namespace . '/' . $this->block_name ) return $content;
		$output = array();

		$attributes = $block['attrs'];
		$resource_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : $resource_id;
		$partner_id = ( get_post_meta( $resource_id, 'partner_id', true ) ) ? get_post_meta( $resource_id, 'partner_id', true ) : 0;


		$output['style'] = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'list';
        $output['title'] = ( isset( $attributes['block_title'] ) && $attributes['block_title'] ) ? wpvue_tag_compiler( do_shortcode($attributes['block_title']), $partner_id ) : '';
		$output['description'] = ( isset( $attributes['block_description'] ) && $attributes['block_description'] ) ? wpvue_tag_compiler( do_shortcode($attributes['block_description']), $partner_id ) : '';
		$enable_asset_cat_name = isset( $attributes['enable_asset_cat_name'] ) ? $attributes['enable_asset_cat_name'] : false;
		$asset_cat_name = ( isset( $attributes['asset_cat_name'] ) && $attributes['asset_cat_name'] ) ? $attributes['asset_cat_name'] : '';
		$enable_selected_posts = isset( $attributes['enable_selected_posts'] ) ? $attributes['enable_selected_posts'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$enable_software_zero_partners = isset( $attributes['enable_software_zero_partners'] ) ? $attributes['enable_software_zero_partners'] : false;
		$orderby = isset( $attributes['orderby'] ) ? $attributes['orderby'] : '';
		$remove_cascount = ( get_theme_option( 'remove_casino_count_softwareblk' ) ) ? true : false;
		$args = array(
			'numberposts' => isset( $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : -1,
			'post_type'   => 'software_providers',
			'post_status'    => 'publish',
			'exclude' => array($resource_id)
		);
		if( $enable_selected_posts && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}
		//return $args;
		$all_software_providers = get_posts( $args );

		if( $all_software_providers ) {
			//print_r($all_software_providers);die;
			$posts = array();
			$_group_id = get_theme_option('cas_toplist_group_id');
			$output['remove_cascount'] = $remove_cascount;
			$showcount_attr = ( $remove_cascount) ? '' : 'showcount=true';
			foreach( $all_software_providers as $key => $post ) {
				$softdata = array();
				
				$s_id = get_field('software_provider_id',$post->ID);
				if( !$s_id || $s_id == 0 ) continue;
				$asset_size = $wcra_asset_sizes['soft_asset_sizes']['medium'];
				if( $enable_asset_cat_name && $asset_cat_name ) {
					//$soft_data_st_build = "[cas-software-provider-by-group-id id='".$_group_id."' swid='".$s_id."' software-asset-category-name='".$asset_cat_name."' return='json']";
					$soft_data_st_build = "[cas-software-providers-meta swid='".$s_id."' software-asset-category-name='".$asset_cat_name."' toplistgroup='".$_group_id."' ".$showcount_attr." return='json']";
				}else{
					//$soft_data_st_build = "[cas-software-provider-by-group-id id='".$_group_id."' swid='".$s_id."' software-asset-category-name='".$asset_size."' return='json']";
					$soft_data_st_build = "[cas-software-providers-meta swid='".$s_id."' software-asset-category-name='".$asset_size."' toplistgroup='".$_group_id."' ".$showcount_attr." return='json']";
				}
				//$soft_shortcode_array[$post->ID] = $soft_data_st_build;
				//echo $soft_data_st_build;die;
				$st_data = wcra_compile_shortcode($soft_data_st_build);
				if( !$st_data ) continue;
				//$softdata = (array)$post;
				$soft_info = (array)$st_data;
				if( !$remove_cascount ) {
					if( !$enable_software_zero_partners ){
						if( !isset( $soft_info['products_count'] ) || !$soft_info['products_count'] || $soft_info['products_count'] == 0 ) continue;
					}
				}
				$softdata['soft_st'] = $soft_data_st_build;
				$softdata['soft_info'] = $st_data;
				$softdata['soft_name'] = isset( $soft_info['sw_name'] ) ? $soft_info['sw_name'] : do_shortcode( $post->post_title );
				//$softdata['title'] = do_shortcode( $post->post_title );
				$softdata['ID'] = $post->ID;
				$softdata['slug'] = $post->post_name;
				$softdata['type'] = $post->post_type;
				$softdata['short_descrp'] = do_shortcode( $post->post_excerpt );
				//$softdata['image'] = wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' );
				//$softdata['count'] = count($st_data);
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
			//$output['soft_st'] = $soft_data_st_build;
			$output['posts'] = $posts;
			//$output['all_software_providers'] = $all_software_providers;
			//$output['soft_shortcode_array'] =  $soft_shortcode_array;
		}

		
		$response['alternative_software_providers']= $output;
		return $response;
	}
}
