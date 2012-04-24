vvc.pageManager.view("default", {
    show: function (target, data) {
        $(this.target).html(data)
    },
    hide: function () {
        $(this.target).html("")
    }
});
