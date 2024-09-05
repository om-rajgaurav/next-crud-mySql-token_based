import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/dbMethods';
import { Post } from '../../../types/post';

export async function GET() {
  const posts: Post[] = await getPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, description }: Post = await request.json();
  const newPost = await createPost({ title, description });
  return NextResponse.json(newPost, { status: 201 });
}


