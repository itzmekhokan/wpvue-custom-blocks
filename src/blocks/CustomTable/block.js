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
import { bulletConfiguration } from '../../utils.js';
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
registerBlockType( 'wpvcb/custom-table', { 
	title: __( 'Custom Table', 'wpvcb-blocks' ), 
	icon: 'grid-view', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		table_data: {
			type: 'array',
		},
		enable_header_merge: {
			type: 'boolean',
			default: false
		},
		enable_table_header: {
			type: 'boolean',
			default: false
		},
		header_color: {
			type: 'string',
			default: '#e6e8ea'
		},
		displayColorPicker_header_color: {
			type: 'boolean',
			default: false
		},
		table_header: {
			type: 'array',
		},
		rows: {
			type: 'string',
			default: 0
		},
		display_rows: {
			type: 'string',
			default: ''
		},
		columns: {
			type: 'string',
			default: 0
		},
		enable_link: {
			type: 'boolean',
			default: false
		},
		label_link: {
			type: 'string',
			default: ''
		},
		link_url: {
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
			table_data=[],
			enable_header_merge,
			enable_table_header,
			header_color = '#e6e8ea',
			displayColorPicker_header_color = false,
			table_header=[],
			rows,
			display_rows,
			columns,
			enable_link,
			label_link,
			link_url,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );
		
		const pickerstyles = {
			header_color: {
				width: '40px',
				height: '40px',
				marginBottom: '20px',
				border: '1px solid #757575',
				borderRadius: '2px',
				backgroundColor: `${ header_color }`,
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

		const handleColorPicker_header_color = () => {
			props.setAttributes( { displayColorPicker_header_color: !displayColorPicker_header_color } );
		};

		const handleCloseColorPicker_header_color = () => {
			props.setAttributes( { displayColorPicker_header_color: false } );
		};

		const createTableRowColumns = (table_data, header_data, enable_table_header) => {
			
			return(
				<table className="wpvcb-custom-table">
					{ enable_table_header && (
						<tr className="table-head">
						{header_data.map((data, hindex) => (
							<Fragment key={`${data}~${hindex}`}>
								<th>
									<TextControl
										placeholder={ __( 'Add Header', 'wpvcb-blocks' ) }
										value={ data.text }
										onChange={ ( value ) => {
											const values = [...header_data];
											values[hindex].text = value;
											setAttributes( { header_data: values } );
											setAttributes( { post_id: getCurrentPostId() } );
										} }
									/>
								</th>
							</Fragment>
						))}
							<th>
							<ToggleControl
								label={ __(
									'Merge Header',
									'wpvcb-blocks'
								) }
								checked={ enable_header_merge }
								onChange={ ( value ) => {
									setAttributes( { enable_header_merge: value } );
								} }
							/>
							</th>
						</tr>
					)}
					{table_data.map((inputField, index) => (
					<Fragment key={`${inputField}~${index}`}>
						<tr key={index}>
							{inputField.columns_data.map((columnField, colindex) => (
							<Fragment key={`${columnField}~${colindex}`}>
								<td className="table-td" key={colindex}>
									<SelectControl
										label={ __( 'Alignment', 'wpvcb-blocks' ) }
										value={ columnField.align }
										options={ [
											{ label: 'Left', value: 'left' },
											{ label: 'Center', value: 'center' },
											{ label: 'Right', value: 'right' },
											{ label: 'Justify', value: 'justify' },
										] }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].align = value;
											setAttributes( { table_data: values } );
										} }
									/>
									{/* { (!columnField.enable_text_image && !columnField.enable_text_icon) && ( */}
									<ToggleControl
										label={ __(
											'Enable Text',
											'wpvcb-blocks'
										) }
										checked={ columnField.enable_text }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].enable_text = value;
											setAttributes( { table_data: values } );
										} }
									/>
									{/* )}
									{ !columnField.enable_text_icon && ( */}
									<ToggleControl
										label={ __(
											'Enable Text Image',
											'wpvcb-blocks'
										) }
										checked={ columnField.enable_text_image }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].enable_text_image = value;
											setAttributes( { table_data: values } );
										} }
									/>
									{/* )}
									{ !columnField.enable_text_image && ( */}
									<ToggleControl
										label={ __(
											'Enable Text Icon',
											'wpvcb-blocks'
										) }
										checked={ columnField.enable_text_icon }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].enable_text_icon = value;
											setAttributes( { table_data: values } );
										} }
									/>
									{/* )}
									{ (!columnField.enable_text_image && !columnField.enable_text_icon) && ( */}
									<ToggleControl
										label={ __(
											'Enable Image',
											'wpvcb-blocks'
										) }
										checked={ columnField.enable_image }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].enable_image = value;
											setAttributes( { table_data: values } );
										} }
									/>
									{/* )} */}
									{/* <ToggleControl
										label={ __(
											'Enable Link',
											'wpvcb-blocks'
										) }
										checked={ columnField.enable_link }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].enable_link = value;
											setAttributes( { table_data: values } );
										} }
									/>
									{ columnField.enable_link && (
										<TextControl
											label={ __( 'Add Link Text', 'wpvcb-blocks' ) }
											value={ columnField.link_text }
											onChange={ ( value ) => {
												const values = [...table_data];
												values[index].columns_data[colindex].link_text = value;
												setAttributes( { table_data: values } );
											} }
										/>
									)}
									{ columnField.enable_link && (
										<TextControl
											type='url'
											label={ __( 'Add Link Url', 'wpvcb-blocks' ) }
											value={ columnField.link_url }
											onChange={ ( value ) => {
												const values = [...table_data];
												values[index].columns_data[colindex].link_url = value;
												setAttributes( { table_data: values } );
											} }
										/>
									)} */}
									{ columnField.enable_text_icon && (
									<SelectControl
										label={ __( 'Icon Style', 'wpvcb-blocks' ) }
										value={ columnField.icon_style }
										options={ [
											{ label: 'Blue Tick', value: 'blue_tick' },
											{ label: 'Green Tick', value: 'green_tick' },
											{ label: 'Blue Number', value: 'blue_number' },
											{ label: 'Green Number', value: 'green_number' },
										] }
										onChange={ ( value ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].icon_style = value;
											setAttributes( { table_data: values } );
										} }
									/>
									)}
									{ (columnField.enable_text || columnField.enable_text_image || columnField.enable_text_icon) && (
									// <TextControl
									// 	label={ __( 'Add Text', 'wpvcb-blocks' ) }
									// 	value={ columnField.text }
									// 	onChange={ ( value ) => {
									// 		const values = [...table_data];
									// 		values[index].columns_data[colindex].text = value;
									// 		setAttributes( { table_data: values } );
									// 	} }
									// />
									<CKEditor
										// config={ {
										// 	toolbar: [ 'bold', 'italic', 'link' ]
										// } }
										config={ bulletConfiguration }
										editor={ ClassicEditor }
										data={ columnField.text }
										onChange={ ( event, editor ) => {
											const values = [...table_data];
											values[index].columns_data[colindex].text = editor.getData();
											setAttributes( { table_data: values } );
										} }
									/>
									)}
									
									{ (columnField.enable_image || columnField.enable_text_image ) && (
									<MediaUploadCheck>
										<MediaUpload
											onSelect={ ( media ) => {
												const values = [...table_data];
												values[index].columns_data[colindex].image = media.url;
												setAttributes( { table_data: values } );
											} }
											allowedTypes={ ['image'] }
											value={ columnField.image }
											render={ ( { open } ) => (
												<div class="wpvcb-media-preview-wrap">
													<img 
													class="media-upload-img" 
													onClick={ open } 
													src={ columnField.image ? columnField.image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
													title={ !columnField.image ? __( 'Add image', 'wpvcb-blocks' ) : __( 'Change image', 'wpvcb-blocks' )  }
													/>
													{ columnField.image && (
													<Button 
														onClick={ () => {
															const values = [...table_data];
															values[index].columns_data[colindex].image = '';
															setAttributes( { table_data: values } );
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
								</td>
							</Fragment>
							))}
							<td>
							<Button
                                className="remove-item cross-button"
                                onClick={ () => {
									const values = [...table_data];
									values.splice(index, 1);
                                    setAttributes({ table_data: values });
                                } }
                            >Delete Row &times;</Button>
							<ToggleControl
								label={ __(
									'Merge Cells',
									'wpvcb-blocks'
								) }
								checked={ inputField.merge_cell }
								onChange={ ( value ) => {
									const values = [...table_data];
									values[index].merge_cell = value;
									setAttributes( { table_data: values } );
								} }
							/>
							</td>
						</tr>
					</Fragment>
					))}
					{ table_data.length > 0 && (
					<tr key={ table_data.length }><td colSpan={ columns }><Button className="add-row-button" onClick={ (value) => {
							let prev_tbl_data = [...table_data];
							let columns_data = []
							for (let j = 0; j < columns; j++) {
								columns_data.push({ 
									align: 'left', 
									text: '', 
									enable_text: false, 
									enable_text_image: false, 
									enable_text_icon: false,
									icon_style: 'blue_tick', 
									image: '', 
									enable_image: false,
									enable_link: false,
									link_text: '',
									link_url: '',
								});
							}
							prev_tbl_data.push({ merge_cell: false, columns_data: columns_data });
								
							setAttributes( { table_data: prev_tbl_data } );
						}}>Add Row</Button></td></tr>
					)}
				</table>
			)		
		}

		return (
			<Fragment>
				<Placeholder 
					icon= 'grid-view'
					label={ __( 'Custom Table', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-custom-table"
				>
					<div className="wpvcb-block__selection wpvcb-block-custom-table__selection">
						<TextControl
							label={ __( 'Add rows', 'wpvcb-blocks' ) }
							value={ rows }
							onChange={ ( value ) => {
								setAttributes( { rows: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
						/>
						<TextControl
							label={ __( 'Add columns', 'wpvcb-blocks' ) }
							value={ columns }
							onChange={ ( value ) => {
								setAttributes( { columns: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable table header',
								'wpvcb-blocks'
							) }
							checked={ enable_table_header }
							onChange={ ( value ) => {
								setAttributes( { enable_table_header: value } );
								if( value ) {
									setAttributes( { table_header: [] } );
									const updated_header = []
									for (let j = 0; j < columns; j++) {
										updated_header.push({ text: '' });
									}
									setAttributes( { table_header: updated_header } );
								}
							} }
						/>
						{/* { enable_table_header && (
						<div class="wrap-color-picker">
							<label onClick={ handleColorPicker_header_color }>{ __( 'Table Header Color', 'wpvcb-blocks' ) }</label>
							<div onClick={ handleColorPicker_header_color } style={ pickerstyles.header_color } />
							{ displayColorPicker_header_color ? 
							<div style={ pickerstyles.popover }>
								<div style={ pickerstyles.cover } onClick={ handleCloseColorPicker_header_color }/>
								<ChromePicker 
									color={ header_color } 
									onChangeComplete={ ( color ) => setAttributes( { header_color: color.hex } ) } 
								/>
							</div>
							: null }
						</div>
						)} */}
						<ToggleControl
							label={ __(
								'Enable links',
								'wpvcb-blocks'
							) }
							checked={ enable_link }
							onChange={ ( value ) => {
								setAttributes( { enable_link: value } );
							} }
						/>
						{ enable_link && (
						<TextControl
							label={ __( 'Add link label', 'wpvcb-blocks' ) }
							value={ label_link }
							onChange={ ( value ) => {
								setAttributes( { label_link: value } );
							} }
						/>
						)}
						{ enable_link && (
						<TextControl
							label={ __( 'Add link url', 'wpvcb-blocks' ) }
							value={ link_url }
							onChange={ ( value ) => {
								setAttributes( { link_url: value } );
							} }
						/>
						)}
						<TextControl
							type="number"
							min="1"
							label={ __( 'Default display rows', 'wpvcb-blocks' ) }
							help={ __( 'Add the number of rows show by default with "Show More"', 'wpvcb-blocks' ) }
							value={ display_rows }
							onChange={ ( value ) => {
								setAttributes( { display_rows: value } );
							} }
						/>
						
						<Button className="add-more-button" onClick={ (value) => {
							setAttributes( { table_data: [] } );
							setAttributes( { table_header: [] } );
							const updated_data = []
							const updated_header = []
							if( enable_table_header ) {
								for (let j = 0; j < columns; j++) {
									updated_header.push({ text: '' });
								}
								setAttributes( { table_header: updated_header } );
							}else{
								setAttributes( { table_header: [] } );
							}
							if( rows ) {
								for (let i = 0; i < rows; i++) {
									let columns_data = []
									for (let j = 0; j < columns; j++) {
										columns_data.push({ 
											align: 'left', 
											text: '', 
											enable_text: false, 
											enable_text_image: false, 
											enable_text_icon: false,
											icon_style: 'blue_tick', 
											image: '', 
											enable_image: false 
										});
									}
									updated_data.push({ merge_cell: false, columns_data: columns_data });
								}
								setAttributes( { table_data: updated_data } );
							}else{
								setAttributes( { table_data: [] } );
							}

						}}>Create Table</Button>
						{createTableRowColumns(table_data, table_header, enable_table_header)}
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
