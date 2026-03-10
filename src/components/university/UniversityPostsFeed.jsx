import { useState } from "react";
import { MessageCircle, Heart, Share2, Send, Calendar, MapPin } from "lucide-react";
import { Card } from "../ui/card";
import { Avatar } from "../ui/avatar";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
function UniversityPostsFeed() {
  const [posts, setPosts] = useState([
    {
      id: "1",
      university: "National University of Sciences & Technology (NUST)",
      universityLogo: "\u{1F393}",
      author: "Dr. Sarah Khan",
      authorTitle: "Admissions Director",
      timestamp: "2 hours ago",
      eventTitle: "Engineering Open House 2025",
      eventDate: "January 15, 2025",
      eventLocation: "NUST Campus, Islamabad",
      content: "We are excited to announce our Engineering Open House! Join us for an immersive experience where prospective students can:\n\n\u2728 Tour our state-of-the-art laboratories\n\u2728 Meet faculty members and current students\n\u2728 Learn about scholarship opportunities\n\u2728 Attend live demonstrations of student projects\n\nRegistration is free but seats are limited. Register now!",
      imageUrl: "https://images.unsplash.com/photo-1632834380561-d1e05839a33a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzY1OTI5NzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 234,
      commentsCount: 18,
      isLiked: false,
      comments: [
        {
          id: "c1",
          author: "Ahmed Ali",
          authorRole: "Prospective Student",
          content: "This sounds amazing! How can I register for the event?",
          timestamp: "1 hour ago",
          avatar: "\u{1F464}"
        },
        {
          id: "c2",
          author: "Dr. Sarah Khan",
          authorRole: "Admissions Director",
          content: "Please visit our admissions portal or email admissions@nust.edu.pk. Looking forward to seeing you there!",
          timestamp: "45 minutes ago",
          avatar: "\u{1F464}"
        }
      ]
    },
    {
      id: "2",
      university: "Lahore University of Management Sciences (LUMS)",
      universityLogo: "\u{1F3DB}\uFE0F",
      author: "Prof. Ayesha Malik",
      authorTitle: "Dean of Admissions",
      timestamp: "5 hours ago",
      eventTitle: "Business School Info Session",
      eventDate: "January 20, 2025",
      eventLocation: "Virtual Event (Zoom)",
      content: "Aspiring business leaders! Join us for an exclusive virtual information session about our MBA and BBA programs.\n\n\u{1F4CC} Topics covered:\n\u2022 Program structure and curriculum\n\u2022 Career opportunities and placement statistics\n\u2022 Financial aid and scholarships (up to 100% tuition coverage)\n\u2022 Application process and requirements\n\nQ&A session with current students and alumni included!",
      imageUrl: "https://images.unsplash.com/photo-1707301280425-475534ec3cc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjBwcmVzZW50YXRpb258ZW58MXx8fHwxNzY1OTcyMTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 189,
      commentsCount: 12,
      isLiked: false,
      comments: []
    },
    {
      id: "3",
      university: "University of Karachi",
      universityLogo: "\u{1F4DA}",
      author: "Muhammad Raza",
      authorTitle: "Student Affairs Coordinator",
      timestamp: "1 day ago",
      eventTitle: "Medical College Entrance Exam Workshop",
      eventDate: "January 25-27, 2025",
      eventLocation: "Karachi University Main Campus",
      content: "Preparing for medical college entrance exams? We're hosting a 3-day intensive workshop!\n\n\u{1F3AF} What you'll get:\n\u2192 Expert guidance on MDCAT preparation\n\u2192 Mock tests and detailed performance analysis\n\u2192 Tips from top-scoring students\n\u2192 Study material and resources\n\nEarly bird discount: 30% off if you register before January 10th!",
      imageUrl: "https://images.unsplash.com/photo-1571969878627-d5c8f8d15c78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3R1ZGVudCUyMGxpYnJhcnl8ZW58MXx8fHwxNzY2MDMzNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 412,
      commentsCount: 31,
      isLiked: false,
      comments: [
        {
          id: "c3",
          author: "Fatima Noor",
          authorRole: "Student",
          content: "Is this workshop also beneficial for students appearing in NUMS exam?",
          timestamp: "18 hours ago",
          avatar: "\u{1F464}"
        }
      ]
    },
    {
      id: "4",
      university: "COMSATS University",
      universityLogo: "\u{1F4BB}",
      author: "Dr. Hassan Mehmood",
      authorTitle: "Head of Computer Science",
      timestamp: "2 days ago",
      eventTitle: "AI & Machine Learning Hackathon",
      eventDate: "February 5-7, 2025",
      eventLocation: "COMSATS Islamabad Campus",
      content: "Calling all tech enthusiasts! \u{1F680}\n\nCOMSATS is organizing a 48-hour AI & ML Hackathon with exciting prizes:\n\n\u{1F947} 1st Prize: PKR 100,000 + Internship opportunity\n\u{1F948} 2nd Prize: PKR 50,000\n\u{1F949} 3rd Prize: PKR 25,000\n\nOpen to high school and university students. Form your teams of 3-5 members. Industry mentors will be available throughout the event!\n\n#TechForGood #AIInnovation",
      imageUrl: "https://images.unsplash.com/photo-1638202677704-b74690bb8fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjB0ZWNobm9sb2d5JTIwY29kaW5nfGVufDF8fHx8MTc2NjAzMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      likes: 567,
      commentsCount: 45,
      isLiked: false,
      comments: []
    }
  ]);
  const [expandedComments, setExpandedComments] = useState(/* @__PURE__ */ new Set());
  const [newComments, setNewComments] = useState({});
  const toggleLike = (postId) => {
    setPosts(posts.map(
      (post) => post.id === postId ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 } : post
    ));
  };
  const toggleComments = (postId) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedComments(newExpanded);
  };
  const handleCommentChange = (postId, value) => {
    setNewComments({ ...newComments, [postId]: value });
  };
  const addComment = (postId) => {
    const commentText = newComments[postId]?.trim();
    if (!commentText) return;
    const newComment = {
      id: `c${Date.now()}`,
      author: "You",
      authorRole: "Student",
      content: commentText,
      timestamp: "Just now",
      avatar: "\u{1F464}"
    };
    setPosts(posts.map(
      (post) => post.id === postId ? {
        ...post,
        comments: [...post.comments, newComment],
        commentsCount: post.commentsCount + 1
      } : post
    ));
    setNewComments({ ...newComments, [postId]: "" });
  };
  return <div className="max-w-3xl mx-auto space-y-4">
      {posts.map((post) => <Card key={post.id} className="bg-white border border-slate-200 overflow-hidden">
          {
    /* Post Header */
  }
          <div className="p-4 pb-3">
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
                <span className="text-xl">{post.universityLogo}</span>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-slate-900">{post.university}</h3>
                <p className="text-sm text-slate-600">
                  {post.author} • {post.authorTitle}
                </p>
                <p className="text-xs text-slate-500">{post.timestamp}</p>
              </div>
            </div>
          </div>

          {
    /* Event Info Banner (if event) */
  }
          {post.eventTitle && <div className="mx-4 mb-3 p-3 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-900">{post.eventTitle}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-700">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{post.eventDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>{post.eventLocation}</span>
                </div>
              </div>
            </div>}

          {
    /* Post Content */
  }
          <div className="px-4 pb-3">
            <p className="text-slate-800 whitespace-pre-line">{post.content}</p>
          </div>

          {
    /* Post Image */
  }
          {post.imageUrl && <div className="w-full">
              <img
    src={post.imageUrl}
    alt="Post"
    className="w-full h-80 object-cover"
  />
            </div>}

          {
    /* Engagement Stats */
  }
          <div className="px-4 py-2 flex items-center justify-between text-sm text-slate-600 border-t border-slate-100">
            <span>{post.likes} likes</span>
            <span>{post.commentsCount} comments</span>
          </div>

          {
    /* Action Buttons */
  }
          <div className="px-4 py-2 flex items-center gap-1 border-t border-slate-200">
            <Button
    variant="ghost"
    size="sm"
    className={`flex-1 gap-2 ${post.isLiked ? "text-rose-600" : "text-slate-600"}`}
    onClick={() => toggleLike(post.id)}
  >
              <Heart className={`w-5 h-5 ${post.isLiked ? "fill-rose-600" : ""}`} />
              Like
            </Button>
            <Button
    variant="ghost"
    size="sm"
    className="flex-1 gap-2 text-slate-600"
    onClick={() => toggleComments(post.id)}
  >
              <MessageCircle className="w-5 h-5" />
              Comment
            </Button>
            <Button
    variant="ghost"
    size="sm"
    className="flex-1 gap-2 text-slate-600"
  >
              <Share2 className="w-5 h-5" />
              Share
            </Button>
          </div>

          {
    /* Comments Section */
  }
          {expandedComments.has(post.id) && <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
              {
    /* Existing Comments */
  }
              {post.comments.length > 0 && <div className="space-y-3 mb-4">
                  {post.comments.map((comment) => <div key={comment.id} className="flex gap-2">
                      <Avatar className="w-8 h-8 flex items-center justify-center bg-slate-300 text-white flex-shrink-0">
                        <span className="text-sm">{comment.avatar}</span>
                      </Avatar>
                      <div className="flex-1 bg-white rounded-lg p-3">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-slate-900 text-sm">{comment.author}</span>
                          <span className="text-xs text-slate-500">{comment.authorRole}</span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.content}</p>
                        <p className="text-xs text-slate-500 mt-1">{comment.timestamp}</p>
                      </div>
                    </div>)}
                </div>}

              {
    /* Add Comment */
  }
              <div className="flex gap-2">
                <Avatar className="w-8 h-8 flex items-center justify-center bg-emerald-500 text-white flex-shrink-0">
                  <span className="text-sm">👤</span>
                </Avatar>
                <div className="flex-1 flex gap-2">
                  <Textarea
    placeholder="Write a comment..."
    value={newComments[post.id] || ""}
    onChange={(e) => handleCommentChange(post.id, e.target.value)}
    className="min-h-[60px] resize-none"
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        addComment(post.id);
      }
    }}
  />
                  <Button
    size="sm"
    onClick={() => addComment(post.id)}
    disabled={!newComments[post.id]?.trim()}
    className="self-end"
  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>}
        </Card>)}
    </div>;
}
export {
  UniversityPostsFeed
};
