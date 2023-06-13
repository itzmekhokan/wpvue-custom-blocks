<?php
/**
 * CasinoToplist block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * CasinoToplist class.
 */
class CasinoToplist extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'casino-toplist';

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
				'partner_id'    	=> $this->get_schema_string(),
				'style'    			=> $this->get_schema_string('list'),
				'payment_type'    	=> $this->get_schema_array('both'),
				'payment_method_id' => $this->get_schema_string(),
				'software_provider_id' => $this->get_schema_string(),
				'both_type_label' 	=> $this->get_schema_string(),
				'deposit_type_label'=> $this->get_schema_string(),
				'withdrawal_type_label' => $this->get_schema_string(),
				'quantity' 			=> $this->get_schema_string(),
				'default_display' 	=> $this->get_schema_string(),
				'display_offset' 	=> $this->get_schema_string(),
				'show_all_btn_label'=> $this->get_schema_string(),
				'show_less_btn_label'=> $this->get_schema_string(),
				'best_choice_label'=> $this->get_schema_string(),
				'top_choice_label'=> $this->get_schema_string(),
				'bg_pattern' 		=> $this->get_schema_string(),
				'asset_category'	=> $this->get_schema_string(),
				'enable_tags' 		=> $this->get_schema_boolean( false ),
				'tag_mode' 			=> $this->get_schema_string(),
				'tags' 				=> $this->get_schema_string(),
				'enable_sort_by' 	=> $this->get_schema_boolean( false ),
				'sort_by' 			=> $this->get_schema_string(),
				'enable_mobile_supports' => $this->get_schema_boolean( false ),
				'partner_supported' => $this->get_schema_string(),
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
		$partner_id = ( isset( $attributes['partner_id'] ) ) ? absint( $attributes['partner_id'] ) : 0;
		$style = ( isset( $attributes['style'] ) ) ? $attributes['style'] : 'list';
		$quantity = ( isset( $attributes['quantity'] ) ) ? absint( $attributes['quantity'] ) : 0;
		$enable_tags = ( isset( $attributes['enable_tags'] ) && $attributes['enable_tags'] ) ? true : false;
		$enable_sort_by = ( isset( $attributes['enable_sort_by'] ) && $attributes['enable_sort_by'] ) ? true : false;
		$tag_mode = ( isset( $attributes['tag_mode'] ) && $attributes['tag_mode'] ) ? $attributes['tag_mode'] : '';
		$tags = ( isset( $attributes['tags'] ) && $attributes['tags'] ) ? $attributes['tags'] : '';
		$sort_by = ( isset( $attributes['sort_by'] ) && $attributes['sort_by'] ) ? $attributes['sort_by'] : '';
		$partner_supported = ( isset( $attributes['partner_supported'] ) && $attributes['partner_supported'] ) ? $attributes['partner_supported'] : 'supported_platform';
		
		$default_display = ( get_theme_option( 'cas_toplist_default_display' ) ) ? get_theme_option( 'cas_toplist_default_display' ) : 10;
		$display_offset = ( get_theme_option( 'cas_toplist_display_offset' ) ) ? get_theme_option( 'cas_toplist_display_offset' ) : 3;
		if( isset( $attributes['default_display'] ) && $attributes['default_display'] ) {
			$default_display = $attributes['default_display'];
		}
		if( isset( $attributes['display_offset'] ) && $attributes['display_offset'] ) {
			$display_offset = $attributes['display_offset'];
		}

		$asset_category = ( isset( $attributes['asset_category'] ) && $attributes['asset_category'] ) ? $attributes['asset_category'] : 'product_logo_136x136';

		$default_payment_display = ( get_theme_option( 'toplist_default_payment_display' ) ) ? get_theme_option( 'toplist_default_payment_display' ) : 5;
		$default_software_display = ( get_theme_option( 'toplist_default_software_display' ) ) ? get_theme_option( 'toplist_default_software_display' ) : 5;
		
		// Add toplist data as per style
		switch ( $style ) {
			case 'list':
				$sc_str = '[cas-toplist-group id="'.$group_id.'" return="json" ';
				if( $asset_category ) {
					$sc_str .= 'asset-category-name="'.$asset_category.'" ';
				}
				if( $quantity != 0 ) {
					// check qunatity with default display
					$qty = ( $quantity >= (int)$default_display ) ? $default_display : $quantity;
					$sc_str .= 'qty="'.$qty.'" ';
				}elseif( $default_display ) {
					$sc_str .= 'qty="'.$default_display.'" ';
				}
				if( $enable_tags && $tags ) {
					$sc_str .= 'tag="'.$tags.'" ';
					if( $tag_mode && $tag_mode == 'OR' ) {
						$sc_str .= 'tagmode="'.$tag_mode.'" ';
					}
				}
				if( $enable_sort_by && $sort_by ){
					$sc_str .= 'sort_by="'.$sort_by.'" ';
				}
				$sc_str .= ']';
				$toplist_data = do_shortcode($sc_str);
				$toplist_data = json_decode(urldecode($toplist_data), true);

				if( ( $partner_supported == 'supported_payments' || $partner_supported == 'software_providers' ) && $toplist_data ) {
					$newtoplist = array();
					foreach( $toplist_data as $partner ) {
						$partner = (array)$partner;
						if( $partner_supported == 'supported_payments' ) {
							// supported payments 
							$order = '';
							if( get_theme_option( 'order_payment_option' ) != 'ASC' ) {
								$order = "order='".get_theme_option( 'order_payment_option' )."'";
							}
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
						}
						
						if( $partner_supported == 'software_providers' ) {
							// software provider 
							$order = '';
							if( get_theme_option( 'order_software_provider' ) != 'ASC' ) {
								$order = 'order="'.get_theme_option( 'order_software_provider' ).'"';
							}
							global $wcra_asset_sizes;
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
						}
						// filtered data
						unset( $partner['primary_colour'] );
						unset( $partner['secondary_colour'] );
						unset( $partner['online_since'] );
						unset( $partner['supported_language'] );
						//unset( $partner['supported_platform'] );
						unset( $partner['product_licences'] );

						$newtoplist[] = $partner;
					}
					$toplist_data = $newtoplist;
				}
				
				break;

			case 'home_top_3':
				$sc_str = '[cas-toplist-group id="'.$group_id.'" qty="3" return="json" ';
				if( $asset_category ) {
					$sc_str .= 'asset-category-name="'.$asset_category.'" ';
				}
				if( $enable_tags && $tags ) {
					$sc_str .= 'tag="'.$tags.'" ';
					if( $tag_mode && $tag_mode == 'OR' ) {
						$sc_str .= 'tagmode="'.$tag_mode.'" ';
					}
				}
				if( $enable_sort_by && $sort_by ){
					$sc_str .= 'sort_by="'.$sort_by.'" ';
				}
				$sc_str .= ']';
				$toplist_data = do_shortcode($sc_str);
				$toplist_data = json_decode(urldecode($toplist_data), true);
				break;

			case 'single_with_banner':
				$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" procons-visible="1" return="json"]');
				$toplist_data = json_decode(urldecode($toplist_data), true);
				break;
			
			case 'filter_payment_type':
				$payment_method_id = ( isset( $attributes['payment_method_id'] ) ) ? absint( $attributes['payment_method_id'] ) : 0;
				$payment_types = ( isset( $attributes['payment_type'] ) ) ? (array)$attributes['payment_type'] : array();
				$toplist_data = array();
				$has_toplist = false;
				$default_first = false; 
				if( $payment_types ) {
					foreach( $payment_types as $type ) {
						$toplist_data['filters'][$type] = ( isset( $attributes[$type.'_type_label'] ) ) ? $attributes[$type.'_type_label'] : '';
						if( $default_first ) continue;
						if( $type != 'both' ) {
							$sc_str = '[cas-toplist-group id="'.$group_id.'" paymentmethod-id="'.$payment_method_id.'" payment-type="'.$type.'" return="json" ';
						}else {
							$sc_str = '[cas-toplist-group id="'.$group_id.'" paymentmethod-id="'.$payment_method_id.'" return="json" ';
						}
						if( $asset_category ) {
							$sc_str .= 'asset-category-name="'.$asset_category.'" ';
						}
						if( $quantity != 0 ) {
							// check qunatity with default display
							$qty = ( $quantity >= (int)$default_display ) ? $default_display : $quantity;
							$sc_str .= 'qty="'.$qty.'" ';
						} elseif( $default_display ) {
							$sc_str .= 'qty="'.$default_display.'" ';
						}

						if( $enable_tags && $tags ) {
							$sc_str .= 'tag="'.$tags.'" ';
							if( $tag_mode && $tag_mode == 'OR' ) {
								$sc_str .= 'tagmode="'.$tag_mode.'" ';
							}
						}
						if( $enable_sort_by && $sort_by ){
							$sc_str .= 'sort_by="'.$sort_by.'" ';
						}
						$sc_str .= ']';
						$shortcode = do_shortcode($sc_str);
						$toplist = json_decode(urldecode($shortcode), true);

						if( ( $partner_supported == 'supported_payments' || $partner_supported == 'software_providers' ) && $toplist ) {
							$newtoplist = array();
							foreach( $toplist as $partner ) {
								$partner = (array)$partner;
								if( $partner_supported == 'supported_payments' ) {
									// supported payments 
									$order = '';
									if( get_theme_option( 'order_payment_option' ) != 'ASC' ) {
										$order = "order='".get_theme_option( 'order_payment_option' )."'";
									}
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
								}
								
								if( $partner_supported == 'software_providers' ) {
									// software provider 
									$order = '';
									if( get_theme_option( 'order_software_provider' ) != 'ASC' ) {
										$order = 'order="'.get_theme_option( 'order_software_provider' ).'"';
									}
									global $wcra_asset_sizes;
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
								}

								// filtered data
								unset( $partner['primary_colour'] );
								unset( $partner['secondary_colour'] );
								unset( $partner['online_since'] );
								unset( $partner['supported_language'] );
								unset( $partner['supported_platform'] );
								unset( $partner['product_licences'] );
		
								$newtoplist[] = $partner;
							}
							$toplist = $newtoplist;
						}

						// set flag
						if( !$has_toplist && $toplist ) $has_toplist = true;
						$toplist_data['data'][$type] = $toplist;

						$default_first = true;
					}
				}
				// return empty if there is no toplist
				if( !$has_toplist ) $toplist_data = array();

				break;

			case 'gamepage_top_3':
				$sc_str = '[cas-toplist-group id="'.$group_id.'" qty="3" return="json" ';
				if( $asset_category ) {
					$sc_str .= 'asset-category-name="'.$asset_category.'" ';
				}
				if( $enable_tags && $tags ) {
					$sc_str .= 'tag="'.$tags.'" ';
					if( $tag_mode && $tag_mode == 'OR' ) {
						$sc_str .= 'tagmode="'.$tag_mode.'" ';
					}
				}
				if( $enable_sort_by && $sort_by ){
					$sc_str .= 'sort_by="'.$sort_by.'" ';
				}
				$sc_str .= ']';
				$toplist_data = do_shortcode($sc_str);
				$toplist_data = json_decode(urldecode($toplist_data), true);
				break;

			case 'filter_by_software_provider':
				$software_provider_id = ( isset( $attributes['software_provider_id'] ) ) ? absint( $attributes['software_provider_id'] ) : 0;
				$sc_str = '[cas-toplist-group id="'.$group_id.'" softwareprovider-id="'.$software_provider_id.'" return="json" ';
				if( $asset_category ) {
					$sc_str .= 'asset-category-name="'.$asset_category.'" ';
				}
				if( $quantity != 0 ) {
					// check qunatity with default display
					$qty = ( $quantity >= (int)$default_display ) ? $default_display : $quantity;
					$sc_str .= 'qty="'.$qty.'" ';
				}elseif( $default_display ) {
					$sc_str .= 'qty="'.$default_display.'" ';
				}
				if( $enable_tags && $tags ) {
					$sc_str .= 'tag="'.$tags.'" ';
					if( $tag_mode && $tag_mode == 'OR' ) {
						$sc_str .= 'tagmode="'.$tag_mode.'" ';
					}
				}
				if( $enable_sort_by && $sort_by ){
					$sc_str .= 'sort_by="'.$sort_by.'" ';
				}
				$sc_str .= ']';
				$toplist_data = do_shortcode($sc_str);
				$toplist_data = json_decode(urldecode($toplist_data), true);
				$software_toplist_data = array();
				$software_toplist_data['products'] = $toplist_data;
				if( ( $partner_supported == 'supported_payments' || $partner_supported == 'software_providers' ) && $toplist_data ) {
					$newtoplist = array();
					foreach( $toplist_data as $partner ) {
						$partner = (array)$partner;
						if( $partner_supported == 'supported_payments' ) {
							// supported payments 
							$order = '';
							if( get_theme_option( 'order_payment_option' ) != 'ASC' ) {
								$order = "order='".get_theme_option( 'order_payment_option' )."'";
							}
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
						}
						
						if( $partner_supported == 'software_providers' ) {
							// software provider 
							$order = '';
							if( get_theme_option( 'order_software_provider' ) != 'ASC' ) {
								$order = 'order="'.get_theme_option( 'order_software_provider' ).'"';
							}
							global $wcra_asset_sizes;
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
						}

						// filtered data
						unset( $partner['primary_colour'] );
						unset( $partner['secondary_colour'] );
						unset( $partner['online_since'] );
						unset( $partner['supported_language'] );
						unset( $partner['supported_platform'] );
						unset( $partner['product_licences'] );
						
						$newtoplist[] = $partner;
					}
					$software_toplist_data['products'] = $newtoplist;
				}

				$toplist_data = $software_toplist_data;
				break;

				// $sc_str = '[cas-software-provider-by-group-id id="'.$group_id.'" swid="'.$software_provider_id.'" return="json"]';
				// $software_provider_data = do_shortcode($sc_str);
				// $software_provider_data = json_decode(urldecode($software_provider_data), true);
				// $software_provider_data = isset( $software_provider_data[0] ) ? $software_provider_data[0] : array();
				// $software_provider_data = (array)$software_provider_data;
				// $newtoplist = array();
				// if( $software_provider_data ) {
				// 	$qty = (int)$default_display;
				// 	if( $quantity != 0 ) {
				// 		// check qunatity with default display
				// 		$qty = ( $quantity >= (int)$default_display ) ? (int)$default_display : $quantity;
				// 	}

				// 	//$software_provider_defaultdata = array_slice( $software_provider_data['products'], 0, $qty );
				// 	foreach( $software_provider_data['products'] as $partner_id => $partner ) {
				// 		$partner_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" asset-category-name="'.$asset_category.'" return="json"]');
				// 		$partner_data = json_decode(urldecode($partner_data), true);
				// 		$partner_data = isset( $partner_data[0] ) ? $partner_data[0] : array();

				// 		if( $partner_supported == 'supported_payments' ) {
				// 			// supported payments 
				// 			$supported_payments = do_shortcode("[cas-payment-options pid='".$partner_id."' return='json']");
				// 			$supported_payments = json_decode(urldecode($supported_payments), true);
				// 			$partner_data['supported_payments_total'] = count( $supported_payments );
				// 			$supported_payments = ( $partner_data['supported_payments_total'] > $default_payment_display ) ? array_slice( $supported_payments, 0, $default_payment_display ) : $supported_payments;
				// 			$partner_supported_payments = array();
				// 			if( $supported_payments ) {
				// 				foreach ( $supported_payments as $key => $payment ) {
				// 					$payment = (array)$payment;
				// 					$partner_supported_payments[$key]['product_id'] = $payment['product_id'];
				// 					$partner_supported_payments[$key]['po_id'] = $payment['po_id'];
				// 					$partner_supported_payments[$key]['url'] = $payment['url'];
				// 					$partner_supported_payments[$key]['name'] = $payment['name'];
				// 					$partner_supported_payments[$key]['link'] = $payment['link'];
				// 				}
				// 			}
				// 			$partner_data['supported_payments'] = $partner_supported_payments;
				// 		}

				// 		if( $partner_supported == 'software_providers' ) {
				// 			// software provider 
				// 			global $wcra_asset_sizes;
				// 			$soft_asset_sizes = isset( $wcra_asset_sizes['soft_asset_sizes']['medium'] ) ? $wcra_asset_sizes['soft_asset_sizes']['medium'] : 'software_logo_105x105';
				// 			$soft_provider_data = do_shortcode('[cas-software-provider asset-category-name="'.$soft_asset_sizes.'" pid="'.$partner_id.'" return="json"]');
				// 			$soft_provider_data = json_decode(urldecode($soft_provider_data), true);
				// 			$partner_data['software_providers_total'] = count( $soft_provider_data );
				// 			$software_providers = ( $partner_data['software_providers_total'] > $default_software_display ) ? array_slice( $soft_provider_data, 0, $default_software_display ) : $soft_provider_data;
				// 			$partner_software_providers = array();
				// 			if( $software_providers ) {
				// 				foreach ( $software_providers as $key => $software ) {
				// 					$software = (array)$software;
				// 					$partner_software_providers[$key]['product_id'] = $software['product_id'];
				// 					$partner_software_providers[$key]['software_id'] = $software['software_id'];
				// 					$partner_software_providers[$key]['url'] = $software['url'];
				// 					$partner_software_providers[$key]['name'] = $software['name'];
				// 					//$partner_software_providers[$key]['link'] = $software['link'];
				// 				}
				// 			}
				// 			$partner_data['software_providers'] = $partner_software_providers;
				// 		}

				// 		$newtoplist[] = $partner_data;
				// 	}
				// 	$newtoplist = array_slice( $newtoplist, 0, $qty );
				// }
				// $software_provider_data['products'] = $newtoplist;
				// $toplist_data = $software_provider_data;
				// break;

			default:
				# code...
				break;
		}
		
		return $toplist_data;
	}
}
