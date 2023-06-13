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

registerBlockType( 'wpvcb/testimonials', { 
	title: __( 'Testimonials', 'wpvcb-blocks' ), 
	icon: 'admin-page', 
	category: 'wpvcb', 
	attributes: {
		block_title: {
			type: 'string',
			default: ''
		},
		block_subtitle: {
			type: 'string',
			default: ''
		},
		testimonial_id: {
			type: 'string',
			default: ''
		},
		quantity: {
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
			block_subtitle,
			testimonial_id,
			quantity,
		} = attributes;

		// const bindTestimonialsOptionData = [{ value: '', label: 'Select one...' }];
		// let faqdata = wpvcb_blocks_scripts_data_params.data.pu_faq_headers;
		// faqdata.map( function( data ){
		// 	bindTestimonialsOptionData.push( { value: data.id, label: data.faq_name } );
		// });
		const bindTestimonialsOptionData = wpvcb_blocks_scripts_data_params.data.testimonals;

		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-page'
					label={ __( 'Testimonials', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-testimonials"
				>
					<div className="wpvcb-block__selection wpvcb-block-testimonials__selection">
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add Title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
							} }
						/>
						<TextControl
							label={ __( 'Sub Title', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add Sub Title', 'wpvcb-blocks' ) }
							value={ block_subtitle }
							onChange={ ( value ) => {
								setAttributes( { block_subtitle: value } );
							} }
						/>
						<SelectControl
							help={ __( 'Select a Testimonials', 'wpvcb-blocks' ) }
							label={ __( 'Select a Testimonials', 'wpvcb-blocks' ) }
							value={ testimonial_id } 
							onChange={ ( value ) => {
								setAttributes( { testimonial_id: value } );
							} }
							options={ bindTestimonialsOptionData }
						/>
						<TextControl
							label={ __( 'Number of testimonials', 'wpvcb-blocks' ) }
							type='number'
							min='1'
							value={ quantity }
							onChange={ ( value ) => {
								setAttributes( { quantity: value } );
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
