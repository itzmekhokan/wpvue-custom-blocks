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
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfiguration } from '../../utils.js';
const { getCurrentPostId } = wp.data.select("core/editor");
import {
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
registerBlockType( 'wpvcb/bonus-information-block', { 
	title: __( 'Review - Bonus Information', 'wpvcb-blocks' ), 
	icon: 'tide', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		title: {
			type: 'string',
			default: ''
		},
		make_first_deposit_to_claim: {
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
			post_id,
			title,
			make_first_deposit_to_claim,
		} = attributes;
		setAttributes( { post_id: getCurrentPostId() } );
		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Review - Bonus Information', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-bonus-information-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-bonus-information-block__selection">
			
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Bonus Information', 'wpvcb-blocks' ) }
							value={ title }
							onChange={ ( value ) => {
								setAttributes( { title: value } );
								setAttributes( { post_id: getCurrentPostId() } );
							} }
						/>
						<TextControl
							label={ __( 'Make first deposit to claim', 'wpvcb-blocks' ) }
							help={ __( 'Add you make first deposit to claim text. You can also use "%bonus" tag.', 'wpvcb-blocks' ) }
							value={ make_first_deposit_to_claim }
							onChange={ ( value ) => {
								setAttributes( { make_first_deposit_to_claim: value } );
								setAttributes( { post_id: getCurrentPostId() } );
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
