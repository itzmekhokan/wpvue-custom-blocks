<?php
/**
 * HomeBanner block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * HomeBanner class.
 */
class HomeBanner extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'home-banner';

	/**
	 * Get block attributes.
	 *
	 * @return array
	 */
	protected function get_attributes() {
		return array_merge(
			parent::get_attributes(),
			array(
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
		$filtered_content['banner_title'] = ( isset( $attributes['banner_title'] ) && $attributes['banner_title'] ) ? do_shortcode( $attributes['banner_title'] ) : '';
		$filtered_content['bg_image_id'] = ( isset( $attributes['bg_image_id'] ) && $attributes['bg_image_id'] ) ? $attributes['bg_image_id'] : 0;
		$filtered_content['bg_image'] = ( isset( $attributes['bg_image'] ) && $attributes['bg_image'] ) ? $attributes['bg_image'] : '';
		$filtered_content['enable_mobile_bg'] = ( isset( $attributes['enable_mobile_bg'] ) && $attributes['enable_mobile_bg'] ) ? true : false;
		$filtered_content['mobile_bg_image_id'] = ( isset( $attributes['mobile_bg_image_id'] ) && $attributes['mobile_bg_image_id'] ) ? $attributes['mobile_bg_image_id'] : 0;
		$filtered_content['mobile_bg_image'] = ( isset( $attributes['mobile_bg_image'] ) && $attributes['mobile_bg_image'] ) ? $attributes['mobile_bg_image'] : '';
		$filtered_content['heading'] = ( isset( $attributes['heading'] ) && $attributes['heading'] ) ? do_shortcode( $attributes['heading'] ) : '';
		$filtered_content['heading_tag'] = ( isset( $attributes['heading_tag'] ) && $attributes['heading_tag'] ) ? $attributes['heading_tag'] : 'h2';
		$filtered_content['text'] = ( isset( $attributes['text'] ) && $attributes['text'] ) ? do_shortcode( $attributes['text'] ) : '';
		$filtered_content['mobile_text'] = ( isset( $attributes['mobile_text'] ) && $attributes['mobile_text'] ) ? do_shortcode( $attributes['mobile_text'] ) : $filtered_content['text'];
		$filtered_content['no_of_lines'] = ( isset( $attributes['no_of_lines'] ) && $attributes['no_of_lines'] ) ? $attributes['no_of_lines'] : '4';
		$filtered_content['no_of_lines_mobile'] = ( isset( $attributes['no_of_lines_mobile'] ) && $attributes['no_of_lines_mobile'] ) ? $attributes['no_of_lines_mobile'] : '4';
		//$filtered_content['disable_showmore'] = ( isset( $attributes['disable_showmore'] ) && $attributes['disable_showmore'] ) ? true : false;
		$filtered_content['disable_showmore_mobile'] = ( isset( $attributes['disable_showmore_mobile'] ) && $attributes['disable_showmore_mobile'] ) ? true : false;
		$filtered_content['logo_title'] = ( isset( $attributes['logo_title'] ) && $attributes['logo_title'] ) ? do_shortcode( $attributes['logo_title'] ) : '';
		$filtered_content['logo_image_id'] = ( isset( $attributes['logo_image_id'] ) && $attributes['logo_image_id'] ) ? $attributes['logo_image_id'] : 0;
		$filtered_content['logo_image'] = ( isset( $attributes['logo_image'] ) && $attributes['logo_image'] ) ? $attributes['logo_image'] : '';
		$filtered_content['enable_font_color'] = ( isset( $attributes['enable_font_color'] ) && $attributes['enable_font_color'] ) ? true : false;
		$filtered_content['custom_font_color'] = ( isset( $attributes['custom_font_color'] ) && $attributes['custom_font_color'] ) ? $attributes['custom_font_color'] : '';
		$filtered_content['toplist_bns_color'] = ( isset( $attributes['toplist_bns_color'] ) && $attributes['toplist_bns_color'] ) ? $attributes['toplist_bns_color'] : '#fff';
		$filtered_content['toplist_bns_hover_color'] = ( isset( $attributes['toplist_bns_hover_color'] ) && $attributes['toplist_bns_hover_color'] ) ? $attributes['toplist_bns_hover_color'] : '#fff';
		$filtered_content['cta_link_target'] = ( isset( $attributes['cta_link_target'] ) && $attributes['cta_link_target'] ) ? $attributes['cta_link_target'] : '_blank';
		$filtered_content['cta_link_rel'] = ( isset( $attributes['cta_link_rel'] ) && $attributes['cta_link_rel'] ) ? $attributes['cta_link_rel'] : 'nofollow';
		$filtered_content['banner_style'] = ( isset( $attributes['banner_style'] ) && $attributes['banner_style'] ) ? $attributes['banner_style'] : 'badge_image';
		$filtered_content['recommended_by'] = ( isset( $attributes['recommended_by'] ) && $attributes['recommended_by'] ) ? do_shortcode( $attributes['recommended_by'] ): '';
		$filtered_content['recommended_title_tag'] = ( isset( $attributes['recommended_title_tag'] ) && $attributes['recommended_title_tag'] ) ? $attributes['recommended_title_tag'] : 'h3';
		$filtered_content['toplist_bg_color'] = ( isset( $attributes['toplist_bg_color'] ) && $attributes['toplist_bg_color'] ) ? $attributes['toplist_bg_color'] : '';
		$filtered_content['enable_tags'] = ( isset( $attributes['enable_tags'] ) && $attributes['enable_tags'] ) ? true : false;
		$filtered_content['tags'] = ( isset( $attributes['tags'] ) && $attributes['tags'] ) ? $attributes['tags'] : '';
		$filtered_content['tag_mode'] = ( isset( $attributes['tag_mode'] ) && $attributes['tag_mode'] ) ? $attributes['tag_mode'] : '';
		if( $filtered_content['banner_style'] == 'toplist' ) {
			$group_id = ( isset( $attributes['group_id'] ) && $attributes['group_id'] ) ? $attributes['group_id'] : get_theme_option('cas_toplist_group_id');
			$sc_str = '[cas-toplist-group id="'.$group_id.'" qty="3" return="json" ';
			// if( $asset_category ) {
			// 	$sc_str .= 'asset-category-name="'.$asset_category.'" ';
			// }
			if( $filtered_content['enable_tags'] && $filtered_content['tags'] ) {
				$sc_str .= 'tag="'.$filtered_content['tags'].'" ';
				if( $filtered_content['tag_mode'] && $filtered_content['tag_mode'] == 'OR' ) {
					$sc_str .= 'tagmode="'.$filtered_content['tag_mode'].'" ';
				}
			}
			// if( $enable_sort_by && $sort_by ){
			// 	$sc_str .= 'sort_by="'.$sort_by.'" ';
			// }
			$sc_str .= ']';
			$toplist_data = do_shortcode($sc_str);
			$toplist_data = json_decode(urldecode($toplist_data), true);
			if( !$toplist_data ) $filtered_content['banner_style'] = 'badge_image';
			$filtered_content['toplist_data'] = $toplist_data;
		}
		$infodata = ( isset( $attributes['info'] ) && $attributes['info'] ) ? $attributes['info'] : array();
		usort($infodata, function($a, $b) {
			return $a['index'] <=> $b['index'];
		});
		$filtered_content['cards'] = array();
		if( $infodata ) {
			foreach( $infodata as $info ) {
				$info['title'] = ( isset( $info['title'] ) && $info['title'] ) ? do_shortcode( $info['title'] ) : '';
				$info['target'] = ( isset( $info['target'] ) && $info['target'] ) ? $info['target'] : '_blank';
				$info['rel'] = ( isset( $info['rel'] ) && $info['rel'] ) ? $info['rel'] : 'nofollow';
				$filtered_content['cards'][] = $info;
			}
		}
		return $filtered_content;
	}
}
