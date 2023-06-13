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
 const { getCurrentPostId } = wp.data.select("core/editor");
 import {
     Button,
     ColorPicker,
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
 
 registerBlockType( 'wpvcb/bonus-cards', { 
     title: __( 'Bonus Cards', 'wpvcb-blocks' ), 
     icon: 'tablet', 
     category: 'wpvcb',
     keywords: [
         __( 'BonusCards', 'wpvcb-blocks' ),
         __( 'Bonus', 'wpvcb-blocks' ),
     ], 
     attributes: {
        post_id: {
			type: 'number',
			default: 0
		},
         style: {
             type: 'string',
             default: 'default'
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
                             <SelectControl
                                 label={ __( 'Title Tag', 'wpvcb-blocks' ) }
                                 value={ infoItem.title_tag }
                                 options={ [
                                     { label: 'h2', value: 'h2' },
                                     { label: 'h3', value: 'h3' },
                                     { label: 'h4', value: 'h4' },
                                     { label: 'h5', value: 'h5' },
                                     { label: 'h6', value: 'h6' },
                                     { label: 'span', value: 'span' },
                                 ] }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         title_tag: value
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                             />
                             <ToggleControl
                                 label={ __(
                                     'Highlight Title',
                                     'wpvcb-blocks'
                                 ) }
                                 checked={ infoItem.enable_highlight_title }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         enable_highlight_title: value
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                             />
                             {/* <label>{ __( 'Title Background Color', 'wpvcb-blocks' ) }</label>
                             <ColorPicker
                                 color={ infoItem.title_bg }
                                 onChangeComplete={ ( value ) => { 
                                     const newObject = Object.assign({}, infoItem, {
                                         title_bg: value.hex
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                                 disableAlpha
                             /> */}
                             { [ 'image_only', 'image_text' ].includes(style) == true && (
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
                                         //setAttributes( { bg_pattern: media.url } );
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
                                                     //setAttributes( { infoItem.front_first_card: '' } );
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
                             )}
                             { style != 'image_only' && (
                             <label>{ __( 'Card Content', 'wpvcb-blocks' ) }</label>
                             )}
                             { style != 'image_only' && (
                             <CKEditor
                                 config={ bulletConfiguration }
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
                                     //setAttributes( { content: editor.getData() } );
                                 } }
                             />
                             )}
                             <TextControl
                                 placeholder={ __( 'CTA Text', 'wpvcb-blocks' ) }
                                 label={ __( 'CTA Text', 'wpvcb-blocks' ) }
                                 value={ infoItem.cta_text }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         cta_text: value
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                             />
                             <TextControl
                                 placeholder={ __( 'CTA Link', 'wpvcb-blocks' ) }
                                 label={ __( 'CTA Link', 'wpvcb-blocks' ) }
                                 value={ infoItem.cta_link }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         cta_link: value
                                     });
                                     setAttributes({
                                         info: [...info.filter(
                                             item => item.index != infoItem.index
                                         ), newObject]
                                     });
                                 } }
                             />
                             <ToggleControl
                                 label={ __(
                                     'Keep CTA Text on hover',
                                     'wpvcb-blocks'
                                 ) }
                                 checked={ infoItem.keep_cta_text_hover }
                                 onChange={ ( value ) => {
                                     const newObject = Object.assign({}, infoItem, {
                                         keep_cta_text_hover: value
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
                     icon= 'tablet'
                     label={ __( 'Bonus Cards', 'wpvcb-blocks' ) }
                     className="wpvcb-block wpvcb-dyn-block wpvcb-block-bonus-cards">
                     <div className={className}>
                         <SelectControl
                             label={ __( 'Style', 'wpvcb-blocks' ) }
                             value={ style }
                             options={ [
                                 { label: 'Default', value: 'default' },
                                 { label: 'Only Image Box', value: 'image_only' },
                                 { label: 'Image with Text Box', value: 'image_text' },
                             ] }
                             onChange={ ( value ) =>
                                 setAttributes( { style: value } )
                             }
                         />
                         <div className="info-wrap">{infoList(info)}</div>
                     
                         <Button className="add-more-button" onClick={title => {
                             setAttributes({
                                 info: [...info, {
                                     index: info.length,
                                     title: "",
                                     title_tag: 'h3',
                                     title_bg:'#58fba4',
                                     enable_highlight_title: false,
                                     image: '',
                                     content: '',
                                     cta_text: '',
                                     cta_link: '',
                                     keep_cta_text_hover: false,
                                 }]
                             });
                         }}>Add Bonus Card</Button>
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
 