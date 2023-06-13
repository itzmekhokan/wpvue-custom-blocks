<?php
/**
 * ExclusiveCasino block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * ExclusiveCasino class.
 */
class ExclusiveCasino extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'exclusive-casino';

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
				'first_card_logo'    	 	=> $this->get_schema_string(),
				'first_card_text1'			=> $this->get_schema_string(),
				'first_card_text2'			=> $this->get_schema_string(),
				'first_card_text3' 			=> $this->get_schema_string(),
				'first_card_btn_text' 		=> $this->get_schema_string(),
				'first_card_btn_link'    	=> $this->get_schema_string(),
				'first_card_tnc_text'		=> $this->get_schema_string(),
				'first_card_tnc_link' 		=> $this->get_schema_string(),
				'enable_selected_casino' 	=> $this->get_schema_boolean( false ),
				'selected_casinos'    		=> $this->get_schema_string(),
				'enable_excluded_casino' 	=> $this->get_schema_boolean( false ),
				'excluded_casinos'    		=> $this->get_schema_string(),
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
		$enable_selected_casino = isset( $attributes['enable_selected_casino'] ) ? $attributes['enable_selected_casino'] : false;
		$selected_casinos = ( isset( $attributes['selected_casinos'] ) && $attributes['selected_casinos'] ) ? json_decode( $attributes['selected_casinos'] ) : array();
		$enable_excluded_casino = isset( $attributes['enable_excluded_casino'] ) ? $attributes['enable_excluded_casino'] : false;
		$excluded_casinos = ( isset( $attributes['excluded_casinos'] ) && $attributes['excluded_casinos'] ) ? json_decode( $attributes['excluded_casinos'] ) : array();
		$hide_less3_casinos = isset( $attributes['hide_less3_casinos'] ) ? $attributes['hide_less3_casinos'] : false;

		$filteredContent = array(
			'bg_image' => wp_get_attachment_url( get_theme_option( 'block_exclusive_casino_bg_image' ) ),
			'first_card' => $attributes,
			'casinos' => array() 
		);
		$excluded_casinos_ids = array();
		if( $enable_excluded_casino && $excluded_casinos ) {
			$excluded_casinos_ids = wp_list_pluck( $excluded_casinos, 'value' );
		}

		$group_id = get_theme_option( 'cas_toplist_group_id' );
		if( $enable_selected_casino && $selected_casinos ) {
			$selected_casinos_ids = wp_list_pluck( $selected_casinos, 'value' );
			if( $selected_casinos_ids ) {
				foreach ( $selected_casinos_ids as $partner_id ) {
					// check exclusion
					if( in_array( $partner_id, $excluded_casinos_ids ) ) continue;
					
					$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" return="json"]');
					$toplist_data = json_decode(urldecode($toplist_data), true)[0];
					if( $toplist_data ) {
						// filtered data
						unset( $toplist_data['primary_colour'] );
						unset( $toplist_data['secondary_colour'] );
						unset( $toplist_data['online_since'] );
						unset( $toplist_data['supported_language'] );
						unset( $toplist_data['supported_platform'] );
						unset( $toplist_data['product_licences'] );

						$filteredContent['casinos'][] = $toplist_data;
					}
					if( count( $filteredContent['casinos'] ) == 3 ) break;
				}
			}
		}else{
			$tag = ( wpvue_get_transalated_strings( 'exclusive' ) ) ? strtolower( wpvue_get_transalated_strings( 'exclusive' ) ) : 'exclusive';
			$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" tag="'.trim($tag).'" return="json"]');
			$toplist_data = json_decode(urldecode($toplist_data), true);
			if( $toplist_data ) {
				foreach ( $toplist_data as $partner ) {
					// check exclusion
					if( in_array( $partner['product_id'], $excluded_casinos_ids ) ) continue;
					// filtered data
					unset( $partner['primary_colour'] );
					unset( $partner['secondary_colour'] );
					unset( $partner['online_since'] );
					unset( $partner['supported_language'] );
					unset( $partner['supported_platform'] );
					unset( $partner['product_licences'] );

					$filteredContent['casinos'][] = $partner;

					if( count( $filteredContent['casinos'] ) == 3 ) break;
				}
			}
		}
		if( $hide_less3_casinos && count( $filteredContent ) < 3 ) {
			return array();
		}
		return $filteredContent;
	}
}
