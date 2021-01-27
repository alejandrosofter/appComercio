var getReferencia=function(){
	var d = new Date();
	var ran=Math.floor((Math.random() * 100) + 1);
return d.getTime()+ran;
};
var estaCargado=function(aux){
	$.each( itemsStock.list(), function( key, value ) {
		var item=itemsStock[key];
		if(item.codigo===aux.codigo)return true;
	});
	return false;
};
var datosValidos=function(aux){
		if(aux.codigo==="")return false;
	if(aux.cantidad==="")return false;
	if(aux.detalle==="")return false;
	if(aux.importe==="")return false;
	if(estaCargado(aux))return false;
	return true;  
	};
var resetCarga=function(){
	$("#item_codigoInterno").val("");
		$("#item_cantidad").val("");
		$("#item_detalle").val("");
		$("#item_importe").val("");
	$("#producto").val("");
	$("#item_codigoBarras").val("");
	$("#producto").focus();
};
var nombreError=function(aux){
		if(aux.codigoInterno==="")return "Falta COD.!";
	if(aux.cantidad==="")return "Falta CANTIDAD!";
	if(aux.detalle==="")return "Falta DETALLE!";
	if(aux.importe==="")return "Falta IMPORTE!";
	if(estaCargado(aux))return "El item ya esta cargado con el mismo codigo!";
	return "";
	};
var buscarPosicion=function(ref){
	var sal=null;
	$.each( itemsStock.array(), function( key, value ) {
		if(value.referencia===ref)sal= key;
	});
	return sal;
};
var getImporteTotal=function(ref){
	var sum=0;
	$.each( itemsStock.array(), function( key, value ) {
		sum+=value.importe*1;
	});
	return sum;
};
var quitarItem=function(ref){
	var pos=buscarPosicion(ref);
	itemsStock.splice(pos,1);
};
var agregarItem=function(){
		var impAux=$("#item_importe").val()*1;
		var aux={importe:impAux,referencia:getReferencia(),codigo:$("#item_codigoInterno").val(),codigoBarras:$("#item_codigoBarras").val(),cantidad:$("#item_cantidad").val(),detalle:$("#item_detalle").val()};
		if(datosValidos(aux)){
			contador.set(contador.get()+1);
			itemsStock.push(aux);
			resetCarga();
		}
			
		else swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados.. hay datos que estan faltando: "+nombreError(aux), "error");
};
var getIndexItem=function(){
	var sal=null;
		$.each( itemsStock.list(), function( key, value ) {
			if(referenciaModifica.get()==value.referencia)sal= key;
		});
	return sal;
};
var modificaItem=function(ref){
	var totalAux=($("#item_importe").val()*1)*($("#item_cantidad").val()*1);
	quitarItem(ref);
	var aux={importe:$("#item_importe").val(),total:totalAux,referencia:ref,codigo:$("#item_codigo").val(),cantidad:$("#item_cantidad").val(),detalle:$("#item_detalle").val()};
	console.log("MOD");
	console.log(aux);	
	if(datosValidos(aux)){
		agregarItem();
		$("#botonCarga").show();
		$("#botonModifica").hide();
	}
			
		else swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados.. hay datos que estan faltando: "+nombreError(aux), "error");
};

