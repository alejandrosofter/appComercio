Template.accionesStockeos.helpers({
	'muestraModifica': function() {
		return this.estado == "INGRESADO" ? "none" : "";
	},
	'muestraAbrir': function() {
		return this.estado == "PENDIENTE" ? "none" : "";
	}
});
Template.verStock.helpers({
	"id":function(at){
		var stock=Session.get("stockSeleccion");
		return stock._id;
	},
	"importeFinal":function(at){
		var stock=Session.get("stockSeleccion");
		return stock.importe.toFixed(2);
	},
	"fecha":function(at){
		var stock=Session.get("stockSeleccion");
		var d = new Date(stock.fecha);
		var lab= d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
		return lab;
	},
	"items":function(at){
		var stock=Session.get("stockSeleccion");
		return stock.items;
	}
	
});
Template.stockeos.helpers({
	'settings': function() {
		return {
			collection: Stockeos.find(),
			rowsPerPage: 10,
			class: "table table-condensed",
			showFilter: true,
			fields: [

				{
					key: 'fecha',
					label: 'Fecha',
					sortOrder:0,
       sortDirection: 'descending',
					fn: function(value, object, key) {
						console.log(object);
						var d = new Date(value);
						var sort=+value;
						var lab= d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
						return new Spacebars.SafeString("<span sort=" + sort + ">" + lab + "</span>");
					}
				},

				{
					key: 'importe',
					label: '$ Total para la Venta',
					fn: function(value, object, key) {
						return value.toFixed(2);
					}
				}, {
					label: 'ESTADO',
					key: 'estado',
				}, {
					label: 'ITEMS(cant)',
					key: 'estado',
					fn: function(value, object, key) {
						return object.items.length;
					}
				}, {
					label: '',
					headerClass: 'col-md-1',
					tmpl: Template.accionesStockeos
				}
			]
		};
	}
});
Template.stockeos.events({
		'mouseover tr': function(ev) {
			$("#tablaStockeos").find(".acciones").hide();
			$(ev.currentTarget).find(".acciones").show();

		},

		'click .delete': function(ev) {
			var id = this._id;
			swal({
				title: "Estas Seguro de quitar?",
				text: "Una vez que lo has quitado sera permanente!",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Si, borralo!",
				closeOnConfirm: false
			}, function() {
				Stockeos.remove(id);
				swal("Quitado!", "El registro ha sido borrado", "success");
			});

		},
	'click .restockear': function(ev) {
			var id = this._id;
		var stock=this;
			swal({
				title: "Estas Seguro de restockear?",
				text: "Una vez que lo hecho se pondra el producto en disponibilidad 0 (cero) y agregara los cargado en ese lote de stockeo",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#DD6B55",
				confirmButtonText: "Si, RE STOCKEAR!",
				closeOnConfirm: false
			}, function() {
				console.log(stock);
				cargarItemsStock(stock.items,true);
				swal("RE STOCKEADO!", "Se han reseteado y agregado los items", "success");
			});

		},
	'click .ver': function(ev) {
			var id = this._id;
		var stock=this;
			Modal.show("verStock");
Session.set("stockSeleccion",this);
		},
		'click .abrir': function(ev) {
			var items = this.items;
			var idStockeo = this._id;
			swal({
					title: "Estas Seguro de abrir el stockeo?",
					text: "Una vez que lo hagas se restaran las cantidades de cada producto del stockeo.. luego podras modificar y volver a cargarlos!",
					type: "warning",
					showCancelButton: true,
					confirmButtonColor: "#DD6B55",
					confirmButtonText: "Si, abrilo!",
					closeOnConfirm: true
				},
				function() {
					$.each(items, function(key, value) {
						console.log(value);
						var producto = Productos.findOne({
							codigoBarras: value.codigoBarras
						});
						var nuevaCantidad = producto.disponibilidad - value.cantidad;
						Productos.update(producto._id, {
							$set: {
								disponibilidad: nuevaCantidad
							}
						});
						Stockeos.update(idStockeo, {
							$set: {
								estado: "PENDIENTE"
							}
						});
					});
				});

		},
		'click .update': function(ev) {
			Router.go('/modificarStockeo/' + this._id);
		},
	}),

	AutoForm.hooks({
		'nuevaCompra_': {
			onSuccess: function(operation, result, template) {
				swal("GENIAL!", "Se ha ingresado el registro!", "success");
			},
			onError: function(operation, error, template) {
				swal("Ops!", "ha ocurrido un erro al ingresar el registro", "error");
			}
		}
	});