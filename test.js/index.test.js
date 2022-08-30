import React from 'react';

import HocMemo from '../src';

let e, hocFunc, hocFuncMock, TestComponent;

describe( 'ReactHocMemo', () => {
	beforeAll(() => {
		e = React.createElement;
		hocFunc = ( Component, options ) => props => e(
			Component, { test: 1, ...props }, null
		);
		hocFuncMock = jest.fn( hocFunc );
		TestComponent = props => e( 'div', props, null );
		TestComponent.displayName = 'TestComponent';
	});
	afterEach(() => hocFuncMock.mockClear());
	afterAll(() => {
		e = hocFunc = TestComponent = null;
	});
	describe( 'DisplayName', () => {
		let hocMemo, NoDisplayName, testHoc;
		beforeAll(() => {
			hocMemo = new HocMemo( hocFuncMock );
			NoDisplayName = props => e( 'div', props, null );
			testHoc = hocMemo.use.bind( hocMemo );
		});
		afterAll(() => {
			hocMemo = NoDisplayName = testHoc = null;
		});
		test( 'is required for caching', () => {
			function tryCache() { testHoc( NoDisplayName ) }
			expect( tryCache ).toThrow( HocMemo.DisplayNameError );
		} );
		test( 'not required when bypassing the cache', () => {
			expect( testHoc( NoDisplayName, { bypass: true } ) ).not.toThrow();
		} );
	} );
	test( 'sets the `bypass` option to `false` by default', () => {
		new HocMemo( hocFuncMock ).use( TestComponent );
		expect( hocFuncMock.mock.calls[ 0 ][ 1 ] ).toEqual(
			expect.objectContaining({ bypass: false })
		);
	} );
	test( 'bypass caching by setting the `bypass` option to `true`', () => {
		const hocMemo = new HocMemo( hocFuncMock );
		const testHoc = hocMemo.use.bind( hocMemo );
		const Test = testHoc( TestComponent, { bypass: true });
		const Test1 = testHoc( TestComponent, { bypass: true });
		expect( Test === Test1 ).toBe( false );
	} );
	describe( 'Caching behavior', () => {
		let hocMemo, Test, Test1, testHoc;
		beforeAll(() => {
			hocMemo = new HocMemo( hocFuncMock );
			testHoc = hocMemo.use.bind( hocMemo );
			Test = [];
			Test1 = [];
			Test.push( testHoc( TestComponent ) );
			Test1.push( testHoc( TestComponent, { mockName: 'test' }) );
			Test.push( testHoc( TestComponent ) );
			Test1.push( testHoc( TestComponent, { mockName: 'test' }) );
			Test1.push( testHoc( TestComponent, { mockName: 'test' }) );
		});
		afterAll(() => {
			hocMemo = Test = Test1 = testHoc = null;
		});
		test( 'calls with different arguments yield different HOCs', () => {
			expect( Test[ 0 ] === Test1[ 0 ] ).toBe( false );
		});
		test( 'calls with same arguments received cached HOC', () => {
			expect( Test[ 0 ] === Test[ 1 ] ).toBe( true );
		});
		test( 'Any new HOC result is added to the cache', () => {
			expect( Test1[ 0 ] === Test1[ 1 ] ).toBe( true );
		});
		test( 'Cached HOC results are reused for the life of the application', () => {
			expect( Test1[ 0 ] === Test1[ 2 ] ).toBe( true );
		});
	} );
	test( 'Passes all arguments through to the hoc function', () => {
		const hocOptions = { name: 'test', isTest: true, greeting: 'hello memo' };
		new HocMemo( hocFuncMock ).use( TestComponent, hocOptions );
		expect( hocFuncMock.mock.calls[ 0 ][ 0 ] ).toEqual( TestComponent );
		expect( hocFuncMock.mock.calls[ 0 ][ 1 ] ).toEqual({ ...hocOptions, bypass: false });
	} );
} );
