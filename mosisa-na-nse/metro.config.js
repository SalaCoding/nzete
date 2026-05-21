const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// CRITICAL FIX FOR STATIC WEB DEPLOYMENTS
config.transformer.publicPath = "./";

module.exports = config;
