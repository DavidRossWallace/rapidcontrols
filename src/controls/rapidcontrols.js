if (typeof rapidControls === 'undefined') {
    var rapidControls = {};
}

$('body').on('hidden.bs.modal', '.modal', function () {
    // do something…
    $(".rapid-panel", $(this)).each(function (i) {
        $(this).html("");

        $(this).hide();

    });
    $("#showAllDates").trigger("click");
});
$('body').on('focus', '.form-control', function () {
    // do something…

    $(this).addClass("has-focus");
});
$('body').on('focusout', '.form-control', function () {
    // do something…

    $(this).removeClass("has-focus");
});

$("body").on('activate', '.rapid-control', function (event) {
    event.stopPropagation();
    console.log("control just activated is rapidcontrol activate:" + $(this).attr("id"));
    var $that = $(this);
    rapidControls[$that.attr("data-type")].activate($that);
});
rapidControls.init = (function () {
    console.log("inializing rapidControls.control");


    var mode = "";
    var setRole = function (pRole) {
        mode = pRole;
    };

    var setDispatch = function () {
        mode = "dispatch";
    };
    var setManager = function () {
        mode = "manager";
    };
    var setPSO = function () {
        mode = "officer";
    };
    var getMode = function () {
        return mode;
    };
    return {
        setDispatch: setDispatch,
        setPSO: setPSO,
        setManager: setManager,
        getMode: getMode,
        setRole: setRole
    };

})();