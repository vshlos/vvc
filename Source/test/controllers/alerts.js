

vvc.pageManager.controller("alerts", {
    '': function () { //Path: alerts
        
        //default view none
    },
    'set': function (term) { //Path: alerts/set
        
        
        //remember the reference to this guy.
        var that = this;

        
        //store the alert for this search term. simulated on the backend
        setTimeout(function () {

            //calls the view to display it 
            that.view(vvc.views.alerts.set, term);

        }, 2000);



    }

})

