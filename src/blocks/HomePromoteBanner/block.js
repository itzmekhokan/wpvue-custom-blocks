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
import {
	PanelBody,
	Placeholder,
	TextareaControl,
	TextControl,
	ToggleControl,
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
registerBlockType( 'wpvcb/home-promote-banner', { 
	title: __( 'Home Promote Banner', 'wpvcb-blocks' ), 
	icon: 'megaphone', 
	category: 'wpvcb', 
	attributes: {
		bg_image: {
			type: 'string',
			default: ''
		},
		banner_text: {
			type: 'string',
			default: ''
		},
		banner_text_tag: {
			type: 'string',
			default: 'p'
		},
		banner_btn_txt: {
			type: 'string',
			default: ''
		},
		visit_link: {
			type: 'string',
			default: ''
		},
		enable_visit_outlink: {
			type: 'string',
			default: ''
		},
		banner_logo: {
			type: 'string',
			default: ''
		},
		logo_link: {
			type: 'string',
			default: ''
		},
		enable_logo_outlink: {
			type: 'string',
			default: ''
		},
		promote1_img: {
			type: 'string',
			default: ''
		},
		promote1_link: {
			type: 'string',
			default: ''
		},
		enable_promote1_outlink: {
			type: 'string',
			default: ''
		},
		promote2_img: {
			type: 'string',
			default: ''
		},
		promote2_link: {
			type: 'string',
			default: ''
		},
		enable_promote2_outlink: {
			type: 'string',
			default: ''
		},
		promote3_img: {
			type: 'string',
			default: ''
		},
		promote3_link: {
			type: 'string',
			default: ''
		},
		enable_promote3_outlink: {
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
			bg_image,
			banner_text,
			banner_text_tag,
			visit_link,
			enable_visit_outlink,
			banner_btn_txt,
			banner_logo,
			logo_link,
			enable_logo_outlink,
			promote1_img,
			promote1_link,
			enable_promote1_outlink,
			promote2_img,
			promote2_link,
			enable_promote2_outlink,
			promote3_img,
			promote3_link,
			enable_promote3_outlink,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'megaphone'
					label={ __( 'Home Promote Banner', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-home-promote-banner"
				>
					<div className="wpvcb-block__selection wpvcb-block-home-promote-banner__selection">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { bg_image: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ bg_image }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ bg_image ? bg_image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !bg_image ? __( 'Upload Background Image', 'wpvcb-blocks' ) : __( 'Change Background Image', 'wpvcb-blocks' )  }
										/>
										{ bg_image && (
										<Button 
											onClick={ () => {
											setAttributes( { bg_image: '' } );
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
							label={ __( 'Banner Text', 'wpvcb-blocks' ) }
							value={ banner_text }
							onChange={ ( value ) => {
								setAttributes( { banner_text: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Banner Text Tag', 'wpvcb-blocks' ) }
							value={ banner_text_tag }
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
								setAttributes( { banner_text_tag: value } )
							}
						/>
						<TextControl
							label={ __( 'Banner Visit button Text', 'wpvcb-blocks' ) }
							value={ banner_btn_txt }
							onChange={ ( value ) => {
								setAttributes( { banner_btn_txt: value } );
							} }
						/>
						<TextControl
							label={ __( 'Visit Link', 'wpvcb-blocks' ) }
							value={ visit_link }
							onChange={ ( value ) => {
								setAttributes( { visit_link: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Visit outlink',
								'wpvcb-blocks'
							) }
							checked={ enable_visit_outlink }
							onChange={ ( value ) =>
								setAttributes( { enable_visit_outlink: value } )
							}
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { banner_logo: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ banner_logo }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ banner_logo ? banner_logo : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !banner_logo ? __( 'Upload Banner Image', 'wpvcb-blocks' ) : __( 'Change Banner Image', 'wpvcb-blocks' )  }
										/>
										{ banner_logo && (
										<Button 
											onClick={ () => {
											setAttributes( { banner_logo: '' } );
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
							label={ __( 'Logo Link', 'wpvcb-blocks' ) }
							value={ logo_link }
							onChange={ ( value ) => {
								setAttributes( { logo_link: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Logo outlink',
								'wpvcb-blocks'
							) }
							checked={ enable_logo_outlink }
							onChange={ ( value ) =>
								setAttributes( { enable_logo_outlink: value } )
							}
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { promote1_img: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ promote1_img }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ promote1_img ? promote1_img : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !promote1_img ? __( 'Upload Promote 1 Image', 'wpvcb-blocks' ) : __( 'Change Promote 1 Image', 'wpvcb-blocks' )  }
										/>
										{ promote1_img && (
										<Button 
											onClick={ () => {
											setAttributes( { promote1_img: '' } );
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
							label={ __( 'Promote 1 Link', 'wpvcb-blocks' ) }
							value={ promote1_link }
							onChange={ ( value ) => {
								setAttributes( { promote1_link: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Promote 1 outlink',
								'wpvcb-blocks'
							) }
							checked={ enable_promote1_outlink }
							onChange={ ( value ) =>
								setAttributes( { enable_promote1_outlink: value } )
							}
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { promote2_img: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ promote2_img }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ promote2_img ? promote2_img : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !promote2_img ? __( 'Upload Promote 2 Image', 'wpvcb-blocks' ) : __( 'Change Promote 2 Image', 'wpvcb-blocks' )  }
										/>
										{ promote2_img && (
										<Button 
											onClick={ () => {
											setAttributes( { promote2_img: '' } );
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
							label={ __( 'Promote 2 Link', 'wpvcb-blocks' ) }
							value={ promote2_link }
							onChange={ ( value ) => {
								setAttributes( { promote2_link: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Promote 2 outlink',
								'wpvcb-blocks'
							) }
							checked={ enable_promote2_outlink }
							onChange={ ( value ) =>
								setAttributes( { enable_promote2_outlink: value } )
							}
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { promote3_img: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ promote3_img }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ promote3_img ? promote3_img : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !promote3_img ? __( 'Upload Promote 3 Image', 'wpvcb-blocks' ) : __( 'Change Promote 3 Image', 'wpvcb-blocks' )  }
										/>
										{ promote3_img && (
										<Button 
											onClick={ () => {
											setAttributes( { promote3_img: '' } );
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
							label={ __( 'Promote 3 Link', 'wpvcb-blocks' ) }
							value={ promote3_link }
							onChange={ ( value ) => {
								setAttributes( { promote3_link: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Promote 3 outlink',
								'wpvcb-blocks'
							) }
							checked={ enable_promote3_outlink }
							onChange={ ( value ) =>
								setAttributes( { enable_promote3_outlink: value } )
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
