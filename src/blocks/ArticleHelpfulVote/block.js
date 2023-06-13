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
	PanelBody,
	Placeholder,
	TextareaControl,
	TextControl,
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
registerBlockType( 'wpvcb/article-helpful-vote', { 
	title: __( 'Article Helpful Vote', 'wpvcb-blocks' ), 
	icon: 'thumbs-up', 
	category: 'wpvcb', 
	attributes: {
		title: {
			type: 'string',
			default: ''
		},
		yes: {
			type: 'string',
			default: ''
		},
		no: {
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
			title,
			yes,
			no,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Article Helpful Vote Data', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-article-helpful-vote"
				>
					<div className="wpvcb-block__selection wpvcb-block-article-helpful-vote__selection">
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							value={ title }
							onChange={ ( value ) => {
								setAttributes( { title: value } );
							} }
						/>
						<TextControl
							label={ __( '"Yes" button label', 'wpvcb-blocks' ) }
							value={ yes }
							onChange={ ( value ) => {
								setAttributes( { yes: value } );
							} }
						/>
						<TextControl
							label={ __( '"No" button label', 'wpvcb-blocks' ) }
							value={ no }
							onChange={ ( value ) => {
								setAttributes( { no: value } );
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
