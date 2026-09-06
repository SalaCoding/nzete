import { Text, ScrollView } from 'react-native';
import React from 'react';

export default function Privacy() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      
      {/* Title */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Privacy Policy
      </Text>

      {/* Intro */}
      <Text style={{ marginBottom: 15 }}>
        At Nzete, we value your privacy and are committed to protecting your personal information. 
        This Privacy Policy explains how we collect, use, and safeguard your data when you use our application.
      </Text>

      {/* Section 1 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        1. Information We Collect
      </Text>
      <Text style={{ marginBottom: 10 }}>
        We collect only the information necessary to operate the app, including:
      </Text>
      <Text style={{ marginBottom: 10 }}>
        • Email address (for login and account creation){"\n"}
        • Username and profile picture{"\n"}
        • Basic usage data to improve app performance{"\n"}
      </Text>
      <Text style={{ marginBottom: 10 }}>
        We do not collect sensitive information without your consent.
      </Text>

      {/* Section 2 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        2. How We Use Your Information
      </Text>
      <Text style={{ marginBottom: 10 }}>
        We use your information to:
      </Text>
      <Text style={{ marginBottom: 10 }}>
        • Create and manage your account{"\n"}
        • Sync your profile and reading progress{"\n"}
        • Improve app performance and stability{"\n"}
      </Text>
      <Text style={{ marginBottom: 10 }}>
        We do not sell, share, or use your data for advertising.
      </Text>

      {/* Section 3 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        3. Nzete Does NOT Collect:
      </Text>
      <Text style={{ marginBottom: 10 }}>
        • Advertising identifiers{"\n"}
        • Device tracking data{"\n"}
        • Location data{"\n"}
        • Data used for cross‑app tracking{"\n"}
      </Text>

      {/* Section 4 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        4. Third‑Party Services
      </Text>
      <Text style={{ marginBottom: 10 }}>
        Nzete may use secure third‑party services for:
      </Text>
      <Text style={{ marginBottom: 10 }}>
        • Authentication{"\n"}
        • Image storage{"\n"}
        • Error monitoring{"\n"}
      </Text>
      <Text style={{ marginBottom: 10 }}>
        These services follow industry‑standard privacy and security practices.
      </Text>

      {/* Section 5 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        5. Your Rights
      </Text>
      <Text style={{ marginBottom: 10 }}>
        You may request:
      </Text>
      <Text style={{ marginBottom: 10 }}>
        • Account deletion{"\n"}
        • Data correction{"\n"}
        • Data export{"\n"}
      </Text>
      <Text style={{ marginBottom: 10 }}>
        Contact us at <Text style={{ fontWeight: 'bold' }}>support@nzeteapp.com</Text> for any privacy‑related requests.
      </Text>

      {/* Section 6 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 20 }}>
        6. Contact
      </Text>
      <Text style={{ marginBottom: 30 }}>
        For privacy questions, please email:{" "}
        <Text style={{ fontWeight: 'bold' }}>support@nzeteapp.com</Text>
      </Text>

    </ScrollView>
  );
}
