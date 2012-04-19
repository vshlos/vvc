vvc.navManager.registerRoutes({
    "/": function () {
        $("#home").vvc("navigate", "/");
    },
    "search": function () {
        $("#search").vvc("navigate", "/search")
    }


})