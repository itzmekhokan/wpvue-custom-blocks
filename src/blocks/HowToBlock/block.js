/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
import './editor.scss';
// import './style.scss';
//import { ChromePicker } from "react-color";

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfiguration } from '../../utils.js';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
const { getCurrentPostId } = wp.data.select("core/editor");
import { ChromePicker } from "react-color";
import {
	Button,
	ColorPicker,
	PanelBody,
	Placeholder,
	RangeControl,
	RadioControl,
	TextControl,
	TextareaControl,
	SelectControl,
	ToggleControl,
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

registerBlockType( 'wpvcb/howto-block', { 
	title: __( 'How-to Block', 'wpvcb-blocks' ), 
	icon: 'editor-ol', 
	category: 'wpvcb',
	keywords: [
		__( 'How-to', 'wpvcb-blocks' ),
		__( 'Steps', 'wpvcb-blocks' ),
		__( 'How to steps', 'wpvcb-blocks' ),
	], 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		title: {
			type: 'string',
			default: ''
		},
		title_tag: {
			type: 'string',
			default: 'h2'
		},
		intro: {
			type: 'string',
			default: ''
		},
		enable_background: {
			type: 'boolean',
			default: false
		},
		custom_bg_color: {
			type: 'string',
			default: ''
		},
		displayColorPicker_custom_bg: {
			type: 'boolean',
			default: false
		},
		custom_font_color: {
			type: 'string',
			default: ''
		},
		displayColorPicker_custom_font: {
			type: 'boolean',
			default: false
		},
		bg_image: {
			type: 'string',
			default: ''
		},
		enable_mobile_bg: {
			type: 'boolean',
			default: false
		},
		mobile_bg: {
			type: 'string',
			default: ''
		},
		hide_list_numbers: {
			type: 'boolean',
			default: false
		},
		enable_totaltime: {
			type: 'boolean',
			default: false
		},
		duration_DD: {
			type: 'string',
			default: ''
		},
		duration_HH: {
			type: 'string',
			default: ''
		},
		duration_MM: {
			type: 'string',
			default: ''
		},
		enable_supply: {
			type: 'boolean',
			default: false
		},
		supply_data: {
			type: 'string',
			default: ''
		},
		enable_tool: {
			type: 'boolean',
			default: false
		},
		tool_data: {
			type: 'string',
			default: ''
		},
		info: {
			type: 'array',
			selector: '.info-wrap'
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
		const { attributes, setAttributes, className } = props;
		const {
			post_id,
			title,
			title_tag,
			intro,
			enable_background,
			custom_bg_color,
			displayColorPicker_custom_bg,
			custom_font_color,
			displayColorPicker_custom_font,
			hide_list_numbers,
			enable_totaltime,
			duration_DD,
			duration_HH,
			duration_MM,
			enable_supply,
			supply_data,
			enable_tool,
			tool_data,
			bg_image,
			enable_mobile_bg,
			mobile_bg,
			info = [],
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		const pickerstyles = {
			bg_color: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ custom_bg_color }`,
			},
			font_color: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ custom_font_color }`,
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
			props.setAttributes( { displayColorPicker_custom_bg: !displayColorPicker_custom_bg } );
		};

		const handleCloseColorPicker_bg = () => {
			props.setAttributes( { displayColorPicker_custom_bg: false } );
		};

		const handleColorPicker_font = () => {
			props.setAttributes( { displayColorPicker_custom_font: !displayColorPicker_custom_font } );
		};

		const handleCloseColorPicker_font = () => {
			props.setAttributes( { displayColorPicker_custom_font: false } );
		};

		const infoList = (value) => {
            return(
                value.sort((a, b) => a.index - b.index).map(infoItem => {
                    return(
                        <div className="info-item">
                            <Button
                                className="remove-item cross-button"
                                onClick={ () => {
                                    const newInfo = info.filter(item => item.index != infoItem.index).map(i => {
                                        if(i.index > infoItem.index){
                                            i.index -= 1;
                                        }
                                        return i;
                                    } );
                                    setAttributes({ info: newInfo });
                                } }
                            >&times;</Button>
                            <p className="section-heading">Step {infoItem.index+1}</p>
							<TextControl
                                 placeholder={ __( 'Add Step Title', 'wpvcb-blocks' ) }
                                 label={ __( 'Step Title', 'wpvcb-blocks' ) }
                                 value={ infoItem.title }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         title: value
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                             />
							<MediaUploadCheck>
                                <MediaUpload
									onSelect={ ( media ) => {
										const newObject = Object.assign({}, infoItem, {
											image: media.url
										});
										setAttributes({
											info: [...info.filter(
												item => item.index != infoItem.index
											), newObject]
										});
									} }
									allowedTypes={ ['image'] }
									value={ infoItem.image }
									render={ ( { open } ) => (
										<div class="wpvcb-media-preview-wrap">
											<img 
											class="media-upload-img" 
											onClick={ open } 
											src={ infoItem.image ? infoItem.image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
											title={ !infoItem.image ? __( 'Add image', 'wpvcb-blocks' ) : __( 'Change image', 'wpvcb-blocks' )  }
											/>
											{ infoItem.image && (
											<Button 
												onClick={ () => {
												const newObject = Object.assign({}, infoItem, {
													image: ''
												});
												setAttributes({
													info: [...info.filter(
														item => item.index != infoItem.index
													), newObject]
												});
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
                                 data={ infoItem.summary }
                                 onChange={ ( event, editor ) => {
                                     const newObject = Object.assign({}, infoItem, {
										summary: editor.getData()
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                     //setAttributes( { content: editor.getData() } );
                                 } }
                             />
                        </div>
                    )
                })
            )
        }

		return (
			<Fragment>
				<Placeholder 
					icon= 'editor-ol'
					label={ __( 'How-to Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-howto-block">
					<div className={className}>
						<TextControl
							label={ __( 'Add Title', 'wpvcb-blocks' ) }
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
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ intro }
							onChange={ ( event, editor ) => {
								setAttributes( { intro: editor.getData() } );
							  } }
						/>
						<ToggleControl
							label={ __(
								'Hide content list item numbers',
								'wpvcb-blocks'
							) }
							
							checked={ hide_list_numbers }
							onChange={ ( value ) =>
								setAttributes( { hide_list_numbers: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Enable Total time - for HowTo schema data',
								'wpvcb-blocks'
							) }
							
							checked={ enable_totaltime }
							onChange={ ( value ) =>
								setAttributes( { enable_totaltime: value } )
							}
						/>
						{ enable_totaltime && (
							<div class="howto-time-wrap">
								<TextControl
									type="number"
									className="duration-time"
									placeHolder={ __( 'DD', 'wpvcb-blocks' ) }
									value={ duration_DD }
									onChange={ ( value ) => {
										setAttributes( { duration_DD: value } );
									} }
								/>
								<TextControl
									type="number"
									className="duration-time"
									placeHolder={ __( 'HH', 'wpvcb-blocks' ) }
									value={ duration_HH }
									onChange={ ( value ) => {
										setAttributes( { duration_HH: value } );
									} }
								/>
								<span>:</span>
								<TextControl
									type="number"
									className="duration-time"
									placeHolder={ __( 'MM', 'wpvcb-blocks' ) }
									value={ duration_MM }
									onChange={ ( value ) => {
										setAttributes( { duration_MM: value } );
									} }
								/>
							</div>
						)}
						<ToggleControl
							label={ __(
								'Enable Supply - for HowTo schema data',
								'wpvcb-blocks'
							) }
							
							checked={ enable_supply }
							onChange={ ( value ) =>
								setAttributes( { enable_supply: value } )
							}
						/>
						{ enable_supply && (
							<TextControl
								placeHolder={ __( 'Supply for HowTo schema data', 'wpvcb-blocks' ) }
								help={ __( "Add multiple Supply name separated by pipe symbol ( | ). For example - A tie | A collared shirt", 'wpvcb-blocks' ) }
								value={ supply_data }
								onChange={ ( value ) => {
									setAttributes( { supply_data: value } );
								} }
							/>
						)}
						<ToggleControl
							label={ __(
								'Enable Tool - for HowTo schema data',
								'wpvcb-blocks'
							) }
							
							checked={ enable_tool }
							onChange={ ( value ) =>
								setAttributes( { enable_tool: value } )
							}
						/>
						{ enable_tool && (
							<TextControl
								placeHolder={ __( 'Tool for HowTo schema data', 'wpvcb-blocks' ) }
								help={ __( "Add multiple Tool name separated by pipe symbol ( | ). For example - A mirror", 'wpvcb-blocks' ) }
								value={ tool_data }
								onChange={ ( value ) => {
									setAttributes( { tool_data: value } );
								} }
							/>
						)}
						{/* <ToggleControl
							label={ __(
								'Enable background',
								'wpvcb-blocks'
							) }
							
							checked={ enable_background }
							onChange={ ( value ) =>
								setAttributes( { enable_background: value } )
							}
						/>
						{ enable_background && (
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_bg }>{ __( 'Custom Background color', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_bg } style={ pickerstyles.bg_color } />
							{ displayColorPicker_custom_bg ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_bg }/>
								<ChromePicker 
									color={ custom_bg_color } 
									onChangeComplete={ ( color ) => setAttributes( { custom_bg_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						)}
						{ enable_background && (
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_font }>{ __( 'Custom Font color', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_font } style={ pickerstyles.font_color } />
							{ displayColorPicker_custom_font ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_font }/>
								<ChromePicker 
									color={ custom_font_color } 
									onChangeComplete={ ( color ) => setAttributes( { custom_font_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						)}
						{ enable_background && ( 
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
										title={ !bg_image ? __( 'Add background image', 'wpvcb-blocks' ) : __( 'Change background image', 'wpvcb-blocks' )  }
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
						)}
						<ToggleControl
							label={ __(
								'Enable different mobile background image',
								'wpvcb-blocks'
							) }
							
							checked={ enable_mobile_bg }
							onChange={ ( value ) =>
								setAttributes( { enable_mobile_bg: value } )
							}
						/>
						{ enable_mobile_bg && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { mobile_bg: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ mobile_bg }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ mobile_bg ? mobile_bg : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !mobile_bg ? __( 'Add mobile background image', 'wpvcb-blocks' ) : __( 'Change mobile background image', 'wpvcb-blocks' )  }
										/>
										{ mobile_bg && (
										<Button 
											onClick={ () => {
											setAttributes( { mobile_bg: '' } );
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
						)} */}
						
						<div className="info-wrap">{infoList(info)}</div>
						
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									title: '',
									image: '',
									summary: '',
								}]
							});
						}}>Add Steps</Button>
						
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
		const info = props.attributes.info;
		if (info != '' && info != null) {
			const displayInfoList = (value) => {
				return(
					value.map( infoItem => {
						return(
							<div className="info-item">
								<RichText.Content
									tagName="h4"
									className="info-item-title"
									value={infoItem.title}
									style={{ height: 58 }}
								/>
							</div>
						)
					} )
				)
			}

			return(
				<div className={props.className}>
					<div className="info-wrap">{ displayInfoList(info) }</div>
				</div>
			);
		} else {
			null
		}
	},
} );
