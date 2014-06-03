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
    makeClass: function (namespace) {
        /// <summary>
        /// Creates a class either by name or or by using the method as the constructor.
        ///     based on makeClass By John Resig (MIT Licensed)
        /// <summary>
        /// <param name="arguments">Any arguments will be passed into an init method in the class prototype.<param>
        /// <returns>A object creator function which will instantiate an object instance.</returns>



        var obj = function Object() {
            if (this instanceof obj) {
                if (typeof this.init === "function" && obj.prototype.hasOwnProperty("init"))
                    obj.prototype.init.apply(this, arguments);
            } else {
                
                var args = arguments;
                var Object = function () {
                    obj.apply(this, args)
                }
                Object.prototype = obj.prototype;
                return new Object();
            }
                
        };

        return obj;
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

            //if the destroy function is called, either 
            //destroy or dont do anything if it doesn't already exist.
            if (arg0 === "destroy") {
                if (obj) {
                    if (obj.destroy) {
                        obj.destroy();
                    }
                    delete item[lowerName]
                }
               
                return;
            }
            else if (!obj) {
                obj = item[lowerName] = new className(item, !typeString ? arg0 : null);
            }


            if (typeString) {
                func = obj[arg0];
                if (func != null)
                    result = func.apply(obj, args);
            }
            else {
                if (obj.setOptions && arg0 != null)
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

    createStatic: function (namespace, name, value) {
        var space = vvc.makeNamespace(namespace);
        space[name] = value;
    },

    createClass: function (namespace, name, registertool, prototype) {

        var space = vvc.makeNamespace(namespace);
        var obj = space[name] = vvc.makeClass(space);
        obj.name = name;

        obj.prototype = prototype;
        obj.prototype.__CLASS__ = namespace + "." + name;

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

        var baseInstance;
        var baseObj;
        var space = vvc.makeNamespace(namespace)

        //create the object to be a new extended object
            
        var obj = space[name] = function ExtendedObject() {
            //if (typeof this === "object" && space !== this) {
            if (this instanceof obj) {

                //create the base object
                var currBase = this.base = new baseInstance(this)

                //call the base constructor
                base.apply(this, arguments)

                //If the base constructor changes this objects base, then there is another level
                //so we store it as the "base of the base" and set this objects base to what we 
                //originally came up with
                if (currBase != this.base) {
                    currBase.base = this.base;
                    this.base = currBase;    
                }
                
                    
                //Only call the init method if its in this classes prototype, otherwise it will be called
                //by the downstream cosntructor call.
                if (obj.prototype.hasOwnProperty("init") && typeof obj.prototype.init === "function")
                    obj.prototype.init.apply(this, arguments);
            } else {
                var args = arguments;
                var ExtendedObject = function () {
                    obj.apply(this, args)
                }
                ExtendedObject.prototype = obj.prototype;
                //return new MyObject(arguments);
                return new ExtendedObject();
            }
                
        }
        obj.name = name;




            //Handles the base objects method calls. 
            //"this" is set to the instance itself, while base is set to grandfather class
        var getInstanceHandler = function (val) {
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
            this.__instance__ = instance;
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
            
        obj.prototype.__CLASS__ = namespace + "." + name;

        //finally if its a jquery tool, register it.
        if (registertool)
            vvc.registerTool(obj, registertool);

        return obj;
    }
    

};