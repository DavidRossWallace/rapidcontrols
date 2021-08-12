if (typeof rapidControls === 'undefined') {
    var rapidControls = {};
}
rapidControls.rcDatagroup = (function () {
    var previousScreen = "";

    $('body').on('click', '.show-input-form', function (e) {
        e.stopPropagation();
        previousScreen = "new";
        var $group = $(this).closest(".rapid-control-datagroup");
        var $reportPanel = $group.find(".report-panel");
        var groupId = $group.attr("id");
        var $formPanel = $group.find(".input-panel");
        $formPanel.html("").slideUp("fast");
        $reportPanel.html("").slideUp("slow");
        $group.find(".datagroup-button").addClass("hidden");
        $group.find(".formlet-insert-formdata").removeClass("hidden");
        $formPanel.trigger("activate");
        $(".time-mask").mask("99:99");
        var curDate = new Date();
        var hr = dateFun.fixDouble(curDate.getHours());
        var mn = dateFun.fixDouble(curDate.getMinutes());
        var fullTime = hr + ":" + mn;
        $(".time-mask").val(fullTime);

        $('.phone-input').mask("(999) 999-9999");
        $('.date-input-string').mask("99/99/9999 99:99");
        var sDate = new Date();
        sDate = dateFun.formatDateForSql(sDate);

        $('.long-date-input').datetimepicker({
            format: 'YYYY-DD-MM HH:mm:ss',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        }).on('changeDate', function (ev) {
            $(this).datetimepicker('hide');
        });
        $('.short-date-input').datetimepicker({
            format: 'DD/MM/YYYY',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-arrow-up",
                down: "fa fa-arrow-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        }).on('changeDate', function (ev) {
            $(this).datetimepicker('hide');
        });
        $('.wyswyg').wysihtml5({
            toolbar: {
                fa: true
            }
        });
        $formPanel.find(".everycombo-input").each(function (index) {
            var elemId = $(this).attr("id");
            var instance = $(this).attr("data-instance");
            instance = (typeof instance === "undefined") ? "single" : "multiple";
            var arOptions = rapidControls.rcFormlet.getState(elemId);
            var arOptions2 = [];
            for (var i = 0; i < arOptions.length; i++) {
                arOptions2.push(arOptions[i].OPTIONLABEL);
            }

            var every = new everyMultiCombo(elemId, arOptions2, instance, groupId, (function () {
                return;
            }));
        });
    });
    $('body').on('click', '.show-report', function (e) {
        e.stopPropagation();
        var $group = $(this).closest(".rapid-control-datagroup");
        var $formPanel = $group.find(".input-panel");
        var $reportPanel = $group.find(".report-panel");
        $reportPanel.html("").slideUp("fast");
        $formPanel.html("").slideUp("fast");
        $group.find(".datagroup-button").addClass("hidden");
        $c = $reportPanel;
        $reportPanel.trigger("activate");

    });


    $("body").on("click", ".report-record", function (e) {
        e.stopPropagation();
        previousScreen = "showreport";
        var $record = $(this);
        var recId = $(this).attr("data-record-id");
        var $dataGroup = $record.closest(".rapid-control-datagroup");
        var $formPanel = $dataGroup.find(".input-panel");
        var $reportPanel = $dataGroup.find(".report-panel");
        $formPanel.html("").slideUp("fast");
        $reportPanel.html("").slideUp("slow");
        $dataGroup.find(".datagroup-button").addClass("hidden");
        $dataGroup.find(".formlet-update-formdata").removeClass("hidden");
        $reportPanel.html("").slideUp("fast");
        rapidControls.rcFormlet.loadRecord($formPanel, recId);
        $fp = $formPanel;
        rapidControls.dataControl.definition.getDefinition($formPanel, function (dataDef) {
            if (dataDef.hasOwnProperty("allowAttachments")) {
                if (dataDef.allowAttachments === "true") {
                    addAttachments($formPanel, dataDef, recId);
                }
            }
            $('.long-date-input').datetimepicker({
                format: 'YYYY-DD-MM HH:mm:ss',
                icons: {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-arrow-up",
                    down: "fa fa-arrow-down",
                    previous: 'fa fa-chevron-left',
                    next: 'fa fa-chevron-right',
                    today: 'fa fa-screenshot',
                    clear: 'fa fa-trash',
                    close: 'fa fa-remove'
                }
            }).on('changeDate', function (ev) {
                $(this).datetimepicker('hide');
            });
            $('.wyswyg').wysihtml5({
                toolbar: {
                    fa: true
                }
            });
        });
    });

    $('body').on('shown.bs.modal', '.modal', function (e) {
        e.stopPropagation();
        $('#logListTow').html("");
        $('#logListTow').empty();
        $c = $(this);
        rapidControls.dataControl.definition.getDefinition($c, function (dataDef) {
            $c.find(".datagroup-button").addClass("hidden");
            if ((rapidControls.init.getMode() === "manager") || ($c.attr('data-reportType') === "trend")) {
                var $curReport = $c.find(".show-report").trigger("click");
            } else {
                var $rapidPanel = $c.find(".show-input-form").trigger("click");
            }
        });
    });
    var addAttachments = function ($control, pDef, pRecordId) {
        var $c = $control, def = pDef, recId = pRecordId;
        if (def.hasOwnProperty('allowAttachments')) {
            if (def.allowAttachments === 'true') {
                $("<div>").load("/parking-services/portlets/attachments/rapid-rcattachmentgroup-attachments.htm", function (myThis) {
                    $c.append($(this).wrap("<div>").html());
                    $group = $c.find(".rapid-control-rcattachmentgroup");
                    $group.attr("data-tablename", def.tableName);
                    $group.attr("data-recordid", recId);
                    $group.attr("data-filepath", def.attachmentPath);
                    rapidControls.rcAttachmentGroup.activate($group);
                });
            }
        }
    };

    $("body").on("click", ".formlet-insert-formdata", function (e) {
        e.stopPropagation();
        var $group = $(this).closest(".rapid-control-datagroup");
        $group.find(".datagroup-button").addClass("hidden");
        var $formPanel = $group.find(".input-panel");
        var $reportPanel = $group.find(".report-panel");
        $reportPanel.find("#rexportTable").parent().html("");
        var $inputForm = $formPanel.find(".input-form");

        rapidControls.dataControl.definition.getDefinition($formPanel, function (dataDef) {
            var panelDefinition = dataDef;
            var recordId = $("#" + panelDefinition.primaryKey, ".input-form").val();
            var flds = panelDefinition.fields;
            for (var i = 0; i < flds.length; i++) {
                var fieldName = flds[i].fieldName;
                $("#" + fieldName).removeClass("invalidField");
            }
            var $dataForm = $inputForm;
            rapidControls.dataControl.saver.validateForm(panelDefinition, $dataForm, function (pIsValid, pInvalidFields) {
                var dataDefinition = panelDefinition;
                var $frmPanel = $formPanel;
                var $rp = $reportPanel;
                var $readyForm = $dataForm;
                var $groupPanel = $group;
                if (pIsValid === false) {
                    for (i = 0; i < pInvalidFields.length; i++) {
                        var invalFieldName = pInvalidFields[i];
                        $("#" + invalFieldName, $readyForm).addClass("invalidField");
                    }
                    return;
                } else {
                    var recId = recordId;
                    $readyForm[panelDefinition.primaryKey] = recId;
                    rapidControls.dataControl.saver.saveForm(dataDefinition, $readyForm, function (result) {
                        var responseText = '<div class="alert alert-success">Success: record saved.</div>';
                        if (result === 'fail') {
                            responseText = '<div class="alert alert-danger">An error occured while saving to database. Please Refresh browser and try again.</div>';
                        }
                        $frmPanel.html(responseText).show("slidedown", function () {
                            setTimeout((function () {
                                showNextScreen($groupPanel);
                            }), 1000);

                        });
                    });
                }
            });
        });
    });

    var showNextScreen = function ($groupPanel) {
        var $c = $groupPanel;
        if (previousScreen === "new") {
            $rapidPanel = $c.find(".show-input-form").trigger("click");
        } else {
            var $curReport = $c.find(".show-report").trigger("click");
        }
    };

    var closePanels = function ($group) {
        $group.find(".rapid-panel").slideUp("fast");
    };

    var activate = function ($control) {

    };
    return {
        activate: activate
    };

})();
