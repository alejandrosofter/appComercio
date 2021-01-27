var sacarGrupo=function(grupo,arr){
  var nuevo=[];
  $(arr).each(function(key,val){
    if(val!=grupo)nuevo.push(val);
  });
  return nuevo;
};
Template.productos.rendered=function(){
  Meteor.subscribe('Cuentas');
}
Template.productos.helpers({

  "rowClass": function(item) {
    var qnt = item.codigoInterno;
    if (qnt == "321") return 'danger';
    return '';
  },
  'settingsCategorias': function() {
    return {
      collection: ProductosCategorias.find(),
      rowsPerPage: 200,
      showFilter: false,
      showNavigation:'never',
      class: "table table-condensed",
      fields: [{
        key: 'nombreCategoria',
        label: 'Categorias'
      }]
    };
  },
  'settings': function() {
    return {
      collection: Productos.find(),
      rowsPerPage: 10,
      showFilter:true,
      filters:["nombreProducto","disponibilidad","grupos"],
      rowClass: function(item) {
        var qnt = item.codigoInterno;
        if (qnt == "321") return 'danger';
        return '';
      },
      class: "table table-condensed",
      fields:  [
       {
        key: 'disponibilidad',
        label: 'Disp.',
        headerClass: 'col-md-1',
        fn: function (value, object, key) {
           return value;
         }
      },
      {
        key: 'nombreProducto',
        label: 'Producto',
        headerClass: 'header',
        fn: function (value, object, key) {
           return value;
         }
      },
        {
        key: 'codigoBarras',
        label: 'Cod.Barras/Ref',
        headerClass: 'col-md-2'
      },
       
        {
        key: 'porcentajeGanancia',
        label: '% Ganancia',
        fn: function (value, object, key) {
           return (value); 
         },
        headerClass: 'col-md-1'
      },
        {
        key: 'precioVenta',
        label: '$ Venta',
        fn: function (value, object, key) {
          var coef=(object.porcentajeGanancia/100)+1
           return (object.precioCompra*coef); 
         },
        headerClass: 'col-md-1'
      },
      
      {
        label: '',
        headerClass: 'col-md-3',
        tmpl:Template.accionesProductos
      }]
    };
  }
});
Template.accionesProductos.helpers({
  "cantidadImagenes":function()
  {
    console.log(this)
    return this.imagenes.length;
  },
})
Template.productosCategorias.helpers({
  'settings': function() {
    return {
      collection: ProductosCategorias.find(),
      rowsPerPage: 50,
      showFilter: false,
      class: "table table-condensed table-hover",
      fields: [{
        key: 'nombreCategoria',
        label: 'Nombre'
      },{
        key: '_id',
        label: 'ID'
      }]
    };
  }
});

Template.productos.events({
   'click #tablaCategorias tbody tr': function(event) {
    event.preventDefault();
    var categoria = this;
    $("#tablaCategorias tr").removeClass("filaSeleccionCategorias");
    $(event.currentTarget).addClass("filaSeleccionCategorias");
    
    console.log(categoria);
  },
  'mouseover tr': function(ev) {
    $("#tablaProductosGral").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'click .archivos': function(ev) {
    var datos=this;
    Modal.show("archivos",function(data){
      return datos
    })
  },
  'click .nuevoArchivo': function(ev) {
    var datos=this;
    Modal.show("nuevoArchivo",function(data){
      return datos
    })
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ Productos.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/modificarProducto/'+this._id);
  },
  'click .historial': function(ev) {
    Router.go('/historial/'+this._id);
  }
  
});
