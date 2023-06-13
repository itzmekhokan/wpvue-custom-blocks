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

registerBlockType( 'wpvcb/related-articles', { 
	title: __( 'Related Articles', 'wpvcb-blocks' ), 
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
		article_cat_id: {
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
		} = attributes;

		const addExclude = () => {
			props.setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
		}
		
		const bindCategoriesOptionData = [{ value: '', label: 'Select a categories...' }];
		let categories = wpvcb_blocks_scripts_data_params.data.categories;
		categories.map( function( data ){
			bindCategoriesOptionData.push( { value: data.term_id, label: data.name } );
		});

		const bindArticleOptionData = wpvcb_blocks_scripts_data_params.data.relatedarticles;

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-page'
					label={ __( 'Related Articles', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-related-articles"
				>
					<div className="wpvcb-block__selection wpvcb-block-related-article__selection" onClick={ addExclude }>
						<TextControl
							type="hidden"
							value={ post_id }
						/>
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Related Articles', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { block_title: value } );
							} }
						/>
						{/* <SelectControl
							label={ __( 'Select Article Category', 'wpvcb-blocks' ) }
							value={ article_cat_id } 
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { article_cat_id: value } );
							} }
							options={ bindCategoriesOptionData }
						/> */}
						{ !enable_selected_posts && (
						<TextControl
							label={ __( 'Number of posts', 'wpvcb-blocks' ) }
							type='number'
							min='-1'
							max='4'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { no_of_posts: value } );
							} }
						/>
						)}
						<ToggleControl
							label={ __(
								'Display Selected articles only',
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
							defaultValue={ bindArticleOptionData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindArticleOptionData }
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
