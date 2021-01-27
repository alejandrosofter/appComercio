AutoForm.hooks({

	'_nuevoPagoVario_Ventas': {

    onSuccess: function(operation, result, template) {
      var id=this.docId;
      var importe=this.insertDoc.importe;
      var cuenta=Cuentas.findOne({_id:this.insertDoc.idCuenta}).nombreCuenta;
      var texto='Se cargó el pago por '+importe+' en '+cuenta+'!';
      texto.hablar();
      if(callbackSuccess)callbackSuccess();
       Meteor.call("chequearPago",id,"Ventas",function(err,res){
         Modal.hide();
         $('body').removeClass('modal-open');  $('.modal-backdrop').remove();

      });
    },
    onError: function(operation, error, template) {
UIBlock.unblock();
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


    }
  },
  '_nuevoPagoVario_OrdenesTrabajo': {

    onSuccess: function(operation, result, template) {
      var id=this.docId;
      console.log(this)
       var importe=this.insertDoc.importe;

       var cuenta=Cuentas.findOne({_id:this.insertDoc.idCuenta}).nombreCuenta;
      var texto='Se cargó el pago por '+importe+' en '+cuenta+'!';
      texto.hablar();
      console.log(callbackSuccess)
      if(callbackSuccess)callbackSuccess();
      Meteor.call("chequearPago",id,"OrdenesTrabajo",function(err,res){
        
         Modal.hide();
         $('body').removeClass('modal-open');  $('.modal-backdrop').remove();
         if(res=="CANCELADO")
          swal({   title: "Marcar como FINALIZADA",   text: "Por lo visto la orden esta paga.. deseas marcarla como finalizada?..",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#0edc1e",   confirmButtonText: "Si!",   closeOnConfirm: true },
   function(){
    Meteor.call("ordenesTrabajo.update",id,{estado:"FINALIZADA",entregado:true},function(err,res){

    })
    });


      });
       
    },
    onError: function(operation, error, template) {
UIBlock.unblock();
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


    }
  },
	'_nuevoPagoVario_Compras': {

		onSuccess: function(operation, result, template) {
      var id=this.docId;
      var importe=this.insertDoc.importe;
      var cuenta=Cuentas.findOne({_id:this.insertDoc.idCuenta}).nombreCuenta;
      var texto='Se cargó el pago por '+importe+' en '+cuenta+'!';
      texto.hablar();
      if(callbackSuccess)callbackSuccess();
			 Meteor.call("chequearPago",id,"Compras",function(err,res){

         Modal.hide();
         $('body').removeClass('modal-open');  $('.modal-backdrop').remove();

      });
		},
		onError: function(operation, error, template) {
UIBlock.unblock();
			swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: " + error, "error");


		}
	}
});
var chequearEstadoOrdenTrabajo=function(data)
{

}
Template.nuevoPagoVario.helpers({
	"id":function()
	{
		console.log(this)
		return this.datos._id
	},

	"idInsert":function(){
		return "_nuevoPagoVario_"+this.tipo;
	},
	"coleccion":function(){
		return this.tipo;
	}
})
var quitarPagoVario=function(idVenta,id,tipo)
{
	Meteor.call("quitarPagoVario",idVenta,id,tipo,function(err,res){
		Session.set("pagosVarios",res);
    if(callbackSuccess)callbackSuccess()
		swal("genial!","se ha quitado el pago","success");
	})
}
Template.pagosVarios.rendered=function(){
  console.log(this)
  callbackSuccess=this.data.callback;
}
Template.pagosVarios.events({
"click .delete":function(){
	var id=this._id;
	swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false },
	 function(){ quitarPagoVario(Session.get("idPagoSeleccion"),id,Session.get("tipoPagoVario")); swal("Quitado!", "El registro ha sido borrado", "success"); });
}
})
Template.pagosVarios.helpers({
	'settings': function(){

        return {
 collection: Session.get("pagosVarios"),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-2',
        fn: function (value, object, key) {
         
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
        label: '$ Total',
      fn: function (value, object, key) {
          return Number(value).formatMoney(2,",") 
         }
      },
	  
   {
        label: '',
        headerClass: 'col-md-2',
        tmpl:Template.accionesPagosVarios
      } 
 ]
 };
    }
})
Template.nuevoPago.events({
  "select2:select #idEntidad":function(){
    Meteor.call("consultarParaCobrar",$("#idEntidad").val(),function(err,res){
      console.log(res)
    })
  }
})
Template.nuevoPago.rendered=function(){

var data = $.map(Entidades.find().fetch(), function (obj) {
  obj.id = obj._id; // replace pk with your identifier
obj.text = obj.razonSocial;
  return obj;
});
  $("#idEntidad").select2({data:data, width: '300px',allowClear:true,placeholder:"seleccione..."});
  $("#idEntidad").select2().on('select2:select', function (e) {
  console.log( $("#idEntidad").val())
});

}
var callbackSuccess;
Template.nuevoPagoVario.rendered=function(){
  var d=moment().format("YYYY-MM-DD");
    callbackSuccess=this.data.callback;
  $("#fecha").val(d);


}