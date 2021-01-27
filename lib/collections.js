
Entidades = new Mongo.Collection('entidades');
Ventas = new Mongo.Collection('ventas');
Compras = new Mongo.Collection('compras');
Talonarios = new Mongo.Collection('talonarios');
Stockeos = new Mongo.Collection('stockeos');
Log = new Mongo.Collection('log');
Settings = new Mongo.Collection('settings');
Grupos = new Mongo.Collection('grupos');
CambioPrecios = new Mongo.Collection('cambioPrecios');
ProductosCategorias = new Mongo.Collection('productosCategorias');
Productos = new Mongo.Collection('productos');
Cuentas = new Mongo.Collection('cuentas');

TipoComprobanteElectronico = new Mongo.Collection('tipoComprobantesElectronico');
TipoDocsElectronico = new Mongo.Collection('tipoDocsElectronico');
PuntosVentaElectronico = new Mongo.Collection('puntosVentaElectronico');
OrdenesTrabajo = new Mongo.Collection('ordenesTrabajo');
CentroCostos = new Mongo.Collection('centroCostos');
Pedidos = new Mongo.Collection('pedidos');


// INSTALAR sudo apt-get install graphicsmagick importante! en linux
var createThumb = function(fileObj, readStream, writeStream) {

  gm(readStream, fileObj.name()).resize("300", "300").stream().pipe(writeStream);
};
Images = new FS.Collection("images", {
  stores: [
new FS.Store.FileSystem("thumbs", { transformWrite: createThumb }),
    new FS.Store.FileSystem("images"),


    ]
});

var dataElectronicoSchema = new SimpleSchema({
  _id: {
    type: String,
  },
  label: {
    type: String,
  },
})
var schemaCentroCostos = new SimpleSchema({
  
  nombreCentroCosto: {
    type: String,
  },
  moduloDefault:{
    type:String
  }

})
var schemaPedidos = new SimpleSchema({
  
  fecha: {
    type: Date,
    label:"Fecha"
  },
  idEntidad:{
    type:String,
    label:"Cliente"
  },
  estado:{
    type:String,
    label:"Estado"
  },
 productos: {
    type: Array,
    label: 'Cierre',
    optional: true
  },
  domicilioEntrega: {
    type: String,
    label: 'Domicilio Entrega',
    optional: true
  },
  "productos.$":{
    type:Object,
  },
   "productos.$.idProducto":{

    type: String,
    label:"Producto"
 
  },
   "productos.$.cantidad":{

    type: Number,
    label:"Cantidad"
 
  },
  "productos.$.importe":{

    type: Number,
    label:"Importe"
 
  },

})
var schemaCuentas = new SimpleSchema({
  
  nombreCuenta: {
    type: String,
  },
  importe: {
    type: Number,
    decimal:true,
  },
  esCheque: {
    type: Boolean,
    label:"Es Cheque?",
     optional: true
  },
  interesEnPago: {
    type: Number,
    decimal:true,
  },
  default: {
    type: Boolean,
  },
  
  cierres: {
    type: Array,
    label: 'Cierre',
    optional: true
  },
  "cierres.$":{
    type:Object,
  },
   "cierres.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
  "cierres.$.items": {
    type: Array,
    optional: true,
  },
  "cierres.$.items.$": {
    type: Object,
  },

  
  "cierres.$.items.$._id": {
    type: String,
    optional: true,
     autoValue: function() {
      return Meteor.uuid();  
    }
  },
  "cierres.$.items.$.detalle": {
    type: String,
    optional: true,
  },
  "cierres.$.items.$.importe": {
    type: Number,
    optional: true,
    decimal:true
  },
  "cierres.$.items.$.interes": {
    type: Number,
    optional: true,
    decimal:true
  },
  "cierres.$.items.$.fecha": {
    type: Date,
    optional: true,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
    decimal:true
  },
  "cierres.$.items.$.tipo": {
    type: String,
    optional: true,
  },


  "cierres.$.detalle":{
    type: String,
    optional:true
 
  },
  "cierres.$.fecha":{
    type: Date,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
 
  },
  "cierres.$.importe":{
    type: Number,
    label:"$ Cierra Sistema",
 decimal:true,
  },
  "cierres.$.importeReal":{
    type: Number,
    label:"$ Real",
 decimal:true,
  },
   "cierres.$.importeAbre":{
    type: Number,
     label:"$ Abre",

     autoform: {
       
        style: "width:70px",
      },
 decimal:true,
  },

})
var ordenesTrabajoSchema = new SimpleSchema({
   idCentroCosto: {
    type: String,
    decimal: true,
    optional:false,
    label:"Centro Costo",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(CentroCostos.find().fetch(), function (c, i) {
          return {label: c.nombreCentroCosto, value: c._id};
        })},
        style: "width:150px",
      },
  },
  ingreso: {
    type: Date,
    autoform: {
        style: "width:200px",
      },
    optional: false,
  
  },
  
  idEntidad: {
    type: String,
    label: 'Entidad',
    optional: false,
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Entidades.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:150px",
      },
  },
  descripcionCliente: {
    type: String,
    label: 'Descripcion Cliente',
    optional: false,
    autoform: {
       type: "textarea"
   }

  },
  importe: {
    type: Number,
    label: '$ Importe',
    optional: false,
    decimal:true
  },
  nroOrden: {
    type: Number,
    label: 'Nro Orden',
    optional: false,
  },
    entregado: {
    type: Boolean,
    label: 'Entregado?',
    optional: true,
  },
  estado: {
    type: String,
    label: 'Estado',
    optional: true,
     defaultValue:"PENDIENTE",
    autoform: {
      options: [
        {label: "PENDIENTE", value: "PENDIENTE"},
        {label: "TRABAJANDO", value: "TRABAJANDO"},
        {label: "FINALIZADA", value: "FINALIZADA"},
        {label: "PARA ENTREGAR", value: "PARA ENTREGAR"},
         {label: "EN TERCEROS", value: "EN TERCEROS"},
          {label: "EN ESPERA", value: "EN ESPERA"},
      ]
    }
  },
  
  productos: {
    type: Array,
    label: 'Productos',
    optional: true
  },
  "productos.$":{
    type:Object,
  },
   "productos.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
   "productos.$.fecha":{
    type: Date,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
  },
   "productos.$.idProducto":{
     type: String,
     label:"Producto",
      autoform: {
       type: "select2",
       options: function () {
        return _.map(Productos.find().fetch(), function (c, i) {
          var lab=c.codigoBarras+" - "+c.nombreProducto+" $ "+c.precioVenta;
          return {label: lab, value: c._id,precio:c.precioVenta};
        })},
        style: "width:150px",
      },
  },
