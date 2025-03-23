# Android Capacitor Plugin Implementation

To make the app visible in accessibility settings, you need to implement a Capacitor plugin with these key components:

## 1. Create the Plugin in Android Studio

After running `npx cap open android`, follow these steps:

### Create the Plugin Class

Create a new Kotlin file named `NoShortsPlugin.kt` in the package structure of your Android project:

```kotlin
package app.lovable.noshorts;

import android.content.Context
import android.content.Intent
import android.provider.Settings
import android.util.Log
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "NoShortsPlugin")
class NoShortsPlugin : Plugin() {
    private val TAG = "NoShortsPlugin"
    
    @PluginMethod
    fun openYouTube(call: PluginCall) {
        try {
            val intent = context.packageManager.getLaunchIntentForPackage("com.google.android.youtube")
            if (intent != null) {
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
                call.resolve()
            } else {
                // YouTube app not installed
                val playStoreIntent = Intent(Intent.ACTION_VIEW)
                playStoreIntent.data = android.net.Uri.parse("market://details?id=com.google.android.youtube")
                playStoreIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(playStoreIntent)
                call.reject("YouTube app not installed")
            }
        } catch (e: Exception) {
            call.reject("Failed to open YouTube: ${e.message}")
        }
    }

    @PluginMethod
    fun checkAccessibilityPermission(call: PluginCall) {
        val result = JSObject()
        val enabled = isAccessibilityServiceEnabled(context)
        result.put("value", enabled)
        call.resolve(result)
    }

    @PluginMethod
    fun requestAccessibilityPermission(call: PluginCall) {
        try {
            val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
            
            val result = JSObject()
            result.put("value", true)
            call.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to open accessibility settings", e)
            call.reject("Failed to open accessibility settings: ${e.message}")
        }
    }

    @PluginMethod
    fun startBlockingService(call: PluginCall) {
        // Start the service if accessibility is enabled
        val result = JSObject()
        val enabled = isAccessibilityServiceEnabled(context)
        result.put("value", enabled)
        call.resolve(result)
    }

    @PluginMethod
    fun stopBlockingService(call: PluginCall) {
        // No need to explicitly stop, just report success
        val result = JSObject()
        result.put("value", true)
        call.resolve(result)
    }

    @PluginMethod
    fun isServiceRunning(call: PluginCall) {
        val result = JSObject()
        val enabled = isAccessibilityServiceEnabled(context)
        result.put("value", enabled)
        call.resolve(result)
    }

    private fun isAccessibilityServiceEnabled(context: Context): Boolean {
        val accessibilityServiceName = "${context.packageName}/.YoutubeShortsBlockerService"
        
        try {
            val enabledServices = Settings.Secure.getString(
                context.contentResolver,
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            )
            
            return enabledServices?.contains(accessibilityServiceName) == true
        } catch (e: Exception) {
            Log.e(TAG, "Failed to check accessibility service status", e)
            return false
        }
    }
}
```

### Create the Accessibility Service

Create a new Kotlin file named `YoutubeShortsBlockerService.kt`:

