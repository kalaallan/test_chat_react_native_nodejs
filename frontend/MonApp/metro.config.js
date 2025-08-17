const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  server: {
    // Active le support multi-appareils
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Autorise les requêtes des assets depuis n'importe quelle origine (pour les émulateurs)
        if (req.url.startsWith('/assets') || req.url.startsWith('/index')) {
          res.setHeader('Access-Control-Allow-Origin', '*');
        }
        return middleware(req, res, next);
      };
    },
  },
  // (Optionnel) Désactive le watcher si nécessaire (pour éviter des crashs sur certains systèmes)
  watchFolders: [],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);