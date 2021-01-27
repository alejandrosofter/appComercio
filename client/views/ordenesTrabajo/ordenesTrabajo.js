Template.accionesOrdenesTrabajo.helpers({
	"estaPendiente":function(){
    return this.estado=="PARA ENTREGAR"
  },
  "tieneProductos":function(){
    if(this.productos)return this.productos.length>0
  },
"esSistemaComercio":function(){
  return Settings.findOne({clave:"tipoSistema"}).valor=="comercio"
},
"esSistemaPetroleo":function(){
  return Settings.findOne({clave:"tipoSistema"}).valor=="petroleo"
},
  "cantidadProductos":function(){
    if(this.productos)return this.productos.length
  },
  "tienePagos":function(){
    if(this.pagos)return this.pagos.length>0
  },
  "cantidadPagos":function(){
    if(this.pagos)return this.pagos.length
  },
   "tieneAnotaciones":function(){
    if(this.descripcionesReparador) return this.descripcionesReparador.length>0;
    return 0;
  },
  "cantidadAnotaciones":function(){
    if(this.descripcionesReparador)  return this.descripcionesReparador.length
  },
	"estaFinalizada":function(){
		return this.estado=="FINALIZADA"
	},
	"muestraEngrega":function(){
		return this.entregado==false && this.estado=="FINALIZADA"
	},
})
var buscarIdEntidad=function(nombre)
{
  return Entidades.findOne({razonSocial:nombre});
}
var select2_search=function ($el, term) {
  $el.select2('open');
  
  // Get the search box within the dropdown or the selection
  // Dropdown = single, Selection = multiple
  var $search = $el.data('select2').dropdown.$search || $el.data('select2').selection.$search;
  // This is undocumented and may change in the future
  
  $search.val(term); 
  $search.trigger('keyup');
}
var callbackSuccess;
Template.nuevaOrdenTrabajo.rendered=function(){
  if(this.data){
    if(this.data.callback)callbackSuccess=this.data.callback;
    $("#descripcionCliente").val(this.data.detalle);
    var entidad=this.data.entidad;
   
    setTimeout(function(){ select2_search($("#idEntidad"),entidad)},500)
  }
    $("#ingreso").val(moment().format("YYYY-MM-DD"));
  }
Template.nuevaOrdenTrabajo.events({
"click #descripcionCliente":function(){
   // $("#idEntidad").select2('open');
   // console.log("ss")
}
})
Template.nuevaOrdenTrabajo.helpers({
  "idCentroDefault":function()
  {
    if(Meteor.user().profile.centroCosto)return Meteor.user().profile.centroCosto;
    var cc=CentroCostos.find({moduloDefault: {$regex : ".*OrdenesTrabajo.*"}}).fetch();
    if(cc.length>0)return cc[0]._id
  },
  "proximoNro":function(){
    return Settings.findOne({clave:"proximoNroOrden"}).valor
  }
})
Template.modificarOrden.helpers({
  "idCentroDefault":function()
  {
    var cc=CentroCostos.find({moduloDefault: {$regex : ".*OrdenesTrabajo.*"}}).fetch();
    if(cc.length>0)return cc[0]._id
  },

})
Template.pagosOrden.helpers({
  
    'settingsItems': function(){
        return {
 collection: Session.get("itemsPagos"),
 rowsPerPage: 100,

 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-2',
        fn: function (value, object, key) {
          return moment(value).format("d/m/Y");
         }
      },
 
    
   { 
        key: 'idCuenta',
        label: 'Cuenta',
      fn: function (value, object, key) {
          var cuenta=Cuentas.findOne({_id:value});
          if(cuenta)return cuenta.nombreCuenta;
          return "s/n"
         }
      },
   { 
        key: 'importe',
        label: '$ Importe',
      fn: function (value, object, key) {
          return value.toFixed(2);  
         }
      },

 {
        label: 'Detalle',
       key: 'detalle',
      },
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesPagosOrden
      } 
 ]
 };
    }
});
Template.accionesProductosOrden.events({

   'mouseover tr': function(ev) {
    $("#tablaPagosOrden").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
   'click .delete': function(ev) {
    var ob=this;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false },
    function(){
    Meteor.call("quitarProductoOrden",Session.get("idOrdenSeleccion"),ob._id,function(err,res){
      swal("Quitado!", "El registro ha sido borrado", "success"); 
      Session.set("productosOrden",res);
    })
    
    
    
    });

  },
})

