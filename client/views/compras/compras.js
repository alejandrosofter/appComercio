Template.accionesCompras.helpers({
   "ingresado":function(){
    return this.estado!="STOCKEADO"
  },
  "tienePagos":function()
  {
    if(this.pagos) return this.pagos.length>0;
    return false;
  },
  "cantidadPagos":function()
  {
    if(this.pagos) return this.pagos.length;
    return 0
  },
});
function resetFormAgregar()
{
  $("#codigo").val("");
  $("#cantidad").val("1");
  $("#detalle").val("");
  $("#importe").val("");
  $("#codigo").focus();
}
function resetFormUpdate()
{
  $("#codigo_up").val("");
  $("#cantidad_up").val("1");
  $("#detalle_up").val("");
  $("#importe_up").val("");
  $("#codigo").focus();
}

function getItemsCompra(id){
  Meteor.call("getItemsCompra",id,function(err,res){

    Session.set("getItemsCompra",res);
  })
}
var posModifica=0;
Template.verItemsCompras.events({
'mouseover tr': function(ev) {
    $("#tablaVentasItems").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
     
  },
  "click .delete":function(){
    var item=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ 
      Meteor.call("quitarItemCompra",Session.get("idCompraSeleccion"),item,function(err,res){
      getItemsCompra(Session.get("idCompraSeleccion"));
      swal("Quitado!", "El registro ha sido borrado", "success");
    })
  });

    
  },
   "click .modificar":function(ev){
    var top=$('body').offset().top;
    
    Session.set("idItemModifica",this._id);
    $("#formUpdate").show();
    // console.log(ev.pageY,posModifica)
    // posModifica=ev.pageY>posModifica?(ev.pageY+posModifica):(posModifica-ev.pageY);
    // var signo=ev.pageY>posModifica?"+":"-";
    // $("#formUpdate").animate({
    // 'marginTop' : signo+"="+ev.pageY+"px" //moves left
    // });
   }
})
Template.verItemsCompras.rendered=function(){
  Session.set("getItemsCompra",this.data.items);
  Session.set("idCompraSeleccion",this.data._id);
  setTimeout(resetFormAgregar,300);
  $("#idEntidad").select2({allowClear:true,placeholder:"Entidad...", width: 'resolve'}).trigger("change")
}

