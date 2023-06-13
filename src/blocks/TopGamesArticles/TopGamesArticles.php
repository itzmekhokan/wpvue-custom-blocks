<?php
/**
 * TopGamesArticles block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * TopGamesArticles class.
 */
class TopGamesArticles extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'top-games-articles';

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
		
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		$style = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'list';
		$disable_author = ( isset( $attributes['disable_author'] ) && $attributes['disable_author'] ) ? true : false;
		$enable_review_post_in = ( isset( $attributes['enable_review_post_in'] ) && $attributes['enable_review_post_in'] ) ? true : false;
		$post_types = array( 'post', 'page', 'game_paid', 'news' );
		if( $enable_review_post_in ) {
			$post_types[] = 'review';
		}
		$args = array(
			'numberposts' => -1,
			'post_type'   => $post_types,
		);

		if( $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['orderby'] = 'post__in';
		}
		$games_posts = get_posts( $args );
		$filteredData = array();
		if( !$post_in_data ) return array();
		if( $games_posts ) {
			foreach( $games_posts as $key => $post ) {
				//$game = (array)$post;
				$game = array();
				$game['title'] = do_shortcode( $post->post_title );
				$game['post_title'] = do_shortcode( $post->post_title );
				$game['slug'] = $post->post_name;
				$game['type'] = $post->post_type;
				$game['short_descrp'] = do_shortcode( $post->post_excerpt );
				$game['image'] = ( wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) ) ? wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' ) : '';
				if( $style == 'card' && ! $disable_author ) {
					$author = get_user_by( 'id', $post->post_author );
					if( $author ) {
						$game['author'] = array(
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
					$game['est_minutes_read'] = $est . " " . trim( wpvue_get_transalated_strings( 'minutes_read' ) );
				
				}

				$filteredData[] = $game;
			}
		}
		return $filteredData;
		//return $games_posts;
	}
}