Template.productosOrden.helpers({
  
    'settings': function(){
    
        return {
 collection: Session.get("productosOrden"),
 rowsPerPage: 100,

 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
           return d.toLocaleDateString() ;
         }
      },
 
    
   { 
        key: 'producto',
        label: 'Producto',
      fn: function (value, object, key) {
        var prod=Productos.findOne({_id:object.idProducto});
        if(prod)return prod.nombreProducto;
          return "s/n"; 
         }
      },
      { 
        key: 'cantidad',
        label: 'Cant.',
        headerClass: 'col-md-1',
      fn: function (value, object, key) {
          return value.toFixed(2);  
         }
      },
   { 
        key: 'importe',
        label: '$ Importe',
        headerClass: 'col-md-2',
      fn: function (value, object, key) {
          return value.toFixed(2);  
         }
      },


   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesProductosOrden
      } 
 ]
 };
    }
});

Template.nuevaAnotacioneOrden.rendered=function(){

    $("#fecha").val(moment().format("YYYY-MM-DD"));
    $("#idEntidad").select2({allowClear:true,placeholder:"Entidad...", width: 'resolve'}).trigger("change")
  }
Template.anotacionesOrden.helpers({
	
    'settings': function(){
    
        return {
 collection: Session.get("itemsDescripcionesOrden"),
 rowsPerPage: 100,

 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-2',
        fn: function (value, object, key) {
          var d=new Date(value);
          var hoy=new Date();
          if(d.toLocaleDateString()===hoy.toLocaleDateString()) return d.toLocaleTimeString();
           var sortValue= d.toLocaleDateString() ;
            return new Spacebars.SafeString("<span sort=" + sortValue + ">" + d.toLocaleDateString() + "</span>");
         }
      },
 
    
   { 
        key: 'detalle',
        label: 'Detalle',
      fn: function (value, object, key) {
          return value; 
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
        headerClass: 'col-md-2',
        tmpl:Template.accionesDescripcionOrden
      } 
 ]
 };
    }
});

Template.ordenesTrabajo.created = function () {
  this.filter = new ReactiveTable.Filter('buscadorOrdenes', ['idEntidad']);
   this.filterEstado = new ReactiveTable.Filter('buscadorEstado', ['estado']);
};

Template.ordenesTrabajo.helpers({
	
    'settings': function(){
        return {
 collection: OrdenesTrabajo.find(),
 rowsPerPage: 10,
  filters: ['buscadorOrdenes',"buscadorEstado"], 
  showFilter:false,
  sortByValue:false,
rowClass: function(item) {
  var qnt = item.estado;
  //
  switch (qnt) {
    case "PENDIENTE": return 'danger';
    case "FINALIZADA": return 'success';
    case "ESPERA REPUESTO": return 'warning';
    case "TRABAJANDO": return 'warning';
    default:       return ''
  }
},
 class: "table table-condensed",

 fields: [
  {
        key: 'nroOrden',
        label: 'Nro Orden',
        sortOrder:0,
        headerClass: 'col-md-1',
        sortDirection: 'descending',
        fn: function (value, object, key) {
         return value
         }
      },
   {
        key: 'ingreso',
        label: 'Fecha',
         
       
     headerClass: 'col-md-1',
        fn: function (value, object, key) {
          return value.getFecha3()
        }
      },
 {
        headerClass: 'col-md-2',
        label: 'Quien?',
        tmpl:Template.vistaEntidadTabla
      } ,
      // {
       
         
       
      //   sortable: true,
      //   fn: function (value, object, key) {
      //    var ent=Entidades.findOne({_id:object.idEntidad});
      //     var sortValue= ent.razonSocial;
      //       if(ent) return new Spacebars.SafeString("<span class='entidad' style='cursor:pointer;color:blue ' filter=" + sortValue + ">" + ent.razonSocial + "</span>");
         
      //    return "s/n"
      //    },
      // },
 
    {
        key: 'descripcionCliente',
        label: 'Consulta ...',
        fn: function (value, object, key) {
         return value
         }
      },
 

   { 
        key: 'importe',
         headerClass: 'col-md-1',
        label: '$ A Cobrar',
      fn: function (value, object, key) {
        var sum=0;
        if(object.productos)
          for(var i=0;i<object.productos.length;i++)sum+=(object.productos[i].importe*object.productos[i].cantidad);
          return (sum+value).toFixed(2);  
         }
      },
      { 
        key: 'importe',
         headerClass: 'col-md-1',
        label: '$ Cobrado',
      fn: function (value, object, key) {
      var items=object.pagos;
      var sum=0;
      if(items===undefined)return 0;
      for(var i=0;i<items.length;i++)sum+=items[i].importe;
          return sum.toFixed(2);  
         }
      },

{ 
        key: 'estado',
         headerClass: 'col-md-1',
        label: 'Estado',
      fn: function (value, object, key) {
      return value  
         }
      },
       {
        key: 'entregado',
         headerClass: 'col-md-1',
        label: 'Entregado? ...',
        fn: function (value, object, key) {
         if(value)return "SI";
         return "NO"
         }
      },
   {
        label: '',
        headerClass: 'col-md-3',
        tmpl:Template.accionesOrdenesTrabajo
      } 
 ]
 };
    }
});

