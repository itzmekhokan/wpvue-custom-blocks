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
const { getCurrentPostId } = wp.data.select("core/editor");
import {
	PanelBody,
	Placeholder,
	TextareaControl,
	TextControl,
	ToggleControl,
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
registerBlockType( 'wpvcb/whitebg-content-block', { 
	title: __( 'White BG Content Block', 'wpvcb-blocks' ), 
	icon: 'feedback', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		title: {
			type: 'string',
			default: ''
		},
		has_title_icon: {
			type: 'boolean',
			default: false
		},
		title_icon: {
			type: 'string',
			default: ''
		},
		has_content_icon: {
			type: 'boolean',
			default: false
		},
		content_icon: {
			type: 'string',
			default: ''
		},
		content: {
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
			title,
			has_title_icon,
			title_icon,
			has_content_icon,
			content_icon,
			content,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'feedback'
					label={ __( 'White BG Content Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-whitebg-content-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-whitebg-content-block__selection">
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							value={ title }
							onChange={ ( value ) => {
								setAttributes( { title: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Title Icon',
								'wpvcb-blocks'
							) }
							checked={ has_title_icon }
							onChange={ ( value ) =>
								setAttributes( { has_title_icon: value } )
							}
						/>
						{ has_title_icon && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { title_icon: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ title_icon }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ title_icon ? title_icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !title_icon ? __( 'Upload Icon', 'wpvcb-blocks' ) : __( 'Change Icon', 'wpvcb-blocks' )  }
										/>
										{ title_icon && (
										<Button 
											onClick={ () => {
											setAttributes( { title_icon: '' } );
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
						{/* <TextareaControl
							label={ __( 'Content', 'wpvcb-blocks' ) }
							value={ content }
							onChange={ ( value ) => {
								setAttributes( { content: value } );
							} }
						/> */}
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ content }
							onChange={ ( event, editor ) => {
								setAttributes( { content: editor.getData() } );
							  } }
						/>
						<ToggleControl
							label={ __(
								'Enable Content Image',
								'wpvcb-blocks'
							) }
							checked={ has_content_icon }
							onChange={ ( value ) =>
								setAttributes( { has_content_icon: value } )
							}
						/>
						{ has_content_icon && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { content_icon: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ content_icon }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ content_icon ? content_icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !content_icon ? __( 'Upload Icon', 'wpvcb-blocks' ) : __( 'Change Icon', 'wpvcb-blocks' )  }
										/>
										{ content_icon && (
										<Button 
											onClick={ () => {
											setAttributes( { content_icon: '' } );
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
