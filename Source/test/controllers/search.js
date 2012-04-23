

vvc.pageManager.controller("search", {
    '': function () {
        //Displays the default view.
        this.view(vvc.views.search.index);
    },
    'search': function (term) {

        //display the loading screen
        this.view(vvc.views.search.loading);

        //do the search against the backend
        //simulate with timeout
        var that = this;
        setTimeout(function (){
            that.view(vvc.views.search.results, {term:term, results: [{text:"hello world"}, {text:"hi there"}] });
        }, 1000);

        
    }

})

