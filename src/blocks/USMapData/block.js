/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
import './editor.scss';
//import './style.scss';
import { ChromePicker } from "react-color";

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	RadioControl,
	TextControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { US_statesList, NL_statesList } from '../../utils.js';


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

registerBlockType( 'wpvcb/us-map-data', { 
	title: __( 'Map Gambling Guide', 'wpvcb-blocks' ), 
	icon: 'location', 
	category: 'wpvcb',
	keywords: [
		__( 'US Map Block', 'wpvcb-blocks' ),
		__( 'Gambling Guide', 'wpvcb-blocks' ),
	], 
	attributes: {
		selected_map: {
			type: 'string',
			default: 'US'
		},
		block_title: {
			type: 'string',
			default: ''
		},
		heading_tag: {
			type: 'string',
			default: 'h1'
		},
		block_subtitle: {
			type: 'string',
			default: ''
		},
		subheading_tag: {
			type: 'string',
			default: 'h3'
		},
		block_tabletitle: {
			type: 'string',
			default: ''
		},
		table_heading_tag: {
			type: 'string',
			default: 'h3'
		},
		enable_table_data: {
			type: 'boolean',
			default: false
		},
		info: {
			type: 'array',
			selector: '.info-wrap'
		},
		state_lists:{
		  type:'object'
		}, 
		color_18: {
			type: 'string',
			default: '#58fba4'
		},
		displayColorPicker_18: {
			type: 'boolean',
			default: false
		},
		color_20: {
			type: 'string',
			default: '#fbbb40'
		},
		displayColorPicker_20: {
			type: 'boolean',
			default: false
		},
		color_21: {
			type: 'string',
			default: '#891ec7'
		},
		displayColorPicker_21: {
			type: 'boolean',
			default: false
		},
		color_na: {
			type: 'string',
			default: '#221d47'
		},
		displayColorPicker_na: {
			type: 'boolean',
			default: false
		},
		color_null: {
			type: 'string',
			default: '#221d47'
		},
		displayColorPicker_null: {
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
		const { attributes, setAttributes, className } = props;
		const {
			selected_map,
			block_title,
			heading_tag,
			block_subtitle,
			subheading_tag,
			block_tabletitle,
			table_heading_tag,
			enable_table_data,
			info = [],
			color_18 = '#58fba4',
			displayColorPicker_18 = false,
			color_20 = '#fbbb40',
			displayColorPicker_20 = false,
			color_21 = '#891ec7',
			displayColorPicker_21 = false,
			color_na = '#221d47',
			displayColorPicker_na = false,
			color_null = '#F5DC00',
			displayColorPicker_null = false,
			state_lists,
		} = attributes;

		//const state_list = US_statesList;
		if( selected_map == 'US' ) {
			props.setAttributes( { state_lists: US_statesList } );
		}else if( selected_map == 'NL' ) {
			props.setAttributes( { state_lists: NL_statesList } );
		}else{
			props.setAttributes( { state_lists: US_statesList } );
		}

		if( !props.attributes.state_lists ){
			return 'Loading.....';
		}

		let data_arr = [];
    
		props.attributes.state_lists.map(data => {
			let option =  {label:data.name, value:data.abbreviation}
			data_arr.push(option);
		});

		const pickerstyles = {
			color_18: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				backgroundColor: `${ color_18 }`,
			},
			color_20: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				backgroundColor: `${ color_20 }`,
			},
			color_21: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				backgroundColor: `${ color_21 }`,
			},
			color_na: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				backgroundColor: `${ color_na }`,
			},
			color_null: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				backgroundColor: `${ color_null }`,
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
		};

		const handleColorPicker_18 = () => {
			props.setAttributes( { displayColorPicker_18: !displayColorPicker_18 } );
		};

		const handleCloseColorPicker_18 = () => {
			props.setAttributes( { displayColorPicker_18: false } );
		};

		const handleColorPicker_20 = () => {
			props.setAttributes( { displayColorPicker_20: !displayColorPicker_20 } );
		};

		const handleCloseColorPicker_20 = () => {
			props.setAttributes( { displayColorPicker_20: false } );
		};

		const handleColorPicker_21 = () => {
			props.setAttributes( { displayColorPicker_21: !displayColorPicker_21 } );
		};

		const handleCloseColorPicker_21 = () => {
			props.setAttributes( { displayColorPicker_21: false } );
		};

		const handleColorPicker_na = () => {
			props.setAttributes( { displayColorPicker_na: !displayColorPicker_na } );
		};

		const handleCloseColorPicker_na = () => {
			props.setAttributes( { displayColorPicker_na: false } );
		};

		const handleColorPicker_null = () => {
			props.setAttributes( { displayColorPicker_null: !displayColorPicker_null } );
		};

		const handleCloseColorPicker_null = () => {
			props.setAttributes( { displayColorPicker_null: false } );
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
                            <p className="section-heading">State {infoItem.index+1}</p>

                            <SelectControl
                                className="info-item-state"
                                label={ __( 'Select state', 'wpvcb-blocks' ) }
                                value={ infoItem.state } 
                                options={ data_arr }
                                onChange={ state => {
                                    const newObject = Object.assign({}, infoItem, {
                                        state: state
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
                          <TextControl
                               className="info-item-url"
                               label={ __( 'Url', 'wpvcb-blocks' ) }
                               value={infoItem.url}
                               placeholder="url"
                               onChange={ url => {
                                    const newObject = Object.assign({}, infoItem, {
                                        url: url
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
                            <SelectControl
                                label={ __( 'Minimum Gambling Age for Casinos', 'wpvcb-blocks' ) }
                                value={ infoItem.age_casinos }
                                options={ [
                                   { label: '18', value: '18' },
                                   { label: '18 (only Cruises)', value: '18-only-cruises' },
								   { label: '18/21', value: '18-21' },
								   { label: '18 (Indian Casinos)', value: '18-indian-casinos' },
								   { label: '19', value: '19' },
								   { label: '20', value: '20' },
								   { label: '21', value: '21' },
								   { label: '21 (only Cruises)', value: '21-only-cruises' },
								   { label: 'N/A', value: 'N/A' },
                                 ] }
                                onChange={ value => {
                                    const newObject = Object.assign({}, infoItem, {
                                        age_casinos: value
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
							<SelectControl
                                label={ __( 'Minimum Gambling Age for Poker Rooms', 'wpvcb-blocks' ) }
                                value={ infoItem.age_poker_rooms }
                                options={ [
                                   { label: '18', value: '18' },
                                   { label: '18 (only Cruises)', value: '18-only-cruises' },
								   { label: '18/21', value: '18-21' },
								   { label: '18 (Indian Casinos)', value: '18-indian-casinos' },
								   { label: '19', value: '19' },
								   { label: '20', value: '20' },
								   { label: '21', value: '21' },
								   { label: '21 (only Cruises)', value: '21-only-cruises' },
								   { label: 'N/A', value: 'N/A' },
                                 ] }
                                onChange={ value => {
                                    const newObject = Object.assign({}, infoItem, {
                                        age_poker_rooms: value
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
							<SelectControl
                                label={ __( 'Minimum Gambling Age for Bingo', 'wpvcb-blocks' ) }
                                value={ infoItem.age_bingo }
                                options={ [
                                   { label: '18', value: '18' },
                                   { label: '18 (only Cruises)', value: '18-only-cruises' },
								   { label: '18/21', value: '18-21' },
								   { label: '18 (Indian Casinos)', value: '18-indian-casinos' },
								   { label: '19', value: '19' },
								   { label: '20', value: '20' },
								   { label: '21', value: '21' },
								   { label: '21 (only Cruises)', value: '21-only-cruises' },
								   { label: 'N/A', value: 'N/A' },
                                 ] }
                                onChange={ value => {
                                    const newObject = Object.assign({}, infoItem, {
                                        age_bingo: value
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
							<SelectControl
                                label={ __( 'Minimum Gambling Age for Lottery', 'wpvcb-blocks' ) }
                                value={ infoItem.age_lottery }
                                options={ [
                                   { label: '18', value: '18' },
                                   { label: '18 (only Cruises)', value: '18-only-cruises' },
								   { label: '18/21', value: '18-21' },
								   { label: '18 (Indian Casinos)', value: '18-indian-casinos' },
								   { label: '19', value: '19' },
								   { label: '20', value: '20' },
								   { label: '21', value: '21' },
								   { label: '21 (only Cruises)', value: '21-only-cruises' },
								   { label: 'N/A', value: 'N/A' },
                                 ] }
                                onChange={ value => {
                                    const newObject = Object.assign({}, infoItem, {
                                        age_lottery: value
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
                                } }
                            />
							<SelectControl
                                label={ __( 'Minimum Gambling Age for Dog/Horse Racing', 'wpvcb-blocks' ) }
                                value={ infoItem.age_dog_horse_racing }
                                options={ [
                                   { label: '18', value: '18' },
                                   { label: '18 (only Cruises)', value: '18-only-cruises' },
								   { label: '18/21', value: '18-21' },
								   { label: '18 (Indian Casinos)', value: '18-indian-casinos' },
								   { label: '19', value: '19' },
								   { label: '20', value: '20' },
								   { label: '21', value: '21' },
								   { label: '21 (only Cruises)', value: '21-only-cruises' },
								   { label: 'N/A', value: 'N/A' },
                                 ] }
                                onChange={ value => {
                                    const newObject = Object.assign({}, infoItem, {
                                        age_dog_horse_racing: value
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
					icon= 'location'
					label={ __( 'Map Gambling Guide', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-us-map-data">
					<div className={className}>
						<SelectControl
                             label={ __( 'Select Map', 'wpvcb-blocks' ) }
                             value={ selected_map }
                             options={ [
                                 { label: 'United States', value: 'US' },
                                 { label: 'Netherlands', value: 'NL' },
                             ] }
                             onChange={ ( value ) =>
                                 setAttributes( { selected_map: value } )
                             }
                         />
						<TextControl
							label={ __( 'Heading', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add Map Gambling guide title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
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
								{ label: 'span', value: 'span' },
							] }
							onChange={ ( value ) =>
								setAttributes( { heading_tag: value } )
							}
						/>
						<TextControl
							label={ __( 'Sub Heading', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add sub heading', 'wpvcb-blocks' ) }
							value={ block_subtitle }
							onChange={ ( value ) => {
								setAttributes( { block_subtitle: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Sub Heading Tag', 'wpvcb-blocks' ) }
							value={ subheading_tag }
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
								setAttributes( { subheading_tag: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Enable Minimum Gambling Age Table',
								'wpvcb-blocks'
							) }
							checked={ enable_table_data }
							onChange={ ( value ) => {
								setAttributes( { enable_table_data: value } )
							} }
						/>
						{ enable_table_data && (
						<TextControl
							label={ __( 'Table Heading', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add table heading', 'wpvcb-blocks' ) }
							value={ block_tabletitle }
							onChange={ ( value ) => {
								setAttributes( { block_tabletitle: value } );
							} }
						/>
						)}
						{ enable_table_data && (
						<SelectControl
							label={ __( 'Table Heading Tag', 'wpvcb-blocks' ) }
							value={ table_heading_tag }
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
								setAttributes( { table_heading_tag: value } )
							}
						/>
						)}
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_18 }>{ __( 'Map Color indicator for 18', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_18 } style={ pickerstyles.color_18 } />
							{ displayColorPicker_18 ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_18 }/>
								<ChromePicker 
									color={ color_18 } 
									onChangeComplete={ ( color ) => setAttributes( { color_18: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_20 }>{ __( 'Map Color indicator for 20', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_20 } style={ pickerstyles.color_20 } />
							{ displayColorPicker_20 ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_20 }/>
								<ChromePicker 
									color={ color_20 } 
									onChangeComplete={ ( color ) => setAttributes( { color_20: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_21 }>{ __( 'Map Color indicator for 21', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_21 } style={ pickerstyles.color_21 } />
							{ displayColorPicker_21 ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_21 }/>
								<ChromePicker 
									color={ color_21 } 
									onChangeComplete={ ( color ) => setAttributes( { color_21: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_na }>{ __( 'Map Color indicator for N/A', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_na } style={ pickerstyles.color_na } />
							{ displayColorPicker_na ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_na }/>
								<ChromePicker 
									color={ color_na } 
									onChangeComplete={ ( color ) => setAttributes( { color_na: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_null }>{ __( 'Map Color indicator for undefine states', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_null } style={ pickerstyles.color_null } />
							{ displayColorPicker_null ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_null }/>
								<ChromePicker 
									color={ color_null } 
									onChangeComplete={ ( color ) => setAttributes( { color_null: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						<hr />
						<div className="info-wrap">{infoList(info)}</div>
					
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									state: ( selected_map == 'NL' ) ? "NLD894" : "AL",
									url: "",
									age_casinos:'18',
									age_poker_rooms:'18',
									age_bingo:'18',
									age_lottery:'18',
									age_dog_horse_racing:'18',
								}]
							});
						}}>Add State</Button>
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
