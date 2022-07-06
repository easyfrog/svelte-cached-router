import anime from "animejs";

function show(dom, params) {
	anime(Object.assign({
		targets: dom,
		duration: params.duration,
		translateX: ['100%', 0],
		easing: 'easeOutCubic',
		begin: function () {
			dom.style.display = 'block';	
		},
		// update: function (t) {
		// 	console.log(t);
		// 	if (t.currentTime > 200)	 {
		// 		debugger
		// 	}
		// },
		complete: function (anim) {
			dom.style.pointerEvents = 'auto';

			if (params.callback) {
				params.callback();
			}
		}
	}, params))
}

function hide(dom, params) {
	anime(Object.assign({
		targets: dom,
		duration: params.duration * 1.2,
		translateX: [0, '-100px'],
		easing: 'easeOutCubic',
		complete: function (anim) {
			dom.style.pointerEvents = 'none';
			dom.style.display = 'none';
		}
	}, params))
}

function back(dom, params) {
	anime(Object.assign({
		targets: dom,
		duration: params.duration,
		delay: 33,
		translateX: [0, '100%'],
		easing: 'easeOutCubic',
		begin: function () {
			dom.style.display = 'block';	
		},
		complete: function (anim) {
			dom.style.display = 'none';
		}
	}, params))
}

function reveal(dom, params) {
	anime(Object.assign({
		targets: dom,
		duration: params.duration,
		translateX: ['-100px', 0],
		easing: 'easeOutCubic',
		begin: function () {
			dom.style.display = 'block';	
		},
		complete: function (anim) {
			dom.style.pointerEvents = 'auto';

			if (params.callback) {
				params.callback();
			}
		}
	}, params))
}

export function parallax(cur, pre, dir, params) {

	params = Object.assign({
		duration: 400
	}, params);

	var callback = params.callback;

	params.callback = function () {
		// if (pre) {
		// 	pre.dom.style.position = 'unset';
		// }
		// cur.dom.style.position = 'unset';

		if (callback) {
			callback();
		}
	}

	if (pre) {
		pre.dom.style.zIndex = 1;
	}

	// new or forward
	if (dir > 0) {
		if (pre) {
			pre.dom.style.zIndex = 1;
			hide(pre.dom, params);
		}
		cur.dom.style.zIndex = 2;
		show(cur.dom, params);
	} else {
		if (pre) {
			pre.dom.style.zIndex = 2;
			back(pre.dom, params);
		}

		cur.dom.style.zIndex = 1;
		// backward
		reveal(cur.dom, params);
	}
		
}