"productos.$.cantidad":{
    type: Number,
     autoform: {
        style: "width:90px",
      },
  },
  "productos.$.importe":{
    type: Number,
    decimal:true,
    autoform: {
        style: "width:90px",
      },
  },


pagos: {
    type: Array,
    label: 'Pagos Orden',
    optional: true
  },
  "pagos.$":{
    type:Object,
  },
   "pagos.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
   "pagos.$.idCuenta":{
    type: String,
    label:"Cuenta",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Cuentas.find().fetch(), function (c, i) {
          return {label: c.nombreCuenta, value: c._id};
        })},
        style: "width:250px",
      },
  },
   "pagos.$.fecha":{
	    type:Date,
      autoform: {
        style: "width:200px",
      },
	    optional: false,
	    label: 'Fecha',
	    autoValue: function() {
	      if (!this.isUpdate) {
	        return new Date();
	      }
	    },
   },
    "pagos.$.importe":{
    type:Number,
    decimal:true,
    label: 'Importe ',
    optional: false
  },
  "pagos.$.interes":{
    type: Number,
    label:"$ interes",
    autoform: {
        style: "width:215px",
      },

  },
   "pagos.$.detalle":{
    type:String,
    label: 'Detalle Pago',
    optional: true,
     autoform: {
       type: "textarea"
   }
  },
  descripcionesReparador: {
    type: Array,
    label: 'Descripciones Reparador',
    optional: true
  },
  "descripcionesReparador.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
  "descripcionesReparador.$":{
    type:Object,
  },
   "descripcionesReparador.$.fecha":{
	    type:Date,
	    optional: false,
	    label: 'Fecha',
   },
   "descripcionesReparador.$.idEntidad": {
    type: String,
    label: 'Entidad',
    optional: true,
    autoform: {
      placeholder: "Entidad...",
    allowClear: true,
       type: "select2",
       options: function () {
        return _.map(Entidades.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:150px",
      },
  },
   "descripcionesReparador.$.detalle":{
    type:String,
    label: 'Anotacion',
    optional: false,
     autoform: {
       type: "textarea"
   }
  },
   
})
var itemsCambioPrecio = new SimpleSchema({
   idProducto: {
    type: String,
    label: 'Producto',
    optional: true
  },
  nombreProducto: {
    type: String,
    decimal: true
  },
  nuevoPrecio: {
    type: Number,
    decimal: true,
    optional:true
  },
  precioViejo: {
    type: Number,
    decimal: true,
    optional:true
  },
});
var schemaCambioPrecios = new SimpleSchema({
  
  productos: {
    type: [itemsCambioPrecio],
    label: 'Productos',
    optional: true
  },
  
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 
});
var schemaGrupos = new SimpleSchema({
  
  productos: {
    type: [String],
    label: 'Productos',
    optional: true
  },
  nombre: {
    type: String,
    label: "Nombre",
  },
  nivel: {
    type: Number,
    label: "Nivel",
  },
  parent: {
    type: String,
    label: "Padre",
    optional: true
  },
  
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 
});

