var initVars = function() {
	seleccionItems.set(0);
	referenciaModifica.set(null);
	itemsStock.clear();
	grupo.set(null);
	contador.set(0);
}
var cargarAgrupo = function(idProd,idCompra) {
	console.log("ASIGNADO GRUPO")
	
	var compra=Compras.findOne({_id:idCompra});
	console.log(compra)
	if(compra.idGrupo){
		var grupo=Grupos.findOne({_id:compra.idGrupo});
		console.log(grupo)
		if(grupo){
			Grupos.update({_id:compra.idGrupo}, { $push:{"productos": idProd} })
		}
	}
};
var crearExp = function(searchText, caracter) {
	// this is a dumb implementation
	var parts = searchText.trim().split(/[ \-\:]+/);
	var txt = parts.join('|');
	if (caracter != null) txt = txt.replace("@", "");
	return new RegExp("(" + txt + ")", "ig");
}
var resetForm = function() {
	itemsStock = new ReactiveArray();
	items = new ReactiveArray();
	grupo = new ReactiveVar();
	contador = new ReactiveVar();
	referenciaModifica = new ReactiveVar();
	seleccionItems = new ReactiveVar();
	item = new ReactiveVar();
// 	$("#grupo").val("");
	initVars();
};
var getReferencia = function() {
	var d = new Date();
	var ran = Math.floor((Math.random() * 100) + 1);
	return d.getTime() + ran;
};
var estaCargado = function(aux) {
	$.each(itemsStock.list(), function(key, value) {
		var item = itemsStock[key];
		if (item.codigo === aux.codigo) return true;
	});
	return false;
};
var datosValidos = function(aux) {
	if (aux.cantidad === "") return false;
	if (aux.detalle === "") return false;
	if (aux.importe === "") return false;
	if (estaCargado(aux)) return false;
	return true;
};
var resetCarga = function() {
	$("#item_cantidad").val("");
	$("#item_detalle").val("");
	$("#item_importe").val("");
	$("#producto").val("");
	$("#item_codigoBarras").val("");
	//itemsStock.clear();
	$("#producto").focus();
};
var nombreError = function(aux) {
	if (aux.cantidad === "") return "Falta CANTIDAD!";
	if (aux.detalle === "") return "Falta DETALLE!";
	if (aux.importe === "") return "Falta IMPORTE!";
	return "";
};
var buscarPosicion = function(ref) {
	var sal = null;
	$.each(itemsStock.array(), function(key, value) {
		if (value.referencia === ref) sal = key;
	});
	return sal;
};
var getImporteTotal = function(ref) {
	var sum = 0;
	$.each(itemsStock.array(), function(key, value) {
		sum += value.importe * 1;
	});
	return sum;
};
var quitarItem = function(ref) {
	var pos = buscarPosicion(ref);
	itemsStock.splice(pos, 1);
};
var agregarItem = function() {
	var impAux = $("#item_importe").val() * 1;
	var aux = {
		importe: impAux,
		referencia: getReferencia(),
		codigo: null,
		idProducto: null,
		grupos:[],
		codigoBarras: $("#item_codigoBarras").val(),
		cantidad: $("#item_cantidad").val(),
		detalle: $("#item_detalle").val()
	};
	if(grupo.get()!==null)aux.grupos.push(grupo.get()._id);
	
	if (datosValidos(aux)) {
		contador.set(contador.get() + 1);
		itemsStock.push(aux);
		resetCarga();
	} else swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados.. hay datos que estan faltando: " + nombreError(aux), "error");
};
var getIndexItem = function() {
	var sal = null;
	$.each(itemsStock.list(), function(key, value) {
		if (referenciaModifica.get() == value.referencia) sal = key;
	});
	return sal;
};
var modificaItem = function(ref) {
	var totalAux = ($("#item_importe").val() * 1) * ($("#item_cantidad").val() * 1);
	quitarItem(ref);
	var aux = {
		importe: $("#item_importe").val(),
		total: totalAux,
		referencia: ref,
		codigo: null,
		cantidad: $("#item_cantidad").val(),
		detalle: $("#item_detalle").val()
	};

	if (datosValidos(aux)) {
		agregarItem();
		$("#botonCarga").show();
		$("#botonModifica").hide();
	} else swal("Ops!", "ha ocurrido un error, por favor chequee los datos ingresados.. hay datos que estan faltando: " + nombreError(aux), "error");
};
var cargarItemIndividual = function(valor, selector) {
	var aux = null;
	var impAux = $("#item_importe").val() * 1;
	var importeTotal = impAux * ($("#item_cantidad").val() * 1);
	if (itemsStock[seleccionItems.get()] == null) {

		aux = {
			importe: impAux,
			total: importeTotal,
			referencia: getReferencia(),
			codigo: null,
			codigoBarras: $("#item_codigoBarras").val(),
			cantidad: $("#item_cantidad").val(),
			grupos:[],
			detalle: $("#item_detalle").val()
		};
		if(grupo.get()!==null)aux.grupos.push(grupo.get()._id);
		aux.total = aux.cantidad * aux.importe;
		seleccionItems.set(seleccionItems.get() + 1);



	} else {
		aux = itemsStock[seleccionItems.get()];
		aux[selector] = $("#item_" + selector).val();
		aux.total = aux.cantidad * aux.importe;

		quitarItem(aux.referencia);
	}
	aux.total = aux.total.toFixed(2);
	itemsStock.push(aux);

	$("#item_" + selector).val("");
	$("#item_" + selector).focus();

};
modificarHistorial = function(_idProducto, nuevosDatos, motivo) {
	//MODIFICO EL HISTORIAL
	var nuevoHistorial =[];
	if(_idProducto){
	Meteor.subscribe('ProductoUnico', _idProducto);
	var producto = Productos.findOne({
		_id: _idProducto
	});
		console.log(_idProducto);
	console.log(producto);
	nuevoHistorial= producto?producto.historial:[];
	}
	var aux = {
		fecha: new Date(),
		precioCompra: 0,
		precioVenta: nuevosDatos.importe,
		cantidadUsada: 0,
		motivo: motivo,
		disponibles: nuevosDatos.cantidad
	};
	nuevoHistorial.push(aux);
	if(_idProducto){
	Productos.update(_idProducto, {
		$set: {
			historial: nuevoHistorial
		}
	},{},function(err){
		console.log(err);
		if(err){
			UIBlock.unblock();
			swal("Ops!", "Error al actualizar producto: "+err, "error");
		}
	});
	}
};
Productos.after.insert(function(userId, doc) {
	//console.log("DESDE ACTUAIZA PRODUCTO:"+doc._id);
	modificarHistorial(doc._id, doc, "INGRESO por STOCKEO");
});
var cargarProducto = function(datos,idCompra) {
	console.log("CARGANDO PRODUCTO");
	console.log(datos)
	var item = {
		codigoBarras: datos.codigoBarras,
		nombreProducto: datos.detalle,
		disponibilidad: datos.cantidad,
	//	grupos:datos.grupos,
		precioVenta: datos.importe,
		historial:[]
	};
	var idProd=Productos.insert(item,function(err){
		if(err){
			UIBlock.unblock();
			swal("Ops!", "Error al actualizar producto: "+err, "error");
		}
	});
	if(idCompra)cargarAgrupo(idProd,idCompra)

};
var valido = function() {
	var valido = true;
	console.log(grupo.get())
console.log(itemsStock.array());
	$.each(itemsStock.array(), function(key, value) {

		if (!value.codigoBarras || value.codigoBarras === "") {
			valido = false;
			return;
		}

	});
	if (itemsStock.array().length === 0) return false;
	var lab = valido ? "" : "disabled";
	if (valido) {
		$("#labError").html("");
		$("#botonAceptar").removeAttr("disabled");
	} else {

		$("#labError").html("Existen items con codigos de barra <b>vacios</b>");
		$("#botonAceptar").attr("disabled", lab);
	}
	return valido;
};

