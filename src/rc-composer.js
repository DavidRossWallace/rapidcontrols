if (typeof rapidControls === 'undefined') {
	var rapidControls={};
}
if (!rapidControls.hasOwnProperty("composer")) {
	rapidControls.composer={};
}
rapidControls.composer=(function() {
			var wrappers={
				wrapHeadingRow:function(def,data) {
					var htm='<div class="list-group"><div class="list-group-item"><table class="report-row-table data-heading-row"><tr>';
					htm+=data;
					htm+='</tr></table></div></div>';	
					return htm				
				},
				wrapHeadingField:function(def,colDef,data) {
					var colWidth=(colDef.hasOwnProperty(colWidth)) ? colDef.colWidth : def.colWidth+'%';
					var htm='<th class="reportlet-heading-cell" style="width:'+colWidth+';">';
					htm+=data;
					htm+='</th>'
					return htm				
				},
				wrapDataRow:function(def,rowData,rowHTML,keyData) {
					var htm='<li class="list-group-item datacard-list-item report-record" data-record-id="'+keyData+'" ><table class="report-row-table"><tr>';
					htm+=rowHTML;
					htm+='</tr></table></li>';
					return htm				
				},
				wrapDataField:function(def,colDef,data) {
					var colWidth=(colDef.hasOwnProperty(colWidth)) ? colDef.colWidth : def.colWidth+'%';
					var htm='<td style="width:'+colWidth+';">';
					htm+=data;
					htm+='</td>'
					return htm				
				},
				wrapReport: function(strHeadings,strRecords,def) {
					// var htm='<div class="panel panel-runcard clearfix" data-definition="dcsRiders">';
					var htm='<div class="panel-body">';
					htm+=strHeadings;
					htm+='</div><div class="list-group">'+strRecords + '</div>';
					return htm;
				}
			}
			var buildFunctions={
				
			buildHeading:function(pDef) {
				var def=pDef;
				var fld=def.fields;
				var headingFields='';
				for (i=0;i<fld.length;i++) {
					var colDef=fld[i];
					if (colDef.reportInclude=="true") {
					var fieldName=(colDef.hasOwnProperty("fieldHeading")) ? colDef.fieldHeading : colDef.fieldName;					
					headingFields+=def.wrapHeadingField(def,colDef,fieldName);	
					}					
				}
				var headingRow=def.wrapHeadingRow(def,headingFields);	
				return headingRow
			},
			buildDataRows:function(pDef,pData,$recordTemplate) {
				var dRows=pData;
				var def=pDef;
				var htmrows='';
				var primaryKey=def.primaryKey;
				var $template=$recordTemplate;
				for (i=0;i<dRows.length;i++) {
					if ($template!=false) {
						var $curRecTemplate=$template.clone();
						$curRecTemplate.attr("data-record-id",dRows[i][primaryKey]);
						var $fullTemplate=buildFunctions.fillRecordTemplate(def,dRows[i],$curRecTemplate);
						htmrows+=$("<div>").append($fullTemplate).html();
					} else {
							// console.log("curr recrod is:" + JSON.stringify(dRows[i]));
							var curPrimKey=dRows[i][primaryKey]
							var rowHTML=buildFunctions.buildDataRow(def,dRows[i]);
							htmrows+=def.wrapDataRow(def,dRows[i],rowHTML,curPrimKey);
					}
				}
				return htmrows
			},
			buildDataRow:function(pDef,pRow) {
				var currentRow=pRow;
				var def=pDef;
				var fld=def.fields;
				var rowhtm='';
				for (z=0;z<fld.length;z++) {
					var colDef=fld[z];
					if (colDef.reportInclude=="true") {
					var fieldName=(colDef.hasOwnProperty("fieldAlias")) ? colDef.fieldAlias : colDef.fieldName;					
						if (currentRow.hasOwnProperty(fieldName)) {
							rowhtm+=def.wrapDataField(def,colDef,decodeHtml(currentRow[fieldName]));
						}	
					}
				}				
				return rowhtm;
			},
			fillRecordTemplate:function(pDef,pRow,$template) {
				var $curRowTemp=$template;
				var currentRow=pRow;
				var def=pDef;
				var fld=def.fields;
				var rowhtm='';
				for (z=0;z<fld.length;z++) {
					var colDef=fld[z];
				//	$curRowTemp.find('.item-checkbox').prop('checked',true);
				// console.log("**************** cfield:" + fld[z].fieldName + " --  value:" + currentRow['COMPLETED']);
					if (colDef.fieldName=="COMPLETED") {
						console.log("**************** completed ****** value:" + currentRow['COMPLETED']);
						if (currentRow['COMPLETED']!="NONE") {
							$curRowTemp.find('.item-checkbox').attr('checked',true);
						} else {
							$curRowTemp.find('.item-checkbox').attr('checked',false);
						}
					} else {
						if (colDef.fieldName=="AUTHCOMPLETED") {
							// console.log("**************** completed ****** value:" + currentRow['COMPLETED']);
							if (currentRow['AUTHCOMPLETED']!="NONE") {
								$curRowTemp.find('.item-checkbox-approval').attr('checked',true);
							} else {
								$curRowTemp.find('.item-checkbox-approval').attr('checked',false);
							}
						} else {
																								
							if (colDef.reportInclude=="true") {
							var fieldName= colDef.fieldName;					
								if (currentRow.hasOwnProperty(fieldName)) {
									$curRowTemp.find('.template-'+fieldName).html(decodeHtml(currentRow[fieldName]));
								}	
							}
						
						}													
					}
				}
				return $curRowTemp
			},			
			assembleReport:function(pDef,pHead,pData) {
				var def=pDef;
				var reportHTML=def.wrapReport(pHead,pData,def);
				return reportHTML;			
			}
			
	}
	function decodeHtml(pData) {
				var str="";
				if (typeof pData !="undefined")  {
					if (pData!="") {
						var newStr=pData.split("ampersand").join("&");
						newStr=newStr.split("%20").join(" ");
						newStr=newStr.split("%28").join("(");
						newStr=newStr.split("%29").join(")");
						var txt = document.createElement("textarea");
						txt.innerHTML = newStr;
						str=txt.value;
					}
				}
				return str;
	}
	
	var buildReport=function(pQueryDefinition,reportData) {	
		var def=pQueryDefinition;
		var	 data=reportData;
		def.recordCount=data.length;
		var colReportCol=0;
		var defFields=def.fields;
		for (x=0;x<defFields.length;x++) {
			if (defFields[x].reportInclude=="true") {
					colReportCol=colReportCol+1;
			}
		}
		def.colCount=colReportCol;
		def.colWidth=(def.hasOwnProperty("colWidth")) ? def.colWidth : parseInt(1/def.colCount*100);
		
		var $recordTemplate=false;
		var headingRow="";

		def.wrapReport=(def.hasOwnProperty("wrapReport")) ? def.wrapReport : wrappers.wrapReport;
		def.wrapHeadingRow=(def.hasOwnProperty("wrapHeadingRow")) ? def.wrapHeadingRow : wrappers.wrapHeadingRow;
		def.wrapHeadingField=(def.hasOwnProperty("wrapHeadingField")) ? def.wrapHeadingField : wrappers.wrapHeadingField;		
		def.wrapDataRow=(def.hasOwnProperty("wrapDataRow")) ? def.wrapDataRow : wrappers.wrapDataRow;
		def.wrapDataField=(def.hasOwnProperty("wrapDataField")) ? def.wrapDataField : wrappers.wrapDataField;
		if (!def.hasOwnProperty("recordTemplate")) {
			recordTemplate=false;
			headingRow=buildFunctions.buildHeading(def, $recordTemplate);
		} else {
			$recordTemplate=def.recordTemplate;
		}
		var dataRows=buildFunctions.buildDataRows(def,data,$recordTemplate);
	
		var htm=buildFunctions.assembleReport(def,headingRow,dataRows);
		
		return htm
	}	
	
	return {
		render:buildReport
		}
		})();