Template.vistaEntidadTabla.events({
  "click .entidad":function(ev)
  {
    var data=Entidades.findOne({_id:this.idEntidad});
    Modal.show("modificarEntidad",function(){
      return data;
    });
  },
})
Template.vistaEntidadTabla.helpers({
  "razonSocial":function(){
    var ent=Entidades.findOne({_id:this.idEntidad});
    return ent.razonSocial;
  }
})
Template.nuevoProductoOrden.events({
  'change #idProducto': function(ev) {
    var precio=this.selectOptions[0].precio;
    $("#importe").val(precio)
    
  },
})

Template.accionesPagosOrden.events({

	 'mouseover tr': function(ev) {
    $("#tablaPagosOrden").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },

	 'click .delete': function(ev) {
    var ob=this;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false },
    function(){
    Meteor.call("quitarPagoOrden",Session.get("idOrdenSeleccion"),ob._id,function(err,res){
    	swal("Quitado!", "El registro ha sido borrado", "success"); 
      Session.set("itemsPagos",res);
    })
    
    
    
    });

  },
})

Template.accionesDescripcionOrden.events({

	 'mouseover tr': function(ev) {
    $("#tablaAnotacionesOrden").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
	 'click .delete': function(ev) {
    var ob=this;
    swal({   title: "Estas Seguro de quitar???",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false },
    function(){
    Meteor.call("quitarAnotacionesOrden",Session.get("idOrdenSeleccion"),ob._id,function(err,res){
      Session.set("itemsDescripcionesOrden",res);
    	swal("Quitado!", "El registro ha sido borrado", "success"); 
    	
    })
    
    
    
    });

  },
})

Template.buscadorOrdenes.events({

})
Template.buscadorOrdenes.helpers({
settings: function() {
    return {
      position: "top",
      limit: 5,
      rules: [
        {
          collection: Entidades,
          field: "razonSocial",
          template: Template.entidadAuto,
           callback: function(doc) {
              return filter.set(doc.apellido);
            }
        },
      
      ]
    };
  }
})
Template.finalizarOrden.events({
"click #btnAceptar": function (event, template) {
     var importePago= 0+ $("#importePago").val()*1;
     var importe= $("#importe").val()*1;
     var entregado= $("#entregado").prop('checked');
     var cuenta=Cuentas.findOne({default:true});
     var aux={"_id":Meteor.uuid() , "idCuenta":cuenta._id,"fecha":new Date(),"importe":importePago,"detalle":"PAGO POR FINALIZADO"};
    
     OrdenesTrabajo.update({"_id":this._id},{$set:{"importe":importe,"entregado":entregado,"estado":"FINALIZADA"}});
     if(importePago>0){
     
     OrdenesTrabajo.update(this._id, {
		$push: {
			pagos:aux
		}
	});
     }
     Modal.hide();
     swal("Genial!","Se ha generado el registro!","success")
     
   },
})
Template.imprimirOrden.events({
  "click #btnImprimir":function(){
    import printJS from 'print-js'
  printJS({
    printable: 'printable',
    type: 'html',
    targetStyles: ['*']
 }) 
  }
})
Template.imprimirOrden.helpers({
  "logo":function(){
    return Settings.findOne({clave:"logoEmpresa"}).valor;
  },
  "nroOrden":function(){
    return String(this.nroOrden).lpad("0",5)
  },
  "fecha":function(){
    return this.ingreso.getFecha3()
  },
  "importe":function(){
    return this.importe>0?this.importe:"cotizando";
  },
  "detalle":function(){
    return this.descripcionCliente
  },
  "cliente":function(){
    return Entidades.findOne({_id:this.idEntidad}).razonSocial;
  },
  "telefono":function(){
    return Entidades.findOne({_id:this.idEntidad}).telefono;
  },
  "nroOrden":function(){
    return String(this.nroOrden).lpad("0",5)
  },
   "normas":function(){
    return new Spacebars.SafeString(Settings.findOne({clave:"normasServicio"}).valor);
  }
})
Template.ordenesTrabajo.events({
  "click .imprimir":function(ev)
  {
    var data=this;
    Modal.show("imprimirOrden",function(){
      return data
    })
  },
"click #quitarFiltroEntidad": function (event, template) {
     template.filter.set("");
     template.filterEstado.set("");
      $("#entidadFiltro").val("")
      $(".estadoOrdenes").val("")
   },
"autocompleteselect #entidadFiltro": function (event, template, doc) {
      var input = $(event.target).val();
     template.filter.set(doc._id);
      
   },
   "change .estadoOrdenes": function (event, template) {
      var input = $(event.target).val();
     if(input=="")template.filterEstado.set("");
     else template.filterEstado.set({'$eq': input});
      
   },
  'mouseover tr': function(ev) {
    $("#tablaOrdenesTrabajo").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
   'click .entregar': function(ev) {
   var id=this._id;
    swal({   title: "Estas Seguro de entregar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, entregar!",   closeOnConfirm: false }, function(){ OrdenesTrabajo.update({_id:id},{$set:{entregado:true}}); swal("Completado!", "La orden se ha entregado", "success"); });

  },
//     	'click .pagos': function(){
//         var act=this;
//         var items=this.pagos;
//     if(items===undefined)items=[];
//     Session.set("itemsPagos",items)
//         Session.set("idOrdenSeleccion",this._id)
//     Modal.show('pagosOrden',function(){ return act; });
//   $("#modalPagosOrden").on("hidden.bs.modal", function () {
//     $('body').removeClass('modal-open');	
// $('.modal-backdrop').remove();
// });

//     },
     'click .nuevoProducto': function(){
        var act=this;
        Session.set("idOrdenSeleccion",this._id);
        
    Modal.show('nuevoProductoOrden',function(){ return act; });
  $("#nuevoProductoOrdenmodal").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
    },
     'click .productos': function(){
        var act=this;
        Session.set("productosOrden",this.productos);
        Session.set("idOrdenSeleccion",this._id);
        
    Modal.show('productosOrden',function(){ return act; });
  $("#modalproductosOrden").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
    },
    'click .anotacionesOrden': function(){
        var act=this;
        var items=this.descripcionesReparador;
   
    if(items===undefined)items=[];
    Session.set("itemsDescripcionesOrden",items);
        Session.set("idOrdenSeleccion",this._id);
        
    Modal.show('anotacionesOrden',function(){ return act; });
  $("#modalAnotacionesOrden").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
       'click .finalizar': function(){
        var act=this;
        Session.set("idOrdenSeleccion",this._id);
        
    Modal.show('finalizarOrden',function(){ return act; });
  $("#modalFinalizarOrden").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
    'click .pagos': function(){
        var act=this;
        Session.set("idPagoSeleccion",this._id);
        Session.set("pagosVarios",this.pagos);
        Session.set("tipoPagoVario","OrdenesTrabajo");
    Modal.show('pagosVarios',function(){ return act; });
  $("#pagosVariosModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open'); $('.modal-backdrop').remove() });
    
    },
    'click .nuevoPago': function(){

  var dataPago={tipo:"OrdenesTrabajo",datos:this};
   Modal.show("nuevoPagoVario",function(){ return dataPago; });
   $("#nuevoPagoVarioModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open'); $('.modal-backdrop').remove() });
    
    },
    	'click .nuevaAnotacion': function(){
    	var act=this;
    Modal.show('nuevaAnotacioneOrden',function(){ return act; });
  $("#nuevaDescripcionOrden_").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
		
	
	'click .anotaciones': function(){
		    var act=this;
    Modal.show('anotacionesOrdenes',function(){ return act; });
  $("#modalAnotacionesOrdenes").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
		
    },
	
   'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ OrdenesTrabajo.remove(id); swal("Quitado!", "El registro ha sido borrado", "success"); });
 
  },
  'click .update': function(ev) {
    var data=this;
    Modal.show("modificarOrden",function(){
      return data
    });
    $("#modalmodificarOrden").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');  
$('.modal-backdrop').remove();
});
  },
  'click .facturar': function(ev) {
   Router.go('/facturar/'+this._id);
  },
}),

AutoForm.hooks({
	 'nuevoProductoOrden_': {
   
    onSuccess: function(operation, result, template) {
    swal("GENIAL!", "Se ha ingresado el registro!", "success");
    if(callbackSuccess)callbackSuccess()
    Modal.hide()
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  },
  'nuevaDescripcionOrden_': {
   
    onSuccess: function(operation, result, template) {
    swal("GENIAL!", "Se ha ingresado el registro!", "success");
    Modal.hide()
      
    },
    onError: function(operation, error, template) {
          
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
    
    
    }
  },
  'nuevoPagoOrden_': {
   
    onSuccess: function(operation, result, template) {

      swal("GENIAL!", "Se ha ingresado el registro!", "success");
      Modal.hide();
	Router.go('/ordenesTrabajo/');
			
    },
    onError: function(operation, error, template) {
					
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  },
  'nuevaOrdenesTrabajo_': {
   
    onSuccess: function(operation, result, template) {
      var entidad=Entidades.findOne({_id:this.insertDoc.idEntidad}).razonSocial;
      var texto='Se cargó la orden de '+entidad+'!!. Su numero de orden es '+this.insertDoc.nroOrden;
      texto.hablar();
      swal("GENIAL!", texto, "success");
      var res=OrdenesTrabajo.findOne({_id:this.docId});

      var setOrden=Settings.findOne({clave:"proximoNroOrden"});
      var nuevoValor=(setOrden.valor*1)+1;;
      Settings.update({_id:setOrden._id},{$set:{valor:nuevoValor}});
			
			Modal.hide();
      $('.modal-backdrop').remove();
      if(Settings.findOne({clave:"muestraImpresionCargaOrden"}).valor!="0")
      Modal.show("imprimirOrden",function(){
        return res
      })
    },
    onError: function(operation, error, template) {
					
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  },
  'modificaOrdenesTrabajo_': {
   
    onSuccess: function(operation, result, template) {
     
     Modal.hide();
     $('.modal-backdrop').remove();
      swal("GENIAL!", "Se ha modificado la Orden de Trabajo!", "success");
			
    },
    onError: function(operation, error, template) {
					
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  }
});
Template.ordenesTrabajo.rendered=function(){
  
}
Template.nuevoPagoOrden.rendered=function(){
 Meteor.call("accesoMercadoPago",function(err,res){
  Session.set("accesoMercadoPago",res);
// SDK de Mercado Pago
const mercadopago = require ('mercadopago');

// Agrega credenciales

mercadopago.configure({
    sandbox: true,
    access_token: res.token
});
mercadopago.payment.create({
  description: 'Buying a PS4',
  transaction_amount: 10500,
  payment_method_id: 'rapipago',
  payer: {
    email: 'test_user_3931694@testuser.com',
    identification: {
      type: 'DNI',
      number: '34123123'
    }
  }
}).then(function (mpResponse) {
 
}).catch(function (mpError) {

});
 })
}