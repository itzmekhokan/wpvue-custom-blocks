/**
 * BLOCK: BestPaymentMethods
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

registerBlockType( 'wpvcb/game-guide-categories', { 
	title: __( 'Game Guide Categories', 'wpvcb-blocks' ), 
	icon: 'tag', 
	category: 'wpvcb', 
	attributes: {
		game_type: {
			type: 'string',
			default: ''
		},
		style: {
			type: 'string',
			default: 'list'
		},
		enable_search: {
			type: 'boolean',
			default: true
		},
		block_title: {
			type: 'string',
			default: ''
		},
		no_of_posts: {
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
			game_type,
			style,
			enable_search,
			block_title,
			no_of_posts,
		} = attributes;

		
		return (
			<Fragment>
				<Placeholder 
					icon= 'tag'
					label={ __( 'Game Guide Categories', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-game-guide-categories"
				>
					<div className="wpvcb-block__selection wpvcb-block-game-guide-categories__selection" >
						<SelectControl
							label={ __( 'Game Type', 'wpvcb-blocks' ) }
							value={ game_type }
							options={ [
								{ label: 'Both Free & Paid Games', value: '' },
								{ label: 'Free Games', value: 'free' },
								{ label: 'Paid Games', value: 'paid' },
							] }
							onChange={ ( value ) =>
								setAttributes( { game_type: value } )
							}
						/>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Normal list', value: 'list' },
								{ label: 'Vertical Style', value: 'vertical' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ style == 'list' && (
						<ToggleControl
							label={ __(
								'Enable Search',
								'wpvcb-blocks'
							) }
							checked={ enable_search }
							onChange={ ( value ) =>
								setAttributes( { enable_search: value } )
							}
						/>
						)}
						{ style == 'list' && (
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add a title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
							} }
						/>
						)}
						<TextControl
							label={ __( 'Number of terms', 'wpvcb-blocks' ) }
							placeholder={ style === "list" ? __( 'Default show all terms', 'wpvcb-blocks' ) : __( 'Default show all vertical style terms', 'wpvcb-blocks' ) }
							value={ no_of_posts }
							onChange={ ( value ) => {
								setAttributes( { no_of_posts: value } );
							} }
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
