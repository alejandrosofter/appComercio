import { Meteor } from 'meteor/meteor';

var consultarUsuarios=function()
{
   Meteor.call("users.list",function(err,res){
        Session.set("usuarios",res);
      })
}
var resetearClave=function(id,clave)
{
  console.log("cambia clave"+id)
   Meteor.call("users.resetPassword",id,clave,function(err,res){
    swal("Bien!","se ha reseteado la clave!","success");
    if(!Meteor.user())Router.go('/login');
      })
}
Template.usuarios.onCreated(function () {

});

Template.usuarios.helpers({
	'settings': function(){
     consultarUsuarios();
        return {
 collection: Session.get("usuarios"),
 rowsPerPage: 100,
 class: "table table-hover table-condensed",
 showFilter: false,
 fields: [
 {
        key: '_id',
       label:"ID",
      },
	   {
        key: 'username',
			 label:"Usuario",
      },
      {
        key: 'profile.nombres',
        label: 'Nombres',
      },
       {
        key: 'profile.centroCosto',
        label: 'Centro Costo',
        fn:function(val,obj){
          if(val)return CentroCostos.findOne({_id:val}).nombreCentroCosto;
          return "-"
        }
      },
	 {
        key: 'profile.rol',
        label: 'Perfil de...',
      },
      {
          label: '',
          //headerClass: 'col-md-1',
          tmpl: Template.accionesUsuarios
        }
      
  
 ]
 };
    }

});

Template.usuarios.events({
  "click #btnPrint":function(){
    window.print()
  },
  'mouseover tr': function(ev) {
    $("#tabla").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();

  },
  "click #btnAgregar":function(){
    Modal.show('nuevoUsuario',function(){ return null; });
  },
  'click #delete': function(ev) {
    var id = this._id;
    swal({
      title: "Estas Seguro de quitar?",
      text: "Una vez que lo has quitado sera permanente!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Si, borralo!",
      closeOnConfirm: true
    }, function() {
     Meteor.call("users.remove",id,function(err,res){
      if(!err)swal("Bien!","Se ha eliminado el usuario ","success")
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
    });
      
      
    });

  },
   'click #modificar': function(ev) {
    var data=this;
    Modal.show("modificarUsuario",function(){
      return data
    })

  },
});
Template.modificarUsuario.helpers({
"data":function(){
  return this;
}
});
function getCentrosCosto()
{
  var ents=CentroCostos.find().fetch();
  var data = $.map(ents, function (obj) {
  obj.id =  obj._id;
  obj.text=obj.nombreCentroCosto; // replace pk with your identifier

  return obj;
});
  return data;
}
Template.modificarUsuario.rendered=function(){
  $("#tipoUsuario").val(this.data.profile.rol);

  $("#centroCosto").select2({data:getCentrosCosto()});
  console.log(this.data.profile)
  $('#centroCosto').val(this.data.profile.centroCosto);
    $('#centroCosto').select2({allowClear: true,placeholder:"Seleccione centro de costo si lo desea..."}).trigger('change');
}
Template.nuevoUsuario.rendered=function(){
  $("#centroCosto").select2({data:getCentrosCosto(), allowClear: true,placeholder:"Seleccione centro de costo si lo desea..."})
}
function getPerfilUsuario()
{
  return {
    
    idProfesional:$("#idProfesional").val(),
    profesional:$("#profesional").val(),
    nombres:$("#nombres").val(),
    email:$("#email").val(),
    telefono:$("#telefono").val(),
    centroCosto:$("#centroCosto").val(),
    rol:$( "#tipoUsuario option:selected" ).val()
  };
}
Template.modificarUsuario.events({
"click #btnAgregar":function(){
  var perfil=getPerfilUsuario();
  var usuario=$("#usuario").val();
  var clave=$("#password").val();
  var _id=this._id;

if(clave!="")resetearClave(_id,clave);
UIBlock.block('Realizando consulta, aguarde por favor...');
Meteor.call("users.update",_id,usuario,perfil,function(err,res){
  UIBlock.unblock();
if(!err){
  consultarUsuarios();
  Modal.hide();
}
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
  })
}
})
Template.nuevoUsuario.events({
  
  "click #btnAgregarUsuario":function(){
    console.log("acet")
    var perfil=getPerfilUsuario();
  var usuario=$("#usuario").val();
    var clave=$("#password").val();
    UIBlock.block('Realizando consulta, aguarde por favor...');
    Meteor.call("users.add",usuario,clave,perfil,function(err,res){
      UIBlock.unblock();
      if(!err){
        consultarUsuarios();
        Modal.hide();

      }
      else swal("Ops..","hay un problema con la carga del nuevo usuario: "+err.message,"error")
    });

  },
})