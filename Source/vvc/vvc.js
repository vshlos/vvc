/*
* Root namespace
*
*
* JSLint Configuration:
*/
/*global jQuery, $, document, console, vvc */
"use strict";
window.vvc = {
    /// <summary>
    /// 
    /// <summary>
    



    // makeClass - 
    makeClass: function () {
        /// <summary>
        /// Creates a class either by name or or by using the method as the constructor.
        ///     based on makeClass By John Resig (MIT Licensed)
        /// <summary>
        /// <param name="arguments">Any arguments will be passed into an init method in the class prototype.<param>
        /// <returns>A object creator function which will instantiate an object instance.</returns>


        return function Object() {
            if (this instanceof Object) {
                if (typeof this.init == "function")
                    this.init.apply(this, arguments);
            } else
                return new Object(arguments);
        };
    },

    
    makeNamespace: function (path) {
        /// <summary>
        /// Creates a namespace from the string provided with a "." separator or an array to the full path.
        /// <summary>
        /// <param name="path" type="String"><param>
        /// <returns></returns>



        var parts = path, root = window, part = null;

        if (typeof path === 'string') {
            parts = path.split(".");
        }
        else if (!(path instanceof Array)) {
            throw new Error("Argument has to either name namespace with separated by '.' or be an array of elements.")
        }

        for (var i = 0, len = parts.length; i < len; i++) {
            part = parts[i];
            root = root[part] = root[part] || {};
        }

        return root;
    },

    registerAllTools: function (jQuery) {
        var item, list = vvc.jqueryTools;

        if (!jQuery && !jQuery.fn)
            throw new Error("jQuery object not defined.");

        if (!list)
            return;


        while (list.length > 0) {
            item = list.pop();

            jQuery.fn[item.name] = function () {
                return vvc.toolConstructor(this, item.type, item.name, arguments);
            };
        }

    },

    registerTool: function (type, name) {

        var jq;

        if (!vvc.jqueryTools)
            vvc.jqueryTools = [];

        vvc.jqueryTools.push({ type: type, name: name })



        if (typeof jQuery !== 'undefined')
            jq = jQuery;
        else if (typeof $ !== 'undefined')
            jq = $;

        if (jq)
            vvc.registerAllTools(jq);
    },

    /*
    Shared constructor type for all tools to keep them the same format mimicking jqueryUI.
    */
    toolConstructor: function (target, className, lowerName, args) {


        var arg0 = args ? args[0] : null,
            results = [],
            targetResults,
            typeString = typeof arg0 === "string"



        if (typeString) {
            args = Array.prototype.slice.call(args);
            args.shift();
        }

        targetResults = target.each(function () {
            var item = this,
                obj = item[lowerName],
                result,
                func;

            if (!obj)
                obj = item[lowerName] = new className(item, !typeString ? arg0 : null);


            if (typeString) {
                func = obj[arg0];
                if (func != null)
                    result = func.apply(obj, args);
            }
            else {
                if (obj.setOptions)
                    obj.setOptions(arg0);
            }

            if (result && result != $(item))
                results.push(result);

        })

        if (results.length > 0)
            return results[0];
        else
            return targetResults;
    },

    createClass: function (namespace, name, registertool, prototype) {

        var namespace = vvc.makeNamespace(namespace),
            obj = namespace[name] = vvc.makeClass();

        obj.prototype = prototype;

        if (registertool)
            vvc.registerTool(obj, registertool);

        return obj;
    },

    extendObject: function (from, to) {
        var obj = {};
        for (var prop in from)
            obj[prop] = from[prop];
        for (var prop in to)
            obj[prop] = to[prop];

        return obj;
    },

    extendClass: function (namespace, name, registertool, base, prototype) {

        var obj = vvc.createClass(namespace, name, registertool, prototype);

        if (typeof base === 'function')
            base = base.prototype;

        obj.prototype = vvc.extendObject(base, obj.prototype);

        if (!obj.prototype.base)
            obj.prototype.base = base;

        return obj;
    }

};

