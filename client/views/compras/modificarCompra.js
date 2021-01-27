AutoForm.hooks({
	
  'modificarCompra_': {
    before:{
      update: function(doc) {
				
       console.log(doc);
        return doc;
              }
    },
    onSuccess: function(operation, result, template) {
      swal("GENIAL!", "Se ha modificado la compra!", "success");
      Router.go('/compras');
    },
    onError: function(operation, error, template) {
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados"+error, "error");
			$("#formulario").show("slow");
    }
  }
});

Template.modificarCompra.helpers({
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
		return {fecha:new Date(),importe:0};
	},
	"itemsAux": function() {
    
       return itemsCompra.array();
 },
	"importeTotal": function() {
		var sum=calcularImporteTotalCompra();
		return sum.toFixed(2);
 },
	 
 
});

Template.modificarCompra.events({
	"keyup #item_cantidad":function(ev){
		$("#item_total").html("$ "+calcularImporteParcial());
		//if(ev.key=="Tab")$("#item_detalle").focus();
	},
	
	"keyup #item_detalle":function(ev){
		//if(ev.key=="Tab")$("#item_importe").focus();
	},
	"keyup #item_codigo":function(ev){
		//if(ev.key=="Tab")$("#item_cantidad").focus();
	},
	"keyup #item_importe":function(ev){
		ev.preventDefault();
		$("#item_total").html("$ "+calcularImporteParcial());
		if(ev.key=="Control")agregarItem();
	},
	
	"click #botonCarga":function(ev){
		agregarItem();
	},
	"click #botonModifica":function(ev){
		modificaItem();
	},
	"click #quitar":function(ev){
		ev.preventDefault();
		var referencia=this.referencia;
		swal({   title: "Estas Seguro de quitar el item?",   text: "Una vez que lo has quitado lo puede volver a cargar!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ quitarItem(referencia); });
	
	},
	"click #modificar":function(ev){
		ev.preventDefault();
		var referencia=this.referencia*1;
		$("#item_codigo").val(this.codigo);
		$("#item_cantidad").val(this.cantidad);
		$("#item_detalle").val(this.detalle);
		$("#item_importe").val(this.importe);
		referenciaModifica.set(referencia);
		$("#botonCarga").hide();
		$("#botonModifica").show();
	},
});
Template.modificarCompra.events({
  
});

Template.modificarCompra.created = function() {
  var items=Session.get('itemsCompra');
  itemsCompra = new ReactiveArray(items);
  contador = new ReactiveVar();
  contador.set(0);
	console.log(items);
	if(itemsCompra!=null)
  $.each( itemsCompra, function( key, value ) {
    value.referencia=contador.get();
    
    contador.set(contador.get()+1);
		});
	referenciaModifica = new ReactiveVar();
	referenciaModifica.set(null);
	
	$("#item_codigo").focus();
};