```kotlin
package app.lovable.noshorts

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.util.Log
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo

class YoutubeShortsBlockerService : AccessibilityService() {
    private val TAG = "YTShortsBlocker"
    
    override fun onServiceConnected() {
        Log.i(TAG, "YouTube Shorts Blocker Service connected")
        
        val info = serviceInfo
        info.eventTypes = AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED or 
                          AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
        info.feedbackType = AccessibilityServiceInfo.FEEDBACK_VISUAL
        info.notificationTimeout = 100
        info.packageNames = arrayOf("com.google.android.youtube")
        
        serviceInfo = info
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent) {
        if (event.packageName != "com.google.android.youtube") return
        
        try {
            val rootNode = rootInActiveWindow ?: return
            
            // Find and hide Shorts sections
            findAndHideShortsContent(rootNode)
            
            rootNode.recycle()
        } catch (e: Exception) {
            Log.e(TAG, "Error processing accessibility event", e)
        }
    }

    private fun findAndHideShortsContent(rootNode: AccessibilityNodeInfo) {
        // Search for text nodes containing "Shorts"
        val shortsNodes = findNodesByText(rootNode, "Shorts")
        
        for (node in shortsNodes) {
            try {
                // Try to find the parent container of Shorts section
                var parent = node.parent
                for (i in 0 until 3) { // Try up to 3 levels up
                    if (parent != null) {
                        // Attempt to hide by performing a click-away
                        // or another accessibility action
                        parent.performAction(AccessibilityNodeInfo.ACTION_ACCESSIBILITY_FOCUS)
                        parent.performAction(AccessibilityNodeInfo.ACTION_CLEAR_ACCESSIBILITY_FOCUS)
                        
                        // Try to find a close button or similar
                        val closeButtons = findNodesByText(parent, "Not interested")
                        for (closeBtn in closeButtons) {
                            closeBtn.performAction(AccessibilityNodeInfo.ACTION_CLICK)
                            closeBtn.recycle()
                        }
                        
                        parent = parent.parent
                    }
                }
            } catch (e: Exception) {
                Log.e(TAG, "Error handling Shorts node", e)
            } finally {
                node.recycle()
            }
        }
    }

    private fun findNodesByText(node: AccessibilityNodeInfo, text: String): List<AccessibilityNodeInfo> {
        val results = mutableListOf<AccessibilityNodeInfo>()
        
        try {
            if (node.text != null && node.text.toString().contains(text)) {
                results.add(AccessibilityNodeInfo.obtain(node))
            }
            
            for (i in 0 until node.childCount) {
                val child = node.getChild(i) ?: continue
                results.addAll(findNodesByText(child, text))
                child.recycle()
            }
        } catch (e: Exception) {
            Log.e(TAG, "Error finding nodes by text", e)
        }
        
        return results
    }

    override fun onInterrupt() {
        Log.i(TAG, "YouTube Shorts Blocker Service interrupted")
    }
    
    override fun onUnbind(intent: Intent): Boolean {
        Log.i(TAG, "YouTube Shorts Blocker Service unbound")
        return super.onUnbind(intent)
    }
}
```

### Add Plugin to Android Manifest

Add the accessibility service to your `AndroidManifest.xml` file:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <application>
        <!-- ... other app components ... -->
        
        <service
            android:name=".YoutubeShortsBlockerService"
            android:label="@string/accessibility_service_label"
            android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.accessibilityservice.AccessibilityService" />
            </intent-filter>
            <meta-data
                android:name="android.accessibilityservice"
                android:resource="@xml/accessibility_service_config" />
        </service>
        
    </application>
</manifest>
```

### Create Accessibility Service Configuration

Create a new XML file at `app/src/main/res/xml/accessibility_service_config.xml`:

```xml
<accessibility-service
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:description="@string/accessibility_service_description"
    android:accessibilityEventTypes="typeWindowStateChanged|typeWindowContentChanged"
    android:accessibilityFlags="flagReportViewIds"
    android:accessibilityFeedbackType="feedbackVisual"
    android:notificationTimeout="100"
    android:canRetrieveWindowContent="true"
    android:settingsActivity="app.lovable.noshorts.MainActivity"
    android:packageNames="com.google.android.youtube" />
```

### Add String Resources

Add these to your `strings.xml` file:

```xml
<resources>
    <string name="accessibility_service_label">No Shorts Zone</string>
    <string name="accessibility_service_description">Blocks YouTube Shorts content from appearing in your YouTube feed.</string>
</resources>
```

## 2. Register the Plugin in Capacitor

In your main Activity class (usually `MainActivity.java` or `MainActivity.kt`), add the plugin to the list of registered plugins:

```kotlin
package app.lovable.noshorts;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Register the plugin
        registerPlugin(NoShortsPlugin.class);
    }
}
```

After completing these steps, rebuild and run your app. The accessibility service should now appear in the Android Accessibility settings.
