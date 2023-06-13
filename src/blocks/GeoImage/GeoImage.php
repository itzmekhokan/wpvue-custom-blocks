<?php
/**
 * GeoImage block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * GeoImage class.
 */
class GeoImage extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'geo-image';

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
		$image_url = ( isset( $attributes['image'] ) && $attributes['image'] ) ? $attributes['image'] : '';
		$img_id = attachment_url_to_postid( $image_url );
		$image_src      = wp_get_attachment_image_src( $img_id, 'full' );
		$image_url_link = isset( $image_src[0] ) ? $image_src[0] : ''; // Gives you image url.
		$image_width    = isset( $image_src[1] ) ? $image_src[1] : ''; // Gives you image width.
		$image_height   = isset( $image_src[2] ) ? $image_src[2] : ''; // Gives you image height.

		$filtered_content = array(
			'img_url' => $image_url,
			'img_width' => $image_width,
			'img_height' => $image_height,
			'img_alt' => basename ( get_attached_file( $img_id ) )
		);

		if( isset( $attributes['info'] ) && $attributes['info'] ) {
			$country_state = get_wpvue_current_country_state();
			foreach( $attributes['info'] as $info ) {
				if( $info['image'] ) {
					$cs_arr = explode( '-', $info['country_code'] );

					if( count( $cs_arr ) > 1 ) {
						$country = $cs_arr[0];
						$states = explode( ',', $cs_arr[1] );
						if( $states ) {
							if( $country == $country_state['country'] && in_array( $country_state['state'], $states ) ) {
								$filtered_content['img_url'] = $info['image'];
								$img_id = attachment_url_to_postid( $info['image'] );
								$image_src      = wp_get_attachment_image_src( $img_id, 'full' );
								$image_url_link = isset( $image_src[0] ) ? $image_src[0] : ''; // Gives you image url.
								$filtered_content['img_width'] = isset( $image_src[1] ) ? $image_src[1] : ''; // Gives you image width.
								$filtered_content['img_height'] = isset( $image_src[2] ) ? $image_src[2] : ''; // Gives you image height.
								$filtered_content['img_alt'] = basename ( get_attached_file( $img_id ) );
								break;
							}
						}else{
							if( $country == $country_state['country'] ) {
								$filtered_content['img_url'] = $info['image'];
								$img_id = attachment_url_to_postid( $info['image'] );
								$image_src      = wp_get_attachment_image_src( $img_id, 'full' );
								$image_url_link = isset( $image_src[0] ) ? $image_src[0] : ''; // Gives you image url.
								$filtered_content['img_width'] = isset( $image_src[1] ) ? $image_src[1] : ''; // Gives you image width.
								$filtered_content['img_height'] = isset( $image_src[2] ) ? $image_src[2] : ''; // Gives you image height.
								$filtered_content['img_alt'] = basename ( get_attached_file( $img_id ) );
								break;
							}
						}
					}else{
						if( $info['country_code'] == $country_state['country'] ) {
							$filtered_content['img_url'] = $info['image'];
							$img_id = attachment_url_to_postid( $info['image'] );
							$image_src      = wp_get_attachment_image_src( $img_id, 'full' );
							$image_url_link = isset( $image_src[0] ) ? $image_src[0] : ''; // Gives you image url.
							$filtered_content['img_width'] = isset( $image_src[1] ) ? $image_src[1] : ''; // Gives you image width.
							$filtered_content['img_height'] = isset( $image_src[2] ) ? $image_src[2] : ''; // Gives you image height.
							$filtered_content['img_alt'] = basename ( get_attached_file( $img_id ) );
							break;
						}
					}
				}
			}
		}
		return $filtered_content;
	}
}