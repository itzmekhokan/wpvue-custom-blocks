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
import { RichText } from '@wordpress/block-editor';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { editorConfiguration } from '../../utils.js';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
const { getCurrentPostId } = wp.data.select("core/editor");
import {
	Button,
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

registerBlockType( 'wpvcb/home-card-testimonials', { 
	title: __( 'Home Card testimonials', 'wpvcb-blocks' ), 
	icon: 'format-quote', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		style: {
			type: 'string',
			default: 'testimonials'
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
			post_id,
			style,
			info = [],
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

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
                            <p className="section-heading">Card {infoItem.index+1}</p>
							<TextControl
                                 placeholder={ __( 'Add Card Title', 'wpvcb-blocks' ) }
                                 label={ __( 'Card Title', 'wpvcb-blocks' ) }
                                 value={ infoItem.title }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         title: value
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                             />
							<MediaUploadCheck>
                                <MediaUpload
									onSelect={ ( media ) => {
										const newObject = Object.assign({}, infoItem, {
											image: media.url
										});
										setAttributes({
											info: [...info.filter(
												item => item.index != infoItem.index
											), newObject]
										});
									} }
									allowedTypes={ ['image'] }
									value={ infoItem.image }
									render={ ( { open } ) => (
										<div class="wpvcb-media-preview-wrap">
											<img 
											class="media-upload-img" 
											onClick={ open } 
											src={ infoItem.image ? infoItem.image : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
											title={ !infoItem.image ? __( 'Add image', 'wpvcb-blocks' ) : __( 'Change image', 'wpvcb-blocks' )  }
											/>
											{ infoItem.image && (
											<Button 
												onClick={ () => {
												const newObject = Object.assign({}, infoItem, {
													image: ''
												});
												setAttributes({
													info: [...info.filter(
														item => item.index != infoItem.index
													), newObject]
												});
												} } 
												className="remove-img"
												isLink isDestructive>
												{__('Remove', 'wpvcb-blocks')}
											</Button>
											) }
										</div>
                                    ) }
                                />
                            </MediaUploadCheck>
							<CKEditor
                                 config={ editorConfiguration }
                                 editor={ ClassicEditor }
                                 data={ infoItem.summary }
                                 onChange={ ( event, editor ) => {
                                     const newObject = Object.assign({}, infoItem, {
										summary: editor.getData()
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                     //setAttributes( { content: editor.getData() } );
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
					icon= 'format-quote'
					label={ __( 'Home Card testimonials', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block wpvcb-dyn-block wpvcb-block-home-card-testimonials"
					instructions={ __( 'For style - testimonials - Make sure to add contents first in ACF Card Testimonial for home page to render them using block.', 'wpvcb-blocks' ) }
				>
					<div className={className}>
						<SelectControl
							label={ __( 'Style', 'wpvcb-blocks' ) }
							value={ style }
							options={ [
								{ label: 'Testimonials', value: 'testimonials' },
								{ label: 'Cards', value: 'cards' },
							] }
							onChange={ ( value ) =>
								setAttributes( { style: value } )
							}
						/>
						{ style == 'cards' && (
						<div className="info-wrap">{infoList(info)}</div>
						)}
						{ style == 'cards' && (
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									title: '',
									image: '',
									summary: '',
								}]
							});
						}}>Add Cards</Button>
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
