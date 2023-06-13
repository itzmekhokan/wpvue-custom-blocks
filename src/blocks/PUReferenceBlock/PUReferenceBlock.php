<?php
/**
 * PUReferenceBlock block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * PUReferenceBlock class.
 */
class PUReferenceBlock extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'pu-reference';

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
		$ref_id = isset( $attributes['ref_id'] ) ? absint( $attributes['ref_id'] ) : 0;
		$style = isset( $attributes['style'] ) ? $attributes['style'] : '';
		$title = isset( $attributes['title'] ) ? $attributes['title'] : '';
		$title_tag = isset( $attributes['title_tag'] ) ? $attributes['title_tag'] : 'h2';

		$reference_sets = get_reference_sets_data();
	    $reference_data = isset( $reference_sets[$ref_id] ) ? $reference_sets[$ref_id] : array();
		if( !$reference_data ) return array();
		$filtered_content = array(
			'title' => ( $title ) ? do_shortcode( $title ) : do_shortcode( htmlspecialchars_decode( $reference_data['ref_name'], ENT_QUOTES ) ),
			'title_tag' => $title_tag,
			'style' => ( $style ) ? $style : $reference_data['ref_style'], 
			'ref_items' => array(),
		);

		if( isset( $reference_data['ref_items'] ) && $reference_data['ref_items'] ) {
			foreach ( $reference_data['ref_items'] as $key => $item ) {
				$list = $item;
				$list['item_text_before'] = do_shortcode( htmlspecialchars_decode( $item['item_text_before'], ENT_QUOTES ) );
				$list['item_name'] = do_shortcode( htmlspecialchars_decode( $item['item_name'], ENT_QUOTES ) );
				$list['item_text_after'] = do_shortcode( htmlspecialchars_decode( $item['item_text_after'], ENT_QUOTES ) );
				$filtered_content['ref_items'][] = $list;
				
			}
		}
		
		return $filtered_content;
	}
}
