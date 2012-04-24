vvc.createClass("pages", "Docs", null, {
	initialize : function () {
		vvc.navManager.registerRoutes({
			
			currentTrail : ["/Docs"],

		    "/": function (data) {
		        $("#home").vvc("navigate", "/");
		        this.currentTrail.push("/controllers")
		    	$("#nav").vvc("navigate", "navigation/", this.currentTrail);
		    },
		    "controllers": function (data) {
		    	$("#home").vvc("navigate", "/controllers");
				this.currentTrail.push("/controllers")
		    	$("#nav").vvc("navigate", "navigation/", this.currentTrail);
		    	

		    }

		})


		vvc.navManager.start();


	},
	


});