<?php
/**
 * FAQ block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * FAQ class.
 */
class FAQ extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'faq';

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
				'faq_id'    		=> $this->get_schema_string(),
				'order'    			=> $this->get_schema_string('ASC'),
				'style'    			=> $this->get_schema_string('normal'),
				'bg_pattern' 		=> $this->get_schema_string(),
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
		$faq_id = isset( $attributes['faq_id'] ) ? absint( $attributes['faq_id'] ) : 0;
		$style = isset( $attributes['style'] ) ? $attributes['style'] : 'normal';
		$order = isset( $attributes['order'] ) ? $attributes['order'] : 'ASC';
		
		$faq_data = do_shortcode('[faq id="'.$faq_id.'" order="'.$order.'" output="json"]');
		$faq_data = json_decode( $faq_data, true );
		$faq_data['faq_data']['style'] = $style;
		if( isset( $attributes['bg_pattern'] ) )
			$faq_data['faq_data']['bg_pattern'] = $attributes['bg_pattern'];

		if( isset( $faq_data['data'] ) && $faq_data['data'] ) {
			foreach ( $faq_data['data'] as $key => $data ) {
				if( isset( $data['faq_question'] ) && $data['faq_question'] ) {
					$data['faq_question'] = wpvue_tag_compiler( do_shortcode( $data['faq_question'] ), $partner_id );
				}
				if( isset( $data['faq_answer'] ) && $data['faq_answer'] ) {
					$data['faq_answer'] = wpvue_tag_compiler( do_shortcode( $data['faq_answer'] ), $partner_id );
				}
				$faq_data['data'][$key] = $data;
			}
		}
		return $faq_data;
	}
}
