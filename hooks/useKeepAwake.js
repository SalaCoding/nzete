   import { useKeepAwake } from 'expo-keep-awake';

   export default function Screen() {
       useKeepAwake(undefined, { suppressDeactivateWarnings: true });
     return null;
   }
   