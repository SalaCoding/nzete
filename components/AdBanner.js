//import React from 'react';
//import { View } from 'react-native';
//import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

// 1. Replace with your actual Ad Unit ID from the AdMob dashboard.
// It looks like: ca-app-pub-xxxxxxxx/yyyyyyyy
// If you are testing, keep 'TestIds.BANNER' to avoid getting banned.
//const adUnitId = __DEV__ ? TestIds.BANNER : 'ca-app-pub-6981062586351046~4390104828';

export const AdBanner = () => {
  return (
    <View style={{ alignItems: 'center', marginVertical: 10 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};