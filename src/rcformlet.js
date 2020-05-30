if (typeof rapidControls === 'undefined') {
	var rapidControls={};
}
rapidControls.rcFormlet=(function() {
			console.log("inializing rapidControls.rcDashlet");
			$("body").on("loadRecord",".input-panel",function( event, arRecordId) {
					var $c=$(this);
					loadRecord($c,arRecordId) 
			});
	
			var state={};
			var getState=function(pKey) {
					
					var toReturn=(state.hasOwnProperty(pKey)) ? state[pKey] : "";	
					return toReturn
			}
			var setState=function(key,data) {
					state[key]=data;
		
			}
			var activate=function($control) {
					var $c=$control;	
					rapidControls.dataControl.definition.getDefinition($c,function(dataDef) {
						var $formPanel=$c;
						var def=dataDef;
						def.sqlSource="fields";
						var formHTML=buildForm(def);		
					
						$c.html(formHTML).slideDown("slow");
						if (def.hasOwnProperty("firstFocus")) {
							$c.find("#"+def.firstFocus).focus();
						}
					});					
			}
			
			var getFormHTML=function($control,dataDefinition) {
				var def=dataDefinition;
				var $c=$control;
				var formHTML=buildForm(newDef);		
				return formHTML;
			}
				
			var loadRecord=function($control,pRecordId,reload,callback) {
				var recordId=pRecordId;
				var $c=$control;
				var cb1=callback || {} ;
				rapidControls.dataControl.definition.getDefinition($c,function(dataDef) {
					var $formPanel=$c;
					cb2=cb1
					var def=dataDef;
					def.id=recordId;				
					var formHTML=buildForm(def);
					var $formControl=$(formHTML);
					
					getRecordData(def,function(dataRecord) {
						var mergedHTML=mergeRecordValues(def,$formControl,dataRecord);	
						$formPanel.html(mergedHTML).slideDown("slow");
						if (typeof cb2=="function") {
								cb2();
						}
				});
			},reload);
			}

			var getRecordData=function(dataDefinition,callback) {
				var def=dataDefinition;
				if (def.databaseType=="sqlDatabase"){
					def.criteria=" " + def.primaryKey + "=singlequote" + def.id + "singlequote ";
					def.fieldFilter=function(curField) {
						var includeField=false;
						if (curField.hasOwnProperty("formInclude")) {
							includeField= (curField.formInclude=="true");
						}
						return includeField
					}
				}
				def.sqlSource="fields";
				rapidControls.dataControl.retriever.getRecords(def,function(pData) {
					var dataRecord=pData[0];
					callback(dataRecord);
				})
			}
			var clean=function(strData) {
				var str=strData;
				str=str.split("&#39;").join("'");
				return str				
			}		
			function decodeHtml(pData) {
				var str="";
				if (typeof pData !="undefined")  {
					if (pData!="") {
						var newStr=pData.split("ampersand").join("&");
						var txt = document.createElement("textarea");
						txt.innerHTML = newStr;
						str=txt.value;
					}
				}
				return str;
			}
			var mergeRecordValues=function(dataDefinition,$cForm,dataRecord) {
				var data=dataRecord, $c=$cForm, def=dataDefinition;
					var flds=def.fields;
					for (i=0;i<flds.length;i++) {
						var curField=flds[i];
							if (data.hasOwnProperty(curField.fieldName)) {
								
								
									var cType=curField.controlType;
								//	console.log("controlType:" + cType + "  indexOf:" + cType.indexOf("textArea"));
									var tempValue=decodeHtml(data[curField.fieldName]);
									if (cType.indexOf("textArea")>=0) {
										var currentData=decodeHtml(tempValue);
										 $c.find("#"+curField.fieldName).text(currentData);
									} else if (cType.indexOf("thumbNail")>=0) {
										var $con=$c.find("#"+curField.fieldName);										
										$con.attr("href", tempValue);
										$con.find('img').attr('src',tempValue);
									} else {
											if (cType.indexOf("select")>=0) {
												$c.find("#"+curField.fieldName).attr("value",tempValue).find("option[value='"+ tempValue+"']").attr("selected","selected");	
											} else {
												$c.find("#"+curField.fieldName).val(data[curField.fieldName]);
												$c.find("#"+curField.fieldName).attr("value",tempValue);
											}
									}
								// $c.find("#"+curField.fieldName).val(data[curField.fieldName]);	
							}
					}
				var finalHTML=$("<div>").append($c).html();
				return finalHTML
			}
			
			var controls={
			wrapCell:function(def,data) {
				var cellhtm='<td style="width:'+def.colWidth+'%;">';
				cellhtm+=data;
				cellhtm+='</td>'
				return cellhtm				
			},
			wrapHeadingCell:function(def,data) {
				var cellhtm='<th class="reportlet-heading-cell" style="width:'+def.colWidth+'%;">';
				cellhtm+=data;
				cellhtm+='</th>'
				return cellhtm				
			},
			hiddenField:function(def) {	
				var htm='<input type="hidden" data-insert-type="' + def.inserType + '" value="special" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control" />';		
				return htm			
			},
			textInput:function(def) {
				var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				var htm='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" value="" ' + disabledStatus+ ' id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div>';
				return htm			
			},
			thumbNail:function(def) {
				var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				var htm='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<a id="' + def.fieldName + '" target="_blank"  href="">';
				htm+='<img height="25" width="25" src="" />';
				htm+='</a>';		
				htm+='</div>';
				return htm			
			},
			textInputLeft:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var htm='<table class="form-table"><tr><td width="50%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" ' + disabledStatus+ ' value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td>';
				return htm			
			},
			textInputRight:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
					var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				var htm='<td width="50%" class="control-right">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" ' + disabledStatus+ ' value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td></tr></table>';
				return htm			
			},
			customCheckbox:function(def) {
				var fldWidth=controls.getSize(def);
					var htm='<td width="'+fldWidth+'%" class="control-right">';
					// htm+='<div class="form-group-sm">';
					// htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
					htm+='<div class="checkbox">';
					htm+='<label for="'+def.fieldName+'" class="rule-label-text">';
					htm+='<input type="checkbox" id="'+def.fieldName+'" name="'+def.fieldName+'"  >';
					htm+='<span class="cr"><i class="cr-icon fa fa-check text-danger"></i></span>';
					htm+='</label>';
				//	htm+='</div>';
					htm+='</div></td></tr></table>';
					return htm
			},
			textInputLeftMultiple:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
					var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				var fldWidth=controls.getSize(def);
				var htm='<table class="form-table">';
				htm+='<tr><td width="'+fldWidth+'%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" ' + disabledStatus+ ' value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td>';
				return htm			
			},	
			thumbNailLeftMultiple:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
					var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				var fldWidth=controls.getSize(def);
				var htm='<table class="form-table">';
				htm+='<tr><td width="'+fldWidth+'%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<a id="' + def.fieldName + '" target="_blank"  href="">';
				htm+='<img height="100" width="100" src="" />';
				htm+='</a>';
				htm+='</div></td>';
				return htm			
			},	
			thumbNailRightMultiple:function(def) {
				var fldNumb=def.numberOnLine;
				var fldWidth=parseInt(100/fldNumb);
				var htm='<td width="'+fldWidth+'%" class="control-right">';
				var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<a id="' + def.fieldName + '" target="_blank"  href="">';
				htm+='<img height="100" width="100" src="" />';
				htm+='</a>';
				htm+='</div></td></tr></table>';
				return htm			
			},	
			timeLeftMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var htm='<table class="form-table">';
				htm+='<tr><td width="'+fldWidth+'%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" disabled value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm time-mask" />';		
				htm+='</div></td>';
				return htm			
			},	
			textInputMiddleMultiple:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
					var controlContainer=(def.hasOwnProperty("fieldClass")) ? "container"+def.fieldClass : "";
					var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				var fldWidth=controls.getSize(def);
				var htm='<td width="'+fldWidth+'%" class="control-middle">';
				htm+='<div class="form-group-sm control-group-middle" id="'+controlContainer+'" >';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" ' + disabledStatus+ ' value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td>';
				return htm			
			},	
			textInputRightMultiple:function(def) {
				var fldNumb=def.numberOnLine;
				var fldWidth=parseInt(100/fldNumb);
				var htm='<td width="'+fldWidth+'%" class="control-right">';
				var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var disabledStatus=(def.hasOwnProperty("controlStatus")) ? def.controlStatus : "";
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" value="" ' + disabledStatus+ ' id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td></tr></table>';
				return htm			
			},			
			textInputLeftThird:function(def) {
				var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var htm='<table class="form-table"><tr><td width="33.3%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td>';
				return htm			
			},
			textInputMiddleThird:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var htm='<td width="33.3%" class="control-middle">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td>';
				return htm			
			},
			textInputRightThird:function(def) {
					var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var htm='<td width="33.3%" class="control-right">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				htm+='<input type="text" placeholder="' +  def.fieldHeading + '" value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm ' + fieldClass + '" />';		
				htm+='</div></td></tr></table>';
				return htm			
			},
			selectControl:function(def) {
				var htm='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions='<option value="">select '+def.fieldHeading+'</option>'+ controls.arrayToOptions(def);
				htm+='<select type="text" value="" id="'+def.fieldName+'" id="'+def.fieldName+'"  name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
				htm+='</div>';
				return htm			
			},
			comboLeftMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var c='<table class="form-table"><tr>';
				c+='<td width="'+fldWidth+'%" class="control-left">';
				c+='<div class="form-group-sm combowrap">';
				c+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions= controls.arrayToOptions(def);
				c+='<div class="right-inner-addon combowrap">';
				c+='<i class="fa fa-angle-down dropbutton" aria-hidden="true"></i>';
				c+='<input type="text" id="'+def.fieldName+'" data-value="" value="" name="'+def.fieldName+'" class="form-control '+def.fieldName+' '+ controls.getClass(def) + ' everycombo-input input-sm" />';
				c+="</div>"
				c+='</div></td>';
				return c			
			},
			comboRightMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var c='<td width="'+fldWidth+'%" class="control-left">';
				c+='<div class="form-group-sm combowrap">';
				c+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions= controls.arrayToOptions(def);
				c+='<div class="right-inner-addon combowrap">';
				c+='<i class="fa fa-angle-down dropbutton" aria-hidden="true"></i>';
				c+='<input type="text" id="'+def.fieldName+'" data-value="" value="" name="'+def.fieldName+'" class="form-control '+def.fieldName+' '+ controls.getClass(def) + ' everycombo-input input-sm" />';
				c+="</div>"
				c+='</div></td></tr></table>';
				return c				
			},
			comboMiddleMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var c='<td width="'+fldWidth+'%" class="control-middle">';
				c+='<div class="form-group-sm combowrap">';
				c+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions= controls.arrayToOptions(def);
				//htm+='<select type="text" value="" id="'+def.fieldName+'" id="'+def.fieldName+'"  name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
					c+='<div class="right-inner-addon combowrap">';
					c+='<i class="fa fa-angle-down dropbutton" aria-hidden="true"></i>';
					c+='<input type="text" id="'+def.fieldName+'" data-value="" value="" name="'+def.fieldName+'" class="form-control '+def.fieldName+' '+ controls.getClass(def) + ' everycombo-input input-sm" />';
					c+="</div>"
				c+='</div></td>';
				return c			
			},
			comboMultiple:function(def) {
				var fldWidth=controls.getSize(def);
					
				var c='<div class="form-group-sm combowrap">';
				c+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions= controls.arrayToOptions(def);

				rapidControls.rcFormlet.setState(def.fieldName,selectOptions);
				//htm+='<select type="text" value="" id="'+def.fieldName+'" id="'+def.fieldName+'"  name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
					c+='<div class="right-inner-addon combowrap">';
					c+='<i class="fa fa-angle-down dropbutton" aria-hidden="true"></i>';
					c+='<input type="text" id="'+def.fieldName+'" data-value="" value="" data-instance="multiple" name="'+def.fieldName+'" class="form-control '+def.fieldName+' '+ controls.getClass(def) + ' everycombo-input input-sm" />';
					c+="</div>"
				c+='</div>';
				return c			
			},
			submitButton:function() {
				 
				// var htm='<td width="50%" class="control-right">';
				var htm='<div class="form-group">';
				htm+='<button type="button" class="btn btn-primary formlet-insert-formdata" >Save</button>';		
				htm+='</div>';
				return htm			
			},
			selectControlLeft:function(def) {
				var htm='<table class="form-table"><tr><td width="50%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions='<option value="">select '+def.fieldHeading+'</option>'+ controls.arrayToOptions(def);
				htm+='<select type="text" value="" id="'+def.fieldName+'"  name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
				htm+='</div></td>';
				return htm			
			},
			selectControlRight:function(def) {
				var htm='<td width="50%" class="control-right">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions='<option value="">select '+def.fieldHeading+'</option>'+ controls.arrayToOptions(def);
				htm+='<select type="text" value="" id="'+def.fieldName+'"  name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
				htm+='</div></td></tr></table>';
				return htm			
			},
			selectControlLeftMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var htm='<table class="form-table"><tr>';
				htm+='<td width="'+fldWidth+'%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions='<option value="">select '+def.fieldHeading+'</option>'+ controls.arrayToOptions(def);
				htm+='<select type="text" value="" id="'+def.fieldName+'" name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
				htm+='</div></td>';
				return htm			
			},
			selectControlMiddleMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var htm='<td width="'+fldWidth+'%" class="control-middle">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions='<option value="">select</option>'+ controls.arrayToOptions(def);
				htm+='<select type="text" value="" id="'+def.fieldName+'"  name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
				htm+='</div></td>';
				return htm			
			},
			selectControlRightMultiple:function(def) {
				var fldWidth=controls.getSize(def);
				var htm='<td width="'+fldWidth+'%" class="control-right">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var selectOptions='<option value="">select</option>'+ controls.arrayToOptions(def);
				
				htm+='<select type="text" value="" id="'+def.fieldName+'"   name="'+def.fieldName+'" class="form-control input-sm '+controls.getClass(def)+'" >'+selectOptions+'</select>';		
				htm+='</div></td></tr></table>';
				return htm			
			},
			textAreaLeftMultiple:function(def) {
				var pData="";
				var fldWidth=controls.getSize(def);
				var htm='<table class="form-table"><tr>';
				htm+='<td width="'+fldWidth+'%" class="control-left">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var content=(pData=="") ? '' : pData;
				htm+='<textarea type="text" rows="'+controls.getLines(def)+'" value="'+content+'" class="form-control '+controls.getClass(def)+'"  id="'+def.fieldName+'" name="'+def.fieldName+'">'+content+'</textarea>';
				htm+='</div></td>';
				return htm			
			},
			textAreaMiddleMultiple:function(def) {
				var pData="";
				var fldWidth=controls.getSize(def);
				var htm='<td width="'+fldWidth+'%" class="control-middle">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var content=(pData=="") ? '': pData;
				htm+='<textarea type="text" rows="'+controls.getLines(def)+'" value="'+content+'" class="form-control"  id="'+def.fieldName+'" name="'+def.fieldName+'">'+content+'</textarea>';
				htm+='</div></td>';
				return htm			
			},
			textAreaRightMultiple:function(def) {
				var pData="";
				var fldWidth=controls.getSize(def);
				var htm='<td width="'+fldWidth+'%" class="control-right">';
				htm+='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var content=(pData=="") ? '': pData;
				htm+='<textarea type="text" rows="'+controls.getLines(def)+'" value="'+content+'" class="form-control"  id="'+def.fieldName+'" name="'+def.fieldName+'">'+content+'</textarea>';
				htm+='</div></td></tr></table>';
				return htm			
			},
			textArea:function(def) {
				var fieldClass=(def.hasOwnProperty("fieldClass")) ? def.fieldClass : "";
				var pData="";
				var htm='<div class="form-group-sm">';
				htm+='<label for="'+def.fieldName+'" class="">'+def.fieldHeading+'</label>';
				var content=(pData=="") ? '': pData;
				htm+='<textarea type="text" rows="'+controls.getLines(def)+'" value="'+content+'" class="form-control '+ fieldClass + '" id="'+def.fieldName+'" name="'+def.fieldName+'">'+content+'</textarea>';
				htm+='</div>';
				return htm			
			},
			arrayToOptions:function(controlDef) {
				var optionHTML='';
				var def=controlDef;
				var opts=[];
				var optSource= (def.hasOwnProperty("optionSourceType")) ? def.optionSourceType : "value";
				switch(optSource) {
					case "value":
						if (def.hasOwnProperty("selectOptions")) {
							if (def.hasOwnProperty('specialClass')) {
								optionHTML=def.selectOptions;
							} else {
							opts=def.selectOptions;		
							for (var a=0;a<opts.length;a++) {
								optionHTML+='<option value="'+opts[a]+'">' + opts[a] + '</options>';					
							}
							}
						}
						break;
					case "sql":
						optionHTML=controls.getRemoteOptions(def);
						optionHTML+='<option value="n/a">n/a</options>';	
						break;
					default:
						optionHTML='<option value="0">No options available</options>';
						break;
				}

				return optionHTML;				
			},
			getRemoteOptions:function(controlDef) {
				var opts=[];
				var optData;
				var optionHTML="";
				var def=controlDef;
				
				if (rapidControls.rcFormlet.getState(def.fieldName)!="") {
					optData=rapidControls.rcFormlet.getState(def.fieldName);	
					if (def.specialClass!="every-multi-combo") {
					for (var a=0;a<optData.length;a++) {
							optionHTML+='<option value="'+optData[a].OPTIONVALUE+'">' + optData[a].OPTIONNAME + '</options>';					
						}
					}
				} else {
					if (def.hasOwnProperty("optionSource")) {
						rapidControls.dataControl.retriever.getSql(def.optionSource,function(data) {
						var optData2=data;
						rapidControls.rcFormlet.setState(def.fieldName,optData2);
						if (def.hasOwnProperty("indexAs")) {
							rapidControls.rcFormlet.setState(def.indexAs,optData2);
						}
						if (!def.hasOwnProperty("specialClass")) {
							if (def.specialClass!="every-multi-combo") {
								for (var a=0;a<optData2.length;a++) {
									optionHTML+='<option value="'+optData2[a].OPTIONVALUE+'">' + optData2[a].OPTIONNAME + '</options>';					
								}
							}
						}
						})
						return optionHTML
					}
				}				
				return optionHTML;
			},
			getLines:function(def) {
				var tLines=(def.hasOwnProperty("lineCount")) ? def.lineCount : "3";
				return tLines;
			},
			getSize:function(def) {
				var fldNumb=(def.hasOwnProperty("numberOnLine")) ? def.numberOnLine : "2";
				var tSize=parseInt(100/fldNumb)-1;
				return tSize;
			},
			pluckArray:function(pKey,pArray) {
				var newArray=[];
				for (var i=0;i<pArray.length;i++) {
					newArray.push(pArray[pKey]);			
				}
				return newArray
			},
			getClass:function(def) {
				var retState= (def.hasOwnProperty("specialClass")) ? def.specialClass : "";
				return retState
			}
			}
			var buildFunctions={
			buildInputControls:function(pItemSchema) {  // loops through all item types in schema and builds form inputs for each one
				var iSchema=pItemSchema;
				var def=iSchema
				var inputControls=iSchema.fields;
				var htm='';
				for (i=0;i<inputControls.length;i++) {
					var curControl=inputControls[i];
					if (curControl.formInclude=="true") {
						htm+=controls[curControl.controlType](curControl);
					}
				}
				// htm+=controls.submitButton();				
				return htm;
			},
			assembleForm:function(pSchema,pItemInputs) {
				var def=pSchema;
				var htm='<div class="container-fluid"><div class="row"><div class="col-lg-12 col-md-12 col-sm-12">';
				htm+='<form class="form input-form" name="' + def.tableName + '" id="'+def.tableName+'" action="javascript:void(0);">';
				// htm+='<div class="list-group">';
				htm+=pItemInputs;
				htm+='</form></div><div></div>';		
				return htm
			}

	}
var getOps=function(def) {
	var ops=controls.arrayToOptions(def);
	return ops;
}
	var buildForm=function(pSchema) {	
		var schema=pSchema;
		var contentItems=buildFunctions.buildInputControls(schema);
		var htm=buildFunctions.assembleForm(schema,contentItems);
		return htm;
	}
					
				return {
					activate:activate,
					loadRecord:loadRecord,
					getState:getState,
					setState:setState,
					getOps:getOps
				}	
			
			})();
