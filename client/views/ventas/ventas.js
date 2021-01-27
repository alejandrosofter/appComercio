Template.verItems.helpers({
  
    'settingsItems': function(){
      var items=this.items;
        return {
 collection: items,
 rowsPerPage: 100,
          showNavigationRowsPerPage:false,
 class: "table table-condensed",
 showFilter: false,
 fields: [
   {
        key: 'cantidad',
        label: 'CANT.',
     headerClass: 'col-md-1',
   
      },
   {
        key: 'nombreProducto',
        label: 'PRODUCTO',
   
      },
 
 
    

   { 
        key: 'precioVenta',
        label: '$ Unidad',
     headerClass: 'col-md-2',
      fn: function (value, object, key) {
          return value.toFixed(2);  
         }
      },
  { 
        key: 'precioVenta',
        label: '$ total',
    headerClass: 'col-md-2',
      fn: function (value, object, key) {
          return (value*object.cantidad).toFixed(2);  
         }
      },
 ]
 };
    }
});
var getItems=function(items,content,x,y){
	y=y+4;
	var colorTabla="#ccc"
content.push({	canvas: [
				{
					type: 'rect',
					x: 20,
					y: 5,
					w: 50,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],})
content.push({	canvas: [
				{
					type: 'rect',
					x: 70,
					y: -16,
					w: 230,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},)
content.push({	canvas: [
				{
					type: 'rect',
					x: 290,
					y: -16,
					w: 63,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},)
content.push({	canvas: [
				{
					type: 'rect',
					x: 350,
					y: -16,
					w: 63,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},)
content.push({	canvas: [
				{
					type: 'rect',
					x: 410,
					y: -16,
					w: 70,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},)
content.push({	canvas: [
				{
					type: 'rect',
					x: 465,
					y: -16,
					w: 55,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},)
content.push({	canvas: [
				{
					type: 'rect',
					x: 520,
					y: -16,
					w: 60,
					h: 16,
					r: 0,
					color: colorTabla,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},)
content.push({text: "Código",absolutePosition: {x: x-7, y: y},bold:true, fontSize: 9} );
	content.push({text: "Producto / Servicio ",absolutePosition: {x: x+60, y: y},bold:true, fontSize: 9} );
	
		content.push({text: "Cantidad",absolutePosition: {x: x+260, y: y},bold:true, fontSize: 9} );
		content.push({text: "U. Medida ",absolutePosition: {x: x+320, y: y},bold:true, fontSize: 9} );

content.push({text: "Precio Unit.",absolutePosition: {x: x+375, y: y},bold:true, fontSize: 9} );

// content.push({text: "% Bonif",absolutePosition: {x: x+480, y: y},bold:true, fontSize: 12} );

content.push({text: "Imp. Bonif.",absolutePosition: {x: x+430, y: y},bold:true, fontSize: 9} );

content.push({text: "Subtotal",absolutePosition: {x: x+495, y: y},bold:true, fontSize: 9} );
var offSetItems=items.length==1?0:(items.length*10);

var itemsTabla=[];
	for(var i=0;i<items.length;i++){
		var auxTabla=[];
		y+=20;
		var aux=items[i];
		var total=aux.precioVenta*aux.cantidad;
		auxTabla.push({text: " ",bold:false, fontSize: 9} );
		auxTabla.push({text: aux.nombreProducto,bold:false, fontSize: 9} );
	  
		auxTabla.push({text: aux.cantidad+"",bold:false, fontSize: 9} );
		auxTabla.push({text: "Unidades",bold:false, fontSize: 9} );
		
		auxTabla.push({text: aux.precioVenta.toFixed(2),bold:false, fontSize: 9} );
		auxTabla.push({text: "0,00",bold:false, fontSize: 9} );
		
		auxTabla.push({text: total.toFixed(2),bold:false, fontSize: 9} );
		itemsTabla.push(auxTabla);
	}
	content.push({
      layout: 'noBorders',
      absolutePosition: {x: x, y: y-offSetItems},
      table: {

      	
        // headers are automatically repeated if the table spans over multiple pages
        // you can declare how many rows should be treated as headers
       
        widths: [ 30, 217, 50, 50,50,45,50 ],

        body:itemsTabla
      }
    })
	return content
}
var definicionPdf=function(venta)
{
	
	var entidad=Entidades.findOne({_id:venta.idEntidad.trim()});
	var d=new Date(venta.fecha);
	var empresa=Settings.findOne({clave:"nombreEmpresa"});
	var fe=venta.facturaElectronica?venta.facturaElectronica[0]:{tipoComprobante:"",nroDoc:"",tipoDoc:"",puntoVenta:"",nroFactura:"",nroCae:"",fechaVto:"",razonSocial:"",domicilio:""};
	var domicilio=Settings.findOne({clave:"domicilioEmpresa"});
	var condicionIva=Settings.findOne({clave:"condicionIvaEmpresa"});
	var ingresosBrutosEmpresa=Settings.findOne({clave:"ingresosBrutosEmpresa"});
	var fechaInicioEmpresa=Settings.findOne({clave:"fechaInicioEmpresa"});
	var puntoVenta=fe.puntoVenta.lpad("0",4);
	var nroComprobante=fe.nroFactura.lpad("0",8);
	var fecha=d.toLocaleDateString();
	var cuit=Settings.findOne({clave:"cuitEmpresa"});
	var cuitVenta=fe.nroDoc;
	//var tipoComp=TipoComprobanteElectronico.findOne({_id:fe.tipoComprobante});
	var tipoDoc=TipoDocsElectronico.findOne({_id:fe.tipoDoc});
	var iva=(venta.importe-(venta.importe/1.21)).toFixed(2)
	
	var comprobantesA=["1","2","3","4","5","63","60"];
	if(comprobantesA.indexOf(fe.tipoComprobante)==-1)
		iva="0,00";
	//var arr=tipoComp?tipoComp.label.split(" "):[];
	var letraComp=fe.tipoComprobante;
	var detalleComp="COD. 011";
		var docDefinition = {
					compress: false,
		footer: {
        columns: [
        {	canvas: [
				{
					type: 'rect',
					x: 20,
					y: -30,
					w: 560,
					h: 60,
					r: 0,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},
{
	table: {
				widths: [150,70],
				body: [
					[{text: "Subtotal: $",alignment: 'right',bold:true, fontSize: 10},
					{text: venta.importe.toFixed(2),alignment: 'right',bold:true, fontSize: 10},
					 ],
					 [{text: "Importe Otros Tributos: $",alignment: 'right',bold:true, fontSize: 10},
					 {text: iva+"",bold:true,alignment: 'right',  italic:true, fontSize: 9},
					 ],
					 [{text: "Importe Total: $",alignment: 'right',bold:true, fontSize: 10},
					 {text: venta.importe.toFixed(2),alignment: 'right',bold:true,  italic:true, fontSize: 9},
        
				]
				],
			},
			absolutePosition: {x: (335), y: -25},
			layout: 'noBorders'
		},
		 {
      absolutePosition: {x:25, y: 35},
      fit: [100, 100],
      image: 'data:image/jpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/9k='
    },
     {
   absolutePosition: {x: (0), y: 20},
      svg: '<svg class="barcode"jsbarcode-format="upc" jsbarcode-value="123456789012" jsbarcode-textmargin="0" jsbarcode-fontoptions="bold"></svg>'
    },
    {text: "Comprobante Autorizado",absolutePosition: {x: (120), y: 55},bold:true,italic:true, fontSize: 12},

		{
	table: {
				widths: [150,130],
				body: [
					[{text: "CAE N°:",alignment: 'right',bold:true, fontSize: 11},
					{text: fe.nroCae,alignment: 'right',bold:true, fontSize: 11},
					 ],
					 [{text: "Fecha de Vto. de CAE:",alignment: 'right',bold:true, fontSize: 11},
					 {text: fe.fechaVto,bold:true,alignment: 'right',  italic:true, fontSize: 11},
					 ],
					 
				],
			},
			absolutePosition: {x: (280), y: 40},
			layout: 'noBorders'
		},
					
					 
					 
					 
					
			]
    },
		content: [
			 
		
			{text: "FACTURA",absolutePosition: {x: (340), y: 50},bold:true, fontSize: 20},
			{
			table: {
				widths: [250],
				body: [
					[{text: empresa.valor,bold:true,alignment: 'center', fontSize: 20}],
				],
			},
			absolutePosition: {x: (30), y: 50},
			layout: 'noBorders'
		},
			
			{text: "Rázon Social: ",absolutePosition: {x: (30), y: 100},bold:true, fontSize: 10},

			{text: empresa.valor,absolutePosition: {x: (110), y: 100},bold:false, fontSize: 10},
			{text: "Domicilio Comercial: ",absolutePosition: {x: (30), y: 120},bold:true, fontSize: 12},
			{text: domicilio.valor,absolutePosition: {x: (160), y: 120},bold:false, fontSize: 10},
			{text: "Condición frente al IVA: ",absolutePosition: {x: (30), y: 140},bold:false, fontSize: 10},
			{text: condicionIva.valor,absolutePosition: {x: (160), y: 140},bold:false, fontSize: 10},
			{	canvas: [
				{
					type: 'rect',
					x: 20,
					y: 40,
					w: 280,
					h: 130,
					r: 0,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				{
					type: 'rect',
					x: 300,
					y: 40,
					w: 280,
					h: 130,
					r: 0,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				{
					type: 'rect',
					x: 275,
					y: 40,
					w: 50,
					h: 50,
					r: 0,
					color: '#fff',
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
			
],},
			{text: letraComp,absolutePosition: {x: (287), y: 37},bold:true, fontSize: 40},
			{text: detalleComp,absolutePosition: {x: (283), y: 80},bold:true,italic: true, fontSize: 8},
// 			{text: arr[0],absolutePosition: {x: (340), y: 50},bold:true, pageOrientation: 'landscape', pageBreak: 'after', fontSize: 25},
			{text: "Punto de Venta: ",absolutePosition: {x: 340, y: 90},bold:true, fontSize: 10},
			{text: puntoVenta,absolutePosition: {x: 413, y: 90},bold:false, fontSize: 10},
			

			{text: "Comp. Nro: ",absolutePosition: {x: 450, y: 90},bold:true, fontSize: 10},
			{text: nroComprobante,absolutePosition: {x: 515, y: 90},bold:true, fontSize: 10},

			{text: "Fecha de Emisión: ",absolutePosition: {x: 340, y: 105},bold:true, fontSize: 10},
			{text: fecha,absolutePosition: {x: 450, y: 105},bold:false, fontSize: 10},
			

			{text: "CUIT: ",absolutePosition: {x: 340, y: 125},bold:true, fontSize: 10},
			{text: cuit.valor,absolutePosition: {x: 370, y: 125},bold:false, fontSize: 10},

			{text: "Ingresos Brutos: ",absolutePosition: {x: 340, y: 140},bold:true, fontSize: 10},
			{text: ingresosBrutosEmpresa.valor,absolutePosition: {x: 420, y: 140},bold:false, fontSize: 10},
			
			
			
			
			
			
			{text: "Fecha de Inicio de Actividades: ",absolutePosition: {x: 340, y: 155},bold:true, fontSize: 10},
			{text: fechaInicioEmpresa.valor,absolutePosition: {x: 490, y: 155},bold:false, fontSize: 10},
			
			
			{	canvas: [
				{
					type: 'rect',
					x: 20,
					y: 5,
					w: 560,
					h: 20,
					r: 0,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},
{text: "Período Facturado Desde: ",absolutePosition: {x: (30), y: 180},bold:true, fontSize: 10},
			{text: fecha,absolutePosition: {x: (170), y: 180},bold:false, fontSize: 10},

{text: "Hasta: ",absolutePosition: {x: (245), y: 180},bold:true, fontSize: 10},
			{text: fecha,absolutePosition: {x: (280), y: 180},bold:false, fontSize: 10},

			{text: "Fecha de Vto. para el pago: ",absolutePosition: {x: (350), y: 180},bold:true, fontSize: 10},
			{text: fecha,absolutePosition: {x: (495), y: 180},bold:false, fontSize: 10},
{	canvas: [
				{
					type: 'rect',
					x: 20,
					y: 5,
					w: 560,
					h: 46,
					r: 0,
					//dash: {length: 5},
					 lineWidth: 1,
					lineColor: '#433e3b',
				},
				
			
],},
			{text: "CUIT: ",absolutePosition: {x: 30, y: 203},bold:true, fontSize: 10},
			{text: cuitVenta,absolutePosition: {x: 65, y: 203},bold:false, fontSize: 10},
			
			{text: "Apellido y Nombre / Razón Social: ",absolutePosition: {x: 200, y: 203},bold:true, fontSize: 10},
			{text: entidad.razonSocial.toUpperCase(),absolutePosition: {x: 360, y: 203},bold:false, fontSize: 10},
			
			{text: "Condición frente al IVA: ",absolutePosition: {x: 30, y: 218},bold:true, fontSize: 10},
			{text: (entidad.condicionIva?entidad.condicionIva:"S/N"),absolutePosition: {x: 145, y: 218},bold:false, fontSize: 10},

			{text: "Domicilio: ",absolutePosition: {x: 230, y: 218},bold:true, fontSize: 10},
			{text: (entidad.domicilio?entidad.domicilio:"S/N"),absolutePosition: {x: 290, y: 218},bold:false, fontSize: 10},

			{text: "Condición de venta: ",absolutePosition: {x: 30, y: 233},bold:true, fontSize: 10},
			
			{text: "Contado",absolutePosition: {x: 120, y: 233},bold:false, fontSize: 10},

			],
	
  // a string or { width: number, height: number }
   pageSize: 'A4',

  // by default we use portrait, you can change it to landscape if you wish
 // pageOrientation: 'landscape',

  // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
  pageMargins: [ 0, 0, 0, 100 ],
};
	docDefinition.content=getItems(venta.items,docDefinition.content,40,250);
	return docDefinition;
}
var crearPdf=function(venta)
{
	var docDefinition=definicionPdf(venta);
  pdfMake.createPdf(docDefinition).download();

}
Template.accionesVentas.helpers({
	"esElectronica":function(){
		if(this.facturaElectronica)return true;
		return false;
	},
	"tienePagos":function()
	{
		if(this.pagos)
		return this.pagos.length>0
	},
	"cantidadPagos":function()
	{
		if(this.pagos)
		return this.pagos.length
	},
})
Template.ventas.helpers({
	
    'settings': function(){
        return {
 collection: Ventas.find(),
 rowsPerPage: 10,
 class: "table table-condensed",
 showFilter: true,
 fields: [
   {
        key: 'fecha',
        label: 'Fecha',
     headerClass: 'col-md-1',
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
        key: 'razonSocialCliente',
        label: 'A quien?',
        fn: function (value, object, key) {
          console.log(value);
         if(value===null)return "CONS.FINAL";
          return value;
         }
      },
 
    
  { 
        key: 'importe',
        label: 'FACT. ELECT',
         headerClass: 'col-md-1',
      fn: function (value, object, key) {
				if(object.facturaElectronica)
					return "CAE: "+object.facturaElectronica[0].nroCae
         return "NO"
         }
      },
   { 
        key: 'importe',
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
			var saldo= (object.importe-sum).formatMoney(2,",");
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
        tmpl:Template.accionesVentas
      } 
 ]
 };
    }
});
var quitarVenta=function(id)
{
  var venta=Ventas.findOne({_id:id});  
  $(venta.items).each(function(key,valor){
    
    var producto=Productos.findOne({_id:valor.idProducto});
    var nuevaDisponibilidad=producto.disponibilidad+valor.cantidad;
    console.log(nuevaDisponibilidad);
    Productos.update(producto._id,{$set:{disponibilidad:nuevaDisponibilidad}});
  });
  Ventas.remove(id);
  
}
Template.imprimirFactura.rendered = function() {
 
}
Template.imprimirFactura.helpers({
  "fechaVto":function(){
		
    return this.facturaElectronica[0].fechaVto
  },
  "nroCae":function(){
    return this.facturaElectronica[0].nroCae
  },
  "nroDoc":function(){
    return this.facturaElectronica[0].nroDoc
  },
  "tipoComprobante":function(){
    var tipo=TipoComprobanteElectronico.findOne({_id:this.facturaElectronica[0].tipoComprobante})
    return tipo.label;
  },
  "tipoDocumento":function(){
    var tipo=TipoDocsElectronico.findOne({_id:this.facturaElectronica[0].tipoDoc})
    return tipo.label;
  },
  "fecha":function(){
    var d=new Date(this.fecha);
    return d.toLocaleDateString()
  },
  "items":function(){
    return this.items
  },
   "importe":function(){
    return this.importe
  },
   "razonSocial":function(){
   //  var ent=Entidades.findOne({_id:this.idEntidad});
    return this.razonSocialCliente;
  },
  
  
  
})

Template.facturar.helpers({
	
  "importe":function(){
    return this.importe.toFixed(2)
  }
})
var getParametros=function(res){
  var salida={};
  for(var i=0;i<res.length;i++){
      var valor=res[i].split('|');
     for(var j=0;j<valor.length;j++){
       var pars=(valor[j].split("%"));
       if(pars.length>1){
       var label=pars[0].trim();
       var valorItem=pars[1].trim();
       
        if(label==="R")salida.ingreso=valorItem==="R"?false:true;
       if(label==="CAE")salida.cae=valorItem;
       if(label==="VENC")salida.venc=valorItem;
       if(label==="OBS")salida.obs=valorItem;
				 if(label==="NRO")salida.nro=valorItem;
       }

     }
       
  }
 console.log(salida)
  return salida
  
    
  
}
var cargaVenta=function(resFacElec,venta){
  $("#nroCae").val(resFacElec.cae);
   $("#fechaVto").val(resFacElec.venc);
	 $("#nroFactura").val(resFacElec.nro);
  
  $("form#facturar_").submit()
}
var consultarDatosDni=function(nro)
{
	var url="https://soa.afip.gob.ar/sr-padron/v2/persona/"+nro;
	//UIBlock.block('Chequeando NRO DOC...');
	var res=$.getJSON(url,function(res){
		 UIBlock.unblock()
		if(res.success){
			$("#razonSocial").val(res.data.nombre);
			if(res.data.domicilioFiscal)$("#domicilio").val(res.data.domicilioFiscal.direccion); else $("#domicilio").val("")
		}else swal({   title: "Ops...",   text: "No se encuentra ese nro.. solo busca CUIT y CUIL",   type: "error"})
	});
}
Template.facturar.rendered = function() {
var ent=Entidades.findOne({_id:this.data.idEntidad});
console.log(ent,this.data)
if(ent){
	$("#nroDoc").val(ent.nroDocumento);
	$("#razonSocial").val(ent.razonSocial);
}
	
}
Template.facturar.events({
  "click #btnAceptar":function(){
   var importeVenta=this.importe;
    var venta=this;
    if(Settings.findOne({clave:"simulaFacturaElectronica"}).valor=="SI"){
    	var sn=Settings.findOne({clave:"nroElectronicaSimula"});
    	 var vto = new Date();
    	vto.setDate(vto.getDate() + 10);
    	var cae=Math.floor(Number(Settings.findOne({clave:"caeElectronicaSimula"}).valor)+(Math.random()*10000));
    	var datos={
    		cae: cae,
    		venc: vto.getFecha(),
    		nro: sn.valor,
    	}
    	var nuevoNro=Number(Settings.findOne({clave:"nroElectronicaSimula"}).valor)+1;

    	Settings.update({_id:sn._id},{$set:{valor:nuevoNro}});
		cargaVenta(datos)
    }else
    if(AutoForm.validateForm("facturar_"))
      {
        UIBlock.block('Verificando factura...');
   
        Meteor.call("facturar",$("#puntoVenta").val(),$("#tipoComprobante").val(),$('input[name=concepto]:checked').val(),$("#tipoDoc").val(),$("#nroDoc").val(),importeVenta,function(err,res){   
          UIBlock.unblock()
          var pythonRes=getParametros(res)
          if(pythonRes.ingreso)cargaVenta(pythonRes,venta);
          else swal({   title: "Ops...",   text: pythonRes.obs,   type: "error"})
         });
      }else  swal({   title: "Datos incompletos",   text: "Por favor chequee los campos y vuelva a intentar",   type: "warning"})
       
  }
})
Template.facturar.events({
	 'change #nroDoc': function(ev) {
		
	 }
})
Template.enviarEmailVenta.helpers({
	"emailCliente":function(){
		var ent=Entidades.findOne({_id:this.idEntidad});
		if(ent)return ent.email;
		return "-"
	}
})
Template.enviarEmailVenta.events({
	'click #btnEnviarMail': function(){
		var aux=Settings.findOne({clave:"emailEnvio"});
		var email=aux?aux.valor:"no@email.com";
			var docDefinition=definicionPdf(this);
    pdfMake.createPdf(docDefinition).getBase64(function(buffer) {
				var datos={from:email,to:$("#emailClienteVenta").val(),subject:"COMPROBANTE",text:"Le adjuntamos el comprobante ",adjunto:buffer};
		UIBlock.block('ENVIANDO EMAIL A <b>'+$("#emailClienteVenta").val()+"</b>");
    Meteor.call("enviarEmailVenta",datos,function(res){
			UIBlock.unblock();
			Modal.hide();
			 $('body').removeClass('modal-open');	
			$('.modal-backdrop').remove();
			swal("GENIAL!","Se ha enviado el mail exitosamente!","success")
		}); 
		 });
	
		
	},
})
const pdfMake= require('pdfmake/build/pdfmake');
Template.ventas.rendered=function(){
	 $('head').append('<script type="text/javascript" src="https://cdn.jsdelivr.net/jsbarcode/3.6.0/JsBarcode.all.min.js"></script>');
	 $('head').append('<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>');


}
function getCodigoBase64(codigo,contenedor){

}
Template.ventas.events({
	"click #btnBar":function(){

$("#imagen").attr("src",getCodigoBase64("holaaa","barcode2"));
	},
  'mouseover tr': function(ev) {
    $("#tablaVentas").find(".acciones").hide();
    $(ev.currentTarget).find(".acciones").show();
    
  },
    	'click .verItems': function(){
        var act=this;
        console.log("abre");
    Modal.show('verItems',function(){ return act; });
  $("#modalItems").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
    },
		'click .imprimeAfip': function(){
        var act=this;
			console.log(act)
			crearPdf(this)
//     Modal.show('imprimirFactura',function(){ return act; });
//   $("#modalItems").on("hidden.bs.modal", function () {
//     $('body').removeClass('modal-open');	
// $('.modal-backdrop').remove();
// });
    },
	
	'click .enviarMail': function(){
		    var act=this;
    Modal.show('enviarEmailVenta',function(){ return act; });
  $("#modalMailVenta").on("hidden.bs.modal", function () {
    $('body').removeClass('modal-open');	
$('.modal-backdrop').remove();
});
		
    },
    'click .pagos': function(){
		    var act=this;
		    Session.set("idPagoSeleccion",this._id);
		    Session.set("pagosVarios",this.pagos);
		    Session.set("tipoPagoVario","Ventas");
    Modal.show('pagosVarios',function(){ return act; });
  $("#pagosVariosModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open'); $('.modal-backdrop').remove() });
		
    },
    'click .nuevoPagoVario': function(){
	var dataPago={tipo:"Ventas",datos:this};
   Modal.show("nuevoPagoVario",function(){ return dataPago; });
   $("#nuevoPagoVarioModal").on("hidden.bs.modal", function () { $('body').removeClass('modal-open'); $('.modal-backdrop').remove() });
		
    },
	
   'click .delete': function(ev) {
    var id=this._id;
    swal({   title: "Estas Seguro de quitar?",   text: "Una vez que lo has quitado sera permanente!",   type: "warning",   showCancelButton: true,   confirmButtonColor: "#DD6B55",   confirmButtonText: "Si, borralo!",   closeOnConfirm: false }, function(){ quitarVenta(id); swal("Quitado!", "El registro ha sido borrado", "success"); });

  },
  'click .update': function(ev) {
    Router.go('/editarVenta/'+this._id);
  },
  'click .facturar': function(ev) {
   Router.go('/facturar/'+this._id);
  },
}),

AutoForm.hooks({
	
  'facturar_': {
   
    onSuccess: function(operation, result, template) {
      //swal("GENIAL!", "Se ha ingresado la Factura Electronica!", "success");
      var res=Ventas.findOne({_id:this.docId});
      console.log(res);
     // Router.go('/nuevaVenta/');
			
			crearPdf(res);
					  Router.go('/nuevaVenta/');
			
    },
    onError: function(operation, error, template) {
					
      swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados: "+error, "error");
		
		
    }
  }
});