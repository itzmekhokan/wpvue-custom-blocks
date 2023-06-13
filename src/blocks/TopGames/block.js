/**
 * BLOCK: BestPaymentMethods
 *
 */

import Select from 'react-select';
//  Import CSS.
// import './editor.scss';
// import './style.scss';

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 

import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import {
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

registerBlockType( 'wpvcb/top-games', { 
	title: __( 'Top Games', 'wpvcb-blocks' ), 
	icon: 'shield', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		block_title: {
			type: 'string',
			default: ''
		},
		style: {
			type: 'string',
			default: 'full'
		},
		no_of_posts: {
			type: 'string',
			default: ''
		},
		game_type: {
			type: 'string',
			default: ''
		},
		enable_selected_games: {
			type: 'boolean',
			default: false
		},
		post__in: {
			type: 'string',
			default: null
		},
		enable_filter_provider: {
			type: 'boolean',
			default: false
		},
		provider: {
			type: 'string',
			default: null
		},
		enable_filters: {
			type: 'boolean',
			default: false
		},
		disable_review: {
			type: 'boolean',
			default: false
		},
		enable_show_all_games_link: {
			type: 'boolean',
			default: false
		},
		show_all_games_link: {
			type: 'string',
			default: ''
		},
		enable_selected_game_cats: {
			type: 'boolean',
			default: false
		},
		term__in: {
			type: 'string',
			default: null
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
			no_of_posts,
			post_id,
			game_type,
			style,
			enable_selected_games,
			post__in,
			enable_filter_provider,
			provider,
			enable_filters,
			disable_review,
			enable_show_all_games_link,
			show_all_games_link,
			enable_selected_game_cats,
			term__in,
		} = attributes;

		const addExclude = () => {
			props.setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
		}

		let bindGamePostsData = [];
		if( game_type ) {
			bindGamePostsData = ( game_type == 'game_paid' ) ? wpvcb_blocks_scripts_data_params.data.game_paid : wpvcb_blocks_scripts_data_params.data.game_free;
		}else{
			bindGamePostsData = wpvcb_blocks_scripts_data_params.data.games;
		}

		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );

		const bindSoftwareProviderData = wpvcb_blocks_scripts_data_params.data.software_provider;

		const handleProviderChange = ( provider ) => setAttributes( { provider: JSON.stringify( provider ) } );

		const bindGameCatData = wpvcb_blocks_scripts_data_params.data.game_cat;

		const handleCategoryChange = ( term__in ) => setAttributes( { term__in: JSON.stringify( term__in ) } );

		return (
			<Fragment>
				<Placeholder 
					icon= 'shield'
					label={ __( 'Top Games', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-top-games"
				>
					<div className="wpvcb-block__selection wpvcb-block-top-games__selection" onClick={ addExclude }>
						<TextControl
							type="hidden"
							value={ post_id }
						/>
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Top Games on Casino Top10', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { block_title: value } );
							} }
						/>
						<SelectControl
							label={ __( 'Game Type', 'wpvcb-blocks' ) }
							value={ game_type }
							options={ [
								{ label: 'Select a type', value: '' },
								{ label: 'Free', value: 'game_free' },
								{ label: 'Paid', value: 'game_paid' },
							] }
							onChange={ ( value ) =>
								setAttributes( { game_type: value } )
							}
						/>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Full View', value: 'full' },
								{ label: 'Mini View', value: 'mini' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ style == 'mini' && (
						<ToggleControl
							label={ __(
								'Enable filters for mini view',
								'wpvcb-blocks'
							) }
							checked={ enable_filters }
							onChange={ ( value ) =>
								setAttributes( { enable_filters: value } )
							}
						/>
						)}
						{ !enable_selected_games && (
						<TextControl
							label={ __( 'Number of posts', 'wpvcb-blocks' ) }
							type='number'
							min='-1'
							max='4'
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { post_id: wpvcb_blocks_scripts_data_params.data.postID } );
								setAttributes( { no_of_posts: value } );
							} }
						/>
						)}
						<ToggleControl
							label={ __(
								'Display Selected games only',
								'wpvcb-blocks'
							) }
							checked={ enable_selected_games }
							onChange={ ( value ) =>
								setAttributes( { enable_selected_games: value } )
							}
						/>
						{ enable_selected_games && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='post__in'
							className='basic-multi-select'
							defaultValue={ bindGamePostsData }
                        	value={ JSON.parse( post__in ) }
                        	onChange={ handleSelectChange }
                        	options={ bindGamePostsData }
							isMulti='true'
                        />
						)}
						<ToggleControl
							label={ __(
								'Enable filter by game provider',
								'wpvcb-blocks'
							) }
							checked={ enable_filter_provider }
							onChange={ ( value ) =>
								setAttributes( { enable_filter_provider: value } )
							}
						/>
						{ enable_filter_provider && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='provider'
							className='basic-multi-select'
							defaultValue={ bindSoftwareProviderData }
                        	value={ JSON.parse( provider ) }
                        	onChange={ handleProviderChange }
                        	options={ bindSoftwareProviderData }
							isMulti= { false }
                        />
						)}
						<ToggleControl
							label={ __(
								'Enable filter by game category only',
								'wpvcb-blocks'
							) }
							checked={ enable_selected_game_cats }
							onChange={ ( value ) =>
								setAttributes( { enable_selected_game_cats: value } )
							}
						/>
						{ enable_selected_game_cats && (
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='term__in'
							className='basic-multi-select'
							defaultValue={ bindGameCatData }
                        	value={ JSON.parse( term__in ) }
                        	onChange={ handleCategoryChange }
                        	options={ bindGameCatData }
							isMulti='true'
                        />
						)}
						<ToggleControl
							label={ __(
								'Disable game reviews',
								'wpvcb-blocks'
							) }
							checked={ disable_review }
							onChange={ ( value ) =>
								setAttributes( { disable_review: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Enable show all games link',
								'wpvcb-blocks'
							) }
							checked={ enable_show_all_games_link }
							onChange={ ( value ) =>
								setAttributes( { enable_show_all_games_link: value } )
							}
						/>
						{ enable_show_all_games_link && (
						<TextControl
							label={ __( 'Link', 'wpvcb-blocks' ) }
							value={ show_all_games_link }
							onChange={ ( value ) => {
								setAttributes( { show_all_games_link: value } );
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
