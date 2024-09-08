"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

interface Post {
  id: number;
  title: string;
  description: string;
}

export default function Home({ token }: { token: string }) {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Post[] = await response.json();
      setPosts(data);
    } catch (error: any) {
      console.error("Error fetching posts:", error);
      setError("Failed to load posts.");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  const handleDelete = async (id: number) => {
    if (!token) return;
    console.log('id',id)
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setPosts(posts.filter((post) => post.id !== id));
    } catch (error: any) {
      console.error("Error deleting post:", error);
      
    }
  };
  

  const handleSignOut = async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/signout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        window.location.href = "/login";
      } else {
        console.error("Error signing out");
      }
    } catch (error: any) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Posts</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
      <Link
        href="/create"
        className="mb-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create New Post
      </Link>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">
                Title
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">
                Content
              </th>
              <th className="py-3 px-6 text-left text-gray-600 font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-200">
                <td className="py-4 px-6 text-gray-700">{post.title}</td>
                <td className="py-4 px-6 text-gray-700">{post.description}</td>
                <td className="py-4 px-6">
                  <Link
                    href={`/edit/${post.id}`}
                    className="text-blue-500 hover:text-blue-700 mr-4"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
