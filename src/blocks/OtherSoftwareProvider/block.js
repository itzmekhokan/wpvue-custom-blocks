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

registerBlockType( 'wpvcb/other-software-provider', { 
	title: __( 'Other Software Provider', 'wpvcb-blocks' ), 
	icon: 'shield', 
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
		block_description: {
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
		orderby: {
			type: 'string',
			default: ''
		},
		enable_asset_cat_name: {
			type: 'boolean',
			default: false
		},
		asset_cat_name: {
			type: 'string',
			default: ''
		}
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
			block_description,
			no_of_posts,
			post_id,
			enable_selected_posts,
			post__in,
			orderby,
			enable_asset_cat_name,
			asset_cat_name,
		} = attributes;

		const addExclude = () => { props.setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } ); }

		const bindSoftwareProviderData = wpvcb_blocks_scripts_data_params.data.software_provider;

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'shield'
					label={ __( 'Other Software Provider', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-other-software-provider"
				>
					<div className="wpvcb-block__selection wpvcb-block-other-software-provider__selection" onClick={ addExclude }>
						<TextControl
							type="hidden"
							value={ post_id }
						/>
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { block_title: value } );
							} }
						/>
						<TextControl
							label={ __( 'Description', 'wpvcb-blocks' ) }
							type='textarea'
							placeholder={ __( 'Description', 'wpvcb-blocks' ) }
							value={ block_description }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { block_description: value } );
							} }
						/>
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
								'Display Selected software providers only',
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
							defaultValue={ bindSoftwareProviderData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindSoftwareProviderData }
							isMulti='true'
                        />
						)}
						<SelectControl
							label={ __( 'Order By', 'wpvcb-blocks' ) }
							value={ orderby }
							options={ [
								{ label: 'Select', value: '' },
								{ label: 'A to Z', value: 'atoz' },
								{ label: 'Z to A', value: 'ztoa' },
							] }
							onChange={ ( value ) => {
								setAttributes( { orderby: value } )
							} }
						/>
						<ToggleControl
							label={ __(
								'Define software provider asset category name',
								'wpvcb-blocks'
							) }
							checked={ enable_asset_cat_name }
							onChange={ ( value ) =>
								setAttributes( { enable_asset_cat_name: value } )
							}
						/>
						{ enable_asset_cat_name && (
						<TextControl
							label={ __( 'Asset category name', 'wpvcb-blocks' ) }
							placeholder={ __( 'software_logo_105x105', 'wpvcb-blocks' ) }
							value={ asset_cat_name }
							onChange={ ( value ) => {
								setAttributes( { asset_cat_name: value } );
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
