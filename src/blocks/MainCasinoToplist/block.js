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
registerBlockType( 'wpvcb/main-casino-toplist', { 
	title: __( 'Main Casino Toplist', 'wpvcb-blocks' ), 
	icon: 'list-view', 
	category: 'wpvcb', 
	attributes: {
		group_id: {
			type: 'string',
			default: ''
		},
		quantity: {
			type: 'string',
			default: ''
		},
		gift_icon: {
			type: 'string',
			default: ''
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
			quantity,
			gift_icon,
			enable_tags,
			tag_mode,
			tags,
			enable_sort_by,
			sort_by,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'list-view'
					label={ __( 'Main Casino Toplist', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-main-casino-toplist"
				>
					<div className="wpvcb-block__selection wpvcb-block-main-casino-toplist__selection">
						<TextControl
							help={ __( 'It will respect global group ID from settings, if there is no group ID provied with the block.', 'wpvcb-blocks' ) }
							label={ __( 'Add Toplist Group ID ( Optional )', 'wpvcb-blocks' ) }
							value={ group_id }
							onChange={ ( value ) => {
								setAttributes( { group_id: value } );
							} }
						/>
						<TextControl
							label={ __( 'Add Quantity', 'wpvcb-blocks' ) }
							help={ __( 'Leave empty to get all toplist data.', 'wpvcb-blocks' ) }
							min='1'
							type='number'
							value={ quantity }
							onChange={ ( value ) => {
								setAttributes( { quantity: value } );
							} }
						/>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { gift_icon: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ gift_icon }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ gift_icon ? gift_icon : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !gift_icon ? __( 'Add Gift Icon', 'wpvcb-blocks' ) : __( 'Change Gift Icon', 'wpvcb-blocks' )  }
										/>
										{ gift_icon && (
										<Button 
											onClick={ () => {
											setAttributes( { gift_icon: '' } );
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
								'Enable filter toplist by tag ( Optional )',
								'wpvcb-blocks'
							) }
							checked={ enable_tags }
							onChange={ ( value ) =>
								setAttributes( { enable_tags: value } )
							}
						/>
					
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
