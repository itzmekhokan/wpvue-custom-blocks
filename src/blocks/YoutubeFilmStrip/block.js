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

registerBlockType( 'wpvcb/youtube-film-strip', { 
	title: __( 'Youtube / Vimeo Film Strip', 'wpvcb-blocks' ), 
	icon: 'format-video', 
	category: 'wpvcb',
	keywords: [
		__( 'Youtube Film', 'wpvcb-blocks' ),
		__( 'Vimeo', 'wpvcb-blocks' ),
		__( 'Strip', 'wpvcb-blocks' ),
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
                            <p className="section-heading">Video {infoItem.index+1}</p>
							<SelectControl
								label={ __( 'Video Type', 'wpvcb-blocks' ) }
								value={ infoItem.video_type }
								options={ [
									{ label: 'Youtube', value: 'youtube' },
									{ label: 'Vimeo', value: 'vimeo' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										video_type: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							{ infoItem.video_type == 'youtube' && (
							<TextControl
								placeholder={ __( 'Add Youtube video url', 'wpvcb-blocks' ) }
								label={ __( 'Youtube Url', 'wpvcb-blocks' ) }
								value={ infoItem.youtube_url }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										youtube_url: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							) }
							{ infoItem.video_type == 'vimeo' && (
							<TextControl
								placeholder={ __( 'Add Vimeo video url', 'wpvcb-blocks' ) }
								label={ __( 'Vimeo Url', 'wpvcb-blocks' ) }
								value={ infoItem.vimeo_url }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										vimeo_url: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							) }
							<TextControl
								placeholder={ __( 'Add Video Title', 'wpvcb-blocks' ) }
								label={ __( 'Video Title', 'wpvcb-blocks' ) }
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
							{ infoItem.video_type == 'youtube' && (
							<SelectControl
								label={ __( 'Video Thumbnail', 'wpvcb-blocks' ) }
								value={ infoItem.thumbnail_type }
								options={ [
									{ label: 'Max Resolution', value: 'maxresdefault.jpg' },
									{ label: 'Default', value: 'default.jpg' },
									{ label: 'HQ Default', value: 'hqdefault.jpg' },
									{ label: 'Medium Default', value: 'mqdefault.jpg' },
									{ label: 'Standard Default', value: 'sddefault.jpg' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										thumbnail_type: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							) }
							{ infoItem.video_type == 'vimeo' && (
							<SelectControl
								label={ __( 'Video Thumbnail', 'wpvcb-blocks' ) }
								value={ infoItem.vimeo_thumbnail_type }
								options={ [
									{ label: 'Thumbnail large', value: '640.jpg' },
									{ label: 'Thumbnail medium', value: '200.jpg' },
									{ label: 'Thumbnail small', value: '100.jpg' },
								] }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										vimeo_thumbnail_type: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
								} }
							/>
							) }
							<ToggleControl
								label={ __(
									'Disable allow fullscreen',
									'wpvcb-blocks'
								) }
								checked={ infoItem.disable_fullscreen }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										disable_fullscreen: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { disable_fullscreen: value } )
								} }
							/>
							{ infoItem.video_type == 'youtube' && (
							<ToggleControl
								label={ __(
									'Enable related',
									'wpvcb-blocks'
								) }
								checked={ infoItem.enable_related }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										enable_related: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { enable_related: value } )
								} }
							/>
							) }
							<ToggleControl
								label={ __(
									'Disable autoplay',
									'wpvcb-blocks'
								) }
								checked={ infoItem.disable_autoplay }
								onChange={ ( value ) => {
									const newObject = Object.assign({}, infoItem, {
										disable_autoplay: value
									});
									setAttributes({
										info: [...info.filter(
											item => item.index != infoItem.index
										), newObject]
									});
									//setAttributes( { disable_autoplay: value } )
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
					icon= 'format-video'
					label={ __( 'Youtube / Vimeo Film Strip', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-dyn-block wpvcb-block-youtube-film-strip">
					<div className={className}>
						{/* <TextControl
							label={ __( 'Heading', 'wpvcb-blocks' ) }
							placeholder={ __( 'Add US Map Gambling guide title', 'wpvcb-blocks' ) }
							value={ block_title }
							onChange={ ( value ) => {
								setAttributes( { block_title: value } );
							} }
						/> */}
					
						<div className="info-wrap">{infoList(info)}</div>
					
						<Button className="add-more-button" onClick={title => {
							setAttributes({
								info: [...info, {
									index: info.length,
									title:'',
									video_type: 'youtube',
									vimeo_url: '',
									youtube_url: '',
									vimeo_thumbnail_type: '640.jpg',
									thumbnail_type:'maxresdefault.jpg',
									disable_fullscreen:'',
									enable_related:'',
									disable_autoplay: '',
								}]
							});
						}}>Add Video</Button>
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
	},
} );
