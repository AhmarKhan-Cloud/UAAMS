import { useState } from "react";
import { DashboardPageShell } from "../shared/DashboardPageShell";

export const BloggerCreatePostPage = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !content) {
      setMessage("Title and content are required.");
      return;
    }

    setMessage("Draft saved successfully. Connect backend API to publish.");
  };

  return (
    <DashboardPageShell
      title="Create Blog Post"
      subtitle="Write high-impact admission content and save draft revisions."
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div>
          <label className="mb-2 block text-sm text-slate-700">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-700">Excerpt</label>
          <textarea
            rows={3}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Short summary"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm text-slate-700">Content</label>
          <textarea
            rows={8}
            value={content}
            onChange={(event) => setContent(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Write content"
          />
        </div>

        {message ? (
          <p className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>
        ) : null}

        <button
          type="submit"
          className="rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
        >
          Save Draft
        </button>
      </form>
    </DashboardPageShell>
  );
};