import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Heart,
  MessageCircle,
  Reply,
  Search,
  Send,
  Tag,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { api } from "../../lib/apiClient";
import { onDataUpdated } from "../../lib/socketClient";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Just now";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizePost = (item) => ({
  id: String(item?._id || item?.id || ""),
  title: item?.title || "",
  excerpt: item?.excerpt || "",
  content: item?.content || "",
  author: item?.author?.name || "University Representative",
  authorTitle: "University Representative",
  university: item?.university?.name || "University",
  publishDate: formatDate(item?.publishedAt || item?.createdAt),
  readTime: item?.readTime || "1 min",
  category: item?.category || "General",
  tags: Array.isArray(item?.tags) ? item.tags : [],
  imageUrl: item?.imageUrl || "",
  views: Number(item?.views || 0),
  likesCount: Number(item?.likesCount || 0),
  likedByMe: Boolean(item?.likedByMe),
  commentsCount: Number(item?.commentsCount || 0),
  repliesCount: Number(item?.repliesCount || 0),
});

function StudentBlog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPostId, setSelectedPostId] = useState("");

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [replyDrafts, setReplyDrafts] = useState({});
  const [activeReplyInput, setActiveReplyInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadPosts = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }
    setError("");

    try {
      const response = await api.get("/students/me/blogs?limit=200");
      const items = response?.data?.posts || [];
      setPosts(items.map(normalizePost));
    } catch (loadError) {
      setError(loadError?.message || "Unable to load blog posts.");
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  }, []);

  const loadComments = useCallback(async (postId, { silent = false } = {}) => {
    if (!postId) return;
    if (!silent) {
      setIsLoadingComments(true);
    }
    setCommentError("");

    try {
      const response = await api.get(`/students/blogs/${postId}/comments`);
      const nextComments = Array.isArray(response?.data?.comments) ? response.data.comments : [];
      const postInteraction = response?.data?.postInteraction || {};

      setComments(nextComments);
      setPosts((previous) =>
        previous.map((item) =>
          item.id === postId
            ? {
                ...item,
                likesCount: Number(postInteraction.likesCount ?? item.likesCount),
                likedByMe: Boolean(postInteraction.likedByMe ?? item.likedByMe),
                commentsCount: countRootComments(nextComments),
                repliesCount: countReplies(nextComments),
              }
            : item,
        ),
      );
    } catch (loadError) {
      setCommentError(loadError?.message || "Unable to load comments.");
    } finally {
      if (!silent) {
        setIsLoadingComments(false);
      }
    }
  }, []);

  useEffect(() => {
    loadPosts();
    const unsubscribe = onDataUpdated((event) => {
      if (event?.resource === "blogs" || event?.resource === "blog-interactions") {
        loadPosts({ silent: true });
        if (selectedPostId) {
          loadComments(selectedPostId, { silent: true });
        }
      }
    });

    return () => unsubscribe();
  }, [loadPosts, loadComments, selectedPostId]);

  useEffect(() => {
    if (!selectedPostId) return;
    const exists = posts.some((post) => post.id === selectedPostId);
    if (!exists) {
      setSelectedPostId("");
      setComments([]);
    }
  }, [posts, selectedPostId]);

  useEffect(() => {
    if (!selectedPostId) return;
    loadComments(selectedPostId);
  }, [selectedPostId, loadComments]);

  const selectedPost = useMemo(
    () => posts.find((post) => post.id === selectedPostId) || null,
    [posts, selectedPostId],
  );

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(posts.map((post) => post.category).filter(Boolean)))],
    [posts],
  );

  const filteredPosts = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search) ||
        post.excerpt.toLowerCase().includes(search) ||
        post.tags.some((tag) => tag.toLowerCase().includes(search));
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const handleTogglePostLike = async (postId) => {
    try {
      const response = await api.patch(`/students/blogs/${postId}/like`);
      const data = response?.data || {};
      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId
            ? {
                ...post,
                likesCount: Number(data.likesCount ?? post.likesCount),
                likedByMe: Boolean(data.likedByMe ?? post.likedByMe),
              }
            : post,
        ),
      );
    } catch (updateError) {
      setCommentError(updateError?.message || "Unable to update like.");
    }
  };

  const handleAddComment = async () => {
    const content = String(newComment || "").trim();
    if (!content || !selectedPostId) return;

    setIsSubmitting(true);
    setCommentError("");
    try {
      await api.post(`/students/blogs/${selectedPostId}/comments`, { content });
      setNewComment("");
      await Promise.all([loadComments(selectedPostId, { silent: true }), loadPosts({ silent: true })]);
    } catch (submitError) {
      setCommentError(submitError?.message || "Unable to add comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReply = async (parentCommentId) => {
    const content = String(replyDrafts[parentCommentId] || "").trim();
    if (!content || !selectedPostId) return;

    setIsSubmitting(true);
    setCommentError("");
    try {
      await api.post(`/students/blogs/${selectedPostId}/comments`, {
        content,
        parentCommentId,
      });
      setReplyDrafts((previous) => ({ ...previous, [parentCommentId]: "" }));
      setActiveReplyInput("");
      await Promise.all([loadComments(selectedPostId, { silent: true }), loadPosts({ silent: true })]);
    } catch (submitError) {
      setCommentError(submitError?.message || "Unable to add reply.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    if (!selectedPostId) return;
    setCommentError("");

    try {
      await api.patch(`/students/blog-comments/${commentId}/like`);
      await loadComments(selectedPostId, { silent: true });
    } catch (updateError) {
      setCommentError(updateError?.message || "Unable to update comment like.");
    }
  };

  if (selectedPost) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => {
            setSelectedPostId("");
            setComments([]);
            setCommentError("");
          }}
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
        >
          {"<-"} Back to Blog
        </button>

        <Card className="bg-white border border-slate-200 overflow-hidden">
          {selectedPost.imageUrl ? (
            <img
              src={selectedPost.imageUrl}
              alt={selectedPost.title}
              className="w-full h-96 object-cover"
            />
          ) : (
            <div className="h-56 bg-slate-100 flex items-center justify-center text-slate-500">
              No cover image
            </div>
          )}

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-emerald-100 text-emerald-700">{selectedPost.category}</Badge>
              {selectedPost.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-slate-600">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-slate-900 mb-4">{selectedPost.title}</h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-full">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-slate-900">{selectedPost.author}</div>
                <div className="text-sm text-slate-600">
                  {selectedPost.authorTitle} | {selectedPost.university}
                </div>
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime}
                </span>
              </div>
            </div>

            <div className="prose max-w-none">
              {selectedPost.content.split("\n").map((paragraph, index) => (
                <p key={`${selectedPost.id}-paragraph-${index}`} className="text-slate-700 mb-4 whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <span>{selectedPost.views.toLocaleString()} views</span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleTogglePostLike(selectedPost.id)}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs ${
                    selectedPost.likedByMe
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${selectedPost.likedByMe ? "fill-rose-500 text-rose-500" : ""}`} />
                  {selectedPost.likesCount}
                </button>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <MessageCircle className="h-4 w-4" />
                  {selectedPost.commentsCount}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                  <Reply className="h-4 w-4" />
                  {selectedPost.repliesCount}
                </span>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6 space-y-4">
              <h3 className="text-slate-900">Comments</h3>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Write a comment..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={isSubmitting || !newComment.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-70"
                >
                  <Send className="h-4 w-4" />
                  Post
                </button>
              </div>

              {commentError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{commentError}</p>
              ) : null}

              {isLoadingComments ? (
                <p className="text-sm text-slate-600">Loading comments...</p>
              ) : null}

              {!isLoadingComments && comments.length === 0 ? (
                <p className="text-sm text-slate-500">No comments yet. Start the discussion.</p>
              ) : null}

              {!isLoadingComments && comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment) => (
                    <CommentItem
                      key={comment.id}
                      comment={comment}
                      replyDraft={replyDrafts[comment.id] || ""}
                      isReplyInputOpen={activeReplyInput === comment.id}
                      onReplyToggle={() =>
                        setActiveReplyInput((previous) => (previous === comment.id ? "" : comment.id))
                      }
                      onReplyDraftChange={(value) =>
                        setReplyDrafts((previous) => ({ ...previous, [comment.id]: value }))
                      }
                      onReplySubmit={() => handleAddReply(comment.id)}
                      onCommentLike={handleToggleCommentLike}
                      onReplyLike={handleToggleCommentLike}
                      isSubmitting={isSubmitting}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">University Blog</h1>
        <p className="text-slate-600">Insights and guidance from universities (real-time updates enabled)</p>
      </div>

      <Card className="bg-white border border-slate-200 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category === "all" ? "All" : category}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card className="bg-white border border-slate-200 p-12 text-center text-sm text-slate-600">
          Loading blog posts...
        </Card>
      ) : null}

      {!isLoading && error ? (
        <Card className="bg-red-50 border border-red-200 p-6 text-sm text-red-700">{error}</Card>
      ) : null}

      {!isLoading && !error && filteredPosts.length === 0 ? (
        <Card className="bg-white border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No articles found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </Card>
      ) : null}

      {!isLoading && !error && filteredPosts.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPostId(post.id)}
            >
              {post.imageUrl ? (
                <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              ) : (
                <div className="h-48 bg-slate-100 flex items-center justify-center text-slate-500">
                  No cover image
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-slate-600">{post.university}</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">{post.category}</Badge>
                </div>

                <h3 className="text-slate-900 mb-2 line-clamp-2">{post.title}</h3>

                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="mb-4 flex items-center gap-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <Heart className={`h-3.5 w-3.5 ${post.likedByMe ? "fill-rose-500 text-rose-500" : ""}`} />
                    {post.likesCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {post.commentsCount}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Reply className="h-3.5 w-3.5" />
                    {post.repliesCount}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {post.publishDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    Read More
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CommentItem({
  comment,
  replyDraft,
  isReplyInputOpen,
  onReplyToggle,
  onReplyDraftChange,
  onReplySubmit,
  onCommentLike,
  onReplyLike,
  isSubmitting,
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-900">{comment.student?.name || "Student"}</p>
          <p className="text-xs text-slate-500">{formatDateTime(comment.createdAt)}</p>
        </div>
      </div>

      <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{comment.content}</p>

      <div className="mt-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onCommentLike(comment.id)}
          className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs ${
            comment.likedByMe
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-slate-300 bg-white text-slate-700"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${comment.likedByMe ? "fill-rose-500 text-rose-500" : ""}`} />
          {comment.likesCount}
        </button>
        <button
          type="button"
          onClick={onReplyToggle}
          className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700"
        >
          <Reply className="h-3.5 w-3.5" />
          Reply
        </button>
      </div>

      {isReplyInputOpen ? (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="text"
            value={replyDraft}
            onChange={(event) => onReplyDraftChange(event.target.value)}
            placeholder="Write a reply..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="button"
            onClick={onReplySubmit}
            disabled={!replyDraft.trim() || isSubmitting}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs text-white hover:bg-emerald-700 disabled:opacity-70"
          >
            Send
          </button>
        </div>
      ) : null}

      {Array.isArray(comment.replies) && comment.replies.length > 0 ? (
        <div className="mt-3 space-y-2 border-l border-slate-300 pl-3">
          {comment.replies.map((reply) => (
            <div key={reply.id} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-900">{reply.student?.name || "Student"}</p>
                  <p className="text-xs text-slate-500">{formatDateTime(reply.createdAt)}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-line">{reply.content}</p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReplyLike(reply.id)}
                  className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-xs ${
                    reply.likedByMe
                      ? "border-rose-200 bg-rose-50 text-rose-700"
                      : "border-slate-300 bg-white text-slate-700"
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${reply.likedByMe ? "fill-rose-500 text-rose-500" : ""}`} />
                  {reply.likesCount}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const countRootComments = (items = []) => items.length;

const countReplies = (items = []) =>
  items.reduce((sum, item) => {
    const directReplies = Array.isArray(item?.replies) ? item.replies.length : 0;
    return sum + directReplies;
  }, 0);

export { StudentBlog };
