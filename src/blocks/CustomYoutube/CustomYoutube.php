<?php
/**
 * CustomYoutube block.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * CustomYoutube class.
 */
class CustomYoutube extends AbstractBlock {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'custom-youtube';

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
		$video_type = ( isset( $attributes['video_type'] ) && $attributes['video_type'] ) ? $attributes['video_type'] : 'youtube';
		$url = ( isset( $attributes['youtube_url'] ) && $attributes['youtube_url'] ) ? $attributes['youtube_url'] : '';
		$thumbnail_type = ( isset( $attributes['thumbnail_type'] ) && $attributes['thumbnail_type'] ) ? $attributes['thumbnail_type'] : 'maxresdefault.jpg';
		if( $video_type == 'vimeo' ) {
			$url = ( isset( $attributes['vimeo_url'] ) && $attributes['vimeo_url'] ) ? $attributes['vimeo_url'] : '';
			$thumbnail_type = ( isset( $attributes['vimeo_thumbnail_type'] ) && $attributes['vimeo_thumbnail_type'] ) ? $attributes['vimeo_thumbnail_type'] : '640.jpg';
		}
		$thumbnail_alt = ( isset( $attributes['thumbnail_alt'] ) && $attributes['thumbnail_alt'] ) ? $attributes['thumbnail_alt'] : '';
		$disable_fullscreen = ( isset( $attributes['disable_fullscreen'] ) ) ? $attributes['disable_fullscreen'] : false;
		$enable_related = ( isset( $attributes['enable_related'] ) ) ? $attributes['enable_related'] : false;
		$disable_autoplay = ( isset( $attributes['disable_autoplay'] ) && $attributes['disable_autoplay'] ) ? 0 : 1;
		$disable_fullscreen = ( $disable_fullscreen ) ? '' : 'allowfullscreen';
		$video_id = $this->get_youtube_video_id( $url );
		$WP_oEmbed = new WP_oEmbed();
		$get_data = $WP_oEmbed->get_data( $url );

		$thumbnail_img = '';
		$height = '281';
		$width = '500';

		if( $get_data ) {
			$width = $get_data->width;
			$height = $get_data->height;
			$thumbnail_parts = pathinfo( $get_data->thumbnail_url );
			$thumbnail_img = str_replace( $thumbnail_parts['basename'], $thumbnail_type, $get_data->thumbnail_url );
			if( !$thumbnail_alt ) {
				$thumbnail_alt = $get_data->title;
			}

			// vimeo
			if( $get_data->provider_name == 'Vimeo' ) {
				$video_id = $get_data->video_id;
				$thumbnail_parts = pathinfo( $get_data->thumbnail_url );
				$part_thumb_name_arr = explode( '_', $thumbnail_parts['basename'] );
				$thumbnail_img = str_replace( $part_thumb_name_arr[1], $thumbnail_type, $get_data->thumbnail_url );
			}
		}
		if( !$thumbnail_img && $video_type == 'youtube' )
			$thumbnail_img = 'https://i.ytimg.com/vi/'.$video_id.'/'.$thumbnail_type;

		if( $video_type == 'youtube' ) {
			$query_param = '?autoplay='.$disable_autoplay.'&rel=';
			$query_param .= ( $enable_related ) ? 1 : 0;
		}elseif( $video_type == 'vimeo' ) {
			$query_param = ($disable_autoplay == 1 ) ? '?autoplay=1' : '';
		}
		// custom height width
		$width = ( isset( $attributes['iframe_width'] ) &&  $attributes['iframe_width'] ) ? $attributes['iframe_width'] : $width;
		$height = ( isset( $attributes['iframe_height'] ) &&  $attributes['iframe_height'] ) ? $attributes['iframe_height'] : $height;
		$has_custom_ratio = false;
		if( isset( $attributes['iframe_width'] ) &&  $attributes['iframe_width'] && ( !isset( $attributes['iframe_height'] ) || !$attributes['iframe_height'] ) ) {
			$height = round( ( $width * 9 ) / 16 ); // 16:9 aspect ratio
			$has_custom_ratio = true;
		}
		if( isset( $attributes['iframe_height'] ) &&  $attributes['iframe_height'] && ( !isset( $attributes['iframe_width'] ) || !$attributes['iframe_width'] ) ) {
			$width = round( ( $height * 16 ) / 9 ); // 16:9 aspect ratio
			$has_custom_ratio = true;
		}
		if( isset( $attributes['iframe_height'] ) &&  $attributes['iframe_height'] && isset( $attributes['iframe_width'] ) && $attributes['iframe_width'] ) {
			$has_custom_ratio = true;
		}

