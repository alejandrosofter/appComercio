var consultarItemsCierre=function(strDate,idCuenta,strColeccion,importeNegativo)
	{
		var Coleccion=eval(strColeccion);
		var fecha=moment(strDate);
		//console.log("CONSULTANDO consultarItemsCierre "+fecha+" idCuenta: "+idCuenta+" col: "+strColeccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$pagos" };
		console.log(fecha.date());
		console.log(fecha.month());
		console.log(fecha.year());
		var match = { $match: {idCuenta:idCuenta,ano:fecha.year(),mes:fecha.month()+1,dia:fecha.date() } };
		var strImporte=importeNegativo?"$subtract:[$pagos.importe]":"$pagos.importe";

		var detalleItems=strColeccion=="OrdenesTrabajo"?"$descripcionCliente":"$items";
		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				fecha: "$pagos.fecha",
				importe: "$pagos.importe",
				interes: "$pagos.interes",
				ano:{$year:"$pagos.fecha"},
				mes:{$month:"$pagos.fecha"},
				dia:{$dayOfMonth:"$pagos.fecha"},
				tipo:{$concat:[strColeccion]},
				idCuenta: "$pagos.idCuenta",
				detalle:detalleItems
				
			}
		};

		var pipeline = [unw, proyecto,match ];
		var res = Coleccion.aggregate(pipeline);
		return res;
	}
var consultarPagosMesRango=function(desdeFecha,hastaFecha,idCentroCosto,strColeccion)
	{
		var Coleccion=eval(strColeccion);
		//console.log("CONSULTANDO mes "+mes+" ano: "+ano+" strColeccion: "+strColeccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var objFecha={};

		if(desdeFecha)Object.assign(objFecha, {$gte: desdeFecha});
		if(hastaFecha)Object.assign(objFecha, {$lt: hastaFecha});
		var unw = { $unwind: "$pagos" };
		
		var grupo={$group: {_id: 1,total:{$sum:"$importe"}}};

		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				fecha: "$pagos.fecha",
				ano:{$year:"$pagos.fecha"},
				mes:{$month:"$pagos.fecha"},
				importe: "$pagos.importe",
				interes: "$pagos.interes",
				idEntidad:"$idEntidad",
				tipo:{$concat:[strColeccion]},
				idCuenta: "$pagos.idCuenta",
				idCentroCosto: "$idCentroCosto",
				detalle:"$detalle",
				items:"$items"
				
			}
		};
		
		match= { $match: {fecha: objFecha}};
		if(idCentroCosto)match.$match.idCentroCosto=idCentroCosto;
		console.log(match)
		var pipeline = [unw, proyecto,match ];
		// if(agrupa)pipeline.push(grupo);
		var res = Coleccion.aggregate(pipeline);
		console.log(res)
		return res;
	}
var consultarPagosMes=function(mes,ano,strColeccion,agrupa,idCentroCosto)
	{
		var Coleccion=eval(strColeccion);
		//console.log("CONSULTANDO mes "+mes+" ano: "+ano+" strColeccion: "+strColeccion);
		var ordenar = {
			$sort: {
				_id: 1
			}
		};
		var unw = { $unwind: "$pagos" };
		var match = { $match: {mes:mes,ano:ano } };
		var grupo={$group: {_id: 1,total:{$sum:"$importe"}}};

		var detalleItems=strColeccion=="OrdenesTrabajo"?"$descripcionCliente":"$items";
		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				fecha: "$pagos.fecha",
				ano:{$year:"$pagos.fecha"},
				mes:{$month:"$pagos.fecha"},
				importe: "$pagos.importe",
				interes: "$pagos.interes",
				tipo:{$concat:[strColeccion]},
				idCuenta: "$pagos.idCuenta",
				idCentroCosto: "$idCentroCosto",
				detalle:detalleItems
				
			}
		};
		if(idCentroCosto)match.$match.idCentroCosto=idCentroCosto;
		var pipeline = [unw, proyecto,match ];
		if(agrupa)pipeline.push(grupo);
		var res = Coleccion.aggregate(pipeline);
		return res;
	}
var getTotalVentas=function(ano,mes,estado,agrupa)
{
//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
  var ordenar={ $sort : { _id : 1 } };
	
   var grupo={$group: {_id: 1,total:{$sum:"$importe"}}};
	
   var proyecto={$project:{_id:1,idEntidad:"$idEntidad",total:1,fecha:"$fecha",items:"$items",importe:"$importe",ano:{$year:"$fecha"},mes:{$month:"$fecha"}, }};
		var match={$match:{ano:ano}};
	if(mes!==null)match.$match.mes=mes;
	if(estado!==null)match.$match.default=estado;
 var lookup={$lookup:
       {
         from: "entidades",
         localField: "idEntidad",
         foreignField: "_id",
         as: "entidad"
       }};
   var pipeline = [proyecto,lookup,match ];
	if(agrupa)pipeline.push(grupo);
var res= Ventas.aggregate(pipeline);
	if(res.length>0)return res;
	return null;
}
var getTotalCompras=function(ano,mes,estado,agrupa)
{
//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
  var ordenar={ $sort : { _id : 1 } };
	
   var grupo={$group: {_id: 1,total:{$sum:"$importe"}}};
	
   var proyecto={$project:{_id:1,total:1,fecha:"$fecha",items:"$items",importe:"$importeTotal",ano:{$year:"$fecha"},mes:{$month:"$fecha"}, }};
		var match={$match:{ano:ano}};
	if(mes!==null)match.$match.mes=mes;
	if(estado!==null)match.$match.default=estado;

   var pipeline = [proyecto,match ];
	if(agrupa)pipeline.push(grupo);
	// console.log(pipeline)
var res= Compras.aggregate(pipeline);
console.log(res)
	if(res.length>0)return res;
	return null;
}
var getTotalOrdenes=function(ano,mes,estado,agrupa)
{
//console.log("ano: "+ano+" mes:"+mes+" estadi:"+estado+" agrupa:"+agrupa);
  var ordenar={ $sort : { _id : 1 } };
	
   var grupo={$group: {_id: 1,total:{$sum:"$importe"}}};
	
   var proyecto={$project:{_id:1,total:1,fecha:"$ingreso",importe:"$importe",ano:{$year:"$ingreso"},mes:{$month:"$ingreso"}, }};
		var match={$match:{ano:ano}};
	if(mes!==null)match.$match.mes=mes;
	if(estado!==null)match.$match.default=estado;

   var pipeline = [proyecto,match ];
	if(agrupa)pipeline.push(grupo);
	// console.log(pipeline)
var res= OrdenesTrabajo.aggregate(pipeline);
console.log(res)
	if(res.length>0)return res;
	return null;
}
var getTotalGral=function(ano,mes,estado,agrupa)
{
  var ventas=getTotalVentas(ano,mes,estado,true);
  var compras=getTotalCompras(ano,mes,estado,true);
   var ordenes=getTotalOrdenes(ano,mes,estado,true);


      if(agrupa){
		      var sum=0;
		      if(ventas)sum+= ventas[0].total;
		      if(compras)sum-= compras[0].total;
		      if(ordenes)sum+= ordenes[0].total;
		      return sum;
      }
    var arr=[{"tipo":"VENTAS","importe":0},{"tipo":"COMPRAS","importe":0},{"tipo":"ORDENES DE TRABAJO","importe":0}]
  	if(ventas)arr[0].importe=ventas[0].total;
  	if(compras)arr[1].importe=-compras[0].total;
  	if(ordenes)arr[2].importe=ordenes[0].total;
   return arr
  
}

