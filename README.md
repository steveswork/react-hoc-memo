# React-HOC-Memo

This package assists with the capture, caching and continued reuse of react Higher Order Components (HOC) type returned by a React HOC function.

Arguments to each new calls to the HOC function and the HOC type returned are cached and reused at subsequent calls to the HOC function bearing identical arguments.

<h4><u>Install</u></h4>

npm i -S @webkrafters/react-hoc-memo

npm install --save @webkrafters/react-hoc-memo

## Requirement

When the `HocMemo::use` method `options.bypass` argument is `false` (i.e. the default value), `Component` argument requires a valid `displayName` static property. The cache key is calculated using this property. To Components lacking this property such as those from 3p libraries, please add a unique `displayName` static propperty.

## Usage

<i><u>component.js</u></i>

    import React from 'react';
    
    const Test = props => { ... };
    Test.displayName = 'Test';
    
    export default Test;

<i><u>hoc.js</u></i>

    import React from 'react';
    import HocMemo from '@webkrafters/react-hoc-memo';
    
    const hocFunc = (Component, options) => {
	    ...
	    return props => {
		    ...
		    return (<Component  {  ...props  } />);
	    };
    };
    
    const hocMemo = new HocMemo(hocFunc);
    const hocFuncMemo = hocMemo.use.bind(hocMemo); // `hocMemo.use` arguments are passed through to the `hocFunc` function
    
    export default hocFuncMemo;

<i><u>app.js</u></i>

    import React, {Fragment} from 'react';
    import hocFuncMemo from './hoc';
    import Test from './component';
    
    const WrappedTest = hocFuncMemo(Test); // `hocMemo.use` arguments are forwarded to the `hocFunc` function
    const WrappedTest1 = hocFuncMemo(Test, { ... }); // `hocMemo.use` arguments are forwarded to the `hocFunc` function
    const WrappedTest2 = hocFuncMemo(Test, { bypass: true /* to bypass the cache */, ... }); // `hocMemo.use` arguments are forwarded to the `hocFunc` function.
    const WrappedTest3 = hocFuncMemo(Test); // WrappedTest3 === WrappedTest
    
    const App = () => (
	    <Fragment>
		    <WrappedTest  {  ...  } />
		    <WrappedTest1  {  ...  } />
		    <WrappedTest2  {  ...  } />
		    <WrappedTest3  {  ...  } />
	    </Fragment>
    );
    
    export default App;

<i><u>index.js</i></b>

    import React from 'react';
    import ReactDOM from 'react-dom';
    import App from './app';
    ReactDOM.render(<App />, document.getElementById('root'));

## Design Considerations

Decision to deliver this solution as a function closure versus a class instance was considered. Great factor in the decision was <b><i><u>cpu time</u></i></b> and <b><i><u>memory</u></i></b> usage. In large react applications, every bit of memory counts. Majority of professional applications, with every new additional feature, grows larger over time. Class instance delivery method was determined to provide a more efficient resource management.

## License

ISC
