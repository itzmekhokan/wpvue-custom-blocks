<?php
/**
 * Plugin Name: WPVue Blocks
 * Plugin URI: https://github.com/itzmekhokan/wpvue-custom-blocks
 * Description: WPVue blocks for the Gutenberg editor.
 * Version: 1.0.0
 * Author: itzmekhokan
 * Text Domain:  wpvcb-blocks
 *
 * @package WPVue\Blocks
 */

// Exit if accessed directly.
defined( 'ABSPATH' ) || exit;

$minimum_wp_version = '5.0';

if ( version_compare( $GLOBALS['wp_version'], $minimum_wp_version, '<' ) ) {
	/**
	 * Outputs for an admin notice about running Blocks on outdated WordPress.
	 *
	 * @since 1.0.0
	 */
	function wpvcb_blocks_admin_unsupported_wp_notice() {
		?>
		<div class="notice notice-error is-dismissible">
			<p><?php esc_html_e( 'WPVue Blocks requires a more recent version of WordPress and has been paused. Please update WordPress.', 'wpvcb-blocks' ); ?></p>
		</div>
		<?php
	}
	add_action( 'admin_notices', 'wpvcb_blocks_admin_unsupported_wp_notice' );
	return;
}

/**
 * Load WPVue Blocks
 *
 */
class WPVue_Blocks {
	/**
	 * The single instance of the class.
	 *
	 * @var object
	 */
	protected static $instance = null;
        
	/**
	 * Constructor
	 *
	 * @return void
	 */
	protected function __construct() {}

	/**
	 * Get class instance.
	 *
	 * @return object Instance.
	 */
	final public static function instance() {
		if ( null === static::$instance ) {
			static::$instance = new static();
		}
		return static::$instance;
	}

	/**
	 * Init the plugin.
	 */
	public function init() {
		if ( ! $this->has_dependencies() ) {
			return;
		}
		$this->define_constants();
		add_action( 'plugins_loaded', array( $this, 'on_plugins_loaded' ) );
	}
        
	/**
	 * Check dependencies exist.
	 *
	 * @return boolean
	 */
	protected function has_dependencies() {
		return function_exists( 'register_block_type' );
	}
        
