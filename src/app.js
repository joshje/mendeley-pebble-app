
var UI = require('ui');
var Vector2 = require('vector2');
var Settings = require('settings');
var api = require('./api');

var documents, document;

var startView = new UI.Window({ fullscreen: true });
var startImage = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/start.png'
});
startView.add(startImage);

var loadingView = new UI.Window({ fullscreen: true });
var loadingImage = new UI.Image({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  image: 'images/loading.png'
});
loadingView.add(loadingImage);

var documentsView = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'darkCandyAppleRed',
  highlightTextColor: 'white',
  sections: []
});

var documentView = new UI.Card({
  scrollable: true
});

var annotationsView = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'darkCandyAppleRed',
  highlightTextColor: 'white',
  sections: []
});

var annotationView = new UI.Card({
  scrollable: true,
  style: 'large'
});

documentsView.on('select', function(e) {
  document = e.item;
  
  var title = document.title;
  if (document.year) {
    title += ' (' + document.year + ')';
  }
  
  var metadata = [];
  if (document.authors) {
    var authors = [];
    document.authors.forEach(function(author) {
      authors.push(author.first_name + ' ' + author.last_name);
    });
    metadata.push(authors.join(', '));
  }
  
  if (document.identifiers) {
    var identifiers = [];
    for (var identifier in document.identifiers) {
      identifiers.push(identifier + ': ' + document.identifiers[identifier]);
    }
    metadata.push(identifiers.join("\n"));
  }
  
  if (document.abstract) {
    metadata.push(document.abstract);
  }
  
  documentView.subtitle(title);
  documentView.body(metadata.join("\n\n"));
  
  documentView.show();
});

documentView.on('click', 'select', function() {  
  api.get({
    url: 'https://api.mendeley.com:443/annotations?document_id=' + document.id,
    headers: {
      'Accept': 'application/vnd.mendeley-annotation.1+json'
    }
  }, function(data, status, request) {
    var annotations = [];
    data.forEach(function(annotation) {
      if (annotation.text) {
        annotations.push({
          title: annotation.text
        });
      }
    });
    
    if (annotations.length) {
      annotationsView.section(0, {
        title: 'Annotations',
        items: annotations
      });

      annotationsView.show();
    }
  }, function(error, status, request) {
    startView.show();
    loadingView.hide();
  });
});

annotationsView.on('select', function(e) {  
  annotationView.body(e.item.title);
  annotationView.show();
});

var getDocuments = function() {    
  loadingView.show();
  startView.hide();
  documentView.hide();
  
  api.get(
  {
    url: 'https://api.mendeley.com/documents',
    headers: {
      'Accept': 'application/vnd.mendeley-document.1+json'
    }
  },
  function(data, status, request) {
    documents = data;
    
    documentsView.section(0, {
      title: 'Documents',
      items: documents
    });
    
    documentsView.show();
    loadingView.hide();
  },
  function(error, status, request) {
    startView.show();
    loadingView.hide();
  }
  );
  
};

Settings.config(
  { url: 'https://mendeley-pebble.herokuapp.com/auth' },
  function(e) {
    var auth = JSON.parse(Settings.option('auth'));

    var expiresAt = Date.now() + (auth.exires_in * 1000);
    Settings.option('exiresAt', expiresAt);
    getDocuments();
  }
);

if (! Settings.option('auth')) {
  startView.show();
} else {
  getDocuments();
}
