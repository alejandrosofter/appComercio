AutoForm.hooks({

  'nuevoCentro_': {
   

    onSuccess: function(operation, result, template) { 
     
     Modal.hide();
     $('.modal-backdrop').remove();
      swal("GENIAL!", "Se ha ingresado el registro!", "success");
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  },
   'modificaCentro_': {
   

    onSuccess: function(operation, result, template) { 
     
     Modal.hide();
     $('.modal-backdrop').remove();
      swal("GENIAL!", "Se ha modificado el registro!", "success");
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  }
});
Template.centroCostos.events({

   'mouseover tr': function(ev) {
    $("#tablaCentro").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
   'click .delete': function(ev) {
    var ob=this;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, entregar!",   closeOnConfirm: false }, 
      function(){ CentroCostos.remove({_id:ob._id}); 
      swal("Completado!", "Quitado", "success"); });

  },
  'click .update': function(ev) {
    var data=this;
    Modal.show("modificarCentroCostos",function(){
      return data;
    })
  },
    'click #btnAgregar': function(ev) {
    var data=this;
    Modal.show("nuevoCentroCosto",function(){
      return data;
    })
  }
});
Template.centroCostos.helpers({
  
    'settings': function(){
        return {
 collection: CentroCostos,
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
    {
        key: 'nombreCentroCosto',
        label: 'Nombre',
   
      },
         {
        key: 'moduloDefault',
        label: 'Modulo Default',
        headerClass: 'col-md-1',
   
      },

   {
        label: '',
        tmpl:Template.accionesCentroCostos,
         headerClass: 'col-md-2',
      }
  
 
 ]
 };
    }
});