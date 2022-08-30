import isString from 'lodash.isstring';

const hocFuncSymbol = Symbol.for( 'hoc function property' );
const storeSymbol = Symbol.for( 'store property' );

class HocMemo {

	/**
	 * `options.bypass` param when `true` creates new uncached HOC. Useful for HOCs undergoing further alterations.
	 * Default value is `false`
	 *
	 * @constructor
	 * @param {Decorator} hocFunc
	 * @template [C = ElementType]
	 * @template [W = ElementType]
	 */
	constructor( hocFunc ) {
		this[ hocFuncSymbol ] = hocFunc;
		this[ storeSymbol ] = {};
	}

	/**
	 * `options.bypass` param when `true` creates new uncached HOC. Useful for HOCs undergoing further alterations.
	 * Default value is `false`
	 *
	 * @type {Decorator}
	 * @template [C = ElementType]
	 * @template [W = ElementType]
	 * @throws {HocMemo.DisplayNameError}
	 */
	use( Component, options = {} ) {
		const _options = { bypass: false, ...options };
		if( _options.bypass ) {
			return this[ hocFuncSymbol ]( Component, _options );
		}
		const { displayName = null } = Component;
		if( !isString( displayName ) || !displayName.length ) {
			throw new HocMemo.DisplayNameError();
		}
		const key = Symbol.for( JSON.stringify([ displayName, _options ]) );
		if( key in this[ storeSymbol ] ) {
			return this[ storeSymbol ][ key ];
		}
		const Decorated = this[ hocFuncSymbol ]( Component, _options );
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

/**
 * @typedef {(Component: C, options?: Options) => W} Decorator
 * @template [C = ElementType]
 * @template [W = ElementType]
 */

/**
 * @typedef {{
 * 	bypass?: boolean = false,
 * 	[x:string]: *
 * }} Options
 */

/**
 * @typedef {import("react").ElementType<P>} ElementType
 * @template [P=any]
 */