var actualizarProducto = function(producto, datos, resetCantidad) {

	var cantExistente = resetCantidad ? 0 : (producto.disponibilidad * 1);
	var nuevaCantidad = cantExistente + (datos.cantidad * 1);
	Productos.update(producto._id, {
		$set: {
			codigoBarras: datos.codigoBarras,
			disponibilidad: nuevaCantidad,
			nombreProducto: datos.detalle,
			//grupos: datos.grupos,
			importe: datos.importe
		}
	},function(err){
		console.log("error: "+err);
		if(err){
			console.log(err);
			swal("Ops!", "ERror al actualizar producto", "error");
		}
	});
	console.log("DESDE ACTUAIZA PRODUCTO:"+producto._id);
	modificarHistorial(producto._id, datos, "MODIFICA STOCKEO");
};
cargarItemsStock = function(items, resetCantidad,idFacturaSeleccion) {
	var res = [];
	$.each(items, function(key, value) {
		res.push(value);
		var productoBarras = null;
		if (value.codigoBarras !== "") productoBarras = Productos.findOne({ codigoBarras: value.codigoBarras });
		
		if (productoBarras == null) cargarProducto(value,idFacturaSeleccion);
		
		else actualizarProducto(productoBarras, value, resetCantidad);
	});
	return res;
}

