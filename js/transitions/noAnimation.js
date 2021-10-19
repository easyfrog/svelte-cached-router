
export function noAnimation (cur, pre, dir, params) {
	if (pre) {
		pre.dom.style.display = 'none';
	}

	Object.assign(cur.dom.style, {
		display: 'block',
		opacity: 1,
		transform: 'translate(0, 0) scale(1) rotate(0)'
	})

	if (params.callback) {
		params.callback();
	}
}