//********************* TALONARIOS ****************************************//
var schemaTalonarios = new SimpleSchema({
  default: {
    type: Boolean,
    label: "Default",
  },
  letra: {
    type: String,
    label: 'Letra Talonario',
    autoform: {
      placeholder: 'Letra',
      style: "width:50px"
    },
    max: 200
  },
  esElectronico: {
    type: Boolean,
    optional: true,

  },
  proximo: {
    type: Number,
    optional: false,
    autoform: {
      placeholder: 'Prox.',
      style: "width:80px"
    },
  },
  nombreTalonario: {
    type: String,
    optional: false,

  },
});
var schemaLog = new SimpleSchema({
  detalle: {
    type: String,
    label: "Detalle",
  },
  accion: {
    type: String,
    label: 'Accion',
  },
  fecha: {
    type: Date,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
     label: 'Fecha',
    optional: true,

  },
 
});

var schemaSettings = new SimpleSchema({
  clave: {
    type: String,
    label: "Clave",
  },
  valor: {
    type: String,
    label: 'Valor',
  },
  muchaData: {
    type: Boolean,
    label: 'mucho?',
    optional: true,
  },
  fecha: {
    type: Date,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
     label: 'Fecha',
    optional: true,

  },
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 
});
//********************* STOCK ****************************************//
var schemaItemStock = new SimpleSchema({
  _id: {
    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
  },
  codigo: {
    type: String,
    optional: true,
  },
  detalle: {
    type: String,
  },
  referencia: {
    type: String,
  },
  idProducto: {
    type: String,
    optional:true,
  },
  cantidad: {
    type: Number,
  },
  importe: {
    type: Number,
    decimal: true
  },
  grupos: {
    type: [String],
   
  },
  codigoBarras: {
    type: String,
    optional: true,
  },
});
var schemaStock = new SimpleSchema({
  fecha: {
    type: Date,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
    optional: true,
  },
  estado: {
    type: String,
    optional: true,
  },
  importe: {
    type: Number,
    decimal: true,
  },
  items: {
    type: [schemaItemStock],
    optional: true,
  }

});
//********************* STOCKEOS ****************************************//
var schemaCategorias = new SimpleSchema({
  nombreCategoria: {
    type: String,
    label: 'Nombre Categoria',
    autoform: {
      placeholder: 'Nombre de la Categoria',
      style: "width:200px"
    },
    max: 200
  },
});
var schemaItemCompras = new SimpleSchema({
  _id: {
    type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  codigo: {
    type: String,
    autoform: {
      placeholder:"CODIGO"
    },
    optional:true
  },
    idEntidad: {
    type: String,
    label: 'Entidad',
    optional: true,
    autoform: {
      placeholder: "Entidad...",
    allowClear: true,
       type: "select2",
       options: function () {
        return _.map(Entidades.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:150px",
      },
  },
   idProducto: {
    type: String,
     optional:true
  },
  detalle: {
    type: String,
  },
   
   porcentajeDescuento: {
    type: String,
     optional:true,
  },
  cantidad: {
    type: Number,
  },
  importe: {
    type: Number,
    decimal: true
  },
  total: {
    type: Number,
    decimal: true,
    optional:true
  },
});
var schemaCompras = new SimpleSchema({
   idCentroCosto: {
    type: String,
    decimal: true,
    optional:false,
    label:"Centro Costo",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(CentroCostos.find().fetch(), function (c, i) {
          return {label: c.nombreCentroCosto, value: c._id};
        })},
        style: "width:150px",
      },
  },
pagos:{
    type:Array,
    optional:true
  },
  "pagos.$":{
    type:Object,
  },
  "pagos.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
   "pagos.$.fecha":{
    type: Date,
    autoform: {
        style: "width:200px",
      },
  },
  "pagos.$.idCuenta":{
    type: String,
    label:"Cuenta",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Cuentas.find().fetch(), function (c, i) {
          return {label: c.nombreCuenta, value: c._id};
        })},
        style: "width:250px",
      },
  },
  "pagos.$.importe":{
    type: Number,
    decimal:true,
    autoform: {
        style: "width:215px",
      },
  },
  "pagos.$.interes":{
    type: Number,
    label:"$ interes",
    autoform: {
        style: "width:215px",
      },
  },
  importeTotal: {
    type: Number,
    decimal: true,
autoform: {
        style: "width:115px",
      },
  },
     idEntidad: {
    type: String,
    label: 'Entidad',
    optional: false,
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Entidades.find().fetch(), function (c, i) {
          return {label: c.razonSocial, value: c._id};
        })},
        style: "width:250px",
      },
  },

  nroFactura: {
    type: Number,
    optional:true,

  },
  fecha: {
    type: Date,
     autoform: {
        style: "width:200px",
      },
      
  },
  razonSocial: {
    type: String,
    optional:true
  },
  estaPagado: {
    type: Boolean,
    optional:true,
    label:"Esta Pago?"
  },
  tieneItems: {
    type: Boolean,
    optional:true,
    label:"Tiene Items?"
  },
  imputaPago: {
    type: Date,
    optional:true,
    label:"Imputa Pago",
    autoform: {
        style: "width:200px",
      },
  },
  idCuenta: {
    type: String,
    label: 'Cuenta',
    optional: true,
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Cuentas.find().fetch(), function (c, i) {
          return {label: c.nombreCuenta, value: c._id};
        })},
        style: "width:170px",
      },
  },
  detalle: {
    type: String,
    optional:true,
    label:"Detalle",
    autoform: {
        type: "textarea",
      },
  },
  tipo: {
    type: String,
    optional:true,
    label:"Tipo de Compra"
  },
  estado: {
    type: String,
  },
  items: {
    type: [schemaItemCompras],
    optional: true,

  },
});
//*****************************VENTAS ********************************//

