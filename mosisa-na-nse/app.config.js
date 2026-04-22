export default ({ config }) => ({
  ...config,
  name: "nzete",
  slug: "mosisa-ya-nse",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon_nzete@1.png",
  scheme: "mosisananse",
  userInterfaceStyle: "automatic",
  ios: {
  ...config.ios,
  icon: "./assets/images/icon_nzete@1.png",
  supportsTablet: true,
  bundleIdentifier: "com.salacoding.mosisananse",
  googleServicesFile: process.env.IOS_GOOGLE_SERVICES_FILE,
  infoPlist: {
    ITSAppUsesNonExemptEncryption: false,
  },
},
  android: {
  ...config.android,
  versionCode: 60,
  icon: "./assets/images/icon_nzete@1.png",
  package: "com.salacoding.mosisananse",
  adaptiveIcon: {
    backgroundColor: "#E6F4FE",
    foregroundImage: "./assets/images/android-icon-foreground.png",
    backgroundImage: "./assets/images/android-icon-background.png",
    monochromeImage: "./assets/images/android-icon-monochrome.png",
  },
  predictiveBackGestureEnabled: false,
  googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
  permissions: [
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_FINE_LOCATION",
  ],
},
  web: {
    output: "server",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    ["expo-location", { locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location." }],
    "expo-router",
    ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, contentFit: "contain", backgroundColor: "#ffffff", dark: { backgroundColor: "#000000" } }],
    "expo-secure-store",
    "expo-web-browser",
    "expo-notifications",
    "expo-font",
    "expo-image",
    ["expo-build-properties", {
      buildReactNativeFromSource: false,
      android: {
        compileSdkVersion: 36,
        targetSdkVersion: 36,
        buildToolsVersion: "36.0.0",
        "buildReactNativeFromSource": true
      },
      ios: {
        deploymentTarget: "15.1",
        "buildReactNativeFromSource": true
      }
    }],
  ],
   runtimeVersion: {
      policy: "appVersion",
    },
  updates: {
    url: "https://u.expo.dev/4c21570f-f55a-409e-aeff-2b9c981412fd",
    enableBsdiffPatchSupport: true,
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    EXPO_PUBLIC_API_URL: "https://nzete.onrender.com",
    router: { origin: "https://nzete.onrender.com" },
    eas: { projectId: "4c21570f-f55a-409e-aeff-2b9c981412fd" },
  },
  owner: "salacoding",
});