applicationControllerGrupos = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			 Meteor.subscribe('Stockeos'),
			Meteor.subscribe('Productos'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerCompras = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			 Meteor.subscribe('Compras',Meteor.user().profile.rol,Meteor.user().profile.centroCosto),
			Meteor.subscribe('Productos'),
			Meteor.subscribe('Cuentas'),
			Meteor.subscribe('CentroCostos'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerCambioPrecios = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('Productos'),
			Meteor.subscribe('CambioPrecios'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerStock = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			 Meteor.subscribe('Stockeos'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerStockNuevo = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			 Meteor.subscribe('Stockeos'),
			Meteor.subscribe('Compras'),
			 Meteor.subscribe('Productos'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerPublico = RouteController.extend({
  layoutTemplate: 'layoutAppPublico',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			 Meteor.subscribe('Settings'),
			
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		this.next();
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationController = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			 Meteor.subscribe('Cuentas'),
			 Meteor.subscribe('CentroCostos'),
			
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
	applicationControllerCuentas = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Cuentas'),
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Productos'),
			 Meteor.subscribe('Settings'),
			
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerOrdenes = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('OrdenesTrabajo'),
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Productos'),
			 Meteor.subscribe('Settings'),
			 Meteor.subscribe('Cuentas'),
			Meteor.subscribe('CentroCostos'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() ) {this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
applicationControllerNuevaVenta = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('autocompleteProductos'),
				Meteor.subscribe('Productos'),
				Meteor.subscribe('Cuentas'),
			Meteor.subscribe('CentroCostos'),
			Meteor.subscribe('Ventas'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
	applicationControllerNuevaVenta2 = RouteController.extend({
  layoutTemplate: 'layoutFactura',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('autocompleteProductos'),
				Meteor.subscribe('Productos'),
			
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});

applicationControllerVentas = RouteController.extend({
  layoutTemplate: 'layoutApp',
	  loadingTemplate: 'loaderGral',
	  notFoundTemlplate: 'notFound',
// 	  yieldTemplates: {
// 		'applicationHeader': {to: 'header'},
// 		'projectSwitcher': {to: 'projectSwitcher'},
// 		'applicationMainNav': {to: 'mainNav'},
// 		'applicationFooter': {to: 'footer'}
// 	  },
	  waitOn: function() {
		return [
			Meteor.subscribe('TipoComprobanteElectronico'),
			Meteor.subscribe('TipoDocsElectronico'),
			Meteor.subscribe('PuntosVentaElectronico'),
			
			Meteor.subscribe('Entidades'),
			Meteor.subscribe('Grupos'),
			Meteor.subscribe('Productos'),
			 Meteor.subscribe('Settings'),
			Meteor.subscribe('Cuentas'),
			Meteor.subscribe('Ventas'),
			Meteor.subscribe('CentroCostos'),
			//Meteor.subscribe('Productos'),
		];
	  },
	  onBeforeAction: function(pause) {
		this.render('loaderGral');
		if ( !Meteor.user() )
			{this.render('login');}
// 		if (!!this.ready() && Projects.find().count() === 0)
 	else		{this.next();}
	  },
	  action: function () {
		if (!this.ready()) {
      
		  this.render('loaderGral');
		}
		else {
		  this.render();

		}
	  }
	});
Router.route('inicio', {
		path: '/',
    template:"inicio",
		controller: applicationController,
})
Router.route('informeCentroCostos', {
		path: '/informeCentroCostos',
    template:"informeCentroCostos",
		controller: applicationController,
})

Router.route('stock', {
		path: '/stock',
    template:"stock",
		controller: applicationControllerPublico,
})
Router.route('usuarios', {
		path: '/usuarios',
    template:"usuarios",
		controller: applicationController,
})
Router.route('pedidos', {
		path: '/pedidos',
    template:"pedidos",
		controller: applicationController,
})
Router.route('deuda', {
		path: '/deuda',
    template:"deuda",
		controller: applicationController,
})
Router.route('centroCostos', {
		path: '/centroCostos',
    template:"centroCostos",
		controller: applicationController,
})
Router.route('anual', {
		path: '/anual',
    template:"anual",
		controller: applicationController,
})
Router.route('anualCentroCosto', {
		path: '/anualCentroCosto',
    template:"anualCentroCosto",
		controller: applicationController,
})
Router.route('importarProductos', {
		path: '/importarProductos',
    template:"importarProductos",
		controller: applicationController,
})
Router.route('cuentas', {
		path: '/cuentas',
    template:"cuentas",
		controller: applicationControllerCuentas,
})
Router.route('ordenesTrabajo', {
		path: '/ordenesTrabajo',
    template:"ordenesTrabajo",
		controller: applicationControllerOrdenes,
})
Router.route('nuevaOrdenTrabajo', {
		path: '/nuevaOrdenTrabajo',
    template:"nuevaOrdenTrabajo",
		controller: applicationControllerOrdenes,
})
Router.route('/modificarOrden/:_id', {
    template: 'modificarOrden',
    controller: applicationControllerOrdenes,
    data: function(){
         var sal=OrdenesTrabajo.findOne({_id: (this.params._id)});
         return sal;
    }
});
Router.route('/modificarCompra/:_id', {
    template: 'modificarCompra',
    controller: applicationControllerCompras,
    data: function(){
         var sal=Compras.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});
Router.route('/modificarDatosSistema/:_id', {
    template: 'modificarDatosSistema',
    controller: applicationController,
    data: function(){
			    Meteor.subscribe('Settings',this.params._id);
         var sal=Settings.findOne({_id: (this.params._id)});
        console.log(sal);
         return sal;
    }
});
Router.route('/modificarProducto/:_id', {
    template: 'modificarProducto',
    controller: applicationController,
    data: function(){
			    Meteor.subscribe('ProductoUnico',this.params._id);
         var sal=Productos.findOne({_id: (this.params._id)});
        console.log(sal);
         return sal;
    }
});
Router.route('/modificarEntidad/:_id', {
    template: 'modificarEntidad',
    controller: applicationController,
    data: function(){
         var sal=Entidades.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});
Router.route('/facturar/:_id', {
    template: 'facturar',
    controller: applicationControllerVentas,
    data: function(){
         var sal=Ventas.findOne({_id: this.params._id});
         return sal;
    }
});
Router.route('/historial/:_id', {
    template: 'historial',
    controller: applicationController,
    data: function(){
			Meteor.subscribe('ProductoUnico', this.params._id);
         var sal=Productos.findOne({_id: this.params._id});
        console.log(sal);
         return sal;
    }
});
Router.route('entidades', {
		path: '/entidades',
    template:"entidades",
		controller: applicationController,
})
Router.route('nuevaEntidad', {
		path: '/nuevaEntidad',
    template:"nuevaEntidad",
		controller: applicationController,
})
Router.route('grupos', {
		path: '/grupos',
    template:"grupos",
		controller: applicationControllerGrupos,
})
Router.route('productos', {
		path: '/productos',
    template:"productos",
		controller: applicationController,
})

Router.route('nuevoProducto', {
		path: '/nuevoProducto',
    template:"nuevoProducto",
		controller: applicationController,
})
Router.route('cambioPrecios', {
		path: '/cambioPrecios',
    template:"cambioPrecios",
		controller: applicationControllerCambioPrecios,
})
Router.route('compras', {
		path: '/compras',
    template:"compras",
		controller: applicationControllerCompras,
})
Router.route('nuevaCompra', {
		path: '/nuevaCompra',
    template:"nuevaCompra",
		controller: applicationControllerCompras,
})
Router.route('stockeos', {
		path: '/stockeos',
    template:"stockeos",
		controller: applicationControllerStock,
})
Router.route('/nuevoStock/:_id', {
    template: 'nuevoStock',
    controller: applicationControllerStockNuevo,
    data: function(){
         var sal=Compras.findOne({_id: this.params._id});
       
         return sal;
    }
});
Router.route('nuevoStock', {
		path: '/nuevoStock',
    template:"nuevoStock",
		controller: applicationControllerStockNuevo,
})
Router.route('ventas', {
		path: '/ventas',
    template:"ventas",
		controller: applicationControllerVentas,
})
Router.route('informeVentas', {
		path: '/informeVentas',
    template:"informeVentas",
		controller: applicationControllerVentas,
})
Router.route('informeCuenta', {
		path: '/informeCuenta',
    template:"informeCuenta",
		controller: applicationController,
})
Router.route('informeGral', {
		path: '/informeGral',
    template:"informeGral",
		controller: applicationController,
})
Router.route('nuevaVenta', {
		path: '/nuevaVenta',
    template:"nuevaVenta",
		controller: applicationControllerNuevaVenta,
})


Router.route('/editarVenta/:_id', {
    template: 'editarVenta',
    controller: applicationControllerNuevaVenta,
    data: function(){
         var sal=Ventas.findOne({_id: this.params._id});
       
         return sal;
    }
});
Router.route('nuevaVenta2', {
		path: '/nuevaVenta2',
    template:"nuevaVenta2",
		controller: applicationControllerNuevaVenta2,
})
Router.route('estadisticaCompras', {
		path: '/estadisticaCompras',
    template:"estadisticaCompras",
		controller: applicationController,
})
Router.route('estadisticaVentas', {
		path: '/estadisticaVentas',
    template:"estadisticaVentas",
		controller: applicationController,
})
Router.route('/datosSistema', {
 template: 'datosSistema',
  path: '/datosSistema',
		controller: applicationController,
});