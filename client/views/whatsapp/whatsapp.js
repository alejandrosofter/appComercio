
AutoForm.hooks({

	'nuevaVentaFactura_': {
		
		before: {
			insert: function(doc) {
				doc.ingresado = new Date();
				doc.estado = "PENDIENTE";
				doc.emisor="";
				
				
				return doc;
			}
		},
	
		onSuccess: function(operation, result, template) {
			
		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
Template.nuevoMensaje.helpers({
	"nombreChat":function(){
		return this.emisor
	},
	"receptor":function(){
		return this.emisor
	},
  
});
Template.mensajesChat.helpers({
	"nombreChat":function(){
		return this.emisor
	},
	"receptor":function(){
		return this.emisor
	},
	'settingsChat': function(){
		console.log(this)
			Meteor.subscribe('ChatWhatsapp',null);
        return {
					
 collection: MensajesWhatsapp.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'ingresado',
        label: 'Ingreso',
     headerClass: 'col-md-3',
        fn: function (value, object, key) {
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
           return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
         }
      },
   {
        key: 'ingresado',
        label: 'Fecha',
     headerClass: 'col-md-2',
      sortOrder:0,
       sortDirection: 'descending',
       hidden:true
      },
      {
        key: 'mensaje',
        label: 'Mensaje',
        fn: function (value, object, key) {
         return value;
         }
      },
 
    

  
	 {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesWhatsapp
      }
	  
 ]
 };
    }
})
Template.whatsapp.helpers({
	
    'settings': function(){
			
        return {
 collection: MensajesWhatsapp.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'ingresado',
        label: 'Ingreso',
     headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
           return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
         }
      },
   {
        key: 'ingresado',
        label: 'Fecha',
     headerClass: 'col-md-2',
      sortOrder:0,
       sortDirection: 'descending',
       hidden:true
      },
      {
        key: 'mensaje',
        label: 'Mensaje',
        fn: function (value, object, key) {
         return value;
         }
      },
 
    

   { 
        key: 'emisor',
        label: 'Quien?',
      fn: function (value, object, key) {
          return value;  
         }
      },
	 {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesWhatsapp
      }
	  
 ]
 };
    }
});

Template.whatsapp.events({

    'mouseover tr': function(ev) {
    $("#tablaWhatsapp").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
  'mousemove tr': function(ev) {
    
  },
	'click .chat': function(){
        var act=this;
    Modal.show('mensajesChat',function(){ return act; });
  $("#modalChat").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
  'click #nuevoMensaje': function(){
        var act=this;
    Modal.show('nuevoMensaje',function(){ return act; });
  $("#modalNuevoMensaje").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
		'click #desactivar': function(){
  UIBlock.block("BAJANDO SERVICIO, AGUARDE UN MOMENTO");
            Meteor.call('desactivarWhatsap',$("#codigoVerificacion").val(),function(err,res){
            if(!err)swal("RESULTADO:",res,"success");
              else swal("Ops..",err);
		         UIBlock.unblock();
          });
    },
	'click #activar': function(){
  //UIBlock.block('ACTIVANDO SERVICIO, AGUARDE UN MOMENTO');
            Meteor.call('activarWhatsapp',$("#codigoVerificacion").val(),function(err,res){
            if(!err)swal("RESULTADO:",res,"success");
              else swal("Ops..",err);
		         UIBlock.unblock();
          });
    },

	
   'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ quitarVenta(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
   
  },
  'click .facturar': function(ev) {
   Router.go('/facturar/'+this._id);
  },
})

// AutoForm.hooks({
	
//   'facturar_': {
   
//     onSuccess: function(operation, result, template) {
//       //swal("GENIAL!", "Se ha ingresado la Factura Electronica!", "success");
//       var res=Ventas.findOne({_id:this.docId});
//       console.log(res);
//      // Router.go('/nuevaVenta/');
			
// 			crearPdf(res);
// 					  Router.go('/nuevaVenta/');
			
//     },
//     onError: function(operation, error, template) {
					
//       swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
//     }
//   }
// });