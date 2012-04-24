

/*global jQuery, $, document, console, vvc */
"use strict";
vvc.createClass("vvc", "defaultNavigationManager", null, {
    /// <summary>
    /// Default class for handling registering and navigating to routes based on url changes and hash url changes.
    /// <summary>


    init: function () {
        /// <summary>
        /// Initializes the DefaultNavigationManager by defining the private variables.
        /// <summary>

        this.routes = {};
    },
    registerRoutes: function (paths) {
        /// <summary>
        /// Registers a collection of routes
        /// <summary>
        /// <param name="paths" type="Object">The object which maps String path names to handler functions.<param>


        var handler;


        for (var path in paths) {
            handler = paths[path];
            if (path && handler)
                this.registerRoute(path, handler);
        }
    },
    registerRoute: function (path, handler) {
        /// <summary>
        /// Registers a single route by path and handler function
        /// <summary>
        /// <param name="path" type="String">The path to register and look for in navigation events.<param>
        /// <param name="handler" type="Function">The function which will be called when the path is identified.<param>



        var parts = path, root = this.routes, part = null;

        if (typeof path === 'string') {
            parts = path.split("/");
        }
        else if (!(path instanceof Array)) {
            throw new Error("Argument has to either be a namespace separated by a dot ('.') or be an array of elements.")
        }

        if (parts.length == 0)
            throw new Error("Path has to contain a valid ");

        for (var i = 0, len = parts.length - 1; i < len; i++) {
            part = parts[i];
            root = root[part] = root[part] || {};
        }

        root[parts[parts.length - 1]] = handler;

    },
    showPage: function (path) {
        /// <summary>
        /// Calls the handler by path name.
        /// <summary>
        /// <param name="path" type="String">The path to find and call a handler for.<param>
        /// <returns>Returns true if the handler was found and called, otherwise false.</returns>
        


        var parts = path.split("/").reverse();
        var root = this.routes

        while (root && typeof root !== 'function' && parts.length > 0) {
            root = root[parts.pop()];
        }

        //the handler was found, call it.
        if (root){
            root.apply(this.routes, parts);
            return true;
        }

        return false;
    },
    start: function () {
        /// <summary>
        /// Starts handling calls of hash changes checks the current hash for a path.
        /// <summary>
        

        var that = this;
        if (typeof window.onhashchange !== 'undefined') {
            window.onhashchange = function () {
                that._hashChanged();
            };
        }

        that._hashChanged();


    },
    _hashChanged: function () {
        /// <summary>
        /// Identifies the curreht path based on hash value and calls that handler.
        /// <summary>
        /// <returns>Returns true if the handler was found and called, otherwise false.</returns>
        
        
        var pathStart = window.location.href.indexOf("#/"),
            path = pathStart > 0 ? window.location.href.substr(pathStart + 2) : "/"

        return this.showPage(path);
    },

    redirect: function () {
        /// <summary>
        /// Takes the arguments and converts them to a url. Next this path is navigated to by the browser.
        /// <summary>
        /// <param name="arguments">The parts of the url to navigate to.</param>
        

        var path = Array.prototype.slice.call(arguments).join("/"),
            currPathStart = window.location.href.indexOf("#"),
            base = currPathStart > 0 ? window.location.href.substr(0, currPathStart) : window.location.href;
        window.location.href=base + "#/" + path;

    }



});




/// <summary>
/// The singleton instance of the default navigation manager. Also a place for overriding the default with a custom one.
/// <summary>
vvc.navManager = new vvc.defaultNavigationManager();

