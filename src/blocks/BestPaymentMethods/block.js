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
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfiguration } from '../../utils.js';
const { getCurrentPostId } = wp.data.select("core/editor");
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	SelectControl,
	TextControl,
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
registerBlockType( 'wpvcb/best-payment-methods', { 
	title: __( 'Best Payment Methods', 'wpvcb-blocks' ), 
	icon: 'tickets-alt', 
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
		title_tag: {
			type: 'string',
			default: 'h2'
		},
		before_content: {
			type: 'string',
			default: ''
		},
		after_content: {
			type: 'string',
			default: ''
		},
		style: {
			type: 'string',
			default: 'card'
		},
		no_of_posts: {
			type: 'string',
			default: ''
		},
		enable_selected_games: {
			type: 'boolean',
			default: false
		},
		post__in: {
			type: 'string',
			default: null
		},
		enable_asset_cat_name: {
			type: 'boolean',
			default: false
		},
		asset_cat_name: {
			type: 'string',
			default: ''
		},
		enable_show_all_link: {
			type: 'boolean',
			default: false
		},
		show_all_label: {
			type: 'string',
			default: ''
		},
		show_all_link: {
			type: 'string',
			default: ''
		},
		bg_pattern: {
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
			post_id,
			block_title,
			title_tag,
			before_content,
			after_content,
			style,
			no_of_posts,
			enable_selected_games,
			post__in,
			enable_asset_cat_name,
			asset_cat_name,
			enable_show_all_link,
			show_all_label,
			show_all_link,
			bg_pattern,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		const bindPaymentOptionData = wpvcb_blocks_scripts_data_params.data.payment_methods;

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'tickets-alt'
					label={ __( 'Best Payment Methods', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-best-payment-methods"
				>
					<div className="wpvcb-block__selection wpvcb-block-best-payment-methods__selection">
						<TextControl
							placeholder={ __( 'Add some title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
						/>
						<SelectControl
							label={ __( 'Title Tag', 'wpvcb-blocks' ) }
							value={ title_tag }
							options={ [
								{ label: 'h1', value: 'h1' },
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'h5', value: 'h5' },
								{ label: 'h6', value: 'h6' },
								{ label: 'span', value: 'span' },
							] }
							onChange={ ( value ) =>
								setAttributes( { title_tag: value } )
							}
						/>
						<label>{ __( 'Before Card Content', 'wpvcb-blocks' ) }</label>
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ before_content }
							onChange={ ( event, editor ) => {
								setAttributes( { before_content: editor.getData() } );
							  } }
						/>
						<label>{ __( 'After Card Content', 'wpvcb-blocks' ) }</label>
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ after_content }
							onChange={ ( event, editor ) => {
								setAttributes( { after_content: editor.getData() } );
							  } }
						/>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Cards', value: 'card' },
								{ label: 'Carousel', value: 'carousel' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ !enable_selected_games && (
						<TextControl
							label={ __( 'Number of posts', 'wpvcb-blocks' ) }
							type='number'
							min='-1'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { no_of_posts: value } );
							} }
						/>
						)}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { bg_pattern: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ bg_pattern }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ bg_pattern ? bg_pattern : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !bg_pattern ? __( 'Add background pattern', 'wpvcb-blocks' ) : __( 'Change background pattern', 'wpvcb-blocks' )  }
										/>
										{ bg_pattern && (
										<Button 
											onClick={ () => {
											setAttributes( { bg_pattern: '' } );
											} } 
											className="remove-img"
											isLink isDestructive>
											{__('Remove', 'wpvcb-blocks')}
										</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>
						<ToggleControl
							label={ __(
								'Display Selected payment option only',
								'wpvcb-blocks'
							) }
							checked={ enable_selected_games }
							onChange={ ( value ) =>
								setAttributes( { enable_selected_games: value } )
							}
						/>
						{ enable_selected_games && (
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
								'Enable show all link',
								'wpvcb-blocks'
							) }
							checked={ enable_show_all_link }
							onChange={ ( value ) =>
								setAttributes( { enable_show_all_link: value } )
							}
						/>
						{ enable_show_all_link && (
						<TextControl
							label={ __( 'Show all label', 'wpvcb-blocks' ) }
							placeholder={ __( 'Show All', 'wpvcb-blocks' ) }
							value={ show_all_label }
							onChange={ ( value ) => {
								setAttributes( { show_all_label: value } );
							} }
						/>
						)}
						{ enable_show_all_link && (
						<TextControl
							label={ __( 'Show all link', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add your page slug here', 'wpvcb-blocks' ) }
							value={ show_all_link }
							onChange={ ( value ) => {
								setAttributes( { show_all_link: value } );
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
