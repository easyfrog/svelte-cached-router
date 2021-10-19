# svelte-cached-router
A svelte router that could cache the page component and works locally
base on `page.js` for route and `animejs` for animation.


1. create a `routes.js` to define the routes

``` 

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

```
<Router {routes} keepFresh={false} />
```

### page component's props and callback functions

page can be any svelte component

The page component is cached by default, if you don't want cache the page you can define a property `keepFresh = true` then the page could recreated verytime

* props:
    - keepFresh:  default is false
* callbacks:
    - preShow
    - preHide
    - shown
    - hidden

### exmaple

*Home.svelte*
```
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

#### Page transitions

There are three default transitions buildin. `fade`, `parallax` and `noAnimation` default is `parallax`