var cargarItemIndividual=function(valor,selector){
	var aux=null;
	var impAux=$("#item_importe").val()*1;
	var importeTotal=impAux*($("#item_cantidad").val()*1);
	if(itemsStock[seleccionItems.get()]==null)
		{
			
			aux={importe:impAux,total:importeTotal,referencia:getReferencia(),codigo:$("#item_codigo").val(),codigoBarras:$("#item_codigoBarras").val(),cantidad:$("#item_cantidad").val(),detalle:$("#item_detalle").val()};
			aux.total=aux.cantidad*aux.importe;
			seleccionItems.set(seleccionItems.get()+1);
			
			
			
		}else{
			aux=itemsStock[seleccionItems.get()];
			aux[selector]=$("#item_"+selector).val();
			aux.total=aux.cantidad*aux.importe;
			
			quitarItem(aux.referencia);
			console.log(aux);
		}
	aux.total=aux.total.toFixed(2);
	itemsStock.push(aux);
	
	$("#item_"+selector).val("");
	$("#item_"+selector).focus();
	
};
AutoForm.hooks({
	
  'modificarStock_': {
    before:{
      update: function(doc) {
				
				doc.$set.estado="INGRESADO";
				doc.$set.fecha=new Date();
				doc.$set.importe=getImporteTotal();
				doc.$set.items=itemsStock.array();
				$.each( itemsStock.array(), function( key, value ) {
            console.log(value);
            var producto=Productos.findOne({ codigoBarras: value.codigoBarras });
					  var nuevaCantidad=(producto.disponibilidad*1)+(value.cantidad*1);
	          Productos.update(producto._id,{$set:{disponibilidad:nuevaCantidad}});
            	modificarHistorial(producto._id,value,"MODIFICA STOCKEO");
				});
        return doc;
              }
    },
    onSuccess: function(operation, result, template) {
			UIBlock.unblock();
      swal("GENIAL!", "Se ha modificado el stock!", "success");
		Router.go('/stockeos');
			
    },
    onError: function(operation, error, template) {
					UIBlock.unblock();
     swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  }
});
Template.modificarStock.helpers({

	"defaultCompra":function(){
		return {fecha:new Date(),importe:0};
	},
	"settingsCodigo":function(){
		
		return {
      position: "bottom",
      limit: 5,
      rules: [
        {
					 matchAll: true,
          collection: Productos,
          field: "codigoBarras",
          template: Template.tmpProducto
        },
      ]
    };
	},
	"settings":function(){
		var itemsCompra = new Mongo.Collection(null);
		var compras=Compras.find();
		compras.forEach(function (item) {
			 item.items.forEach(function(itemCompra){
				 itemsCompra.insert(itemCompra);
			 });
		});
		return {
      position: "bottom",
      limit: 5,
      rules: [
        {
					token: ' ',
          collection: itemsCompra,
          field: "detalle",
          matchAll: false,
          template: Template.productosAuto
        },
				{
					token: '@',
          collection: Compras,
          field: "razonSocial",
          matchAll: false,
          template: Template.comprasAuto
        },
      ]
    };
	},
	"seleccionItems":function(){
		return seleccionItems.get();
	},
	"item": function() {
       return item.get();
 },
	"itemsAux": function() {
       return itemsStock.array();
 },
	"importeTotal": function() {
		var sum=calcularImporteTotalCompra();
		return sum.toFixed(2);
 },
	 
 
});

Template.modificarStock.events({
	"autocompleteselect #item_codigoBarras": function(event, template, doc) {
			$("#item_detalle").val(doc.nombreProducto);
			$("#item_cantidad").val(doc.disponibilidad);
			$("#item_importe").val(doc.precioVenta);
		
  },
	"autocompleteselect #producto": function(event, template, doc) {
    if(doc.items==null){ // NO ES COMPRA
			$("#item_codigoInterno").val(doc.codigo);
			$("#item_detalle").val(doc.detalle);
			$("#item_cantidad").val(doc.cantidad);
			$("#item_importe").val(doc.importe);
			$("#item_codigoBarras").focus();
			}else{ // ES COMPRA @
				itemsStock.clear();
				doc.items.forEach(function(item){
					var totalImporte=item.cantidad*item.importe;
					var aux={importe:item.importe,total:totalImporte,referencia:getReferencia(),codigo:item.codigo,cantidad:item.cantidad,detalle:item.detalle};
					itemsStock.push(aux);
				});
				$("#item_codigoBarras").focus();
			}
  },
	"keyup #item_cantidad":function(ev){
		if(ev.key=="F9")cargarItemIndividual($("#item_cantidad").val(),"cantidad");
	},
	"keyup #item_codigoBarras":function(ev){
		if(ev.key=="F9")cargarItemIndividual($("#item_codigoBarras").val(),"codigoBarras");
	},
	"keyup #item_detalle":function(ev){
		if(ev.key=="F9")cargarItemIndividual($("#item_detalle").val(),"detalle");
	},
	"keyup #item_codigo":function(ev){
		if(ev.key=="F9")cargarItemIndividual($("#item_codigo").val(),"codigo");
		
	},
	"keyup #item_importe":function(ev){
		if(ev.key=="F9")cargarItemIndividual($("#item_importe").val(),"importe");
	},
	
	"click #botonCarga":function(ev){
		agregarItem();
	},
	"click #botonAceptar":function(ev){
		UIBlock.block('Agregando productos a stock...');
	},
	"click .fila":function(ev){
		console.log(this);
		var pos=buscarPosicion(this.referencia);
		seleccionItems.set(pos);
		
	},
	"click #botonModifica":function(ev){
		modificaItem(referenciaModifica.get());
	},
	"click #quitar":function(ev){
		ev.preventDefault();
		var referencia=this.referencia;
		swal({   title: "Estas Seguro de quitar el item?",   text: "Una vez que lo has quitado lo puede volver a cargar!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ quitarItem(referencia); });
	
	},
	"click #modificar":function(ev){
		ev.preventDefault();
		var referencia=this.referencia*1;
		$("#item_codigoInterno").val(this.codigo);
		$("#item_cantidad").val(this.cantidad);
		$("#item_detalle").val(this.detalle);
		$("#item_importe").val(this.importe);
		$("#item_codigoBarras").val(this.codigoBarras);
		referenciaModifica.set(referencia);
		$("#botonCarga").hide();
		$("#botonModifica").show();
	},
});
Template.modificarStock.rendered = function() {

};
Template.modificarStock.created = function() {
  var items=Session.get('itemStock');
  itemsStock = new ReactiveArray(items);
  
	contador = new ReactiveVar();
	referenciaModifica = new ReactiveVar();
	seleccionItems = new ReactiveVar();
	item = new ReactiveVar();
  if(itemsStock!=null)
  $.each( itemsStock, function( key, value ) {
    contador.set(contador.get()+1);
		});
	seleccionItems.set(0);
	referenciaModifica.set(null);
	contador.set(0);
	
};