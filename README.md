# svelte-cached-router
A svelte router that could cache the page component and works locally
base on [page.js](https://github.com/visionmedia/page.js) for route and [animejs](https://github.com/juliangarnier/anime/) for animation.

## screenshot

<img src="./assets/cached-router-min.gif" alt="">


1. create a `routes.js` to define the routes

```javascript

    // transitions: noAnimation, fade, parallax
    
    export var routes = {
        '/': {
            component: Home,
            props: {                        // component with props, use default transition

            }
        },
        '/about': {
            component: About,
            transition: {                   // transition with props
                type: 'fade',
                params: {
                    scale: 1,
                    duration: 1000
                }
            }
        },
        '/setting': {
            component: Setting,
            transition: 'parallax'          // transition name directly
        }
    }
```



2. create `Router` component instance

```svelte
<!-- create Router instance and set default transition -->
<Router {routes} transition='parallax' />
```

## page component's props and callback functions

page can be any svelte component

The page component is cached by default, if you don't want cache the page you can define a property `keepFresh = true` then the page could recreated verytime

* props:
    - keepFresh:  default is false
* callbacks:
    - preShow
    - preHide
    - shown
    - hidden

## exmaple

*Home.svelte*

```javascript
<div>This is a normal svelte component</div>
<script>

    // DO NOT CAHCE THIS PAGE COMPONENT
    export const keepFresh = true;

    export function shown() {
        console.log('Home page is shown');
    }

    export function preHide() {
        console.log('Home page is preHide');
    }
</script>
```

## access Page.js instance

You can use any `page.js` funcitions: `router.navigate`


```svelte
<Router bind:this={router} {routes} />

<script>
    onMount(() => {
        ...
        // router.navigate = page.js
        router.navigate.show('/abut');
        router.navigate.redirect('/setting')
        ...
    })
</script>

```

## Page transitions

There are three default transitions buildin. `fade`, `parallax` and `noAnimation` default is `parallax`

