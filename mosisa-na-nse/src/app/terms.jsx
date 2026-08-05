import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function Terms() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      
      {/* Title */}
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        📜 Terms of Service
      </Text>

      {/* Section 1 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        1. Acceptance of Terms
      </Text>
      <Text style={{ marginBottom: 20 }}>
        By using Nzete, you agree to these Terms of Service. If you do not agree, 
        please discontinue use of the app.
      </Text>

      {/* Section 2 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        2. Use of the App
      </Text>
      <Text style={{ marginBottom: 20 }}>
        You agree not to:
        {"\n"}• Misuse the app
        {"\n"}• Attempt unauthorized access
        {"\n"}• Upload harmful or illegal content
      </Text>

      {/* Section 3 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        3. Accounts
      </Text>
      <Text style={{ marginBottom: 20 }}>
        You are responsible for maintaining the confidentiality of your login credentials.
      </Text>

      {/* Section 4 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        4. Content
      </Text>
      <Text style={{ marginBottom: 20 }}>
        All content within Nzete is protected by copyright. You may not copy, 
        redistribute, or resell any content without permission.
      </Text>

      {/* Section 5 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        5. Termination
      </Text>
      <Text style={{ marginBottom: 20 }}>
        We may suspend or terminate accounts that violate our policies.
      </Text>

      {/* Section 6 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        6. Limitation of Liability
      </Text>
      <Text style={{ marginBottom: 20 }}>
        Nzete is provided “as is.” We are not liable for damages resulting from misuse 
        or technical issues.
      </Text>

      {/* Section 7 */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        7. Contact
      </Text>
      <Text style={{ marginBottom: 40 }}>
        For questions about these terms, please email:{" "}
        <Text style={{ fontWeight: 'bold' }}>support@nzeteapp.com</Text>
      </Text>

    </ScrollView>
  );
}
