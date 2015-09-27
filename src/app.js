var Settings = require('settings');
var config = require('./config');
var api = require('./api');
var views = require('./views');

var documents, current_document;

views.documents.on('select', function(e) {
  current_document = e.item;

  views.document.renderDocument(current_document);

  views.document.show();
});

views.document.on('click', 'select', function() {
  api.getAnnotations(current_document.id, function(data) {
    var annotations = [];
    for (var i = data.length - 1; i >= 0; i--) {
      if (data[i].text) {
        annotations.push({
          title: data[i].text
        });
      }
    }

    if (annotations.length) {
      views.annotations.section(0, {
        title: 'Annotations',
        items: annotations
      });

      views.annotations.show();
    }
  }, function() {
    views.start.show();
    views.loading.hide();
  });
});

views.annotations.on('select', function(e) {
  views.annotation.body(e.item.title);
  views.annotation.show();
});

var getDocuments = function() {
  views.loading.show();
  views.start.hide();
  views.document.hide();

  api.getDocuments(function(data) {
    documents = data;

    views.documents.section(0, {
      title: 'Documents',
      items: documents
    });

    views.documents.show();
    views.loading.hide();
  }, function() {
    views.start.show();
    views.loading.hide();
  });
};

Settings.config(
  { url: config.authUrl },
  function() {
    var auth = JSON.parse(Settings.option('auth'));

    var expiresAt = Date.now() + (auth.exires_in * 1000);
    Settings.option('exiresAt', expiresAt);
    getDocuments();
  }
);

if (! Settings.option('auth')) {
  views.start.show();
} else {
  getDocuments();
}
