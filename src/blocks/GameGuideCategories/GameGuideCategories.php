<?php
/**
 * GameGuideCategories block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * GameGuideCategories class.
 */
class GameGuideCategories extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'game-guide-categories';

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
				'style'    			=> $this->get_schema_string('list'),
				'enable_search'    	=> $this->get_schema_boolean(),
				'block_title'    	=> $this->get_schema_string(),
				'no_of_posts'    	=> $this->get_schema_string(),
				'game_type'    		=> $this->get_schema_string(),
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
		$style = ( isset( $attributes['style'] ) && $attributes['style'] ) ? $attributes['style'] : 'list';
		$game_type = ( isset( $attributes['game_type'] ) && $attributes['game_type'] ) ? $attributes['game_type'] : '';
		$args = array(
			'number' => ( isset( $attributes['no_of_posts'] ) && $attributes['no_of_posts'] ) ? absint( $attributes['no_of_posts'] ) : '',
			'hide_empty' => false,
		);
		if( $game_type ) {
			$args['meta_key'] = 'game_category_type';
			$args['meta_value'] = $game_type;
		}

		if( $style === 'vertical' ) {
			$args['meta_key'] = 'vertical_style';
			$args['meta_value'] = 'yes';
		}
		
		$games_terms = get_terms( 'game_cat', $args );
		$filteredData = array();
		if( $games_terms ) {
			foreach( $games_terms as $key => $term ) {
				$game = get_field('select_game',$term);
				$goto = array();
				if( $game ) {
					$goto['post_name']= $game->post_name;
					$goto['post_type'] = $game->post_type;
					$goto['type'] = (get_field('slug', $game->ID )) ? get_field('slug', $game->ID ) : '';
				}
				$term->goto = $goto;

				$term->thumbnail = get_field('thumbnail',$term);
				$term->hover_thumbnail = get_field('hover_thumbnail',$term);
				$term->watermark_image = get_field('watermark_image',$term);
				$term->game_category_id = get_field('game_category_id',$term);
				$filteredData[] = $term;
			}
		}
		if( $style === 'vertical' ) {
			$filteredData[] = wcra_find_your_guide_options();
		}
		return $filteredData;
	}
}
