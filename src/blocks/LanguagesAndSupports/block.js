/**
 * BLOCK: Review Details
 *
 */

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
import {
	PanelBody,
	Placeholder,
	TextareaControl,
	ToggleControl,
	TextControl,
	SelectControl,
	Button,
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
registerBlockType( 'wpvcb/languages-supports-block', { 
	title: __( 'Review - Supported Languages & Supports', 'wpvcb-blocks' ), 
	icon: 'tide', 
	category: 'wpvcb', 
	attributes: {
		icon: {
			type: 'string',
			default: ''
		},
		customer_support_information_label: {
			type: 'string',
			default: ''
		},
		live_chat_available_label: {
			type: 'string',
			default: ''
		},
		phone_is_not_available_label: {
			type: 'string',
			default: ''
		},
		supported_languages_label: {
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
			icon,
			customer_support_information_label,
			live_chat_available_label,
			phone_is_not_available_label,
			supported_languages_label,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Review - Supported Languages & Supports', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-languages-supports-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-languages-supports-block__selection">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { icon: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ icon }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ icon ? icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !icon ? __( 'Upload Image', 'wpvcb-blocks' ) : __( 'Change Image', 'wpvcb-blocks' )  }
										/>
										{ icon && (
										<Button 
											onClick={ () => {
											setAttributes( { icon: '' } );
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
						<TextControl
							label={ __( 'Customer Support Information label', 'wpvcb-blocks' ) }
							value={ customer_support_information_label }
							onChange={ ( value ) => {
								setAttributes( { customer_support_information_label: value } );
							} }
						/>
						<TextControl
							label={ __( '24/7 Live chat available label', 'wpvcb-blocks' ) }
							value={ live_chat_available_label }
							onChange={ ( value ) => {
								setAttributes( { live_chat_available_label: value } );
							} }
						/>
						<TextControl
							label={ __( 'Phone is not available label', 'wpvcb-blocks' ) }
							value={ phone_is_not_available_label }
							onChange={ ( value ) => {
								setAttributes( { phone_is_not_available_label: value } );
							} }
						/>
						<TextControl
							label={ __( 'Supported Languages label', 'wpvcb-blocks' ) }
							value={ supported_languages_label }
							onChange={ ( value ) => {
								setAttributes( { supported_languages_label: value } );
							} }
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
