/*
    Page manager class
*/

/*global jQuery, $, document, console, vvc */
"use strict";
vvc.createClass("vvc", "defaultNavigationManager", null, {


    init: function () {
        this.routes = {};
    },
    registerRoutes: function (paths) {
        var handler;



        for (var path in paths) {
            handler = paths[path];
            if (path && handler)
                this.registerRoute(path, handler);
        }
    },
    registerRoute: function (path, handler) {
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


        return root;
    },

    showPage: function (path) {
        var parts = path.split("/").reverse();
        var root = this.routes;

        while (typeof root !== 'function' && root && parts.length > 0) {
            root = root[parts.pop()];
        }

        if (root)
            root(path);

    },
    start: function () {

        var that = this;
        if (typeof window.onhashchange !== 'undefined') {
            window.onhashchange = function () {
                that.hashChanged();
            };
        }

        that.hashChanged();


    },
    hashChanged: function () {
        var pathStart = window.location.href.indexOf("#"),
            path = pathStart > 0 ? window.location.href.substr(pathStart + 1) : "/"

        this.showPage(path);
    },

    redirect: function () {
        var path = Array.prototype.slice.call(arguments).join("/"),
            currPathStart = window.location.href.indexOf("#"),
            base = currPathStart > 0 ? window.location.href.substr(0, currPathStart) : window.location.href;
        window.location.href=base + "#" + path;

    }



});





vvc.navManager = new vvc.defaultNavigationManager();

