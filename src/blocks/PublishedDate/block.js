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
const { getCurrentPostId } = wp.data.select("core/editor");

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

registerBlockType( 'wpvcb/published-date', { 
	title: __( 'Published Date', 'wpvcb-blocks' ), 
	icon: 'media-document', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		post_date_type: {
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
			post_date_type,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'media-document'
					label={ __( 'Published Date', 'wpvcb-blocks' ) }
					instructions={ __( 'This block display current post date and content read time information.', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-published-date"
				>
					<div className="wpvcb-block__selection wpvcb-block-published-date__selection">
						<SelectControl
							label={ __( 'Post date type', 'wpvcb-blocks' ) }
							value={ post_date_type }
							options={ [
								{ label: 'Published', value: 'published' },
								{ label: 'Modified', value: 'modified' },
							] }
							onChange={ ( value ) => {
								setAttributes( { post_date_type: value } )
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
		return '';
	},
} );
