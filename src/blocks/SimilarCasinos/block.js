/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
// import './editor.scss';
// import './style.scss';

import Select from 'react-select';

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

registerBlockType( 'wpvcb/similar-casinos', { 
	title: __( 'Similar Casinos', 'wpvcb-blocks' ), 
	icon: 'admin-site', 
	category: 'wpvcb', 
	attributes: {
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
		group_id: {
			type: 'string',
			default: ''
		},
		asset_category: {
			type: 'string',
			default: ''
		},
		enable_tags: {
			type: 'boolean',
			default: false
		},
		tag_mode: {
			type: 'string',
			default: ''
		},
		tags: {
			type: 'string',
			default: ''
		},
		enable_payment_popup: {
			type: 'boolean',
			default: false
		},
		cas_filterby: {
			type: 'string',
			default: ''
		},
		software_provider: {
			type: 'string',
			default: null
		},
		payment_option: {
			type: 'string',
			default: null
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
			block_description,
			no_of_posts,
			group_id,
			enable_tags,
			asset_category,
			tags,
			tag_mode,
			enable_payment_popup,
			cas_filterby,
			software_provider,
			payment_option,
		} = attributes;

		const bindSoftwareProviderData = wpvcb_blocks_scripts_data_params.data.cas_data.cas_softwares;
		const handleProviderChange = ( software_provider ) => setAttributes( { software_provider: JSON.stringify( software_provider ) } );

		const bindPaymentOptionData = wpvcb_blocks_scripts_data_params.data.cas_data.cas_payments;
		const handlePaymentOptionChange = ( payment_option ) => setAttributes( { payment_option: JSON.stringify( payment_option ) } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-site'
					label={ __( 'Similar Casinos', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-similar-casinos"
				>
					<div className="wpvcb-block__selection wpvcb-block-similar-casinos__selection">
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Similar Casinos', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
							} }
						/>
						<TextControl
							label={ __( 'Description', 'wpvcb-blocks' ) }
							type='textarea'
							placeholder={ __( 'Description', 'wpvcb-blocks' ) }
							value={ block_description }
							onChange={ ( value ) => {
								setAttributes( { block_description: value } );
							} }
						/>
						<TextControl
							label={ __( 'Add CAS Group ID', 'wpvcb-blocks' ) }
							help={ __( 'It will respect global group ID from settings, if there is no group ID provied with the block.', 'wpvcb-blocks' ) }
							type='number'
							value={ group_id }
							onChange={ ( value ) => {
								setAttributes( { group_id: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Filter By ( Optional )', 'wpvcb-blocks' ) }
							value={ cas_filterby }
							options={ [
								{ label: 'Select', value: '' },
								{ label: 'Payment Option', value: 'payment-option' },
								{ label: 'Software Provider', value: 'software' },
							] }
							onChange={ ( value ) =>
								setAttributes( { cas_filterby: value } )
							}
						/>
						{ cas_filterby == 'payment-option' && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='payment_option'
							className='basic-multi-select'
							defaultValue={ bindPaymentOptionData }
                        	value={ JSON.parse( payment_option ) }
                        	onChange={ handlePaymentOptionChange }
                        	options={ bindPaymentOptionData }
							isMulti= { false }
                        />
						)}
						{ cas_filterby == 'software' && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='software_provider'
							className='basic-multi-select'
							defaultValue={ bindSoftwareProviderData }
                        	value={ JSON.parse( software_provider ) }
                        	onChange={ handleProviderChange }
                        	options={ bindSoftwareProviderData }
							isMulti= { false }
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
								'Enable tag ( Optional )',
								'wpvcb-blocks'
							) }
							checked={ enable_tags }
							onChange={ ( value ) =>
								setAttributes( { enable_tags: value } )
							}
						/>
						{ enable_tags && (
						<TextControl
							label={ __( 'Add Tag', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add multiple tags separated by comma, Ex-HOT1,HOT2', 'wpvcb-blocks' ) }
							value={ tags }
							onChange={ ( value ) => {
								setAttributes( { tags: value } );
							} }
						/>
						)}
						{ enable_tags && (
						<SelectControl
							label={ __( 'Tag mode ( Optional )', 'wpvcb-blocks' ) }
							value={ tag_mode }
							options={ [
								{ label: 'Select', value: '' },
								{ label: 'OR', value: 'OR' },
								{ label: 'AND', value: 'AND' },
							] }
							onChange={ ( value ) =>
								setAttributes( { tag_mode: value } )
							}
						/>
						)}
						<TextControl
							label={ __( 'Number of Casinos', 'wpvcb-blocks' ) }
							type='number'
							min='-1'
							max='4'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { no_of_posts: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Payment options in popup',
								'wpvcb-blocks'
							) }
							checked={ enable_payment_popup }
							onChange={ ( value ) =>
								setAttributes( { enable_payment_popup: value } )
							}
						/>
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
