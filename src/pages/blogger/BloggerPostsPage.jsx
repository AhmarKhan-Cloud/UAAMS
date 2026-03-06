import { DashboardPageShell } from "../shared/DashboardPageShell";

const posts = [
  {
    title: "How to shortlist universities with data",
    status: "Published",
    date: "2026-02-25",
    views: "4,820",
  },
  {
    title: "FAFSA alternatives for local scholarships",
    status: "Draft",
    date: "2026-02-20",
    views: "-",
  },
  {
    title: "Interview readiness guide for admissions",
    status: "Published",
    date: "2026-02-15",
    views: "3,104",
  },
];

export const BloggerPostsPage = () => {
  return (
    <DashboardPageShell
      title="Posts Library"
      subtitle="Manage all drafts and published stories with performance metrics."
    >
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published Date</th>
              <th className="px-4 py-3">Views</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.title} className="border-t border-slate-200 text-slate-700">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{post.status}</td>
                <td className="px-4 py-3">{post.date}</td>
                <td className="px-4 py-3">{post.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardPageShell>
  );
};