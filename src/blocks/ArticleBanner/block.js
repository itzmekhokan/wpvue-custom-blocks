/**
 * BLOCK: Article Banner
 *
 */

//  Import CSS.
import './editor.scss';
//import './style.scss';

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { bulletConfiguration } from '../../utils.js';
const { getCurrentPostId } = wp.data.select("core/editor");
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
registerBlockType( 'wpvcb/article-banner', { 
	title: __( 'Article Banner', 'wpvcb-blocks' ), 
	icon: 'format-image', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		image_id: {
			type: 'string',
			default: ''
		},
		image: {
			type: 'string',
			default: ''
		},
		enable_text: {
			type: 'boolean',
			default: false
		},
		text: {
			type: 'string',
			default: ''
		},
		text_tag: {
			type: 'string',
			default: 'h2'
		},
		content_width: {
			type: 'string',
			default: ''
		},
		enable_text_logo: {
			type: 'boolean',
			default: false
		},
		text_logo: {
			type: 'string',
			default: ''
		},
		text_align: {
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
			image_id,
			image,
			enable_text,
			text,
			content_width,
			enable_text_logo,
			text_logo,
			text_tag,
			text_align,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'format-image'
					label={ __( 'Article Banner', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-article-banner"
				>
					<div className="wpvcb-block__selection wpvcb-block-article-banner__selection">
						
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { image: media.url } );
									setAttributes( { image_id: media.id } );
									setAttributes( { post_id: getCurrentPostId() } );
								} }
								allowedTypes={ ['image'] }
								value={ image }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ image ? image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !image ? __( 'Add banner image', 'wpvcb-blocks' ) : __( 'Change banner image', 'wpvcb-blocks' )  }
										/>
										{ image && (
										<Button 
											onClick={ () => {
											setAttributes( { image: '' } );
											setAttributes( { image_id: '' } );
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
						<SelectControl
							label={ __( 'Banner Width', 'wpvcb-blocks' ) }
							value={ content_width }
							options={ [
								{ label: 'Full Content width', value: 'content_text' },
								{ label: 'Full Page width', value: 'content_page' },
							] }
							onChange={ ( value ) =>
								setAttributes( { content_width: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Add Text',
								'wpvcb-blocks'
							) }
							checked={ enable_text }
							onChange={ ( value ) =>
								setAttributes( { enable_text: value } )
							}
						/>
						{ enable_text && (
						<TextControl
							label={ __( 'Text', 'wpvcb-blocks' ) }
							value={ text }
							onChange={ ( value ) => {
								setAttributes( { text: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
						/>
						)}
						{ enable_text && (
						<SelectControl
							label={ __( 'Text Tag', 'wpvcb-blocks' ) }
							value={ text_tag }
							options={ [
								{ label: 'h1', value: 'h1' },
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'h5', value: 'h5' },
								{ label: 'h6', value: 'h6' },
								{ label: 'p', value: 'p' },
							] }
							onChange={ ( value ) =>
								setAttributes( { text_tag: value } )
							}
						/>
						)}
						<ToggleControl
							label={ __(
								'Add Text Logo',
								'wpvcb-blocks'
							) }
							checked={ enable_text_logo }
							onChange={ ( value ) =>
								setAttributes( { enable_text_logo: value } )
							}
						/>
						{ enable_text_logo && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { text_logo: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ text_logo }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ text_logo ? text_logo : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !text_logo ? __( 'Add text logo', 'wpvcb-blocks' ) : __( 'Change text logo', 'wpvcb-blocks' )  }
										/>
										{ text_logo && (
										<Button 
											onClick={ () => {
											setAttributes( { text_logo: '' } );
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
						)}
						{ ( enable_text_logo || enable_text ) && (
						<SelectControl
							label={ __( 'Text / Text Logo Align', 'wpvcb-blocks' ) }
							value={ text_align }
							options={ [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							] }
							onChange={ ( value ) =>
								setAttributes( { text_align: value } )
							}
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
