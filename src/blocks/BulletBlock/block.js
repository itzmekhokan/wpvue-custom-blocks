/**
 * BLOCK: Review Details
 *
 */

//  Import CSS.
//import './editor.scss';
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
registerBlockType( 'wpvcb/bullet-block', { 
	title: __( 'Bullet Block', 'wpvcb-blocks' ), 
	icon: 'editor-ul', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		bullet_style: {
			type: 'string',
			default: ''
		},
		custom_bullet: {
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
			bullet_style,
			custom_bullet,
			content,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'editor-ul'
					label={ __( 'Bullet Block Data', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-bullet-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-bullet-block__selection">
						<SelectControl
							label={ __( 'Bullet Style', 'wpvcb-blocks' ) }
							value={ bullet_style }
							options={ [
								{ label: 'Blue list', value: 'blue' },
								{ label: 'Green list', value: 'green' },
								{ label: 'Normal list', value: 'list', disabled: true },
								{ label: 'Tick list', value: 'tick', disabled: true },
								{ label: 'Custom List', value: 'custom', disabled: true },
							] }
							onChange={ ( value ) =>
								setAttributes( { bullet_style: value } )
							}
						/>
						{ bullet_style == 'custom' && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { custom_bullet: media.url } );
									setAttributes( { post_id: getCurrentPostId() } );
								} }
								allowedTypes={ ['image'] }
								value={ custom_bullet }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ custom_bullet ? custom_bullet : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !custom_bullet ? __( 'Add bullet style image', 'wpvcb-blocks' ) : __( 'Change bullet style image', 'wpvcb-blocks' )  }
										/>
										{ custom_bullet && (
										<Button 
											onClick={ () => {
											setAttributes( { custom_bullet: '' } );
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
					
						<CKEditor
							config={ bulletConfiguration }
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
