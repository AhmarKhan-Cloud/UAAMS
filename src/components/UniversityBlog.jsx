import { useState } from "react";
import { Plus, Edit, Trash2, Eye, Calendar, Clock, Save, X } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
function UniversityBlog() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [previewPost, setPreviewPost] = useState(null);
  const [blogPosts, setBlogPosts] = useState([
    {
      id: "1",
      title: "Top 10 Tips for Success in Engineering Entrance Exams",
      excerpt: "Preparing for engineering entrance exams can be overwhelming. Here are proven strategies from top scorers to help you ace your exams and secure admission to your dream university.",
      content: `Preparing for engineering entrance exams can be overwhelming. Here are proven strategies from top scorers to help you ace your exams and secure admission to your dream university.

1. **Start Early and Plan Wisely**
Begin your preparation at least 6 months before the exam. Create a realistic study schedule that covers all subjects systematically.

2. **Understand the Exam Pattern**
Familiarize yourself with the exam format, marking scheme, and time allocation.

3. **Focus on Conceptual Understanding**
Don't just memorize formulas. Understand the underlying concepts.

4. **Practice with Past Papers**
Solve previous years' papers under timed conditions.

5. **Take Regular Mock Tests**
Mock tests simulate the actual exam environment and help track your progress.`,
      category: "Admissions",
      tags: ["Engineering", "Entrance Exams", "Study Tips"],
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGV4YW18ZW58MXx8fHwxNzY2MDMzNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: "January 1, 2025",
      readTime: "5 min",
      status: "published",
      views: 1245
    }
  ]);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Admissions",
    tags: "",
    imageUrl: "",
    status: "draft"
  });
  const categories = ["Admissions", "Financial Aid", "Career Guidance", "Campus Life", "Events", "Research"];
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };
  const handleSaveDraft = () => {
    if (!formData.title || !formData.content) {
      alert("Please fill in at least the title and content");
      return;
    }
    const newPost = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nfGVufDF8fHx8MTc2NjAzMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      readTime: calculateReadTime(formData.content),
      status: "draft",
      views: editingPost?.views || 0
    };
    if (editingPost) {
      setBlogPosts(blogPosts.map((post) => post.id === editingPost.id ? newPost : post));
    } else {
      setBlogPosts([newPost, ...blogPosts]);
    }
    resetForm();
  };
  const handlePublish = () => {
    if (!formData.title || !formData.content || !formData.excerpt) {
      alert("Please fill in title, excerpt, and content before publishing");
      return;
    }
    const newPost = {
      id: editingPost?.id || Date.now().toString(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nfGVufDF8fHx8MTc2NjAzMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      readTime: calculateReadTime(formData.content),
      status: "published",
      views: editingPost?.views || 0
    };
    if (editingPost) {
      setBlogPosts(blogPosts.map((post) => post.id === editingPost.id ? newPost : post));
    } else {
      setBlogPosts([newPost, ...blogPosts]);
    }
    resetForm();
  };
  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(", "),
      imageUrl: post.imageUrl,
      status: post.status
    });
    setShowCreateForm(true);
  };
  const handleDelete = (postId) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      setBlogPosts(blogPosts.filter((post) => post.id !== postId));
    }
  };
  const handleToggleStatus = (post) => {
    const newStatus = post.status === "published" ? "draft" : "published";
    setBlogPosts(blogPosts.map(
      (p) => p.id === post.id ? { ...p, status: newStatus } : p
    ));
  };
  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "Admissions",
      tags: "",
      imageUrl: "",
      status: "draft"
    });
    setShowCreateForm(false);
    setEditingPost(null);
  };
  const handlePreview = () => {
    const previewData = {
      id: "preview",
      title: formData.title || "Untitled Post",
      excerpt: formData.excerpt || formData.content.substring(0, 150) + "...",
      content: formData.content || "No content yet...",
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter((tag) => tag),
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nfGVufDF8fHx8MTc2NjAzMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      publishDate: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      readTime: calculateReadTime(formData.content),
      status: "draft",
      views: 0
    };
    setPreviewPost(previewData);
  };
  if (previewPost) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-slate-900">Preview</h2>
          <Button onClick={() => setPreviewPost(null)} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Close Preview
          </Button>
        </div>

        <Card className="bg-white border border-slate-200 overflow-hidden">
          <img
      src={previewPost.imageUrl}
      alt={previewPost.title}
      className="w-full h-96 object-cover"
    />
          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-emerald-100 text-emerald-700">
                {previewPost.category}
              </Badge>
              {previewPost.tags.map((tag) => <Badge key={tag} variant="outline" className="text-slate-600">
                  {tag}
                </Badge>)}
            </div>

            <h1 className="text-slate-900 mb-4">{previewPost.title}</h1>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {previewPost.publishDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {previewPost.readTime} read
              </span>
            </div>

            <div className="prose max-w-none">
              {previewPost.content.split("\n").map((paragraph, idx) => <p key={idx} className="text-slate-700 mb-4 whitespace-pre-line">
                  {paragraph}
                </p>)}
            </div>
          </div>
        </Card>
      </div>;
  }
  if (showCreateForm) {
    return <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-slate-900 mb-2">
              {editingPost ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <p className="text-slate-600">
              Share insights and guidance with prospective students
            </p>
          </div>
          <Button onClick={resetForm} variant="outline">
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>

        <Card className="bg-white border border-slate-200 p-6">
          <div className="space-y-6">
            {
      /* Title */
    }
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
      id="title"
      placeholder="Enter blog post title"
      value={formData.title}
      onChange={(e) => handleInputChange("title", e.target.value)}
      className="mt-2"
    />
            </div>

            {
      /* Excerpt */
    }
            <div>
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
      id="excerpt"
      placeholder="Brief summary of the blog post (shown in listings)"
      value={formData.excerpt}
      onChange={(e) => handleInputChange("excerpt", e.target.value)}
      className="mt-2 min-h-[80px]"
    />
              <p className="text-xs text-slate-500 mt-1">
                {formData.excerpt.length} characters (recommended: 120-160)
              </p>
            </div>

            {
      /* Content */
    }
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea
      id="content"
      placeholder="Write your blog post content here. You can use **bold** for emphasis and format your text."
      value={formData.content}
      onChange={(e) => handleInputChange("content", e.target.value)}
      className="mt-2 min-h-[300px]"
    />
              <p className="text-xs text-slate-500 mt-1">
                {formData.content.split(/\s+/).filter((w) => w).length} words · {calculateReadTime(formData.content)} read time
              </p>
            </div>

            {
      /* Category and Tags Row */
    }
            <div className="grid md:grid-cols-2 gap-6">
              {
      /* Category */
    }
              <div>
                <Label htmlFor="category">Category</Label>
                <select
      id="category"
      value={formData.category}
      onChange={(e) => handleInputChange("category", e.target.value)}
      className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              {
      /* Tags */
    }
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
      id="tags"
      placeholder="engineering, admissions, tips (comma separated)"
      value={formData.tags}
      onChange={(e) => handleInputChange("tags", e.target.value)}
      className="mt-2"
    />
              </div>
            </div>

            {
      /* Image URL */
    }
            <div>
              <Label htmlFor="imageUrl">Featured Image URL</Label>
              <div className="mt-2 space-y-2">
                <Input
      id="imageUrl"
      placeholder="https://example.com/image.jpg"
      value={formData.imageUrl}
      onChange={(e) => handleInputChange("imageUrl", e.target.value)}
    />
                {formData.imageUrl && <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <img
      src={formData.imageUrl}
      alt="Preview"
      className="w-full h-48 object-cover"
      onError={(e) => {
        e.target.src = "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9nfGVufDF8fHx8MTc2NjAzMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080";
      }}
    />
                  </div>}
              </div>
            </div>

            {
      /* Action Buttons */
    }
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button onClick={handlePreview} variant="outline" className="gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save as Draft
              </Button>
              <Button onClick={handlePublish} className="gap-2">
                Publish
              </Button>
            </div>
          </div>
        </Card>
      </div>;
  }
  const publishedPosts = blogPosts.filter((post) => post.status === "published");
  const draftPosts = blogPosts.filter((post) => post.status === "draft");
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Blog Management</h1>
          <p className="text-slate-600">
            Create and manage blog posts for students
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Blog Post
        </Button>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Published Posts</div>
          <div className="text-slate-900 text-3xl">{publishedPosts.length}</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Draft Posts</div>
          <div className="text-slate-900 text-3xl">{draftPosts.length}</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Total Views</div>
          <div className="text-slate-900 text-3xl">
            {blogPosts.reduce((sum, post) => sum + post.views, 0).toLocaleString()}
          </div>
        </Card>
      </div>

      {
    /* Published Posts */
  }
      {publishedPosts.length > 0 && <div>
          <h2 className="text-slate-900 mb-4">Published Posts</h2>
          <div className="space-y-4">
            {publishedPosts.map((post) => <Card key={post.id} className="bg-white border border-slate-200 p-6">
                <div className="flex gap-6">
                  {post.imageUrl && <img
    src={post.imageUrl}
    alt={post.title}
    className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
  />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-2">{post.title}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            {post.category}
                          </Badge>
                          {post.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>)}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 flex-shrink-0">
                        Published
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.publishDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.views.toLocaleString()} views
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleEdit(post)}
  >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleToggleStatus(post)}
  >
                          Unpublish
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleDelete(post.id)}
    className="text-red-600 hover:text-red-700"
  >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>)}
          </div>
        </div>}

      {
    /* Draft Posts */
  }
      {draftPosts.length > 0 && <div>
          <h2 className="text-slate-900 mb-4">Drafts</h2>
          <div className="space-y-4">
            {draftPosts.map((post) => <Card key={post.id} className="bg-white border border-slate-200 p-6">
                <div className="flex gap-6">
                  {post.imageUrl && <img
    src={post.imageUrl}
    alt={post.title}
    className="w-48 h-32 object-cover rounded-lg flex-shrink-0"
  />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h3 className="text-slate-900 mb-2">{post.title}</h3>
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className="bg-slate-100 text-slate-700 text-xs">
                            {post.category}
                          </Badge>
                          {post.tags.map((tag) => <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>)}
                        </div>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0">
                        Draft
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Last updated: {post.publishDate}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleEdit(post)}
  >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleToggleStatus(post)}
    className="text-green-600 hover:text-green-700"
  >
                          Publish
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleDelete(post.id)}
    className="text-red-600 hover:text-red-700"
  >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>)}
          </div>
        </div>}

      {
    /* Empty State */
  }
      {blogPosts.length === 0 && <Card className="bg-white border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-slate-900 mb-2">No blog posts yet</h3>
          <p className="text-slate-600 mb-6">
            Create your first blog post to share insights with students
          </p>
          <Button onClick={() => setShowCreateForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Blog Post
          </Button>
        </Card>}
    </div>;
}
export {
  UniversityBlog
};
