/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
import './editor.scss'
// import './style.scss'
//import { ChromePicker } from "react-color";

/**
 * External dependencies
 */
const { __ } = wp.i18n
const { registerBlockType } = wp.blocks
import { InspectorControls } from '@wordpress/editor'
import { Fragment } from '@wordpress/element'
import { RichText } from '@wordpress/block-editor'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { bulletConfiguration } from '../../utils.js'
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor'
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
} from '@wordpress/components'

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

registerBlockType('wpvcb/tab-switcher', {
	title: __('Tab Switcher', 'wpvcb-blocks'),
	icon: 'share-alt2',
	category: 'wpvcb',
	keywords: [
		__('Tab Switcher', 'wpvcb-blocks'),
		__('Tab', 'wpvcb-blocks'),
		__('Switcher', 'wpvcb-blocks'),
	],
	attributes: {

		image: {
			type: 'string',
			default: ''
		},
		info: {
			type: 'array',
			selector: '.info-wrap'
		},
		info_content: {
			type: 'array',
			selector: '.info-content-wrap'
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
	edit: (props) => {
		const { attributes, setAttributes, className } = props
		const {
			image,
			info = [],
		} = attributes

		const infoContentList = (values, tabdata) => {
			return (
				values.sort((a, b) => a.index - b.index).map(infoItem => {
					return (
						<div className="info-item">
							<Button
								className="remove-item cross-button"
								onClick={() => {
									const newInfo = values.filter(item => item.index != infoItem.index).map(i => {
										if (i.index > infoItem.index) {
											i.index -= 1
										}
										return i
									})
									tabdata.content = newInfo;
									setAttributes({
										info: [...info.filter(
											item => item.index != tabdata.index
										), tabdata]
									})
									//setAttributes({ info: newInfo })
								}}
							>&times;</Button>
							<p className="section-heading">Content {infoItem.index + 1}</p>
							<SelectControl
								label={ __( 'Field Type', 'wpvcb-blocks' ) }
								value={ infoItem.field_type }
								options={ [
									{ label: 'Text', value: 'text' },
									{ label: 'Image', value: 'image' },
									{ label: 'Text with Image', value: 'text_with_image' },
									{ label: 'Text with Icon', value: 'text_with_icon' },
									// { label: 'List with Icon', value: 'list_with_icon' },
								] }
								onChange={ ( value ) => {
									const newContentObject = Object.assign({}, infoItem, {
										field_type: value
									})
									values[infoItem.index] = newContentObject;
									tabdata.content = values;
									setAttributes({
										info: [...info.filter(
											item => item.index != tabdata.index
										), tabdata]
									})
								} }
							/>
							{ (infoItem.field_type == 'text_with_icon' || infoItem.field_type == 'list_with_icon' ) && (
							<SelectControl
								label={ __( 'Icon Style', 'wpvcb-blocks' ) }
								value={ infoItem.icon_style }
								options={ [
									{ label: 'Blue Tick', value: 'blue_tick' },
									{ label: 'Green Tick', value: 'green_tick' },
									{ label: 'Blue Number', value: 'blue_number' },
									{ label: 'Green Number', value: 'green_number' },
									{ label: 'None', value: 'none' },
								] }
								onChange={ ( value ) => {
									const newContentObject = Object.assign({}, infoItem, {
										icon_style: value
									})
									values[infoItem.index] = newContentObject;
									tabdata.content = values;
									setAttributes({
										info: [...info.filter(
											item => item.index != tabdata.index
										), tabdata]
									})
								} }
							/>
							)}
							{/* { infoItem.field_type == 'list_with_icon' && (
							<CKEditor
								config={ bulletConfiguration }
								editor={ ClassicEditor }
								data={ infoItem.text }
								onChange={ ( event, editor ) => {
									const newContentObject = Object.assign({}, infoItem, {
										text: editor.getData()
									})
									values[infoItem.index] = newContentObject;
									tabdata.content = values;
									setAttributes({
										info: [...info.filter(
											item => item.index != tabdata.index
										), tabdata]
									})
									
								} }
							/>
							)} */}
							{ (infoItem.field_type == 'text' || infoItem.field_type == 'text_with_image' || infoItem.field_type == 'text_with_icon') && (
							<TextareaControl
								placeholder={__('Add Text', 'wpvcb-blocks')}
								label={__('Text', 'wpvcb-blocks')}
								value={infoItem.text}
								onChange={(value) => {
									const newContentObject = Object.assign({}, infoItem, {
										text: value
									})
									values[infoItem.index] = newContentObject;
									tabdata.content = values;
									setAttributes({
										info: [...info.filter(
											item => item.index != tabdata.index
										), tabdata]
									})
								}}
							/>
							)}
							{ (infoItem.field_type == 'image' || infoItem.field_type == 'text_with_image') && (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										const newContentObject = Object.assign({}, infoItem, {
											image: media.url
										})
										values[infoItem.index] = newContentObject;
										tabdata.content = values;
										setAttributes({
											info: [...info.filter(
												item => item.index != tabdata.index
											), tabdata]
										})
										
									}}
									allowedTypes={['image']}
									value={infoItem.image}
									render={({ open }) => (
										<div class="wpvcb-media-preview-wrap">
											<img
												class="media-upload-img"
												onClick={open}
												src={infoItem.image ? infoItem.image : wpvcb_blocks_scripts_data_params.data.placeholder_img}
												title={!infoItem.image ? __('Upload Image', 'wpvcb-blocks') : __('Change Image', 'wpvcb-blocks')}
											/>
											{ infoItem.image && (
												<Button
													onClick={() => {
														const newContentObject = Object.assign({}, infoItem, {
															image: ''
														})
														values[infoItem.index] = newContentObject;
														tabdata.content = values;
														setAttributes({
															info: [...info.filter(
																item => item.index != tabdata.index
															), tabdata]
														})
													}}
													className="remove-img"
													isLink isDestructive>
													{__('Remove', 'wpvcb-blocks')}
												</Button>
											)}
										</div>
									)}
								/>
							</MediaUploadCheck>
							)}
						</div>
					)
				})
			)
		}

		const infoList = (value) => {
			return (
				value.sort((a, b) => a.index - b.index).map(infoItem => {
					return (
						<div className="info-item">
							<Button
								className="remove-item cross-button"
								onClick={() => {
									const newInfo = info.filter(item => item.index != infoItem.index).map(i => {
										if (i.index > infoItem.index) {
											i.index -= 1
										}
										return i
									})
									setAttributes({ info: newInfo })
								}}
							>&times;</Button>
							<p className="section-heading">Tab {infoItem.index + 1}</p>
							<TextControl
								placeholder={__('Tab Title', 'wpvcb-blocks')}
								label={__('Tab Title', 'wpvcb-blocks')}
								value={infoItem.title}
								onChange={(value) => {
									const newObject = Object.assign({}, infoItem, {
										title: value
									})
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									})
								}}
							/>
							<div className="info-content-wrap">{infoContentList(infoItem.content, infoItem)}</div>
							<Button className="add-more-button" onClick={title => {
								const newContentObject = [...infoItem.content, {
									index: infoItem.content.length,
									field_type: 'text',
									text: '',
									image: '',
									icon_style: 'blue_tick',
								}]
								const newObject = Object.assign({}, infoItem, {
									content: newContentObject
								})
								setAttributes({
									info: [...info.filter(
										item => item.index != infoItem.index
									), newObject]
								})
								// setAttributes({
								// 	info: [...info, {
								// 		index: info.length,
								// 		field_type: 'text',
								// 		text: '',
								// 		image: '',
								// 		icon_style: 'blue_tick',
								// 	}]
								// })
							}}>Add Content</Button>
						</div>
					)
				})
			)
		}

		return (
			<Fragment>
				<Placeholder
					icon='share-alt2'
					label={__('Tab Switcher', 'wpvcb-blocks')}
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-tab-switcher">
					<div className={className}>

						<div className="info-wrap">{infoList(info)}</div>

						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									title: '',
									content: [],
								}]
							})
						}}>Add Tabs</Button>
					</div>
				</Placeholder>
			</Fragment>
		)
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
	save: (props) => {
		const info = props.attributes.info
		if (info != '' && info != null) {
			const displayInfoList = (value) => {
				return (value.map(infoItem => {
					return (
						<div className="info-item">
							<RichText.Content
								tagName="h4"
								className="info-item-title"
								value={infoItem.title}
								style={{ height: 58 }}
							/>
						</div>
					)
				})
				)
			}
			return (
				<div className={props.className}>
					<div className="info-wrap">{displayInfoList(info)}</div>
				</div>
			)
		} else {
			null
		}
	},
})
