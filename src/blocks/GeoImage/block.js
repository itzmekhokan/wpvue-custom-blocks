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

registerBlockType('wpvcb/geo-image', {
	title: __('Geo Image', 'wpvcb-blocks'),
	icon: 'admin-site-alt3',
	category: 'wpvcb',
	keywords: [
		__('Geo Image', 'wpvcb-blocks'),
		__('Image', 'wpvcb-blocks'),
		__('Geo', 'wpvcb-blocks'),
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
							<p className="section-heading">Geo Image {infoItem.index + 1}</p>
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
							<MediaUploadCheck>
								<MediaUpload
									onSelect={(media) => {
										const newObject = Object.assign({}, infoItem, {
											image: media.url
										})
										setAttributes({
											info: [...info.filter(
												item => item.index != infoItem.index
											), newObject]
										})
										//setAttributes( { image: media.url } );
									}}
									allowedTypes={['image']}
									value={infoItem.image}
									render={({ open }) => (
										<div class="wpvcb-media-preview-wrap">
											<img
												class="media-upload-img"
												onClick={open}
												src={infoItem.image ? infoItem.image : wpvcb_blocks_scripts_data_params.data.placeholder_img}
												title={!infoItem.image ? __('Upload Geo Image', 'wpvcb-blocks') : __('Change Geo Image', 'wpvcb-blocks')}
											/>
											{ infoItem.image && (
												<Button
													onClick={() => {
														const newObject = Object.assign({}, infoItem, {
															image: ''
														})
														setAttributes({
															info: [...info.filter(
																item => item.index != infoItem.index
															), newObject]
														})
														//setAttributes( { image: '' } );
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

						</div>
					)
				})
			)
		}

		return (
			<Fragment>
				<Placeholder
					icon='admin-site-alt3'
					label={__('Geo Image', 'wpvcb-blocks')}
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-geo-image">
					<div className={className}>

						<MediaUploadCheck>
							<MediaUpload
								onSelect={(media) => {
									setAttributes({ image: media.url })
								}}
								allowedTypes={['image']}
								value={image}
								render={({ open }) => (
									<div class="wpvcb-media-preview-wrap">
										<img
											class="media-upload-img"
											onClick={open}
											src={image ? image : wpvcb_blocks_scripts_data_params.data.placeholder_img}
											title={!image ? __('Upload Image', 'wpvcb-blocks') : __('Change Image', 'wpvcb-blocks')}
										/>
										{ image && (
											<Button
												onClick={() => {
													setAttributes({ image: '' })
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

						<div className="info-wrap">{infoList(info)}</div>

						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									country_code: '',
									image: '',
								}]
							})
						}}>Add Geo Located Image</Button>
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
