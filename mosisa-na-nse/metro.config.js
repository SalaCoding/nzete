const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 1. Keep your existing database asset support
config.resolver.assetExts.push('db');

// 2. Add source extensions to resolve the 'import.meta' crash on web
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

module.exports = config;
