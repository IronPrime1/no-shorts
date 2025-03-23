
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loadSettings, saveSettings, clearAllSettings } from '@/lib/settings';

const Settings = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [scanInterval, setScanInterval] = useState(2);
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  const [isShowNotifications, setIsShowNotifications] = useState(true);
  
  useEffect(() => {
    const loadStoredSettings = async () => {
      const settings = await loadSettings();
      setScanInterval(settings.scanInterval || 2);
      setIsLowPowerMode(settings.isLowPowerMode || false);
      setIsShowNotifications(settings.isShowNotifications !== false); // Default to true
      setIsLoading(false);
    };
    
    loadStoredSettings();
  }, []);
  
  const handleSaveSettings = async () => {
    const settings = await loadSettings();
    await saveSettings({
      ...settings,
      scanInterval,
      isLowPowerMode,
      isShowNotifications
    });
    
    toast.success("Settings saved", {
      description: "Your preferences have been updated"
    });
  };
  
  const handleResetSettings = async () => {
    await clearAllSettings();
    
    // Reset to defaults
    setScanInterval(2);
    setIsLowPowerMode(false);
    setIsShowNotifications(true);
    
    toast.info("Settings reset", {
      description: "All settings have been reset to defaults"
    });
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-8">
          <div className="neo-card p-6 animate-slide-up animation-delay-150">
            <h2 className="text-lg font-medium mb-4">Performance Settings</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scan Interval (seconds)</span>
                  <span className="font-medium">{scanInterval}</span>
                </div>
                <Slider
                  value={[scanInterval]}
                  min={1}
                  max={5}
                  step={0.5}
                  onValueChange={(value) => setScanInterval(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Lower values provide faster detection but may use more battery.
                </p>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div>
                  <label htmlFor="low-power-mode" className="text-sm font-medium">
                    Low Power Mode
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Reduces scanning frequency when battery is low
                  </p>
                </div>
                <Switch
                  id="low-power-mode"
                  checked={isLowPowerMode}
                  onCheckedChange={setIsLowPowerMode}
                />
              </div>
            </div>
          </div>
          
          <div className="neo-card p-6 animate-slide-up animation-delay-300">
            <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
            
            <div className="flex items-center justify-between py-2">
              <div>
                <label htmlFor="show-notifications" className="text-sm font-medium">
                  Show Notifications
                </label>
                <p className="text-xs text-muted-foreground">
                  Display status notifications when blocking is active
                </p>
              </div>
              <Switch
                id="show-notifications"
                checked={isShowNotifications}
                onCheckedChange={setIsShowNotifications}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4 animate-slide-up animation-delay-500">
            <Button onClick={handleSaveSettings}>Save Settings</Button>
            <Button variant="outline" onClick={handleResetSettings}>Reset to Defaults</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
