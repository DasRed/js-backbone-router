'use strict';

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['require', 'lodash', 'backbone', 'backbone-controller', 'backbone-prototype-compatibility'], function (require, lodash, Backbone) {
            return Backbone.RouterEx = factory(require, lodash, Backbone.Router, Backbone.Controller, Backbone.compatibility);
        });

    } else if (typeof exports !== 'undefined') {
        throw new Error('router requiries requirejs.');

    } else {
        throw new Error('router requiries requirejs.');
    }
}(this, function (require, lodash, BackboneRouter, BackboneController, compatibility) {
    var optionalParam = /\((.*?)\)/g;
    var namedParam    = /(\(\?)?:\w+/g;
    var splatParam    = /\*\w+/g;

    /**
     * Router
     *
     * @param {Array} configs
     * @param {Object} options
     * @returns {Router}
     * @example of configs
     * <code>
     *        [
     *            {
	 *				// can be the controller constructor or a instance of a controller
	 *				controller: ControllerTest,
	 *
	 *				// defines all route for this controller. A route entry can be a string or
	 *				// an object with detailed informations
	 *				// every entry can also be an string. they will be converted to object
	 *				routes:
	 *				[
	 *					{
	 *						// defines this route as the default route. This key can only be once TRUE in the whole config
	 *						// this property is optional
	 *						isDefault: true,
	 *
	 *						// defines a route
	 *						// @see http://backbonejs.org/#Router-routes
	 *						route: 'home',
	 *
	 *						// defines the name of the route. This property is optional.
	 *						// @see http://backbonejs.org/#Router-routes
	 *						name: 'homeRoute',
	 *
	 *						// defines the parts of a route without parameters. This property is optional.
	 *						// this property will be use in the internal dispatcher of the controller
	 *						// normaly this property should not be defined and will be generated if not defined.
	 *						// the parts will be generated from the route.
	 *						// @see forge/backbone/controller.js
	 *						// @example "bundle/edit/nuff/:id" will be [bundle, edit, nuff]
	 *						// @example parts is string with "bundle/edit/nuff": will be [bundle, edit, nuff]
	 *						parts: []
	 *					},
	 *
	 *					// defines only a route without detailed informations
	 *					'bundles',
	 *
	 *					// defines only a route without detailed informations
	 *					'bundle/:id',
	 *
	 *					// defines only a route without detailed informations
	 *					'bundle/edit/nuff/:id',
	 *
	 *					// defines only a route without detailed informations
	 *					'keks'
	 *				]
	 *			},
     *
     *            // defines more route with other controllers
     *            {
	 *				// controllers and routes definitions here
	 *			}
     *        ]
     * </code>
     */
    function Router(configs, options) {
        BackboneRouter.call(this, options);

        if ((configs instanceof Array) === false) {
            throw new Error('No config was defined. Please give the router a routing config with new Router(configs, options).');
        }

        var defaultConfigRoute     = undefined;
        var configsLength          = configs.length;
        var config                 = undefined;
        var routesLength           = undefined;
        var route                  = undefined;
        var j                      = undefined;
        var routeWithoutParameters = undefined;

        var routesForHistory = [];

        // create the routes
        for (var i = 0; i < configsLength; i++) {
            config = configs[i];
            if (config.controller === undefined) {
                throw new Error('No controller was defined for routing config.');
            }

            if (config.routes === undefined) {
                throw new Error('No routes was defined for routing config.');
            }

            routesLength = config.routes.length;
            for (j = 0; j < routesLength; j++) {
                route = config.routes[j];
                // convert short
                if (typeof route === 'string') {
                    route = {
                        route: route
                    };
                }

                // set defaults
                lodash.defaults(route, {
                    isDefault: false,
                    route: route.route,
                    name: route.route,
                    parts: undefined
                });

                // define default route
                if (route.isDefault === true) {
                    if (defaultConfigRoute !== undefined) {
                        throw new Error('Duplicate default route. First route was "' + defaultConfigRoute.route.name + '" (url://' + defaultConfigRoute.route.route + '). Second default route is "' + route.name + '" (url://' + route.route + ')!');
                    }
                    defaultConfigRoute = {
                        config: config,
                        route: route
                    };
                }

                // create parts from route
                if (route.parts === undefined) {
                    routeWithoutParameters = route.route.replace(optionalParam, '');
                    routeWithoutParameters = routeWithoutParameters.replace(namedParam, function (match, optional) {
                        return optional ? match : '';
                    });
                    routeWithoutParameters = routeWithoutParameters.replace(splatParam, '');

                    route.parts = lodash.filter(routeWithoutParameters.split('/'), function (routePart) {
                        return routePart !== null && routePart !== undefined && routePart.length != 0;
                    });
                }
                // create parts from string
                else if (typeof route.parts === 'string') {
                    route.parts = route.parts.split('/');
                }

                // define route in router
                routesForHistory.unshift({
                    route: route.route,
                    name: route.name,
                    callback: this.handleRouteFromConfig.bind(this, config, route)
                });
                console.debug('Route "' + route.name + '" (url://' + route.route + ') created.');
            }
        }

        // create default
        routesForHistory.unshift({
            route: '*anything',
            name: 'default',
            callback: this.handleRouteFromConfig.bind(this, defaultConfigRoute.config, defaultConfigRoute.route)
        });
        console.debug('Default Route "' + defaultConfigRoute.route.name + '" (url://' + defaultConfigRoute.route.route + ') created.');

        // this is required for fancy reverse backbone history route definition
        routesForHistory.forEach(function (route) {
            this.route(route.route, route.name, route.callback);
            console.debug('Route "' + route.name + '" (url://' + route.route + ') defined.');
        }, this);

        console.debug('initialized');
    }

    // prototype
    Router.prototype = Object.create(BackboneRouter.prototype, {
        /**
         * the current controller
         *
         * @var {Controller}
         */
        controller: {
            value: null,
            enumerable: false,
            configurable: true,
            writable: true
        }
    });

    /**
     * handles the route config
     *
     * @param {Object} config
     * @param {Object} route
     * @param {...*} [args] route parameters
     * @returns {Router}
     * @see class docs
     */
    Router.prototype.handleRouteFromConfig = function (config, route, args) {
        console.debug('navigate to "' + route.name + '" (url://' + route.route + ').');

        var parameters = Array.prototype.slice.call(arguments);

        // if the last value in parameters undefined or null, remove it. it is an bug from BackboneRouter
        if (parameters.length > 0 && (parameters[parameters.length] === null || parameters[parameters.length] === undefined)) {
            parameters.pop();
        }

        // the controller is a string... load it with require js
        if (typeof config.controller === 'string') {
            var self = this;
            console.debug('Loading controller "' + config.controller + '" with requirejs for "' + route.name + '" (url://' + route.route + ').');
            require([
                config.controller
            ], function (controller) {
                config.controller = controller;
                self.startController(config, route, parameters);
            });
        }
        // controller is not a string load lets start
        else {
            this.startController(config, route, parameters);
        }

        return this;
    };

    /**
     * starts the controller
     *
     * @param {Object} config
     * @param {Object} route
     * @param {Array} parameters
     * @returns {Router}
     */
    Router.prototype.startController = function (config, route, parameters) {
        // remove previous controller
        if (this.controller !== null && this.controller !== config.controller) {
            this.controller.removeView(config, route);
            this.controller = null;
        }

        // create the instance, if the instance not created
        if ((config.controller instanceof BackboneController) === false) {
            config.controller = new config.controller();
        }
        this.controller = config.controller;

        // add parts to the parameters
        parameters.splice(2, 0, route.parts);

        // dispatch
        this.controller.dispatch.apply(this.controller, parameters);

        console.debug('navigated to "' + route.name + '" (url://' + route.route + ').');

        return this;
    };

    return compatibility(Router);
}));
