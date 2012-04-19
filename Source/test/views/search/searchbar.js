
vvc.pageManager.partial("search.searchbar", {
    show: function (callback) {
        var bar = $("<div />"), textBox = $("<input/>").appendTo(bar)
        base = this.base;

        $("<button />").text("search").appendTo(bar).click(function () {
            if (typeof callback === 'function')
                callback(textBox.val());
        })


        return bar;
    }
});