<?php
/**
 * NewsBlock block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * NewsBlock class.
 */
class NewsBlock extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'news-block';

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
		
		$post_id = isset( $attributes['post_id'] ) ? $attributes['post_id'] : 0;
		$enable_selected_posts = isset( $attributes['enable_selected_posts'] ) ? $attributes['enable_selected_posts'] : false;
		$post_in_data = ( isset( $attributes['post__in'] ) && $attributes['post__in'] ) ? json_decode( $attributes['post__in'] ) : array();
		//$posts_per_page = ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : 7;
		$news_cat_id = ( isset( $attributes['news_cat_id'] ) && $attributes['news_cat_id'] ) ? absint( $attributes['news_cat_id'] ) : '';
		$posts_per_page = 7; // as per figma design static
		$args = array(
			'numberposts' => -1,
			'post_type'   => 'news',
			'post_status'    => 'publish',
		);
		
		if( $enable_selected_posts && $post_in_data ) {
			$args['include'] = wp_list_pluck( $post_in_data, 'value' );
			$args['numberposts'] = -1;
			$args['orderby'] = 'post__in';
		}

		if( isset( $post_id ) ) {
			$args['exclude'] = array( absint( $attributes['post_id'] ) );
		}

		if( $news_cat_id ) {
			$args['tax_query'] = array(
                array(
                    'taxonomy' => 'news_cat',
                    'field'    => 'term_id',
                    'terms'    => $news_cat_id,
                ),
            );
		}
		
		$news_posts = get_posts( $args );
		$filteredData = array();
		$filteredData['total_posts'] = count( $news_posts );
		$filteredData['per_page'] = $posts_per_page;
		$filteredData['current_page'] = 1;
		// news categories
		$news_cats = array();
		if( !$news_cat_id ) {
			$newsterms = get_terms( array(
				'taxonomy' => 'news_cat',
				'hide_empty' => false,
			) );
			
			if( $newsterms ) {
				foreach( $newsterms as $term ) {
					$news_cats[] = array(
						'term_id' 		=> $term->term_id,
						'name'			=> $term->name,
						'order' 		=> get_term_meta( $term->term_id, '_term_order', true ),
						'label_color'	=> get_term_meta( $term->term_id, '_label_color', true ),
					);
				}
			}
			usort($news_cats, function($a, $b) {
				return $a['order'] <=> $b['order'];
			});
		}
		$filteredData['news_cat_id'] = $news_cat_id;
		$filteredData['news_categories'] = $news_cats;
		$news_data = array();
		if( $news_posts ) {
			foreach( $news_posts as $key => $post ) {
				//$article = (array)$post;
				$news = array();
				$news['title'] = do_shortcode( $post->post_title );
				$news['slug'] = $post->post_name;
				$news['type'] = $post->post_type;
				$news['short_descrp'] = do_shortcode( $post->post_excerpt );
				$news['image'] = wp_get_attachment_url( get_post_thumbnail_id( $post ) , 'full' );
				$news['publish_date'] = date_i18n( 'd/m/Y', strtotime( $post->post_date ) );
				$terms = get_the_terms( $post->ID , 'news_cat' );
				$news['category'] = ( $terms && isset( $terms[0]->name ) ) ? $terms[0]->name : '';
				$content 	= do_blocks( $post->post_content );
				$word = str_word_count( strip_tags( $content ) );
				$m = floor( $word / 200);
				if( $m < 1 ) {
					$m = 1;
				}
				$est = $m;
				$news['est_minutes_read'] = $est . " " . trim( wpvue_get_transalated_strings( 'minutes_read' ) );
			
				$news_data[] = $news;
				if ( count( $news_data ) >= ( $posts_per_page * 2 ) ) break;
			}
		}
		// data news with 2 pagination together
		$filteredData['news'] = $news_data;
		
		return $filteredData;

	}
}
