# Mobile Bridge for FCM Token & Webview Communication

JavaScript bridge system for mobile webview communication with FCM token management and master account data transfer.

## Features

- **FCM Token Management**: Store and manage Firebase Cloud Messaging tokens
- **Cross-Platform Support**: Android WebView, iOS WebKit, React Native WebView
- **Master Account Integration**: Automatic data transmission for master accounts
- **Type-Safe**: Full TypeScript support with comprehensive type definitions
- **Fallback Storage**: LocalStorage fallback when mobile bridge unavailable
- **React Hook**: Easy integration with React components

## Quick Start

### Basic Usage

```typescript
import { getMobileBridge, initializeMobileBridgeForMaster } from '@/lib/mobile-bridge'

// Get bridge instance
const bridge = getMobileBridge()

// Send data to mobile app
await bridge.sendToMobile('USER_LOGIN', { userId: '123', timestamp: Date.now() })

// Store FCM token
await bridge.storeFCMToken('your-fcm-token')
```

### React Hook Usage

```typescript
import { useMobileBridge } from '@/lib/mobile-bridge'

function MyComponent() {
  const { 
    isAvailable, 
    platform, 
    fcmToken, 
    sendToMobile, 
    storeFCMToken 
  } = useMobileBridge()

  const handleSendData = async () => {
    const result = await sendToMobile('TEST_ACTION', { message: 'Hello Mobile!' })
    console.log('Result:', result)
  }

  return (
    <div>
      <p>Platform: {platform}</p>
      <p>Available: {isAvailable ? 'Yes' : 'No'}</p>
      <p>FCM Token: {fcmToken ? 'Available' : 'None'}</p>
      <button onClick={handleSendData}>Send to Mobile</button>
    </div>
  )
}
```

## Master Account Integration

The bridge automatically initializes when a master account logs in:

1. **Authentication**: User signs in with `leegunsun01@gmail.com`
2. **Auto-Detection**: System detects master account status
3. **Bridge Initialization**: Automatically calls `initializeMobileBridgeForMaster()`
4. **Data Transfer**: Sends user data and FCM token to mobile app

### User Data Format

```typescript
interface UserData {
  uid: string;           // Firebase user ID
  email: string;         // User email (leegunsun01@gmail.com)
  displayName?: string;  // Display name if available
  photoURL?: string;     // Profile photo URL if available
  isMaster: boolean;     // Always true for master account
  fcmToken?: string;     // FCM token if available
  timestamp: number;     // Unix timestamp
}
```

## Mobile App Integration

### Android WebView

```java
// In your Android WebView setup
webView.addJavascriptInterface(new JavaScriptInterface(), "AndroidBridge");

public class JavaScriptInterface {
    @JavascriptInterface
    public void receiveFCMToken(String token) {
        // Handle FCM token
        Log.d("Bridge", "FCM Token: " + token);
    }
    
    @JavascriptInterface
    public void receiveUserData(String userData) {
        // Handle user data JSON
        Log.d("Bridge", "User Data: " + userData);
    }
    
    @JavascriptInterface
    public void receiveData(String action, String data) {
        // Handle general data
        Log.d("Bridge", "Action: " + action + ", Data: " + data);
    }
}
```

### iOS WebKit

```swift
// In your iOS WebKit setup
webView.configuration.userContentController.add(self, name: "fcmTokenHandler")
webView.configuration.userContentController.add(self, name: "userDataHandler")
webView.configuration.userContentController.add(self, name: "generalHandler")

func userContentController(_ userContentController: WKUserContentController, 
                          didReceive message: WKScriptMessage) {
    switch message.name {
    case "fcmTokenHandler":
        // Handle FCM token
        print("FCM Token: \\(message.body)")
    case "userDataHandler":
        // Handle user data
        print("User Data: \\(message.body)")
    case "generalHandler":
        // Handle general data
        print("General Data: \\(message.body)")
    default:
        break
    }
}
```

### React Native WebView

```javascript
// In your React Native WebView
const handleMessage = (event) => {
  const message = JSON.parse(event.nativeEvent.data);
  
  switch (message.action) {
    case 'FCM_TOKEN_STORE':
      console.log('FCM Token:', message.data.token);
      break;
    case 'USER_DATA_SEND':
      console.log('User Data:', message.data);
      break;
    default:
      console.log('General Message:', message);
  }
};

<WebView
  source={{ uri: 'your-web-url' }}
  onMessage={handleMessage}
/>
```

## API Reference

### MobileBridge Class

#### Methods

- `storeFCMToken(token?: string): Promise<BridgeResponse>`
- `getFCMToken(): string | null`
- `sendUserData(userData: UserData): Promise<BridgeResponse>`
- `sendToMobile(action: string, data: any): Promise<BridgeResponse>`
- `initializeForMasterAccount(userData: UserData): Promise<BridgeResponse>`
- `getStatus(): BridgeStatus`
- `clearStoredData(): void`

### Convenience Functions

- `initializeMobileBridgeForMaster(userData: UserData): Promise<BridgeResponse>`
- `storeFCMTokenToMobile(token?: string): Promise<BridgeResponse>`
- `sendUserDataToMobile(userData: UserData): Promise<BridgeResponse>`
- `sendDataToMobile(action: string, data: any): Promise<BridgeResponse>`
- `getCurrentFCMToken(): string | null`
- `getMobileBridgeStatus(): BridgeStatus`

## Development & Testing

### Debug Component

The `MobileBridgeStatus` component provides real-time monitoring:

- Platform detection
- Connection status
- FCM token status
- Test bridge functionality
- Clear stored data

### Console Logging

Enable detailed logging:

```typescript
const bridge = getMobileBridge({ enableLogging: true })
```

### Testing Workflow

1. **Login as Master**: Use `leegunsun01@gmail.com` account
2. **Check Status**: Use MobileBridgeStatus component
3. **Test Bridge**: Click "Test Bridge" button
4. **Request FCM**: Click "Get FCM" button
5. **Monitor Console**: Check browser console for detailed logs

## Error Handling

All bridge methods return `BridgeResponse`:

```typescript
interface BridgeResponse {
  success: boolean;
  message?: string;
  data?: any;
}
```

Example error handling:

```typescript
const result = await bridge.sendToMobile('TEST', { data: 'test' });

if (!result.success) {
  console.error('Bridge error:', result.message);
  // Handle error appropriately
}
```

## Configuration

```typescript
interface BridgeConfig {
  enableLogging?: boolean;    // Default: true
  fallbackStorage?: boolean;  // Default: true
  maxRetries?: number;        // Default: 3
  timeout?: number;           // Default: 5000ms
}

const bridge = getMobileBridge({
  enableLogging: false,
  fallbackStorage: true,
  maxRetries: 5,
  timeout: 10000
});
```

## Browser Support

- Chrome/Chromium (Android WebView)
- Safari (iOS WebView)
- React Native WebView
- Desktop browsers (with fallback storage)

## Security Considerations

- Only master accounts can send sensitive data
- FCM tokens are stored securely
- All communications are logged for debugging
- LocalStorage used as secure fallback

## Troubleshooting

### Common Issues

1. **No Platform Detected**: Bridge works but stores data locally
2. **FCM Token Missing**: User needs to grant notification permission
3. **Master Account Not Detected**: Check email matches `leegunsun01@gmail.com`
4. **Mobile App Not Responding**: Verify mobile bridge implementation

### Debug Steps

1. Check `getMobileBridgeStatus()` for current state
2. Use MobileBridgeStatus component for visual debugging
3. Enable logging and check console output
4. Test with different mobile platforms
5. Verify mobile app bridge implementation