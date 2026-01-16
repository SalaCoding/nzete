const { withProjectBuildGradle, withPlugins } = require('@expo/config-plugins');

const withGoogleMobileAdsConfig = (config) => {
  return withPlugins(config, [
    (config) => {
      return withProjectBuildGradle(config, (config) => {
        if (!config.modResults.contents.includes('com.google.firebase')) {
          config.modResults.contents += `
            dependencies {
              implementation 'com.google.firebase:firebase-ads:21.0.0'
            }
          `;
        }
        return config;
      });
    },
  ]);
};

module.exports = withGoogleMobileAdsConfig;