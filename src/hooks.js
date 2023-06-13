/**
 * External Dependencies
 */
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfiguration } from './utils.js';

/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment }	= wp.element;
const { InspectorAdvancedControls }	= wp.editor;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent } = wp.compose;
const { PanelBody, TextControl, ToggleControl } = wp.components;
const { getCurrentPostId } = wp.data.select("core/editor");


//restrict to specific block names
const allowedBlocks = [ 
    'core/image',
    'core/paragraph',
    'core/heading',
    'core/shortcode',
    'core/gallery',
    'core/group',
    'core/list',
    'core/quote',
    'core/audio',
    'core/file',
    'core/cover',
    'core/video',
    'core/preformatted',
    'core/code',
    'core/pullquote',
    'core/html',
    'core/freeform',
    'core/table',
    'core/text-columns',
    'core/button',
    'core/buttons',
    'core/verse',
    'core/column',
    'core/columns',
    'core/more',
    'core/nextpage',
    'core/separator',
    'core/social-links',
    'core/spacer',
    'core/subhead',
    'core/media-text',
    'core/missing',
    'core/archives',
    'core/categories',
    'core/latest-comments',
    'core/latest-posts',
    'core/embed',
    'core/block',
    'core/calendar',
    'core/rss',
    'core/search',
    'core/social-link',
    'core/tag-cloud',
    'core-embed/twitter',
    'core-embed/youtube',
    'core-embed/facebook',
    'core-embed/instagram',
    'core-embed/wordpress',
    'core-embed/soundcloud',
    'core-embed/spotify',
    'core-embed/flickr',
    'core-embed/vimeo',
    'core-embed/animoto',
    'core-embed/cloudup',
    'core-embed/collegehumor',
    'core-embed/dailymotion',
    'core-embed/funnyordie',
    'core-embed/hulu',
    'core-embed/imgur',
    'core-embed/issuu',
    'core-embed/kickstarter',
    'core-embed/meetup-com',
    'core-embed/mixcloud',
    'core-embed/photobucket',
    'core-embed/polldaddy',
    'core-embed/reddit',
    'core-embed/reverbnation',
    'core-embed/screencast',
    'core-embed/scribd',
    'core-embed/slideshare',
    'core-embed/smugmug',
    'core-embed/speaker',
    'core-embed/ted',
    'core-embed/tumblr',
    'core-embed/videopress',
    'core-embed/wordpress-tv',
    'wpvcb/best-payment-methods',
    'wpvcb/top-games-articles',
    'wpvcb/alternative-payment-options',
    'wpvcb/payment-review-top-details',
    'wpvcb/blue-progressive-block',
    'wpvcb/comparison-list-block',
    'wpvcb/article-helpful-vote',
    'wpvcb/related-articles',
    'wpvcb/similar-casinos',
    'wpvcb/top-games',
    'wpvcb/game-guide-categories',
    'wpvcb/whitebg-content-block',
    'wpvcb/casino-toplist',
    'wpvcb/faq',
    'wpvcb/newsletter',
    'wpvcb/top-promotions',
    'wpvcb/home-promote-banner',
    'wpvcb/alternative-software-provider',
    'wpvcb/other-software-provider',
    'wpvcb/main-casino-toplist',
    'wpvcb/home-card-testimonials',
    'wpvcb/us-map-data',
    'wpvcb/bullet-block',
    'wpvcb/link-block',
    'wpvcb/latest-casino',
    'wpvcb/exclusive-casino',
    'wpvcb/poker-hands',
    'wpvcb/youtube-film-strip',
    'wpvcb/custom-iframe',
    'wpvcb/bonus-cards',
    'wpvcb/testimonials',
    'wpvcb/geo-text',
    'wpvcb/content-icon-block',
    'wpvcb/feature-promotion',
    'wpvcb/software-provider-block',
    'wpvcb/payment-option-block',
    'wpvcb/languages-supports-block',
    'wpvcb/bonus-information-block',
    'wpvcb/page-menu-blocks-scroll',
    'wpvcb/pu-reference',
    'wpvcb/geo-image',
    'wpvcb/article-banner',
    'wpvcb/tab-switcher',
    'wpvcb/news-block',
    'wpvcb/author-block',
    'wpvcb/intro-block',
    'wpvcb/published-date',
    'wpvcb/home-banner',
    'wpvcb/howto-block',
    'wpvcb/right-content-simpletoc',
    'yoast/faq-block',
];

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {
	//check if object exists for old Gutenberg version compatibility
	/* add allowedBlocks restriction */
	if( typeof settings.attributes !== 'undefined' && allowedBlocks.includes( settings.name ) ){
	
		settings.attributes = Object.assign( settings.attributes, {
			blockID:{ 
				type: 'string',
				default: '',
			}
		});
    
	}

	return settings;
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {

		const {
			name,
			attributes,
			setAttributes,
			isSelected,
		} = props;

		const {
			blockID,
		} = attributes;
		
		return (
			<Fragment>
				<BlockEdit {...props} />
                
                { isSelected && allowedBlocks.includes( name ) &&
                    <InspectorControls>
                        <PanelBody title={__( 'Block ID', 'wpvcb-blocks' )}>
                            <TextControl
                            label={__( 'Block ID', 'wpvcb-blocks' ) }
                            onChange={ ( value ) => {
                                    setAttributes( { blockID: value } );
                            }}
                            value={ blockID }
                            placeholder={__( 'Unique page menu block ID', 'wpvcb-blocks' )}
                            help={__( 'Add same menu block ID here, when used `Page Menu Blocks Scroll` block for respective menu content scroll to section.', 'wpvcb-blocks' )}
                            /> 

                        </PanelBody>
                    </InspectorControls>
				}

			</Fragment>
		);
	};
}, 'withAdvancedControls');

/**
 * Add custom element class in save element.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
function applyExtraClass( extraProps, blockType, attributes ) {
	const { blockID } = attributes;
	
	//check if attribute exists for old Gutenberg version compatibility
	//add class only when visibleOnMobile = false
	//add allowedBlocks restriction
	if ( typeof blockID !== 'undefined' && blockID && allowedBlocks.includes( blockType.name ) ) {
		extraProps.blockID = attributes.blockID;
	}

	return extraProps;
}

//add filters

addFilter(
	'blocks.registerBlockType',
	'editorskit/custom-attributes',
	addAttributes
);

addFilter(
	'editor.BlockEdit',
	'editorskit/custom-advanced-control',
	withAdvancedControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'editorskit/applyExtraClass',
	applyExtraClass
);
