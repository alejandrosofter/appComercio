Template.historial.helpers({

  'settings': function() {
    var col = new Mongo.Collection(null);
    console.log(this.historial);
    if (this.historial != null)
      $.each(this.historial, function(key, value) {
        col.insert(value);
      });

    return {
      collection: col,
      rowsPerPage: 10,
      showFilter: true,
      class: "table table-condensed",
      filters:["fecha"],
      fields: [{
          key: 'fecha',
          headerClass: 'col-md-3',
          label: 'Fecha',
          fn: function(value, object, key) {
            var d = new Date(value);
            return d.toLocaleDateString()+' '+d.toLocaleTimeString();
          }
        }, {
          key: 'disponibles',
          label: 'Disp.',
          headerClass: 'col-md-1',
          fn: function(value, object, key) {
            return value;
          }
        }, {
          key: 'precioVenta',
          label: '$ Venta',
          headerClass: 'header',
          fn: function(value, object, key) {
            return value;
          }
        }, {
          key: 'motivo',
          label: 'Motivo',
          headerClass: 'col-md-2'
        },


      ]
    };
  }
});