var getTotalVentasDia=function(ano,mes,dia,agrupa)
{

  var ordenar={ $sort : { _id : 1 } };
	
   var grupo={$group: {_id: 1,importe:{$sum:"$importe"}}};
	
   var proyecto={$project:{_id:1,idEntidad:"$idEntidad",total:1,fecha:"$fecha",items:"$items",importe:"$importe",ano:{$year:"$fecha"},dia:{$dayOfMonth:"$fecha"},mes:{$month:"$fecha"}, }};
		var match={$match:{ano:ano,mes:mes,dia:dia}};

var lookup={$lookup:
       {
         from: "entidades",
         localField: "idEntidad",
         foreignField: "_id",
         as: "entidad"
       }};
   var pipeline = [proyecto,match,lookup ];
	if(agrupa)pipeline.push(grupo);

var res= Ventas.aggregate(pipeline);
		 console.log(res)
	if(res.length>0)return res;
	return null;
}

var getTotalVentasDiaFormaDePago=function(ano,mes,dia,agrupa)
{
console.log("ano: "+ano+" mes:"+mes+" dia:"+dia+" estadi: agrupa:"+agrupa);
  var ordenar={ $sort : { _id : 1 } };
	
   var grupo={$group: {_id: "$formaPago",importe:{$sum:"$importe"}}};
	
   var proyecto={$project:{_id:1,formaPago:"$formaPago",razonSocial:"$razonSocialCliente",total:1,fecha:"$fecha",items:"$items",importe:"$importe",ano:{$year:"$fecha"},dia:{$dayOfMonth:"$fecha"},mes:{$month:"$fecha"}, }};
		var match={$match:{ano:ano,mes:mes,dia:dia}};


   var pipeline = [proyecto,match ];
	if(agrupa)pipeline.push(grupo);

var res= Ventas.aggregate(pipeline);
		 console.log(res)
	if(res.length>0)return res;
	return null;
}
mesLetras=function(mes)
{
  if(mes==1)return "ENERO";
  if(mes==2)return "FEBRERO";
  if(mes==3)return "MARZO";
  if(mes==4)return "ABRIL";
  if(mes==5)return "MAYO";
  if(mes==6)return "JUNIO";
  if(mes==7)return "JULIO";
  if(mes==8)return "AGOSTO";
  if(mes==9)return "SEPTEMBRE";
  if(mes==10)return "OCTUBRE";
  if(mes==11)return "NOVIEMBRE";
  if(mes==12)return "DICIEMBRE";
  return "s/a";
}
cantidadDiasMes=function(month,year) {
    return new Date(year, month, 0).getDate();
}
var descontarStock=function(value)
{
	var producto = Productos.findOne({
		_id: value.idProducto
	});
	var nuevaCantidad = producto.disponibilidad - value.cantidad; //DESCUENTO DE STOCK
	//var nuevoHistorial=producto.historial==null?[]:producto.historial;
	var aux={fecha: new Date() ,precioCompra:0,precioVenta:producto.precioCompra,cantidadUsada:value.cantidad,motivo:"VENTA",disponibles:producto.disponibilidad};
	//nuevoHistorial.push(aux);
	Productos.update(producto._id, {
		$set: {
			disponibilidad: nuevaCantidad,
			//historial:nuevoHistorial
		}
	});
	Productos.update(producto._id, {
		$push: {
			historial:{
				$each:[aux]
			}
		}
	});
}
var descargarArchivo=function(arch)
{
	var fs = Npm.require('fs');
	console.log(arch)
	var xsd = fs.readFileSync(arch, 'utf8')
	return(xsd)
}
var consultaAnual=function(ano,strColeccion,agrupa,centroCosto)
{
	var salida=[];
	ano=ano*1;
	for(var i=1;i<=12;i++){
		res=consultarPagosMes(i,ano,strColeccion,agrupa,centroCosto);
		salida.push(res.length>0?res[0].total:0);

	}
	return salida;
}
var getNuevoId=function(idActual){
  var centros=CentroCostos.find({},{sort: {nombreCentroCosto: -1}}).fetch();
  for(var i=1;i<centros.length;i++)
    if(centros[i]._id!=idActual)return centros[i]._id;
  return null;
}
var getOrdenesEntidad=function (idEntidad,estado)
{
		
		var unw = { $unwind: "$pagos" };
		var match = { $match: {estado:estado,idEntidad:idEntidad } };
		var proyecto = {
			$project: {
				id: "$_id",
				pagos:"$pagos",
				importe:"$importe",
				tipo:{$concat:["ORDENES"]},
				detalle:"$descripcionCliente",
				estado:"$estado",
				idEntidad:"$idEntidad",

				
			}
		};
		var pipeline = [proyecto,match ];
		return OrdenesTrabajo.aggregate(pipeline);
}

