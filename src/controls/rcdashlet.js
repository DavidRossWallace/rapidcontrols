if (typeof rapidControls === 'undefined') {
    var rapidControls = {};
}
rapidControls.rcDashlet = (function () {
    console.log("inializing rapidControls.rcDashlet");
    var activate = function ($control) {
        var $c = $control;
        if ($c[0].hasAttribute("data-src")) {
            var $panelType = ($c[0].hasAttribute("data-panelType")) ? $c.attr("data-panelType") : "normal";
            $c.load($c.attr("data-src"), function () {
                console.log("panel type:" + $panelType);
                if ($panelType != "modal") {
                    var $subControls = $(this).find('.rapid-control-group:not(.control-hidden)');
                    $(this).children(":first").unwrap().find('.rapid-control:not(.control-hidden)').trigger("activate");
                } else {
                    $c.children(':first').unwrap();
                }
            });
        }
    };
    return {
        activate: activate
    };

})();
