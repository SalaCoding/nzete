import { VerificationInfoScreen } from './VerificationInfoScreen';
import { useLocalSearchParams } from 'expo-router';

export default function VerifyInfoRoute() {
  const { email } = useLocalSearchParams();
  return <VerificationInfoScreen email={email} />;
}