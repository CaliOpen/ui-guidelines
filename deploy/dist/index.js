'use strict';

var path = require('path');
var express = require('express');
var nunjucks = require('nunjucks');
var showdown = require('showdown');

var converter = new showdown.Converter();

var _require = require('./lib'),
    getComponentChangelog = _require.getComponentChangelog,
    getComponentImages = _require.getComponentImages,
    readGuidelines = _require.readGuidelines;

var app = express();

// serve guidelines as static files
var guidelinesDir = path.join(__dirname, '..', '..', 'guidelines');
app.use('/static', express.static(guidelinesDir));

// serve assets as static files
var assetsDir = path.join(__dirname, '..', 'assets');
app.use('/assets', express.static(assetsDir));

// setup templates engine
nunjucks.configure('views', {
  autoescape: true,
  express: app
});

var guidelinesData = readGuidelines(guidelinesDir);

app.get('/components/:componentName/:componentVersion', function (req, res) {
  var _req$params = req.params,
      componentName = _req$params.componentName,
      componentVersion = _req$params.componentVersion;


  var componentsList = guidelinesData.components.map(function (c) {
    return c.name;
  });

  if (componentsList.indexOf(componentName) === -1) {
    res.status(404).render('404.html', {
      components: guidelinesData.components,
      error: 'Component not found.'
    });
    return;
  }

  // get component data
  var componentImages = getComponentImages(guidelinesDir, componentName, componentVersion);

  res.render('componentVersion.html', {
    components: guidelinesData.components,
    componentName: componentName,
    componentVersion: componentVersion,
    componentImages: componentImages
  });
});

app.get('/components/:componentName', function (req, res) {
  var componentName = req.params.componentName;


  var componentsList = guidelinesData.components.map(function (c) {
    return c.name;
  });

  if (componentsList.indexOf(componentName) === -1) {
    res.status(404).render('404.html', {
      components: guidelinesData.components,
      error: 'Component not found.'
    });
    return;
  }

  var changelog = getComponentChangelog(guidelinesDir, componentName);
  changelog = converter.makeHtml(changelog);

  res.render('component.html', {
    components: guidelinesData.components,
    componentName: componentName,
    changelog: changelog
  });
});

app.get('/', function (req, res) {
  res.render('index.html', {
    components: guidelinesData.components
  });
});

app.listen(8000);

console.log('Listen app to port 8000');