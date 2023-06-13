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
import { Fragment } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
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
registerBlockType( 'wpvcb/custom-youtube', { 
	title: __( 'Custom Youtube / Vimeo', 'wpvcb-blocks' ), 
	icon: 'format-video', 
	category: 'wpvcb', 
	attributes: {
		video_type: {
			type: 'string',
			default: 'youtube'
		},
		vimeo_url: {
			type: 'string',
			default: ''
		},
		vimeo_thumbnail_type: {
			type: 'string',
			default: ''
		},
		video_align: {
			type: 'string',
			default: 'left'
		},
		youtube_url: {
			type: 'string',
			default: ''
		},
		thumbnail_type: {
			type: 'string',
			default: ''
		},
		thumbnail_alt: {
			type: 'string',
			default: ''
		},
		iframe_width: {
			type: 'string',
			default: ''
		},
		iframe_height: {
			type: 'string',
			default: ''
		},
		disable_fullscreen: {
			type: 'boolean',
			default: false
		},
		enable_related: {
			type: 'boolean',
			default: false
		},
		disable_autoplay: {
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
			video_type,
			vimeo_url,
			vimeo_thumbnail_type,
			youtube_url,
			thumbnail_type,
			video_align,
			thumbnail_alt,
			disable_fullscreen,
			enable_related,
			disable_autoplay,
			iframe_width,
			iframe_height,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'format-video'
					label={ __( 'Custom Youtube / Vimeo', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-custom-youtube"
				>
					<div className="wpvcb-block__selection wpvcb-block-custom-youtube__selection">
						<SelectControl
							label={ __( 'Video Type', 'wpvcb-blocks' ) }
							value={ video_type }
							options={ [
								{ label: 'Youtube', value: 'youtube' },
								{ label: 'Vimeo', value: 'vimeo' },
							] }
							onChange={ ( value ) =>
								setAttributes( { video_type: value } )
							}
						/>
						{ video_type == 'youtube' && (
						<TextControl
							placeholder={ __( 'Add Youtube video url', 'wpvcb-blocks' ) }
							label={ __( 'Youtube Url', 'wpvcb-blocks' ) }
							value={ youtube_url }
							onChange={ ( value ) => {
								setAttributes( { youtube_url: value } );
							} }
						/>
						) }
						{ video_type == 'youtube' && (
						<SelectControl
							label={ __( 'Video Thumbnail', 'wpvcb-blocks' ) }
							value={ thumbnail_type }
							options={ [
								{ label: 'Max Resolution', value: 'maxresdefault.jpg' },
								{ label: 'Default', value: 'default.jpg' },
								{ label: 'HQ Default', value: 'hqdefault.jpg' },
								{ label: 'Medium Default', value: 'mqdefault.jpg' },
								{ label: 'Standard Default', value: 'sddefault.jpg' },
							] }
							onChange={ ( value ) =>
								setAttributes( { thumbnail_type: value } )
							}
						/>
						) }
						{ video_type == 'vimeo' && (
						<TextControl
							placeholder={ __( 'Add Vimeo video url', 'wpvcb-blocks' ) }
							label={ __( 'Vimeo Url', 'wpvcb-blocks' ) }
							value={ vimeo_url }
							onChange={ ( value ) => {
								setAttributes( { vimeo_url: value } );
							} }
						/>
						) }
						{ video_type == 'vimeo' && (
						<SelectControl
							label={ __( 'Video Thumbnail', 'wpvcb-blocks' ) }
							value={ vimeo_thumbnail_type }
							options={ [
								{ label: 'Thumbnail large', value: '640.jpg' },
								{ label: 'Thumbnail medium', value: '200.jpg' },
								{ label: 'Thumbnail small', value: '100.jpg' },
							] }
							onChange={ ( value ) =>
								setAttributes( { vimeo_thumbnail_type: value } )
							}
						/>
						) }
						<SelectControl
							label={ __( 'Video Align', 'wpvcb-blocks' ) }
							value={ video_align }
							options={ [
								{ label: 'Left', value: 'left' },
								{ label: 'Center', value: 'center' },
								{ label: 'Right', value: 'right' },
							] }
							onChange={ ( value ) =>
								setAttributes( { video_align: value } )
							}
						/>
						<TextControl
							placeholder={ __( 'Thumbnail Alt Text', 'wpvcb-blocks' ) }
							label={ __( 'Thumbnail Alt Text', 'wpvcb-blocks' ) }
							value={ thumbnail_alt }
							onChange={ ( value ) => {
								setAttributes( { thumbnail_alt: value } );
							} }
						/>
						<TextControl
							placeholder={ __( 'Iframe width. Example - 500', 'wpvcb-blocks' ) }
							label={ __( 'Iframe width', 'wpvcb-blocks' ) }
							value={ iframe_width }
							onChange={ ( value ) => {
								setAttributes( { iframe_width: value } );
							} }
						/>
						<TextControl
							placeholder={ __( 'Iframe height. Example - 281', 'wpvcb-blocks' ) }
							label={ __( 'Iframe height', 'wpvcb-blocks' ) }
							value={ iframe_height }
							onChange={ ( value ) => {
								setAttributes( { iframe_height: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Disable allow fullscreen',
								'wpvcb-blocks'
							) }
							checked={ disable_fullscreen }
							onChange={ ( value ) =>
								setAttributes( { disable_fullscreen: value } )
							}
						/>
						{ video_type == 'youtube' && (
						<ToggleControl
							label={ __(
								'Enable related',
								'wpvcb-blocks'
							) }
							checked={ enable_related }
							onChange={ ( value ) =>
								setAttributes( { enable_related: value } )
							}
						/>
						) }
						<ToggleControl
							label={ __(
								'Disable autoplay',
								'wpvcb-blocks'
							) }
							checked={ disable_autoplay }
							onChange={ ( value ) =>
								setAttributes( { disable_autoplay: value } )
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
