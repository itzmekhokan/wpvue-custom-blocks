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
const { getCurrentPostId } = wp.data.select("core/editor");
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

registerBlockType( 'wpvcb/author-block', { 
	title: __( 'Author Block', 'wpvcb-blocks' ), 
	icon: 'businessperson', 
	category: 'wpvcb', 
	attributes: {
		post_id: {
			type: 'number',
			default: 0
		},
		style: {
			type: 'string',
			default: 'big'
		},
		authors: {
			type: 'string',
			default: null
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
			style,
			authors,
		} = attributes;

		setAttributes( { post_id: getCurrentPostId() } );

		const bindUsersData = wpvcb_blocks_scripts_data_params.data.users;
		
		const handleSelectChange = ( authors ) => setAttributes( { authors: JSON.stringify( authors ) } );
		
		return (
			<Fragment>
				<Placeholder 
					icon= 'businessperson'
					label={ __( 'Author Block', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-author-block"
				>
					<div className="wpvcb-block__selection wpvcb-block-author-block__selection">
						<SelectControl
                             label={ __( 'Style', 'wpvcb-blocks' ) }
                             value={ style }
                             options={ [
                                 { label: 'Big version', value: 'big' },
                                 { label: 'Small version', value: 'small' },
                             ] }
                             onChange={ ( value ) =>
                                 setAttributes( { style: value } )
                             }
                         />
						<Select
							styles={{ menu: base => ({ 
								backgroundColor: 'white',
								zIndex: 999999 
							}) }}
							name='authors'
							className='basic-multi-select'
							defaultValue={ bindUsersData }
                        	value={ JSON.parse( authors ) }
                        	onChange={ handleSelectChange }
                        	options={ bindUsersData }
							isMulti='true'
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
