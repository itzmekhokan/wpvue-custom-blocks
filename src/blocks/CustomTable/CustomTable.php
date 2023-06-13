<?php
/**
 * CustomTable block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * CustomTable class.
 */
class CustomTable extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'custom-table';

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
		$table_data = ( isset( $attributes['table_data'] ) && $attributes['table_data'] ) ? $attributes['table_data'] : array();
		$table_header = ( isset( $attributes['table_header'] ) && $attributes['table_header'] ) ? $attributes['table_header'] : array();
		$enable_table_header = ( isset( $attributes['enable_table_header'] ) && $attributes['enable_table_header'] ) ? true : false;
		$enable_header_merge = ( isset( $attributes['enable_header_merge'] ) && $attributes['enable_header_merge'] ) ? true : false;
		$rows = ( isset( $attributes['rows'] ) && $attributes['rows'] ) ? $attributes['rows'] : '';
		$columns = ( isset( $attributes['columns'] ) && $attributes['columns'] ) ? $attributes['columns'] : '';
		$enable_link = ( isset( $attributes['enable_link'] ) && $attributes['enable_link'] ) ? true : false;
		$label_link = ( isset( $attributes['label_link'] ) && $attributes['label_link'] ) ? $attributes['label_link'] : '';
		$link_url = ( isset( $attributes['link_url'] ) && $attributes['link_url'] ) ? $attributes['link_url'] : '';
		$table_header_bg = ( isset( $attributes['header_color'] ) && $attributes['header_color'] ) ? $attributes['header_color'] : '#e6e8ea';
		$display_rows = ( isset( $attributes['display_rows'] ) && $attributes['display_rows'] ) ? $attributes['display_rows'] : 0;

		$showmorecls = ( $display_rows % 2 == 0 ) ? 'odd' : 'even';
		$showlesscls = ( $rows % 2 == 0 ) ? 'odd' : 'even';

		if( $table_data && $rows && $columns ) {
			// scroller
			$table_html = '<div class="arrow-cls">
			<a class="left-arrow-cls" id="left-arrow-cls">
			<img src="'.WPVCB_PLUGIN_URL . 'assets/images/sml-arrow-bl.svg'.'" alt="small arrow" />
			</a>
			<a class="right-arrow-cls" id="right-arrow-cls">
			<img src="'.WPVCB_PLUGIN_URL . 'assets/images/sml-arrow-bl.svg'.'" alt="small arrow" /></a></div>';

			$table_remove_border_class = '';
			if( $display_rows && $display_rows < count( $table_data ) ) {
				$table_remove_border_class = '';
			} else {
				$table_remove_border_class = 'remove-border';
			}
			// $table_html .= '<figure class="wp-block-table wpvcb-custom-table-block">';
			$table_html .= '<figure class="wp-block-table generic-comparision-table wpvcb-cust-tbl-block '.$table_remove_border_class.'">';

			$table_html .= '<table id="cust-tbl">';
			if( $enable_table_header && $table_header ) {
				$table_html .= '<thead><tr>';
				$colspan = '';
				if( $enable_header_merge ) {
					$colspan = 'colspan="'.(int)$columns.'"';
				}
				if( $enable_header_merge )
					// for task #1259968033
					$table_html .= '<th '.$colspan.' style="width:'.(145 + (115 * ((int)$columns - 1))).'px">';
					//$table_html .= '<th '.$colspan.'>';
				foreach( $table_header as $header ) {
					if( !$enable_header_merge )
						$table_html .= '<th>';
					$table_html .= wpvue_tag_compiler( do_shortcode($header['text']), $partner_id );
					if( !$enable_header_merge )
						$table_html .= '</th>';
					if( $enable_header_merge && $header['text'] ) break;
				}
				if( $enable_header_merge )
					$table_html .= '</th>';
				$table_html .= '</tr></thead>';
			}
			if( $table_data ) {
				$table_html .= '<tbody>';
				foreach ( $table_data as $key => $data ) {
					$colspan = '';
					if( $data['merge_cell'] ) {
						$colspan = 'colspan="'.(int)$columns.'"';
					}
					$tr_cls = 'show-tbl-cls';
					if( $display_rows && $display_rows < count( $table_data ) ) {
						$tr_cls = ( ( $key + 1 ) <= $display_rows ) ? 'show-tbl-cls' : 'hide-tbl-cls';
					}

					if( $data['columns_data'] ) {
						$table_html .= '<tr class="'.$tr_cls.'">';
						if( $data['merge_cell'] )
							$table_html .= '<td '.$colspan.' style="width:'.(145 + (115 * ((int)$columns - 1))).'px"><div class="tbl-clm-wrap">';
						foreach ( $data['columns_data'] as $colkey => $coldata ) {
							$alignment = isset( $coldata['align'] ) ? $coldata['align'] : 'left';
							if( !$data['merge_cell'] )
								$table_html .= '<td '.$colspan.' style="text-align: '.$alignment.';"><div class="tbl-clm-wrap">';
							// check text ith image
							if( isset( $coldata['enable_text_image'] ) && $coldata['enable_text_image'] ) {
								if( $coldata['image'] ) {
									$image_id = attachment_url_to_postid( $coldata['image'] );
									$img_atts = wp_get_attachment_image_src( $image_id, 'full' );
									$width = isset( $img_atts[1] ) ? 'width="'.$img_atts[1].'"' : '';
									if( isset( $img_atts[1] ) && $img_atts[1] > 200 ){
										$width = 'width="200"';
									}
									// svg check
									if( isset( $img_atts[1] ) && $img_atts[1] == 0 ){
										$width = 'width="200"';
									}
									$height = isset( $img_atts[2] ) ? 'height="'.$img_atts[2].'"' : '';
									// svg check
									if( isset( $img_atts[2] ) && $img_atts[2] == 0 ){
										$height = 'height="100"';
									}

									$image_parts = pathinfo( $coldata['image'] );
									$alt = '';
									if( $image_parts['basename'] ) {
										$img_arr = explode( '.', $image_parts['basename'] );
										if( isset( $img_arr[0] ) ) {
											$alt = $img_arr[0];
										}
									}
									$table_html .= '<img src="'.$coldata['image'].'" '.$width.' '.$height.'  alt="'.$alt.'" />';
								}
								if( $coldata['text'] ) {
									$table_html .= '<span class="tbl-clm-text">'. wpvue_tag_compiler( do_shortcode( $coldata['text'] ), $partner_id ) . '</span>';
								}
							}else if( isset( $coldata['enable_text_icon'] ) && $coldata['enable_text_icon'] ){
								$table_html .= '<p class="txt-icon">';
								$icon_style = isset( $coldata['icon_style'] ) ? $coldata['icon_style'] : 'blue_tick';
								if( $icon_style ) {
									$number = ( strpos( $icon_style, '_number' ) !== false ) ? 1 : '';
									$table_html .= '<i class="cust-tbl-icon icon-'.$icon_style.'">'.$number.'</i>';
								}
								if( $coldata['text'] ) {
									$table_html .= $this->reverse_wpautop( wpvue_tag_compiler( do_shortcode( $coldata['text'] ), $partner_id ) );
								}
								$table_html .= '</p>';
							// }else if( isset( $coldata['enable_link'] ) && $coldata['enable_link'] ){
							// 	if( $coldata['link_text'] ) {
							// 		$table_html .= '<a href="'.$coldata['link_url'].'" title="'.wpvue_tag_compiler( do_shortcode( $coldata['link_text'] ), $partner_id ) .'">'.wpvue_tag_compiler( do_shortcode( $coldata['link_text'] ), $partner_id ).'</a>';
							// 	}
							}else{
								// else default cases
								if( $coldata['enable_text'] ) {
									$table_html .= '<span class="txt-only">'. wpvue_tag_compiler( do_shortcode( $coldata['text'] ), $partner_id ) . '</span>';
								}
								if( $coldata['enable_image'] ) {
									$image_id = attachment_url_to_postid( $coldata['image'] );
									$img_atts = wp_get_attachment_image_src( $image_id, 'full' );
									$width = isset( $img_atts[1] ) ? 'width="'.$img_atts[1].'"' : '';
									if( isset( $img_atts[1] ) && $img_atts[1] > 200 ){
										$width = 'width="200"';
									}
									// svg check
									if( isset( $img_atts[1] ) && $img_atts[1] == 0 ){
										$width = 'width="200"';
									}
									$height = isset( $img_atts[2] ) ? 'height="'.$img_atts[2].'"' : '';
									// svg check
									if( isset( $img_atts[2] ) && $img_atts[2] == 0 ){
										$height = 'height="100"';
									}

									$image_parts = pathinfo( $coldata['image'] );
									$alt = '';
									if( $image_parts['basename'] ) {
										$img_arr = explode( '.', $image_parts['basename'] );
										if( isset( $img_arr[0] ) ) {
											$alt = $img_arr[0];
										}
									}
									$table_html .= '<img src="'.$coldata['image'].'" '.$width.' '.$height.'  alt="'.$alt.'" />';
								}
							}

							if( !$data['merge_cell'] )
								$table_html .= '</div></td>';
						}
						if( $data['merge_cell'] )
							$table_html .= '</div></td>';
						$table_html .= '</tr>';
					}
				}
				// Add show more tr
				if( $display_rows && $display_rows < count( $table_data ) ) {
					$table_html .= '<tr class="show-more-wrap '.$showmorecls.'"><td colspan="'.(int)$columns.'">';
					$table_html .= '<a class="show-more">'.trim( wpvue_get_transalated_strings( 'show_more' ) ).' <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http: //www.w3.org/2000/svg"><path d="M6.50011 7.47692L8.43857 5.53846L12.0386 1.93846L10.1001 0L6.50011 3.6L2.90011 0L0.9617 1.93846L4.56165 5.53846L6.50011 7.47692Z" fill="#373A3C"/></svg></a>';
					$table_html .= '</td></tr>';
					$table_html .= '<tr class="show-less-wrap '.$showlesscls.'"><td colspan="'.(int)$columns.'">';
					$table_html .= '<a class="show-less">'.trim( wpvue_get_transalated_strings( 'show_less' ) ).' <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http: //www.w3.org/2000/svg"><path d="M6.50011 7.47692L8.43857 5.53846L12.0386 1.93846L10.1001 0L6.50011 3.6L2.90011 0L0.9617 1.93846L4.56165 5.53846L6.50011 7.47692Z" fill="#373A3C"/></svg></a>';
					$table_html .= '</td></tr>';
				}
				$table_html .= '</tbody>';
			}
			$table_html .= '</table>';
			// links
			if( $enable_link ) {
				if( $link_url && $label_link ) {
					$table_html .= '<a class="wpvcb-table-page-link" href="'.$link_url.'">'.$label_link.' <img src="'.WPVCB_PLUGIN_URL . 'assets/images/sml-arrow-bl.svg'.'" alt="Small Arrow" class="sm-img"/></a>';
				}
			}
			$table_html .= '</figure>';
			if( $display_rows && $display_rows < count( $table_data ) ) {
				$table_html .= '<div class="mobile-show-hide-btn"><div class="show-more-wrap-mobile '.$showmorecls.'"><a>'.trim( wpvue_get_transalated_strings( 'show_more' ) ). '<svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http: //www.w3.org/2000/svg"><path d="M6.50011 7.47692L8.43857 5.53846L12.0386 1.93846L10.1001 0L6.50011 3.6L2.90011 0L0.9617 1.93846L4.56165 5.53846L6.50011 7.47692Z" fill="#373A3C"/></svg></a></div><div class="show-less-wrap-mobile '.$showlesscls.'"><a>'.trim( wpvue_get_transalated_strings( 'show_less' ) ).' <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http: //www.w3.org/2000/svg"><path d="M6.50011 7.47692L8.43857 5.53846L12.0386 1.93846L10.1001 0L6.50011 3.6L2.90011 0L0.9617 1.93846L4.56165 5.53846L6.50011 7.47692Z" fill="#373A3C"/></svg></a></div></div>';
			}

			return $table_html;
		}
		return false;
	}

	public function reverse_wpautop( $s ) {
		//remove any new lines already in there
		$s = str_replace( "\n", '', $s );

		$s = str_replace( "<p>", "", $s );

		//replace <br /> with \n
		$s = str_replace( [ '<br />', '<br>', '<br/>'], "\n", $s );

		//replace </p> with \n\n
		$s = str_replace( '</p>', "\n\n", $s );

		// Remove empty paragraph and create
		$s = str_replace( [ '&nbsp;', '<p>&nbsp;</p>' ], [ '', '' ], $s );
		$s = str_replace( [ '<p></p>' ], [ '' ], $s );
		$s = str_replace( [ '<b>', '</b>' ], [ '<strong>', '</strong>' ], $s );
		$s = str_replace( [ '<i>', '</i>' ], [ '<em>', '</em>' ], $s );

		return $s;
	}
}