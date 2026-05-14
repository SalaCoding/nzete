import { VerificationInfoScreen } from '../components/VerificationInfoScreen';
import { useLocalSearchParams } from 'expo-router';

export default function VerifyInfoRoute() {
  const { email } = useLocalSearchParams();
  // Ensure we pass the parameter cleanly as a single string field
  const emailString = Array.isArray(email) ? email[0] : email;
  return <VerificationInfoScreen email={emailString} />;
}
