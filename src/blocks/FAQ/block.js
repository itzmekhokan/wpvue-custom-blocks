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
import { Fragment } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
const { getCurrentPostId } = wp.data.select("core/editor");
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	TextControl,
	ToggleControl,
	SelectControl,
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
registerBlockType( 'wpvcb/faq', { 
	title: __( 'FAQ', 'wpvcb-blocks' ), 
	icon: 'editor-help', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		faq_id: {
			type: 'string',
			default: ''
		},
		order: {
			type: 'string',
			default: 'ASC'
		},
		style: {
			type: 'string',
			default: 'normal'
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
			faq_id,
			order,
			style,
			bg_pattern,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		const bindFaqOptionData = [{ value: '', label: 'Select one...' }];
		let faqdata = wpvcb_blocks_scripts_data_params.data.pu_faq_headers;
		faqdata.map( function( data ){
			bindFaqOptionData.push( { value: data.id, label: data.faq_name } );
		});

		return (
			<Fragment>
				<Placeholder 
					icon= 'editor-help'
					label={ __( 'FAQ', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-faq"
				>
					<div className="wpvcb-block__selection wpvcb-block-faq__selection">
						<SelectControl
							help={ __( 'Select a FAQ added by Page Utils.', 'wpvcb-blocks' ) }
							label={ __( 'Select a FAQ', 'wpvcb-blocks' ) }
							value={ faq_id } 
							onChange={ ( value ) => {
								setAttributes( { faq_id: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
							options={ bindFaqOptionData }
						/>
						{/* <TextControl
							help={ __( 'Add Page Utils FAQ ID', 'wpvcb-blocks' ) }
							label={ __( 'Add FAQ ID', 'wpvcb-blocks' ) }
							value={ faq_id }
							onChange={ ( value ) => {
								setAttributes( { faq_id: value } );
							} }
						/> */}
						<SelectControl
							label={ __( 'FAQ Order', 'wpvcb-blocks' ) }
							value={ order }
							options={ [
								{ label: 'ASC', value: 'ASC' },
								{ label: 'DESC', value: 'DESC' },
							] }
							onChange={ ( value ) =>
								setAttributes( { order: value } )
							}
						/>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Normal', value: 'normal' },
								{ label: 'With backgrond', value: 'blue_bg' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ style == 'blue_bg' && (
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
