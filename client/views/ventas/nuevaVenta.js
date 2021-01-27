var resetForm = function() {
	console.log("RESET")
	itemsVenta.clear();
	seleccionItems.set(0);
	referenciaModifica.set(null);
	contador.set(0);
	Session.set("importeTotal",0);
	$("#vistaItems").show("slow");
	$("#vistaDatos").hide();
	var fe=new Date();
	var d=moment().format("YYYY-MM-DD");
  $("#fecha").val(d);
	$("#buscador").focus();
	
};
var lpad=function(data,length){
	return (data.toString().length < length) ? lpad(" "+data, length):data;
}
var rpad=function(data,length){
	return (data.toString().length < length) ? rpad(data+" ", length):data;
}
var imprimeLinea=function(data){
var length=40;
	
	return rpad(data,length)
}
var imprimeLineaItem=function(data,separador){
	console.log(data)
	var aux="";
	aux+=rpad(data.cantidad,5);
	aux+=rpad(data.nombreProducto.substring(1, 25),25);
	var total=data.precioVenta*data.cantidad;
	aux+=rpad("$ "+total.toFixed(2),10);
	aux+=separador;
	return aux
}
var imprimirRecivo=function()
{
	var res=Settings.findOne({"clave":"nombreEmpresa"});
	var salida='';
	var separador="i\n"
	if(res) salida+= imprimeLinea("<b><big>"+res.valor+"</big></b>")+separador
// 	salida+=rpad("CANT.",5);
// 	salida+=rpad("PRODUCTO",25);
// 	salida+=rpad("IMPORTE",10);
	salida+=separador;
	var acu=0;
	$.each(itemsVenta.array(), function(key, value) {
		acu+=value.precioVenta;
		 salida+= imprimeLineaItem(value,separador)
	})
	salida+=rpad("",5);
	salida+=lpad("TOTAL  ",25);
	salida+=rpad("$ "+acu.toFixed(2),10);
	salida+=separador;
	$("#printRecivo").html(salida);
	$("#printRecivo").show();
	$("#printRecivo").printThis({importCss:false});
	//$("#printRecivo").hide();
	//$("#printRecivo").hide()
	console.log(salida)
}

var initForm=function(){
	itemsVenta = new ReactiveArray();
	contador = new ReactiveVar();
	referenciaModifica = new ReactiveVar();
	seleccionItems = new ReactiveVar();
	item = new ReactiveVar();
	AutoForm.addStickyValidationError("nuevaVentaFactura_");
	Session.set("importeTotal",0);
};
var calcularImporteParcial = function(aux) {
	var sum = 0;

	$.each(itemsVenta.array(), function(key, value) {
		sum += (value.precioVenta * (1 * value.cantidad)) - value.bonificacion;
	});
	return (sum);
};
var calcularImporteTotal = function(aux) {
	
	//----
	var sum = calcularImporteParcial();
	var bonif =  Number($("#bonificacion").val());
	var auxInte = Number($("#interes").val());
	
	if (isNaN(bonif)) bonif = 0;
	if (isNaN(auxInte)) auxInte = 0;
	
	var res=Number(sum - bonif + auxInte);
console.log(res)
	Session.set("importeTotal",res);
	
	var auxPaga=($("#pagoEfectivo").val()*1)+($("#pagoCredito").val()*1)+($("#pagoDebito").val()*1)-bonif+auxInte;
		Session.set("importePaga",auxPaga);
	return res;
};
var getReferencia = function() {
	var d = new Date();
	var ran = Math.floor((Math.random() * 100) + 1);
	return d.getTime() + ran;
};
var estaCargado = function(aux) {
	$.each(itemsVenta.list(), function(key, value) {
		var item = itemsVenta[key];
		if (item.codigo === aux.codigo) return true;
	});
	return false;
};   
   
