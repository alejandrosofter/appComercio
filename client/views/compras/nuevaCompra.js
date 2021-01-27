
var calcularImporteParcial=function(){
	var res= ($("#item_cantidad").val()*1)* ($("#item_importe").val()*1);
	return res.toFixed(2);
};
var calcularImporteTotalCompra=function(){
	var sum=0;
       	$.each( itemsCompra.list(), function( key, value ) {
					sum+=value.total*1;
				});
	
	return sum;
};
var estaCargado=function(aux){
	$.each( itemsCompra.list(), function( key, value ) {
		var item=itemsCompra[key];
		if(item.codigo===aux.codigo)return true;
	});
	return false;
};
var datosValidos=function(aux){
	if(aux.cantidad==="")return false;
	if(aux.detalle==="")return false;
	if(aux.importe==="")return false;
	if(estaCargado(aux))return false;
	return true;
	};
var resetCarga=function(){
	$("#item_codigo").val("");
		$("#item_cantidad").val("");
		$("#item_detalle").val("");
		$("#item_importe").val("");
		$("#item_porcentajeDescuento").val("");
		$("#fecha").val(moment().format("YYYY-MM-DD"));
 $("#razonSocial").focus();
	
};

var getReferencia=function(){
	var d = new Date();
return d.getTime();
};
var nombreError=function(aux){
	if(aux.cantidad==="")return "Falta CANTIDAD!";
	if(aux.detalle==="")return "Falta DETALLE!";
	if(aux.importe==="")return "Falta IMPORTE!";
	if(estaCargado(aux))return "El item ya esta cargado con el mismo codigo!";
	return "";
	};
