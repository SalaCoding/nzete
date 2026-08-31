import React from 'react';
import { View, Text } from 'react-native';

export default function FAQ() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>FAQ Page</Text>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q1: What is Nzete?</Text>
                <Text>A1: Nzete is a learning and reading companion designed to help users explore stories, improve reading skills, and enjoy educational content in a fun and interactive way.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q2: How do I create an account?</Text>
                <Text>A2: You can create an account by tapping on the `&quot;`Sign Up`&quot;` button and filling out the required information. Once registered, you can log in and start using Nzete.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q3: I cannot log in. What should I do?</Text>
                <Text>A3: If you`&apos`re having trouble logging in, make sure your username and password are correct. If you`&apos`ve forgotten your password, you can reset it using the `&quot;`Forgot Password`&quot;` link.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q4: How can I contact support?</Text>
                <Text>A4: You can contact our support team by emailing support@nzete.com or using the `&quot;`Contact Us`&quot;` option within the app.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q5: How do I update my profile picture or username?</Text>
                <Text>A5: You can update your profile picture or username by going to your profile settings and making the desired changes.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q6: How do I report a bug?</Text>
                <Text>A6: You can report a bug by navigating to the `&quot;`Help`&quot;` or `&quot;`Feedback`&quot;` section within the app and following the instructions provided.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q7: Does Nzete track users?</Text>
                <Text>A7: Nzete does not track users beyond what is necessary for providing the service and improving user experience. We are committed to protecting your privacy and ensuring your data is secure.</Text>
            </View>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold' }}>Q8: How do I delete my account?</Text>
                <Text>A8: If you wish to delete your account, please contact our support team at support@nzete.com.</Text>
            </View>
        </View>
    );
}