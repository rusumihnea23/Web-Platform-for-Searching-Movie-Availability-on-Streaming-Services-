import { useState } from "react";
import { likeList } from "../../../../Actions/UserListActions";

export function useListLike(setLists) {
  const [togglingLike, setTogglingLike] = useState(null);

  const handleToggleLike = async (e, list) => {
    e.stopPropagation();
    setTogglingLike(list.id);
    await likeList(list.id);
    setLists((prev) =>
      prev.map((l) =>
        l.id === list.id
          ? { ...l, likedByMe: !l.likedByMe, likeCount: l.likedByMe ? (l.likeCount ?? 1) - 1 : (l.likeCount ?? 0) + 1 }
          : l
      )
    );
    setTogglingLike(null);
  };

  const handleUnlike = async (e, listId) => {
    e.stopPropagation();
    setTogglingLike(listId);
    await likeList(listId);
    setLists((prev) => prev.filter((l) => l.id !== listId));
    setTogglingLike(null);
  };

  return { togglingLike, handleToggleLike, handleUnlike };
}