'use strict';

var path = require('path');
var fs = require('fs');

/**
 * Get the versions of a component.
 */
function getComponentVersions(componentDir) {
  return fs.readdirSync(componentDir).filter(function (item) {
    var itemPath = path.join(componentDir, item);
    return fs.lstatSync(itemPath).isDirectory() && /\d+/.test(item);
  });
}

/**
 * Return the list of components + versions.
 */
function readGuidelines(guidelinesDir) {
  var componentsDir = path.join(guidelinesDir, 'components');
  var componentsList = fs.readdirSync(componentsDir);

  var guidelinesData = {
    components: []
  };

  componentsList.forEach(function (componentName) {
    var componentDir = path.join(componentsDir, componentName);
    var componentVersions = getComponentVersions(componentDir);

    guidelinesData.components.push({
      name: componentName,
      versions: componentVersions
    });
  });

  return guidelinesData;
}

/**
 * Return component changelog
 */
function getComponentChangelog(guidelinesDir, componentName) {
  var componentDir = path.join(guidelinesDir, 'components', componentName);

  // get changelog
  var changelog = void 0;
  try {
    var changelogFile = path.join(componentDir, 'CHANGELOG.md');
    changelog = fs.readFileSync(changelogFile, 'utf8');
  } catch (err) {
    changelog = 'CHANGELOG not found.';
  }

  return changelog;
}

/**
 * Return images and changelog of a version of a component.
 */
function getComponentImages(guidelinesDir, componentName, componentVersion) {
  var versionDir = path.join(guidelinesDir, 'components', componentName, componentVersion);

  // get images
  var images = fs.readdirSync(versionDir).filter(function (item) {
    return (/png|jpg$/.test(item)
    );
  }).map(function (image) {
    return {
      name: image,
      src: path.join('/static', 'components', componentName, componentVersion, image)
    };
  });

  return images;
}

module.exports = {
  readGuidelines: readGuidelines,
  getComponentChangelog: getComponentChangelog,
  getComponentImages: getComponentImages
};