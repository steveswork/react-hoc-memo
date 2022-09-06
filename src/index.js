import isString from 'lodash.isstring';

const hocFuncSymbol = Symbol.for( 'hoc function property' );
const storeSymbol = Symbol.for( 'store property' );

/**
 * @template [T=ElementType] - HOC function return type
 * @template [S=ElementType] - Component type supplied to HOC function
 */
class HocMemo {

	/**
	 * @constructor
	 * @param {Decorator<S,T>} hocFunc
	 */
	constructor( hocFunc ) {
		this[ hocFuncSymbol ] = hocFunc;
		/** @type {{[x:symbol]: T}} */
		this[ storeSymbol ] = {};
	}

	/**
	 * `options.bypass` param when `true` creates new uncached HOC.
	 * Useful for HOCs undergoing further alterations.
	 * Default value is `false`.
	 *
	 * @type {Decorator<C,T>}
	 * @template [C=S]
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
 * @typedef {(Component: C, options?: Options) => HOC} Decorator
 * @template [C=ElementType]
 * @template [HOC=ElementType]
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
