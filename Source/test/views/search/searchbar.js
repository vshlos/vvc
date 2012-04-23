
vvc.pageManager.partial("search.searchbar", {
    show: function (data) {
        var bar = $("<div />"), textBox = $("<input/>").appendTo(bar).val(data.term)
        base = this.base;

        $("<button />").text("search").appendTo(bar).click(function () {
            if (typeof data.callback === 'function')
                data.callback(textBox.val());
        })


        return bar;
    }
});