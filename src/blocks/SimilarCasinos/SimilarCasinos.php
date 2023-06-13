<?php
/**
 * SimilarCasinos block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * SimilarCasinos class.
 */
class SimilarCasinos extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'similar-casinos';

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
				'block_title'    	=> $this->get_schema_string(),
				'group_id'    		=> $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'enable_tags'		=> $this->get_schema_boolean( false ),
				'tags'				=> $this->get_schema_string(),
				'tag_mode'			=> $this->get_schema_string(),
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
		$group_id = isset( $attributes['group_id'] ) ? absint( $attributes['group_id'] ) : get_theme_option('cas_toplist_group_id');
		$quantity =  ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : 4;
		$enable_tags = ( isset( $attributes['enable_tags'] ) && $attributes['enable_tags'] ) ? true : false;
		$tag_mode = ( isset( $attributes['tag_mode'] ) && $attributes['tag_mode'] ) ? $attributes['tag_mode'] : '';
		$tags = ( isset( $attributes['tags'] ) && $attributes['tags'] ) ? $attributes['tags'] : '';
		$asset_category = ( isset( $attributes['asset_category'] ) && $attributes['asset_category'] ) ? $attributes['asset_category'] : '';
		$enable_payment_popup = ( isset( $attributes['enable_payment_popup'] ) && $attributes['enable_payment_popup'] ) ? true : false;
		$cas_filterby = ( isset( $attributes['cas_filterby'] ) && $attributes['cas_filterby'] ) ? $attributes['cas_filterby'] : '';
		$shortcode_args = '';
		if( $asset_category ) {
			$shortcode_args .= 'asset-category-name="'.$asset_category.'" ';
		}
		if( $enable_tags && $tags ) {
			$shortcode_args .= 'tag="'.$tags.'" ';
			if( $tag_mode && $tag_mode == 'OR' ) {
				$shortcode_args .= 'tagmode="'.$tag_mode.'" ';
			}
		}
		$default_payment_display = ( get_theme_option( 'toplist_default_payment_display' ) ) ? get_theme_option( 'toplist_default_payment_display' ) : 5;
		$default_software_display = ( get_theme_option( 'toplist_default_software_display' ) ) ? get_theme_option( 'toplist_default_software_display' ) : 5;
		
		if( $cas_filterby == 'payment-option' ) {
			$payment = ( isset( $attributes['payment_option'] ) && $attributes['payment_option'] ) ? json_decode( $attributes['payment_option'] ) : array();
			$payment_id = 0;
			if( $payment ) {
				if( isset( $payment->value ) ) {
					$payment_id = $payment->value;
				}
			}
			$similar_casinos_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" paymentmethod-id="'.$payment_id.'" qty="'.$quantity.'" '.$shortcode_args.' return="json"]');
		}elseif( $cas_filterby == 'software' ) {
			$software = ( isset( $attributes['software_provider'] ) && $attributes['software_provider'] ) ? json_decode( $attributes['software_provider'] ) : array();
			$software_id = 0;
			if( $software ) {
				if( isset( $software->value ) ) {
					$software_id = $software->value;
				}
			}
			$similar_casinos_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" softwareprovider-id="'.$software_id.'" qty="'.$quantity.'" '.$shortcode_args.' return="json"]');
		}else{
			$similar_casinos_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" qty="'.$quantity.'" '.$shortcode_args.' return="json"]');
		}
		
		$similar_casinos_data = json_decode(urldecode($similar_casinos_data), true);
		$filteredData = array();
		if( $similar_casinos_data ) {
			foreach( $similar_casinos_data as $casino ) {
				// filtered data
				unset( $casino['primary_colour'] );
				unset( $casino['secondary_colour'] );
				unset( $casino['online_since'] );
				unset( $casino['supported_language'] );
				unset( $casino['supported_platform'] );
				unset( $casino['product_licences'] );

				$casinoData = $casino;
				// supported payments 
				if( isset( $casino['product_id'] ) ) {
					$order = '';
					if( get_theme_option( 'order_payment_option' ) != 'ASC' ) {
						$order = "order='".get_theme_option( 'order_payment_option' )."'";
					}
					$supported_payments = do_shortcode("[cas-payment-options pid='".$casino['product_id']."' ".$order." return='json']");
					$supported_payments = json_decode(urldecode($supported_payments), true);
					$casinoData['supported_payments_total'] = count( $supported_payments );
					if( get_theme_option( 'enable_preferred_payment' ) == 1 && get_theme_option( 'preferred_payment_id' ) ) {
						$supported_payments = wpvue_get_preferred_item_first_array( $supported_payments, 'po_id', get_theme_option( 'preferred_payment_id' ) );
					}
					if( !$enable_payment_popup ){
						$supported_payments = ( $casinoData['supported_payments_total'] > $default_payment_display ) ? array_slice( $supported_payments, 0, $default_payment_display ) : $supported_payments;
					}
					
					$partner_supported_payments = array();
					if( $supported_payments ) {
						foreach ( $supported_payments as $key => $payment ) {
							$payment = (array)$payment;
							$partner_supported_payments[$key]['product_id'] = $payment['product_id'];
							$partner_supported_payments[$key]['po_id'] = $payment['po_id'];
							$partner_supported_payments[$key]['url'] = $payment['url'];
							$partner_supported_payments[$key]['name'] = $payment['name'];
							$partner_supported_payments[$key]['link'] = $payment['link'];
						}
					}
					$casinoData['supported_payments'] = $partner_supported_payments;
				}
				$filteredData[] = $casinoData;
			}
		}
		return $filteredData;
	}
}