var getPagosOrdenes=function (idCuenta,fecha)
{
		//console.log("CONSULTANDO mes "+mes+" ano: "+ano+" strColeccion: "+strColeccion);
		var lookup={$lookup:
       {
         from: "entidades",
         localField: "idEntidad",
         foreignField: "_id",
         as: "entidad"
       }};
       if(!fecha)fecha=new Date();
		var unw = { $unwind: "$pagos" };
		var match = { $match: {idCuenta:idCuenta,mes:fecha.getMonth()+1,ano:fecha.getFullYear(),dia:fecha.getDate() } };
// console.log(fecha.getMonth(),fecha.getDate() )
		//var match={$match:{ $fecha:{$not: {$type: 9}}}};
		var proyecto = {
			$project: {
				id: "$_id",
				fechaPago: "$pagos.fecha",
				fecha:"$pagos.fecha",
				ano:{$year:"$pagos.fecha"},
				mes:{$month:"$pagos.fecha"},
				dia:{$dayOfMonth:"$pagos.fecha"},
				importe: "$pagos.importe",
				interes: "$pagos.interes",
				idCuenta: "$pagos.idCuenta",
				tipo:{$concat:["ORDENES"]},
				detalle:"$descripcionCliente",
				estado:"$estado",
				idEntidad:"$idEntidad",

				
			}
		};
		var pipeline = [unw, proyecto,lookup,match ];
		return OrdenesTrabajo.aggregate(pipeline);
}
var getPagosCompras=function (idCuenta,fecha)
{
		//console.log("CONSULTANDO mes "+mes+" ano: "+ano+" strColeccion: "+strColeccion);
		var lookup={$lookup:
       {
         from: "entidades",
         localField: "idEntidad",
         foreignField: "_id",
         as: "entidad"
       }};
		var unw = { $unwind: "$pagos" };
		var match = { $match: {idCuenta:idCuenta,mes:fecha.getMonth()+1,ano:fecha.getFullYear(),dia:fecha.getDate() } };
// console.log(fecha.getMonth(),fecha.getDate() )
		//var match={$match:{ $fecha:{$not: {$type: 9}}}};
		var proyecto = {
			$project: {
				id: "$_id",
				fechaPago: "$pagos.fecha",
				fecha:"$pagos.fecha",
				ano:{$year:"$pagos.fecha"},
				mes:{$month:"$pagos.fecha"},
				dia:{$dayOfMonth:"$pagos.fecha"},
				importe: "$pagos.importe",
				interes: "$pagos.interes",
				idCuenta: "$pagos.idCuenta",
				tipo:{$concat:["COMPRAS"]},
				estado:"$estado",
				
				items:"$items",
				razonSocial:"$razonSocial",

				
			}
		};
		var pipeline = [unw, proyecto,match ];
		return Compras.aggregate(pipeline);
}
var getPagosVentas=function (idCuenta,fecha)
{
	
	var lookup={$lookup:
       {
         from: "entidades",
         localField: "idEntidad",
         foreignField: "_id",
         as: "entidad"
       }};
		var unw = { $unwind: "$pagos" };
		var match = { $match: {idCuenta:idCuenta,mes:fecha.getMonth()+1,ano:fecha.getFullYear(),dia:fecha.getDate() } };
//var match={$match:{ $fecha:{$not: {$type: 9}}}};
		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				fecha:"$pagos.fecha",
				fechaPago: "$pagos.fecha",
				ano:{$year:"$pagos.fecha"},
				mes:{$month:"$pagos.fecha"},
				dia:{$dayOfMonth:"$pagos.fecha"},
				importe: "$pagos.importe",
				interes: "$pagos.interes",
				idCuenta: "$pagos.idCuenta",
				tipo:{$concat:["VENTAS"]},
				items:"$items",
				estado:"$estado",
				idEntidad:"$idEntidad",

				
			}
		};
		var pipeline = [unw, proyecto,match,lookup ];
		return Ventas.aggregate(pipeline);
}
var getUltimoCierre=function(idCuenta,fecha)
{
	var unw = { $unwind: "$cierres" };
		var match = { $match: {idCuenta:idCuenta } };
//var match={$match:{ $fecha:{$not: {$type: 9}}}};
		var proyecto = {
			$project: {
				_id: 1,
				id: "$_id",
				fecha:"$cierres.fecha",
				ano:{$year:"$cierres.fecha"},
				mes:{$month:"$cierres.fecha"},
				dia:{$dayOfMonth:"$cierres.fecha"},
				importe: "$cierres.importeReal",
				importeReal: "$cierres.importe",
				importeAbre: "$cierres.importeAbre",
				idCuenta: "$_id",
				tipo:{$concat:["CIERRE"]},

				
			}
		};
		var order={ $sort : { fecha : -1 } };
		var pipeline = [unw, proyecto,match,order,{ $limit : 1 } ];
		return Cuentas.aggregate(pipeline);
}
var getCierre=function(idCuenta,fecha)
{
	if(fecha){
	var unw = { $unwind: "$cierres" };
		var match = { $match: {idCuenta:idCuenta,
			ano:fecha.getFullYear(),dia:fecha.getDate(),
			mes:fecha.getMonth()+1, } };
		var proyecto = { 
			$project: {
				_id: 1,
				id: "$_id",
				fecha:"$cierres.fecha",
				ano:{$year:"$cierres.fecha"},
				mes:{$month:"$cierres.fecha"},
				dia:{$dayOfMonth:"$cierres.fecha"},
				importe: "$cierres.importeReal",
				idCierre: "$cierres._id",
				importeReal: "$cierres.importe",
				importeAbre: "$cierres.importeAbre",
				idCuenta: "$_id",
				tipo:{$concat:["CIERRE"]},

				
			}
		};
		var pipeline = [unw, proyecto,match];
		return Cuentas.aggregate(pipeline);
	}else return []
}
var getPagosCuenta=function(idCuenta,fecha)
{
	var salida=[];
	if(fecha)salida=getPagosOrdenes(idCuenta,fecha);
	if(fecha)salida=salida.concat(getPagosVentas(idCuenta,fecha));
	if(fecha)salida=salida.concat(getPagosCompras(idCuenta,fecha));
	if(fecha)salida=salida.concat(getUltimoCierre(idCuenta,fecha));
	return salida;
}
var getItemsCierre=function(items)
{
	var sal=[];
	for(var i=0;i<items.length;i++)
		sal.push({detalle:"-" ,importe:items[i].importe ,interes:0,fecha:items[i].fecha ,tipo:items[i].tipo})
	return sal;
}
var getImporteCierre=function(items)
{
	var sum=0;
	for(var i=0;i<items.length;i++)
		if(items[i].tipo=="COMPRAS" )sum-=items[i].importe;
	else sum+=items[i].importe;
	return sum;
}
var getImportePagos=function(items)
{
	var sum=0;
	for(var i=0;i<items.length;i++)sum+=items[i].importe;
	
	return sum;
}
var actualizarPagoColeccion=function(id,coleccion){
	var Coleccion=eval(coleccion);
		var data=Coleccion.findOne({_id:id});
		var importe=data.importe;
		var pagado=getImportePagos(data.pagos);
		var estado=pagado<importe?"PENDIENTE":"CANCELADO";
		Coleccion.update({_id:id},{$set:{estado:estado}});
		return estado;
}
var getPagosColeccion=function (idEntidad,campos,desde,hasta,idCuenta,unw)
{
		var Coleccion=eval(campos.coleccion);
		var objMatch={};
		var objFecha={};

		if(idEntidad)Object.assign(objMatch, {idEntidad: idEntidad});
		if(idCuenta)Object.assign(objMatch, {idCuenta: idCuenta});
		if(desde)Object.assign(objFecha, {$gte: desde});
		if(hasta)Object.assign(objFecha, {$lt: hasta});
		if(Object.keys(objFecha).length>0)Object.assign(objMatch, {fechaPago: objFecha});
		
		var match = { $match: objMatch };
		var proyecto = {
			$project: {
				_id: (unw?"$pagos._id":"$_id"),
				importeTotal:"$"+campos.importe,
				importePago:"$pagos.importe",
				fechaPago:"$pagos.fecha",
				tipo:{$concat:[campos.coleccion]},
				detalle:"$"+campos.detalle,
				detalle2:"$"+campos.detalle2,
				estado:"$estado",
				pagos:"$pagos",
				fecha:"$"+campos.fecha,
				idEntidad:"$idEntidad",
				idCuenta:"$pagos.idCuenta",
				idCentroCosto:"$idCentroCosto"

				
			}
		};
		var pipeline = [];
		if(unw)pipeline.push({ $unwind: { path: "$pagos"} });// preserveNullAndEmptyArrays: false 

		pipeline.push(proyecto);
		
		pipeline.push(match);
		return Coleccion.aggregate(pipeline);
}

