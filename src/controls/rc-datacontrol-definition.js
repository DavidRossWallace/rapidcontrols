if (typeof rapidControls === 'undefined') {
    var rapidControls = {};
}
if (!rapidControls.hasOwnProperty("dataControl")) {
    rapidControls.dataControl = {};
}
rapidControls.dataControl.definition = (function () {
    var controlDefinitions = {};
    var getDefinition = function ($control, callback, reload) {
        var $c = $control;
        var definitionSrc = "file";
        var newDefinition = {};
        var controlId = $c.attr("id");

        if ($c[0].hasAttribute("data-definition-src")) {
            definitionSrc = $c.attr("data-definition-src");
        }
        if (definitionSrc == "proxy") {
            callback(controlDefinitions[$c.attr("data-definition-proxy")]);
        } else {
            if ((controlDefinitions.hasOwnProperty(controlId)) && (reload !== true)) {
                callback(controlDefinitions[controlId]);
            } else {
                var defPath = ($c[0].hasAttribute("data-definition-url")) ? $c.attr("data-definition-url") : "";
                if (defPath == "") {
                    if (typeof callback === "function") {
                        callback({});
                    } else {
                        return {}
                    }
                } else {
                    getJSON({"file": defPath}, function (pDefinition) {
                        console.log("retrieving defition from url:" + defPath);
                        console.log("retrieved definition:" + JSON.stringify(pDefinition));
                        controlDefinitions[controlId] = pDefinition;
                        if (typeof callback === "function") {
                            callback(pDefinition);
                        } else {
                            return pDefinition
                        }
                    });
                }
            }
        }

    };

    var setDefinition = function (defid, def) {
        controlDefinitions[defid] = def;
    };

    var getJSON = function (package, callback) {
        var mydata;
        var pDataType = (package.dataType == "js") ? "JSON" : "JSON";

        $.ajax({
            dataType: pDataType,
            url: package.file,
            async: true,
            data: {
                package: JSON.stringify(package)
            },
            type: 'POST',
            success: function (data) {
                callback(data);
            }
        });
    };
    return {
        getDefinition: getDefinition,
        setDefinition: setDefinition
    };

})();
