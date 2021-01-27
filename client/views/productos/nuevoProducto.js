Template.nuevoProducto.events({
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
  'click #tablaCategorias tbody tr': function(event) {
    event.preventDefault();
    var categoria = this;
    $("#tablaCategorias tr").removeClass("filaSeleccionCategorias");
    $(event.currentTarget).addClass("filaSeleccionCategorias");
    $("#inputCategoria").val(categoria._id);
    console.log(categoria);
  },
  'click #btnNinguno': function(event) {
    $("#grupos").val([]);
    $("#grupos").attr('selectedIndex', '-1');
  },
  'click #tablaSimilares tbody tr': function(event) {
    event.preventDefault();
    $("#tablaSimilares tr").removeClass("filaSeleccionCategorias");
    $(event.currentTarget).addClass("filaSeleccionCategorias");
    var idProducto=($(event.currentTarget).attr("idproducto"));
 
     self.similarSeleccion.set(Productos.findOne({_id:idProducto}));
   // Router.go("/modificarProducto/"+idProducto);
  },
  'keyup #codigoInterno': function(event) {
    ///event.preventDefault();
    self.categoriaSeleccionada.set(ProductosCategorias.find({_id:this._id}));
    console.log(self.categoriaSeleccionada.get());
    self.textoCodigo.set($(event.currentTarget).val());
    console.log(self.textoCodigo);
  }
});
Template.nuevoProducto.created = function() {
  self.textoCodigo = new ReactiveVar();
  self.similarSeleccion = new ReactiveVar();
   self.categoriaSeleccionada = new ReactiveVar();
};
AutoForm.hooks({
  'nuevoProducto_': {
    before:{
      insert: function(doc) {
        var date = new Date();
        console.log(doc);
        var nuevoHistorial={fecha:date ,precioCompra:doc.precioCompra,precioVenta:doc.precioVenta,cantidadUsada:0,motivo:"INGRESO INICIAL",disponibles:doc.disponibilidad};
        doc.historial=[nuevoHistorial];
         console.log("nuevo doc");
       console.log(doc);
        return doc;
              }
    },
    onSuccess: function(operation, result, template) {
      swal("GENIAL!", "Se ha ingresado el producto!", "success");
      Router.go('/productos');
    },
    onError: function(operation, error, template) {
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados"+error, "error");
    }
  }
});
Template.nuevoProducto.helpers({

 "similarSeleccion":function(){
   return self.similarSeleccion.get();
 },
  "categoriaSeleccion":function(){
    return self.categoriaSeleccionada.get();
  },
   "opcionesGrupos": function() {
       return Grupos.find().map(function (c) {
      return {label: c.nombre, value: c._id};
    });
 },
  "historial":function(){
    console.log(this);
    return {fecha:"2016-05-05",precioCompra:2,precioVenta:24,cantidadUsada:3,motivo:"NUEVA CARGA",disponibles:3};
  },
  "opcionesCategoria": function() {
       return ProductosCategorias.find().map(function (c) {
      return {label: c.nombreCategoria, value: c._id};
    });
 },
  "productos": function() {
    return Productos.find({
      codigoInterno: {
        $regex: ".*" + self.textoCodigo.get() + ".*"
      }
    }).fetch();

  },
  'settingsCategorias': function() {
    return {
      collection: ProductosCategorias.find(),
      rowsPerPage: 200,
      showFilter: false,
      showNavigation: 'never',
      class: "table table-condensed ",
      fields: [{
        key: 'nombreCategoria',
        label: 'Categorias'
      }]
    };
  }
});