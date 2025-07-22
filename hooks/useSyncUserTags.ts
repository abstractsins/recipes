import { useEffect } from 'react';
import { Tag } from '@/types/types';

type Params<TFormState> = {
  type: 'ingredient' | 'recipe';
  uid: number | null;      
  loadUserTags: (type: 'ingredient' | 'recipe', id: number) => Promise<Tag[]>;
  setFormState: React.Dispatch<React.SetStateAction<TFormState>>;
  tagResetKey: keyof TFormState;
  setUserTagsWaiting: React.Dispatch<React.SetStateAction<boolean>>;
  setUserTags: React.Dispatch<React.SetStateAction<Tag[]>>;
};

/**
 * Keep the form's user-tag list in sync with the currently-selected user.
 */
export function useSyncUserTags<TFormState>({
  type,
  uid,
  loadUserTags,
  setFormState,
  tagResetKey,
  setUserTagsWaiting,
  setUserTags,
}: Params<TFormState>) {
  useEffect(() => {
    if (!uid) return;

    setFormState(prev => ({ ...prev, [tagResetKey]: [] as any }));
    setUserTagsWaiting(true);

    loadUserTags(type, uid)
      .then(setUserTags)
      .finally(() => setUserTagsWaiting(false));
  }, [type, uid]);
}