Template.compras.rendered=function(){

    
console.log(messagebird)


}
Template.modificaItemCompra.rendered=function(){
  $("#idEntidad_up").select2({allowClear:true,placeholder:"Entidad...", width: 'resolve'}).trigger("change")
}
Template.modificaItemCompra.helpers({
  "docu":function(){
    return this.docu
  },
"eti_codigo":function(){
    if(!this.docu.items)return -1;
    var idSeleccion=Session.get("idItemModifica");

    var ind=this.docu.items.buscarIndice(idSeleccion);
  return 'items.'+ind+'.codigo';
  },
  "eti_cantidad":function(){
    if(!this.docu.items)return -1;
     var idSeleccion=Session.get("idItemModifica");
    var ind=this.docu.items.buscarIndice(idSeleccion);
  return 'items.'+ind+'.cantidad';
  },
  "eti_idEntidad":function(){
    if(!this.docu.items)return -1;
     var idSeleccion=Session.get("idItemModifica");
    var ind=this.docu.items.buscarIndice(idSeleccion);
  return 'items.'+ind+'.idEntidad';
  },
  "eti_detalle":function(){
    if(!this.docu.items)return -1;
    var idSeleccion=Session.get("idItemModifica");
    var ind=this.docu.items.buscarIndice(idSeleccion);
  return 'items.'+ind+'.detalle';
  },
  "eti_importe":function(){
    if(!this.docu.items)return -1;
     var idSeleccion=Session.get("idItemModifica");
    var ind=this.docu.items.buscarIndice(idSeleccion);
  return 'items.'+ind+'.importe';
  },
})
Template.verItemsCompras.helpers({
   "totalCompra":function(){
    return this.importeTotal.formatMoney(2)
  },
  "diferencia":function(){
    if(Session.get("getItemsCompra"))
    var totalItems= Session.get("getItemsCompra").sumatoria(null,function(data){return data.cantidad*data.importe});
    
    return (this.importeTotal-totalItems).formatMoney(2);
  },
   "docu":function(){
    console.log(this)
    return this
  },
  "totalItems":function(){
    var arr=Session.get("getItemsCompra");
    if(arr) return arr.sumatoria(null,function(data){return data.cantidad*data.importe}).formatMoney(2);
    return 0
  },
  
    'settingsItems': function(){
      var items=Session.get("getItemsCompra");
        return {
  
 collection: items,
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
    {
        key: 'codigo',
        label: 'Cod.',
     headerClass: 'col-md-1',
   
      },
   {
        key: 'cantidad',
        label: 'CANT.',
     headerClass: 'col-md-1',
   
      },
   {
        key: 'detalle',
        label: 'PRODUCTO',
   
  },
  
   { 
        key: 'importe',
        label: '$ Unidad',
        headerClass: 'col-md-2',
        fn: function (value, object, key) {
        
          return value.toFixed(2)
         }
   },
   { 
        key: 'importe',
        label: '$ TOTAL',
        headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var porc=(object.descuentos/100)+1;
          
          var total=value*Number(object.cantidad);
          return total.toFixed(2)
         }
   },
   { 
        key: 'idEntidad',
        label: 'Entidad',
        headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var ent=Entidades.findOne({_id:value});
          if(ent)return ent.razonSocial;
          return '-'
         }
   },
    {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesItemsCompras
      }
 
 ]
 };
    }
});
Template.compras.helpers({
 
    'settings': function(){
        return {
 collection: Compras.find(),
 rowsPerPage: 10,
          rowClass: function(item) {
            if(item.estado=="STOCKEADO")return "compraStockeada"
          },
 class: "table table-condensed",
 showFilter: true,
 fields: [
    {
        key: 'fecha',
        label: 'Fecha',
      headerClass: 'col-md-1',
        fn: function (value, object, key) {
          var d=new Date(value);
           return value.getFecha3()
         }
      },
    {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-2',
      sortOrder:0,
       sortDirection: 'descending',
       hidden:true
      },
      {
        key: 'razonSocial',
        label: 'Razon Social',
        fn: function (value, object, key) {
          var entidad=Entidades.findOne({_id:object.idEntidad});
          var clase=object.estado=="STOCKEADO"?"compraStockeada":"";
          var rs=(entidad?entidad.razonSocial:"(s/e) ")+(value?value:"");
         return new Spacebars.SafeString("<span  class='"+clase+"' style=''> "+rs+"</span>"); 
         }
      },

      {
        key: 'detalle',
        label: 'Detalle',
      fn: function (value, object, key) {
        var sal="";
        var arr=object.items?object.items:[];
          if(object.detalle)sal+= object.detalle+" ";
          for(i=0;i<arr.length;i++)sal+=arr[i].detalle;
          return sal; 
         }
      },
   {
        key: 'importeTotal',
        label: '$ Total',
      fn: function (value, object, key) {
          return value.toFixed(2);  
         }
      },
       { 
        key: 'pagos',
        label: '$ Pagado',
         headerClass: 'col-md-1',
      fn: function (value, object, key) {
          var sum=0;
          if(value) for(var i=0;i<value.length;i++)sum+=(value[i].importe*1);
      return sum.formatMoney(2,",");
         }
      },
      { 
        key: 'pagos',
        label: '$ SALDO',
         headerClass: 'col-md-1',
      fn: function (value, object, key) {
          var sum=0;
          if(value) for(var i=0;i<value.length;i++)sum+=(value[i].importe*1);
      var saldo= (object.importeTotal-sum).formatMoney(2,",");
      var clase=saldo>0?"saldoNegativo":"saldoPositivo"
      return new Spacebars.SafeString("<span  class='"+clase+"' style=''> "+saldo+"</span>"); 
         }
      },
 {
        label: 'ESTADO',
       key: 'estado',
      },
    
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesCompras
      }
 ]
 };
    }
});
var messagebird = require('messagebird')('IsyUEJPI8ZH6uDArIs4X7eSrj');

Template.compras.events({
  "click #btnPrueba":function(){
    messagebird.balance.read(function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
})
  },
   'click .pagos': function(){
        var act=this;
        Session.set("idPagoSeleccion",this._id);
        Session.set("pagosVarios",this.pagos);
        Session.set("tipoPagoVario","Compras");
    Modal.show('pagosVarios',function(){ return act; });
  $("#pagosVariosModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open'); $('.modal-backdrop').remove() });
    
    },
    'click .nuevoPagoVario': function(){
  var dataPago={tipo:"Compras",datos:this};
   Modal.show("nuevoPagoVario",function(){ return dataPago; });
   $("#nuevoPagoVarioModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open'); $('.modal-backdrop').remove() });
    
    },
  'mouseover tr': function(ev) {
    $("#tablaCompras").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
    	'click .ver': function(){
        var act=this;
    Modal.show('verItemsCompras',function(){ return act; });
  $("#modalItems").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
   'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ Compras.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .stockear': function(ev) {
    Router.go('/nuevoStock/'+this._id);
  },
   'click .modificar': function(ev) {
    var act=this;
    Modal.show("modificarGasto",function(){
      return act
    })
     $("#modal_nuevoGasto").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
  },
}),

AutoForm.hooks({
  'nuevaCompra_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado la entidad!","success");
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro","error");
    }
  },
  'agregarItem_': {
    onSuccess: function (operation, result, template) {
      getItemsCompra(this.currentDoc._id);
      setTimeout(resetFormAgregar,500);
      
     // swal("GENIAL!","Se ha ingresado el registro!","success");
    },
    onError: function(operation, error, template) {
     swal("Ops!",error,"error");
    }
  },
  'modificaItemCompra_': {
    onSuccess: function (operation, result, template) {
      getItemsCompra(this.currentDoc._id);
      setTimeout(resetFormUpdate,500);
      
      $("#formUpdate").hide();
    },
    onError: function(operation, error, template) {
     swal("Ops!",error,"error");
    }
  }
});