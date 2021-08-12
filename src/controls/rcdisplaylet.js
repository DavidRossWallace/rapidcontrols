if (typeof rapidControls === 'undefined') {
    var rapidControls = {};
}
rapidControls.rcDisplaylet = (function () {
    // initializing rapidControls.rsDisplaylet
    var activate = function ($control) {
        var $c = $control;
        rapidControls.dataControl.definition.getDefinition($c, function (dataDef) {
            var def = dataDef;
            var $r = $c;
            if (def.databaseType === "sqlDatabase") {
                def.fieldFilter = (function (curField) {
                    var includeField = false;
                    if (curField.hasOwnProperty("reportInclude")) {
                        includeField = (curField.reportInclude === "true");
                    }
                    return includeField;
                });
            }

            rapidControls.dataControl.retriever.getRecords(def, function (pData) {
                var $report = $r;
                var def2 = def;
                var returnedData = pData;
                var temp = $report.closest('.panel').find(".report-panel-templates").html();
                def2.recordTemplate = $(temp);
                def2.wrapReport = function (strHeadings, strRecords, def) {
                    return '<div class="list-group">' + strRecords + '</div>';
                };
                def2.wrapDataRow = function (def, rowData, rowHTML, keyData) {
                    var htm = '<li class="list-group-item datacard-list-item disabled "><table class="report-row-table"><tr>';
                    htm += rowHTML;
                    htm += '</tr></table></li>';
                    return htm;
                };
                var reportHtm = rapidControls.composer.render(def2, returnedData);
                $report.html(reportHtm);
            });
        });
    };
    return {
        activate: activate
    };

})();
