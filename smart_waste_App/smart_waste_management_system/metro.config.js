// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add 'cjs' to the list of source extensions
config.resolver.sourceExts.push('cjs');

// Disable unstable package exports to avoid Firebase Auth initialization issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config;

