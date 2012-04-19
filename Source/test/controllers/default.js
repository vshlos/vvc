

vvc.pageManager.controller(null, {
    '': function () {
        //Displays the default view.
        this.view(vvc.views.default.index);
    },
    'search': function (term) {

        

        //do the search against the backend
        //simulate with timeout
        var that = this;
        setTimeout(function (){
            that.view(vvc.views.search.index, {term:term, results: [{text:"hello world"}, {text:"hi there"}] });
        }, 1000);

        
    }

})

