
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.86623688faae4dbd8cbc1ca1e0716abf',
  appName: 'No Shorts Zone',
  webDir: 'dist',
  server: {
    url: 'https://86623688-faae-4dbd-8cbc-1ca1e0716abf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    NoShortsPlugin: {
      // You can add plugin-specific configuration here if needed
    }
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  }
};

export default config;