var schemaVentasItems = new SimpleSchema({
  _id: {
    type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  precioVenta: {
    type: Number,
    decimal:true

  },
  cantidad: {
    type: Number
  },
  nombreProducto: {
    type: String,
  },
  bonificacion: {
    type: Number,
  },
  idProducto: {
    type: String,
    optional:true
  },


});
var schemaVentas = new SimpleSchema({
  ///////
   pagos:{
    type:Array,
    optional:true
  },
  "pagos.$":{
    type:Object,
  },
  "pagos.$._id":{

    type: String,
    autoValue: function() {
      return Meteor.uuid();  
    }
 
  },
   "pagos.$.fecha":{
    type: Date,
    autoform: {
        style: "width:200px",
      },
  },
  "pagos.$.idCuenta":{
    type: String,
    label:"Cuenta",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Cuentas.find().fetch(), function (c, i) {
          return {label: c.nombreCuenta, value: c._id};
        })},
        style: "width:250px",
      },
  },
  "pagos.$.importe":{
    type: Number,
    decimal:true,
    autoform: {
        style: "width:215px",
      },
  },
  "pagos.$.interes":{
    type: Number,
    label:"$ interes",
    autoform: {
        style: "width:215px",
      },
  },

   facturaElectronica:{
    type:Array,
    optional:true
  },
  "facturaElectronica.$":{
    type:Object,
  },
   "facturaElectronica.$.fechaVto":{
     type: String,
    optional: true,
  },
  "facturaElectronica.$.nroCae":{
     type: String,
    optional: true,
  },
  //******************
  
   "facturaElectronica.$.tipoDoc":{
     type: String,
    autoform: {
      type:"select-radio-inline",
       options: [
        {label: "CUIT", value: "CUIT"},
        {label: "DNI", value: "DNI"},
      ],
      },
  },
   "facturaElectronica.$.nroDoc":{
     type: String,
    
  },
   "facturaElectronica.$.razonSocial":{
     type: String,
    
  },
   "facturaElectronica.$.domicilio":{
     type: String,
    optional:true
  },
  "facturaElectronica.$.nroFactura":{
     type: String,
    optional:true
  },
  "facturaElectronica.$.puntoVenta":{
     type: String,
     label:"Punto de Venta AFIP",
      autoform: {
       
        style: "width:100px",
      },
  },
 
  "facturaElectronica.$.tipoComprobante":{
     type: String,
     autoform: {
      type:"select-radio-inline",
       options: [
        {label: "A", value: "A"},
        {label: "B", value: "B"},
        {label: "C", value: "C"},
      ],
        //style: "width:150px",
      },
    
  },
   "facturaElectronica.$.concepto":{
     type: String,
    //optional: false,
    autoform: {
      type:"select-radio-inline",
      options: [
        {label: "PRODUCTOS", value: "1"},
        {label: "SERVICIOS", value: "2"},
        {label: "PRODUCTOS/SERVICIOS", value: "3"},
      ]
    }
  },
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
 idCuenta:{
    type: String,
    label:"Cuenta",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(Cuentas.find().fetch(), function (c, i) {
          return {label: c.nombreCuenta, value: c._id};
        })},
        style: "width:170px",
      },
  },
  pagoEfectivo: {
    type: Number,
    label: "Pago Efectivo",
    optional:true,
    decimal: true
  },
  pagoDebito: {
    type: Number,
    label: "Pago Debito",
     optional:true,
    decimal: true
  },
   idCentroCosto: {
    type: String,
    decimal: true,
    optional:false,
    label:"Centro Costo",
    autoform: {
       type: "select2",
       options: function () {
        return _.map(CentroCostos.find().fetch(), function (c, i) {
          return {label: c.nombreCentroCosto, value: c._id};
        })},
        style: "width:150px",
      },
  },
  pagoCredito: {
    type: Number,
    label: "Pago Credito",
     optional:true,
    decimal: true
  },
    bonificacion: {
    type: Number,
      optional: true,
       defaultValue:0,
    decimal: false
  },
   razonSocialCliente: {
    type: String,
      optional: true,
  },
  telefonoCliente: {
    type: String,
      optional: true,
  },
   dniCliente: {
    type: String,
      optional: true,
  },
  emailCliente: {
    type: String,
      optional: true,
  },
  interes: {
    type: Number,
      optional: false,
    decimal: true,
    defaultValue:0
  },
  
    imprimeComprobante: {
    type: Boolean,
    label: "Imprime?",
    optional: true,
  },
   tipoComprobante: {
    type: String,
    label: "Tipo Comprobante",
    optional: false,

  },
  items: {
    type: [schemaVentasItems],
    optional: true
  },
  fecha: {
    type: Date,
    label: "Fecha", 
    autoform: {
        style: "width:250px",
      },
  },
  importe: {
    type: Number,
    label: "Importe",
    decimal:true,
    optional: true
  },
  estado: {
    type: String,
    label: "Estado",
    optional: true
  },
  idEntidad: {
    type: String,
    label: "Entidad",
  },
});
//*********************** PRODUCTOS *******************************//

