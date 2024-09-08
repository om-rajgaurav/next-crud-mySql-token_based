import CreatePost from "@/components/createPost";
import { cookies } from "next/headers";

export default function handleCreatePost() {
  const token = cookies().get("token")?.value as string | undefined;
  return <CreatePost token={token} />;
}
