/*!
* VVC
*
* Author    Vlad Shlosberg
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
            //if (this instanceof Object) {
            if (typeof this === "object") {
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
    sliceArgs : function (args, removeNumber){
        return Array.prototype.slice.call(args, removeNumber);
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

            if (result != null && result != $(item))
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
        if (to){
            for (var prop in to)
                obj[prop] = to[prop];
        }
        

        return obj;
    },

    extendClass: function (namespace, name, registertool, base, prototype) {

        var baseInstance,
            baseObj,

            //create the object to be a new extended object
            obj = vvc.makeNamespace(namespace)[name] = function ExtendedObject() {
                if (typeof this === "object") {

                    this.base = new baseInstance(this)

                    base.apply(this.base, arguments)
                        
                    if (typeof this.init === "function")
                        this.init.apply(this, arguments);
                } else
                    return new ExtendedObject(arguments);
            },




            //Handles the base objects method calls. 
            //"this" is set to the instance itself, while base is set to grandfather class
            getInstanceHandler = function (val) {
                return function () {
                    var instance = this.__instance__,
                        base = instance.base;
                    try{
                        
                        instance.base = this.base;
                        val.apply(instance, arguments);    
                    }
                    finally{
                        instance.base = base;
                    }
                    
                }
            };


        //create a class from the prototype that doesn't have a constructor
        //this is used as the "new prototype" for the newly created object.
        baseObj = function () {};
        baseObj.prototype = base.prototype;

        //the base object with a new constructor to just keep the instance
        baseInstance = function (instance) {
            this.__instance__ = instance
        }

        //set the base prototype of the object and the base to be the new non-constructor object.
        baseInstance.prototype = vvc.extendObject(obj.prototype = new baseObj());


        //go through each object in the prototype.
        //if there is a new definition for it, then store the old one in the baseInstance prototype
        //and overwrite the object with the new prototype
        for (var prop in prototype) {
            var val = obj.prototype[prop]
            if (val) {
                if (typeof val === "function") {
                    baseInstance.prototype[prop] = getInstanceHandler(val);
                } else {
                    baseInstance.prototype[prop] = val;
                }
                
            }
            obj.prototype[prop] = prototype[prop];
        }
            

        //finally if its a jquery tool, register it.
        if (registertool)
            vvc.registerTool(obj, registertool);

        return obj;
    }
    

};