var schemaHistorial = new SimpleSchema({
  _id: {
    type: String,
    autoValue: function() {
      return Meteor.uuid();
    }
  },
  fecha: {
    type: Date,
    autoform: {
        style: "width:200px",
        type: 'datetime-local',
        autocomplete:"off",
      },
  },
  motivo: {
    type: String
  },
  precioCompra: {
    type: Number,
    optional: true
  },
  precioVenta: {
    type: Number,
    decimal:true,
    optional: true,
  },
  disponibles: {
    type: Number,
    optional: true,
  },
  cantidadUsada: {
    type: Number,
    optional: true
  }
});
var schemaProductos = new SimpleSchema({
   imagenes: {
    type: Array,
    label: 'Imagenes',
    optional: true
  },
  "imagenes.$":{
    type:Object,
  },
   "imagenes.$._id":{

    type: String,
    label:"ID"
  },
  codigoInterno: {
    type: String,
    label: 'Codigo',

    optional: true,
    autoform: {
      placeholder: 'El codigo interno',
      class: "input-lg",
      style: "width:200px"
    },
    max: 200
  },
  historial: {
    type: [schemaHistorial],
    optional: true
  },
  categoria: {
    type: String,
    label: "Categoria del Producto",
    optional: true,
  },
   grupos: {
    type: [String],
    label: "Grupos",
    optional: true,
     autoform: {
       type: "select2",
       options: function () {
        return _.map(Grupos.find().fetch(), function (c, i) {
          return {label: c.nombre, value: c._id};
        })},
        style: "width:150px",
      },
  },
   porcentajeGanancia: {
    type: Number,
    label: "porcentaje",
    optional: false,
     decimal:true
  },
  stockMinimo: {
    type: Number,
    label: "Stock Min",
    optional: true,
    autoform: {
      style: "width:80px",
      placeholder: 'Cant.',
    }
  },
  disponibilidad: {
    type: Number,
    label: "Disponibles",
    autoform: {
      style: "width:80px",
      placeholder: 'Cant.',
    },
    
  },
  codigoBarras: {
    type: String,
    label: "Codigo Seguimiento",
   // unique: true,
    
    autoform: {
      style: "width:80px",
      placeholder: 'Codigo',
    },
  },
  calidad: {
    type: Number,
    label: "Calidad",
    min: 1,
    optional: true,
    max: 10
  },
  precioCompra: {
    type: Number,
    label: "$ Compra",
    optional: false,
    autoform: {
      style: "width:95px",
      placeholder: '$ Compra',
    },
    min: 0
  },
  created: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset();
      }
    },
  },
  updated: {
    type: Date,
    optional: true,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
  },
  precioVenta: {
    type: Number,
    label: "$ Venta",
    decimal:true,
    optional: true,
    autoform: {
      style: "width:95px",
      placeholder: '$ Venta',
    },
    min: 0
  },

  nombreProducto: {
    type: String,
    label: "Nombre Producto",
    autoform: {
      class: "input-lg",
      style: "width:300px",
      placeholder: 'Nombre que figura',
    }
  },

});
//******************************************ENTIDADES *************************************************//
var schemaEntidades = new SimpleSchema({
  razonSocial: {
    type: String,
    label: 'Razon Social',
    autoform: {
      placeholder: 'El nombre de la empresa o nombre y apellido',
      class: "input-lg",
      style: "width:500px"
    },
    max: 200
  },
  condicionIva: {
    type: String,
    label: "Condicion de Iva",
     optional: true,
    autoform: {
      options: {
        "Resp. Inscripto": "Resp. Inscripto",
        "Monotributista": "Monotributista",
        "Exento": "Exento",
        "Final": "Final"
      }
    }
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
     optional: true,
    label: "Email",
    autoform: {
      placeholder: 'Ingrese su correo @',
      style: "width:300px"
    },
  },
   nroDocumento: {
    type: String,
     optional: true,
    label: "Nro DOC.",
    autoform: {
      placeholder: 'DNI/CUIT',
      style: "width:170px"
    },
  },
  telefono: {
    type: String,
    label: "Tel.",
    min: 0
  },
  domicilio: {
    type: String,
    label: "Domicilio",
     optional: true,
     autoform: {
      placeholder: 'Domicilio',
      style: "width:220px"
    },
    min: 0
  },
  default: {
    type: Boolean,
    label: "Default",
  },
  provincia: {
    type: String,
    label: "Provincia",
    optional: true,
    min: 0
  },
  localidad: {
    type: String,
    label: "Localidad",
     optional: true,
    min: 0
  }

});
PuntosVentaElectronico.attachSchema(dataElectronicoSchema);
TipoDocsElectronico.attachSchema(dataElectronicoSchema);
TipoComprobanteElectronico.attachSchema(dataElectronicoSchema);

CambioPrecios.attachSchema(schemaCambioPrecios);
Entidades.attachSchema(schemaEntidades);
Log.attachSchema(schemaLog);
Grupos.attachSchema(schemaGrupos);
Productos.attachSchema(schemaProductos);
Talonarios.attachSchema(schemaTalonarios);
Compras.attachSchema(schemaCompras);
ProductosCategorias.attachSchema(schemaCategorias);
Ventas.attachSchema(schemaVentas);
Stockeos.attachSchema(schemaStock);
Settings.attachSchema(schemaSettings);
OrdenesTrabajo.attachSchema(ordenesTrabajoSchema);
Cuentas.attachSchema(schemaCuentas);
CentroCostos.attachSchema(schemaCentroCostos);
Pedidos.attachSchema(schemaPedidos);

