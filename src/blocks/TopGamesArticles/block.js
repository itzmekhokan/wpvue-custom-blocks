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

registerBlockType( 'wpvcb/top-games-articles', { 
	title: __( 'Top Articles', 'wpvcb-blocks' ), 
	icon: 'admin-page', 
	category: 'wpvcb', 
	attributes: {
		block_title: {
			type: 'string',
			default: ''
		},
		style: {
			type: 'string',
			default: 'list'
		},
		enable_review_post_in: {
			type: 'boolean',
			default: false
		},
		post__in: {
			type: 'string',
			default: null
		},
		disable_author: {
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
			block_title,
			enable_review_post_in,
			post__in,
			style,
			disable_author,
		} = attributes;

		let bindPostsData = wpvcb_blocks_scripts_data_params.data.articles;
		if( enable_review_post_in ) {
			bindPostsData = wpvcb_blocks_scripts_data_params.data.articles_plus_review;
		}
		
		const handleSelectChange = ( post__in ) => setAttributes( { post__in: JSON.stringify( post__in ) } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-page'
					label={ __( 'Top Articles', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-top-games-articles"
				>
					<div className="wpvcb-block__selection wpvcb-block-top-games-article__selection">
						<TextControl
							placeholder={ __( 'Add some title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Enable Review posts also in article chooser',
								'wpvcb-blocks'
							) }
							checked={ enable_review_post_in }
							onChange={ ( value ) =>
								setAttributes( { enable_review_post_in: value } )
							}
						/>
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
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'List', value: 'list' },
								{ label: 'Card', value: 'card' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ style == 'card' && (
						<ToggleControl
							label={ __(
								'Disable article author',
								'wpvcb-blocks'
							) }
							checked={ disable_author }
							onChange={ ( value ) =>
								setAttributes( { disable_author: value } )
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
		return 'null';
	},
} );
