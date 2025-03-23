
// This file would handle the logic to save and load settings in a real Android app
// For this demo, we'll simulate storage with localStorage

export interface AppSettings {
  isActive: boolean;
  isAutoStart: boolean;
  scanInterval?: number;
  isLowPowerMode?: boolean;
  isShowNotifications?: boolean;
}

const SETTINGS_KEY = 'no-shorts-zone-settings';

const defaultSettings: AppSettings = {
  isActive: false,
  isAutoStart: false,
  scanInterval: 2,
  isLowPowerMode: false,
  isShowNotifications: true
};

export const saveSettings = async (settings: Partial<AppSettings>): Promise<void> => {
  try {
    const currentSettings = await loadSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    console.log('Settings saved:', newSettings);
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const storedSettings = localStorage.getItem(SETTINGS_KEY);
    if (!storedSettings) {
      return defaultSettings;
    }
    
    return { ...defaultSettings, ...JSON.parse(storedSettings) };
  } catch (error) {
    console.error('Failed to load settings:', error);
    return defaultSettings;
  }
};

export const clearAllSettings = async (): Promise<void> => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    console.log('Settings cleared');
  } catch (error) {
    console.error('Failed to clear settings:', error);
  }
};
