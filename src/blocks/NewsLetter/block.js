/**
 * BLOCK: NewsLetter
 *
 */

//  Import CSS.
import './editor.scss';
// import './style.scss';

/**
 * External dependencies
 */
const { __ } = wp.i18n; 
const { registerBlockType } = wp.blocks; 
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
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
registerBlockType( 'wpvcb/newsletter', { 
	title: __( 'NewsLetter', 'wpvcb-blocks' ), 
	icon: 'email-alt', 
	category: 'wpvcb', 
	attributes: {
		bg_pattern: {
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
			bg_pattern,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'email-alt'
					label={ __( 'NewsLetter', 'wpvcb-blocks' ) }
					instructions={ __(
						'Add Newsletter background pattern image.',
						'wpvcb-blocks'
					) }
					className="wpvcb-block wpvcb-block-newsletter"
				>
					<div className="wpvcb-block__selection wpvcb-block-newsletter__selection">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ ( media ) => {
									setAttributes( { bg_pattern: media.url } );
								} }
								allowedTypes={ ['image'] }
								value={ bg_pattern }
								render={ ( { open } ) => (
									<div class="wpvcb-media-preview-wrap">
										<img 
										class="media-upload-img" 
										onClick={ open } 
										src={ bg_pattern ? bg_pattern : wpvcb_blocks_scripts_data_params.data.placeholder_img } 
										title={ !bg_pattern ? __( 'Add background pattern', 'wpvcb-blocks' ) : __( 'Change background pattern', 'wpvcb-blocks' )  }
										/>
										{ bg_pattern && (
										<Button 
											onClick={ () => {
											setAttributes( { bg_pattern: '' } );
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
