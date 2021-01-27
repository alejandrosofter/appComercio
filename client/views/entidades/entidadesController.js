Template.entidades.helpers({
    'settings': function(){
        return {
 collection: Entidades.find(),
 rowsPerPage: 10,
 showFilter: true,
class: "table table-condensed",
 fields: [
      {
        key: 'razonSocial',
        label: 'Razon Social',
      },
   {
        key: 'email',
        label: 'Email',
        headerClass: 'col-md-2',
      },
   {
        key: 'telefono',
        label: 'tel.',
        headerClass: 'col-md-2',
      },
   {
        key: 'default',
        label: 'Default',
        headerClass: 'col-md-1',
      },
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesEntidades
      }
 ]
 };
    }
});
Template.nuevaEntidad.events({
    'submit form': function(){
         console.log("click agregar");
    }
});

Template.entidades.events({
  
  'mouseover tr': function(ev) {
    $("#tablaEntidades").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
  'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: true }, function(){ Entidades.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
  var act=this;
 Modal.show('modificarEntidad',function(){ return act; });
  $("#modalmodificarEntidad").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});

  },
  
});
AutoForm.hooks({
  'nuevaEntidad_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha ingresado la entidad!","success");
     Modal.hide();
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  },
    'modificarEntidad_': {
    onSuccess: function (operation, result, template) {
     swal("GENIAL!","Se ha modificado la entidad!","success");
        Modal.hide();
    },
    onError: function(operation, error, template) {
     swal("Ops!","ha ocurrido un erro al ingresar el registro:"+error,"error");
    }
  }
});