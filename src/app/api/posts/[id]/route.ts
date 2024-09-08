import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/postMethodsdb";
import { Post } from "@/types/post";
import { getUserIdFromRequest } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '', 10);
  const post: Post | null = await getPostById(id);
  if (post) {
    return NextResponse.json(post);
  }
  return NextResponse.json({ message: 'Post not found' }, { status: 404 });
}

export async function PUT(request: Request) {
  const updatedPost: Post = await request.json();
  const result = await updatePost(updatedPost);
  if (result) {
    return NextResponse.json(result);
  }
  return NextResponse.json({ message: 'Update failed' }, { status: 400 });
}

export async function DELETE(request: Request) {
  const { id }: { id: number } = await request.json();
  const result = await deletePost(id);
  if (result) {
    return NextResponse.json(null, { status: 200 });
  }
  return NextResponse.json({ message: 'Delete failed' }, { status: 400 });
}
