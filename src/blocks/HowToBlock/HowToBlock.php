<?php
/**
 * HowToBlock block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * HowToBlock class.
 */
class HowToBlock extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'howto-block';

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
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;
		$filtered_content['title'] = ( isset( $attributes['title'] ) && $attributes['title'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['title'] ), $partner_id ) : '';
		$filtered_content['title_tag'] = ( isset( $attributes['title_tag'] ) && $attributes['title_tag'] ) ? $attributes['title_tag'] : 'h2';
		$filtered_content['intro'] = ( isset( $attributes['intro'] ) && $attributes['intro'] ) ? wpvue_tag_compiler( do_shortcode( $attributes['intro'] ), $partner_id ) : '';
		$filtered_content['enable_background'] = ( isset( $attributes['enable_background'] ) && $attributes['enable_background'] ) ? true : false;
		$filtered_content['custom_font_color'] = ( isset( $attributes['custom_font_color'] ) && $attributes['custom_font_color'] ) ? $attributes['custom_font_color'] : '';
		$filtered_content['custom_bg_color'] = ( isset( $attributes['custom_bg_color'] ) && $attributes['custom_bg_color'] ) ? $attributes['custom_bg_color'] : '';
		$filtered_content['bg_image'] = ( isset( $attributes['bg_image'] ) && $attributes['bg_image'] ) ? $attributes['bg_image'] : '';
		$filtered_content['enable_mobile_bg'] = ( isset( $attributes['enable_mobile_bg'] ) && $attributes['enable_mobile_bg'] ) ? true : false;
		$filtered_content['mobile_bg'] = ( isset( $attributes['mobile_bg'] ) && $attributes['mobile_bg'] ) ? $attributes['mobile_bg'] : $filtered_content['bg_image'];
		$filtered_content['hide_list_numbers'] = ( isset( $attributes['hide_list_numbers'] ) && $attributes['hide_list_numbers'] ) ? true : false;
		
		$infodata = ( isset( $attributes['info'] ) && $attributes['info'] ) ? $attributes['info'] : array();
		usort($infodata, function($a, $b) {
			return $a['index'] <=> $b['index'];
		});
		$schema = array(
			'@context'  	=> 'http://schema.org',
			'@type' 		=> 'HowTo',
			'name' 			=> wp_strip_all_tags( $filtered_content['title'] ),
			'description' 	=> wp_strip_all_tags( $filtered_content['intro'] ),
			'step'=> array(),
		);

		if ( isset( $attributes['enable_supply'] ) && $attributes['enable_supply'] && isset( $attributes['supply_data'] ) && $attributes['supply_data'] ) {
			$supply_data = explode( '|', $attributes['supply_data'] );
			if( $supply_data ) {
				foreach ( $supply_data as $data ) {
					$schema['supply'][] = array(
						'@type' 		=> 'HowToSupply',
						'name'			=> do_shortcode( $data )
					);
				}
			}
		}

		if ( isset( $attributes['enable_tool'] ) && $attributes['enable_tool'] && isset( $attributes['tool_data'] ) && $attributes['tool_data'] ) {
			$tool_data = explode( '|', $attributes['tool_data'] );
			if( $tool_data ) {
				foreach ( $tool_data as $data ) {
					$schema['tool'][] = array(
						'@type' 		=> 'HowToTool',
						'name'			=> do_shortcode( $data )
					);
				}
			}
		}

		$url = site_url();
		$post = get_post( $post_id );
		if( $post ) {
			$url = get_permalink( $post_id );
			$slug_meta = get_field('slug', $post_id);
			if( $slug_meta && ( $post->post_type == 'game_free' || $post->post_type == 'game_paid' ) ) {
                $url = home_url( $slug_meta .'/'. $post->post_name );
			}
		}
		$filtered_content['steps'] = array();
		if( $infodata ) {
			foreach( $infodata as $info ) {
				$info['title'] = ( isset( $info['title'] ) && $info['title'] ) ? wpvue_tag_compiler( do_shortcode( $info['title'] ), $partner_id ) : '';
				$info['summary'] = ( isset( $info['summary'] ) && $info['summary'] ) ? wpvue_tag_compiler( do_shortcode( $info['summary'] ), $partner_id ) : '';

				$filtered_content['steps'][] = $info;

				// schema steps
				$schema['step'][] = array(
					'@type' 		=> 'HowToStep',
					'url'			=> trailingslashit( $url ) . '#howto-step-' . ( $info['index'] +1 ),
					'name'			=> wp_strip_all_tags( $info['title'] ),
					'itemListElement'=> array(
						array(
							'@type' 	=> 'HowToDirection',
							'text'		=> wp_strip_all_tags( $info['summary'] ),
						)
					),
					'image' 		=> array(
						'@type' 	=> 'ImageObject',
						'url'		=> $info['image'],
						'caption'	=> wp_strip_all_tags( $info['title'] )
					)
				);
			}
		}
		
		if ( isset( $attributes['enable_totaltime'] ) && $attributes['enable_totaltime'] ) {
			$days    = ( isset( $attributes['duration_DD'] ) && $attributes['duration_DD'] ) ? $attributes['duration_DD'] : 0;
			$hours   = ( isset( $attributes['duration_HH'] ) && $attributes['duration_HH'] ) ? $attributes['duration_HH'] : 0;
			$minutes = ( isset( $attributes['duration_MM'] ) && $attributes['duration_MM'] ) ? $attributes['duration_MM'] : 0;

			if ( ( $days + $hours + $minutes ) > 0 ) {
				$schema['totalTime'] = esc_attr( 'P' . $days . 'DT' . $hours . 'H' . $minutes . 'M' );
			}
		}
	
		$filtered_content['schema'] = json_encode( $schema, JSON_PRETTY_PRINT );
		return $filtered_content;
	}
}
