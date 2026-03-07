"use client";

import { FormEvent, useMemo, useState } from "react";
import { getComments, getPosts, saveComment, savePost } from "@/lib/storage";
import { CommunityPost, PostComment } from "@/types";

interface PostFeedProps {
  examSlug: string;
  authorName: string;
}

export default function PostFeed({ examSlug, authorName }: PostFeedProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(() =>
    getPosts().filter((post) => post.examSlug === examSlug)
  );
  const [comments, setComments] = useState<PostComment[]>(() =>
    getComments().filter((comment) => comment.examSlug === examSlug)
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentValue, setCommentValue] = useState<Record<string, string>>({});

  const commentByPost = useMemo(() => {
    return comments.reduce<Record<string, PostComment[]>>((acc, comment) => {
      if (!acc[comment.postId]) acc[comment.postId] = [];
      acc[comment.postId].push(comment);
      return acc;
    }, {});
  }, [comments]);

  const submitPost = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const post: CommunityPost = {
      id: crypto.randomUUID(),
      examSlug,
      authorName,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString()
    };
    savePost(post);
    setPosts((prev) => [post, ...prev]);
    setTitle("");
    setContent("");
  };

  const submitComment = (postId: string) => {
    const value = commentValue[postId];
    if (!value || !value.trim()) return;
    const comment: PostComment = {
      id: crypto.randomUUID(),
      postId,
      examSlug,
      authorName,
      content: value.trim(),
      createdAt: new Date().toISOString()
    };
    saveComment(comment);
    setComments((prev) => [...prev, comment]);
    setCommentValue((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div className="space-y-4">
      <section className="card p-4">
        <h2 className="mb-3 text-lg font-semibold">Community Forum</h2>
        <form className="space-y-2" onSubmit={submitPost}>
          <input
            className="input"
            placeholder="Post title (mandatory)"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <textarea
            className="input min-h-24"
            placeholder="Ask a question or share your strategy (mandatory)"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            required
          />
          <button type="submit" className="rounded-md bg-[#1f275d] px-4 py-2 text-sm font-semibold !text-white hover:!text-white">
            Create post
          </button>
        </form>
      </section>

      {posts.length === 0 && (
        <section className="card p-4 text-sm text-neutral-600">
          No posts yet. Be the first to start the conversation.
        </section>
      )}

      {posts.map((post) => (
        <article key={post.id} className="card p-4">
          <h3 className="text-base font-semibold">{post.title}</h3>
          <p className="mt-2 whitespace-pre-wrap text-sm">{post.content}</p>
          <p className="mt-2 text-xs text-neutral-500">
            by {post.authorName} · {new Date(post.createdAt).toLocaleString()}
          </p>

          <div className="mt-3 border-t border-neutral-200 pt-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-600">
              Comments
            </p>
            <div className="space-y-2">
              {(commentByPost[post.id] ?? []).map((comment) => (
                <div key={comment.id} className="rounded-md border border-neutral-200 px-3 py-2 text-sm">
                  <p>{comment.content}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {comment.authorName} · {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                className="input"
                placeholder="Write a comment"
                value={commentValue[post.id] ?? ""}
                onChange={(event) =>
                  setCommentValue((prev) => ({ ...prev, [post.id]: event.target.value }))
                }
              />
              <button
                type="button"
                className="rounded-md border border-neutral-300 px-3 text-sm"
                onClick={() => submitComment(post.id)}
              >
                Reply
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
