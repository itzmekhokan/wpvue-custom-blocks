<?php
/**
 * ReviewDetails block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * ReviewDetails class.
 */
class ReviewDetails extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'review-details';

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
				'partner_id'    	=> $this->get_schema_string(),
				'is_exclusive'    	=> $this->get_schema_boolean(),
				'is_approved'    	=> $this->get_schema_boolean(),
				'approved_by_expert'=> $this->get_schema_string(),
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
		$group_id = ( $attributes['group_id'] ) ? absint( $attributes['group_id'] ) : 0;
		$partner_id = ( $attributes['partner_id'] ) ? absint( $attributes['partner_id'] ) : 0;
		
		$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" pid="'.$partner_id.'" procons-visible="1" return="json"]');
		$toplist_data = json_decode(urldecode($toplist_data), true)[0];

		// Product Information
		$product_info = do_shortcode("[cas-product-details pid='".$partner_id."' review='return' return='json']");
		$toplist_data['product_information'] = json_decode(urldecode($product_info), true);

		// supported payments 
		$supported_payments = do_shortcode("[cas-payment-options pid='".$partner_id."' return='json']");
		$toplist_data['supported_payments'] = json_decode(urldecode($supported_payments), true);

		// software provider 
		$software_provider_data = do_shortcode('[cas-software-provider pid="'.$partner_id.'" return="json"]');
		$toplist_data['software_provider'] = json_decode(urldecode($software_provider_data), true);

		// product licences 
		$product_licence_data = do_shortcode('[cas-product-licences pid="'.$partner_id.'" return="json"]');
		$toplist_data['product_licences'] = json_decode(urldecode($product_licence_data), true);

		// similar casinos
		$similar_casinos_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" return="json"]');
		$similar_casinos_data = json_decode(urldecode($similar_casinos_data), true);
		$similar_casinos_data_slice = ( count( $similar_casinos_data ) >= 4 ) ? array_slice( $similar_casinos_data, 0, 4 ) : $similar_casinos_data;
		$product_ids = wp_list_pluck( $similar_casinos_data_slice, 'product_id' );
		$similar_casinos = array();
		if( !in_array( $partner_id, $product_ids ) ) {
			$similar_casinos = $similar_casinos_data_slice;
		}else{
			$index = array_search( $partner_id, $product_ids );
			if( count( $similar_casinos_data ) > 4 ) {
				$next_partner = array_slice( $similar_casinos_data, 4, 1 );
				$similar_casinos_data_slice[$index] = $next_partner[0];
			}else{
				unset($similar_casinos_data_slice[$index]);
			}
			
			$similar_casinos = $similar_casinos_data_slice;
		}
		$toplist_data['similar_casinos'] = array();
		if( $similar_casinos ) {
			foreach( $similar_casinos as $casino ) {
				$casinoData = $casino;
				// supported payments 
				if( isset( $casino['product_id'] ) ) {
					$supported_payments = do_shortcode("[cas-payment-options pid='".$casino['product_id']."' return='json']");
					$casinoData['supported_payments'] = json_decode(urldecode($supported_payments), true);
				}
				$toplist_data['similar_casinos'][] = $casinoData;
			}
		}
		return $toplist_data;
	}
}
