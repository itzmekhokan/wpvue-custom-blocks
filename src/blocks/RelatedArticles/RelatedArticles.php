<?php
/**
 * RelatedArticles block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * RelatedArticles class.
 */
class RelatedArticles extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'related-articles';

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
	 * @return array FilteredContent block type output.
	 */
	public function render_filtered_content( $content, $block ) {
		if( $block['blockName'] !== $this->namespace . '/' . $this->block_name ) return $content;
		
		$attributes = $block['attrs'];
		$enable_selected_posts = isset( $attributes['enable_selected_posts'] ) ? $attributes['enable_selected_posts'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$args = array(
			'numberposts' => ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : -1,
			'post_type'   => 'post',
			'post_status'    => 'publish',
		);
		
		if( $enable_selected_posts && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}

		if( isset( $attributes['post_id'] ) ) {
			$args['exclude'] = array( absint( $attributes['post_id'] ) );
		}
		if( isset( $attributes['article_cat_id'] ) && $attributes['article_cat_id'] ) {
			$args['category'] = absint( $attributes['article_cat_id'] );
		}
		
		$article_posts = get_posts( $args );
		$filteredData = array();
		if( $article_posts ) {
			foreach( $article_posts as $key => $post ) {
				//$article = (array)$post;
				$article = array();
				$article['title'] = do_shortcode( $post->post_title );
				$article['post_title'] = do_shortcode( $post->post_title );
				$article['slug'] = $post->post_name;
				$article['type'] = $post->post_type;
				$article['short_descrp'] = do_shortcode( $post->post_excerpt );
				$article['image'] = wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' );

				$author = get_user_by( 'id', $post->post_author );
				if( $author ) {
					$article['author'] = array(
						'ID'			=> $author->ID,
						'first_name'	=> $author->first_name,
						'last_name'		=> $author->last_name,
						'display_name'	=> $author->display_name,
						'user_email'	=> $author->user_email,
						'user_avatar_url'	=> get_avatar_url( $author->ID, array( 'size' => '270') ),
						'role_title'	=> get_user_meta( $author->ID, 'user_role_title', true ),
					);
				}
				
				$content 	= do_blocks( $post->post_content );
				$word = str_word_count( strip_tags( $content ) );
				$m = floor( $word / 200);
				if( $m < 1 ) {
					$m = 1;
				}
				$est = $m;
				$article['est_minutes_read'] = $est . " " . trim( wpvue_get_transalated_strings( 'minutes_read' ) );

				$filteredData[] = $article;
			}
		}
		
		return $filteredData;

	}
}
