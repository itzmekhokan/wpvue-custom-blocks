/**
 * BLOCK: BestPaymentMethods
 *
 */

import Select from 'react-select';
//  Import CSS.
// import './editor.scss';
// import './style.scss';

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 

import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import {
	PanelBody,
	Placeholder,
	RangeControl,
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
const { getCurrentPostId } = wp.data.select("core/editor");

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */

registerBlockType( 'wpvcb/news-block', { 
	title: __( 'News Block', 'wpvcb-blocks' ), 
	icon: 'media-document', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		block_title: {
			type: 'string',
			default: ''
		},
		no_of_posts: {
			type: 'string',
			default: ''
		},
		enable_selected_posts: {
			type: 'boolean',
			default: false
		},
		post__in: {
			type: 'string',
			default: null
		},
		news_cat_id: {
			type: 'string',
			default: ''
		},
	},
	example: {},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Component.
	 */
	edit: ( props ) => {
		const { attributes, setAttributes } = props;
		const {
			block_title,
			no_of_posts,
			article_cat_id,
			post_id,
			enable_selected_posts,
			post__in,
			news_cat_id,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		const bindNewsOptionData = wpvcb_blocks_scripts_data_params.data.news;

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'media-document'
					label={ __( 'News Block', 'wpvcb-blocks' ) }
					instructions={ __( 'By default this block display latest 7 news per page.', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-news-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-news-block__selection">
						
						{/* { !enable_selected_posts && (
						<TextControl
							label={ __( 'Number of posts per page', 'wpvcb-blocks' ) }
							help={ __( 'By default display news number is 7 per page.', 'wpvcb-blocks' ) }
							type='number'
							min='1'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { post_id: getCurrentPostId()} );
								setAttributes( { no_of_posts: value } );
							} }
						/>
						)} */}
						<SelectControl
							label={ __( 'Select category', 'wpvcb-blocks' ) }
							value={ news_cat_id }
							options={ wpvcb_blocks_scripts_data_params.data.news_cat }
							onChange={ ( value ) =>
								setAttributes( { news_cat_id: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Display Selected news only',
								'wpvcb-blocks'
							) }
							checked={ enable_selected_posts }
							onChange={ ( value ) =>
								setAttributes( { enable_selected_posts: value } )
							}
						/>
						{ enable_selected_posts && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='post__in'
							className='basic-multi-select'
							defaultValue={ bindNewsOptionData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindNewsOptionData }
							isMulti='true'
                        />
						)}
					</div>
				</Placeholder>
			</Fragment>
		);
	},

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 *
	 * @param {Object} props Props.
	 * @returns {Mixed} JSX Frontend HTML.
	 */
	save: ( props ) => {
		return 'null';
	},
} );
