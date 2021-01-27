Array.prototype.unique = function() {
    var a = this.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};
Template.grupos.helpers({
     'seleccionGrupo': function(){
     return seleccionGrupo.get();
     },
   'seleccion': function(){
   console.log(seleccionGrupo.get());
  return  seleccionGrupo.get();
 },
  'itemsSeleccion': function(){
  return  seleccionGrupo.get().productos.length;
 },
	 'productos': function(){
   var grupo=Grupos.findOne({_id:seleccionGrupo.get()._id});
		 
		 var productos=[];
		 $(grupo.productos).each(function(key,val){
			 productos.push(Productos.findOne({_id:val}));
		 });
		 return productos;
 },
   
  "settings":function(){
		return {
      position: "bottom",
      limit: 5,
      rules: [
        {
					token: '',
          collection: Grupos,
          field: "nombre",
          matchAll: false,
          template: Template.gruposBusca
        },
      ]
    };
	},
  'items':function(){
    if(seleccionGrupo===null)return Grupos.find().fetch();
    return Grupos.find({parent:seleccionGrupo.get()}).fetch();
  }
});
Template.grupoHijo.helpers({
     'nivel': function(){
       console.log(this.grupo);
     return this.grupo.nivel;
     },
  'hijos': function(){
       console.log(this.grupo);
      return Grupos.find({parent:this.grupo._id}).fetch();
     },
  'cantidadItems': function(){
     return this.grupo.productos.length;
     },
});
Template.agregaProductosGrupo.helpers({
	"nombreGrupo":function(){
		console.log(seleccionGrupo.get())
		return seleccionGrupo.get().nombre
	},
	'settingsTabla': function(){
        return {
 collection: Productos.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
   {
        key: '_id',
      sortable: false,
        label: function () { return new Spacebars.SafeString("<input id='colProductos' type='checkbox' />"); },
      fn: function (value, object) { return new Spacebars.SafeString("<input id='"+value+"' class='checkProducto' type='checkbox' />"); }
      },
	 {
        key: 'disponibilidad',
        label: 'Stock',
		 style:"width:90px",
      fn: function (value, object, key) {
          return value;  
         }
      },
   {
        key: 'nombreProducto',
        label: 'Producto',
      fn: function (value, object, key) {
          return value;  
         }
      },
	 {
        key: 'precioVenta',
        label: '$ Precio Venta',
      fn: function (value, object, key) {
          return "$ "+value.toFixed(2);  
         }
      },

   
 ]
 };
    },
})
Template.grupo.helpers({
     'grupo': function(){
       console.log(this.grupo);
     return this.grupo
     },
  'hijos': function(){
       console.log(this.grupo);
      return Grupos.find({parent:this.grupo._id}).fetch();
     },
  'cantidadItems': function(){
     return this.grupo.productos.length;
     },
  'fechaCreacion': function(){
    var d=new Date(this.grupo.created);
           return d.toLocaleDateString();
     },
 'seleccion': function(){
   console.log(seleccionGrupo.get());
  return  seleccionGrupo.get();
 },
  'items':function(){
    if(seleccionGrupo===null)return Grupos.find().fetch();
    return Grupos.find({parent:seleccionGrupo.get()}).fetch();
  }
});
var volver=function(){
  $("#productos").hide();
    $("#grupos").show("slow");
    seleccionGrupo.set(null);
};
var estaProdAdentro=function(id,arr){
	var esta=false;
	$(arr).each(function(key,val){
		if(id===val){esta=true;seleccionItemsProducto.splice(key,1); return;}
	});
	return esta;
};
var agregaQuita=function(id){
	if(!estaProdAdentro(id,seleccionItemsProducto.array()))seleccionItemsProducto.push(id);
};
var resetAgregaItems=function(){
	console.log("RESET ITEMS");
	seleccionItems.clear();
	$(".checkProducto").each(function(){
         $(this).prop("checked",false);
       });
}
var actualizarGrupoSeleccion=function(){
	var grupo=Grupos.findOne({_id:seleccionGrupo.get()._id});
	seleccionGrupo.set(grupo);
};
var actualizarProductosGrupo = function(todos,idGrupo) {
	//seleccionItems.array()
	var grupoSeleccion=idGrupo?idGrupo:seleccionGrupo.get()._id;
	Grupos.update(grupoSeleccion, {
		$set: {
			productos: todos
		}
	});
	seleccionGrupo.set(Grupos.findOne({
		_id: grupoSeleccion
	})); //PARA ACTUALIZAR LAS CANTIDADES EN VISTA
	$(todos).each(function(key, val) {
		var producto = Productos.findOne({
			_id: val
		});
		var gruposProducto = producto.grupos ? producto.grupos : [];
		gruposProducto.push(grupoSeleccion);
		gruposProducto.unique();
		
		Productos.update(val, {
			$set: {
				grupos: gruposProducto
			}
		});
	});
};
var quitarProductosSeleccion=function(idGrupo){
	var grupoSeleccion=idGrupo?idGrupo:seleccionGrupo.get()._id;
	var grupo=Grupos.findOne({_id:grupoSeleccion});
	
	var items=grupo.productos;
	 $(seleccionItemsProducto.array()).each(function(key,val){
		 items.splice(items.indexOf(val),1); // LO SACO DEL GRUPO
		 // AHORA LO SACO DEL PRODUCTO
		 console.log(val)
// 		 var prod=Productos.findOne({_id:val});
// 		 var grupoSacar=grupoSeleccion;
// 		 var gruposProducto=prod.grupos;
// 		 while(gruposProducto.indexOf(grupoSacar)!=-1) gruposProducto.splice(gruposProducto.indexOf(grupoSacar),1);
// 		Productos.update(val,{$set:{grupos:gruposProducto}});
		 
	 });
	Grupos.update(grupoSeleccion, {
		$set: {
			productos: items
		}
	});
};
var resetSeleccion=function(){
	$("#seleccionarTodosProductosGrupo").attr("aria-pressed","false");
	$("#seleccionarTodosProductosGrupo").removeClass("active");
	seleccionItemsProducto.clear();
	
};
var cambiaEstadoBotones=function(){
	if(seleccionItemsProducto.array().length>0){
		$(".botonera").prop("disabled","");
	}else{
		$(".botonera").prop("disabled","disabled");
	}
};
var pegarProductos=function(idGrupo){
	var todos = seleccionGrupo.get().productos.concat(seleccionItemsProducto.array()).unique();
	actualizarProductosGrupo(todos,idGrupo);
	estaMoviendoProductos.set(false);
	if(estaCortandoProductos.get()){
		quitarProductosSeleccion(idGrupoOrigen.get()._id);
		estaCortandoProductos.set(false);
	}
	resetSeleccion();
};
Template.agregaProductosGrupo.events({
	'click .agregaProductos': function(ev) {
		var todos = seleccionGrupo.get().productos.concat(seleccionItems.array()).unique();
		
      actualizarProductosGrupo(todos);
		  resetAgregaItems();
		actualizarGrupoSeleccion();
  },
	 'change .checkProducto': function(ev) {
    var id=ev.currentTarget.id;
    seleccionItems.push(id);
    
  },
	 'click #colProductos': function(ev) {
    var valor=$("#colProductos").prop('checked');
       $(".checkProducto").each(function(){
         var elem=$(this);
         elem.prop("checked",valor);
         elem.trigger("change");
       });
      //$(".checkProducto").prop("checked",true);else $(".checkProducto").prop("checked",false);
  },
})
Template.grupos.events({
	"autocompleteselect #producto": function(event, template, doc) {
    if(doc.items==null){ // NO ES COMPRA
			$("#item_detalle").val(doc.detalle);
			$("#item_cantidad").val(doc.cantidad);
			$("#item_importe").val(doc.importe);
			$("#item_codigoBarras").focus();
			}else{ // ES COMPRA @
				itemsStock.clear();
				doc.items.forEach(function(item){
					var totalImporte=item.cantidad*item.importe;
					var aux={importe:item.importe,total:totalImporte,referencia:getReferencia(),codigo:null,cantidad:item.cantidad,detalle:item.detalle};
					itemsStock.push(aux);
				});
				$("#item_codigoBarras").focus();
			}
  },
 
	'click #btnAgregarProductos': function(ev) {
    Modal.show("agregaProductosGrupo");
    
  },
	'click .quitarSeleccion': function(ev) {
    swal({   title: "Quitando PRODUCTOS DEL GRUPO",   text: "Una vez que lo has quitado sera permanente y borrara los PRODUCTOS DEL GRUPO (seguiran existiendo pero ya no en este grupo)!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ quitarProductosSeleccion(); swal("Quitado!", "Los productos han sido quitados del grupo", "success");  resetSeleccion(); });
    
    
  },
	"click #seleccionarTodosProductosGrupo":function(){
    var valor=$("#seleccionarTodosProductosGrupo").attr('aria-pressed');
		valor=!(valor==="true"?true:false);
       $(".checkProductoGrupo").each(function(){
         var elem=$(this);
         elem.prop("checked",valor);
         elem.trigger("change");
       });
		$(".labelProductoGrupo").each(function(){
         var elem=$(this);
         if(valor)elem.prop("style","color:grey");else elem.prop("style","color:black");
       });
  },
  'change .checkProductoGrupo': function(ev) {
    var id=ev.currentTarget.id;
		var label=$(ev.currentTarget.parentNode);
		var elem=$(ev.currentTarget);
		var valor=elem.prop("checked");
		if(valor)label.prop("style","color:grey");else label.prop("style","color:black");
		
		agregaQuita(id);
		seleccionItemsProducto.sort();
		cambiaEstadoBotones();
    
  },
 
  
  'click .quitar': function(ev) {
    var id=seleccionGrupo.get()._id;
    console.log(this);
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente y borrara los grupos debajo!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Grupos.remove(id); swal("Quitado!", "El registro ha sido borrado", "success");  volver(); });
    
  },
  "click .grupo":function(){
		var grupo=this.grupo;
		cambiaEstadoBotones();
		console.log("SELECCION");
		console.log(idGrupoOrigen.get());
		if(estaMoviendoProductos.get()){
			 swal({   title: "Pegando Productos",   text: "Estas por copiar/cortar productos a este grupo.. estas seguro?",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, pegalo!",   closeOnConfirm: true }, function(){ pegarProductos(grupo._id); });
    
		}
		seleccionGrupo.set(this.grupo);
    $("#grupos").hide();
    $("#productos").show("slow");
    
    
  },
	
  "click .volver":function(){
    volver();
  },
	"click #btnCopiar":function(){
		estaMoviendoProductos.set(true);
		idGrupoOrigen.set(seleccionGrupo.get());
    volver();
  },
		"click #btnMover":function(){
		estaMoviendoProductos.set(true);
		estaCortandoProductos.set(true);
		idGrupoOrigen.set(seleccionGrupo.get());
    volver();
  },
  "click #btnNuevo":function(){
    if($("#nombreGrupo").val()===""){
      swal("Opss!", "Debes ingresar un nombre al grupo! ", "error");
      return;
    }
    var padre=seleccionGrupo.get()===null?null:seleccionGrupo.get()._id;
    var nivel_=padre===null?0:seleccionGrupo.get().nivel+1;
    Grupos.insert({nombre:$("#nombreGrupo").val(),parent:padre,nivel:nivel_,productos:[]});
    $("#nombreGrupo").val("");
    swal("Bien!", "Se ha creado el grupo con exito! ", "success");
  }
  
});
Template.grupos.created = function() {
	seleccionGrupo = new ReactiveVar();
	estaMoviendoProductos = new ReactiveVar();
  estaMoviendoProductos.set(false);
	idGrupoOrigen = new ReactiveVar();
  idGrupoOrigen.set(null);
	estaCortandoProductos = new ReactiveVar();
  estaCortandoProductos.set(false);
	seleccionGrupo.set(null);
  seleccionItems = new ReactiveArray();
	seleccionItemsProducto = new ReactiveArray();
  
	
};