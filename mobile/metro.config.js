const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Adiciona o suporte para arquivos .wasm exigidos pelo expo-sqlite na Web
config.resolver.assetExts.push('wasm');

module.exports = config;