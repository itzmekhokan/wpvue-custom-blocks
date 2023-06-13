/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
// import './editor.scss';
// import './style.scss';
import Select from 'react-select';

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
import { InspectorControls } from '@wordpress/editor';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	TextControl,
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

registerBlockType( 'wpvcb/top-promotions', { 
	title: __( 'Top Promotions', 'wpvcb-blocks' ), 
	icon: 'admin-page', 
	category: 'wpvcb', 
	attributes: {
		bg_pattern: {
			type: 'string',
			default: ''
		},
		block_title: {
			type: 'string',
			default: ''
		},
		no_of_posts: {
			type: 'string',
			default: ''
		},
		order: {
			type: 'string',
			default: ''
		},
		enable_selected_promotions: {
			type: 'boolean',
			default: false
		},
		post__in: {
			type: 'string',
			default: null
		},
		show_expire_promotions: {
			type: 'boolean',
			default: false
		},
		enable_exclude_promotions: {
			type: 'boolean',
			default: false
		},
		// show_only_calendar: {
		// 	type: 'boolean',
		// 	default: false
		// },
		exclude_days_limit: {
			type: 'string',
			default: ''
		},
		expire_days_limit: {
			type: 'string',
			default: ''
		},
		enable_show_all_link: {
			type: 'boolean',
			default: false
		},
		show_all_link: {
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
			block_title,
			bg_pattern,
			no_of_posts,
			enable_selected_promotions,
			post__in,
			show_expire_promotions,
			enable_exclude_promotions,
			//show_only_calendar,
			exclude_days_limit,
			expire_days_limit,
			enable_show_all_link,
			show_all_link,
			order,
		} = attributes;

		const bindPostsData = wpvcb_blocks_scripts_data_params.data.promotions;
		
		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-page'
					label={ __( 'Top Promotions', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-top-promotions"
				>
					<div className="wpvcb-block__selection wpvcb-block-top-promotions__selection">
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
						<TextControl
							placeholder={ __( 'Add some title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
							} }
						/>
						{/* { !enable_selected_promotions && ( */}
						<TextControl
							label={ __( 'Number of posts', 'wpvcb-blocks' ) }
							type='number'
							min='-1'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { no_of_posts: value } );
							} }
						/>
						{/* )} */}
						{ !enable_selected_promotions && (
						<SelectControl
							label={ __( 'Order', 'wpvcb-blocks' ) }
							value={ order }
							options={ [
								{ label: 'DESC', value: 'DESC' },
								{ label: 'ASC', value: 'ASC' },
							] }
							onChange={ ( value ) =>
								setAttributes( { order: value } )
							}
						/>
						)}
						<ToggleControl
							label={ __(
								'Display Selected promotions only',
								'wpvcb-blocks'
							) }
							checked={ enable_selected_promotions }
							onChange={ ( value ) =>
								setAttributes( { enable_selected_promotions: value } )
							}
						/>
						{ enable_selected_promotions && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='post__in'
							className='basic-multi-select'
							defaultValue={ bindPostsData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindPostsData }
							isMulti='true'
                        />
						)}
						{/* <ToggleControl
							label={ __(
								'Show only calendar promos',
								'wpvcb-blocks'
							) }
							checked={ show_only_calendar }
							onChange={ ( value ) =>
								setAttributes( { show_only_calendar: value } )
							}
						/> */}
						<ToggleControl
							label={ __(
								'Exclude promotions by expiration days longer than',
								'wpvcb-blocks'
							) }
							checked={ enable_exclude_promotions }
							onChange={ ( value ) =>
								setAttributes( { enable_exclude_promotions: value } )
							}
						/>
						{ enable_exclude_promotions && (
						<TextControl
							label={ __( 'Add expiration days', 'wpvcb-blocks' ) }
							type='number'
							min='1'
							value={ exclude_days_limit }
							onChange={ ( value ) => {
								setAttributes( { exclude_days_limit: value } );
							} }
						/>	
						)}
						<ToggleControl
							label={ __(
								'Show expired promotions at the end of the list',
								'wpvcb-blocks'
							) }
							checked={ show_expire_promotions }
							onChange={ ( value ) =>
								setAttributes( { show_expire_promotions: value } )
							}
						/>
						{ show_expire_promotions && (
						<TextControl
							label={ __( 'Expire days limit in days', 'wpvcb-blocks' ) }
							type='number'
							min='1'
							value={ expire_days_limit }
							onChange={ ( value ) => {
								setAttributes( { expire_days_limit: value } );
							} }
						/>
						)}
						<ToggleControl
							label={ __(
								'Enable show all link',
								'wpvcb-blocks'
							) }
							checked={ enable_show_all_link }
							onChange={ ( value ) =>
								setAttributes( { enable_show_all_link: value } )
							}
						/>
						{ enable_show_all_link && (
						<TextControl
							label={ __( 'Show all link', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add your page slug here', 'wpvcb-blocks' ) }
							value={ show_all_link }
							onChange={ ( value ) => {
								setAttributes( { show_all_link: value } );
							} }
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
		return 'null';
	},
} );