var getDeudaColeccion=function (campos)
{
		var Coleccion=eval(campos.coleccion);
		var objMatch={};

		if(idEntidad)Object.assign(objMatch, {idEntidad: idEntidad});
		if(idCuenta)Object.assign(objMatch, {idCuenta: idCuenta});
		
		var match = { $match: objMatch };
		var proyecto = {
			$project: {
				_id: "$_id",
				importeTotal:"$"+campos.importe,
				importePago:"$pagos.importe",
				fechaPago:"$pagos.fecha",
				tipo:{$concat:[campos.coleccion]},
				detalle:"$"+campos.detalle,
				detalle2:"$"+campos.detalle2,
				estado:"$estado",
				pagos:"$pagos",
				fecha:"$"+campos.fecha,
				idEntidad:"$idEntidad",
				idCuenta:"$pagos.idCuenta",
				idCentroCosto:"$idCentroCosto"

				
			}
		};
		var pipeline = [];

		pipeline.push(proyecto);
		
		pipeline.push(match);
		return Coleccion.aggregate(pipeline);
}

Meteor.methods({
	"ingresarPagoCompra":function(data){
		var dataPago={fecha:data.fecha,importe:data.importe,interes:0,idCuenta:data.idCuenta};
		console.log(data,dataPago)
		return Compras.update({_id:data.idPago},{$push:{pagos:dataPago}})
	},
	"informeCentroCostos":function(desde,hasta,idCentroCosto){
		var desde=moment(desde, "DD/MM/YYYY").toDate();
		var hasta=moment(hasta, "DD/MM/YYYY").toDate();
		if(!moment(desde, "DD/MM/YYYY").isValid())return false;
		if(!moment(hasta, "DD/MM/YYYY").isValid())return false;
		return consultarPagosMesRango(desde,hasta,idCentroCosto,"Compras")
	},
	"mensajes.wsap":function(){

	},
	"images.deleteAll":function()
	{
		Images.remove({});
	},
	"productos.quitarImagen":function(idProducto,id)
	{
		console.log(idProducto,id)
		return Productos.update({ _id: idProducto }, { $pull: { imagenes: { _id: id } } }, 
		{ getAutoValues: false });
	},
	"productos.ingresarImagen":function(idImagen,idProducto)
	{
		console.log(idProducto,idImagen)
		var dataImagen={_id:idImagen};
		return Productos.update({_id:idProducto},{$push:{imagenes:dataImagen}})
	},
	"cuentas.all":function(){
		return Cuentas.find().fetch()
	},
	"buscarDeuda":function(tipo){
		var objCompras={coleccion:"Compras",importe:"importeTotal", fecha:"fecha",detalle2:"detalle",detalle:"items"};
		var compras=getDeudaColeccion(objCompras);
		return compras;
	},
	"buscarCuenta":function(desde,hasta,idCuenta)
	{
		console.log(idCuenta)
		var desde=moment(desde, "DD/MM/YYYY").toDate();
		var hasta=moment(hasta, "DD/MM/YYYY").toDate();
		var ordenes=getPagosColeccion(null,{coleccion:"OrdenesTrabajo",importe:"importe", fecha:"ingreso",detalle:"descripcionCliente",detalle:"descripcionCliente"},desde,hasta,idCuenta,true)
		 var ventas=getPagosColeccion(null, {coleccion:"Ventas",importe:"importe", fecha:"fecha",detalle:"items",detalle:"items"},desde,hasta,idCuenta,true)
		 var compras=getPagosColeccion(null,{coleccion:"Compras",importe:"importeTotal", fecha:"fecha",detalle2:"detalle",detalle:"items"},desde,hasta,idCuenta,true)
		return ordenes.concat(ventas,compras)
	},
	"quitarItemCompra":function(id,item)
	{
		console.log(id,item)
		return Compras.update({
			_id: id
		}, {
			$pull: {
				items: {
					_id: item
				}
			}
		}, {
			getAutoValues: false
		});
	},
	"getItemsCompra":function(id)
	{
		return Compras.findOne({_id:id}).items;
	},
	"ctaCte":function(idEntidad){
		var mapeoOrdenes={}
		var ordenes=getPagosColeccion(idEntidad,{coleccion:"OrdenesTrabajo",importe:"importe", fecha:"ingreso",detalle:"descripcionCliente",detalle:"descripcionCliente"})
		var ventas=getPagosColeccion(idEntidad, {coleccion:"Ventas",importe:"importe", fecha:"fecha",detalle:"items",detalle:"items"})
		var compras=getPagosColeccion(idEntidad,{coleccion:"Compras",importe:"importeTotal", fecha:"fecha",detalle2:"detalle",detalle:"items"})
		console.log(ventas)
		return ordenes.concat(compras,ventas).ordenar("fecha")
	},
	"compras.cargar":function(data)
	{
		var items=[{detalle:data.detalle,importe:data.importe,total:data.importe,cantidad:1,bonificacion:0}]
		var cc= CentroCostos.findOne({moduloDefault:{$regex: "Compras", $options: '-i'}});
		if(cc)data.idCentroCosto=cc._id;
		else data.idCentroCosto="Compras";
		data.pagos=[{idCuenta:data.idFormaPago,importe:data.importe,interes:0,fecha:data.fecha}];
		data.estado="PENDIENTE";
		data.items=items;
		data.importeTotal=data.importe;
		return Compras.insert(data)
	},
	"entidades.saldo":function(idEntidad){
		var ordenes=OrdenesTrabajo.find({idEntidad:idEntidad},{$set:{estado:"FINALIZADA"}});
		var compras=Compras.find({idEntidad:idEntidad});
		var ventas=Ventas.find({idEntidad:idEntidad});
		return {compras:compras,ventas:ventas,ordenes:ordenes};
	},
	"ordenesTrabajo.marcarFinalizada":function(nroOrden)
	{
		return OrdenesTrabajo.update({nroOrden:nroOrden},{$set:{estado:"FINALIZADA",entregado:true}})
	},
	"ordenesTrabajo.one":function(nroOrden)
	{
		return OrdenesTrabajo.findOne({nroOrden:nroOrden})
	},
	"ordenes.cargarPago":function(data)
	{
		var orden=OrdenesTrabajo.findOne({nroOrden:data.nroOrden});
		if(orden){
			var dataPago={importe:Number(data.importe),idCuenta:data.idCuenta,interes:0,fecha:data.fecha};
			return OrdenesTrabajo.update({_id:orden._id},{$push:{pagos:dataPago}})

			
		}else process.exit("No encontre la orden")
	},
	"cuentas.find":function()
	{
		return Cuentas.find().fetch()
	},
	"entidades.insert":function(data){
		return Entidades.insert(data)
	},
	"ordenDefault":function()
	{ 
		var dataOrden={descripcionesReparador:[],pagos:[],productos:[],estado:"PENDIENTE",entregado:false,nroOrden:0,importe:0,descripcionCliente:"",idEntidad:"",ingreso:(new Date()),idCentroCosto:""};
		var cc=CentroCostos.findOne({moduloDefault:"OrdenesTrabajo" })
		dataOrden.nroOrden= Number(Settings.findOne({clave:"proximoNroOrden"}).valor);
		dataOrden.idCentroCosto=cc?cc._id:"no";
		return dataOrden
	},
	"ordenesTrabajo.insert":function(data){
		return OrdenesTrabajo.insert(data)
	},
	"entidades.find":function(entidad)
	{
		
		var res= Entidades.find({razonSocial:{$regex: entidad, $options: '-i'}})
	
		return res.fetch()
	},
	"ordenesTrabajo.update":function(id,data)
	{
		return OrdenesTrabajo.update({_id:id},{$set:data});
	},
	"chequearPago":function(id,coleccion)
	{
		var resAct= actualizarPagoColeccion(id,coleccion)
		return resAct
	},
	"accesoMercadoPago":function()
	{
		var access= Settings.findOne({clave:"mercadoPago_access"});
		var token= Settings.findOne({clave:"mercadoPago_token"});



		return {access:access?access.valor:null,token:token?token.valor:null};
	},
	"quitarCierre":function(idCierre,idCuenta)
	{
		return Cuentas.update({
			_id: idCuenta
		}, {
			$pull: {
				cierres: {
					_id: idCierre
				}
			}
		}, {
			getAutoValues: false
		});
	},
	"cerrarCaja":function(id,pagos,fecha,importeReal)
	{
		var items=getItemsCierre(pagos);
		var importe=getImporteCierre(pagos);
		var aux={fecha:fecha,importe:importe,importeReal:importeReal,importeAbre:0,detalle:"Cierre automatico",items:items};
		return Cuentas.update({ _id: id
			}, {
				$push: {
					cierres: aux
				}
			});
	},
	"buscarCaja":function(id,fecha){
		return getCierre(id,fecha)
	},
	"buscarValoresCuentas":function(fecha)
	{
		var sal=[];
		var cuentas=Cuentas.find().fetch();
		for(var i=0;i<cuentas.length;i++){
			var aux=cuentas[i];
			aux.pagos=getPagosCuenta(cuentas[i]._id,fecha);
			sal.push(aux)
		}
		return sal;
	},
	"cambiarCC":function(tipo,nuevoid,id)
	{
		var Tipo=eval(tipo);
    	Tipo.update({_id:id},{$set:{idCentroCosto:nuevoid}});
	},
	"informeAnual":function(ano)
	{
		var ventas=consultaAnual(ano,"Ventas",true,null);
		var compras=consultaAnual(ano,"Compras",true,null);
		var ordenes=consultaAnual(ano,"OrdenesTrabajo",true,null);
		var sal= {compras:compras,ventas:ventas,ordenes:ordenes};
		
		return sal;

	},
	"consultarPagosMes":function(ano,mes,strColeccion,agrupa,centroCosto)
	{
		return consultarPagosMes(mes,ano,strColeccion,agrupa,centroCosto);

	},
	"consultarPagosMesArea":function(tipo,ano,mes,agrupa,centroCosto)
	{
		//tipo= 1 ordenes, 2 compras,3 ventas
		var ventas= consultarPagosMes(mes,ano,"Ventas",agrupa,centroCosto);
		var compras= consultarPagosMes(mes,ano,"Compras",agrupa,centroCosto);
		var ordenes= consultarPagosMes(mes,ano,"OrdenesTrabajo",agrupa,centroCosto);
		if(tipo==1)return ordenes;
		if(tipo==2)return compras;
		if(tipo==3)return ventas;
		return ventas.concat(compras,ordenes);
	},
	"informeAnualCentroCostos":function(ano)
	{
		var cc=CentroCostos.find().fetch();
		var data=[];
		for(var i=0;i<cc.length;i++)
			data.push({
				centroCosto:cc[i],
				ventas:consultaAnual(ano,"Ventas",true,cc[i]._id),
				compras:consultaAnual(ano,"Compras",true,cc[i]._id),
				ordenes:consultaAnual(ano,"OrdenesTrabajo",true,cc[i]._id) })

		
		
		return data;

	},
	"quitarCierreCuenta":function(idCuenta,id,importe)
	{
		Cuentas.update({
			_id: idCuenta
		}, {
			$pull: {
				cierres: {
					_id: id
				}
			}
		}, {
			getAutoValues: false
		});
		var importeCuenta=Cuentas.findOne({_id:idCuenta}).importe;
		var nuevoImporte=importeCuenta-importe;
		Cuentas.update({_id:idCuenta},{$set:{importe:nuevoImporte}});
		var items=Cuentas.findOne({_id:idCuenta}).cierres;
		return items?items:[];
	},
	"buscarItemsCierre":function(strDate,idCuenta)
	{	
		var parts=strDate.split("T");
		//var parts=parts[0].split("-");

		
		var ventas=consultarItemsCierre(strDate,idCuenta,"Ventas");
		var compras=consultarItemsCierre(strDate,idCuenta,"Compras",true);
		var ordenesTrabajo=consultarItemsCierre(strDate,idCuenta,"OrdenesTrabajo");

		var arr= ventas.concat(compras,ordenesTrabajo);
		
		return arr;
	},
	"quitarPagoVario":function(idVenta,id,tipo)
	{
		//puede ser Ventas o Compras
		var Coleccion=eval(tipo);
		Coleccion.update({
			_id: idVenta
		}, {
			$pull: {
				pagos: {
					_id: id
				}
			}
		}, {
			getAutoValues: false
		});
		var items=Coleccion.findOne({_id:idVenta}).pagos;
		actualizarPagoColeccion(idVenta,tipo)
		return items?items:[];
	},
	"quitarProductoOrden":function(idOrden,id)
	{
		OrdenesTrabajo.update({
			_id: idOrden
		}, {
			$pull: {
				productos: {
					_id: id
				}
			}
		}, {
			getAutoValues: false
		});
		var productos=OrdenesTrabajo.findOne({_id:id}).productos;
		return productos?productos:[];
	},
"afip":function()
{
	const facturajs = require('facturajs');

},

	"escribeDatosFE":function(certificado,privada){
		var PythonShell = require('python-shell');
		
 var archi='guardarDatosFE.py'; 
var path = process.cwd()+"/../web.browser/app/facturaElectronica/";
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var options = {  mode: 'text', scriptPath: path,  args: [certificado,privada]   };
// 		var shell = new PythonShell("/"+path+archi,options);
// 		shell.send({ command: "", args: [puntoVenta,tipoComprobante,concepto,tipoDoc,nroDoc,importe] });
	PythonShell.run(archi,options, function (err,results) {
	
  if (err) throw err;
		fut1.return(results)
	          
})
	return fut1.wait()
	},
 'totalGral':function(ano,mes,estado,agrupa){
  
   return getTotalGral(ano,mes,estado,agrupa);
   //return [semana1,semana2,semana3,semana4];
},
'consultaMorososGral':function(){

   var ordenar={ $sort : { _id : 1 } };
   var lookup={$lookup:
       {
         from: "entidades",
         localField: "_id.idEntidad",
         foreignField: "_id",
         as: "entidad"
       }};
   var grupo={$group: {_id: {_id:"$id",descripcionCliente:"$descripcionCliente",idEntidad:"$idEntidad",importe:"$importe"},total:{$sum:"$pagos.importe"}}};
	
   var proyecto={$project:{_id:1,total:1,fecha:"$ingreso",importe:"$importe",idEntidad:"$idEntidad",descripcionCliente:"$descripcionCliente",id:"$_id",pagos:"$pagos",ano:{$year:"$ingreso"},mes:{$month:"$ingreso"}, }};
	var proyecto2={$project:{importe:"$importe",descripcionCliente:"$descripcionCliente",pago:"$total",idEntidad:"$idEntidad",saldo:{$subtract:["$_id.importe","$total"]} }};
	
var match={$match:{"saldo":{$gt:0}}};
var unw = { $unwind: { path: "$pagos", preserveNullAndEmptyArrays: true } };

   var pipeline = [unw,proyecto,grupo,proyecto2,lookup,match ];
var res= OrdenesTrabajo.aggregate(pipeline);
var arr=[];
 for(var i=0;i<res.length;i++)arr.push({_id:res[i]._id._id,descripcionCliente:res[i]._id.descripcionCliente,importePago:res[i].pago,importe:res[i]._id.importe,importeSaldo:res[i].saldo,entidad:res[i].entidad});

if(arr.length>0)return arr;
	return null;
},
"quitarPagoOrden":function(idOrden,id){
OrdenesTrabajo.update({
			_id: idOrden
		}, {
			$pull: {
				pagos: {
					_id: id
				}
			}
		}, {
			getAutoValues: false
		});
	var items=OrdenesTrabajo.findOne({_id:id}).pagos;
	return items?items:[];
},
"quitarAnotacionesOrden":function(idOrden,id){

OrdenesTrabajo.update({
			_id: idOrden
		}, {
			$pull: {
				descripcionesReparador: {
					_id: id
				}
			}
		}, {
			getAutoValues: false
		});
var items=OrdenesTrabajo.findOne({_id:id}).descripcionesReparador;
	return items?items:[];
},
	"activarWhatsapp":function(){
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var nro=Settings.findOne({clave:"nroWhatsap"});
		var mcc=Settings.findOne({clave:"nroWhatsap_mcc"});
		var mnc=Settings.findOne({clave:"nroWhatsap_mnc"});
		 var path = process.cwd()+"/../web.browser/app/mensajesWhatsap/yowsup/run.py";
		
  var consulta="python3";
		var arr=[path];
		const spawn = require( 'child_process' ).spawn, ls = spawn(consulta, arr );

ls.stdout.on( 'data', data => {
	fut1.return( `${data}`)
});
	
	return fut1.wait()
	},
	"solicitarCodigoWhatsap":function()
	{
		

		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var nro=Settings.findOne({clave:"nroWhatsap"});
		var mcc=Settings.findOne({clave:"nroWhatsap_mcc"});
		var mnc=Settings.findOne({clave:"nroWhatsap_mnc"});
    var cmd=require('node-cmd');
 
    cmd.get(
        'yowsup-cli registration --requestcode sms --phone '+nro.valor+" --cc 54 --mcc "+mcc.valor+" --mnc "+mnc.valor+" --env android",
        function(err, data, stderr){
           fut1.return( data)
        }
    );
//   var consulta="yowsup-cli";
// 		var arr=["registration","--requestcode","voice","--phone",nro.valor,"--cc","54","--mcc",mcc.valor,"--mnc",mnc.valor,"--env","android"];
// 		const spawn = require( 'child_process' ).spawn, ls = spawn(consulta, arr );

// ls.stdout.on( 'data', data => {
//     console.log( `stdout: ${data}` );
// 	fut1.return( `${data}`)
// });
	//177923
	return fut1.wait()
	},
	"enviarMensajePruebaWhatsap":function(telPrueba)
	{
		var nro=Settings.findOne({clave:"nroWhatsap"});
		var pass=Settings.findOne({clave:"nroWhatsap_passw"});
		var mcc=Settings.findOne({clave:"nroWhatsap_mcc"});
		var mnc=Settings.findOne({clave:"nroWhatsap_mnc"});
		
    Future = Npm.require('fibers/future');
		var fut1 = new Future();
		
		var cadConexion=nro.valor+":"+pass.valor;
  
		var cmd=require('node-cmd');
    cmd.get(
        'yowsup-cli demos -l '+cadConexion+' --env android -s '+telPrueba+"Hola! esto es un amensaje de prueba ",
        function(err, data, stderr){
           fut1.return( data)
        }
    );
	
	return fut1.wait()
	},
	"checkearCodigoVerificacion":function(codigo)
	{
		
// PASS= /qo0HHQkJ0afNy3aksSWQKsc04Y=
    // TEL: 5492974298467
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var nro=Settings.findOne({clave:"nroWhatsap"});
		var mcc=Settings.findOne({clave:"nroWhatsap_mcc"});
		var mnc=Settings.findOne({clave:"nroWhatsap_mnc"});
 
		var cmd=require('node-cmd');
    cmd.get(
        'yowsup-cli registration --register '+codigo+' --phone '+nro.valor+" --cc 54 --mcc "+mcc.valor+" --mnc "+mnc.valor+" --env android",
        function(err, data, stderr){
           fut1.return( data)
        }
    );
	
	return fut1.wait()
	},
	"enviarEmailVenta":function(data){
		var write = require('fs-writefile-promise')
		  this.unblock();
		var path = process.cwd()+"/adjunto.pdf";
		console.log("envia meail?",process.env.MAIL_URL);
		if(data.adjunto)
		write(path, data.adjunto, {encoding: 'base64'}).then(function(cont){
			
			Email.send({
				from: data.from,
				to: data.to,
				subject: data.subject,
				text:data.text,
				attachments: [{
				filename: 'adjunto.pdf',
				filePath:path,
  }],	 
});
		}); else
	Email.send({
				from: data.from,
				to: data.to,
				subject: data.subject,
				text:data.text, 
});
			 
	
	},
		'descontarStock': function (items) {

			for(var i=0;i<items.length;i++) descontarStock(items[i]);
				
	
	

   },
	'certificadoUpload': function (fileInfo, fileData) {
		 var fs = Npm.require('fs');
		var path = process.cwd()+"/../web.browser/app/facturaElectronica/certificado.crt";
		 console.log(path);
		 var resultados="DATA PROCESADA";
		// buf = iconv.encode("Sample input string", 'win1251');
		 fs.writeFile(path, fileData,{encoding:"ascii"}, function(err) {if(!err)console.log("SUBIO OK")});
		 
   },
	"checkCertificadoElectronico":function()
	{
		
		var PythonShell = require('python-shell');
		
 var archi='pedido.py'; 
var path = process.cwd()+"/../web.browser/app/facturaElectronica/";
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var options = {  mode: 'text', scriptPath: path,  args: ["--check"]   };
// 		var shell = new PythonShell("/"+path+archi,options);
// 		shell.send({ command: "", args: [puntoVenta,tipoComprobante,concepto,tipoDoc,nroDoc,importe] });
	PythonShell.run(archi,options, function (err,results) {
  if (err) throw err;
		fut1.return(results)
	          
})
	return fut1.wait()
	},
	"generarPedidoAfip":function()
	{
		var PythonShell = require('python-shell');
		
 var archi='pedido.py'; 
var path = process.cwd()+"/../web.browser/app/facturaElectronica/";
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var options = {  mode: 'text', scriptPath: path,  args: ["--nuevoPedido"]   };
// 		var shell = new PythonShell("/"+path+archi,options);
// 		shell.send({ command: "", args: [puntoVenta,tipoComprobante,concepto,tipoDoc,nroDoc,importe] });
	PythonShell.run(archi,options, function (err,results) {
  if (err) throw err;
		//var archivo=descargarArchivo(results[0])
		fut1.return(true)
	          
})
	return fut1.wait()
	},
	"generarVariables":function()
	{
		//Settings.remove({});
		if(!Settings.findOne({clave:"condicionIvaEmpresa"})) Settings.insert({clave:"condicionIvaEmpresa",valor:"Monot."});
		if(!Settings.findOne({clave:"recargoTarjeta"})) Settings.insert({clave:"recargoTarjeta",valor:"20"});
		if(!Settings.findOne({clave:"redondeaDecena"})) Settings.insert({clave:"redondeaDecena",valor:"10"});
		
		if(!Settings.findOne({clave:"coeficienteProductos"})) Settings.insert({clave:"coeficienteProductos",valor:"10"});
		if(!Settings.findOne({clave:"tipoSistema"})) Settings.insert({clave:"tipoSistema",valor:"comercio"});
		if(!Settings.findOne({clave:"contactos"})) Settings.insert({clave:"contactos",valor:"Tel.xxxxxx email:xxxx"});
		
		if(!Settings.findOne({clave:"sizeThumbailProductos"})) Settings.insert({clave:"sizeThumbailProductos",valor:"50x50"});
		if(!Settings.findOne({clave:"simulaFacturaElectronica"})) Settings.insert({clave:"simulaFacturaElectronica",valor:"SI"});
		
		if(!Settings.findOne({clave:"vtoElectronicaSimula"})) Settings.insert({clave:"vtoElectronicaSimula",valor:"10/05/2020"});
		if(!Settings.findOne({clave:"nroElectronicaSimula"})) Settings.insert({clave:"nroElectronicaSimula",valor:"1"});
		if(!Settings.findOne({clave:"caeElectronicaSimula"})) Settings.insert({clave:"caeElectronicaSimula",valor:"232432423423423"});
		
		if(!Settings.findOne({clave:"cuitEmpresa"}))Settings.insert({clave:"cuitEmpresa",valor:"xxxxxxxxxx"});
		if(!Settings.findOne({clave:"certificado_fe"}))Settings.insert({clave:"certificado_fe",valor:"certificado_fe",muchaData:true});
		if(!Settings.findOne({clave:"pedido_fe"}))Settings.insert({clave:"pedido_fe",valor:"pedido_fe",muchaData:true});
		if(!Settings.findOne({clave:"privada_fe"}))Settings.insert({clave:"privada_fe",valor:"privada_fe",muchaData:true});
		if(!Settings.findOne({clave:"nombreEmpresa"}))Settings.insert({clave:"nombreEmpresa",valor:"Su empresa"});
		if(!Settings.findOne({clave:"domicilioEmpresa"}))Settings.insert({clave:"domicilioEmpresa	",valor:"s/e"});
		if(!Settings.findOne({clave:"fechaInicioEmpresa"}))Settings.insert({clave:"fechaInicioEmpresa",valor:"xx/xx/xxxx"});
		if(!Settings.findOne({clave:"ingresosBrutosEmpresa"}))Settings.insert({clave:"ingresosBrutosEmpresa",valor:"xxxxxx"});
		if(!Settings.findOne({clave:"interesCredito"}))Settings.insert({clave:"interesCredito",valor:"0"});
		if(!Settings.findOne({clave:"interesDebito"}))Settings.insert({clave:"interesDebito",valor:"0"});
		if(!Settings.findOne({clave:"proximoNroOrden"}))Settings.insert({clave:"proximoNroOrden",valor:"0"});
	if(!Settings.findOne({clave:"logoEmpresa"}))Settings.insert({clave:"logoEmpresa",valor:"-",muchaData:true});
	
	if(!Settings.findOne({clave:"mercadoPago_token"}))Settings.insert({clave:"mercadoPago_token",valor:"-"});
	
	if(!Settings.findOne({clave:"mercadoPago_access"}))Settings.insert({clave:"mercadoPago_access",valor:"-"});
	if(!Settings.findOne({clave:"muestraImpresionCargaOrden"}))Settings.insert({clave:"muestraImpresionCargaOrden",valor:"1"});
		
		if(!Settings.findOne({clave:"rangoPrecios"}))Settings.insert({clave:"rangoPrecios",valor:"0 a 1000000=42;"});
		if(!Settings.findOne({clave:"redondeo"}))Settings.insert({clave:"redondeo",valor:"2"});
		if(!Settings.findOne({clave:"normasServicio"}))Settings.insert({clave:"normasServicio",valor:"-"});
		if(!Settings.findOne({clave:"emailEnvio"}))Settings.insert({clave:"emailEnvio",valor:"USUARIO@HOST.XXX.XX"});
		if(!Settings.findOne({clave:"cadenaConexionMail"}))Settings.insert({clave:"cadenaConexionMail",valor:"smtp://USUARIO%40gmail.com:CLAVE@smtp.gmail.com:465/"});
	},
	"facturar":function(puntoVenta,tipoComprobante,concepto,tipoDoc,nroDoc,importe)
	{
		var PythonShell = require('python-shell');
		
 var archi='facturador.py'; 
var path = process.cwd()+"/../web.browser/app/facturaElectronica/";
		Future = Npm.require('fibers/future');
		var fut1 = new Future();
		var options = {  mode: 'text', scriptPath: path,  args: [puntoVenta,tipoComprobante,concepto,tipoDoc,nroDoc,importe]   };
// 		var shell = new PythonShell("/"+path+archi,options);
// 		shell.send({ command: "", args: [puntoVenta,tipoComprobante,concepto,tipoDoc,nroDoc,importe] });
	PythonShell.run(archi,options, function (err,results) {
  if (err) throw err;
 console.log(results)
		fut1.return(results)
	          
})
	return fut1.wait()
	
	},
	"datosFacturaElectronica":function(tipo)
	{
			var PythonShell = require('python-shell');
		
 var archi='datos.py'; 
var path = process.cwd()+"/../web.browser/app/facturaElectronica/";
	
		var options = { 
  mode: 'text',
	scriptPath: path, 
			args: [tipo] 

};
	PythonShell.run(archi,options, function (err,results) {
  if (err) throw err;
  console.log('results: %j', results); 
	})
	},
"mensualVentas":function(ano,estado,agrupa)
	{
		var res=[];
		for(var i=1;i<=12;i++){
			var auxData=getTotalVentas(ano,i,null,agrupa);
			var aux={data:auxData,mes:i,mesLetras:mesLetras(i)};
			res.push(aux);
		}
	//	res.push("dd");
		return res
	},
	"mensualGral":function(ano,estado,agrupa)
	{
		var res=[];
		for(var i=1;i<=12;i++){
			var auxData=getTotalGral(ano,i,null,agrupa);
			var aux={data:auxData,mes:i,mesLetras:mesLetras(i)};
			res.push(aux);
		}
		console.log(res)
	//	res.push("dd");
		return res
	},
	"mensualVentasDia":function(ano,mes,agrupa)
	{
		var res=[];
		var days = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'];
		var cantidadDias=cantidadDiasMes(mes,ano);
		
		for(var i=1;i<=cantidadDias;i++){
			var auxDia=new Date(ano,(mes-1),i);
			var diaLetras=days[auxDia.getDay()];
			var auxData=getTotalVentasDia(ano,mes,i,agrupa);
			var auxDataFormaPago=getTotalVentasDiaFormaDePago(ano,mes,i,agrupa);
			var aux={data:auxData,dataFormaPago:auxDataFormaPago,dia:i,diaLetras:diaLetras};
			res.push(aux);
		}
		return res
	},
	 'totalVentasDias':function(ano,mes,dia,agrupa){
  
   return getTotalVentasDia(ano,mes,dia,agrupa);
   //return [semana1,semana2,semana3,semana4];
},
 'totalVentas':function(ano,mes,estado,agrupa){
  
   return getTotalVentas(ano,mes,estado,agrupa);
   //return [semana1,semana2,semana3,semana4];
},
	"consultarMeses":function(ano){
		var res=[];
		for(var i=1;i<=12;i++){
			
			var aux={data:consultaVentasMes(ano,i),mes:i,mesLetras:mesLetras(i)};
			res.push(aux);
		}
	//	res.push("dd");
		return res
	},
  'getTotalAnoVentas':function(anoAfuera,mesAfuera){
  
   return consultaVentasAno(anoAfuera);
   //return [semana1,semana2,semana3,semana4];
},

  "users.perfil"(id)
  {
    return Meteor.users.findOne({_id:id}).profile;
  },
  'users.list'(data) {
    return Meteor.users.find().fetch(); 
  },
  
  'users.one'(id) {
    return Meteor.users.find({_id:id}); 
  },
  'users.add'(usuario,clave,perfil) {
  	return Accounts.createUser({ username:usuario, password:clave, profile: perfil });
  },
  'users.update'(_id,usuario,perfil) {
  	return Meteor.users.update({_id:_id},{$set:{profile:perfil,username:usuario}});
  },
  'users.remove'(_id) {
  	return Meteor.users.remove({_id:_id});
  }, 
  'users.resetPassword'(_id,clave) {
  	return Accounts.setPassword(_id,clave);
  },
  'getTotalAnoCompras':function(anoAfuera,mesAfuera){
  
   var res= consultaComprasAno(anoAfuera);
    console.log(res);
    return res;
   //return [semana1,semana2,semana3,semana4];
},
   'fileUpload': function (fileInfo, fileData) {
		 var fs = Npm.require('fs');
		var path = process.cwd()+"/tmp.csv";
		 console.log(path);
		 var resultados="DATA PROCESADA";
		// buf = iconv.encode("Sample input string", 'win1251');
		 fs.writeFile(path, fileData,{encoding:"ascii"}, function(err) {if(!err)console.log("SUBIO OK")});
		 
   },
  "loadFile":_importarProductos,
 "loginUser": function(data) {
   // Meteor.call('loginUser',{email: "vxxxxx@xxxx.com",password: "123456"}, function(error, result){
  //      if(!error) Meteor.loginWithToken(result.token);
   // });
       console.log(data);
       var user = Meteor.users.findOne({
         'emails.address': data.email
       });
       if (user) {
         var password = data.password;
         var result = Accounts._checkPassword(user, password);
         console.log(result);
         if (result.error) {
           return result.error;
         } else {
           return result;
         }
       } else {
         return {
           error: "user not found"
         }
       }
     }
});
Meteor.call("mensajes.wsap")