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
import Select from 'react-select';
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
registerBlockType( 'wpvcb/exclusive-casino', { 
	title: __( 'Exclusive Casino', 'wpvcb-blocks' ), 
	icon: 'megaphone', 
	category: 'wpvcb', 
	attributes: {
		first_card_logo: {
			type: 'string',
			default: ''
		},
		first_card_text1: {
			type: 'string',
			default: ''
		},
		first_card_text2: {
			type: 'string',
			default: ''
		},
		first_card_text3: {
			type: 'string',
			default: ''
		},
		first_card_btn_text: {
			type: 'string',
			default: ''
		},
		first_card_btn_link: {
			type: 'string',
			default: ''
		},
		first_card_tnc_text: {
			type: 'string',
			default: ''
		},
		first_card_tnc_link: {
			type: 'string',
			default: ''
		},
		enable_selected_casino: {
			type: 'boolean',
			default: false
		},
		selected_casinos: {
			type: 'string',
			default: null
		},
		enable_excluded_casino: {
			type: 'boolean',
			default: false
		},
		excluded_casinos: {
			type: 'string',
			default: null
		},
		hide_less3_casinos: {
			type: 'boolean',
			default: false
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
			first_card_logo,
			first_card_text1,
			first_card_text2,
			first_card_text3,
			first_card_btn_text,
			first_card_btn_link,
			first_card_tnc_text,
			first_card_tnc_link,
			enable_selected_casino,
			selected_casinos,
			enable_excluded_casino,
			excluded_casinos,
			hide_less3_casinos,
		} = attributes;

		let bindCasinoOptionData = wpvcb_blocks_scripts_data_params.data.cas_data.exclusive_casinos;

		const handleSelectChange = ( selected_casinos ) => setAttributes( { selected_casinos: JSON.stringify( selected_casinos ) } );

		if ( JSON.parse( selected_casinos ) != null && JSON.parse( selected_casinos ).length === 3 ) {
			bindCasinoOptionData = [];
		}

		const bindExcludeCasinoOptionData = wpvcb_blocks_scripts_data_params.data.cas_data.exclusive_casinos;

		const handleExcludeSelectChange = ( excluded_casinos ) => setAttributes( { excluded_casinos: JSON.stringify( excluded_casinos ) } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'megaphone'
					label={ __( 'Exclusive Casinos', 'wpvcb-blocks' ) }
					instructions={ __( 'Display informative card with 3 exclusive casinos.', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-exclusive-casino"
				>
					<div className="wpvcb-block__selection wpvcb-block-exclusive-casino__selection">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { first_card_logo: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ first_card_logo }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ first_card_logo ? first_card_logo : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !first_card_logo ? __( 'Upload Logo Image', 'wpvcb-blocks' ) : __( 'Change Logo Image', 'wpvcb-blocks' )  }
										/>
										{ first_card_logo && (
										<Button 
											onClick={ () => {
											setAttributes( { first_card_logo: '' } );
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
							label={ __( 'First Card Text 1', 'wpvcb-blocks' ) }
							value={ first_card_text1 }
							onChange={ ( value ) => {
								setAttributes( { first_card_text1: value } );
							} }
						/>
						<TextControl
							label={ __( 'First Card Text 2', 'wpvcb-blocks' ) }
							value={ first_card_text2 }
							onChange={ ( value ) => {
								setAttributes( { first_card_text2: value } );
							} }
						/>
						<TextControl
							label={ __( 'First Card Text 3', 'wpvcb-blocks' ) }
							value={ first_card_text3 }
							onChange={ ( value ) => {
								setAttributes( { first_card_text3: value } );
							} }
						/>
						<TextControl
							label={ __( 'First Card Button Text', 'wpvcb-blocks' ) }
							value={ first_card_btn_text }
							onChange={ ( value ) => {
								setAttributes( { first_card_btn_text: value } );
							} }
						/>
						<TextControl
							label={ __( 'First Card Button link', 'wpvcb-blocks' ) }
							value={ first_card_btn_link }
							onChange={ ( value ) => {
								setAttributes( { first_card_btn_link: value } );
							} }
						/>
						<TextControl
							label={ __( 'First Card T&C Text', 'wpvcb-blocks' ) }
							value={ first_card_tnc_text }
							onChange={ ( value ) => {
								setAttributes( { first_card_tnc_text: value } );
							} }
						/>
						<TextControl
							label={ __( 'First Card T&C link', 'wpvcb-blocks' ) }
							value={ first_card_tnc_link }
							onChange={ ( value ) => {
								setAttributes( { first_card_tnc_link: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Display Selected 3 Exclusive casinos only',
								'wpvcb-blocks'
							) }
							checked={ enable_selected_casino }
							onChange={ ( value ) =>
								setAttributes( { enable_selected_casino: value } )
							}
						/>
						{ enable_selected_casino && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='post__in'
							className='basic-multi-select'
							defaultValue={ bindCasinoOptionData }
                        	value={ JSON.parse( selected_casinos ) }
                        	onChange={ handleSelectChange }
                        	options={ bindCasinoOptionData }
							isMulti='true'
                        />
						)}
						<ToggleControl
							label={ __(
								'Enable excluded Exclusive casinos',
								'wpvcb-blocks'
							) }
							checked={ enable_excluded_casino }
							onChange={ ( value ) =>
								setAttributes( { enable_excluded_casino: value } )
							}
						/>
						{ enable_excluded_casino && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='post__in'
							className='basic-multi-select'
							defaultValue={ bindExcludeCasinoOptionData }
                        	value={ JSON.parse( excluded_casinos ) }
                        	onChange={ handleExcludeSelectChange }
                        	options={ bindExcludeCasinoOptionData }
							isMulti='true'
                        />
						)}
						<ToggleControl
							label={ __(
								'Hide if less than 3 exclusive casinos matches',
								'wpvcb-blocks'
							) }
							checked={ hide_less3_casinos }
							onChange={ ( value ) =>
								setAttributes( { hide_less3_casinos: value } )
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
