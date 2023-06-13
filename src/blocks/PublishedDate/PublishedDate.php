<?php
/**
 * PublishedDate block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * PublishedDate class.
 */
class PublishedDate extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'published-date';

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
				'post_id'			=> $this->get_schema_number(),
				'block_title'    	=> $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'article_cat_id'    => $this->get_schema_string(),
				'enable_selected_posts' => $this->get_schema_boolean( false ),
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
	 * @return array filteredData block type output.
	 */
	public function render_filtered_content( $content, $block ) {
		if( $block['blockName'] !== $this->namespace . '/' . $this->block_name ) return $content;
		
		$attributes = $block['attrs'];
		
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$post_date_type = ( isset( $attributes['post_date_type'] ) && $attributes['post_date_type'] ) ? $attributes['post_date_type'] : 'published';
		
		$filteredData = array();
		
		if( $post_id ) {
			$post = get_post( $post_id );
			if( $post ) {
				if( $post_date_type == 'published' ) {
					$filteredData['publish_date'] = date_i18n( 'j-F-Y', strtotime( $post->post_date ) );
				} else {
					$filteredData['publish_date'] = date_i18n( 'j-F-Y', strtotime( $post->post_modified ) );
				}
				
				$content 	= do_blocks( $post->post_content );
				$word = str_word_count( strip_tags( $content ) );
				$m = floor( $word / 200);
				if( $m < 1 ) {
					$m = 1;
				}
				$est = $m;
				$filteredData['est_minutes_read'] = $est . " " . trim( wpvue_get_transalated_strings( 'minutes_read' ) );
			}
		}
		
		return $filteredData;

	}
}