	/**
	 * Setup plugin once all other plugins are loaded.
	 *
	 * @return void
	 */
	public function on_plugins_loaded() {
		global $wp_version;
		$this->load_plugin_textdomain();
		$this->includes();
                
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'register_blocks_assets' ) );
		//add_action( 'enqueue_block_assets', array( __CLASS__, 'enqueue_frontend_assets' ) );
		add_action( 'wp_enqueue_scripts', array( __CLASS__, 'wp_enqueue_scripts' ) );
		if( version_compare( $wp_version, '5.8.0', '>=') ) {
			add_filter( 'block_categories_all', array( __CLASS__, 'register_block_categories' ) );
		} else {
			add_filter( 'block_categories', array( __CLASS__, 'register_block_categories' ) );
		}
		
		add_action( 'init', array( __CLASS__, 'register_blocks' ) );

	}
        
	/**
	 * Register assets block categories.
	 */
	public static function register_block_categories( $categories ) {
		return array_merge(
			$categories,
			array(
				array(
					'slug' => 'wpvcb',
					'title' => __( 'WPVue Blocks', 'wpvcb-blocks' ),
					'icon'  => 'screenoptions',
				),
			)
		);
	}
        
	/**
	 * Register assets as needed.
	 */
	public static function register_blocks_assets() {
		global $post;
		// Register block styles for both frontend + backend.
		// wp_register_style(
		// 		'wpvcb_blocks-style-css', 
		// 		WPVCB_PLUGIN_URL . 'dist/blocks.style.build.css', 
		// 		is_admin() ? array( 'wp-editor' ) : null, 
		// 		filemtime( WPVCB_PLUGIN_PATH . '/dist/blocks.style.build.css' ) 
		// );
		
		// Register block editor script for backend.
		wp_register_script(
				'wpvcb_blocks-scripts-js', 
				WPVCB_PLUGIN_URL . 'dist/blocks.build.js',
				array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components', 'wp-core-data', 'wp-api-fetch' ),
				filemtime( WPVCB_PLUGIN_PATH . '/dist/blocks.build.js' ), 
				true 
		);

		// Register block editor styles for backend.
		wp_register_style(
				'wpvcb_blocks-editor-css', 
				WPVCB_PLUGIN_URL . 'dist/blocks.editor.build.css', 
				array( 'wp-edit-blocks' ), 
				filemtime( WPVCB_PLUGIN_PATH . '/dist/blocks.editor.build.css' ) 
		);

		// WP Localized globals
		$params = apply_filters( 'wpvcb_blocks_scripts_data_params',
		array(
			'pluginDirPath' => WPVCB_PLUGIN_PATH,
			'pluginDirUrl'  => WPVCB_PLUGIN_URL,
			'data'			=> array(
				'placeholder_img' => WPVCB_PLUGIN_URL . 'assets/images/placeholder.png',
				'postID'		=> ( $post && isset( $post->ID ) ) ? $post->ID : false,
				'categories'	=> get_categories(),
				'game_cat'		=> wpvcb_get_taxonomyOptions( 'game_cat' ),
				'testimonals'	=> wpvcb_get_testimonialsOptions(),
				'relatedarticles'		=> wpvcb_get_postsOptions( 'post' ),
				'articles'		=> wpvcb_get_postsOptions( array( 'post', 'page', 'game_paid', 'news' ) ),
				'articles_plus_review' => wpvcb_get_postsOptions( array( 'post', 'page', 'game_paid', 'news', 'review' ) ),
				'promotions'	=> wpvcb_get_postsOptions( 'promotions' ),
				'payment_methods'	=> wpvcb_get_postsOptions( 'payment_options' ),
				'games'		=> wpvcb_get_postsOptions( array( 'game_free', 'game_paid' ) ),
				'game_free'	=> wpvcb_get_postsOptions( 'game_free' ),
				'game_paid'	=> wpvcb_get_postsOptions( 'game_paid' ),
				'reviews' => wpvcb_get_postsOptions( 'review' ),
				'software_provider' => wpvcb_get_postsOptions( 'software_providers' ),
				'news' => wpvcb_get_postsOptions( 'news' ),
				'news_cat' => wpvcb_get_taxonomyOptions( 'news_cat', true ),
				'users' => wpvcb_get_userListOptions(),
				'cas_data'		=> array(
					'default_display' => ( get_theme_option( 'cas_toplist_default_display' ) ) ? get_theme_option( 'cas_toplist_default_display' ) : 3,
					'display_offset' => ( get_theme_option( 'cas_toplist_display_offset' ) ) ? get_theme_option( 'cas_toplist_display_offset' ) : 3,
					'exclusive_casinos' => wpvcb_get_casinolistOptions( 'exclusive_bonus_amount' ),
					'casino_partners' => wpvcb_get_casinolistOptions( '', false ),
					'cas_partners'		=> wpvcb_get_casListOptions(),
					'cas_payments'		=> wpvcb_get_casListOptions( 'payment-option' ),
					'cas_softwares'		=> wpvcb_get_casListOptions( 'software' ),
				)
			),
		) );
		// PU Script data
		if ( class_exists( 'PU', false ) ) { 
			$params['data']['pu_faq_headers'] = PU()->query->get_all_faq();
			$reference_data = get_reference_sets_data();
			$pu_references_dd = array();
			if( $reference_data ) {
				foreach ( $reference_data as $key => $ref ) {
					$pu_references_dd[] = array(
						'value'	=> $key,
						'label' => $ref['ref_name']
					);
				}
			}
			$params['data']['pu_references_dd'] = $pu_references_dd;
		}
		wp_localize_script( 'wpvcb_blocks-scripts-js', 'wpvcb_blocks_scripts_data_params', $params );
	}


	/**
	 * Enqueue assets for frontend.
	 */
	public static function enqueue_frontend_assets() {
		if ( !wp_script_is( 'wpvcb_blocks-style-css', 'registered' ) ) {
			wp_register_style(
				'wpvcb_blocks-style-css', 
				WPVCB_PLUGIN_URL . 'dist/blocks.style.build.css', 
				is_admin() ? array( 'wp-editor' ) : null,
				filemtime( WPVCB_PLUGIN_PATH . '/dist/blocks.style.build.css' ) 
			);
		}
		wp_enqueue_style( 'wpvcb_blocks-style-css' );
	}

	/**
	 * Enqueue assets for frontend wordpress.
	 */
	public static function wp_enqueue_scripts() {
		// if ( !wp_script_is( 'wpvcb_youtube_embed', 'registered' ) ) {
		// 	wp_register_script(
		// 		'wpvcb_youtube_embed', 
		// 		WPVCB_PLUGIN_URL . 'assets/js/youtube-embed.js',
		// 		array(),
		// 		filemtime( WPVCB_PLUGIN_PATH . '/assets/js/youtube-embed.js' ), 
		// 		true 
		// 	);
		// }
		// wp_enqueue_script( 'wpvcb_youtube_embed' );
	}

        
	/**
	 * Register blocks, hooking up assets and render functions as needed.
	 */
	public static function register_blocks() {
		$blocks = array(
			'BestPaymentMethods',
			'TopGamesArticles',
			//'ReviewDetails',
			'AlternativePayemtOptions',
			'PaymentReviewTopDetails',
			'BlueProgressiveBlock',
			'ComparisonListBlock',
			'ArticleHelpfulVote',
			'RelatedArticles',
			'SimilarCasinos',
			'TopGames',
			'GameGuideCategories',
			'WhiteBGContentBlock',
			'CasinoToplist',
			'FAQ',
			'NewsLetter',
			'TopPromotions',
			'HomePromoteBanner',
			'AlternativeSoftwareProvider',
			'OtherSoftwareProvider',
			'MainCasinoToplist',
			'HomeCardTestimonials',
			'USMapData',
			'BulletBlock',
			'LinkBlock',
			'LatestCasino',
			'ExclusiveCasino',
			'CustomTable',
			'CustomYoutube',
			'PokerHands',
			'YoutubeFilmStrip',
			'CustomIframe',
			'BonusCards',
			'Testimonials',
			'GeoText',
			'ContentIcon',
			'FeaturePromotion',
			'SoftwareProvider',
			'PaymentOption',
			'LanguagesAndSupports',
			'BonusInformation',
			'PageMenuBlocksScroll',
			'PUReferenceBlock',
			'GeoImage',
			'ArticleBanner',
			'TabSwitcher',
			'NewsBlock',
			'AuthorBlock',
			'IntroBlock',
			'PublishedDate',
			'HomeBanner',
			'HowToBlock',
			'RightContentTOC',
		);
                
		foreach ( $blocks as $class ) {
			require_once 'src/blocks/' . $class . '/' . $class . '.php';
			$instance = new $class();
			$instance->register_block_type();
			// filtered contents
			$block = $instance->get_namespace() . '/' . $instance->get_block_name();
			add_filter( 'wcra_casino_filter_block_content-' . $block, array( $instance, 'render_filtered_content' ), 99, 2 );
		}
	}

	/**
	 * Define Constants.
	 */
	protected function define_constants() {
		if ( ! defined( 'WPVCB_ABSPATH' ) ) define( 'WPVCB_ABSPATH', dirname( __FILE__ ) . '/' );
		if ( ! defined( 'WPVCB_PLUGIN_URL' ) ) define( 'WPVCB_PLUGIN_URL', plugin_dir_url(__FILE__) );
		if ( ! defined( 'WPVCB_PLUGIN_PATH' ) ) define( 'WPVCB_PLUGIN_PATH', untrailingslashit( plugin_dir_path(__FILE__) ) );
		if ( ! defined( 'WPVCB_VERSION' ) ) define( 'WPVCB_VERSION', '0.0.1' );
	}
        
        /**
	 * includes files.
	 */
	protected function includes() {
		include_once WPVCB_ABSPATH . 'src/blocks/AbstractBlock.php';
	}

	/**
	 * Load Localisation files.
	 */
	protected function load_plugin_textdomain() {
		load_plugin_textdomain( 'wpvcb-blocks', false, basename( dirname( __FILE__ ) ) . '/languages' );
	}
}
WPVue_Blocks::instance()->init();

