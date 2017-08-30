# backbone-router-handler
## General
This router handler provides a more flexible way for routing in combination with [Controller](https://github.com/DasRed/js-backbone-controller).
This router handler inherits from the BackBone.Router.

## Install
```
bower install backbone-router-handler --save
npm install js-backbone-router-handler --save
```

## Example
```js
function ControllerTest() {
    Controller.apply(this, arguments);
}

ControllerTest.prototype = Object.create(Controller.prototype);

ControllerTest.prototype.home = function() {
    // do home controller stuff for route /home
};

ControllerTest.prototype.bundles = function() {
    // do home controller stuff for route /bundles
};

ControllerTest.prototype.bundle = function(id) {
    // do home controller stuff for route /bundle/:id
};

ControllerTest.prototype.bundleEditNuff = function(id) {
    // do home controller stuff for route /bundle/edit/nuff/:id
};

ControllerTest.prototype.keks = function() {
    // do home controller stuff for route /keks
};

let router = new Router([
    {
        // can be the controller constructor or a instance of a controller
        controller: ControllerTest,

        // defines all route for this controller. A route entry can be a string or
        // an object with detailed informations
        // every entry can also be an string. they will be converted to object
        routes: [
            {
                // defines this route as the default route. This key can only be once TRUE in the whole config
                // this property is optional
                isDefault: true,

                // defines a route
                // @see http://backbonejs.org/#Router-routes
                route: 'home',

                // defines the name of the route. This property is optional.
                // @see http://backbonejs.org/#Router-routes
                name: 'homeRoute',

                // defines the parts of a route without parameters. This property is optional.
                // this property will be use in the internal dispatcher of the controller
                // normaly this property should not be defined and will be generated if not defined.
                // the parts will be generated from the route.
                // @see forge/backbone/controller.js
                // @example "bundle/edit/nuff/:id" will be [bundle, edit, nuff]
                // @example parts is string with "bundle/edit/nuff": will be [bundle, edit, nuff]
                parts: []
            },

            // defines only a route without detailed informations
            'bundles',

            // defines only a route without detailed informations
            'bundle/:id',

            // defines only a route without detailed informations
            'bundle/edit/nuff/:id',

            // defines only a route without detailed informations
            'keks'
        ]
    },

    // defines more route with other controllers
    {
        // controllers and routes definitions here
    }
]);
```

If the router detect the route 
- /home then the controller action ControllerTest.prototype.home 
- /bundles then the controller action ControllerTest.prototype.bundles 
- /bundle/42 then the controller action ControllerTest.prototype.bundle with the parameter 42
- /bundle/edit/nuff/10 then the controller action ControllerTest.prototype.bundleEditNuff with the parameter 10
- /keks then the controller action ControllerTest.prototype.keks

If the router detect a controller switch, the function "removeView" of the previous controller will be called.

Every controller will only be instantiated once.

The controllers must inherit from [Controller](https://github.com/DasRed/js-backbone-controller).

## getDefaultRoutePath
The router provides the function "getDefaultRoutePath", which returns the default route string. This make it easy to get and navigate to the default route. 
