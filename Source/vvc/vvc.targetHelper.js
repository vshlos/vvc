
/*global jQuery, $, document, console, vvc */
"use strict";
vvc.createClass("vvc", "targetHelper", "vvc", {
    init: function (target) {
        this.target = target;
        this.currentView = null;
        this.manager = vvc.pageManager;
    },
    navigate: function (controller, args) {
        this.manager.displayPage(this.target, controller, args);
    },

    showView: function (view, data) {
        if (this.currentView)
            this.currentView.hide();

        var vw = new view();
        vw.show(this.target, data);


        this.currentView = vw;
    },

    bindNavigate: function (event, controller, args) {
        var that = this;
        $(this.target).bind(event, function (evt) {
            that.manager.displayPage(that.target, controller, args);
            evt.preventDefault();
        });
    },
    clickNavigate: function (controller, args) {
        this.bindNavigate("click", controller, args);
    },



    createLink: function (url) {
        $(this.target).attr("href", "#" + url);
    }
});