		if( $video_type == 'youtube' ) {
			// API call for schema
			$api_url = 'https://www.googleapis.com/youtube/v3/videos?id='.$video_id.'&key='.get_theme_option( 'google_apikey' ).'&part=snippet,contentDetails,statistics,status';
			$response = wp_safe_remote_get( $api_url, array() );
			$body = wp_remote_retrieve_body( $response );
			if ( $body ) {
				$data = json_decode( trim( $body ), true );
				if ( isset( $data['items'] ) && $data['items'] ) {
					$video_data = (array)$data['items'][0];
					//return $video_data;
					$schema = array(
						'@context'  	=> 'http://schema.org',
						'@type' 		=> 'VideoObject',
						'name' 			=> ( isset( $video_data['snippet']['title'] ) && $video_data['snippet']['title'] ) ? $video_data['snippet']['title'] : $thumbnail_alt,
						'description' 	=> ( isset( $video_data['snippet']['description'] ) && $video_data['snippet']['description'] ) ? $video_data['snippet']['description'] : 'N/A',
						'thumbnailUrl' 	=> $thumbnail_img,
						'uploadDate' 	=> ( isset( $video_data['snippet']['publishedAt'] ) && $video_data['snippet']['publishedAt'] ) ? $video_data['snippet']['publishedAt'] : 'N/A',
						'duration' 		=> ( isset( $video_data['contentDetails']['duration'] ) && $video_data['contentDetails']['duration'] ) ? $video_data['contentDetails']['duration'] : 'N/A',
						'contentUrl' 	=> $url,
						'embedUrl' 		=> "https://www.youtube.com/embed/" . $video_id . $query_param,
						'interactionStatistic' => array(
							'@type' => "InteractionCounter",
							'interactionType' => array(
								'@type' => "http://schema.org/WatchAction"
							),
							'userInteractionCount' => ( isset( $video_data['statistics']['viewCount'] ) && $video_data['statistics']['viewCount'] ) ? $video_data['statistics']['viewCount'] : 0,
						),
					);
				}
			}
		}elseif( $video_type == 'vimeo' ){
			// API call for schema
			$api_url = 'https://vimeo.com/api/v2/video/'.$video_id.'.json';
			$response = wp_safe_remote_get( $api_url, array() );
			$body = wp_remote_retrieve_body( $response );
			if ( $body ) {
				$data = json_decode( trim( $body ), true );
				if ( isset( $data[0] ) && $data[0] ) {
					$video_data = (array)$data[0];
					//return $video_data;
					$duration = 'PT0S';
					if( isset( $video_data['duration'] ) ) { // in sec
						$duration = $this->durationSecToISO8601( $video_data['duration'] );
					}
					$schema = array(
						'@context'  	=> 'http://schema.org',
						'@type' 		=> 'VideoObject',
						'name' 			=> ( isset( $video_data['title'] ) && $video_data['title'] ) ? $video_data['title'] : $thumbnail_alt,
						'description' 	=> ( isset( $video_data['description'] ) && $video_data['description'] ) ? $video_data['description'] : $thumbnail_alt,
						'thumbnailUrl' 	=> $thumbnail_img,
						'uploadDate' 	=> ( isset( $video_data['upload_date'] ) && $video_data['upload_date'] ) ? $video_data['upload_date'] : 'N/A',
						'duration' 		=> $duration,
						'contentUrl' 	=> $url,
						'embedUrl' 		=> "https://player.vimeo.com/video/" . $video_id . $query_param,
						'interactionStatistic' => array(
							'@type' => "InteractionCounter",
							'interactionType' => array(
								'@type' => "http://schema.org/WatchAction"
							),
							'userInteractionCount' => ( isset( $video_data['stats_number_of_plays'] ) && $video_data['stats_number_of_plays'] ) ? $video_data['stats_number_of_plays'] : 0,
						),
					);
				}
			}
		}

		$ratio_class = ( $has_custom_ratio ) ? 'custom-ratio' : 'ratio-16-9';

