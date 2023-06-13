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
import { Fragment } from '@wordpress/element';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
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
registerBlockType( 'wpvcb/pu-reference', { 
	title: __( 'PU Reference Block', 'wpvcb-blocks' ), 
	icon: 'editor-help', 
	category: 'wpvcb', 
	attributes: {
		ref_id: {
			type: 'string',
			default: ''
		},
		title: {
			type: 'string',
			default: ''
		},
		title_tag: {
			type: 'string',
			default: 'h2'
		},
		style: {
			type: 'string',
			default: 'ordered'
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
			ref_id,
			title,
			title_tag,
			style,
		} = attributes;

		//const bindRefOptionData = wpvcb_blocks_scripts_data_params.data.pu_references_dd;
		const bindRefOptionData = [{ value: '', label: 'Select one...' }];
		let refdata = wpvcb_blocks_scripts_data_params.data.pu_references_dd;
		refdata.map( function( data ){
			bindRefOptionData.push( { value: data.value, label: data.label } );
		});
		

		return (
			<Fragment>
				<Placeholder 
					icon= 'editor-help'
					label={ __( 'PU Reference Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-pu-reference"
				>
					<div className="wpvcb-block__selection wpvcb-block-pu-reference__selection">
						<TextControl
							label={ __( 'Title', 'wpvcb-blocks' ) }
							help={ __( 'Leave it blank to use default Page Utils reference name.', 'wpvcb-blocks' ) }
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
							help={ __( 'Select a reference added by Page Utils.', 'wpvcb-blocks' ) }
							label={ __( 'Select a Reference', 'wpvcb-blocks' ) }
							value={ ref_id } 
							onChange={ ( value ) => {
								setAttributes( { ref_id: value } );
							} }
							options={ bindRefOptionData }
						/>
					
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							help={ __( 'Leave it to use default Page Utils reference style.', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: '-- Select --', value: '' },
								{ label: 'Ordered', value: 'ordered' },
								{ label: 'Unordered', value: 'unordered' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
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
