Template.modificarProducto.events({
  "keyup #ganancia":function(){
    var porcentaje=(Number($("#ganancia").val())/100)+1;
    var precioCompra=Number($("#precioCompra").val());
    var final=precioCompra*porcentaje;
    $("#precioFinal").val(final.formatMoney(2))
  },
  "keyup #precioCompra":function(){
    var porcentaje=(Number($("#ganancia").val())/100)+1;
    var precioCompra=Number($("#precioCompra").val());
    var final=precioCompra*porcentaje;
    $("#precioFinal").val(final.formatMoney(2))
  },
  "keyup #precioFinal":function(){
    var precioFinal=(Number($("#precioFinal").val()));
    var precioCompra=Number($("#precioCompra").val());
    var porcentaje=((precioFinal/precioCompra)-1)*100
    $("#ganancia").val(porcentaje.formatMoney(2))
  },
})
Template._modificaEnCreate.events({
  'click #btnNinguno': function(event) {
    $("#grupos").val([]);
    $("#grupos").attr('selectedIndex', '-1');
  }
});
 Template.modificarProducto.created = function() {
  
    };

Template.modificarProducto.helpers({
 "opcionesGrupos": function() {
       return Grupos.find().map(function (c) {
      return {label: c.nombre, value: c._id};
    });
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
  }
});

AutoForm.hooks({
  
  'modificarProd_': {
     before:{
      update: function(doc) {
       
        // console.log("nuevo doc");
        
        return doc;
              }
    },
    onSuccess: function(operation, result, template) {
      var prod=this.currentDoc;
      console.log(prod);
      var date = new Date();
      var nuevoHistorial=prod.historial;
      if(nuevoHistorial==null)nuevoHistorial=[];
      var aux={fecha:date ,precioCompra:prod.precioCompra,precioVenta:prod.precioVenta,cantidadUsada:0,motivo:"MODIFICA MANUAL",disponibles:prod.disponibilidad};
      nuevoHistorial.push(aux);
      Productos.update(prod._id,{ $set:{historial:nuevoHistorial} });
      swal("Genial!", "Se ha modificado el producto...", "success");
      Router.go('/productos');

    },
    onError: function(operation, error, template) {
      swal("Opaaaas!", "ha ocurrido un error, por favor chequee los datos ingresados"+error, "error");
    }
  }
});