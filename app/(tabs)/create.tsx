import { Redirect, type Href } from 'expo-router';

export default function CreateScreen() {
  return <Redirect href={'/upload' as Href} />;
}