Template.comprasStockeo.helpers({
	"fechaRip": function() {
		var d = new Date(this.fecha);
		return d.toLocaleDateString();
	},
});
Template.tmpGrupo.helpers({
	"cantidad": function() {
		return this.productos.length;
	},
});
Template.nuevoStock.helpers({

	"defaultCompra": function() {
		return {
			fecha: new Date(),
			importe: 0
		};
	},

	"settings": function() {
		var itemsCompra = new Mongo.Collection(null);
		var compras = Compras.find();
		compras.forEach(function(item) {
			item.items.forEach(function(itemCompra) {
				itemsCompra.insert(itemCompra);
			});
		});
		return {
			position: "bottom",
			limit: 15,
			rules: [{
				token: ' ',
				collection: itemsCompra,
				field: "detalle",
				matchAll: false,
				template: Template.productosAuto
			}, {
				token: '@',
				collection: Compras,
				field: "nroFactura",
				matchAll: false,
				filter:{"estado":"INGRESADO"},
				sort:{fecha:-1},
				selector: function(match) {
					var exp = crearExp(match, "@");
					var text = match.replace("@", "");

					var selectorRazon = {
						"razonSocial": {
							$regex: text
						}
					};
					var selectorNro = {
						"nroFactura": (text * 1)
					};
					var selectorGral = {
						$or: [selectorNro, selectorRazon]
					};
					var selectorEstado={"estado":"INGRESADO"};
					var sel={$and:[selectorGral,selectorEstado]};
					console.log(sel);
					return sel;
				},
				template: Template.comprasStockeo
			}, ]
		};
	},
	"settingsCodigo": function() {

		return {
			position: "bottom",
			limit: 5,
			rules: [{
				matchAll: true,
				collection: Productos,
				field: "codigoBarras",
				template: Template.tmpProducto
			}, ]
		};
	},
	"settingsGrupo": function() {

		return {
			position: "bottom",
			limit: 5,
			rules: [{
				matchAll: true,
				collection: Grupos,
				field: "nombre",
				template: Template.tmpGrupo
			}, ]
		};
	},
	"seleccionItems": function() {
		return seleccionItems.get();
	},
	"item": function() {
		return item.get();
	},
	"itemsAux": function() {
		return itemsStock.list();
	},
	"importeTotal": function() {
		var sum = calcularImporteTotalCompra();
		return sum.toFixed(2);
	},


});

var getPorcentajeProducto = function(precioCompra) {
	var rango = Settings.findOne({
		clave: "rangoPrecios"
	});
	var porcentajeSalida = 100;
	var valorRango="0 a 100000 = 42; ";
	if (!rango){
		Settings.insert({clave:"rangoPrecios",valor:valorRango});
		
	}else valorRango=rango.valor;
	var arrRangos = valorRango.split(";");

	$(arrRangos).each(function(key, valor) {
		var aux = valor.split("=");
		if(aux[1]){
		var porcentaje = aux[1].trim() * 1;
		var arrImportes = aux[0].split("a");
		var desde = arrImportes[0].trim() * 1;
		var hasta = arrImportes[1].trim() * 1;

		console.log(" PRECIO COMPRA: " + precioCompra + "RANGO " + key + " DESDE $" + desde + " HASTA $" + hasta + " %" + porcentaje + "|");
		if (precioCompra > desde && precioCompra <= hasta) {
			porcentajeSalida = porcentaje;
			return;
		}
	}

	});
	return (porcentajeSalida / 100) + 1;
};


var idFacturaSeleccion = null;
var asignarProductosFactura=function(_id,items){
	itemsStock.clear();
	
	
	var redondeo = Settings.findOne({
		clave: "redondeo"
	});
			var REDONDEO_A = 5;
	if(!redondeo){
		Settings.insert({clave:"redondeo",valor:REDONDEO_A})
	}else REDONDEO_A=redondeo.valor;
	
			idFacturaSeleccion = _id;
			items.forEach(function(item) {
				var producto = Productos.findOne({
					_id: item.idProducto
				});
				var codigoBarra = producto ? producto.codigoBarras : null;
				var porcentaje = getPorcentajeProducto(item.importe * 1);
				if(!item.porcentajeDescuento)item.porcentajeDescuento=0
				var porcentajeDescuentos=(item.porcentajeDescuento/100);
				
				var porcProd = Math.floor((porcentaje - 1) * 100);
				Productos.update(item.idProducto, {
					$set: {
						porcentajeGanancia: porcProd
					}
				});
				var auxDescuento=(item.importe * porcentajeDescuentos);
				var importeVenta = Math.ceil(((item.importe * porcentaje)-auxDescuento) / REDONDEO_A) * REDONDEO_A;
				var totalImporte = (importeVenta * item.cantidad);
				var aux = {
					idProducto: item.idProducto,
					importe: importeVenta,
					importeCompra: item.importe,
					total: totalImporte,
					porcentajeDescuento: item.porcentajeDescuento,
					importeDescuento:auxDescuento,
					referencia: getReferencia(),
					codigo: null,
					codigoBarras: codigoBarra,
					cantidad: item.cantidad,
					grupos: [],
					detalle: item.detalle
				};
				itemsStock.push(aux);
			});
			$("#item_codigoBarras").focus();

			console.log(itemsStock.array());
}

