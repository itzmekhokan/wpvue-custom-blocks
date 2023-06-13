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
registerBlockType( 'wpvcb/casino-toplist', { 
	title: __( 'Casino Toplist', 'wpvcb-blocks' ), 
	icon: 'list-view', 
	category: 'wpvcb', 
	attributes: {
		block_title: {
			type: 'string',
			default: ''
		},
		title_tag: {
			type: 'string',
			default: 'h2'
		},
		group_id: {
			type: 'string',
			default: ''
		},
		style: {
			type: 'string',
			default: 'list'
		},
		partner_id: {
			type: 'string',
			default: ''
		},
		payment_type: {
			type: 'array',
			default: []
		},
		payment_method_id: {
			type: 'string',
			default: ''
		},
		software_provider_id: {
			type: 'string',
			default: ''
		},
		both_type_label: {
			type: 'string',
			default: ''
		},
		deposit_type_label: {
			type: 'string',
			default: ''
		},
		withdrawal_type_label: {
			type: 'string',
			default: ''
		},
		quantity: {
			type: 'string',
			default: ''
		},
		default_display: {
			type: 'string',
			default: '',
		},
		display_offset: {
			type: 'string',
			default: '',
		},
		show_all_btn_label: {
			type: 'string',
			default: ''
		},
		show_less_btn_label: {
			type: 'string',
			default: ''
		},
		best_choice_label: {
			type: 'string',
			default: ''
		},
		top_choice_label: {
			type: 'string',
			default: ''
		},
		bg_pattern: {
			type: 'string',
			default: ''
		},
		asset_category: {
			type: 'string',
			default: ''
		},
		enable_tags: {
			type: 'boolean',
			default: false
		},
		enable_tags: {
			type: 'boolean',
			default: false
		},
		tag_mode: {
			type: 'string',
			default: ''
		},
		tags: {
			type: 'string',
			default: ''
		},
		enable_sort_by: {
			type: 'boolean',
			default: false
		},
		sort_by: {
			type: 'string',
			default: ''
		},
		partner_supported: {
			type: 'string',
			default: ''
		},
		enable_mobile_supports: {
			type: 'boolean',
			default: false
		},
		enable_filters_bar: {
			type: 'boolean',
			default: false
		},
		enable_free_text_row: {
			type: 'boolean',
			default: false
		},
		disable_desktop_show_more_less: {
			type: 'boolean',
			default: false
		},
		enable_mobile_show_more_less: {
			type: 'boolean',
			default: false
		},
		info: {
			type: 'array',
			selector: '.info-wrap'
		},
		override_partner_cta: {
			type: 'boolean',
			default: false
		},
		partner_cta_text: {
			type: 'string',
			default: ''
		},
		show_freespin_mobile_btn: {
			type: 'boolean',
			default: false
		},
		enable_geo_restriction: {
			type: 'boolean',
			default: false
		},
		hide_filter_for_countries: {
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
			group_id,
			block_title,
			title_tag,
			style,
			partner_id,
			payment_type,
			payment_method_id,
			software_provider_id,
			both_type_label,
			deposit_type_label,
			withdrawal_type_label,
			quantity,
			default_display,
			display_offset,
			show_all_btn_label,
			show_less_btn_label,
			best_choice_label,
			top_choice_label,
			bg_pattern,
			asset_category,
			enable_tags,
			tag_mode,
			tags,
			enable_sort_by,
			sort_by,
			partner_supported,
			enable_mobile_supports,
			enable_filters_bar,
			enable_free_text_row,
			disable_desktop_show_more_less,
			enable_mobile_show_more_less,
			override_partner_cta,
			partner_cta_text,
			show_freespin_mobile_btn,
			enable_geo_restriction,
			hide_filter_for_countries,
			info = [],
		} = attributes;

		// set default
		const setDefaults = () => {
			if( !style ) {
				setAttributes( { style: 'list' } );
			}
			// if( !best_choice_label ) {
			// 	setAttributes( { best_choice_label: 'Best Choice' } );
			// }
			// if( !top_choice_label ) {
			// 	setAttributes( { top_choice_label: 'Top Choice' } );
			// }
			// if( !show_all_btn_label ) {
			// 	setAttributes( { show_all_btn_label: 'Show More' } );
			// }
			// if( !show_less_btn_label ) {
			// 	setAttributes( { show_less_btn_label: 'Show Less' } );
			// }
			// if( !default_display ) {
			// 	setAttributes( { default_display: wpvcb_blocks_scripts_data_params.data.cas_data.default_display } );
			// }
			// if( !display_offset ) {
			// 	setAttributes( { display_offset: wpvcb_blocks_scripts_data_params.data.cas_data.display_offset } );
			// }
			// if( style == 'filter_payment_type' ) {
			// 	if( !both_type_label ) {
			// 		setAttributes( { both_type_label: 'Deposit & Withdrawal' } );
			// 	}
			// 	if( !deposit_type_label ) {
			// 		setAttributes( { deposit_type_label: 'Deposit' } );
			// 	}
			// 	if( !withdrawal_type_label ) {
			// 		setAttributes( { withdrawal_type_label: 'Withdrawal' } );
			// 	}
			// }
			if( !partner_supported ) {
				setAttributes( { partner_supported: 'supported_platform' } );
			}
		}

		let bindPartnerData = [];
		bindPartnerData = wpvcb_blocks_scripts_data_params.data.cas_data.cas_partners;

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
                            <p className="section-heading">Partner {infoItem.index+1}</p>
							<SelectControl
                                className="info-item-partner_id"
                                label={ __( 'Select partner', 'wpvcb-blocks' ) }
                                value={ infoItem.partner_id } 
                                options={ bindPartnerData }
                                onChange={ partner_id => {
                                    const newObject = Object.assign({}, infoItem, {
                                        partner_id: partner_id
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
							<TextControl
                               className="info-text"
                               label={ __( 'Text', 'wpvcb-blocks' ) }
                               value={infoItem.text}
                               onChange={ text => {
                                    const newObject = Object.assign({}, infoItem, {
                                        text: text
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
					icon= 'list-view'
					label={ __( 'Casino Toplist', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-casino-toplist"
				>
					<div className="wpvcb-block__selection wpvcb-block-casino-toplist__selection" onClick={ setDefaults }>
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Best Casinos', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
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
								{ label: 'span', value: 'span' },
							] }
							onChange={ ( value ) =>
								setAttributes( { title_tag: value } )
							}
						/>
						<TextControl
							help={ __( 'It will respect global group ID from settings, if there is no group ID provied with the block.', 'wpvcb-blocks' ) }
							label={ __( 'Add Toplist Group ID ( Optional )', 'wpvcb-blocks' ) }
							value={ group_id }
							onChange={ ( value ) => {
								setAttributes( { group_id: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Normal list', value: 'list' },
								{ label: 'Homepage Top 3', value: 'home_top_3' },
								{ label: 'List with payment type filter', value: 'filter_payment_type' },
								{ label: 'Single Toplist with banner', value: 'single_with_banner' },
								{ label: 'Gamepage Top 3', value: 'gamepage_top_3' },
								{ label: 'Toplist by Software provider', value: 'filter_by_software_provider' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ ( style == 'list' || style == '' ) && (
						<ToggleControl
							label={ __(
								'Enable toplist sort by filters bar',
								'wpvcb-blocks'
							) }
							checked={ enable_filters_bar }
							onChange={ ( value ) =>
								setAttributes( { enable_filters_bar: value } )
							}
						/>
						)}	
						{ ( style == 'list' || style == '' ) && (
						<ToggleControl
							label={ __(
								'Enable geo restriction on filters bar',
								'wpvcb-blocks'
							) }
							checked={ enable_geo_restriction }
							onChange={ ( value ) =>
								setAttributes( { enable_geo_restriction: value } )
							}
						/>
						)}
						{ enable_geo_restriction && (
						<TextControl
							help={ __( 'Add comma separated country code for restriction.', 'wpvcb-blocks' ) }
							label={ __( 'Hide for countries', 'wpvcb-blocks' ) }
							value={ hide_filter_for_countries }
							onChange={ ( value ) => {
								setAttributes( { hide_filter_for_countries: value } );
							} }
						/>
						)}	
						{ style == 'filter_by_software_provider' && (
						<TextControl
							label={ __( 'Add Software provider ID', 'wpvcb-blocks' ) }
							value={ software_provider_id }
							onChange={ ( value ) => {
								setAttributes( { software_provider_id: value } );
							} }
						/>
						)}
						{ style == 'filter_payment_type' && (
						<SelectControl
							multiple
							help={ __( 'Select multiple payment types for filter', 'wpvcb-blocks' ) }
							label={ __( 'Payment Type', 'wpvcb-blocks' ) }
							value={ payment_type }
							options={ [
								{ label: 'Deposit & Withdrawal', value: 'both' },
								{ label: 'Deposit Only', value: 'deposit' },
								{ label: 'Withdrawal Only', value: 'withdrawal' },
							] }
							onChange={ ( value ) =>
								setAttributes( { payment_type: value } )
							}
						/>
						)}
						{ style == 'filter_payment_type' && (
						<TextControl
							label={ __( 'Add Payment method ID', 'wpvcb-blocks' ) }
							value={ payment_method_id }
							onChange={ ( value ) => {
								setAttributes( { payment_method_id: value } );
							} }
						/>
						)}
						{/* { style == 'filter_payment_type' && payment_type.includes('both') == true && (
						<TextControl
							label={ __( 'Add Deposit & Withdrawal label', 'wpvcb-blocks' ) }
							value={ both_type_label }
							onChange={ ( value ) => {
								setAttributes( { both_type_label: value } );
							} }
						/>
						)}
						{ style == 'filter_payment_type' && payment_type.includes('deposit') == true && (
						<TextControl
							label={ __( 'Add Deposit label', 'wpvcb-blocks' ) }
							value={ deposit_type_label }
							onChange={ ( value ) => {
								setAttributes( { deposit_type_label: value } );
							} }
						/>
						)}
						{ style == 'filter_payment_type' && payment_type.includes('withdrawal') == true && (
						<TextControl
							label={ __( 'Add Withdrawal label', 'wpvcb-blocks' ) }
							value={ withdrawal_type_label }
							onChange={ ( value ) => {
								setAttributes( { withdrawal_type_label: value } );
							} }
						/>
						)} */}
						{ style == 'single_with_banner' && (
						<TextControl
							label={ __( 'Add Partner ID', 'wpvcb-blocks' ) }
							value={ partner_id }
							onChange={ ( value ) => {
								setAttributes( { partner_id: value } );
							} }
						/>
						)}
						{ [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && (
						<TextControl
							label={ __( 'Add Quantity', 'wpvcb-blocks' ) }
							help={ __( 'Leave empty to get all toplist data.', 'wpvcb-blocks' ) }
							min='0'
							type='number'
							value={ quantity }
							onChange={ ( value ) => {
								setAttributes( { quantity: value } );
							} }
						/>
						)}
						{ [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && (
						<TextControl
							label={ __( 'Add Default Display Quantity', 'wpvcb-blocks' ) }
							type='number'
							min='0'
							value={ default_display }
							onChange={ ( value ) => {
								setAttributes( { default_display: value } );
							} }
						/>
						)}
						{ [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && (
						<TextControl
							label={ __( 'Add Load Offset Quantity', 'wpvcb-blocks' ) }
							type='number'
							min='0'
							value={ display_offset }
							onChange={ ( value ) => {
								setAttributes( { display_offset: value } );
							} }
						/>
						)}
						{/* { [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && (
						<TextControl
							label={ __( 'Show more button Label', 'wpvcb-blocks' ) }
							placeholder={ __( 'Show All Casinos', 'wpvcb-blocks' ) }
							value={ show_all_btn_label }
							onChange={ ( value ) => {
								setAttributes( { show_all_btn_label: value } );
							} }
						/>
						)}
						{ [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && (
						<TextControl
							label={ __( 'Show less button Label', 'wpvcb-blocks' ) }
							placeholder={ __( 'Show less Casinos', 'wpvcb-blocks' ) }
							value={ show_less_btn_label }
							onChange={ ( value ) => {
								setAttributes( { show_less_btn_label: value } );
							} }
						/>
						)} */}
						{ style == 'home_top_3' && (
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
						{ style != 'single_with_banner' && (
						<TextControl
							placeholder={ __( 'Partner asset-category name (Optional)', 'wpvcb-blocks' ) }
							help={ __( 'By default it will takes `product_logo_136x136` as asset-category.', 'wpvcb-blocks' ) }
							value={ asset_category }
							onChange={ ( value ) => {
								setAttributes( { asset_category: value } );
							} }
						/>	
						)}
						<ToggleControl
							label={ __(
								'Override partner CTA text',
								'wpvcb-blocks'
							) }
							checked={ override_partner_cta }
							onChange={ ( value ) =>
								setAttributes( { override_partner_cta: value } )
							}
						/>
						{ override_partner_cta && (
						<TextControl
							label={ __( 'Add partner CTA text', 'wpvcb-blocks' ) }
							value={ partner_cta_text }
							onChange={ ( value ) => {
								setAttributes( { partner_cta_text: value } );
							} }
						/>	
						)}
						{ [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && (
						<SelectControl
							label={ __( 'Partner supported', 'wpvcb-blocks' ) }
							value={ partner_supported }
							options={ [
								{ label: 'None', value: 'none' },
								{ label: 'Devices', value: 'supported_platform' },
								{ label: 'Payment Options', value: 'supported_payments' },
								{ label: 'Software Providers', value: 'software_providers' },
							] }
							onChange={ ( value ) =>
								setAttributes( { partner_supported: value } )
							}
						/>
						)}
						{ [ 'single_with_banner', 'home_top_3', 'gamepage_top_3' ].includes(style) == false && partner_supported != 'none' && (
						<ToggleControl
							label={ __(
								'Enable partner supported for mobile device view',
								'wpvcb-blocks'
							) }
							checked={ enable_mobile_supports }
							onChange={ ( value ) =>
								setAttributes( { enable_mobile_supports: value } )
							}
						/>
						)}
						{ [ 'single_with_banner', 'filter_by_software_provider' ].includes(style) == false && (
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
						{ [ 'single_with_banner', 'filter_by_software_provider' ].includes(style) == false && (
						<ToggleControl
							label={ __(
								'Enable filter toplist by sort by ( Optional )',
								'wpvcb-blocks'
							) }
							checked={ enable_sort_by }
							onChange={ ( value ) =>
								setAttributes( { enable_sort_by: value } )
							}
						/>
						)}
						{ enable_sort_by && (
						<SelectControl
							help={ __( 'Filter toplist by sort by', 'wpvcb-blocks' ) }
							label={ __( 'Sort by', 'wpvcb-blocks' ) }
							value={ sort_by }
							options={ [
								{ label: 'None', value: '' },
								{ label: 'Bonus', value: 'bonus' },
								{ label: 'Freebie', value: 'freebie' },
								{ label: 'Ratings', value: 'ratings' },
								{ label: 'A to Z', value: 'atoz' },
								{ label: 'Z to A', value: 'ztoa' },
							] }
							onChange={ ( value ) =>
								setAttributes( { sort_by: value } )
							}
						/>
						)}
						{/* <TextControl
							label={ __( 'Toplist best choice label', 'wpvcb-blocks' ) }
							placeholder={ __( 'Best Choice', 'wpvcb-blocks' ) }
							value={ best_choice_label }
							onChange={ ( value ) => {
								setAttributes( { best_choice_label: value } );
							} }
						/> */}
						{/* <TextControl
							label={ __( 'Toplist top choice label', 'wpvcb-blocks' ) }
							placeholder={ __( 'Top Choice', 'wpvcb-blocks' ) }
							value={ top_choice_label }
							onChange={ ( value ) => {
								setAttributes( { top_choice_label: value } );
							} }
						/> */}
						{ ( style == 'list' || style == '' ) && (
						<ToggleControl
							label={ __(
								'Enable free text row for partners.',
								'wpvcb-blocks'
							) }
							checked={ enable_free_text_row }
							onChange={ ( value ) =>
								setAttributes( { enable_free_text_row: value } )
							}
						/>
						)}
						{ [ 'single_with_banner', 'home_top_3' ].includes(style) == false && (
						<ToggleControl
							label={ __(
								'Show free spins on mobile in the button',
								'wpvcb-blocks'
							) }
							checked={ show_freespin_mobile_btn }
							onChange={ ( value ) =>
								setAttributes( { show_freespin_mobile_btn: value } )
							}
						/>
						)}
						{ ( style == 'list' || style == '' ) && enable_free_text_row && (
						<ToggleControl
							label={ __(
								'Enable show more / show less for desktop',
								'wpvcb-blocks'
							) }
							checked={ disable_desktop_show_more_less }
							onChange={ ( value ) =>
								setAttributes( { disable_desktop_show_more_less: value } )
							}
						/>
						)}
						{ ( style == 'list' || style == '' ) && enable_free_text_row && (
						<ToggleControl
							label={ __(
								'Disable show more / show less for mobile',
								'wpvcb-blocks'
							) }
							checked={ enable_mobile_show_more_less }
							onChange={ ( value ) =>
								setAttributes( { enable_mobile_show_more_less: value } )
							}
						/>
						)}
						{ ( style == 'list' || style == '' ) && enable_free_text_row && (
						<div className="info-wrap">{infoList(info)}</div>
						)}
						{ ( style == 'list' || style == '' ) && enable_free_text_row && (
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									partner_id: bindPartnerData[0].value,
									text:'',
								}]
							});
						}}>Add Partner Text</Button>
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
		// if( props.attributes.hasOwnProperty('default_display') ) {
		// 	let d_value = ( props.attributes.default_display < wpvcb_blocks_scripts_data_params.data.cas_data.default_display ) ? wpvcb_blocks_scripts_data_params.data.cas_data.default_display : props.attributes.default_display
		// 	props.attributes.default_display = d_value;
		// } else{
		// 	props.attributes.default_display = wpvcb_blocks_scripts_data_params.data.cas_data.default_display;
		// }
		return 'null';
	},
} );
