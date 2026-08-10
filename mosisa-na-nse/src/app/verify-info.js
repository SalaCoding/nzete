import { VerificationInfoScreen } from '../components/VerificationInfoScreen';
import { useLocalSearchParams } from 'expo-router';

export default function VerifyInfoRoute() {
  const { email } = useLocalSearchParams();
  const emailString = Array.isArray(email) ? email[0] : email;
  return <VerificationInfoScreen email={emailString} />;
}
