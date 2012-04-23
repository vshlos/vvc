window.pages = {};
pages.Index = function (){


}
pages.Index.prototype = {
	initialize : function () {
		vvc.navManager.registerRoutes({
		    "/": function (data) {
		        $("#home").vvc("navigate", "/");
		        $("#search").vvc("navigate", "search/")
		    },
		    "search": function (data) {
		    	$("#home").vvc("navigate", "/", data);
		        $("#search").vvc("navigate", "search/search", data)
		    }

		})


		vvc.navManager.start();


	}


}



