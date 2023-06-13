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
registerBlockType( 'wpvcb/content-icon-block', { 
	title: __( 'Review - Content Icon Block', 'wpvcb-blocks' ), 
	icon: 'tide', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		logo: {
			type: 'string',
			default: ''
		},
		content: {
			type: 'string',
			default: ''
		},
		cta_partner: {
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
			logo,
			content,
			cta_partner,
		} = attributes;
		setAttributes( { post_id: getCurrentPostId() } );
		const bindPartnerData = [{ value: '', label: 'Select one...' }];
		let casdata = wpvcb_blocks_scripts_data_params.data.cas_data.cas_partners;
		casdata.map( function( data ){
			bindPartnerData.push( { value: data.value, label: data.label } );
		});

		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Review - Content Icon Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-content-icon-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-content-icon-block__selection">
						
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
						
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ content }
							onChange={ ( event, editor ) => {
								setAttributes( { content: editor.getData() } );
								setAttributes( { post_id: getCurrentPostId() } );
							  } }
						/>

						<SelectControl
							help={ __( 'For review page CTA Partner is not needed. Its overriden by current review one.', 'wpvcb-blocks' ) }
							label={ __( 'Select CTA partner', 'wpvcb-blocks' ) }
							value={ cta_partner } 
							options={ bindPartnerData }
							onChange={ ( value ) => {
								setAttributes( { cta_partner: value } );
								setAttributes( { post_id: getCurrentPostId() } );
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
