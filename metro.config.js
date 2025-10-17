import { getDefaultConfig } from 'expo/metro-config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('stream-browserify'),
};

export default config;