function wpvcb_get_postsOptions( $post_types = 'post' ) {
	$posts = get_posts( array( 'post_type' => $post_types, 'posts_per_page' => -1, 'post_status' => 'publish' ) );
	$options = array();
	if( $posts ) {
		foreach ( $posts as $post ) {
			$options[] = array(
				'value'	=> $post->ID,
				'label' => $post->post_title
			);
		}
	}
	return $options;
}

function wpvcb_get_casinolistOptions( $datakeymatch = '', $tag_enable = true ) {
	$group_id = get_theme_option( 'cas_toplist_group_id' );
	if( !$group_id ) return array();
	$tag = ( wpvue_get_transalated_strings( 'exclusive' ) ) ? strtolower( wpvue_get_transalated_strings( 'exclusive' ) ) : 'exclusive';
	if( $tag_enable ) {
		$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" tag="'.trim($tag).'" procons-visible="1" return="json"]');
	}else{
		$toplist_data = do_shortcode('[cas-toplist-group id="'.$group_id.'" procons-visible="1" return="json"]');
	}
	
	$toplist_data = json_decode(urldecode($toplist_data), true);
	$casino_options = array();
	if( $toplist_data ) {
		foreach ( $toplist_data as $partner ) {
			if( $datakeymatch ) {
				if( isset( $partner[$datakeymatch] ) && $partner[$datakeymatch] ) {
					$casino_options[] = array(
						'value'	=> $partner['product_id'],
						'label' => $partner['product_name']
					);
				}
			}else{
				$casino_options[] = array(
					'value'	=> $partner['product_id'],
					'label' => $partner['product_name']
				);
			}
		}
	}
	return $casino_options;
}

