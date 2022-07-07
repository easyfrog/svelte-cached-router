import anime from "animejs";

/**
 * params: {
 * 	duration,
 * 	opacity,
 * 	scale,
 * 	callback
 * }
 */

export function fade(cur, pre, dir, params) {

	params = params || {};
	if (pre) {
		pre.dom.style.display = 'none';
	}

	cur.dom.style.display = 'block';

	Object.assign(cur.dom.style, {
		display: 'block',
		opacity: 1,
		transform: 'translate(0, 0) rotate(0)'
	})

	anime({
		targets: cur.dom,
		duration: params.duration || 300,
		opacity: params.opacity || [0, 1],
		scale: params.scale || [.8, 1],
		delay: 10,
		easing: 'easeOutCubic',
		begin: function () {
			cur.dom.style.display = 'block';
		},
		complete: function () {
			cur.dom.style.pointerEvents = 'auto';
			if (params.callback) {
				params.callback();
			}
		}
	})

}