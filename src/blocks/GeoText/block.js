/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
// import './editor.scss'
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
const { getCurrentPostId } = wp.data.select("core/editor");
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

registerBlockType('wpvcb/geo-text', {
	title: __('Geo Text Content', 'wpvcb-blocks'),
	icon: 'admin-site-alt3',
	category: 'wpvcb',
	keywords: [
		__('Geo Text Contenth', 'wpvcb-blocks'),
		__('Paragraph', 'wpvcb-blocks'),
		__('Heading', 'wpvcb-blocks'),
	],
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		text_tag: {
			type: 'string',
			default: 'h2'
		},
		content: {
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
	edit: (props) => {
		const { attributes, setAttributes, className } = props
		const {
			post_id,
			content,
			text_tag,
			info = [],
		} = attributes

		setAttributes( { post_id: getCurrentPostId() } );

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
							<p className="section-heading">Geo Content {infoItem.index + 1}</p>
							<TextControl
								placeholder={__('Country / Country-State Code', 'wpvcb-blocks')}
								label={__('Country / Country-State Code', 'wpvcb-blocks')}
								help={__('Use country or country with state code. Example format - US or US-NJ or US-NJ,CA', 'wpvcb-blocks')}
								value={infoItem.country_code}
								onChange={(value) => {
									const newObject = Object.assign({}, infoItem, {
										country_code: value
									})
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									})
								}}
							/>
							{ text_tag != 'p' && (
								<TextControl
									placeholder={__('Text Content', 'wpvcb-blocks')}
									label={__('Text Content', 'wpvcb-blocks')}
									value={infoItem.content}
									onChange={(value) => {
										const newObject = Object.assign({}, infoItem, {
											content: value
										})
										setAttributes({
											info: [...info.filter(
												item => item.index != infoItem.index
											), newObject]
										})
									}}
								/>
							)}
							{ text_tag == 'p' && (
								<TextareaControl
									placeholder={__('Add Content', 'wpvcb-blocks')}
									label={__('Add Content', 'wpvcb-blocks')}
									value={infoItem.content}
									onChange={(value) => {
										const newObject = Object.assign({}, infoItem, {
											content: value
										})
										setAttributes({
											info: [...info.filter(
												item => item.index != infoItem.index
											), newObject]
										})
									}}
								/>
							)}
						</div>
					)
				})
			)
		}

		return (
			<Fragment>
				<Placeholder
					icon='admin-site-alt3'
					label={__('Geo Text Content', 'wpvcb-blocks')}
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-geo-text">
					<div className={className}>
						<SelectControl
							label={__('Content Tag', 'wpvcb-blocks')}
							value={text_tag}
							options={[
								{ label: 'h1', value: 'h1' },
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'h5', value: 'h5' },
								{ label: 'h6', value: 'h6' },
								{ label: 'p', value: 'p' },
							]}
							onChange={(value) => {
								setAttributes({ text_tag: value })
							}}
						/>
						{text_tag != 'p' && (
							<TextControl
								placeholder={__('Add Content', 'wpvcb-blocks')}
								label={__('Add Content', 'wpvcb-blocks')}
								value={content}
								onChange={(value) => {
									setAttributes({ content: value })
								}}
							/>
						)}
						{text_tag == 'p' && (
							<TextareaControl
								placeholder={__('Add Content', 'wpvcb-blocks')}
								label={__('Add Content', 'wpvcb-blocks')}
								value={content}
								onChange={(value) => {
									setAttributes({ content: value })
								}}
							/>
						)}
						<div className="info-wrap">{infoList(info)}</div>

						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									country_code: '',
									content: '',
								}]
							})
						}}>Add Geo Located Content</Button>
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
