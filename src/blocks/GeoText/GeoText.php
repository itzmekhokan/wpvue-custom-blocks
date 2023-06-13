<?php
/**
 * GeoText block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * GeoText class.
 */
class GeoText extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'geo-text';

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
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;
		$text_tag = ( isset( $attributes['text_tag'] ) && $attributes['text_tag'] ) ? $attributes['text_tag'] : 'h2';
		$content = ( isset( $attributes['content'] ) && $attributes['content'] ) ? $attributes['content'] : '';
		$filtered_content = array(
			'tag' => $text_tag,
			'content' => wpvue_tag_compiler( do_shortcode( $content ), $partner_id ),
		);
		if( isset( $attributes['info'] ) && $attributes['info'] ) {
			$country_state = get_wpvue_current_country_state();

			foreach( $attributes['info'] as $info ) {
				$cs_arr = explode( '-', $info['country_code'] );
				if( count( $cs_arr ) > 1 ) {
					$country = $cs_arr[0];
					$states = explode( ',', $cs_arr[1] );
					if( $states ) {
						if( $country == $country_state['country'] && in_array( $country_state['state'], $states ) ) {
							$filtered_content['content'] = wpvue_tag_compiler( do_shortcode( $info['content'] ), $partner_id );
							break;
						}
					}else{
						if( $country == $country_state['country'] ) {
							$filtered_content['content'] = wpvue_tag_compiler( do_shortcode( $info['content'] ), $partner_id );
							break;
						}
					}
				}else{
					if( $info['country_code'] == $country_state['country'] ) {
						$filtered_content['content'] = wpvue_tag_compiler( do_shortcode( $info['content'] ), $partner_id );
						break;
					}
				}
			}
		}
		return $filtered_content;
	}
}