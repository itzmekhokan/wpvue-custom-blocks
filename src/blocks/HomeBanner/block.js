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

registerBlockType( 'wpvcb/home-banner', { 
	title: __( 'Home Banner', 'wpvcb-blocks' ), 
	icon: 'admin-site-alt3', 
	category: 'wpvcb',
	keywords: [
		__( 'Home', 'wpvcb-blocks' ),
		__( 'banner', 'wpvcb-blocks' ),
		__( 'Banner cards', 'wpvcb-blocks' ),
	], 
	attributes: {
		banner_title: {
			type: 'string',
			default: ''
		},
		bg_image_id: {
			type: 'string',
			default: ''
		},
		bg_image: {
			type: 'string',
			default: ''
		},
		enable_mobile_bg: {
			type: 'boolean',
			default: false
		},
		mobile_bg_image_id: {
			type: 'string',
			default: ''
		},
		mobile_bg_image: {
			type: 'string',
			default: ''
		},
		heading: {
			type: 'string',
			default: ''
		},
		heading_tag: {
			type: 'string',
			default: 'h2'
		},
		text: {
			type: 'string',
			default: ''
		},
		mobile_text: {
			type: 'string',
			default: ''
		},
		logo_title: {
			type: 'string',
			default: ''
		},
		no_of_lines: {
			type: 'string',
			default: ''
		},
		no_of_lines_mobile: {
			type: 'string',
			default: ''
		},
		disable_showmore: {
			type: 'boolean',
			default: false
		},
		disable_showmore_mobile: {
			type: 'boolean',
			default: false
		},
		banner_style: {
			type: 'string',
			default: 'badge_image'
		},
		recommended_by: {
			type: 'string',
			default: ''
		},
		recommended_title_tag: {
			type: 'string',
			default: 'h3'
		},
		toplist_bg_color: {
			type: 'string',
			default: ''
		},
		displayColorPicker_toplist_bg: {
			type: 'boolean',
			default: false
		},
		logo_image_id: {
			type: 'string',
			default: ''
		},
		logo_image: {
			type: 'string',
			default: ''
		},
		enable_font_color: {
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
		toplist_bns_color: {
			type: 'string',
			default: ''
		},
		displayColorPicker_toplist_bns: {
			type: 'boolean',
			default: false
		},
		toplist_bns_hover_color: {
			type: 'string',
			default: ''
		},
		displayColorPicker_toplist_bns_hover: {
			type: 'boolean',
			default: false
		},
		cta_link_target: {
			type: 'string',
			default: ''
		},
		cta_link_rel: {
			type: 'string',
			default: ''
		},
		group_id: {
			type: 'string',
			default: ''
		},
		enable_tags: {
			type: 'boolean',
			default: false
		},
		tags: {
			type: 'string',
			default: ''
		},
		tag_mode: {
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
			banner_title,
			bg_image_id,
			bg_image,
			enable_mobile_bg,
			mobile_bg_image,
			mobile_bg_image_id,
			heading,
			heading_tag,
			text,
			mobile_text,
			no_of_lines,
			no_of_lines_mobile,
			disable_showmore,
			disable_showmore_mobile,
			banner_style,
			recommended_by,
			recommended_title_tag,
			toplist_bg_color,
			displayColorPicker_toplist_bg,
			logo_title,
			logo_image_id,
			logo_image,
			enable_font_color,
			custom_font_color,
			displayColorPicker_custom_font,
			toplist_bns_color,
			displayColorPicker_toplist_bns,
			toplist_bns_hover_color,
			displayColorPicker_toplist_bns_hover,
			cta_link_target,
			cta_link_rel,
			group_id,
			enable_tags,
			tags,
			tag_mode,
			info = [],
		} = attributes;

		const pickerstyles = {
			font_color: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ custom_font_color }`,
			},
			toplist_bg: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ toplist_bg_color }`,
			},
			toplist_bns: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ toplist_bns_color }`,
			},
			toplist_bns_hover: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ toplist_bns_hover_color }`,
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

		const handleColorPicker_font = () => {
			props.setAttributes( { displayColorPicker_custom_font: !displayColorPicker_custom_font } );
		};

		const handleCloseColorPicker_font = () => {
			props.setAttributes( { displayColorPicker_custom_font: false } );
		};

		const handleColorPicker_toplist_bg = () => {
			props.setAttributes( { displayColorPicker_toplist_bg: !displayColorPicker_toplist_bg } );
		};

		const handleCloseColorPicker_toplist_bg = () => {
			props.setAttributes( { displayColorPicker_toplist_bg: false } );
		};

		const handleColorPicker_toplist_bns = () => {
			props.setAttributes( { displayColorPicker_toplist_bns: !displayColorPicker_toplist_bns } );
		};

		const handleCloseColorPicker_toplist_bns = () => {
			props.setAttributes( { displayColorPicker_toplist_bns: false } );
		};

		const handleColorPicker_toplist_bns_hover = () => {
			props.setAttributes( { displayColorPicker_toplist_bns_hover: !displayColorPicker_toplist_bns_hover } );
		};

		const handleCloseColorPicker_toplist_bns_hover = () => {
			props.setAttributes( { displayColorPicker_toplist_bns_hover: false } );
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
                            <p className="section-heading">Card {infoItem.index+1}</p>
							<MediaUploadCheck>
                                <MediaUpload
									onSelect={ ( media ) => {
										const newObject = Object.assign({}, infoItem, {
											icon: media.url
										});
										setAttributes({
											info: [...info.filter(
												item => item.index != infoItem.index
											), newObject]
										});
									} }
									allowedTypes={ ['image'] }
									value={ infoItem.icon }
									render={ ( { open } ) => (
										<div class="wpvcb-media-preview-wrap">
											<img 
											class="media-upload-img" 
											onClick={ open } 
											src={ infoItem.icon ? infoItem.icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
											title={ !infoItem.icon ? __( 'Add image', 'wpvcb-blocks' ) : __( 'Change image', 'wpvcb-blocks' )  }
											/>
											{ infoItem.icon && (
											<Button 
												onClick={ () => {
												const newObject = Object.assign({}, infoItem, {
													icon: ''
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
							<TextControl
                                 placeholder={ __( 'Add Card Title', 'wpvcb-blocks' ) }
                                 label={ __( 'Card Title', 'wpvcb-blocks' ) }
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
							<TextControl
								placeholder={ __( 'Add card link', 'wpvcb-blocks' ) }
								label={ __( 'Link / Url', 'wpvcb-blocks' ) }
								value={ infoItem.link }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										link: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							<SelectControl
								label={ __( 'Link target', 'wpvcb-blocks' ) }
								value={ infoItem.target }
								options={ [
									{ label: 'Blank', value: '_blank' },
									{ label: 'Self', value: '_self' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										target: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							<SelectControl
								label={ __( 'Link rel', 'wpvcb-blocks' ) }
								value={ infoItem.rel }
								options={ [
									{ label: 'No Follow', value: 'nofollow' },
									{ label: 'Follow', value: 'follow' },
									{ label: 'Sponsored', value: 'sponsored' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										rel: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
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
					icon= 'admin-site-alt3'
					label={ __( 'Home banner', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-home-banner">
					<div className={className}>
						<TextControl
							label={ __( 'Add Title for banner image', 'wpvcb-blocks' ) }
							value={ banner_title }
							onChange={ ( value ) => {
								setAttributes( { banner_title: value } );
							} }
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { bg_image: media.url } );
									setAttributes( { bg_image_id: media.id } );
								} }
								allowedTypes={ ['image'] }
								value={ bg_image }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ bg_image ? bg_image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !bg_image ? __( 'Add background banner image', 'wpvcb-blocks' ) : __( 'Change background banner image', 'wpvcb-blocks' )  }
										/>
										{ bg_image && (
										<Button 
											onClick={ () => {
											setAttributes( { bg_image: '' } );
											setAttributes( { bg_image_id: '' } );
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
								'Enable mobile banner image',
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
									setAttributes( { mobile_bg_image: media.url } );
									setAttributes( { mobile_bg_image_id: media.id } );
								} }
								allowedTypes={ ['image'] }
								value={ mobile_bg_image }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ mobile_bg_image ? mobile_bg_image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !mobile_bg_image ? __( 'Add background banner image', 'wpvcb-blocks' ) : __( 'Change background banner image', 'wpvcb-blocks' )  }
										/>
										{ mobile_bg_image && (
										<Button 
											onClick={ () => {
											setAttributes( { mobile_bg_image: '' } );
											setAttributes( { mobile_bg_image_id: '' } );
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
							label={ __( 'Heading', 'wpvcb-blocks' ) }
							value={ heading }
							onChange={ ( value ) => {
								setAttributes( { heading: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Heading Tag', 'wpvcb-blocks' ) }
							value={ heading_tag }
							options={ [
								{ label: 'h1', value: 'h1' },
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'h5', value: 'h5' },
								{ label: 'h6', value: 'h6' },
							] }
							onChange={ ( value ) =>
								setAttributes( { heading_tag: value } )
							}
						/>
						<p className="section-content-desktop">Destop content</p>
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ text }
							onChange={ ( event, editor ) => {
								setAttributes( { text: editor.getData() } );
							  } }
						/>
						<TextControl
							label={ __( 'Numbers of Line visible in desktop', 'wpvcb-blocks' ) }
							min='1'
							max='5'
							type='number'
							value={ no_of_lines }
							onChange={ ( value ) => {
								setAttributes( { no_of_lines: value } );
							} }
						/>
						<p className="section-content-mobile">Mobile content</p>
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ mobile_text }
							onChange={ ( event, editor ) => {
								setAttributes( { mobile_text: editor.getData() } );
							  } }
						/>
						<TextControl
							label={ __( 'Numbers of Line visible in mobile', 'wpvcb-blocks' ) }
							min='1'
							type='number'
							value={ no_of_lines_mobile }
							onChange={ ( value ) => {
								setAttributes( { no_of_lines_mobile: value } );
							} }
						/>
						{/* <ToggleControl
							label={ __(
								'Disable Show more for desktop',
								'wpvcb-blocks'
							) }
							checked={ disable_showmore }
							onChange={ ( value ) =>
								setAttributes( { disable_showmore: value } )
							}
						/> */}
						<ToggleControl
							label={ __(
								'Disable Show more for mobile',
								'wpvcb-blocks'
							) }
							checked={ disable_showmore_mobile }
							onChange={ ( value ) =>
								setAttributes( { disable_showmore_mobile: value } )
							}
						/>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ banner_style }
							options={ [
								{ label: 'With Badge Image', value: 'badge_image' },
								{ label: 'With Toplist', value: 'toplist' },
							] }
							onChange={ ( value ) =>
								setAttributes( { banner_style: value } )
							}
						/>
						{ banner_style == 'toplist' && (
						<TextControl
							help={ __( 'It will respect global group ID from settings, if there is no group ID provied with the block.', 'wpvcb-blocks' ) }
							label={ __( 'Add Toplist Group ID ( Optional )', 'wpvcb-blocks' ) }
							value={ group_id }
							onChange={ ( value ) => {
								setAttributes( { group_id: value } );
							} }
						/>
						)}
						{ banner_style == 'toplist' && (
						<TextControl
							label={ __( 'Add Remommended by Title', 'wpvcb-blocks' ) }
							value={ recommended_by }
							onChange={ ( value ) => {
								setAttributes( { recommended_by: value } );
							} }
						/>
						)}
						{ banner_style == 'toplist' && (
						<SelectControl
							label={ __( 'Recommended Title Tag', 'wpvcb-blocks' ) }
							value={ recommended_title_tag }
							options={ [
								{ label: 'h1', value: 'h1' },
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'h5', value: 'h5' },
								{ label: 'h6', value: 'h6' },
								{ label: 'span', value: 'span' },
							] }
							onChange={ ( value ) =>
								setAttributes( { recommended_title_tag: value } )
							}
						/>
						)}
						{ banner_style == 'toplist' && (
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_toplist_bg }>{ __( 'Background color for toplist shade', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_toplist_bg } style={ pickerstyles.toplist_bg } />
							{ displayColorPicker_toplist_bg? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_toplist_bg }/>
								<ChromePicker 
									color={ toplist_bg_color } 
									onChangeComplete={ ( color ) => setAttributes( { toplist_bg_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						)}
						{/* { banner_style == 'toplist' && (
						<SelectControl
							label={ __( 'CTA Link target', 'wpvcb-blocks' ) }
							value={ cta_link_target }
							options={ [
								{ label: 'Blank', value: '_blank' },
								{ label: 'Self', value: '_self' },
							] }
							onChange={ ( value ) => {
								setAttributes( { cta_link_target: value } );
							} }
						/>
						)}
						{ banner_style == 'toplist' && (
						<SelectControl
							label={ __( 'CTA Link rel', 'wpvcb-blocks' ) }
							value={ cta_link_rel }
							options={ [
								{ label: 'No Follow', value: 'nofollow' },
								{ label: 'Follow', value: 'follow' },
								{ label: 'Sponsored', value: 'sponsored' },
							] }
							onChange={ ( value ) => {
								setAttributes( { cta_link_rel: value } );
							} }
						/>
						)} */}
						{ banner_style == 'toplist' && (
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_toplist_bns }>{ __( 'Toplist bonus info color', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_toplist_bns } style={ pickerstyles.toplist_bns } />
							{ displayColorPicker_toplist_bns? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_toplist_bns }/>
								<ChromePicker 
									color={ toplist_bns_color } 
									onChangeComplete={ ( color ) => setAttributes( { toplist_bns_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						)}
						{ banner_style == 'toplist' && (
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_toplist_bns_hover }>{ __( 'Toplist bonus info hover color', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_toplist_bns_hover } style={ pickerstyles.toplist_bns_hover } />
							{ displayColorPicker_toplist_bns_hover? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_toplist_bns_hover }/>
								<ChromePicker 
									color={ toplist_bns_hover_color } 
									onChangeComplete={ ( color ) => setAttributes( { toplist_bns_hover_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						)}
						{ banner_style == 'toplist' && (
						<ToggleControl
							label={ __(
								'Enable filter toplist by tag ( Optional )',
								'wpvcb-blocks'
							) }
							checked={ enable_tags }
							onChange={ ( value ) =>
								setAttributes( { enable_tags: value } )
							}
						/>
						)}
						{ enable_tags && (
						<TextControl
							label={ __( 'Add Tag', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add multiple tags separated by comma, Ex-HOT1,HOT2', 'wpvcb-blocks' ) }
							value={ tags }
							onChange={ ( value ) => {
								setAttributes( { tags: value } );
							} }
						/>
						)}
						{ enable_tags && (
						<SelectControl
							help={ __( 'Filter toplist by tag mode', 'wpvcb-blocks' ) }
							label={ __( 'Tag mode ( Optional )', 'wpvcb-blocks' ) }
							value={ tag_mode }
							options={ [
								{ label: 'Select', value: '' },
								{ label: 'OR', value: 'OR' },
								{ label: 'AND', value: 'AND' },
							] }
							onChange={ ( value ) =>
								setAttributes( { tag_mode: value } )
							}
						/>
						)}
						{ banner_style != 'toplist' && (
						<TextControl
							label={ __( 'Add Title for badge image', 'wpvcb-blocks' ) }
							value={ logo_title }
							onChange={ ( value ) => {
								setAttributes( { logo_title: value } );
							} }
						/>
						)}
						{ banner_style != 'toplist' && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { logo_image: media.url } );
									setAttributes( { logo_image_id: media.id } );
								} }
								allowedTypes={ ['image'] }
								value={ logo_image }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ logo_image ? logo_image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !logo_image ? __( 'Add badge logo image', 'wpvcb-blocks' ) : __( 'Change badge logo image', 'wpvcb-blocks' )  }
										/>
										{ logo_image && (
										<Button 
											onClick={ () => {
											setAttributes( { logo_image: '' } );
											setAttributes( { logo_image_id: '' } );
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
								'Enable custom font color',
								'wpvcb-blocks'
							) }
							checked={ enable_font_color }
							onChange={ ( value ) =>
								setAttributes( { enable_font_color: value } )
							}
						/>
						{ enable_font_color && (
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
						<div className="info-wrap">{infoList(info)}</div>
						
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									icon: '',
									title: '',
									link: '',
									target: '_blank',
									rel: 'nofollow',
								}]
							});
						}}>Add Card</Button>
						
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