Template.nuevoStock.events({
// 	"autocompleteselect #productoFactura": function(event, template, doc) {
// 		if (doc.items == null) { // NO ES COMPRA
// 			$("#item_detalle").val(doc.detalle);
// 			$("#item_cantidad").val(doc.cantidad);
// 			$("#item_importe").val(doc.importe);
// 			$("#item_codigoBarras").focus();
// 			idFacturaSeleccion = null;
// 		} else { // ES COMPRA @
// 			asignarProductosFactura(doc._id,doc.items)
// 		}
// 	},
	"autocompleteselect #item_codigoBarras": function(event, template, doc) {
		$("#item_detalle").val(doc.nombreProducto);
		$("#item_cantidad").val(doc.disponibilidad);
		$("#item_importe").val(doc.precioVenta);

	},
// 	"autocompleteselect #grupo": function(event, template, doc) {
// 		grupo.set(doc);

// 	},
	"keyup #item_cantidad": function(ev) {
		if (ev.key == "F9") cargarItemIndividual($("#item_cantidad").val(), "cantidad");
	},
	"keyup #item_codigoBarras": function(ev) {
		if (ev.key == "F9") cargarItemIndividual($("#item_codigoBarras").val(), "codigoBarras");
	},
	"keyup #item_detalle": function(ev) {
		if (ev.key == "F9") cargarItemIndividual($("#item_detalle").val(), "detalle");
	},

	"keyup #item_importe": function(ev) {
		if (ev.key == "F9") cargarItemIndividual($("#item_importe").val(), "importe");
	},

	"click #botonCarga": function(ev) {
		agregarItem();
	},

	"click #botonAceptar": function(ev) {
		var auxItems=itemsStock.array();
			
		if (auxItems.length > 0) {
			UIBlock.block('Agregando productos a stock...');
			
			Stockeos.insert({
				estado: "INGRESADO",
				fecha: new Date(),
				importe: getImporteTotal(),
				items: auxItems
			}, function(err) {
				
				if(!err){
					//cargarAgrupo();
					cargarItemsStock(itemsStock.array(),null,idFacturaSeleccion);
					initVars();
					resetCarga();
					$("#item_codigoBarras").focus();
					if(idFacturaSeleccion!=null)Compras.update(idFacturaSeleccion, {$set:{estado:"STOCKEADO"}});
					UIBlock.unblock();
					swal("GENIAL!", "Se ha ingresado el stock!", "success");
				}else{
					UIBlock.unblock();
					swal("Ops!", err, "error");
				}
				
			});
		} else swal("Ops!", "Tenes que ingresar algun item!", "error");




	},
	"click .fila": function(ev) {
		var pos = buscarPosicion(this.referencia);
		seleccionItems.set(pos);

	},
	"click #botonModifica": function(ev) {
		modificaItem(referenciaModifica.get());
	},
	"click #quitar": function(ev) {
		ev.preventDefault();
		var referencia = this.referencia;
		swal({
			title: "Estas Seguro de quitar el item?",
			text: "Una vez que lo has quitado lo puede volver a cargar!",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Si, borralo!",
			closeOnConfirm: true
		}, function() {
			quitarItem(referencia);
		});

	},
	"click #modificar": function(ev) {
		ev.preventDefault();
		var referencia = this.referencia * 1;
		$("#item_cantidad").val(this.cantidad);
		$("#item_detalle").val(this.detalle);
		$("#item_importe").val(this.importe);
		$("#item_codigoBarras").val(this.codigoBarras);
		referenciaModifica.set(referencia);
		$("#botonCarga").hide();
		$("#botonModifica").show();
	},
});
Template.nuevoStock.rendered = function() {
	if(this.data!=null)asignarProductosFactura(this.data._id,this.data.items)
	setInterval(function() {
		valido();
	}, 2000);
};

Template.nuevoStock.created = function() {

	resetForm();
};