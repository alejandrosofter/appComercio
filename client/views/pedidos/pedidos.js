Template.pedidos.events({
   'mouseover tr': function(ev) {
    $("#tabla").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },

  "click #delete":function(){
    var data=this;
      swal({   title: "Estas Seguro de eliminar este registro?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#dd5555",   confirmButtonText: "Si Quitar!",   closeOnConfirm: true },
    function(){
      Pedidos.remove({_id:data._id})
    });
  },
  "click #vender":function(){
    var data=this;
    Session.set("pedidoSeleccion",data);
    Router.go("/nuevaVenta/")
  }
})

Template.pedidos.helpers({
	
    'settings': function(){
    
        return {
 collection: Pedidos,
 rowsPerPage: 100,

 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
           var sortValue= d.toLocaleDateString() ;
            return new Spacebars.SafeString("<span sort=" + sortValue + ">" + d.toLocaleDateString() + "</span>");
         }
      },
 
    
   { 
        key: 'idEntidad',
        label: 'Cliente',
         headerClass: 'col-md-2',
      fn: function (value, object, key) {
        var cli=Entidades.findOne({_id:value});
        if(cli)return cli.razonSocial
          return "-"; 
         }
      },
        { 
        key: 'productos',
        label: 'Productos',
      fn: function (value, object, key) {
       
        var salida="";
        for(var i=0;i<value.length;i++){
           var p=Productos.findOne({_id:value[i].idProducto});
           if(p) salida+=p.nombreProducto+" $"+value[i].importe+" | ";
         }
         return salida;
      }
    },
    { 
        key: 'productos',
        label: '$ TOTAL',
      fn: function (value, object, key) {
       
        var sum=0;
        for(var i=0;i<value.length;i++) sum+=value[i].cantidad*value[i].importe;
  
         return sum.formatMoney(2);
      }
    },

        { 
        key: 'estado',
        label: 'Estado',
         headerClass: 'col-md-1',
      fn: function (value, object, key) {
        return value
         }
      },

   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesPedidos
      } 
 ]
 };
    }
});

Template.pedidos.created = function () {
   Meteor.subscribe('Pedidos');
   Meteor.subscribe('Productos');
};