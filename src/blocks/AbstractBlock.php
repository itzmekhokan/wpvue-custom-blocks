<?php
/**
 * Abstract block class.
 *
 * @package WPVue/Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * AbstractBlock class.
 */
abstract class AbstractBlock {

	/**
	 * Block namespace.
	 *
	 * @var string
	 */
	protected $namespace = 'wpvcb';

	/**
	 * Attributes.
	 *
	 * @var array
	 */
	protected $attributes = array();

	/**
	 * InnerBlocks content.
	 *
	 * @var string
	 */
	protected $content = '';

	/**
	 * Query args.
	 *
	 * @var array
	 */
	protected $query_args = array();

	/**
	 * Block namespace.
	 *
	 * @var string
	 */
	protected $block_name = '';

	/**
	 * Get namespace.
	 */
	public function get_namespace() {
		return $this->namespace;
	}

	/**
	 * Get block name.
	 */
	public function get_block_name() {
		return $this->block_name;
	}

	/**
	 * Registers the block type with WordPress.
	 */
	public function register_block_type() {
		register_block_type(
			$this->namespace . '/' . $this->block_name,
			array(
				'render_callback' => array( $this, 'render' ),
				'editor_script'   => 'wpvcb_blocks-scripts-js',
				'editor_style'    => 'wpvcb_blocks-editor-css',
				'style'           => 'wpvcb_blocks-style-css',
				'attributes'      => $this->get_attributes(),
			)
		);
	}

	abstract public function render_filtered_content( $content, $block );

	/**
	 * Include and render a dynamic block.
	 *
	 * @param array  $attributes Block attributes. Default empty array.
	 * @param string $content    Block content. Default empty string.
	 * @return string Rendered block type output.
	 */
	abstract public function render( $attributes = array(), $content = '' );

	/**
	 * Get block attributes.
	 *
	 * @return array
	 */
	protected function get_attributes() {
		return array();
	}

	/**
	 * Get the schema for the alignment property.
	 *
	 * @return array Property definition for align.
	 */
	protected function get_schema_align() {
		return array(
			'type' => 'string',
			'enum' => array( 'left', 'center', 'right', 'wide', 'full' ),
		);
	}

	/**
	 * Get the schema for a list of IDs.
	 *
	 * @return array Property definition for a list of numeric ids.
	 */
	protected function get_schema_list_ids() {
		return array(
			'type'    => 'array',
			'items'   => array(
				'type' => 'number',
			),
			'default' => array(),
		);
	}

	/**
	 * Get the schema for a boolean value.
	 *
	 * @param  string $default  The default value.
	 * @return array Property definition.
	 */
	protected function get_schema_boolean( $default = true ) {
		return array(
			'type'    => 'boolean',
			'default' => $default,
		);
	}

	/**
	 * Get the schema for a numeric value.
	 *
	 * @param  string $default  The default value.
	 * @return array Property definition.
	 */
	protected function get_schema_number( $default = 0 ) {
		return array(
			'type'    => 'number',
			'default' => $default,
		);
	}

	/**
	 * Get the schema for a string value.
	 *
	 * @param  string $default  The default value.
	 * @return array Property definition.
	 */
	protected function get_schema_string( $default = '' ) {
		return array(
			'type'    => 'string',
			'default' => $default,
		);
	}

	/**
	 * Get the schema for a array value.
	 *
	 * @param  string $default  The default value.
	 * @return array Property definition.
	 */
	protected function get_schema_array( $default = '' ) {
		return array(
			'type'    => 'array',
			'default' => array($default),
		);
	}
}
