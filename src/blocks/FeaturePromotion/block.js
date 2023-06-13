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
import Select from 'react-select';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Fragment } from '@wordpress/element';
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
registerBlockType( 'wpvcb/feature-promotion', { 
	title: __( 'Review - Feature Promotion', 'wpvcb-blocks' ), 
	icon: 'tide', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		promotion: {
			type: 'number',
			default: 0
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
			promotion,
		} = attributes;
		setAttributes( { post_id: getCurrentPostId() } );
		const bindPromotionData = wpvcb_blocks_scripts_data_params.data.promotions;

		const handlePromotionChange = ( promotion ) => { 
			setAttributes( { promotion: JSON.stringify( promotion ) } );
			setAttributes( { post_id: getCurrentPostId() } );
		}

		return (
			<Fragment>
				<Placeholder 
					icon= 'tide'
					label={ __( 'Review - Feature Promotion', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-feature-promotion"
				>
					<div className="wpvcb-block__selection wpvcb-block-feature-promotion__selection">
						
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='promotion'
							className='basic-multi-select'
							defaultValue={ bindPromotionData }
                        	value={ JSON.parse( promotion ) }
                        	onChange={ handlePromotionChange }
                        	options={ bindPromotionData }
							isMulti= { false }
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
