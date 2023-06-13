<?php
/**
 * TabSwitcher block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * TabSwitcher class.
 */
class TabSwitcher extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'tab-switcher';

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
				'block_subtitle'    => $this->get_schema_string(),
				'block_tabletitle'  => $this->get_schema_string(),
				'enable_table_data' => $this->get_schema_boolean( false ),
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
		$infodata = ( isset( $attributes['info'] ) && $attributes['info'] ) ? $attributes['info'] : array();
		usort($infodata, function($a, $b) {
			return $a['index'] <=> $b['index'];
		});
		//return $infodata;
		$filtered_content = array();
		//$filtered_content['tabheader'] = wp_list_pluck( $infodata, 'title' );
		$tabheader = $tabcontent = array();
		if( $infodata ) {
			foreach ( $infodata as $key => $data ) {
				$idata = array();
				$tabheader[]['title'] = isset( $data['title'] ) ? do_shortcode( $data['title'] ) : '';
				if( isset( $data['content'] ) ) {
					foreach ( $data['content'] as $key => $content ) {
						$cdata = array();
						$cdata['field_type'] = isset( $content['field_type'] ) ? $content['field_type'] : 'text';
						$cdata['text'] = isset( $content['text'] ) ? do_shortcode( $content['text'] ) : '';
						$cdata['image'] = isset( $content['image'] ) ? $content['image'] : '';
						if( isset( $content['image'] ) ) {
							$image_id = attachment_url_to_postid( $content['image'] );
							$img_atts = wp_get_attachment_image_src( $image_id, 'full' );
							$cdata['width']			= isset( $img_atts[1] ) ? $img_atts[1] : '';
							$cdata['height']		= isset( $img_atts[2] ) ? $img_atts[2] : '';
						}
						$cdata['icon_style'] = isset( $content['icon_style'] ) ? $content['icon_style'] : 'blue_tick';
						$idata[] = $cdata;
					}
					$tabcontent[] = $idata;
				}
			}
		}
		$filtered_content['tabheader'] = $tabheader;
		$filtered_content['tabcontent'] = $tabcontent;
		return $filtered_content;
	}
}