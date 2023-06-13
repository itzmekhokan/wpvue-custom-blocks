/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
// import './editor.scss';
// import './style.scss';
//import { ChromePicker } from "react-color";

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
import { InspectorControls } from '@wordpress/editor';
import { Fragment } from '@wordpress/element';
import { RichText } from '@wordpress/block-editor';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { bulletConfiguration } from '../../utils.js';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	Button,
	ColorPicker,
	PanelBody,
	Placeholder,
	RangeControl,
	RadioControl,
	TextControl,
	TextareaControl,
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

registerBlockType( 'wpvcb/page-menu-blocks-scroll', { 
	title: __( 'Page Menu Blocks Scroll', 'wpvcb-blocks' ), 
	icon: 'admin-site-alt3', 
	category: 'wpvcb',
	keywords: [
		__( 'Page Menu', 'wpvcb-blocks' ),
		__( 'Blocks Scroll', 'wpvcb-blocks' ),
		__( 'Menu', 'wpvcb-blocks' ),
	], 
	attributes: {
		info: {
			type: 'array',
			selector: '.info-wrap'
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
		const { attributes, setAttributes, className } = props;
		const {
			info = [],
		} = attributes;


		const infoList = (value) => {
            return(
                value.sort((a, b) => a.index - b.index).map(infoItem => {
                    return(
                        <div className="info-item">
                            <Button
                                className="remove-item cross-button"
                                onClick={ () => {
                                    const newInfo = info.filter(item => item.index != infoItem.index).map(i => {
                                        if(i.index > infoItem.index){
                                            i.index -= 1;
                                        }
                                        return i;
                                    } );
                                    setAttributes({ info: newInfo });
                                } }
                            >&times;</Button>
                            <p className="section-heading">Menu {infoItem.index+1}</p>
							<TextControl
								placeholder={ __( 'Add menu name here', 'wpvcb-blocks' ) }
								label={ __( 'Menu Tilte', 'wpvcb-blocks' ) }
								value={ infoItem.menu_name }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										menu_name: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							<TextControl
								placeholder={ __( 'Add unique menu content block ID for scroll to', 'wpvcb-blocks' ) }
								label={ __( 'Menu Block ID', 'wpvcb-blocks' ) }
								value={ infoItem.menu_block_id }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										menu_block_id: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							
                        </div>
                    )
                })
            )
        }

		return (
			<Fragment>
				<Placeholder 
					icon= 'admin-site-alt3'
					label={ __( 'Page Menu Blocks Scroll', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-page-menu-blocks-scroll">
					<div className={className}>
						
						<div className="info-wrap">{infoList(info)}</div>
					
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									menu_name: '',
									menu_block_id: '',
								}]
							});
						}}>Add Page Menu</Button>
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
		const info = props.attributes.info;
		if (info != '' && info != null) {
			const displayInfoList = (value) => {
				return(
					value.map( infoItem => {
						return(
							<div className="info-item">
								<RichText.Content
									tagName="h4"
									className="info-item-title"
									value={infoItem.title}
									style={{ height: 58 }}
								/>
							</div>
						)
					} )
				)
			}

			return(
				<div className={props.className}>
					<div className="info-wrap">{ displayInfoList(info) }</div>
				</div>
			);
		} else {
			null
		}
	},
} );
