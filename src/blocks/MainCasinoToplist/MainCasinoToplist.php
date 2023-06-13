<?php
/**
 * MainCasinoToplist block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * MainCasinoToplist class.
 */
class MainCasinoToplist extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'main-casino-toplist';

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
				'group_id'    		=> $this->get_schema_string(),
				'quantity' 			=> $this->get_schema_string(),
				'gift_icon' 		=> $this->get_schema_string(),
				'enable_tags' 		=> $this->get_schema_boolean( false ),
				'tag_mode' 			=> $this->get_schema_string(),
				'tags' 				=> $this->get_schema_string(),
				'enable_sort_by' 	=> $this->get_schema_boolean( false ),
				'sort_by' 			=> $this->get_schema_string(),
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
		$group_id = ( isset( $attributes['group_id'] ) ) ? absint( $attributes['group_id'] ) : get_theme_option('cas_toplist_group_id');
		$quantity = ( isset( $attributes['quantity'] ) ) ? absint( $attributes['quantity'] ) : 0;
		$enable_tags = ( isset( $attributes['enable_tags'] ) && $attributes['enable_tags'] ) ? true : false;
		$enable_sort_by = ( isset( $attributes['enable_sort_by'] ) && $attributes['enable_sort_by'] ) ? true : false;
		$tag_mode = ( isset( $attributes['tag_mode'] ) && $attributes['tag_mode'] ) ? $attributes['tag_mode'] : '';
		$tags = ( isset( $attributes['tags'] ) && $attributes['tags'] ) ? $attributes['tags'] : '';
		$sort_by = ( isset( $attributes['sort_by'] ) && $attributes['sort_by'] ) ? $attributes['sort_by'] : '';
		$gift_icon = ( isset( $attributes['gift_icon'] ) && $attributes['gift_icon'] ) ? $attributes['gift_icon'] : WPVCB_PLUGIN_URL . 'assets/images/gift-box.svg';

		$default_display = ( get_theme_option( 'cas_toplist_default_display' ) ) ? get_theme_option( 'cas_toplist_default_display' ) : 10;
		$display_offset = ( get_theme_option( 'cas_toplist_display_offset' ) ) ? get_theme_option( 'cas_toplist_display_offset' ) : 3;

		$default_payment_display = ( get_theme_option( 'toplist_default_payment_display' ) ) ? get_theme_option( 'toplist_default_payment_display' ) : 5;
		$default_software_display = ( get_theme_option( 'toplist_default_software_display' ) ) ? get_theme_option( 'toplist_default_software_display' ) : 5;
		
		// bind shortcode as per settings
		$sc_str = '[cas-toplist-group id="'.$group_id.'" procons-visible="1" return="json" ';
		if( $quantity != 0 ) {
			// check qunatity with default display
			$qty = ( $quantity >= (int)$default_display ) ? $default_display : $quantity;
			$sc_str .= 'qty="'.$qty.'" ';
			//$sc_str .= 'qty="'.$quantity.'" ';
		}elseif( $default_display ) {
			$sc_str .= 'qty="'.$default_display.'" ';
		}
		if( $enable_tags && $tags ) {
			$sc_str .= 'tag="'.$tags.'" ';
			if( $tag_mode ) {
				$sc_str .= 'tagmode="'.$tag_mode.'" ';
			}
		}
		if( $enable_sort_by && $sort_by ){
			$sc_str .= 'sort_by="'.$sort_by.'" ';
		}
		$sc_str .= ']';
		$toplist_data = do_shortcode($sc_str);
		$toplist_data = json_decode(urldecode($toplist_data), true);
		$newtoplist = array();
		if( $toplist_data ) {
			global $wcra_asset_sizes;
			foreach( $toplist_data as $partner ) {
				$partner = (array)$partner;

				// get partner background image
				if( isset( $partner['product_assets'] ) ) {
					$asset_cat_imgs = wp_list_pluck( $partner['product_assets'], 'url', 'asset_category_name' );
					$bg_asset_size = isset( $wcra_asset_sizes['pro_asset_sizes']['background'] ) ? $wcra_asset_sizes['pro_asset_sizes']['background'] : 'product_logo_background';
					$partner['bg_cover'] = ( isset( $asset_cat_imgs[$bg_asset_size] ) && $asset_cat_imgs[$bg_asset_size] ) ? $asset_cat_imgs[$bg_asset_size] : '';
				}
				
				$order = '';
				if( get_theme_option( 'order_payment_option' ) != 'ASC' ) {
					$order = "order='".get_theme_option( 'order_payment_option' )."'";
				}
				// supported payments 
				$supported_payments = do_shortcode("[cas-payment-options pid='".$partner['product_id']."' ".$order." return='json']");
				
				$supported_payments = json_decode(urldecode($supported_payments), true);
				$partner['supported_payments_total'] = count( $supported_payments );
				if( get_theme_option( 'enable_preferred_payment' ) == 1 && get_theme_option( 'preferred_payment_id' ) ) {
					$supported_payments = wpvue_get_preferred_item_first_array( $supported_payments, 'po_id', get_theme_option( 'preferred_payment_id' ) );
				}
				$supported_payments = ( $partner['supported_payments_total'] > $default_payment_display ) ? array_slice( $supported_payments, 0, $default_payment_display ) : $supported_payments;
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
				$partner['supported_payments'] = $partner_supported_payments;
				// software provider 
				$order = '';
				if( get_theme_option( 'order_software_provider' ) != 'ASC' ) {
                    $order = 'order="'.get_theme_option( 'order_software_provider' ).'"';
                }
                $soft_asset_sizes = isset( $wcra_asset_sizes['soft_asset_sizes']['medium'] ) ? $wcra_asset_sizes['soft_asset_sizes']['medium'] : 'software_logo_105x105';
                $software_provider_data = do_shortcode('[cas-software-provider asset-category-name="'.$soft_asset_sizes.'" pid="'.$partner['product_id'].'" '.$order.' return="json"]');
				$software_provider_data = json_decode(urldecode($software_provider_data), true);
				$partner['software_providers_total'] = count( $software_provider_data );
				if( get_theme_option( 'enable_preferred_software' ) == 1 && get_theme_option( 'preferred_software_id' ) ) {
					$software_provider_data = wpvue_get_preferred_item_first_array( $software_provider_data, 'software_id', get_theme_option( 'preferred_software_id' ) );
				}
				$software_providers = ( $partner['software_providers_total'] > $default_software_display ) ? array_slice( $software_provider_data, 0, $default_software_display ) : $software_provider_data;
				$partner_software_providers = array();
				if( $software_providers ) {
					foreach ( $software_providers as $key => $software ) {
						$software = (array)$software;
						$partner_software_providers[$key]['product_id'] = $software['product_id'];
						$partner_software_providers[$key]['software_id'] = $software['software_id'];
						$partner_software_providers[$key]['url'] = $software['url'];
						$partner_software_providers[$key]['name'] = $software['name'];
						//$partner_software_providers[$key]['link'] = $software['link'];
					}
				}
				$partner['software_providers'] = $partner_software_providers;

				// filtered data
				unset( $partner['primary_colour'] );
				unset( $partner['secondary_colour'] );
				unset( $partner['online_since'] );
				unset( $partner['supported_language'] );
				unset( $partner['supported_platform'] );
				unset( $partner['product_licences'] );

				$newtoplist[] = $partner;
			}
		}
		
		$filterData = array(
			'attrs' => array(
				'gift_icon' => $gift_icon
			),
			'toplist' => $newtoplist
		);
		
		return $filterData;
	}
}
