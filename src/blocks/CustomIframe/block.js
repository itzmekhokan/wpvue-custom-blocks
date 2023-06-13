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
import { ChromePicker } from "react-color";
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
registerBlockType( 'wpvcb/custom-iframe', { 
	title: __( 'Custom iframe', 'wpvcb-blocks' ), 
	icon: 'welcome-view-site', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		url: {
			type: 'string',
			default: ''
		},
		align: {
			type: 'string',
			default: ''
		},
		bg_color: {
			type: 'string',
			default: ''
		},
		enable_for_gamepage: {
			type: 'boolean',
			default: false
		},
		displayColorPicker_bg: {
			type: 'boolean',
			default: false
		},
		enable_different_game_url_for_mobile: {
			type: 'boolean',
			default: false
		},
		mobile_game_iframe_url: {
			type: 'string',
			default: ''
		},
		game_desktop_banner: {
			type: 'string',
			default: ''
		},
		game_mobile_banner: {
			type: 'string',
			default: ''
		},
		game_title: {
			type: 'string',
			default: ''
		},
		enable_overlay: {
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
			post_id,
			url,
			enable_for_gamepage,
			align,
			bg_color,
			displayColorPicker_bg,
			enable_different_game_url_for_mobile,
			mobile_game_iframe_url,
			game_desktop_banner,
			game_mobile_banner,
			game_title,
			enable_overlay,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		const pickerstyles = {
			bg_color: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ bg_color }`,
			},
			popover: {
				position: 'absolute',
				zIndex: '2',
			},
			cover: {
				position: 'fixed',
				top: '0px',
				right: '0px',
				bottom: '0px',
				left: '0px',
			},
		}

		const handleColorPicker_bg = () => {
			props.setAttributes( { displayColorPicker_bg: !displayColorPicker_bg } );
		};

		const handleCloseColorPicker_bg = () => {
			props.setAttributes( { displayColorPicker_bg: false } );
		};

		return (
			<Fragment>
				<Placeholder 
					icon= 'welcome-view-site'
					label={ __( 'Custom iframe', 'wpvcb-blocks' ) }
					className="wpvcb-block custom-iframe"
				>
					<div className="wpvcb-block__selection custom-iframe__selection">
						
						<TextControl
							label={ __( 'Iframe Url', 'wpvcb-blocks' ) }
							value={ url }
							onChange={ ( value ) => {
								setAttributes( { url: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable for game page',
								'wpvcb-blocks'
							) }
							checked={ enable_for_gamepage }
							onChange={ ( value ) =>
								setAttributes( { enable_for_gamepage: value } )
							}
						/>
						{ enable_for_gamepage && (
						<PanelBody title={__( 'For Game page uses', 'wpvcb-blocks' )} initialOpen={ false }>
							<TextControl
								label={ __( 'Game Title', 'wpvcb-blocks' ) }
								value={ game_title }
								onChange={ ( value ) => {
									setAttributes( { game_title: value } );
								} }
							/>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => {
										setAttributes( { game_desktop_banner: media.url } );
									} }
									allowedTypes={ ['image'] }
									value={ game_desktop_banner }
									render={ ( { open } ) => (
										<div class="wpvcb-media-preview-wrap">
											<img 
											class="media-upload-img" 
											onClick={ open } 
											src={ game_desktop_banner ? game_desktop_banner : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
											title={ !game_desktop_banner ? __( 'Upload Desktop Banner Image', 'wpvcb-blocks' ) : __( 'Change Desktop Banner Image', 'wpvcb-blocks' )  }
											/>
											{ game_desktop_banner && (
											<Button 
												onClick={ () => {
												setAttributes( { game_desktop_banner: '' } );
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
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => {
										setAttributes( { game_mobile_banner: media.url } );
									} }
									allowedTypes={ ['image'] }
									value={ game_mobile_banner }
									render={ ( { open } ) => (
										<div class="wpvcb-media-preview-wrap">
											<img 
											class="media-upload-img" 
											onClick={ open } 
											src={ game_mobile_banner ? game_mobile_banner : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
											title={ !game_mobile_banner ? __( 'Upload Mobile Banner Image', 'wpvcb-blocks' ) : __( 'Change Mobile Banner Image', 'wpvcb-blocks' )  }
											/>
											{ game_mobile_banner && (
											<Button 
												onClick={ () => {
												setAttributes( { game_mobile_banner: '' } );
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
							<ToggleControl
								label={ __(
									'Enable different game url for mobile',
									'wpvcb-blocks'
								) }
								checked={ enable_different_game_url_for_mobile }
								onChange={ ( value ) =>
									setAttributes( { enable_different_game_url_for_mobile: value } )
								}
							/>
							{ enable_different_game_url_for_mobile && (
							<TextControl
								label={ __( 'Mobile Game Iframe Url', 'wpvcb-blocks' ) }
								value={ mobile_game_iframe_url }
								onChange={ ( value ) => {
									setAttributes( { mobile_game_iframe_url: value } );
								} }
							/>
							) }
							<ToggleControl
								label={ __(
									'Enable overlay',
									'wpvcb-blocks'
								) }
								checked={ enable_overlay }
								onChange={ ( value ) =>
									setAttributes( { enable_overlay: value } )
								}
							/>
						</PanelBody>
						)}
						<SelectControl
							label={ __( 'Alignment', 'wpvcb-blocks' ) }
							value={ align }
							options={ [
								{ label: 'Vertical', value: 'vertical' },
								{ label: 'Horizontal', value: 'horizontal' },
							] }
							onChange={ ( value ) =>
								setAttributes( { align: value } )
							}
						/>
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_bg }>{ __( 'Background color', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_bg } style={ pickerstyles.bg_color } />
							{ displayColorPicker_bg ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_bg }/>
								<ChromePicker 
									color={ bg_color } 
									onChangeComplete={ ( color ) => setAttributes( { bg_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
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
