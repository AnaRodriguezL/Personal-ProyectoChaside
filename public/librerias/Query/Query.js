var Query 		= new Object();
var QueryForm = new Object();

Query.callAjax = function(route,tipo,datos,successEvent,errorEvent){
	//var data = window.btoa(data);
	$.ajax({
		url: urlConexion+route, //variable definida en el index
		type: tipo,
		dataType: 'text',
		async: true,
		data: datos,
		error:function(objeto1,objeto2,objeto3){			
			//console.log(objeto1.toString());
			//alert(JSON.stringify(objeto1));
			//console.log(objeto2.toString());
			//alert(JSON.stringify(objeto2));
			//console.log(objeto3.toString());
			//alert(JSON.stringify(objeto3));
			errorEvent("Error en la conexi&oacute;n");
		},
		timeout:600000,  // I chose 5 secs for kicks
		success: function (data){
			//alert(data);
			var datas=data.replace('<?xml version="1.0" encoding="utf-8"?>','').replace('<string xmlns="http://tempuri.org/">','').replace('</string>','');
			var response= JSON.parse(datas);
			if(response.STATE == "TRUE"){
				successEvent(response.RESULT);
			}else{
				errorEvent(response.MESSAGE);
			}
		}
	});
}

QueryForm.callAjax = function(route,tipo,datos,successEvent,errorEvent){
	//var data = window.btoa(data);
	$.ajax({
		url: urlConexion+route, //variable definida en el index
		type: tipo,
		processData: false,
		contentType: 'multipart/form-data',
		contentType:false,
		async: true,
		data: datos,
		error:function(objeto1,objeto2,objeto3){			
			//console.log(objeto1.toString());
			//alert(JSON.stringify(objeto1));
			//console.log(objeto2.toString());
			//alert(JSON.stringify(objeto2));
			//console.log(objeto3.toString());
			//alert(JSON.stringify(objeto3));
			errorEvent("Error en la conexi&oacute;n");
		},
		timeout:600000,  // I chose 5 secs for kicks
		success: function (data){
			//alert(data);
			var response= data;//JSON.parse(data);

			if(response.STATE == "TRUE"){
				successEvent(response.RESULT);
			}else{
				errorEvent(response.MESSAGE);
			}
		}
	});
}
