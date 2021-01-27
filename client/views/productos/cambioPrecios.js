Template.gruposAuto.helpers({
  "cantidad":function(){
    return this.productos.length;
  }
});
var estaDentro=function(idProducto)
{
  var res=false
  $(items.array()).each(function(key,val){
    if(val._id===idProducto){res=true;return;}
  });
  return res;
}
var traerGrupo=function(grupo){
  $(grupo.productos).each(function(key,val){
		console.log(val)
        var prod=Productos.findOne({_id:val});
		console.log(prod)
        if(!estaDentro(prod._id))items.push(prod);
      });
      var hijos=Grupos.find({parent:grupo._id}).fetch();
     
      if(hijos.length>0)
        swal({   title: "TRAER SUB GRUPOS ("+hijos.length+") de "+grupo.nombre+"?",   text: "Este grupo tiene Sub Grupos, queres traer los productos? ",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, traelo!",   closeOnConfirm: true }, function(){ 
          $(hijos).each( function(key,val){ traerGrupo(val)}); 
          });
	
}
var estaCargadoProducto=function(id){
  var sal=false;
  $(itemsCambioProductos).each(function(key,val){
    if(val.idProducto===id){sal=true;return;}
});
  return sal;
};
var agregarPrecio=function(precioNuevo,precioViejo,id){
  var prod=Productos.findOne({_id:id});
  var item={nuevoPrecio:precioNuevo,precioViejo:precioViejo,idProducto:id,nombreProducto:prod.nombreProducto};
  if(!estaCargadoProducto())itemsCambioProductos.push(item);
};
var cambiarPreciosProductos=function(){
  
  $(itemsCambioProductos.array()).each(function(key,val){
    
    var prod=Productos.findOne({_id:val.idProducto});
    
    var historial=prod.historial?prod.historial:[];
    var nuevaHistoria={motivo:"CAMBIO PRECIO",precioVenta:prod.precioVenta,precioCompra:prod.precioCompra,fecha:new Date(),disponibles:prod.disponibilidad};
    historial.push(nuevaHistoria);
    Productos.update(prod._id,{$set:{historial:historial,precioVenta:val.nuevoPrecio}});
  })
};
Template.cambioPrecios.events({
	"autocompleteselect #producto": function(event, template, doc) {
    $("#producto").val("");
    if(doc.nombreProducto){//ES PRODUCTO
        var prod=Productos.findOne({_id:doc._id});
        items.push(prod);
    }else{ //ES GRUPO
      traerGrupo(doc);
    }
  },
   "change .precios": function(ev) {
    var REDONDEO_A=5;
		 var esNegativo=($("#porcentaje").val().indexOf("-")==-1)?false:true;
		 var elem=$(ev.currentTarget);
		  var precioViejo=elem.val();
		 var porcentaje=0;
		 var precio=0;
		 if(esNegativo){
			 porcentaje=-(($("#porcentaje").val()*1)/100); //POLARIZO EL PORCENTAJE
      precio=precioViejo-(precioViejo*porcentaje);
		 }else{
			 porcentaje=(($("#porcentaje").val()*1)/100)+1;
      precio=precioViejo*porcentaje;
		 }
      
      if(precio<=10)
        if(precio<10)REDONDEO_A=1;
      var precioNuevo=Math.ceil((precio)/REDONDEO_A)*REDONDEO_A;
      elem.val(precioNuevo);
      var padre= $(elem.context.parentElement);
      agregarPrecio(precioNuevo,precioViejo,elem.attr("id"));
      padre.append("<span style='color:grey;font-size:8px'>$ "+precioViejo+" </span");
  },
  "click #btnAceptar": function(ev) {
    if(items.array().length>0){
      var nuevo={productos:itemsCambioProductos.array()};
     CambioPrecios.insert(nuevo); 
      cambiarPreciosProductos();
      items.clear();
       swal("Excelente!", "Se ha realizado los cambios de precios con exito!", "success");
    }else swal("Ops!", "No hay items para cambiar el precio!", "error");
  },
  "click #btnCalcula": function(ev) {
    
    $(".precios").each(function(key,val){
      $(val).trigger("change");
    })
  },
  "click #btnVaciar":function(){
    swal({   title: "VACIANDO EL LISTADO",   text: "Una vez vaciado el listado podras cargar nuevamente los precios con el precio original...",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, vacialo!",   closeOnConfirm: true }, function(){ items.clear(); });
	
    
  }
});
Template.cambioPrecio.helpers({
  "fecha":function(){
    var d=new Date(this.data.created);
    return d.toLocaleDateString()+ ' ' + d.toLocaleTimeString();
  },
  "cantidad":function(){
    return this.data.productos.length;
  },
   
});
Template.cambioPrecios.helpers({
  "items":function(){
    return items.array();
  },
  "historial":function(){
    return CambioPrecios.find().fetch();
  },
  "hayItems":function(){
    return (items.array().length===0);
  },
	"settingsProductos":function(){

		return {
      position: "bottom",
      limit: 5,
      rules: [
        {
					token: '!',
          collection: Productos,
          field: "nombreProducto",
          matchAll: false,
          template: Template.productosAuto
        },
				{
					token: '@',
          collection: Grupos,
          field: "nombre",
          matchAll: false,
          template: Template.gruposAuto
        },
      ]
    };
	},
 
});
Template.cambioPrecios.created = function() {
 itemsCambioProductos = new ReactiveArray();
  items = new ReactiveArray();
 //contador = new ReactiveVar();
};