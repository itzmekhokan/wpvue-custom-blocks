<?php
/**
 * USMapData block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * USMapData class.
 */
class USMapData extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'us-map-data';

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
		$filteredContent = array(
			'selected_map'    	=> ( isset( $attributes['selected_map'] ) && $attributes['selected_map'] ) ? $attributes['selected_map'] : 'US',
			'heading'    	 	=> ( isset( $attributes['block_title'] ) && $attributes['block_title'] ) ? do_shortcode( $attributes['block_title'] ) : '',
			'heading_tag'    	=> ( isset( $attributes['heading_tag'] ) && $attributes['heading_tag'] ) ? $attributes['heading_tag'] : 'h1',
			'sub_heading'		=> ( isset( $attributes['block_subtitle'] ) && $attributes['block_subtitle'] ) ? do_shortcode( $attributes['block_subtitle'] ) : '',
			'subheading_tag'    => ( isset( $attributes['subheading_tag'] ) && $attributes['subheading_tag'] ) ? $attributes['subheading_tag'] : 'h3',
			'enable_table_data'	=> ( isset( $attributes['enable_table_data'] ) && $attributes['enable_table_data'] ) ? true : false,
			'table_heading' 	=> ( isset( $attributes['block_tabletitle'] ) && $attributes['block_tabletitle'] ) ? do_shortcode( $attributes['block_tabletitle'] ) : '',
			'table_heading_tag' => ( isset( $attributes['table_heading_tag'] ) && $attributes['table_heading_tag'] ) ? $attributes['table_heading_tag'] : 'h3',
			'colors'			=> array(
				'color_18' 		=> ( isset( $attributes['color_18'] ) && $attributes['color_18'] ) ? $attributes['color_18'] : '#58fba4',
				'color_20' 		=> ( isset( $attributes['color_20'] ) && $attributes['color_20'] ) ? $attributes['color_20'] : '#fbbb40',
				'color_21' 		=> ( isset( $attributes['color_21'] ) && $attributes['color_21'] ) ? $attributes['color_21'] : '#891ec7',
				'color_na' 		=> ( isset( $attributes['color_na'] ) && $attributes['color_na'] ) ? $attributes['color_na'] : '#221d47',
				'color_null' 	=> ( isset( $attributes['color_null'] ) && $attributes['color_null'] ) ? $attributes['color_null'] : '#F5DC00',
			)
		);
		$us_states = isset( $attributes['state_lists'] ) ? $attributes['state_lists'] : array();
		$us_states = wp_list_pluck( $us_states, 'name', 'abbreviation' );
		$filteredContent['states_list'] = ( $us_states ) ? $us_states : array();
		$states_data = array();
		if( isset( $attributes['info'] ) && is_array( $attributes['info'] ) ) {
			foreach ( $attributes['info'] as $key => $data ) {
				$state_code = isset( $data['state'] ) ? $data['state'] : '';
				$states_data[$state_code] = array(
					'state_code'				=> $state_code,
					'state_name'				=> isset( $us_states[$data['state']] ) ? $us_states[$data['state']] : '',
					'url'						=> isset( $data['url'] ) ? $data['url'] : '',
					'age_casinos'				=> isset( $data['age_casinos'] ) ? $data['age_casinos'] : '',
					'age_casinos_lbl'			=> isset( $data['age_casinos'] ) ? $this->get_translated_string_data( $data['age_casinos'] ) : '',
					'age_poker_rooms'			=> isset( $data['age_poker_rooms'] ) ? $data['age_poker_rooms'] : '',
					'age_poker_rooms_lbl'		=> isset( $data['age_poker_rooms'] ) ? $this->get_translated_string_data( $data['age_poker_rooms'] ) : '',
					'age_bingo'					=> isset( $data['age_bingo'] ) ? $data['age_bingo'] : '',
					'age_bingo_lbl'				=> isset( $data['age_bingo'] ) ? $this->get_translated_string_data( $data['age_bingo'] ) : '',
					'age_lottery'				=> isset( $data['age_lottery'] ) ? $data['age_lottery'] : '',
					'age_lottery_lbl'			=> isset( $data['age_lottery'] ) ? $this->get_translated_string_data( $data['age_lottery'] ) : '',
					'age_dog_horse_racing'		=> isset( $data['age_dog_horse_racing'] ) ? $data['age_dog_horse_racing'] : '',
					'age_dog_horse_racing_lbl'	=> isset( $data['age_dog_horse_racing'] ) ? $this->get_translated_string_data( $data['age_dog_horse_racing'] ) : '',
				);
			}
		}
		$filteredContent['states_data'] = $states_data;
		return $filteredContent;
	}

	public function get_translated_string_data( $string_key ) {
		if( $string_key ) {
			switch ( $string_key ) {
				case '18-only-cruises':
					$string = '18 ('.wpvue_get_transalated_strings( 'only_cruises' ) . ')';
					break;
				case '18-21':
					$string = '18/21';
					break;
				case '18-indian-casinos':
					$string = '18 ('.wpvue_get_transalated_strings( 'indian_casinos' ) . ')';
					break;
				case '21-only-cruises':
					$string = '21 ('.wpvue_get_transalated_strings( 'only_cruises' ) . ')';
					break;
				case 'N/A':
					$string = wpvue_get_transalated_strings( 'n_a' );
					break;
				default:
					$string = $string_key;
					break;
			}
			return $string;
		}
		return '';
	}
}
