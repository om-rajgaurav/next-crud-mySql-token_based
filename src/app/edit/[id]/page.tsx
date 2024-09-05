"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Post {
  id: number;
  title: string;
  description: string;
}

export default function EditPost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post>({ id: 0, title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const id = parseInt(params.id, 10);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts?id=${id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data: Post = await response.json();
      setPost(data[0]);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      router.push("/");
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 h-screen items-center justify-center">
        Loading...
      </p>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Title:
          </label>
          <input
            type="text"
            placeholder="Title"
            value={post?.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Description:
          </label>
          <textarea
            placeholder="Content"
            value={post?.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>
        <button
          type="submit"
          disabled={updating}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {updating ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
}
