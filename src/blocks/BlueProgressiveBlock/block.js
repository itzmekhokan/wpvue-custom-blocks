/**
 * BLOCK: Review Details
 *
 */

//  Import CSS.
import './editor.scss';
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
registerBlockType( 'wpvcb/blue-progressive-block', { 
	title: __( 'Blue Progressive Block', 'wpvcb-blocks' ), 
	icon: 'tide', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		enable_bg: {
			type: 'boolean',
			default: false
		},
		bg_pattern: {
			type: 'string',
			default: ''
		},
		title: {
			type: 'string',
			default: ''
		},
		title_tag: {
			type: 'string',
			default: 'h3'
		},
		logo: {
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
			enable_bg,
			bg_pattern,
			title,
			title_tag,
			logo,
			content,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Blue Progressive Block Data', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-blue-progressive-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-blue-progressive-block__selection">
						<ToggleControl
							label={ __(
								'Enable Background Image',
								'wpvcb-blocks'
							) }
							checked={ enable_bg }
							onChange={ ( value ) =>
								setAttributes( { enable_bg: value } )
							}
						/>
						{ enable_bg && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { bg_pattern: media.url } );
									setAttributes( { post_id: getCurrentPostId() } );
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
						)}
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							value={ title }
							onChange={ ( value ) => {
								setAttributes( { title: value } );
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
							] }
							onChange={ ( value ) =>
								setAttributes( { title_tag: value } )
							}
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { logo: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ logo }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ logo ? logo : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !logo ? __( 'Upload Image', 'wpvcb-blocks' ) : __( 'Change Image', 'wpvcb-blocks' )  }
										/>
										{ logo && (
										<Button 
											onClick={ () => {
											setAttributes( { logo: '' } );
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
