/**
 * BLOCK: BestPaymentMethods
 *
 */

//  Import CSS.
// import './editor.scss';
// import './style.scss';
import { ChromePicker } from "react-color";

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
import { editorConfiguration } from '../../utils.js';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	Placeholder,
	RangeControl,
	RadioControl,
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

registerBlockType( 'wpvcb/poker-hands', { 
	title: __( 'Poker Hands', 'wpvcb-blocks' ), 
	icon: 'tablet', 
	category: 'wpvcb',
	keywords: [
		__( 'Poker Hands', 'wpvcb-blocks' ),
		__( 'Poker', 'wpvcb-blocks' ),
	], 
	attributes: {
		block_title: {
			type: 'string',
			default: ''
		},
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
			block_title,
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
                            <p className="section-heading">Item {infoItem.index+1}</p>
							<label>{ __( 'Add Content', 'wpvcb-blocks' ) }</label>
							<CKEditor
								config={ editorConfiguration }
								editor={ ClassicEditor }
								data={ infoItem.content }
								onChange={ ( event, editor ) => {
									const newObject = Object.assign({}, infoItem, {
                                        content: editor.getData()
                                    });
                                    setAttributes({
                                        info: [...info.filter(
                                            item => item.index != infoItem.index
                                        ), newObject]
                                    });
									//setAttributes( { before_content: editor.getData() } );
								} }
							/>
							<table>
								<tr><td>
							<label>{ __( 'Add First Card', 'wpvcb-blocks' ) }</label>
							</td><td>
							<SelectControl
								label={ __( 'Card Type', 'wpvcb-blocks' ) }
								value={ infoItem.first_card_type }
								options={ [
									{ label: 'Clubs', value: 'clubs' },
									{ label: 'Diamonds', value: 'diamonds' },
									{ label: 'Hearts', value: 'hearts' },
									{ label: 'Spades', value: 'spades' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										first_card_type: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { style: value } )
								} }
							/>
							</td><td>
							<SelectControl
								label={ __( 'Card No', 'wpvcb-blocks' ) }
								value={ infoItem.first_card_no }
								options={ [
									{ label: 'A', value: 'A' },
									{ label: '2', value: '2' },
									{ label: '3', value: '3' },
									{ label: '4', value: '4' },
									{ label: '5', value: '5' },
									{ label: '6', value: '6' },
									{ label: '7', value: '7' },
									{ label: '8', value: '8' },
									{ label: '9', value: '9' },
									{ label: '10', value: '10' },
									{ label: 'J', value: 'J' },
									{ label: 'K', value: 'K' },
									{ label: 'Q', value: 'Q' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										first_card_no: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { style: value } )
								} }
							/>
							</td></tr>
							<tr><td>
							<label>{ __( 'Add Second Card', 'wpvcb-blocks' ) }</label>
							</td><td>
							<SelectControl
								label={ __( 'Card Type', 'wpvcb-blocks' ) }
								value={ infoItem.second_card_type }
								options={ [
									{ label: 'Clubs', value: 'clubs' },
									{ label: 'Diamonds', value: 'diamonds' },
									{ label: 'Hearts', value: 'hearts' },
									{ label: 'Spades', value: 'spades' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										second_card_type: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { style: value } )
								} }
							/>
							</td><td>
							<SelectControl
								label={ __( 'Card No', 'wpvcb-blocks' ) }
								value={ infoItem.second_card_no }
								options={ [
									{ label: 'A', value: 'A' },
									{ label: '2', value: '2' },
									{ label: '3', value: '3' },
									{ label: '4', value: '4' },
									{ label: '5', value: '5' },
									{ label: '6', value: '6' },
									{ label: '7', value: '7' },
									{ label: '8', value: '8' },
									{ label: '9', value: '9' },
									{ label: '10', value: '10' },
									{ label: 'J', value: 'J' },
									{ label: 'K', value: 'K' },
									{ label: 'Q', value: 'Q' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										second_card_no: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { style: value } )
								} }
							/>
							</td></tr>
							
							</table>
                        </div>
                    )
                })
            )
        }

		return (
			<Fragment>
				<Placeholder 
					icon= 'tablet'
					label={ __( 'Poker Hands', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-poker-hands">
					<div className={className}>
					
						<div className="info-wrap">{infoList(info)}</div>
					
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									content: "",
									first_card_type:'clubs',
									first_card_no:'A',
									second_card_type:'clubs',
									second_card_no:'A',
								}]
							});
						}}>Add Item</Button>
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
