/*
    Page manager class
*/

/*global jQuery, $, document, console, vvc */
"use strict";
vvc.createClass("vvc", "defaultPageManager", null, {

    controllerNamespace: "vvc.controllers",
    viewNamspace: "vvc.views",

    init: function (controllerBase, viewBase) {
        this.controllerBase = controllerBase;
        this.controllerBase.prototype.manager = this;

        this.viewBase = viewBase;
        this.viewBase.prototype.manager = this;

        this.controllers = {};
        this.views = {};
        this.partials = {};
        this.currentView = null;

    },


    /*Creates a controller class*/
    controller: function (name, controller) {
        var obj;

        if ((!name || name == '') && this.controllers[''])
            throw new Error("Controller name is required. Only one default controller can exist.");

        obj = vvc.extendClass(this.controllerNamespace, name || 'default', null, this.controllerBase, controller);
        this.controllers[name || ''] = obj;
    },

    view: function (name, view) {
        var obj, i, namespace = this.viewNamspace;

        if (!name || name == '')
            throw new Error("View name not defined");

        i = name.lastIndexOf(".");
        if (i > 0) {
            namespace += "." + name.substr(0, i);
            name = name.substr(i + 1);
        }
        obj = vvc.extendClass(namespace, name, null, this.viewBase, view);
        this.views[name] = obj;
    },
    partial: function (name, view) {
        var obj, i, namespace = this.viewNamspace;

        if (!name || name == '')
            throw new Error("View name not defined");

        i = name.lastIndexOf(".");
        if (i > 0) {
            namespace += "." + name.substr(0, i);
            name = name.substr(i + 1);
        }
        obj = vvc.extendClass(namespace, name, null, this.viewBase, view);
        this.partials[name] = obj;
    },

    model: function (view) {

    },

    displayPage: function (target, path, args) {
        var parts = path.split("/").reverse();
        var root = this.controllers;

        while (typeof root !== 'function' && root != null && parts.length > 0) {
            root = root[parts.pop()];
        }

        //got the controller, now create and instantiate
        var controller = new root();

        //find the method based on the rest of the path
        root = controller;
        while (typeof root !== 'function' && root != null && parts.length > 0) {
            root = root[parts.pop()];
        }

        //if args exist attach to parts
        if (args)
            parts = parts.concat(args);

        //get the function and apply the rest.
        controller.target = target;
        root.apply(controller, parts);

    },
    displayView: function (target, view, data) {
        if (!view || typeof view !== 'function')
            throw new Error("View is not defined as a view function class.");

        if (!target)
            throw new Error("Target is not defined");


        target.vvc.showView(view, data);
       

    },
    partialView: function (view, data) {
        if (!view || typeof view !== 'function')
            throw new Error("View is not defined as a view function class.");

        var vw = new view();
        return vw.show(data);

    }

});


vvc.createClass("vvc.controllers", "base", null, {
    view: function (view, data) {
        if (!this.manager)
            throw new Error("View manager was not initialized");


        return this.manager.displayView(this.target, view, data);
    }

});




vvc.createClass("vvc.views", "base", null, {
    navigate: function (target, controller, data) {
        this.manager.displayPage(target, controller, data);
    },
    partialView: function (view, args) {
        return this.manager.partialView(view, args);
    },
    redirect: function (path) {
        
    }
});



vvc.pageManager = new vvc.defaultPageManager(vvc.controllers.base, vvc.views.base);

