import { Meteor } from 'meteor/meteor';
import { Promise } from 'meteor/promise';
import { Future } from 'fibers/future';

Images.allow({
  'insert': function () {
    // add custom authentication code here
    return true;
  }
});
var seting=Settings.findOne({clave:"cadenaConexionMail"});
import "./consultas.js";
if(seting) process.env.MAIL_URL=seting.valor;
//DATOS DE LA BASE DE DATOS!!!!//////////////////////////////////////////////////////////////////////////
	nombreBase="meteor";
puertoBase="3001";
//DATOS DE LA BASE DE DATOS!!!!//////////////////////////////////////////////////////////////////////////
  

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
Meteor.startup(() => {
  

 Meteor.publish('Productos', function(){
    return Productos.find();
});
	 Meteor.publish('ProductoUnico', function(idProducto){
		 console.log("consultando:"+idProducto)
    return Productos.find({_id:idProducto});
});
  Meteor.publish('CambioPrecios', function(){
    return CambioPrecios.find();
});
  Meteor.publish('Pedidos', function(){
    return Pedidos.find();
});
  Meteor.publish('VentasStatic', function() {  
 
});
Meteor.publish("autocompleteProductos", function(selector, options) {
  Autocomplete.publishCursor(Productos.find(selector, options), this);
  this.ready();
});
  Meteor.publish('Grupos', function(){
    return Grupos.find();
});
   Meteor.publish('Images', function(){
    return Images.find();
});
   Meteor.publish('Cuentas', function(){
    return Cuentas.find();
});
	 Meteor.publish('TipoComprobanteElectronico', function(){
    return TipoComprobanteElectronico.find();
});
	 Meteor.publish('TipoDocsElectronico', function(){ 
    return TipoDocsElectronico.find();
});
	 Meteor.publish('PuntosVentaElectronico', function(){
    return PuntosVentaElectronico.find();
});
   Meteor.publish('Settings', function(){
    return Settings.find();
});
      Meteor.publish('CentroCostos', function(){
    return CentroCostos.find();
});


	
   Meteor.publish('Log', function(){
    return Log.find();
});
   Meteor.publish('Compras', function(rol,idCentroCosto){
    console.log()
    if(rol!="administrador")return Compras.find({idCentroCosto:idCentroCosto})
    return Compras.find();
});
 Meteor.publish('OrdenesTrabajo', function(){
//var proyecto={$project:{_id:1,descripcionCliente:"$descripcionCliente",importe:"$importe",estado:"$estado",descripcionesReparador:"$descripcionesReparador",pagos:"$pagos"}};
//var look={
//        $lookup: {
//            from: "entidades",
//            localField: "_id",
//            foreignField: "idEntidad",
//            as: "entidad"
//        }
//    };
// var pipeline = [proyecto,look];
    return OrdenesTrabajo.find()
});
  Meteor.publish('Entidades', function(){
    return Entidades.find();
});
    Meteor.publish('Stockeos', function(){
    return Stockeos.find();
});
   Meteor.publish('Consultas', function(){
    return Stockeos.find();
});
   Meteor.publish('Ventas', function(){
    return Ventas.find();
});
  Meteor.publish('ProductosCategorias', function(){
    return ProductosCategorias.find();
});
  
 
});
