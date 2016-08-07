# backbone-router-handler
## Install
```
bower install backbone-router-handler --save
```
# How To
```
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
```
