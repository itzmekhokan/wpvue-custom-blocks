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
const { InspectorControls } = wp.editor;
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfiguration } from '../../utils.js';
const { getCurrentPostId } = wp.data.select("core/editor");
import {
	PanelBody,
	Placeholder,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
	Button,
	IconButton,
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
registerBlockType( 'wpvcb/comparison-list-block', { 
	title: __( 'Comparison Block', 'wpvcb-blocks' ), 
	icon: 'sort', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		block_title: {
			type: 'string',
			default: '',
		},
		header_logo: {
			type: 'boolean',
			default: true,
		},
		style: {
			type: 'string',
			default: 'normal',
		},
		enabled_review_partner_procons: {
			type: 'boolean',
			default: false,
		},
		left_heading: {
			type: 'string',
			default: '',
		},
		left_icon: {
			type: 'string',
			default: '',
		},
		left_list_content: {
			type: 'string',
			default: '',
		},
		right_heading: {
			type: 'string',
			default: '',
		},
		right_icon: {
			type: 'string',
			default: '',
		},
		right_list_content: {
			type: 'string',
			default: '',
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
			header_logo,
			style,
			enabled_review_partner_procons,
			left_heading,
			left_icon,
			left_list_content,
			right_heading,
			right_icon,
			right_list_content,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'sort'
					label={ __( 'Comparision Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-comparison-list-block"
				>
				<div className="wpvcb-block__selection wpvcb-block-comparison-list-block__selection">
						
				{/* <InspectorControls key="inspector">
					<PanelBody
						title={ __( 'Layout', 'wpvcb-blocks' ) }
						initialOpen = { true }
					>
						
					</PanelBody>
				</InspectorControls> */}
				<TextControl
					label={ __( 'Block Title', 'wpvcb-blocks' ) }
					placeholder={ __( 'Add block title', 'wpvcb-blocks' ) }
					value={ block_title }
					onChange={ ( value ) => {
						setAttributes( { block_title: value } );
						setAttributes( { post_id: getCurrentPostId() } );
					} }
				/>
				<ToggleControl
					label={ __(
						'Enable Header Icon',
						'wpvcb-blocks'
					) }
					help={
						header_logo
							? __(
								'Header Icon is visible.',
								'wpvcb-blocks'
							)
							: __(
								'Header Icon is hidden.',
								'wpvcb-blocks'
							)
					}
					checked={ header_logo }
					onChange={ ( value ) =>
						setAttributes( { header_logo: value } )
					}
				/>
				<ToggleControl
					label={ __(
						'Enable review partner procons',
						'wpvcb-blocks'
					) }
					
					checked={ enabled_review_partner_procons }
					onChange={ ( value ) =>
						setAttributes( { enabled_review_partner_procons: value } )
					}
				/>
				<SelectControl
					label={ __( 'Style', 'wpvcb-blocks' ) }
					value={ style }
					options={ [
						{ label: 'Pros Cons Comparison', value: 'pros_cons_comparison' },
						{ label: 'General Comparison', value: 'general_comparison' },
					] }
					onChange={ ( value ) =>
						setAttributes( { style: value } )
					}
				/>
				
				{ !enabled_review_partner_procons && (
				<PanelBody title={__( 'Left Side List', 'wpvcb-blocks' )} initialOpen={ true }>
						<TextControl
							label={ __( 'Heading', 'wpvcb-blocks' ) }
							value={ left_heading }
							onChange={ ( value ) => {
								setAttributes( { left_heading: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
						/>
						{ header_logo && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { left_icon: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ left_icon }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ left_icon ? left_icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !left_icon ? __( 'Upload Icon', 'wpvcb-blocks' ) : __( 'Change Icon', 'wpvcb-blocks' )  }
										/>
										{ left_icon && (
										<Button 
											onClick={ () => {
											setAttributes( { left_icon: '' } );
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
							label={ __( 'Left Content', 'wpvcb-blocks' ) }
							value={ left_list_content }
							onChange={ ( value ) => {
								setAttributes( { left_list_content: value } );
							} }
						/> */}
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ left_list_content }
							onChange={ ( event, editor ) => {
								setAttributes( { left_list_content: editor.getData() } );
							  } }
						/>
					
				</PanelBody>
				)}
				{ !enabled_review_partner_procons && (
				<PanelBody title={__( 'Right Side List', 'wpvcb-blocks' )} initialOpen={ false }>
						<TextControl
							label={ __( 'Heading', 'wpvcb-blocks' ) }
							value={ right_heading }
							onChange={ ( value ) => {
								setAttributes( { right_heading: value } );
							} }
						/>
						{ header_logo && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { right_icon: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ right_icon }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ right_icon ? right_icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !right_icon ? __( 'Upload Icon', 'wpvcb-blocks' ) : __( 'Change Icon', 'wpvcb-blocks' )  }
										/>
										{ right_icon && (
										<Button 
											onClick={ () => {
											setAttributes( { right_icon: '' } );
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
							label={ __( 'Right Content', 'wpvcb-blocks' ) }
							value={ right_list_content }
							onChange={ ( value ) => {
								setAttributes( { right_list_content: value } );
							} }
						/> */}
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ right_list_content }
							onChange={ ( event, editor ) => {
								setAttributes( { right_list_content: editor.getData() } );
							  } }
						/>
					
				</PanelBody>
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
