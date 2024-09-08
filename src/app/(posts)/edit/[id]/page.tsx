import EditPost from "@/components/EditPost";
import { cookies } from "next/headers";

interface EditPostHandlerProps {
  params: { id: string };
}

export default function EditPostHandler({ params }: EditPostHandlerProps) {
  const token = cookies().get("token")?.value;

  if (!token) {
    return (
      <div className="text-center text-red-500">Authentication required.</div>
    );
  }

  if (!params?.id) {
    return <div className="text-center text-red-500">Post ID is required.</div>;
  }

  return <EditPost token={token} _id={params.id} />;
}
