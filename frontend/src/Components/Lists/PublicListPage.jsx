import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPublicSingleList } from "../../Actions/UserListActions";
import DetailedListItems from "./DetailedListItems";

export default function PublicListPage() {
  const { listId } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicSingleList(listId).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [listId]);

  if (loading) return <p className="text-gray-400 p-8">Loading list...</p>;
  if (!list) return <p className="text-gray-400 p-8">List not found.</p>;

  return (
    <DetailedListItems
      list={list}
      onBack={() => navigate(-1)}
      isPublic={true}
    />
  );
}