		$vhtml = '<div class="wpvcb-'.$video_type.'-wrap wp-has-aspect-ratio '.$ratio_class.' overflow-auto">
			<img class="'.$video_type.'-thumb" height="'.$height.'" width="'.$width.'" src="'.$thumbnail_img.'" alt="'.$thumbnail_alt.'" />
			<a class="wpvcb-'.$video_type.'-overlay wpvcb-'.$video_type.'-play"
			data-vid="'.$video_id.'"
			data-width="'.$width.'"
			data-height="'.$height.'"
			data-fullscreen="'.$disable_fullscreen.'"
			data-autoplay="'.$disable_autoplay.'"
			data-params="'.$query_param.'"
			>
			<span class="m-'.$video_type.'-button">
				<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
					<path class="'.$video_type.'-large-play-button-bg" d="m .66,37.62 c 0,0 .66,4.70 2.70,6.77 2.58,2.71 5.98,2.63 7.49,2.91 5.43,.52 23.10,.68 23.12,.68 .00,-1.3e-5 14.29,-0.02 23.81,-0.71 1.32,-0.15 4.22,-0.17 6.81,-2.89 2.03,-2.07 2.70,-6.77 2.70,-6.77 0,0 .67,-5.52 .67,-11.04 l 0,-5.17 c 0,-5.52 -0.67,-11.04 -0.67,-11.04 0,0 -0.66,-4.70 -2.70,-6.77 C 62.03,.86 59.13,.84 57.80,.69 48.28,0 34.00,0 34.00,0 33.97,0 19.69,0 10.18,.69 8.85,.84 5.95,.86 3.36,3.58 1.32,5.65 .66,10.35 .66,10.35 c 0,0 -0.55,4.50 -0.66,9.45 l 0,8.36 c .10,4.94 .66,9.45 .66,9.45 z" fill="#1f1f1e" fill-opacity="0.81"/><path d="m 26.96,13.67 18.37,9.62 -18.37,9.55 -0.00,-19.17 z" fill="#fff"/><path d="M 45.02,23.46 45.32,23.28 26.96,13.67 43.32,24.34 45.02,23.46 z" fill="#ccc"/>
				</svg>
			</span>
			</a>
		</div>
		<style>
		.ratio-16-9 {
			width:'.$width.'px;
			height:'.$height.'px;
			padding-top: 0 !important;
		}
		.custom-ratio {
			width:'.$width.'px !important;
			height:'.$height.'px;
			position: relative;
			overflow: hidden;
		}
		.custom-ratio img {
			width:'.$width.'px;
			height:'.$height.'px;
		}
		.wpvcb-youtube-wrap .youtube-thumb, .wpvcb-vimeo-wrap .vimeo-thumb {
			position:absolute;
			top:0;
			left:0;
			width:100%;
			height: 100%;
			object-fit: cover;
		}
		.youtube-large-play-button-bg, .vimeo-large-play-button-bg  {
			fill: #1f1f1f;
			fill-opacity: 0.81;
			transition: fill 0.1s cubic-bezier(0.4, 0, 1, 1) 0s, fill-opacity 0.1s cubic-bezier(0.4, 0, 1, 1) 0s;
		 }
		 .wpvcb-youtube-overlay:hover .youtube-large-play-button-bg {
			fill: #cc181e;
			fill-opacity: 1;
			transition: fill 0.1s cubic-bezier(0, 0, 0.2, 1) 0s, fill-opacity 0.1s cubic-bezier(0, 0, 0.2, 1) 0s;
		 }
		 .wpvcb-vimeo-overlay:hover .vimeo-large-play-button-bg {
			fill: #00ADEF;
			fill-opacity: 1;
			transition: fill 0.1s cubic-bezier(0, 0, 0.2, 1) 0s, fill-opacity 0.1s cubic-bezier(0, 0, 0.2, 1) 0s;
		 }
		 .m-youtube-button, .m-vimeo-button {
			background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
			border-radius: 10px;
			height: 30px;
			left: 50%;
			position: absolute;
			top: 50%;
			transform: translate(-50%, -50%);
			width: 42px;
			z-index: 5;
			display: block;
		 }
		 .wpvcb-youtube-overlay, .wpvcb-vimeo-overlay {
			left: 0;
			top:0;
			right: 0;
			bottom :0;
			position: absolute;
		 }

		</style>';

		$filtercontent = array(
			'html' => $vhtml,
		);
		if( $schema ) $filtercontent['schema'] = json_encode( $schema, JSON_PRETTY_PRINT );
		return $filtercontent;
	}

	public function get_youtube_video_id( $url ) {
		// http://youtu.be/dQw4w9WgXcQ
		// http://www.youtube.com/embed/dQw4w9WgXcQ
		// http://www.youtube.com/watch?v=dQw4w9WgXcQ
		// http://www.youtube.com/?v=dQw4w9WgXcQ
		// http://www.youtube.com/v/dQw4w9WgXcQ
		// http://www.youtube.com/e/dQw4w9WgXcQ
		// http://www.youtube.com/user/username#p/u/11/dQw4w9WgXcQ
		// http://www.youtube.com/sandalsResorts#p/c/54B8C800269D7C1B/0/dQw4w9WgXcQ
		// http://www.youtube.com/watch?feature=player_embedded&v=dQw4w9WgXcQ
		// http://www.youtube.com/?feature=player_embedded&v=dQw4w9WgXcQ

		// It also works on the youtube-nocookie.com URL with the same above options.
		// It will also pull the ID from the URL in an embed code (both iframe and object tags)
		preg_match('%(?:youtube(?:-nocookie)?\.com/(?:[^/]+/.+/|(?:v|e(?:mbed)?)/|.*[?&]v=)|youtu\.be/)([^"&?/ ]{11})%i', $url, $match);
		return isset( $match[1] ) ? $match[1] : false;
	}

	public function durationSecToISO8601( $second ) {
		$h = intval($second/3600);
		$m = intval(($second -$h*3600)/60);
		$s = $second -($h*3600 + $m*60);
		$ret = 'PT';
		if ($h)
			$ret.=$h.'H';
		if ($m)
			$ret.=$m.'M';
		if ((!$h && !$m) || $s)
			$ret.=$s.'S';
		return $ret;
	}
}