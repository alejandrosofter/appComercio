AutoForm.hooks({

  'nuevoCierre_': {
   
    formToDoc:function(doc){
      console.log(doc)
        doc.items=Session.get("buscarItemsCierre");
        return doc;
    },
    onSuccess: function(operation, result, template) { 
     
     Modal.hide();
     var importe=this.currentDoc.importe;
     var nuevoImporte=this.insertDoc.importe+importe;
     Cuentas.update(this.currentDoc._id,{$set:{importe:nuevoImporte}});
     $('.modal-backdrop').remove();
      swal("GENIAL!", "Se ha ingresado el registro!", "success");
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  }
});
var buscarCuentas=function()
{
  Meteor.call("buscarValoresCuentas",Session.get("fechaSeleccion"),function(err,res){
    
    Session.set("buscarValoresCuentas",res);
  })
}
 quitarCierre=function(idCierre,idCuenta)
{
  swal({   title: "Estas Seguro de quitar la caja?",   
      text: "Debes volver a cerrarla", 
        type: "warning",   showCancelButton: true,  
         confirmButtonColor: "#31708f",   
         confirmButtonText: "Si, quita!",   closeOnConfirm: false },
   function(){ 
    Meteor.call("quitarCierre",idCierre,idCuenta,function(err,res){
      if(!err)swal("Genial!", "El registro ha sido borrado", "success");
      else swal("Error!", "Hay error en la carga "+err+ "error");
    })
     
    });
  
}
var getUltimosCierres=function(id,cant)
{
  var sal="";
  var arr=Cuentas.find({_id:id}).cierres;
  for(var i=0;i<arr.length;i++)
    sal+=arr[i].importe+"<br>";
  return sal;
}
var buscarCierre=function(id,fecha)
{
  Meteor.call("buscarCaja",id,fecha,function(err,res){
    if(res)
    if(res.length>0){
      $("#cuenta_"+id).hide();
      $("#cuentaCerrada_"+id).show();
      var diferencia=res[0].importe-res[0].importeReal;
      var texto="LA CUENTA EN EL DIA DE LA FECHA ESTA CERRADA! con una diferencia de <b>$ "+diferencia.formatMoney(2)+"</b>";
      texto+=" <br>"
      texto+="<button class='btn btn-danger' onclick='quitarCierre(\""+res[0].idCierre+"\",\""+id+"\")'> QUITAR CIERRE</button> "
      $("#cuentaCerrada_"+id).html(texto)

    }else{
      var selector="#cuentaCerrada_"+id;
      $("#cuenta_"+id).show();
      $("#cuentaCerrada_"+id).hide();
      }
  })
}
var getFecha=function(){
  var arr=$("#fecha").val().split("/");
  var d=new Date(arr[2],(arr[1]-1),arr[0]);
  Session.set("fechaSeleccion")
  return d;
}
Template.cierreCaja.rendered=function(){
  var d=new Date();
  $("#fecha").val(new Date().getFechaCliente());
  var fecha=getFecha();
  
  buscarCuentas();  
}
Template.cierreCaja.events({
"click #btnAceptar":function(){
  Session.set("fechaSeleccion",getFecha())
  buscarCuentas()
},
"click #btnNuevoPago":function(){
  Modal.show("nuevoPago");
  $("#nuevoPago_").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
}
})

Template.cierreCaja.helpers({
  "diaSemana":function(){
    if(Session.get("fechaSeleccion"))
    return (Session.get("fechaSeleccion")).diaSemana();
  },
  "dia":function(){
    if(Session.get("fechaSeleccion"))
    return (Session.get("fechaSeleccion")).getDate();
  },
  "cuentas":function(){
    return Session.get("buscarValoresCuentas")
  }
})
var setDiferencia=function(pagos,id){
var sum=0;
    if(pagos)
      for(var i=0;i<pagos.length;i++)
        if(pagos[i].tipo=="COMPRAS")sum-=pagos[i].importe;
      else sum+=pagos[i].importe;
    var importe= (sum-Number($("#importeReal_"+id).val())).formatMoney(2)
  
    $("#diferencia_"+id).html(importe);
}
var cerrarCaja=function(id,pagos,fecha,importeReal)
{
    swal({   title: "Estas Seguro de carrar la caja?",   
      text: "Una vez creada si queres quitarla, debes ir al modulo cuentas!", 
        type: "warning",   showCancelButton: true,  
         confirmButtonColor: "#31708f",   
         confirmButtonText: "Si, carga!",   closeOnConfirm: false },
   function(){ 
    UIBlock.block('Consultando datos, aguarde un momento...');
    Meteor.call("cerrarCaja",id,pagos,fecha,importeReal,function(err,res){
      UIBlock.unblock();
      if(!err)swal("Genial!", "El registro ha sido cargado", "success");
      else swal("Error!", "Hay error en la carga "+err+ "error");
    })
     
    });

}
var detalleItems=function(items)
{
  var sal="DETALLE: ";
  console.log(items)
  for(var i=0;i<items.length;i++){
    var precio=items[i].importe?items[i].importe:items[i].precioVenta;
    sal+=items[i].detalle+" $"+precio.formatMoney(2)
  }
  return sal;
}
Template.pagosCuenta.rendered=function(){
var pagos=this.data.pagos;
var id=this.data._id;
buscarCierre(id,Session.get("fechaSeleccion"));

  setDiferencia(this.data.pagos,this.data._id);
  $("#importeReal_"+this.data._id).keyup(function(){
    setDiferencia(pagos,id)
  });
  var selectorBoton="#btnCerrarCaja_"+this.data._id;
  $(selectorBoton).click(function(){
    
    cerrarCaja(id,pagos,Session.get("fechaSeleccion"),$("#importeReal_"+id).val())
  });
}
Template.pagosCuenta.helpers({
  "importe":function(){
    if(this.tipo=="COMPRAS") return "- "+(this.importe.formatMoney(2))
    return this.importe.formatMoney(2)
  },
  "total":function(){
    var sum=0;
      for(var i=0;i<this.pagos.length;i++)
        if(this.pagos[i].tipo=="COMPRAS")sum-=this.pagos[i].importe;
      else sum+=this.pagos[i].importe;
    return sum.formatMoney(2)
  },
  "detalleItem":function(){
    if(this.tipo=="ORDENES")return this.detalle;
    if(this.tipo=="VENTAS")return detalleItems(this.items)
    if(this.tipo=="COMPRAS")return detalleItems(this.items)
    
  },
  "entidad":function(){
    if(this.tipo=="CIERRE")return "Cierre del "+this.fecha.diaSemana()+" "+this.fecha.getDate();
    if(this.tipo=="COMPRAS")return this.razonSocial;
    return this.entidad.length>0?this.entidad[0].razonSocial:"s/n"
  },
  "tipoClase":function()
  {
    if(this.tipo=="CIERRE")return "label label-info"
    if(this.tipo=="COMPRAS")return "label label-danger"
    return this.tipo=="ORDENES"?"label label-warning":"label label-success"
  }
})
Template.accionesCuentas.helpers({
"tieneCierres":function(){
    if(this.cierres)  return this.cierres.length>0;
    return false
  },
   "cantidadCierres":function(){
    if(this.cierres) return this.cierres.length;
    return 0
  },
})
Template.cuentas.helpers({
  
    'settings': function(){
        return {
 collection: Cuentas,
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
    {
        key: 'nombreCuenta',
        label: 'Cuenta',
   
      },
      
   
      {
        key: 'interesEnPago',
        label: '% Int. pagos',
     headerClass: 'col-md-1',
   
      },
      {
        key: 'importe',
        label: '$ importe',
     headerClass: 'col-md-1',
   
      },
      

   {
        key: 'default',
        label: 'Def.',
   headerClass: 'col-md-1',
   fn:function(val,obj){ return val?"SI":"NO"}
  },
   {
        label: '',
        tmpl:Template.accionesCuentas,
         headerClass: 'col-md-2',
      }
  
 
 ]
 };
    }
});
Template.detalleCuenta.helpers({
  
    'settings': function(){
        return {
 collection: Session.get("itemsCuenta"),
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
 {
        key: 'fecha',
        label: 'Fecha',
        fn:function(value,object){ 
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
         var sortValue= Date.parse( d)/1000 ;
         return new Spacebars.SafeString("<span sort=" + sortValue + ">" + d.toLocaleDateString() + "</span>"); 
       },
        headerClass: 'col-md-1',
   
      },
       {
        key: 'tipo',
        label: 'Tipo',
        headerClass: 'col-md-1',
   
      },
    {
        key: 'detalle',
        label: 'Detalle',
   
      },
    
   
  
 
 ]
 };
    }
});
var agregarItem=function()
{

  var items=Session.get("buscarItemsCierre");
  var aux={_id:new Date().getTime()+"",interes:0,fecha:new Date(),detalle:$("#detalle_").val(),tipo:"Manual",importe:($("#importe_").val()*1)};
  items.push(aux);
  console.log(items)

 Session.set("buscarItemsCierre",items);
 setarImporteItems();
}
Template.cierresCuenta.helpers({

  'settingsDetalle': function(){
        return {
  
 collection: Session.get("detalleCierres"),
 rowsPerPage: 100,
 showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
 {
        key: 'fecha',
        label: 'Fecha',
        headerClass: 'col-md-2',
         fn:function(value,object){ 
         
          var hoy=new Date();
          //if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
         var sortValue= Date.parse( value)/1000 ;
         console.log(object)
         return new Spacebars.SafeString("<span sort=" + sortValue + ">" + moment(value).format("DD-MM-YYYY") + "</span>"); 
       },
   
      },
       {
        key: 'detalle',
        label: 'Detalle',
      },
       {
        key: 'tipo',
        label: 'Tipo',
   headerClass: 'col-md-1',
      },

   {
        key: 'importe',
        label: '$ Importe.',
     headerClass: 'col-md-2',
   
      },
       {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesCierre
      } 

  
 
 ]
 };
    },

    'settings': function(){
        return {
  
 collection: Session.get("itemsCierres"),
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
 {
        key: 'fecha',
        label: 'Fecha',
        headerClass: 'col-md-1',
         fn:function(value,object){ 
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
         var sortValue= Date.parse( d)/1000 ;
         return new Spacebars.SafeString("<span sort=" + sortValue + ">" + d.toLocaleDateString() + "</span>"); 
       },
   
      },
       {
        key: 'detalle',
        label: 'Detalle',
   
      },


      {
        key: 'importeAbre',
        label: '$ ABRE.',
     headerClass: 'col-md-1',
   
      },
   
      {
        key: 'importe',
        label: '$ sys',
     headerClass: 'col-md-1',
   
      },
      {
        key: 'importeReal',
        label: '$ REAL',
     headerClass: 'col-md-1',
   
      },
      {
        key: 'importe',
        label: '$ ESPERADO.',
         headerClass: 'col-md-2',
        fn:function(val,obj){
          return (obj.importeAbre+obj.importe);
        }
      },
      {
        key: 'importe',
        label: '$ DIF.',
         headerClass: 'col-md-1',
        fn:function(val,obj){
          var importeSys=obj.importe<0?(obj.importe):(obj.importe);
          var valor= (obj.importeAbre+obj.importe)-obj.importeReal;
          var clase=valor<0?"saldoPositivo":"saldoNegativo";
          return new Spacebars.SafeString("<span class=" + clase + ">" + valor+ "</span>"); 
        }
      },
       {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesCierreCuentas
      } 

  
 
 ]
 };
    }
});
var getValor=function(valor){
  if(valor==undefined)return "";
  return valor;
}
var getImporteTotal=function()
{
  var items=Session.get("buscarItemsCierre");
  var sum=0;
  for(var i=0;i<items.length;i++)sum+=items[i].tipo=="Compras"?(-Number(items[i].importe)):Number(items[i].importe);
    return sum;
}
var mostrarDetalleCierres=function()
{
  $("#cierres").hide("slow");
  $("#detalleCierres").show("slow");
}
var mostrarCierres=function()
{
  $("#cierres").show("slow");
  $("#detalleCierres").hide("slow");
}
Template.accionesCierreCuentas.events({
  "click .delete":function()
  {
    var ob=this;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false },
    function(){
    Meteor.call("quitarCierreCuenta",Session.get("idCuentaSeleccion"),ob._id,ob.importe,function(err,res){
      Session.set("itemsCierres",res);
      swal("Quitado!", "El registro ha sido borrado", "success"); 
      
    })
    
    
    
    });
  },
  "click .ver":function(){
    Session.set("detalleCierres",this.items)
    mostrarDetalleCierres();
  },
  
})
Template.cierresCuenta.rendered=function(){
  console.log(this)
}
Template.nuevoCierre.rendered=function(){

  $("#fecha").val(moment().format("YYYY-MM-DDT00:00"));
}
Template.nuevoCierre.helpers({
    "tieneItems":function()
    {
      var items=Session.get("buscarItemsCierre");
      if(items)return items.length>0
        return false;
    },
    "diferencia":function()
    {
      return Session.get("importesCierreCuenta_diferencia");

    },
    "importeActual":function()
    {
      return Session.get("importesCierreCuenta_esperado");

    },
    'settings': function(){
        return {
  
 collection: Session.get("buscarItemsCierre"),
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
 {
        key: 'fecha',
        label: 'Fecha',
        headerClass: 'col-md-1',
         fn:function(value,object){ 
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
         var sortValue= Date.parse( d)/1000 ;
        
         return new Spacebars.SafeString("<span sort=" + sortValue + ">" + moment(value).format("DD/MM/YY")+ "</span>"); 
       },
   
      },
       {
        key: 'detalle',
        label: 'Detalle',
        fn:function(val,object){
          
          return val;
        }
   
      },
      {
        key: 'tipo',
        label: 'Tipo',
   headerClass: 'col-md-1',
      },

   {
        key: 'importe',
        label: '$ Importe.',
     headerClass: 'col-md-2',
     fn:function(val,object){
      var num=val;
      if(object.tipo=="Compras")num= -val;
      return Number(num).formatMoney(2,",");
     }
   
      },

  
 
 ]
 };
    }
});
var mostrarItems=function()
{
  $("#formulario").hide("fade");
  $("#items").show("fade");
}
var mostrarFormualrio=function()
{
  $("#items").hide("fade");
  $("#formulario").show("fade");
}
var getDetalle=function(val){
  var detalle="";
for (var i = 0; i <val.length; i++) detalle+=getValor(val[i].nombreProducto)+getValor(val[i].detalle)+", ";
  return detalle;
}
var ripData=function(data)
{
  var sal=[];
  for(var i=0;i<data.length;i++){
    var detalle="";
    var val=data[i].detalle;
    if(data[i].tipo=="OrdenesTrabajo") detalle+=val; 
    else detalle+=getDetalle(val)
sal.push({_id:data[i]._id,detalle:detalle,interes:data[i].interes, importe:data[i].importe, fecha:data[i].fecha, tipo:data[i].tipo })
  }
    return sal;
  
}
var setarImporteItems=function()
{
   var importe=getImporteTotal();
    $("#importe").val(importe);
}
var buscarItems=function(data)
{
  Meteor.call("buscarItemsCierre",data,Session.get("idCuentaSeleccion"),function(err,res){
    
    Session.set("buscarItemsCierre",ripData(res));
   setarImporteItems();
    mostrarItems();
setearImportes();
  })
}
var setearImportes=function()
{
  var importeSys=Number($("#importe").val());
      
      var importeAbre=Number($("#importeAbre").val());
      var importeReal=Number($("#importeReal").val());
      
      Session.set("importesCierreCuenta_esperado",(importeAbre+importeSys));
       Session.set("importesCierreCuenta_diferencia",(importeAbre+importeSys)-importeReal);
}
Template.nuevoCierre.events({

  //  'change #fecha': function(ev) {
  //   buscarItems($("#fecha").val());
    
  // },
  'click #btnAtras': function(ev) {
    mostrarFormualrio()
    
  },
  'click #btnAgregar': function(ev) {
    agregarItem()
    
  },
  'click #btnItems': function(ev) {
    mostrarItems()
    
  },
  "keyup .importes":function(e){
    setearImportes();
  },
  'click #btnBuscar': function(ev) {
    buscarItems($("#fecha").val());
    
  }
})
Template.cierresCuenta.events({
  "click .volver":function(){
    mostrarCierres();
  }
})
Template.cuentas.events({

   'mouseover tr': function(ev) {
    $("#tablaCuentas").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
   'click .delete': function(ev) {
    var ob=this;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, entregar!",   closeOnConfirm: false }, 
      function(){ Cuentas.remove({_id:ob._id}); 
      swal("Completado!", "Quitado", "success"); });

  },
  'click .update': function(ev) {
    var data=this;
    Modal.show("modificarCuenta",function(){
      return data;
    })
  },
  'click .detalle': function(ev) {
    var data=this;
    Session.set("itemsCuenta",data.items?data.items:[]);
    Modal.show("detalleCuenta",function(){
      return data;
    })
  },
  "click #btnAgregar":function()
  {
    var data=this;
    Modal.show("nuevaCuenta",function(){
      return data;
    });
  },
  'click .cierres': function(ev) {
    var data=this;
    Session.set("idCuentaSeleccion",this._id);
    Session.set("itemsCierres",data.cierres?data.cierres:[]);
    Modal.show("cierresCuenta",function(){
      return data;
    })
  },
  'click .nuevoCierre': function(ev) {
    var data=this;
    Session.set("idCuentaSeleccion",this._id);
    Modal.show("nuevoCierre",function(){
      return data;
    })
  },

})


AutoForm.hooks({
   'nuevaCuenta_': {
   
    onSuccess: function(operation, result, template) {
    swal("GENIAL!", "Se ha ingresado el registro!", "success");
    Modal.hide()
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  },
  'modificarCuenta_': {
   
    onSuccess: function(operation, result, template) {
    swal("GENIAL!", "Se ha ingresado el registro!", "success");
    Modal.hide()
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  },
})