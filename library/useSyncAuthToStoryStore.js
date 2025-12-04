import { useAuthUserStore } from './authUserStore';
import { useStoryStore } from './storyStore'; // or extract to helpers

export const syncUserToStoryStore = () => {
  const auth = useAuthUserStore.getState();
  const story = useStoryStore.getState();

  const uid = auth.user?.id || auth.user?._id || auth.user?.userId || null;
  if (uid) story.setUserId(uid);
  if (auth.token) story.setToken(auth.token);
};
