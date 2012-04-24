vvc.pageManager.view("navigation", {
    show: function (target, data) {

    	for(var i = 0, len = data.length; i < len; i++) {
    		var element = data[i];

    		$(this.target).append($("<a />", {text: element, style: "margin: 1em;"}).attr("href", "#" + element));
    	}
        
    },
    hide: function () {
        $(this.target).html("")
    }
});
