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
import { Fragment } from '@wordpress/element';
const { getCurrentPostId } = wp.data.select("core/editor");
import {
	PanelBody,
	Placeholder,
	RangeControl,
	TextControl,
	ToggleControl,
	SelectControl,
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

registerBlockType( 'wpvcb/alternative-payment-options', { 
	title: __( 'Alternative Payment Options', 'wpvcb-blocks' ), 
	icon: 'yes-alt', 
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
		style: {
			type: 'string',
			default: 'list'
		},
		enable_asset_cat_name: {
			type: 'boolean',
			default: false
		},
		asset_cat_name: {
			type: 'string',
			default: ''
		},
		enable_payment_zero_partners: {
			type: 'boolean',
			default: false
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
			orderby,
			style,
			post_id,
			enable_asset_cat_name,
			asset_cat_name,
			enable_selected_posts,
			post__in,
			enable_payment_zero_partners,
		} = attributes;

		const addExclude = () => { setAttributes( { post_id: getCurrentPostId() } ); }

		const bindPaymentOptionData = wpvcb_blocks_scripts_data_params.data.payment_methods;

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'yes-alt'
					label={ __( 'Alternative Payment Methods', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-alternative-payment-options"
				>
					<div className="wpvcb-block__selection wpvcb-block-alternative-payment-options__selection" onClick={ addExclude }>
						<TextControl
							type="hidden"
							value={ post_id }
						/>
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { post_id: getCurrentPostId() } );
								setAttributes( { block_title: value } );
							} }
						/>
						<TextControl
							label={ __( 'Description', 'wpvcb-blocks' ) }
							type='textarea'
							placeholder={ __( 'Description', 'wpvcb-blocks' ) }
							value={ block_description }
							onChange={ ( value ) => {
								setAttributes( { post_id: getCurrentPostId() } );
								setAttributes( { block_description: value } );
							} }
						/>
						{ !enable_selected_posts && (
						<TextControl
							label={ __( 'Number of posts', 'wpvcb-blocks' ) }
							type='number'
							min='-1'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { post_id: getCurrentPostId() } );
								setAttributes( { no_of_posts: value } );
							} }
						/>
						)}
						<ToggleControl
							label={ __(
								'Display Selected payment option only',
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
							defaultValue={ bindPaymentOptionData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindPaymentOptionData }
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
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Normal list', value: 'list' },
								{ label: 'List with filters', value: 'list_filter' },
							] }
							onChange={ ( value ) => {
								setAttributes( { post_id: getCurrentPostId() } );
								setAttributes( { style: value } )
							} }
						/>
						<ToggleControl
							label={ __(
								'Define Payment option asset category name',
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
							placeholder={ __( 'payment_option_logo_105x105', 'wpvcb-blocks' ) }
							value={ asset_cat_name }
							onChange={ ( value ) => {
								setAttributes( { asset_cat_name: value } );
							} }
						/>
						)}
						<ToggleControl
							label={ __(
								'Show payment with 0 partners',
								'wpvcb-blocks'
							) }
							checked={ enable_payment_zero_partners }
							onChange={ ( value ) =>
								setAttributes( { enable_payment_zero_partners: value } )
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
