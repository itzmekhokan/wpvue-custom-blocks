/**
 * BLOCK: Page Intro Block
 *
 */

//  Import CSS.
import './editor.scss';
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
import { editorConfiguration } from '../../utils.js';
import { ChromePicker } from "react-color";
import {
	ColorPicker,
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
registerBlockType( 'wpvcb/intro-block', { 
	title: __( 'Intro Block', 'wpvcb-blocks' ), 
	icon: 'edit-large', 
	category: 'wpvcb', 
	attributes: {
		title: {
			type: 'string',
			default: ''
		},
		title_tag: {
			type: 'string',
			default: 'h1'
		},
		alignment: {
			type: 'string',
			default: 'left'
		},
		content: {
			type: 'string',
			default: ''
		},
		content_padding_lr: {
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
		enable_bg_color: {
			type: 'boolean',
			default: true
		},
		custom_bg_color: {
			type: 'string',
			default: ''
		},
		displayColorPicker_custom_bg: {
			type: 'boolean',
			default: false
		},
		disable_showmore: {
			type: 'boolean',
			default: false
		},
		disable_showmore_mobile: {
			type: 'boolean',
			default: false
		},
		enable_top_space: {
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
			title,
			title_tag,
			alignment,
			content,
			content_padding_lr,
			no_of_lines,
			no_of_lines_mobile,
			enable_bg_color,
			custom_bg_color,
			displayColorPicker_custom_bg,
			disable_showmore,
			disable_showmore_mobile,
			enable_top_space,
		} = attributes;

		const pickerstyles = {
			bg_color: {
				width: '40px',
				height: '40px',
				borderRadius: '2px',
				border: '1px solid rgb(123, 123, 123)',
				backgroundColor: `${ custom_bg_color }`,
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


		return (
			<Fragment>
				<Placeholder 
					icon= 'edit-large'
					label={ __( 'Intro Block Data', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-intro-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-intro-block__selection">
						
						<TextControl
							label={ __( 'Title / Heading', 'wpvcb-blocks' ) }
							value={ title }
							onChange={ ( value ) => {
								setAttributes( { title: value } );
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
						<SelectControl
							label={ __( 'Alignment', 'wpvcb-blocks' ) }
							value={ alignment }
							options={ [
								{ label: 'Left', value: 'left' },
								{ label: 'Right', value: 'right' },
								{ label: 'Center', value: 'center' },
								{ label: 'Justify', value: 'justify' },
							] }
							onChange={ ( value ) =>
								setAttributes( { alignment: value } )
							}
						/>
						
						<CKEditor
							config={ editorConfiguration }
							editor={ ClassicEditor }
							data={ content }
							onChange={ ( event, editor ) => {
								setAttributes( { content: editor.getData() } );
							  } }
						/>
						<TextControl
							label={ __( 'Content side padding', 'wpvcb-blocks' ) }
							help={ __( 'You can set content left and right padding with this. Add only number, for example for 20px add 20.', 'wpvcb-blocks' ) }
							min='1'
							type='number'
							value={ content_padding_lr }
							onChange={ ( value ) => {
								setAttributes( { content_padding_lr: value } );
							} }
						/>
						<TextControl
							label={ __( 'Numbers of Line visible in desktop', 'wpvcb-blocks' ) }
							help={ __( 'Maximum line limit for content can be 4 for better view.', 'wpvcb-blocks' ) }
							min='1'
							type='number'
							value={ no_of_lines }
							onChange={ ( value ) => {
								setAttributes( { no_of_lines: value } );
							} }
						/>
						<TextControl
							label={ __( 'Numbers of Line visible in mobile', 'wpvcb-blocks' ) }
							help={ __( 'Maximum line limit for content can be 4 for better view.', 'wpvcb-blocks' ) }
							min='1'
							type='number'
							value={ no_of_lines_mobile }
							onChange={ ( value ) => {
								setAttributes( { no_of_lines_mobile: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Primary Background color',
								'wpvcb-blocks'
							) }
							checked={ enable_bg_color }
							onChange={ ( value ) =>
								setAttributes( { enable_bg_color: value } )
							}
						/>
						{ !enable_bg_color && (
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
						<ToggleControl
							label={ __(
								'Disable Show more for desktop',
								'wpvcb-blocks'
							) }
							checked={ disable_showmore }
							onChange={ ( value ) =>
								setAttributes( { disable_showmore: value } )
							}
						/>
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
						<ToggleControl
							label={ __(
								'Enable space on top',
								'wpvcb-blocks'
							) }
							checked={ enable_top_space }
							onChange={ ( value ) =>
								setAttributes( { enable_top_space: value } )
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
