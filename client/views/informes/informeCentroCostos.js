Template.informeCentroCostos.events({

   'mouseover tr': function(ev) {
    $("#tableinforme").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  "click #btnImprimir":function(){
    import printJS from 'print-js'
  printJS({
    printable: 'printable',
    type: 'html',
    targetStyles: ['*']
 }) 
  }

})

function buscar()
{
  SUIBlock.block('Cargando...');
  Meteor.call("informeCentroCostos",$("#fechaDesde").val(),$("#fechaHasta").val(),$("#idCentroCosto").val(),function(err,res){
    if(!res){
      SUIBlock.unblock();
      swal("Opss..","Alguna de las fehcas tiene formato incorrecto..","error");
      return;
    }
    Session.set("informeCentroCostos",res);
    SUIBlock.unblock();
    sumar();
    
    
  })
}
function getCentroCostos(){
  var ents=CentroCostos.find().fetch();
  var data = $.map(ents, function (obj) {
  obj.id =  obj._id;
  obj.text=obj.nombreCentroCosto; // replace pk with your identifier

  return obj;
});
  return data;
}
Template.informeCentroCostos.rendered=function(){
  var d=new Date();
  var desde="01/"+(d.getMonth()+1)+"/"+d.getFullYear();
  var hasta="31/"+(d.getMonth()+1)+"/"+d.getFullYear();
  $("#fechaDesde").val(desde);
  $("#fechaHasta").val(hasta);
  $("#idCentroCosto").select2({data:getCentroCostos(),placeholder:"Seleccione Centro de Costo...",allowClear:true})
}
Template.informeCentroCostos.events({
"click #btnBuscar":function(){
  buscar()
}
})
Template.informeCentroCostos.helpers({
  "total":function(){
    var arr=Session.get("informeCentroCostos");
  var sum=0;
  for(var i=0;i<arr.length;i++)sum+=arr[i].importe;
  return sum
  },
    'settings': function(){
    
        return {
 collection: Session.get("informeCentroCostos"),
 rowsPerPage: 100,

 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
        sortOrder: 0, sortDirection: 'descending',
     headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var sortValue=moment(value).format("x");    
          return new Spacebars.SafeString("<span sort=" + sortValue + ">" + value.getFecha3() + "</span>");
 
         }
      },
      {
        key: 'idEntidad',
        label: 'Entidad',
     headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var ent=Entidades.findOne({_id:value});
          if(ent)return ent.razonSocial;
            return "-"
         }
      },
 
 
    
   { 
        key: 'detalle',
        label: 'Detalle',
      fn: function (value, obj, key) {
       var tipo="<span class='label label-danger'>compra</span>";
    if(obj.tipo=="Ventas")tipo="<span class='label label-success'>venta</span>";
    if(obj.tipo=="OrdenesTrabajo")tipo="<span class='label label-info'>orden</span>";

        var detalle=obj.detalle;
    if(obj.tipo=="Ventas"){
      var sal="";
       for(var i=0;i<obj.detalle.length;i++)sal+=obj.detalle[i].nombreProducto+"("+obj.detalle[i].precioVenta+")"
       detalle= sal;
    }
    if(obj.tipo=="Compras"){

      var sal="";
      var arr=obj.items;
       for(var i=0;i<arr.length;i++)sal+=arr[i].detalle+" $"+arr[i].importe.formatMoney(2)+" | "
       detalle= obj.detalle+": "+ sal;
      
    }
    return new Spacebars.SafeString(tipo+" "+detalle);
         }
      },
   { 
        key: 'importe',
        label: '$ Importe',
        headerClass: 'col-md-2',
      fn: function (value, object, key) {
          return value.formatMoney(2)
         }
      },


 ]
 };
    }
});