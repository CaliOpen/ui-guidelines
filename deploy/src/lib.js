const path = require('path');
const fs = require('fs');


/**
 * Get the versions of a component.
 */
function getComponentVersions(componentDir) {
  return fs.readdirSync(componentDir)
    .filter((item) => {
      const itemPath = path.join(componentDir, item);
      return fs.lstatSync(itemPath).isDirectory() && /\d+/.test(item);
    });
}

/**
 * Return the list of components + versions.
 */
function readGuidelines(guidelinesDir) {
  const componentsDir = path.join(guidelinesDir, 'components');
  const componentsList = fs.readdirSync(componentsDir);

  const guidelinesData = {
    components: [],
  };

  componentsList.forEach((componentName) => {
    const componentDir = path.join(componentsDir, componentName);
    const componentVersions = getComponentVersions(componentDir);

    guidelinesData.components.push({
      name: componentName,
      versions: componentVersions,
    });
  });

  return guidelinesData;
}

/**
 * Return component changelog
 */
function getComponentChangelog(guidelinesDir, componentName) {
  const componentDir = path.join(guidelinesDir, 'components', componentName);

  // get changelog
  let changelog;
  try {
    const changelogFile = path.join(componentDir, 'CHANGELOG.md');
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
  const versionDir = path.join(guidelinesDir, 'components', componentName, componentVersion);

  // get images
  const images = fs.readdirSync(versionDir)
    .filter(item => /png|jpg$/.test(item))
    .map(image => ({
      name: image,
      src: path.join('/static', 'components', componentName, componentVersion, image),
    }));

  return images;
}

module.exports = {
  readGuidelines,
  getComponentChangelog,
  getComponentImages,
};
