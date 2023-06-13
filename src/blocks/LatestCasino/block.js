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

registerBlockType( 'wpvcb/latest-casino', { 
	title: __( 'Latest Casinos', 'wpvcb-blocks' ), 
	icon: 'admin-page', 
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
		asset_category: {
			type: 'string',
			default: ''
		},
		enable_link: {
			type: 'boolean',
			default: false
		},
		link_label: {
			type: 'string',
			default: ''
		},
		link_url: {
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
			post_id,
			enable_selected_posts,
			post__in,
			enable_link,
			asset_category,
			link_label,
			link_url,
		} = attributes;

		const addExclude = () => {
			props.setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
		}

		const bindReviewsOptionData = wpvcb_blocks_scripts_data_params.data.reviews;

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-page'
					label={ __( 'Latest Casinos', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-latest-casino"
				>
					<div className="wpvcb-block__selection wpvcb-block-latest-casino__selection" onClick={ addExclude }>
						<TextControl
							type="hidden"
							value={ post_id }
						/>
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Latest Casinos', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { block_title: value } );
							} }
						/>
						{ !enable_selected_posts && (
						<TextControl
							label={ __( 'Number of casinos', 'wpvcb-blocks' ) }
							type='number'
							min='1'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { no_of_posts: value } );
							} }
						/>
						)}
						<ToggleControl
							label={ __(
								'Display Selected casinos only',
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
							defaultValue={ bindReviewsOptionData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindReviewsOptionData }
							isMulti='true'
                        />
						)}
						<TextControl
							placeholder={ __( 'Partner asset-category name (Optional)', 'wpvcb-blocks' ) }
							help={ __( 'By default it will takes `product_logo_136x136` as asset-category.', 'wpvcb-blocks' ) }
							value={ asset_category }
							onChange={ ( value ) => {
								setAttributes( { asset_category: value } );
							} }
						/>	
						<ToggleControl
							label={ __(
								'Enable link',
								'wpvcb-blocks'
							) }
							checked={ enable_link }
							onChange={ ( value ) =>
								setAttributes( { enable_link: value } )
							}
						/>
						{ enable_link && (
						<TextControl
							label={ __( 'Add link label', 'wpvcb-blocks' ) }
							value={ link_label }
							onChange={ ( value ) => {
								setAttributes( { link_label: value } );
							} }
						/>
						)}
						{ enable_link && (
						<TextControl
							label={ __( 'Add link url', 'wpvcb-blocks' ) }
							value={ link_url }
							onChange={ ( value ) => {
								setAttributes( { link_url: value } );
							} }
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
