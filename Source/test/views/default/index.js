vvc.pageManager.view("default.index", {
    show: function (target, data) {
        target = $(target);

        target.html("");

        var searchBar = this.base.partialView(vvc.views.search.searchbar, {term : data, callback: function (term) {
            vvc.navManager.redirect("search", term);
        }});

        target.append("Search:");
        return target.append(searchBar);
    },
    hide: function () {
        $("#search").hide();
    }
});


vvc.pageManager.view("default.home", {
    show: function (target, data) {
        $("#search").show();
        var searchBar = this.base.partialView(vvc.views.search.searchbar);
        return $("#search").append(searchBar);
    },
    hide: function () {
        $("#home").show();
    }
});