function wpvcb_get_testimonialsOptions() {
	$testimonials = wpvue_get_testimonials_data();
	$options = array();
	if( $testimonials ) {
		$options[] = array(
			'value'	=> '',
			'label' => '-- Select One --'
		);
		foreach ( $testimonials as $key => $data ) {
			$options[] = array(
				'value'	=> $key,
				'label' => $data['name']
			);
		}
	}
	return $options;
}

function wpvcb_get_casListOptions( $type = 'partner') {
	$options = array();
	$toplist_data = do_shortcode('[cas-list type="'.$type.'" return="json"]');
    $toplist_data = json_decode(urldecode($toplist_data), true);

    if( $toplist_data ) {
        foreach ( $toplist_data as $data ) {
			$options[] = array(
				'value'	=> $data['id'],
				'label' => $data['name']
			);
        }
    }
	
	return $options;
}

function wpvcb_get_userListOptions() {
	$options = array();
	$users = get_users();

    if( $users ) {
        foreach ( $users as $user ) {
			$options[] = array(
				'value'	=> $user->ID,
				'label' => $user->display_name
			);
        }
    }
	
	return $options;
}

function wpvcb_get_taxonomyOptions( $taxonomy = 'category', $none_selection = false ) {
	$options = array();
	$terms = get_terms( array(
		'taxonomy' => $taxonomy,
		'hide_empty' => false,
		'fields' => 'id=>name'
	) );

	if( $none_selection ) {
		$options[] = array(
			'value'	=> '',
			'label' => '-- None --'
		);
	}

	if( $terms ) {
		foreach ( $terms as $term_id => $term_name ) {
			$options[] = array(
				'value'	=> $term_id,
				'label' => $term_name
			);
        }
	}

	return $options;
}