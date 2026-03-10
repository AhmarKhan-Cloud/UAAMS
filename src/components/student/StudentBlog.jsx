import { useState } from "react";
import { Search, Calendar, Clock, Tag, ChevronRight, BookOpen } from "lucide-react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
function StudentBlog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const blogPosts = [
    {
      id: "1",
      title: "Top 10 Tips for Success in Engineering Entrance Exams",
      excerpt: "Preparing for engineering entrance exams can be overwhelming. Here are proven strategies from top scorers to help you ace your exams and secure admission to your dream university.",
      content: `Preparing for engineering entrance exams can be overwhelming. Here are proven strategies from top scorers to help you ace your exams and secure admission to your dream university.

1. **Start Early and Plan Wisely**
Begin your preparation at least 6 months before the exam. Create a realistic study schedule that covers all subjects systematically. Allocate more time to your weaker subjects while maintaining your strengths.

2. **Understand the Exam Pattern**
Familiarize yourself with the exam format, marking scheme, and time allocation. This helps you strategize your approach and manage time effectively during the actual exam.

3. **Focus on Conceptual Understanding**
Don't just memorize formulas. Understand the underlying concepts. This will help you tackle variations of questions and apply knowledge to practical scenarios.

4. **Practice with Past Papers**
Solve previous years' papers under timed conditions. This gives you insight into question patterns and helps improve your speed and accuracy.

5. **Take Regular Mock Tests**
Mock tests simulate the actual exam environment. They help identify your weak areas and track your progress over time.

Remember, consistency is key. Stay focused, maintain a healthy lifestyle, and believe in yourself!`,
      author: "Dr. Muhammad Hassan",
      authorTitle: "Dean of Engineering",
      university: "National University of Sciences & Technology (NUST)",
      universityLogo: "\u{1F393}",
      publishDate: "January 1, 2025",
      readTime: "5 min",
      category: "Admissions",
      tags: ["Engineering", "Entrance Exams", "Study Tips", "NUST"],
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkeSUyMGV4YW18ZW58MXx8fHwxNzY2MDMzNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 1245
    },
    {
      id: "2",
      title: "Navigating Financial Aid: A Complete Guide to Scholarships",
      excerpt: "Don't let financial constraints stop you from pursuing higher education. Learn about various scholarship opportunities, application processes, and how to increase your chances of securing funding.",
      content: `Don't let financial constraints stop you from pursuing higher education. Learn about various scholarship opportunities, application processes, and how to increase your chances of securing funding.

**Types of Scholarships Available**

1. **Merit-Based Scholarships**
These are awarded based on academic performance, typically covering 25% to 100% of tuition fees. Maintain a strong GPA and excel in entrance exams to qualify.

2. **Need-Based Financial Aid**
For students from low-income families. Requires documentation of family income and financial situation. Can cover full tuition plus living expenses.

3. **Sports and Extracurricular Scholarships**
Recognition for achievements in sports, arts, or community service. Document all your achievements and participate actively.

**Application Tips**

- Start your scholarship search early
- Prepare all required documents in advance
- Write compelling personal statements
- Meet all deadlines
- Apply to multiple scholarships

**Common Mistakes to Avoid**

- Waiting until the last minute
- Not reading requirements carefully
- Submitting incomplete applications
- Not following up on your application

At LUMS, we believe financial circumstances should never prevent talented students from accessing quality education. We offer comprehensive financial aid packages to deserving students.`,
      author: "Prof. Ayesha Malik",
      authorTitle: "Director of Financial Aid",
      university: "Lahore University of Management Sciences (LUMS)",
      universityLogo: "\u{1F3DB}\uFE0F",
      publishDate: "December 28, 2024",
      readTime: "7 min",
      category: "Financial Aid",
      tags: ["Scholarships", "Financial Aid", "LUMS", "Funding"],
      imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvbGFyc2hpcCUyMHN0dWRlbnR8ZW58MXx8fHwxNzY2MDMzNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 2103
    },
    {
      id: "3",
      title: "Career Opportunities in Computer Science: Industry Insights",
      excerpt: "The tech industry is booming with opportunities. Discover the most in-demand skills, emerging technologies, and career paths for computer science graduates in Pakistan and abroad.",
      content: `The tech industry is booming with opportunities. Discover the most in-demand skills, emerging technologies, and career paths for computer science graduates in Pakistan and abroad.

**Top Career Paths in 2025**

1. **Artificial Intelligence & Machine Learning**
Average starting salary: PKR 80,000 - 150,000
Growing demand for AI specialists in healthcare, finance, and e-commerce sectors.

2. **Full-Stack Development**
Average starting salary: PKR 60,000 - 120,000
Companies need developers who can handle both frontend and backend development.

3. **Cybersecurity Specialist**
Average starting salary: PKR 70,000 - 140,000
With increasing digital threats, cybersecurity experts are in high demand.

4. **Data Science & Analytics**
Average starting salary: PKR 75,000 - 135,000
Organizations need professionals who can extract insights from big data.

5. **Mobile App Development**
Average starting salary: PKR 55,000 - 110,000
iOS and Android development continue to be lucrative career options.

**Skills That Matter**

- Programming languages (Python, JavaScript, Java)
- Cloud platforms (AWS, Azure, Google Cloud)
- Problem-solving and analytical thinking
- Communication and teamwork
- Continuous learning mindset

**Internship Opportunities**

COMSATS maintains strong industry partnerships. Our students secure internships at leading tech companies including Systems Limited, NetSol, and Arbisoft. Many internships convert to full-time positions.

Start building your portfolio early, contribute to open-source projects, and network with industry professionals to maximize your career prospects.`,
      author: "Dr. Zainab Ahmed",
      authorTitle: "Head of Computer Science Department",
      university: "COMSATS University",
      universityLogo: "\u{1F4BB}",
      publishDate: "December 25, 2024",
      readTime: "8 min",
      category: "Career Guidance",
      tags: ["Computer Science", "Careers", "Technology", "COMSATS"],
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBjb21wdXRlcnxlbnwxfHx8fDE3NjYwMzM0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 1876
    },
    {
      id: "4",
      title: "Understanding the Medical College Admission Process in Pakistan",
      excerpt: "A comprehensive guide to MDCAT, merit calculations, and application procedures for aspiring medical students. Learn what it takes to get into top medical colleges.",
      content: `A comprehensive guide to MDCAT, merit calculations, and application procedures for aspiring medical students. Learn what it takes to get into top medical colleges.

**MDCAT Examination**

The Medical and Dental College Admission Test (MDCAT) is mandatory for admission to all medical and dental colleges in Pakistan. The test is conducted by the Pakistan Medical Commission (PMC).

**Exam Structure**
- Total Questions: 200 (MCQs)
- Duration: 3.5 hours
- Subjects: Biology (88), Chemistry (56), Physics (56)
- Each correct answer: 5 marks
- Negative marking: No

**Merit Calculation**

Most universities follow this formula:
- FSc/A-Levels: 50%
- MDCAT: 50%

Aggregate = (FSc Marks/1100 \xD7 50) + (MDCAT Score/200 \xD7 50)

**Top Medical Colleges and Their Merit**

1. Aga Khan University: 90%+ aggregate
2. Dow Medical College: 85%+ aggregate
3. King Edward Medical University: 84%+ aggregate
4. CMH Lahore Medical College: 82%+ aggregate

**Preparation Strategy**

- Start preparation 4-6 months before MDCAT
- Focus on NUMS past papers
- Practice time management
- Revise FSc syllabus thoroughly
- Take online mock tests regularly

**University of Karachi Medical Programs**

We offer MBBS, BDS, and Allied Health Sciences programs. Our medical college is equipped with state-of-the-art facilities and affiliated with major teaching hospitals in Karachi.

**Application Timeline**
- MDCAT Registration: April-May
- MDCAT Exam: July-August
- Result Announcement: September
- Application Submission: September-October
- Merit Lists: October-November

Stay updated with PMC announcements and university websites for exact dates.`,
      author: "Dr. Farhan Raza",
      authorTitle: "Coordinator, Medical Admissions",
      university: "University of Karachi",
      universityLogo: "\u{1F4DA}",
      publishDate: "December 22, 2024",
      readTime: "10 min",
      category: "Admissions",
      tags: ["Medical", "MDCAT", "Admissions", "University of Karachi"],
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwc3R1ZGVudHN8ZW58MXx8fHwxNzY2MDMzNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 3210
    },
    {
      id: "5",
      title: "Business Education in Pakistan: MBA vs BBA - Making the Right Choice",
      excerpt: "Confused between pursuing an MBA or BBA? Understand the differences, career prospects, and how to choose the program that aligns with your goals.",
      content: `Confused between pursuing an MBA or BBA? Understand the differences, career prospects, and how to choose the program that aligns with your goals.

**BBA (Bachelor of Business Administration)**

**Duration:** 4 years
**Entry Requirement:** Intermediate/A-Levels
**Best For:** Fresh graduates who want to enter the business world

**Key Subjects:**
- Accounting and Finance
- Marketing Management
- Human Resource Management
- Business Strategy
- Entrepreneurship

**Career Paths:**
- Management Trainee programs
- Banking and Finance
- Marketing Executive
- Business Analyst
- Entrepreneur

**Average Starting Salary:** PKR 40,000 - 80,000

**MBA (Master of Business Administration)**

**Duration:** 2 years
**Entry Requirement:** Bachelor's degree (preferably with work experience)
**Best For:** Professionals looking to advance their careers

**Specializations:**
- Finance
- Marketing
- Human Resources
- Supply Chain Management
- Information Systems

**Career Paths:**
- Senior Management positions
- Consulting
- Investment Banking
- Business Development Manager
- Corporate Strategy

**Average Starting Salary:** PKR 100,000 - 200,000

**Which One Should You Choose?**

**Choose BBA if:**
- You've just completed intermediate
- Want to build foundational business knowledge
- Planning to pursue MBA later
- Interested in entrepreneurship early on

**Choose MBA if:**
- Have work experience (2+ years recommended)
- Want to switch careers or advance in current field
- Seeking leadership positions
- Looking for higher salary potential

**LUMS Advantage**

At LUMS, our business programs are ranked among the top in Asia. We offer:
- World-class faculty with international experience
- Strong industry connections
- 95%+ placement rate
- Extensive alumni network across 50+ countries
- Case-study based learning methodology

Both programs at LUMS provide excellent ROI and open doors to prestigious career opportunities both locally and internationally.`,
      author: "Dr. Imran Shah",
      authorTitle: "Associate Dean, Suleman Dawood School of Business",
      university: "Lahore University of Management Sciences (LUMS)",
      universityLogo: "\u{1F3DB}\uFE0F",
      publishDate: "December 20, 2024",
      readTime: "6 min",
      category: "Career Guidance",
      tags: ["Business", "MBA", "BBA", "LUMS", "Career Choice"],
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MXx8fHwxNzY2MDMzNDM1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      views: 1654
    },
    {
      id: "6",
      title: "Life at University: What to Expect in Your First Year",
      excerpt: "Transitioning from college to university can be challenging. Get insights on campus life, academic expectations, and how to make the most of your university experience.",
      content: `Transitioning from college to university can be challenging. Get insights on campus life, academic expectations, and how to make the most of your university experience.

**Academic Adjustments**

University education is vastly different from intermediate level. Here's what to expect:

**1. Independent Learning**
Unlike college, professors won't remind you about assignments or deadlines. You're expected to manage your time and responsibilities independently.

**2. Lecture Style**
Classes are larger and more interactive. Come prepared with questions and participate in discussions.

**3. Workload Management**
Expect 3-4 hours of self-study for every hour in class. Learn to prioritize and manage multiple assignments simultaneously.

**4. Grading System**
- Attendance: 5-10%
- Quizzes/Assignments: 20-30%
- Mid-term: 30%
- Final: 40%

**Campus Life**

**Clubs and Societies**
Join clubs related to your interests - debate, sports, music, technology, etc. This helps in networking and developing soft skills.

**Sports Facilities**
Most universities have cricket, football, basketball courts, and gyms. Participate in inter-university competitions.

**Cultural Events**
Annual festivals, talent shows, and cultural nights provide platforms to showcase your talents.

**Networking Opportunities**
Build relationships with seniors, faculty, and peers. Your university network will be valuable throughout your career.

**Tips for Success**

1. **Attend Orientation Week**
Don't skip it. You'll learn about resources, meet people, and understand university culture.

2. **Visit Faculty During Office Hours**
Build rapport with professors. They can guide you, provide opportunities, and write recommendation letters.

3. **Form Study Groups**
Collaborate with classmates. Group study helps understand complex topics better.

4. **Maintain Work-Life Balance**
All work and no play is unhealthy. Participate in extracurricular activities.

5. **Utilize University Resources**
Library, computer labs, career counseling, mental health services - use everything available.

**Living Away from Home**

If you're in a hostel:
- Respect your roommates
- Follow hostel rules
- Budget your monthly expenses
- Stay connected with family

**Common First-Year Mistakes**

- Skipping classes regularly
- Procrastinating on assignments
- Not asking for help when needed
- Poor time management
- Neglecting health and sleep

Remember, everyone feels overwhelmed initially. Give yourself time to adjust. The first semester might be challenging, but you'll adapt and thrive.

Welcome to NUST! We're excited to have you on campus.`,
      author: "Dr. Sarah Khan",
      authorTitle: "Dean of Student Affairs",
      university: "National University of Sciences & Technology (NUST)",
      universityLogo: "\u{1F393}",
      publishDate: "December 18, 2024",
      readTime: "9 min",
      category: "Campus Life",
      tags: ["University Life", "Student Tips", "NUST", "First Year"],
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwY2FtcHVzfGVufDF8fHx8MTc2NjAzMzQzNXww&ixlib=rb-4.1.0&q=80&w=1080",
      views: 892
    }
  ];
  const categories = ["all", "Admissions", "Financial Aid", "Career Guidance", "Campus Life"];
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) || post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  if (selectedPost) {
    return <div className="space-y-6">
        {
      /* Back Button */
    }
        <button
      onClick={() => setSelectedPost(null)}
      className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
    >
          ← Back to Blog
        </button>

        {
      /* Blog Post Detail */
    }
        <Card className="bg-white border border-slate-200 overflow-hidden">
          <img
      src={selectedPost.imageUrl}
      alt={selectedPost.title}
      className="w-full h-96 object-cover"
    />
          <div className="p-8">
            {
      /* Category and Tags */
    }
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-emerald-100 text-emerald-700">
                {selectedPost.category}
              </Badge>
              {selectedPost.tags.map((tag) => <Badge key={tag} variant="outline" className="text-slate-600">
                  {tag}
                </Badge>)}
            </div>

            {
      /* Title */
    }
            <h1 className="text-slate-900 mb-4">{selectedPost.title}</h1>

            {
      /* Author Info */
    }
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
              <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-blue-500 text-white rounded-full">
                <span className="text-xl">{selectedPost.universityLogo}</span>
              </div>
              <div className="flex-1">
                <div className="text-slate-900">{selectedPost.author}</div>
                <div className="text-sm text-slate-600">
                  {selectedPost.authorTitle} • {selectedPost.university}
                </div>
              </div>
              <div className="text-sm text-slate-500 flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {selectedPost.publishDate}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedPost.readTime} read
                </span>
              </div>
            </div>

            {
      /* Content */
    }
            <div className="prose max-w-none">
              {selectedPost.content.split("\n").map((paragraph, idx) => <p key={idx} className="text-slate-700 mb-4 whitespace-pre-line">
                  {paragraph}
                </p>)}
            </div>

            {
      /* Footer Stats */
    }
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-sm text-slate-600">
              <span>{selectedPost.views.toLocaleString()} views</span>
              <div className="flex gap-4">
                <button className="hover:text-emerald-600">Share</button>
                <button className="hover:text-emerald-600">Bookmark</button>
              </div>
            </div>
          </div>
        </Card>
      </div>;
  }
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div>
        <h1 className="text-slate-900 mb-2">University Blog</h1>
        <p className="text-slate-600">
          Insights, tips, and guidance from university representatives
        </p>
      </div>

      {
    /* Search and Filters */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <div className="space-y-4">
          {
    /* Search */
  }
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
    type="text"
    placeholder="Search articles..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10"
  />
          </div>

          {
    /* Category Filters */
  }
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => <button
    key={category}
    onClick={() => setSelectedCategory(category)}
    className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedCategory === category ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
  >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>)}
          </div>
        </div>
      </Card>

      {
    /* Blog Posts Grid */
  }
      {filteredPosts.length === 0 ? <Card className="bg-white border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-900 mb-2">No articles found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </Card> : <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => <Card
    key={post.id}
    className="bg-white border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    onClick={() => setSelectedPost(post)}
  >
              <img
    src={post.imageUrl}
    alt={post.title}
    className="w-full h-48 object-cover"
  />
              <div className="p-6">
                {
    /* University Logo and Category */
  }
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{post.universityLogo}</span>
                    <span className="text-sm text-slate-600">{post.university}</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                    {post.category}
                  </Badge>
                </div>

                {
    /* Title */
  }
                <h3 className="text-slate-900 mb-2 line-clamp-2">{post.title}</h3>

                {
    /* Excerpt */
  }
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {
    /* Tags */
  }
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => <Badge key={tag} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>)}
                </div>

                {
    /* Footer */
  }
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
                  <button className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700">
                    Read More
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>)}
        </div>}
    </div>;
}
export {
  StudentBlog
};
