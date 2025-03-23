
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
          console.log('Attempting to open YouTube via native plugin');
          await NoShortsPlugin.openYouTube();
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to open YouTube via plugin:', error);
          // Fallback to browser open if plugin fails
          try {
            console.log('Attempting fallback: opening YouTube via URL');
            // Use Capacitor App plugin to open external URL or app
            const { App } = (window as any).Capacitor.Plugins;
            await App.openUrl({ url: 'https://youtube.com' });
            return Promise.resolve();
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError);
            // Last resort: try opening in browser
            window.open('https://youtube.com', '_blank');
            return Promise.reject(new Error('Failed to open YouTube'));
          }
        }
      },
      checkAccessibilityPermission: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          console.log('Checking accessibility permission via native plugin');
          const result = await NoShortsPlugin.checkAccessibilityPermission();
          console.log('Permission check result:', result);
          return result.value === true;
        } catch (error) {
          console.error('Failed to check accessibility permission:', error);
          return false;
        }
      },
      requestAccessibilityPermission: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          console.log('Requesting accessibility permission via native plugin');
          const result = await NoShortsPlugin.requestAccessibilityPermission();
          console.log('Permission request result:', result);
          
          // After requesting permission, wait briefly and then check if it was granted
          await new Promise(resolve => setTimeout(resolve, 500));
          const checkResult = await NoShortsPlugin.checkAccessibilityPermission();
          console.log('Permission status after request:', checkResult);
          
          return checkResult.value === true;
        } catch (error) {
          console.error('Failed to request accessibility permission:', error);
          return false;
        }
      },
      startBlockingService: async () => {
        try {
          // First, verify permission is granted
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          const permissionCheck = await NoShortsPlugin.checkAccessibilityPermission();
          
          if (!permissionCheck.value) {
            console.log('Cannot start service: permission not granted');
            return false;
          }
          
          console.log('Starting blocking service via native plugin');
          const result = await NoShortsPlugin.startBlockingService();
          console.log('Service start result:', result);
          return result.value === true;
        } catch (error) {
          console.error('Failed to start blocking service:', error);
          return false;
        }
      },
      stopBlockingService: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          console.log('Stopping blocking service via native plugin');
          const result = await NoShortsPlugin.stopBlockingService();
          console.log('Service stop result:', result);
          return result.value === true;
        } catch (error) {
          console.error('Failed to stop blocking service:', error);
          return false;
        }
      },
      isServiceRunning: async () => {
        try {
          const { NoShortsPlugin } = (window as any).Capacitor.Plugins;
          console.log('Checking if service is running via native plugin');
          const result = await NoShortsPlugin.isServiceRunning();
          console.log('Service running check result:', result);
          return result.value === true;
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
