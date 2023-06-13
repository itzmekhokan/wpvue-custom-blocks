<?php
/**
 * PokerHands block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * PokerHands class.
 */
class PokerHands extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'poker-hands';

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
		$info = array();
		if( isset( $attributes['info'] ) ) {
			foreach ( $attributes['info'] as $key => $data ) {
				$first_card_type = isset( $data['first_card_type'] ) ? $data['first_card_type'] : 'clubs';
				$first_card_no = isset( $data['first_card_no'] ) ? $data['first_card_no'] : 'A';
				$second_card_type = isset( $data['second_card_type'] ) ? $data['second_card_type'] : 'clubs';
				$second_card_no = isset( $data['second_card_no'] ) ? $data['second_card_no'] : 'A';
				$item = array(
					'content'	=> isset( $data['content'] ) ? do_shortcode( $data['content'] ) : '',
					'front_first_card' => WPVCB_PLUGIN_URL . 'assets/images/cards/'.$first_card_type.'/'.$first_card_no.'.svg',
					'front_second_card' => WPVCB_PLUGIN_URL . 'assets/images/cards/'.$second_card_type.'/'.$second_card_no.'.svg',
					'back_both_card' => WPVCB_PLUGIN_URL . 'assets/images/cards/cardback.svg',
				);
				$info[] = $item;
			}
		}
		return array( 'info' => $info );
	}
}
