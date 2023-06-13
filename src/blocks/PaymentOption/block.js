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
registerBlockType( 'wpvcb/payment-option-block', { 
	title: __( 'Review - Payment Option Block', 'wpvcb-blocks' ), 
	icon: 'tide', 
	category: 'wpvcb', 
	attributes: {
		icon: {
			type: 'string',
			default: ''
		},
		withdrawal_methods_label: {
			type: 'string',
			default: ''
		},
		deposit_methods_label: {
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
			withdrawal_methods_label,
			deposit_methods_label,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Review - Payment Option Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-payment-option-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-payment-option-block__selection">
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
							label={ __( 'withdrawal methods label', 'wpvcb-blocks' ) }
							value={ withdrawal_methods_label }
							onChange={ ( value ) => {
								setAttributes( { withdrawal_methods_label: value } );
							} }
						/>
						<TextControl
							label={ __( 'Deposit methods label', 'wpvcb-blocks' ) }
							value={ deposit_methods_label }
							onChange={ ( value ) => {
								setAttributes( { deposit_methods_label: value } );
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
