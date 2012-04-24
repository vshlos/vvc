This is a very simple MVC framework which requires no model. Why create a model for MVC when javascript handles objects so well already? This of course leaves some of the validation to be otherwise.

The idea of this library is to help with de-coupling pieces of the website into logical groups while working very well with jQuery.


***Sample Application:

~App.js:

//create the default controller
vvc.pageManager.controller(null, {

	//Path: /
    '': function (data) { 
        //Displays the default view.
        this.view(vvc.views.default.index, data);
    }
}


//the default view
vvc.pageManager.view("default.index", {
    show: function (target, data) {
        target = $(target).show();

        return target.html("This is displayed from my view");
    },
    hide: function () {
        $(this.target).hide();
    }
});


//Lets register the route
vvc.navManager.registerRoutes({
    "/": function (data) {
        $("body").vvc("navigate", "/");
    }
})




~Index.htm

//Some initialization code:
<html>
	<head>
	<script src="libs/jquery-1.7.2.min.js"></script>
    <script src="libs/vvc.min.js"></script>
    <script src="app.js"></script>
	<script>

		$(function () {
			vvc.navManager.start();	
		})
		
	</script>
	</head>
	<body>
		No javascript enabled.
	</body>
</html>