var buscarPosicion=function(ref){
	var sal=null;
	$.each( itemsCompra.array(), function( key, value ) {
		if(value.referencia===ref)sal= key;
	});
	return sal;
};
var quitarItem=function(ref){
	var pos=buscarPosicion(ref);
	itemsCompra.splice(pos,1);
};
 agregarItem=function(data){
	var totalAux=calcularImporteParcial();
		var impAux=$("#item_importe").val()*1;
		var aux={importe:impAux,total:totalAux,referencia:getReferencia(),codigo:$("#item_codigo").val(),porcentajeDescuento:$("#item_porcentajeDescuento").val(),idProducto:$("#item_idProducto").val(),cantidad:$("#item_cantidad").val(),detalle:$("#item_detalle").val()};
		if(data)aux=data;
		if(datosValidos(aux)){
			contador.set(contador.get()+1);
			itemsCompra.push(aux);
			resetCarga();
		}
			
		else swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados.. hay datos que estan faltando: "+nombreError(aux), "error");
};
var getIndexItem=function(){
	var sal=null;
		$.each( itemsCompra.list(), function( key, value ) {
			if(referenciaModifica.get()==value.referencia)sal= key;
		});
	return sal;
};
var modificaItem=function(ref){
	var totalAux=calcularImporteParcial();
	quitarItem(ref);
	var aux={importe:$("#item_importe").val(),total:totalAux,referencia:ref,codigo:$("#item_codigo").val(),porcentajeDescuento:$("#item_porcentajeDescuento").val(),idProducto:$("#item_idProducto").val(),cantidad:$("#item_cantidad").val(),detalle:$("#item_detalle").val()};

	if(datosValidos(aux)){
		for(var i=0;i<itemsCompra.length;i++)
			if(itemsCompra[i].referencia==ref)itemsCompra[i]=aux;
		resetCarga();
		$("#botonCarga").show();
		$("#botonModifica").hide();
	}
			
		else swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados.. hay datos que estan faltando: "+nombreError(aux), "error");
};
AutoForm.hooks({
	
  'nuevaCompra_': {
    before:{
      insert: function(doc) {
				doc.estado="INGRESADO";
				doc.items=itemsCompra.array();
				doc.importeTotal=calcularImporteTotalCompra()*1;
				console.log(doc);
        return doc;
              }
    },
    onSuccess: function(operation, result, template) {
      swal("GENIAL!", "Se ha ingresado la compra!", "success");
			resetCarga();
			console.log(this.insertDoc)
			if(this.insertDoc.estaPago){
				var elem={idPago:this.insertDoc._id,importe:this.insertDoc.importeTotal,idCuenta:this.insertDoc.idCuenta,fecha:this.insertDoc.imputaPago};
				Meteor.call("ingresarPagoCompra",elem,function(res){
					console.log(res)
				})
			}else{
				this.insertDoc.importeTotal
				var elem=this.insertDoc;
				elem._id=this.docId;
				elem.importe=this.insertDoc.importeTotal;
				elem.interes=0;
				var dataPago={tipo:"Compras",datos:elem};
				Modal.show("nuevoPagoVario",function(){ return dataPago; });
				 $("#nuevoPagoVarioModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open');	 $('.modal-backdrop').remove();});
			}
			
			itemsCompra.clear();
    },
    onError: function(operation, error, template) {
				//$("#formulario").show("slow");
						
    //  swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  },
  'nuevoGasto_': {
    // before:{
    //   insert: function(doc) {
				// doc.estado="INGRESADO";
				// doc.items=itemsCompra.array();
				// doc.importeTotal=calcularImporteTotalCompra()*1;
				// console.log(doc);
    //     return doc;
    //           }
    // },
    onSuccess: function(operation, result, template) {
      
			if(callbackSuccess)callbackSuccess(this.idEntidad);
			var act=this.insertDoc;
			act._id=this.docId;
			var tieneItems=this.insertDoc.tieneItems;
			console.log(tieneItems,act)
			if(this.insertDoc.estaPagado){
				
				var elem={idPago:this.docId,importe:this.insertDoc.importeTotal,idCuenta:this.insertDoc.idCuenta,fecha:this.insertDoc.imputaPago};
				Meteor.call("ingresarPagoCompra",elem,function(res){
					Modal.hide();
					swal("GENIAL!", "Se ha ingresado el gasto!", "success");
					if(tieneItems){
						setTimeout(function(){
				 Modal.show("verItemsCompras",function(){ return act; });
				}, 500);
					}
					
				})

			}else{
				this.insertDoc.importeTotal
				var elem=this.insertDoc;
				elem._id=this.docId;
				elem.importe=this.insertDoc.importeTotal;
				elem.interes=0;
				var dataPago={tipo:"Compras",datos:elem};
				Modal.hide();
				if(tieneItems)Modal.show('verItemsCompras',function(){ return act; });
				setTimeout(function(){
				 Modal.show("nuevoPagoVario",function(){ return dataPago; });
				}, 500);
			}
		
			
			
			
    },
    onError: function(operation, error, template) {
				//$("#formulario").show("slow");
						
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  },
  'modificarGasto_': {
    // before:{
    //   insert: function(doc) {
				// doc.estado="INGRESADO";
				// doc.items=itemsCompra.array();
				// doc.importeTotal=calcularImporteTotalCompra()*1;
				// console.log(doc);
    //     return doc;
    //           }
    // },
    onSuccess: function(operation, result, template) {
    	Modal.hide();
      swal("GENIAL!", "Se ha modificado el gasto!", "success");
			
			if(callbackSuccess)callbackSuccess();
			
			
    },
    onError: function(operation, error, template) {
				//$("#formulario").show("slow");
						
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  }
});
var callbackSuccess;
Template.nuevoGasto.rendered=function(){
	$("#fecha").val(moment().format("YYYY-MM-DD"));
	if(Meteor.user().profile.centroCosto){
		 $("#idCentroCosto").val(Meteor.user().profile.centroCosto);
		 $("#idCentroCosto").select2({allowClear: true,placeholder:"Seleccione centro de costo si lo desea..."}).trigger('change');
	}
	if(this.data.callback)callbackSuccess=this.data.callback;
}
Template.nuevoGasto.helpers({
	"idCentroDefault":function()
	{
		var cc=CentroCostos.find({moduloDefault: {$regex : ".*Compras.*"}}).fetch();
		if(cc.length>0)return cc[0]._id
	},

	"defaultCompra":function(){
		return {fecha:moment.format(),importe:0};
	},

	 
 
});
Template.nuevoGasto.events({
	"click #estaPagado":function()
	{
		if($("#estaPagado").prop("checked"))$("#detallePago").show();
		else $("#detallePago").hide();
		console.log("ap")
	},

	

	 
 
});
Template.nuevaCompra.helpers({
	"idCentroDefault":function()
	{
		var cc=CentroCostos.find({moduloDefault: {$regex : ".*Compras.*"}}).fetch();
		if(cc.length>0)return cc[0]._id
	},

	"settingsProducto":function(){
		
		return {
      position: "bottom",
      limit: 10,
      rules: [
				{
					token: '',
          collection: Productos,
          field: "nombreProducto",
          matchAll: false,
          template: Template.tmpProducto
        },
      ]
    };
	},
	"defaultCompra":function(){
		return {fecha:moment.format(),importe:0};
	},
	"seleccionItems":function(){
		return seleccionItems.get();
	},
	"itemsAux": function() {
       return itemsCompra.list();
 },
	"importeTotal": function() {
		var sum=calcularImporteTotalCompra();
		return sum.toFixed(2);
 },
	 
 
});
var cargarItemIndividual=function(valor,selector){
	var aux=null;
	var totalAux=calcularImporteParcial();
	var impAux=$("#item_importe").val()*1;
	if(itemsCompra[seleccionItems.get()]==null)
		{
			
			aux={importe:impAux,total:0,referencia:getReferencia(),codigo:$("#item_codigo").val(),cantidad:$("#item_cantidad").val(),porcentajeDescuento:$("#item_porcentajeDescuento").val(),detalle:$("#item_detalle").val()};
			aux.total=aux.cantidad*aux.importe;
			seleccionItems.set(seleccionItems.get()+1);
			
			
			
		}else{
			aux=itemsCompra[seleccionItems.get()];
			aux[selector]=$("#item_"+selector).val();
			aux.total=aux.cantidad*aux.importe;
			
			quitarItem(aux.referencia);
			console.log(aux);
		}
	aux.total=aux.total.toFixed(2);
	itemsCompra.push(aux);
	
	$("#item_"+selector).val("");
	$("#item_"+selector).focus();
	
};
Template.nuevaCompra.events({
	"autocompleteselect #item_detalle": function(event, template, doc) {
			$("#item_idProducto").val(doc._id);
  },
	"keyup #item_cantidad":function(ev){
		
		$("#item_total").html("$ "+calcularImporteParcial());
			if(ev.keyCode==120)cargarItemIndividual($("#item_cantidad").val(),"cantidad"); //120 == F9
	},
	"keyup #item_detalle":function(ev){
		if(ev.keyCode==120)cargarItemIndividual($("#item_detalle").val(),"detalle");
	},
	"keyup #item_codigo":function(ev){
		
		if(ev.keyCode==120)cargarItemIndividual($("#item_codigo").val(),"codigo");
		
	},
	"keyup #item_porcentajeDescuento":function(ev){
		
		if(ev.keyCode==120)cargarItemIndividual($("#item_porcentajeDescuento").val(),"porcentajeDescuento");
		
	},
	"keyup #item_importe":function(ev){
		ev.preventDefault();
		console.log(ev.keyCode);
		$("#item_total").html("$ "+calcularImporteParcial());
		if(ev.keyCode==120)cargarItemIndividual($("#item_importe").val(),"importe");
	},
	
	"click #botonCarga":function(ev){
		agregarItem();
	},
	"click .fila":function(ev){
		var pos=buscarPosicion(this.referencia);
		console.log(this.referencia+"pos:"+pos);
		seleccionItems.set(pos);
		
	},
	"click #botonModifica":function(ev){
		modificaItem(referenciaModifica.get());
	},
	"change #fecha":function(ev){
		console.log(new Date($("#fecha").val()))
	},
	"click #quitar":function(ev){
		ev.preventDefault();
		var referencia=this.referencia;
		swal({   title: "Estas Seguro de quitar el item?",   text: "Una vez que lo has quitado lo puede volver a cargar!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ quitarItem(referencia); });
	
	},
	"click #modificar":function(ev){
		ev.preventDefault();
		console.log(this)
		var referencia=this.referencia*1;
		$("#item_codigo").val(this.codigo);
		$("#item_cantidad").val(this.cantidad);
		$("#item_detalle").val(this.detalle);
		$("#item_importe").val(this.importe);
		$("#item_porcentajeDescuento").val(this.porcentajeDescuento);
		referenciaModifica.set(referencia);
		$("#botonCarga").hide();
		$("#botonModifica").show();
	},
});
Template.nuevaCompra.rendered = function() {
resetCarga()
};
Template.nuevaCompra.created = function() {

  itemsCompra = new ReactiveArray();
	contador = new ReactiveVar();
	referenciaModifica = new ReactiveVar();
	seleccionItems = new ReactiveVar();
	seleccionItems.set(0);
	referenciaModifica.set(null);
	contador.set(0);
	import '/imports/vozNuevaCompra';
};