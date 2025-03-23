
// This file bridges the gap between our React app and native mobile functionality

export interface NativeBridge {
  openYouTube(): Promise<void>;
  checkAccessibilityPermission(): Promise<boolean>;
  requestAccessibilityPermission(): Promise<boolean>;
  startBlockingService(): Promise<boolean>;
  stopBlockingService(): Promise<boolean>;
  isServiceRunning(): Promise<boolean>;
}

// Placeholder implementation for web
const webBridge: NativeBridge = {
  openYouTube: async () => {
    console.log('Opening YouTube (web placeholder)');
    window.open('https://youtube.com', '_blank');
    return Promise.resolve();
  },
  checkAccessibilityPermission: async () => {
    console.log('Checking accessibility permission (web placeholder)');
    return Promise.resolve(false);
  },
  requestAccessibilityPermission: async () => {
    console.log('Requesting accessibility permission (web placeholder)');
    return Promise.resolve(false);
  },
  startBlockingService: async () => {
    console.log('Starting blocking service (web placeholder)');
    return Promise.resolve(false);
  },
  stopBlockingService: async () => {
    console.log('Stopping blocking service (web placeholder)');
    return Promise.resolve(false);
  },
  isServiceRunning: async () => {
    console.log('Checking if service is running (web placeholder)');
    return Promise.resolve(false);
  }
};

// We'll determine if we're running in a Capacitor environment
const isCapacitorDefined = () => {
  return typeof (window as any).Capacitor !== 'undefined';
};

// This will be replaced by the native implementation when running on a device
export const nativeBridge: NativeBridge = (() => {
  if (isCapacitorDefined()) {
    console.log('Running in Capacitor environment, using native bridge');
    // When in a Capacitor context, we'll use the plugin implementation
    // This is implemented in Android native code
    return {
      openYouTube: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          await NoShortsPlugin.openYouTube();
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to open YouTube:', error);
          return Promise.reject(error);
        }
      },
      checkAccessibilityPermission: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          const { value } = await NoShortsPlugin.checkAccessibilityPermission();
          return value;
        } catch (error) {
          console.error('Failed to check accessibility permission:', error);
          return false;
        }
      },
      requestAccessibilityPermission: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          const { value } = await NoShortsPlugin.requestAccessibilityPermission();
          return value;
        } catch (error) {
          console.error('Failed to request accessibility permission:', error);
          return false;
        }
      },
      startBlockingService: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          const { value } = await NoShortsPlugin.startBlockingService();
          return value;
        } catch (error) {
          console.error('Failed to start blocking service:', error);
          return false;
        }
      },
      stopBlockingService: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          const { value } = await NoShortsPlugin.stopBlockingService();
          return value;
        } catch (error) {
          console.error('Failed to stop blocking service:', error);
          return false;
        }
      },
      isServiceRunning: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          const { value } = await NoShortsPlugin.isServiceRunning();
          return value;
        } catch (error) {
          console.error('Failed to check if service is running:', error);
          return false;
        }
      }
    };
  }
  
  console.log('Running in web environment, using web bridge');
  return webBridge;
})();

// Hook to use the native bridge
export const useNativeBridge = (): NativeBridge => {
  return nativeBridge;
};
