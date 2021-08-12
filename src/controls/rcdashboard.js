if (typeof rapidControls === 'undefined') {
    var rapidControls = {};
}
rapidControls.rcFormlet = (function () {
    console.log("inializing rapidControls.rcDashlet");
    $("body").on("loadRecord", ".input-panel", function (event, arRecordId) {
        var $c = $(this);
        loadRecord($c, arRecordId)
    });

    var state = {};
    var getState = function (pKey) {

        var toReturn = (state.hasOwnProperty(pKey)) ? state[pKey] : "";
        return toReturn
    }
    var setState = function (key, data) {
        state[key] = data;

    }
    var activate = function ($control) {
        var $c = $control;
        rapidControls.dataControl.definition.getDefinition($c, function (dataDef) {
            var $formPanel = $c;
            var def = dataDef;
            var formHTML = buildForm(def);
            $c.html(formHTML).slideDown("slow");
        });
    }

    var getFormHTML = function ($control, dataDefinition) {
        var def = dataDefinition;
        var $c = $control;
        var formHTML = buildForm(newDef);
        return formHTML;
    }

    var loadRecord = function ($control, pRecordId) {
        var recordId = pRecordId;
        var $c = $control;
        rapidControls.dataControl.definition.getDefinition($c, function (dataDef) {
            var $formPanel = $c;
            var def = dataDef;
            def.id = recordId;
            var formHTML = buildForm(def);
            var $formControl = $(formHTML);

            getRecordData(def, function (dataRecord) {
                var mergedHTML = mergeRecordValues(def, $formControl, dataRecord);
                $formPanel.html(mergedHTML).slideDown("slow");
            });
        });
    }


    var clean = function (strData) {
        var str = strData;
        str = str.split("&#39;").join("'");
        return str
    }

    var controls = {
        wrapCell: function (def, data) {
            var cellhtm = '<td style="width:' + def.colWidth + '%;">';
            cellhtm += data;
            cellhtm += '</td>'
            return cellhtm
        },
        wrapHeadingCell: function (def, data) {
            var cellhtm = '<th class="reportlet-heading-cell" style="width:' + def.colWidth + '%;">';
            cellhtm += data;
            cellhtm += '</th>'
            return cellhtm;
        },
        getClass: function (def) {
            var retState = (def.hasOwnProperty("specialClass")) ? def.specialClass : "";
            return retState;
        }
    };
    var buildFunctions = {
        buildInputControls: function (pItemSchema) {  // loops through all item types in schema and builds form inputs for each one
            var iSchema = pItemSchema;
            var def = iSchema;
            var inputControls = iSchema.fields;
            var htm = '';
            for (var i = 0; i < inputControls.length; i++) {
                var curControl = inputControls[i];
                if (curControl.formInclude === "true") {
                    htm += controls[curControl.controlType](curControl);
                }
            }
            // htm+=controls.submitButton();


            return htm;
        },
        assembleForm: function (pSchema, pItemInputs) {
            var def = pSchema;
            var htm = '<div class="row"><div class="col-lg-12 col-md-12 col-sm-12">';
            htm += '<form class="form input-form" name="' + def.tableName + '" id="' + def.tableName + '" action="javascript:void(0);">';
            // htm+='<div class="list-group">';
            htm += pItemInputs;
            htm += '</form></div><div>';
            return htm;
        }

    };

    var buildForm = function (pSchema) {
        var schema = pSchema;
        var contentItems = buildFunctions.buildInputControls(schema);
        var htm = buildFunctions.assembleForm(schema, contentItems);
        return htm;
    };

    return {
        activate: activate,
        loadRecord: loadRecord,
        getState: getState,
        setState: setState
    };

})();
