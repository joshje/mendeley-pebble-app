var UI = require('ui');
var Vector2 = require('vector2');

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

documentView.renderDocument = function(current_document) {
  var title = current_document.title;
  if (current_document.year) {
    title += ' (' + current_document.year + ')';
  }

  var metadata = [];
  if (current_document.authors) {
    var authors = [];
    current_document.authors.forEach(function(author) {
      authors.push(author.first_name + ' ' + author.last_name);
    });
    metadata.push(authors.join(', '));
  }

  if (current_document.identifiers) {
    var identifiers = [];
    for (var identifier in current_document.identifiers) {
      identifiers.push(identifier + ': ' + current_document.identifiers[identifier]);
    }
    metadata.push(identifiers.join("\n"));
  }

  if (current_document.abstract) {
    metadata.push(current_document.abstract);
  }

  documentView.subtitle(title);
  documentView.body(metadata.join("\n\n"));
};

var annotationsView = new UI.Menu({
  backgroundColor: 'white',
  textColor: 'black',
  highlightBackgroundColor: 'darkCandyAppleRed',
  highlightTextColor: 'white',
  sections: []
});

var annotationView = new UI.Card({
  scrollable: true
});

module.exports = {
  start: startView,
  loading: loadingView,
  documents: documentsView,
  document: documentView,
  annotations: annotationsView,
  annotation: annotationView
};