var datosValidos = function(aux) {
	if (aux.cantidad === "") return false;
	if (aux.detalle === "") return false;
	if (aux.importe === "") return false;
	if (estaCargado(aux)) return false;
	return true;
};
var resetCarga = function() {
	$("#item_cantidad").val("");
	$("#item_detalle").val("");
	$("#item_importe").val("");
	$("#producto").val("");
	$("#interes").val("");
	$("#item_codigoBarras").val("");
	$("#producto").focus();
};
var nombreError = function(aux) {
	if (aux.cantidad === "") return "Falta CANTIDAD!";
	if (aux.detalle === "") return "Falta DETALLE!";
	if (aux.importe === "") return "Falta IMPORTE!";
	return "";
};
var buscarPosicion = function(ref) {
	var sal = null;
	$.each(itemsVenta.array(), function(key, value) {
		if (value.referencia === ref) sal = key;
	});
	return sal;
};
var getImporteTotal = function(ref) {
	var sum = 0;
	$.each(itemsVenta.array(), function(key, value) {
		sum += value.importe * 1;
	});
	return sum;
};
var quitarItem = function(ref) {
	var pos = buscarPosicion(ref);
	itemsVenta.splice(pos, 1);
};
var getItem = function(ref) {
	var pos = buscarPosicion(ref);
	return itemsVenta.array()[pos];
};
var getPrecioVenta=function(data)
{
	console.log(data)
	var cuenta=Cuentas.findOne({_id:$("#idCuenta").val()});
	var precioVenta=data.precioCompra*((data.porcentajeGanancia/100)+1)*((cuenta.interesEnPago/100)+1);
    var redondeaDecena=Number(Settings.findOne({clave:"redondeaDecena"}).valor);
    precioVenta=Math.round(precioVenta / redondeaDecena)*redondeaDecena;
    return precioVenta;
}
var agregarItem = function(data) {
	var aux = {
		precioVenta: data.precioVenta?data.precioVenta:getPrecioVenta(data),
		referencia: data.referencia,
		cantidad: data.cantidad,
		nombreProducto: data.nombreProducto,
		bonificacion: data.bonificacion,
		idProducto: data._id
	};
	console.log(aux)
	contador.set(contador.get() + 1);
	itemsVenta.push(aux);
	resetCarga();


};
var modificaItem = function(ref, campo, valor) {
	//	var itemAux=getItem(ref);
	//quitarItem(ref);
	//itemAux[campo]=valor;
	//agregarItem(itemAux);
	var pos = buscarPosicion(ref);
	itemsVenta.array()[pos][campo] = valor;
	itemsVenta.sort();
	calcularImporteTotal()
};

