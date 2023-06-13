<?php
/**
 * AuthorBlock block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * AuthorBlock class.
 */
class AuthorBlock extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'author-block';

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
				'post__in'    		=> $this->get_schema_string(),
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
		
		$authors = ( isset( $attributes['authors'] ) && $attributes['authors'] ) ? json_decode( $attributes['authors'] ) : array();
		$style = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'big';
		
		$filtered_data = array();
		$filtered_data['style'] = $style;
		
		$authors_ids = array();
		if( $authors ) {
			$authors_ids = wp_list_pluck( $authors, 'value' );
		}
		
		if( $authors_ids ) {
			$authors_data = array();
			foreach ( $authors_ids as $user_ID ) {
				$author = get_user_by( 'id', $user_ID );
				if( $author ) {
					$social_links = array();
					$user_contact_mthds = $this->wpvue_get_user_contact_methods( $author );
					foreach ( $user_contact_mthds as $key => $method ) {
						if( get_user_meta( $author->ID, $method, true ) )
							$social_links[$method] = get_user_meta( $author->ID, $method, true );
					}
					$authors_data[] = array(
						'ID'			=> $author->ID,
						'first_name'	=> $author->first_name,
						'last_name'		=> $author->last_name,
						'display_name'	=> $author->display_name,
						'user_email'	=> $author->user_email,
						'user_avatar_url' => get_avatar_url( $author->ID, array( 'size' => '270') ),
						'role_title'	=> get_user_meta( $author->ID, 'user_role_title', true ),
						'description'	=> wpvue_tag_compiler( do_shortcode( get_user_meta( $author->ID, 'description', true ) ), $partner_id ),
						'social_links'  => $social_links,
					);
				}
			}
			$filtered_data['data'] = $authors_data;
		}
		
		return $filtered_data;
	}

	public function wpvue_get_user_contact_methods() {
		return array(
			'facebook', 
			'instagram', 
			'linkedin', 
			'myspace', 
			'pinterest', 
			'soundcloud', 
			'tumblr', 
			'twitter', 
			'youtube', 
			'wikipedia'
		);
	}
}
