export = ReactHocMemo;
export as namespace ReactHocMemo;
declare namespace ReactHocMemo {
	type Decorator<
		C = React.ElementType,
		OPTS extends Object = {},
		W = React.ElementType
	> = (
		Component: C,
		options?: {
			bypass?: boolean = false
		} & OPTS
	) => W;
}
declare class HocMemo {
	constructor(hoc: ReactHocMemo.Decorator<C, OPTS, W>);
	use: ReactHocMemo.Decorator<C, OPTS, W>;
	class DisplayNameError extends Error {}
}
