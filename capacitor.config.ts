import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter.KaloriApp',
  appName: 'KaloriApp',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      "launchAutoHide": false,
      "androidScaleType": "CENTER_CROP",
      "splashFullScreen": true,
      "splashImmersive": false,
      "backgroundColor": "#ffffff" // YOUR SPLASH SCREEN MAIN COLOR
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;