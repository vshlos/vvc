vvc.pageManager.view("search.index", {
    show: function (target, data) {
        var base = this.base;

        var parent = $(target).show();
        parent.children().remove();
        var container = $("<div/>").appendTo(parent);
        container.append($("<div />").text("search: " + data.term))
        for (var i = 0, len = data.results.length; i < len; i++) {
            var result = data.results[i];
            var dv = $("<div>").text(result.text)
            .click(function () {
                base.navigate("alerts/set");
            })
            container.append(dv)
        }

    },
    hide: function () {
        $("#results").hide();
    }
});