

vvc.pageManager.controller(null, {

	_showView : function(page, callback) {
		var that = this;
		$.get("pages/" + page, function (data){
			that.view(vvc.views.default, data);
		})
	},

    '': function (data) {
    	this._showView("default.html");
    },
    'controllers': function (data) {
    	this._showView("controllers.html");
    }


})

