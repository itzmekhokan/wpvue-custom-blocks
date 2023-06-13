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
import {
	PanelBody,
	Placeholder,
	RangeControl,
	TextControl,
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
registerBlockType( 'wpvcb/review-details', { 
	title: __( 'Review Details', 'wpvcb-blocks' ), 
	icon: 'analytics', 
	category: 'wpvcb', 
	attributes: {
		group_id: {
			type: 'string',
			default: ''
		},
		partner_id: {
			type: 'string',
			default: ''
		},
		is_exclusive: {
			type: 'boolean',
			default: false,
		},
		is_approved: {
			type: 'boolean',
			default: false,
		},
		approved_by_expert: {
			type: 'string',
			default: '',
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
			group_id,
			partner_id,
			is_exclusive,
			is_approved,
			approved_by_expert,
		} = attributes;

		return (
			<Fragment>
				<Placeholder 
					icon= 'analytics'
					label={ __( 'Review Details', 'wpvcb-blocks' ) }
					className="wpvcb-block wpvcb-block-review-details"
				>
					<div className="wpvcb-block__selection wpvcb-block-review-details__selection">
						<TextControl
							label={ __( 'Add Group ID', 'wpvcb-blocks' ) }
							value={ group_id }
							onChange={ ( value ) => {
								setAttributes( { group_id: value } );
							} }
						/>
						<TextControl
							label={ __( 'Add Partner ID', 'wpvcb-blocks' ) }
							value={ partner_id }
							onChange={ ( value ) => {
								setAttributes( { partner_id: value } );
							} }
						/>
						<ToggleControl
							label={ __(
								'Is Exclusive',
								'wpvcb-blocks'
							) }
							checked={ is_exclusive }
							onChange={ ( value ) =>
								setAttributes( { is_exclusive: value } )
							}
						/>
						<ToggleControl
							label={ __(
								'Is Approved by Expert',
								'wpvcb-blocks'
							) }
							checked={ is_approved }
							onChange={ ( value ) =>
								setAttributes( { is_approved: value } )
							}
						/>
						{ is_approved && (
						<TextControl
							label={ __( 'Approved by Expert label', 'wpvcb-blocks' ) }
							placeholder={ __( 'Approved by our experts', 'wpvcb-blocks' ) }
							value={ approved_by_expert }
							onChange={ ( value ) => {
								setAttributes( { approved_by_expert: value } );
							} }
						/>
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
