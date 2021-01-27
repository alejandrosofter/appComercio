import { Cookies } from 'meteor/ostrio:cookies';
const cookies = new Cookies();

Template.layoutApp.helpers({
     'esAdmin': function(){
     if(!Meteor.user())return false;
     if(Meteor.user().username==="admin")return true;
     if(Meteor.user().profile.rol==="administrador")return true;

       return false;
     },
  'nombreUsuario':function(){
    if(!Meteor.user())return "";
    return Meteor.user().username;
  }
});
Template.layoutAppPublico.events({
  "click #btnPedido":function(){
    var arr=Session.get("productos")?Session.get("productos"):[];
    if(arr.length==0){
      Modal.hide();
      swal("Ops...","No hay productos para realizar el pedido","error");
      return;
    }
    if(!Session.get("entidadPublica")) Modal.show("loginEntidadPublica")
    else  Modal.show("finalizarPedido")

  },
  "click #btnVaciar":function(){
    
    swal({   title: "Estas Seguro de vaciar el pedido?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si vaciar!",   closeOnConfirm: true },
    function(){
   Session.set("productos",[])
    cookies.set("productos",[])
    });

  },
  "click #btnSalir":function(){
    
    swal({   title: "Estas Seguro de salir?",   text: "",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si salir!",   closeOnConfirm: true },
    function(){
   Session.set("entidadPublica",null)
   cookies.set("entidadPublica",null)
    });

  }
})
Template.layoutAppPublico.helpers({
     'nombreEmpresa': function(){
     var config= Settings.findOne({clave:"nombreEmpresa"});
     if(config)return config.valor;
     return ''
     },
     'cantidadProductos': function(){
     var arr=Session.get("productos");
     if(arr)return arr.length;
     return 0;
     },
     'importePedido': function(){
     var sum=0;
    var arr=Session.get("productos")?Session.get("productos"):[];
    for(var i=0;i<arr.length;i++){
      var prod=arr[i].producto;
      var object=arr[i];
      var porcentaje=(prod.porcentajeGanancia/100)+1;
          var precioVenta=Math.round(prod.precioCompra*porcentaje,2);
         
          sum+=((Math.round(precioVenta/10)*10)*object.cantidad);
    }
    return sum.formatMoney(2);
     },
     "cliente":function(){
    var entidad=Entidades.findOne({_id:Session.get("idEntidad")});
 
    if(entidad)return entidad.razonSocial;
    return "INVITADO"
  },
  "estaLogueado":function(){
    if(Session.get("entidadPublica"))return true
    return false
  },
     "contactos":function()
     {
      var config= Settings.findOne({clave:"contactos"});
     if(config)return config.valor;
     },
  'nombreUsuario':function(){
    if(!Meteor.user())return "";
    return Meteor.user().username;
  }
});
Template.layoutApp.events({
"click #nuevaEntidad":function()
{
  var act=this
  Modal.show('nuevaEntidad',function(){ return act; });
  $("#modalnuevaEntidad").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
},
"click #nuevaOrden":function()
{
  Meteor.subscribe('CentroCostos');
  var act=this
  Modal.show('nuevaOrdenTrabajo',function(){ return act; });
  $("#modalnuevaOrdenTrabajo").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
},
"click #nuevoGasto":function()
{
  Meteor.subscribe('CentroCostos');
  var act=this
  Modal.show('nuevoGasto',function(){ return act; });
 
}
})