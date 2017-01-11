const path = require('path');
const express = require('express');
const nunjucks = require('nunjucks');
const showdown = require('showdown');

const converter = new showdown.Converter();


const {
  getComponentChangelog,
  getComponentImages,
  readGuidelines,
} = require('./lib');

const app = express();

// serve guidelines as static files
const guidelinesDir = path.join(__dirname, '..', '..', 'guidelines');
app.use('/static', express.static(guidelinesDir));

// serve assets as static files
const assetsDir = path.join(__dirname, '..', 'assets');
app.use('/assets', express.static(assetsDir));

// setup templates engine
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

const guidelinesData = readGuidelines(guidelinesDir);

app.get('/components/:componentName/:componentVersion', (req, res) => {
  const { componentName, componentVersion } = req.params;

  const componentsList = guidelinesData.components.map(c => c.name);

  if (componentsList.indexOf(componentName) === -1) {
    res.status(404).render('404.html', {
      components: guidelinesData.components,
      error: 'Component not found.',
    });
    return;
  }

  // get component data
  const componentImages = getComponentImages(guidelinesDir, componentName, componentVersion);

  res.render('componentVersion.html', {
    components: guidelinesData.components,
    componentName,
    componentVersion,
    componentImages,
  });
});

app.get('/components/:componentName', (req, res) => {
  const { componentName } = req.params;

  const componentsList = guidelinesData.components.map(c => c.name);

  if (componentsList.indexOf(componentName) === -1) {
    res.status(404).render('404.html', {
      components: guidelinesData.components,
      error: 'Component not found.',
    });
    return;
  }

  let changelog = getComponentChangelog(guidelinesDir, componentName);
  changelog = converter.makeHtml(changelog);

  res.render('component.html', {
    components: guidelinesData.components,
    componentName,
    changelog,
  });
});

app.get('/', (req, res) => {
  res.render('index.html', {
    components: guidelinesData.components,
  });
});

app.listen(8000);

console.log('Listen app to port 8000');
