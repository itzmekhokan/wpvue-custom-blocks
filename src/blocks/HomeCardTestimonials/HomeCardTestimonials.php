<?php
/**
 * HomeCardTestimonials block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * HomeCardTestimonials class.
 */
class HomeCardTestimonials extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'home-card-testimonials';

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
		$filteredData = array();
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$partner_id = ( get_post_meta( $post_id, 'partner_id', true ) ) ? get_post_meta( $post_id, 'partner_id', true ) : 0;
		$filteredData['style'] = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'testimonials';
		if( $filteredData['style'] == 'cards' ) {
			$infodata = ( isset( $attributes['info'] ) && $attributes['info'] ) ? $attributes['info'] : array();
			usort($infodata, function($a, $b) {
				return $a['index'] <=> $b['index'];
			});

			$filteredData['cards'] = array();
			if( $infodata ) {
				foreach( $infodata as $info ) {
					$info['title'] = ( isset( $info['title'] ) && $info['title'] ) ? wpvue_tag_compiler( do_shortcode( $info['title'] ), $partner_id ) : '';
					$info['summary'] = ( isset( $info['summary'] ) && $info['summary'] ) ? wpvue_tag_compiler( do_shortcode( $info['summary'] ), $partner_id ) : '';

					$filteredData['cards'][] = $info;
				}
			}
		}else{
			/*** Testimonial */
			$frontpage_id = get_option( 'page_on_front' );
			if( $frontpage_id ) {
				$card_testimonials = get_field('card_testimonials', $frontpage_id);

				$limit = get_theme_option( 'testimonial_char_limit' );
				$append = get_theme_option( 'testimonial_append_char' );
				if(!empty($card_testimonials)){
					foreach( $card_testimonials as $tk => $tv ){
						$link = $tv['redirect'] > 0 ? get_permalink($tv['redirect']) : '';
						$card_testimonials[$tk]['mobile_content'] = '<p>'.wcra_lim_char(Shortcode_Compiler::return(wp_strip_all_tags($tv['content'])) , $limit , $append ).'</p>';
						$card_testimonials[$tk]['content'] = Shortcode_Compiler::return($tv['content']);
						$card_testimonials[$tk]['redirect'] = $link;
						$card_testimonials[$tk]['hover_icon'] = $tv['hover_icon'];
						unset($card_testimonials[$tk]['icon_svg_path']);
			
					}
				}
				$filteredData['card_testimonials_columns'] = ( get_theme_option( 'testimonials_2columns' ) ) ? 2 : 3;
				$filteredData['card_testimonials'] = $card_testimonials;
			}
		}
		
		return $filteredData;
	}
}
