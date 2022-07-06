<div bind:this={wrap} class="page-wrap" style="/*max-width: 100%;*/overflow: hidden;{style}">

</div>

<Loading bind:this={loading} />

<script>

	/////////////////////////////////
	// document 
	/////////////////////////////////

	/* routes 

	// transitions: noAnimation, fade, parallax
	
	export var routes = {
		'/': {
			component: Home,
			preload: () => {}, 				// return a {res: {}}, the 'res' will add to props
			props: {   						// component with props, use default transition

			}
		},
		'/about': {
			component: About,
			transition: {            		// transition with props
				type: 'fade',
				params: {
					scale: 1,
					duration: 1000
				}
			}
		},
		'/setting': {
			component: Setting,
			transition: 'parallax'    		// transition name directly
		}
	}

	*/
	
	// page component's props and callback functions
	// 
	// 		props: 
	// 			keepFresh: boolean  true: 不缓存, 每次都重新创建此页面组件
	// 			
	// 		callbacks:
	// 			preShow
	// 			preHide
	// 			shown
	// 			hidden

	/////////////////////////////////

	import page from "page";
	import { onMount, createEventDispatcher, tick } from "svelte";
	import Loading from "./Loading.svelte";

	import * as transitions from "../js/transitions";

	var dispatcher = createEventDispatcher();

	export var routes = null;
	export var style = '';

	// default swap page transition
	export var transition = 'parallax';

	// export page instance
	export const navigate = page;

	var wrap, loading;

	// {Home: {dom:, comp:, component:, route:}}
	var comps = {};
	var queue = [];

	var self = arguments[0];

	function getLocation(hash=true) {
	    if (hash) {
	        const hashIndex = window.location.href.indexOf('#!/');
	        const location = hashIndex > -1 ? window.location.href.substring(hashIndex + 2) : '/';
	        return location;
	    }
	    const relativeUrl = (window.location.pathname || '/') + window.location.search;
	    return relativeUrl;
	}

	/**
	 * 判断history是前进还是后退
	 * @return dir  > 0 前进 < 0 后退
	 */
	var checkForwardOrBack = (function () {
		var lastTimestamp = 0;
		return function (){
			// forward or back
			var dir = 1;

			var history = window.history;

			if (!history.state) {
				return dir;
			}

			var time = history.state.time;

			if (lastTimestamp && time) {
				dir = time - lastTimestamp;
			}

			if (!time) {
				time = new Date().getTime()
				history.replaceState({
					path: history.state.path,
					time
				}, '', '#!' + getLocation());
			}
			
			lastTimestamp = time;

			return dir;
		}
	})();

	function toPage(compData) {
		var pre, cur;
		if (queue.length) {
			pre = queue[0];
		}

		var dir = checkForwardOrBack();

		cur = compData;
		queue.unshift(cur);

		swapPage(cur, pre, dir);
	}

	// 处理在页面切换完成时, 将 keepFresh 的页面销毁掉
	// 并从 comps 缓存中移除
	function handleUnMount(cur, pre) {
		if (pre) {
			if (pre.comp.keepFresh) {
				pre.dom.parentElement.removeChild(pre.dom);
				pre.comp.$destroy();
				delete comps[pre.component.name];
			} else {
				// handle hidden & shown callback
				if (pre.comp.hidden) {
					pre.comp.hidden();
				}
			}

		}

		if (cur.comp.shown) {
			cur.comp.shown();
		}
	}

	/**
	 * 两个页面之间的切换
	 */
	function swapPage(cur, pre, dir) {

		// handle preShow & preHide
		if (pre) {
			if (pre.comp.preHide) {
				pre.comp.preHide();
			}

			// pre.dom.style.position = 'relative';
		}

		// cur.dom.style.position = 'absolute';

		if (cur.comp.preShow) {
			cur.comp.preShow();
		}

		var callback = handleUnMount.bind(null, cur, pre);
		var trans = cur.transition || transition;

		if (typeof trans === 'string') {
			trans = {
				type: trans
			}
		}

		var params = Object.assign({
			callback
		}, trans.params);

		return transitions[trans.type](cur, pre, dir, params);
	}

	// data: routes[key].preload
	function _getPreload(data) {
		return function (ctx, next) {
			if (data.preload) {
				dispatcher('loading', data)
				loading.visible = true;
				data.preload(ctx).then((res) => {

					loading.visible = false;
					dispatcher('loaded', data);

					// attach res to ctx.params
					Object.assign(ctx.params, res);

					next();

				})
			} else {
				next();
			}
		}
	}

	/**
	 * 设置路由数据
	 */
	function setRoutes(routes) {

		// analyze routes
		Object.keys(routes).forEach(key => {

			var _preload = _getPreload(routes[key]);

			// ctx.params
			page(key, _preload, (ctx, next) => {
				var route = routes[key];

				var component = route.component;

				var cache = comps[component.name];

				// first create component
				if (!cache || !cache.comp) {

					// create a component wrap div
					var div = document.createElement('div');
					Object.assign(div.style, {
						position: 'absolute',
						overflow: 'hidden',
						width: '100%',
						height: '100%'
					})
					wrap.appendChild(div);

					var props = route.props || {};

					// use ctx.params
					Object.assign(props, ctx.params);

					// add router to component
					props.router = self

					var comp = new component({target: div, props});

					if (route.keepFresh !== undefined) {
						comp.keepFresh = route.keepFresh;
					}

					tick().then(() => {
						var compData = {
							component,
							comp,
							dom: div,
							route: key,
							keepFresh: route.keepFresh,
							transition: route.transition
						}

						// keepFresh 不进行缓存, 每次重新创建
						if (!comp.keepFresh) {
							comps[component.name] = compData;
						}

						toPage(compData);
					})
				} else {

					// set preload and params to the cache component
					cache.comp.$set(ctx.params);

					tick().then(() => {
						toPage(cache);
					})
				}

			})
		})

		// start routing
		page.start({
			hashbang: true,
		})

	}

	onMount(() => {

		setRoutes(routes);

	})

	//
	// prevent same url
	//
	document.addEventListener('click', function (e) {
		if (e.target.tagName.toLowerCase() === 'a') {
			if (('#!' + e.target.pathname) === location.hash) {
				e.preventDefault();
				return;
			}
		}
	})

</script>