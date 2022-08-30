import isString from 'lodash.isstring';

const hocSymbol = Symbol.for( 'hoc property' );
const storeSymbol = Symbol.for( 'store property' );

class HocMemo {

	/**
	 * `options.bypass` param when `true` creates new uncached HOC. Useful for HOCs undergoing further alterations.
	 * Default value is `false`
	 *
	 * @constructor
	 * @param {ReactHocMemo.Decorator<C, OPTS, W>} hoc
	 * @template [C=ElementType] Incoming component
	 * @template {Object} [OPTS={}]
	 * @template [W=ElementType] HOC
	 */
	constructor( hoc ) {
		this[ hocSymbol ] = hoc;
		this[ storeSymbol ] = {};
	}

	/**
	 * `options.bypass` param when `true` creates new uncached HOC. Useful for HOCs undergoing further alterations.
	 * Default value is `false`
	 *
	 * @type {ReactHocMemo.Decorator<C, OPTS, W>}
	 * @template [C=ElementType] Incoming component
	 * @template {Object} [OPTS={}]
	 * @template [W=ElementType] HOC
	 * @throws {HocMemo.DisplayNameError}
	 */
	use( Component, options = {} ) {
		const _options = { bypass: false, ...options };
		if( _options.bypass ) {
			return this[ hocSymbol ]( Component, _options );
		}
		const { displayName = null } = Component;
		if( !isString( displayName ) || !displayName.length ) {
			throw new HocMemo.DisplayNameError();
		}
		const key = Symbol.for( JSON.stringify([ displayName, _options ]) );
		if( key in this[ storeSymbol ] ) {
			return this[ storeSymbol ][ key ];
		}
		const Decorated = this[ hocSymbol ]( Component, _options );
		this[ storeSymbol ][ key ] = Decorated;
		return Decorated;
	}
};

HocMemo.DisplayNameError = class extends Error {
	constructor() {
		super( 'React component missing the proper `displayName` static property.' );
	}
};

export default HocMemo;
