//import '/imports/reconocedorVoz';
//6440328845  
Template.inicio.rendered=function(){
	setEntidad();
	
}
Template.ctaCte.rendered=function(){
	console.log(this)
}
Template.inicio.events({
	"click #nuevaEntidad":function()
{
  var act=this
  Modal.show('nuevaEntidad',function(){ return act; });
 
},
"click #nuevaOrden":function()
{
  Meteor.subscribe('CentroCostos');
  var act=this;
  act.callback=buscarCtaCte;
  Modal.show('nuevaOrdenTrabajo',function(){ return act; });
 
},
"click #nuevoGasto":function()
{
  var act=this;
  act.callback=buscarCtaCte;
  Modal.show('nuevoGasto',function(){ return act; });

},
 'click .pagos': function(){
        var act=this;
        act.callback=buscarCtaCte;
        Session.set("idPagoSeleccion",this._id);
        Session.set("pagosVarios",this.pagos);
        Session.set("tipoPagoVario",this.tipo);
    Modal.show('pagosVarios',function(){ return act; });

    },
    'click .nuevoPago': function(){
      var importePagos=0;
      console.log(this)
      if(this.importePago)
      for(var i=0;i<this.importePago.length;i++)importePagos+=this.importePago[i];
var saldo=this.importeTotal-importePagos;
var data=this;
data.importe=saldo;
data.fecha=moment().format("YYYY-MM-DD");
data.interes=0;
  var dataPago={tipo:this.tipo,datos:data,callback:buscarCtaCte};
   Modal.show("nuevoPagoVario",function(){ return dataPago; });

    },
  'mouseover tr': function(ev) {
    $("#tablaCta").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
})
Template.accionesCta.helpers({
	"tienePagos":function(){
return this.pagos;
},
"cantidadPagos":function(){

return this.pagos.length;
},
})
Template.inicio.helpers({

    'settingCta': function(){
        return {
 collection: Session.get("ctaCte"),
 rowsPerPage: 100,
 showNavigationRowsPerPage:false,
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
      	key:"detalle",
      	label:"Detalle",
      	fn:function(val,obj,key){
      	var tipo="<span class='label label-danger'>compra</span>";
		if(obj.tipo=="Ventas")tipo="<span class='label label-success'>venta</span>";
		if(obj.tipo=="OrdenesTrabajo")tipo="<span class='label label-info'>orden</span>";

      	var detalle=obj.detalle;
		if(obj.tipo=="Ventas"){
			var sal="";console.log(obj.detalle)
			 for(var i=0;i<obj.detalle.length;i++)sal+=obj.detalle[i].nombreProducto+"("+obj.detalle[i].precioVenta+")"
			 detalle= sal;
		}
		if(obj.tipo=="Compras"){

			var sal="";
      var arr=obj.detalle?obj.detalle:[];
      if(obj.detalle2)sal+=obj.detalle2;
			 for(var i=0;i<arr.length;i++)sal+=arr[i].detalle+" | "
			 detalle= sal;
      
		}
		return new Spacebars.SafeString(tipo+" "+detalle);
      	}
      }
   ,
     {
      	key:"importeDebe",
      	label:"$ Debe",
      	fn:function(val,obj,key){
      		return obj.importeTotal?obj.importeTotal.formatMoney(2):0;
      	}
      },
       {
      	key:"importeHaber",
      	label:"$ Pago",
      	fn:function(val,obj,key){
      	var sal="";
		if(!obj.pagos) return "$ 0.00";

		for(var i=0;i<obj.pagos.length;i++){
			var cta=Cuentas.findOne({_id:obj.pagos[i].idCuenta});
			var nombreCuenta=cta?cta.nombreCuenta:"";
			sal+="<span title='"+obj.pagos[i].fecha.getFecha()+" "+nombreCuenta+"'> $"+obj.pagos[i].importe.formatMoney(2)+"</span>";
		}
		
		return new Spacebars.SafeString(sal);
      	}
      },
       {
      	key:"importeSaldo",
      	label:"$ Saldo",
      	fn:function(val,obj,key){
      		var debe=obj.importeTotal?obj.importeTotal:0;
		var haber=obj.pagos?obj.pagos.sumatoria("importe"):0;
		var saldo=(debe-haber);

		var color=saldo>0?"red":"green";

		return new Spacebars.SafeString("<span style='color:"+color+"'>$ "+saldo.formatMoney(2)+"</span>")
	
      	}
      },
   {
        label: '',
        headerClass: 'col-md-1',
        tmpl:Template.accionesCta
      } 
 ]
 };
    },

	"saldoTotal":function(){
		
		var arr= Session.get("ctaCte");
		var sumPagos=0;
		var totalDebe=0;

		if(arr)for(var i=0;i<arr.length;i++)totalDebe+=arr[i].tipo=="Compras"?(-arr[i].importeTotal):arr[i].importeTotal;
		
		if(arr)for(var i=0;i<arr.length;i++)
			if(arr[i].tipo=="Compras")sumPagos-=arr[i].pagos?arr[i].pagos.sumatoria("importe"):0;
		else sumPagos+=arr[i].pagos?arr[i].pagos.sumatoria("importe"):0;
		var saldo=(totalDebe-sumPagos);

		var color=saldo>0?"red":"green";
		return new Spacebars.SafeString("<span style='color:"+color+"'>$ "+saldo.formatMoney(2)+"</span>")
		
	},
	
})
function setEntidad()
{
	$('#entidadSeleccion').on('select2:select', function (e) { 
    	console.log('select event');
    	buscarCtaCte($('#entidadSeleccion').val())
	});
	$("#entidadSeleccion").select2({data:getEntidades(),width: 'resolve' })
}
function buscarCtaCte(id)
{
	if(id)Session.set("idEntidadCta",id);
  $('#idEntidad').val(id);
    $('#idEntidad').select2().trigger('change');
	Meteor.call("ctaCte",Session.get("idEntidadCta"),function(err,res){
		Session.set("ctaCte",res);
	})
}
function getEntidades()
{
	var ents=Entidades.find().fetch();
	var data = $.map(ents, function (obj) {
  obj.id =  obj._id;
  obj.text=obj.razonSocial; // replace pk with your identifier

  return obj;
});
	return data;
}