AutoForm.hooks({

	'nuevaVentaFactura_': {
		
		before: {
			insert: function(doc) {
				console.log("ANTES")
				doc.estado = "INGRESADO";
				doc.importe = calcularImporteTotal();
				doc.items = itemsVenta.array();
				if(doc.idEntidad===undefined){
					if($("#buscadorEntidad").val()===""){
						var def=Entidades.findOne({default:true});
						doc.idEntidad=def._id;
					}else{
						var dataEntidad={razonSocial:$("#buscadorEntidad").val(),nroDocumento:$("#dniCliente").val(),telefono:$("#telefonoCliente").val(),email:$("#emailCliente").val(),default:false};
						var id=Entidades.insert(dataEntidad);
						
						doc.idEntidad=id;
					}
					
				}
				
				return doc;
			}
		},
	
		onSuccess: function(operation, result, template) {
			UIBlock.unblock();
			//swal("GENIAL!", "Se ha ingresado la venta!", "success");
			var elem=this.insertDoc;
			elem._id=this.docId;
			if(Session.get("pedidoSeleccion")){
				Pedidos.update({_id:Session.get("pedidoSeleccion")._id},{$set:{estado:"FACTURADO"}});
			}
			var dataPago={tipo:"Ventas",datos:elem};
			Meteor.call("descontarStock",elem.items,function(err,res){ console.log("items descontads") });
			Modal.show("nuevoPagoVario",function(){ return dataPago; });
			$("#nuevoPagoVarioModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open');	 $('.modal-backdrop').remove();});
			if(elem.tipoComprobante=="FACTURA_ELECTRONICA"){resetForm();Router.go('/facturar/'+this.docId);}
			
			if(elem.imprimeComprobante){imprimirRecivo();resetForm(); }
			else resetForm()
			

		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});


var crearExp = function(searchText) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	return new RegExp("(" + parts.join('|') + ")", "ig");
}


Template.itemsVenta.helpers({
	"click #buscaIgual":function(ev){
		console.log(this)
	}
})
Template.itemsVenta.helpers({
	"importeParcial": function() {
		var valor = (this.cantidad * this.precioVenta) - this.bonificacion;
		return valor.toFixed(2);
	}
});
function agregarItemsPedido()
{
	var arr=Session.get("pedidoSeleccion")?Session.get("pedidoSeleccion").productos:[];
	
	for(var i=0;i<arr.length;i++){
		
		var prod=Productos.findOne({_id:arr[i].idProducto});
		var aux={
			precioVenta: arr[i].importe,
		referencia: "",
		cantidad: arr[i].cantidad,
		nombreProducto: prod?prod.nombreProducto:"-",
		bonificacion:0,
		idProducto: arr[i].idProducto}
		agregarItem(aux)
	}
}
Template.nuevaVenta.rendered=function(){
 Meteor.subscribe('Productos');
  Meteor.subscribe('Pedidos');
if(Session.get("pedidoSeleccion")){

	$("#imprimeRecivo").prop("checked",true);
	var clienteDefault=Entidades.findOne({_id:Session.get("pedidoSeleccion").idEntidad});
	Session.set("clienteDefault",clienteDefault);
	$("#seleccionaEntidad").addClass("form-group");
	$("#pagoEfectivo").val(0)
	$("#idEntidad").val(Session.get("pedidoSeleccion").idEntidad)
	$("#pagoCredito").val(0)
	$("#pagoDebito").val(0)
}else{
	$("#imprimeRecivo").prop("checked",true);
	var clienteDefault=Entidades.findOne({"default":true});
	Session.set("clienteDefault",clienteDefault);
	$("#seleccionaEntidad").addClass("form-group");
	$("#pagoEfectivo").val(0)
	$("#idEntidad").val(clienteDefault._id)
	$("#pagoCredito").val(0)
	$("#pagoDebito").val(0)
}
	
	resetForm();
}
Template.nuevaVenta.onRendered(function(){

	

})
Template.editarVenta.onRendered(function(){
	$("#imprimeRecivo").prop("checked",true);
	$("#seleccionaEntidad").addClass("form-group");
	
	console.log(this)
	

})
Template.nuevaVenta.helpers({
	'defectoCuenta':function()
	{
		var cta=Cuentas.findOne({default:true});
		console.log(cta)
		if(cta)return cta._id;
		return null
	},
	"doc":function(){
		console.log(this)
		return this.data
	},
	"idCentroDefault":function()
	{
		var cc=CentroCostos.find({moduloDefault: {$regex : ".*Compras.*"}}).fetch();
		if(cc.length>0)return cc[0]._id
	},
	"labImporteEfectivo":function(){
	
		return Session.get("importeTotal");
	},
	"labImporteTarjeta":function(){
		return "$"+ Number($("#pagoCredito").val()+$("#pagoDebito").val());
	},
	"nombreEntidad":function(){
	var def= Session.get("clienteDefault");
	if(def)return def.razonSocial;
	return "seleccione..."
	},
	"fechaActual": function() {
		var d=new Date();
		var fecha= d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
		console.log("fecha con:"+fecha);
		return d;
		
	},
	"importePaga": function() {
		var aux=($("#pagoEfectivo").val()*1)+($("#pagoCredito").val()*1)+($("#pagoDebito").val()*1);
		Session.set("importePaga",aux);
		return Session.get("importePaga").toFixed(2);
		
	},
"settingsEntidad": function() {

		return {
			position: "bottom",
			limit: 15,
			rules: [{
				token: '',
				collection: Entidades,
				field: "razonSocial",
				matchAll: false,
				selector: function(match) {
					var exp = crearExp(match);
					return {
						'$or': [{
							'razonSocial': exp
						}, {
							'email': exp
						}, {
							'telefono': exp
						}]
					};
				},
				template: Template.buscadorEntidades
			}, ]
		};
	},
	"settings": function() {
		return {
			position: "bottom",
			limit: 35,
			rules: [{
				token: '',
				collection: Productos,
				//subscription: 'autocompleteProductos',
				field: "codigoBarras",
				matchAll: false,
				selector: function(match) {
					//console.log(match)
					var cadBusca=new RegExp(match,"i")
					return {"$or":[{"nombreProducto":{"$in":[cadBusca]}},{"codigoBarras":{"$in":[cadBusca]}}]}
																	},
				template: Template.buscadorProductos
			}, ]
		};
	},
	

	"seleccionItems": function() {
		return seleccionItems.get();
	},
	"item": function() {
		return item.get();
	},
	"itemsAux": function() {
		return itemsVenta.list();
	},
	"cantidadItems": function() {
		return itemsVenta.array().length;
	},
	"importeInteresCredito":function(){
		var inte=Settings.findOne({clave:"interesCredito"});
		if(inte)return inte.valor;
		return "-"
	},
	"importeTotal": function() {
		return Session.get("importeTotal").toFixed(2);
	},



});
Template.editarVenta.helpers({
	"idCentroDefault":function()
	{
		var cc=CentroCostos.find({moduloDefault: {$regex : ".*Compras.*"}}).fetch();
		if(cc.length>0)return cc[0]._id
	},
	"labImporteEfectivo":function(){
	
		return Session.get("importeTotal");
	},
	"labImporteTarjeta":function(){
		return "$"+ Number($("#pagoCredito").val()+$("#pagoDebito").val());
	},
	"nombreEntidad":function(){
	var def= Session.get("clienteDefault");
	if(def)return def.razonSocial;
	return "seleccione..."
	},
	"fechaActual": function() {
		var d=new Date();
		var fecha= d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
		console.log("fecha con:"+fecha);
		return d;
		
	},
	"importePaga": function() {
		var aux=($("#pagoEfectivo").val()*1)+($("#pagoCredito").val()*1)+($("#pagoDebito").val()*1);
		Session.set("importePaga",aux);
		return Session.get("importePaga").toFixed(2);
		
	},
"settingsEntidad": function() {

		return {
			position: "bottom",
			limit: 15,
			rules: [{
				token: '',
				collection: Entidades,
				field: "razonSocial",
				matchAll: false,
				selector: function(match) {
					var exp = crearExp(match);
					return {
						'$or': [{
							'razonSocial': exp
						}, {
							'email': exp
						}, {
							'telefono': exp
						}]
					};
				},
				template: Template.buscadorEntidades
			}, ]
		};
	},
	"settings": function() {
		return {
			position: "bottom",
			limit: 35,
			rules: [{
				token: '',
				collection: Productos,
				//subscription: 'autocompleteProductos',
				field: "codigoBarras",
				matchAll: false,
				selector: function(match) {
					//console.log(match)
					var cadBusca=new RegExp(match,"i")
					return {"$or":[{"nombreProducto":{"$in":[cadBusca]}},{"codigoBarras":{"$in":[cadBusca]}}]}
																	},
				template: Template.buscadorProductos
			}, ]
		};
	},
	

	"seleccionItems": function() {
		return seleccionItems.get();
	},
	"item": function() {
		return item.get();
	},
	"itemsAux": function() {
		return itemsVenta.list();
	},
	"cantidadItems": function() {
		return itemsVenta.array().length;
	},
	"importeInteresCredito":function(){
		var inte=Settings.findOne({clave:"interesCredito"});
		if(inte)return inte.valor;
		return "-"
	},
	"importeTotal": function() {
		return Session.get("importeTotal").toFixed(2);
	},



});
var addVenta=function()
{
	
	//$("#nuevaVentaFactura_").submit()
	//else swal({ title: "Ops..", text: "Hay valores incorrectos! corrigelos y vuelve a intentar", type: "error"})
}
var checkPago = function() {
	console.log("CHECK PAGO");
	var sum = ($("#pagoEfectivo").val() * 1) + ($("#pagoCredito").val() * 1) + ($("#pagoDebito").val() * 1);
	if (sum != calcularImporteTotal())
		swal({
			title: "Estas Seguro?",
			text: "Si lo cargas asi, quedara una diferencia (deuda o credito)",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Si, ingresar!",
			closeOnConfirm: true
		}, function() {
			addVenta()
		});
	else addVenta()
};
var datosValidosFactura=function()
{
	if(itemsVenta.length>0)return true;
	return false
}
var checkEntidad = function() {
	if ($("#buscadorEntidad").val() === "")
		swal({
			title: "Estas Seguro?",
			text: "Si lo cargas asi, quedara como CONS. FINAL",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Si ingresar!",
			closeOnConfirm: true
		}, function() {
			checkPago();
		});
	else checkPago();


}
var ingresarVenta = function() {

// 	AutoForm.debug()
// 	var esValido=AutoForm.getValidationContext("nuevaVentaFactura_").isValid();
// 	esValido=AutoForm.validateForm("nuevaVentaFactura_");
// 	var datos={};
// 	console.log(esValido)
// 	if(esValido){
// 		UIBlock.block('Agregando venta..');
// 		Meteor.call("ingresarVenta",itemsVenta.array(),datos,function(err,res){
// 		UIBlock.unblock();
// 	});
// 	}
// 	else{
// 		AutoForm.addStickyValidationError("nuevaVentaFactura_")
// 			swal({
// 			title: "Opss...",
// 			text: "Hay algo mal, chequea los campos y vuelve a intentar.",
// 			type: "error"
// 			});
// 	}
	UIBlock.block('Agregando venta..');
	$("#nuevaVentaFactura_").submit()
};

var cambiaPago = function() {
	$("#pagoEfectivo").val(calcularImporteTotal());
	$("#pagoCredito").val(0);
	$("#pagoDebito").val(0);
	var aux=($("#pagoEfectivo").val()*1)+($("#pagoCredito").val()*1)+($("#pagoDebito").val()*1);
  Session.set("importePaga",aux);
};
var cantidadSeleccion = null;
var bonificacionSeleccion = null;
var precioSeleccion = null;
var detalleSeleccion = null;
Template.nuevaVenta.events({

"click #entidad":function()
	{
	$("#seleccionaEntidad").show("slow");
	$("#entidad").hide("slow");
//		Modal.show('seleccionarEntidad',function(){  });
//		$("#modalEntidad").on("hidden.bs.modal", function () {
//    $('body').removeClass('modal-open');	
//$('.modal-backdrop').remove();
//});
	},
	"focusout #buscadorEntidad":function()
	{
		$("#seleccionaEntidad").hide("slow");
		$("#entidad").show("slow");
	},
"click #tipoFactura":function(ev){
$("#tipoComprobante").val("FACTURA_ELECTRONICA")
},
"click #tipoLocal":function(ev){
$("#tipoComprobante").val("LOCAL")
},

"click #btnPagoEfectivo":function()
	{
		$("#seleccionaPagoEfectivo").show("slow");
		$("#pagoEfectivo").focus();
		$("#btnPagoEfectivo").hide("slow");
		
	},
	"focusout #seleccionaPagoTarjeta":function()
	{
		$("#seleccionaPagoTarjeta").hide("slow");
		$("#btnPagoTarjeta").show("slow");
	},	
"click #btnPagoTarjeta":function()
	{
		$("#seleccionaPagoTarjeta").show("slow");
		$("#pagoCredito").focus();
		$("#btnPagoTarjeta").hide("slow");
		
	},
	"click #nuevaEntidad":function()
	{
		$("#telefonoCliente").val("");
		$("#emailCliente").val("");
		$("#idEntidad").val("");
		$("#buscador").focus();
	},
	"click #imprimirRecivo":function()
	{
		$("#printRecivo").printThis({importCss:false});
	},
	"autocompleteselect #buscador": function(event, template, doc) {
		$("#buscador").val("");
		doc.cantidad = 1;
		doc.bonificacion = 0;
		
		doc.referencia = getReferencia();
		agregarItem(doc);
		var importe=calcularImporteTotal();
		$("#pagoEfectivo").val(importe);
		$("#buscador").focus();
	},
	"autocompleteselect #buscadorEntidad": function(event, template, doc) {
		$("#seleccionaEntidad").hide("slow");
		$("#entidad").show("slow");
		
		$("#idEntidad").val(doc._id)
		Session.set("clienteDefault",doc);
	},
	"change .importePaga": function(event, template, doc) {
		var aux=($("#pagoEfectivo").val()*1)+($("#pagoCredito").val()*1)+($("#pagoDebito").val()*1);
		Session.set("importePaga",aux);
	},
	"click #imprimeRecivo":function()
	{
		var imprimir=$( "#imprimeRecivo" ).context.activeElement.checked;
		console.log(imprimir)
	},
	"click [data-schema-key=formaPago]": function(event, template, doc) {
		var importe=0
		if(template.$(event.target).val()=="CREDITO"){
			var inte=Settings.findOne({clave:"interesCredito"});
			var porcentaje=0.1; //10 %
			if(inte)porcentaje=inte.valor/100;
			
			var interes=(calcularImporteParcial()*porcentaje).toFixed(2);
			$("#interes").val(interes);
			importe=calcularImporteTotal();
			$("#pagoCredito").val(importe.toFixed(2));
			$("#pagoEfectivo").val(0);
			$("#pagoDebito").val(0);
		}
		
		if(template.$(event.target).val()=="DEBITO"){
			$("#pagoCredito").val(0);
			$("#pagoEfectivo").val(0);
			$("#interes").val(0);
			importe=calcularImporteTotal();
			$("#pagoDebito").val(importe.toFixed(2));
			
		}
			
		if(template.$(event.target).val()=="EFECTIVO"){
			$("#pagoCredito").val(0);
			
		
			$("#pagoDebito").val(0);
			$("#interes").val(0);
			importe=calcularImporteTotal();
				$("#pagoEfectivo").val(importe.toFixed(2));
		}	
		calcularImporteTotal()
	},
	
	"keyup #cant_temp": function(ev) {
		if (ev.keyCode == 13) {
			var valor = $("#cant_temp").val();
			modificaItem(this.referencia, "cantidad", valor);
			$("#cant_temp").remove();
			$("#cantidad_" + this.referencia).show();
			cantidadSeleccion = null;
			cambiaPago();
		}
	},
	"keyup #bonif_temp": function(ev) {

		if (ev.keyCode == 13) {
			var valor = $("#bonif_temp").val();

			modificaItem(this.referencia, "bonificacion", valor);
			$("#bonif_temp").remove();
			$("#bonificacion_" + this.referencia).show();
			bonificacionSeleccion = null;
			cambiaPago();
		}
	},
	"keyup #bonificacionGeneral": function(ev) {

		if (ev.keyCode == 13) {
			var valor = $("#bonif_temp").val();

			modificaItem(this.referencia, "bonificacion", valor);
			$("#bonif_temp").remove();
			$("#bonificacion_" + this.referencia).show();
			bonificacionSeleccion = null;
			cambiaPago();
		}
	},
	"keyup #precio_temp": function(ev) {

		if (ev.keyCode == 13) {
			var valor = $("#precio_temp").val();

			modificaItem(this.referencia, "precioVenta", valor);
			$("#precio_temp").remove();
			$("#importe_" + this.referencia).show();
			precioSeleccion = null;
			cambiaPago();
		}
	},
	"keyup #detalle_temp": function(ev) {

		if (ev.keyCode == 13) {
			var valor = $("#detalle_temp").val();

			modificaItem(this.referencia, "nombreProducto", valor);
			$("#detalle_temp").remove();
			$("#detalle_" + this.referencia).show();
			detalleSeleccion = null;
			cambiaPago();
		}
	},

	"click #botonCarga": function(ev) {
		agregarItem();
	},
	"click #btnVolver": function(ev) {
		calcularImporteTotal();
		$("#vistaDatos").hide();
		$("#vistaItems").show("slow");
	},
	"click #btnFinaliza": function(ev) {
		if(datosValidosFactura())
		ingresarVenta();
	else swal("Ops..","hay datos incorrectos en la factura, por favor chequee que tenga items y la fecha este bien","error");
	},
	"keyup #bonificacion": function(ev) {
		calcularImporteTotal();
		cambiaPago();
		itemsVenta.sort();
	},
	"keyup #interes": function(ev) {
		calcularImporteTotal();
		cambiaPago();
		itemsVenta.sort();
	},
	
	"click .cantidad": function(ev) {
		if (cantidadSeleccion == null) {
			var celda = $(ev.currentTarget);
			cantidadSeleccion = celda;
			$("#cantidad_" + this.referencia).hide();
			celda.append("<input id='cant_temp' autofocus style='width:40px' value='" + this.cantidad + "' type='text'>");
			$("#cant_temp").focus();
			$("#cant_temp").select();
			cambiaPago();
		}
	},
	"click .bonificacion": function(ev) {
		if (bonificacionSeleccion == null) {
			var celda = $(ev.currentTarget);
			bonificacionSeleccion = celda;
			$("#bonificacion_" + this.referencia).hide();
			celda.append("<input id='bonif_temp' autofocus style='width:60px' value='" + this.bonificacion + "' type='text'>");
			$("#bonif_temp").focus();
			$("#bonif_temp").select();
			cambiaPago();
		}
	},
	"click .detalle": function(ev) {
	
		if (detalleSeleccion == null) {
			var celda = $(ev.currentTarget);
			detalleSeleccion=celda;
			$("#detalle_" + this.referencia).hide();
			celda.append("<input id='detalle_temp' autofocus style='width:350px' value='" + this.nombreProducto + "' type='text'>");
			$("#detalle_temp").focus();
			$("#detalle_temp").select();
			cambiaPago();
		}

	},
	"click .importe": function(ev) {
		if (precioSeleccion == null) {
			var celda = $(ev.currentTarget);
			precioSeleccion = celda;
			$("#importe_" + this.referencia).hide();
			celda.append("<input id='precio_temp' autofocus style='width:60px' value='" + this.precioVenta + "' type='text'>");
			$("#precio_temp").focus();
			$("#precio_temp").select();
			cambiaPago();
		}

	},
	"click #quitar": function(ev) {
		ev.preventDefault();
		var referencia = this.referencia;
		swal({
			title: "Estas Seguro de quitar el item "+referencia+"?",
			text: "Una vez que lo has quitado lo puede volver a cargar!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Si, borralo!",
			closeOnConfirm: true
		}, function() {
			quitarItem(referencia);
			cambiaPago();
		});

	},
	"click #botonAceptar": function(ev) {
		if (calcularImporteTotal() > 0) {
			$("#vistaItems").hide();
			$("#vistaDatos").show("slow");
			cambiaPago();
		} else swal({
			title: "Ops...",
			text: "No has ingresado items! o bien el importe total es menor que CERO",
			type: "warning"
		}, function() {
			$("#buscador").focus();
		});


	},
});

Template.nuevaVenta.created = function() {
 
	initForm();
 setTimeout(function(){ agregarItemsPedido();calcularImporteTotal() }, 1000);	
};