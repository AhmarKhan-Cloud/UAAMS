import { useState } from "react";
import { Plus, Edit, Trash2, Mail, Building2, User, Key, X, Calendar } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
function BloggerManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlogger, setEditingBlogger] = useState(null);
  const [showCredentials, setShowCredentials] = useState(null);
  const [bloggers, setBloggers] = useState([
    {
      id: "1",
      name: "Ahmed Khan",
      email: "ahmed.khan@example.com",
      universityName: "NUST University",
      phone: "+92-300-1234567",
      loginId: "blogger_ahmed_khan",
      password: "NUST@2025#1234",
      postsCount: 12,
      status: "active",
      dateAdded: "January 15, 2025"
    },
    {
      id: "2",
      name: "Sara Ali",
      email: "sara.ali@example.com",
      universityName: "NUST University",
      phone: "+92-321-9876543",
      loginId: "blogger_sara_ali",
      password: "NUST@2025#5678",
      postsCount: 8,
      status: "active",
      dateAdded: "February 1, 2025"
    }
  ]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    universityName: "NUST University",
    phone: ""
  });
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };
  const generateLoginId = (name) => {
    const cleanName = name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    return `blogger_${cleanName}`;
  };
  const generatePassword = (universityName) => {
    const uniPrefix = universityName.split(" ")[0].toUpperCase();
    const randomNum = Math.floor(1e3 + Math.random() * 9e3);
    return `${uniPrefix}@2025#${randomNum}`;
  };
  const handleAddBlogger = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill in all required fields");
      return;
    }
    const loginId = generateLoginId(formData.name);
    const password = generatePassword(formData.universityName);
    const newBlogger = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      universityName: formData.universityName,
      phone: formData.phone,
      loginId,
      password,
      postsCount: 0,
      status: "active",
      dateAdded: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    };
    if (editingBlogger) {
      setBloggers(bloggers.map((b) => b.id === editingBlogger.id ? { ...newBlogger, id: editingBlogger.id, postsCount: editingBlogger.postsCount, dateAdded: editingBlogger.dateAdded } : b));
    } else {
      setBloggers([newBlogger, ...bloggers]);
      setShowCredentials({ loginId, password });
    }
    resetForm();
  };
  const handleEdit = (blogger) => {
    setEditingBlogger(blogger);
    setFormData({
      name: blogger.name,
      email: blogger.email,
      universityName: blogger.universityName,
      phone: blogger.phone
    });
    setShowAddModal(true);
  };
  const handleDelete = (bloggerId) => {
    if (confirm("Are you sure you want to remove this blogger? This action cannot be undone.")) {
      setBloggers(bloggers.filter((b) => b.id !== bloggerId));
    }
  };
  const handleToggleStatus = (blogger) => {
    const newStatus = blogger.status === "active" ? "inactive" : "active";
    setBloggers(bloggers.map((b) => b.id === blogger.id ? { ...b, status: newStatus } : b));
  };
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      universityName: "NUST University",
      phone: ""
    });
    setShowAddModal(false);
    setEditingBlogger(null);
  };
  const activeBloggers = bloggers.filter((b) => b.status === "active");
  const inactiveBloggers = bloggers.filter((b) => b.status === "inactive");
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Blogger Management</h1>
          <p className="text-slate-600">
            Manage bloggers who create content for your university
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Blogger
        </Button>
      </div>

      {
    /* Stats */
  }
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Total Bloggers</div>
          <div className="text-slate-900 text-3xl">{bloggers.length}</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Active Bloggers</div>
          <div className="text-slate-900 text-3xl">{activeBloggers.length}</div>
        </Card>
        <Card className="bg-white border border-slate-200 p-6">
          <div className="text-slate-600 text-sm mb-1">Total Posts</div>
          <div className="text-slate-900 text-3xl">
            {bloggers.reduce((sum, b) => sum + b.postsCount, 0)}
          </div>
        </Card>
      </div>

      {
    /* Active Bloggers */
  }
      {activeBloggers.length > 0 && <div>
          <h2 className="text-slate-900 mb-4">Active Bloggers</h2>
          <div className="space-y-4">
            {activeBloggers.map((blogger) => <Card key={blogger.id} className="bg-white border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {blogger.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-slate-900">{blogger.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="w-3 h-3" />
                          {blogger.email}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 ml-auto">
                        Active
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2 className="w-4 h-4" />
                        <span>{blogger.universityName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="w-4 h-4" />
                        <span>{blogger.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        <span>Added: {blogger.dateAdded}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 mb-4">
                      <div className="text-xs text-slate-500 mb-2">Login Credentials</div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-slate-500">Login ID</div>
                          <div className="text-sm text-slate-700 font-mono">{blogger.loginId}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500">Password</div>
                          <div className="text-sm text-slate-700 font-mono">••••••••••••</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        {blogger.postsCount} blog posts published
                      </div>

                      <div className="flex gap-2">
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleEdit(blogger)}
  >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleToggleStatus(blogger)}
    className="text-orange-600 hover:text-orange-700"
  >
                          Deactivate
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleDelete(blogger.id)}
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
    /* Inactive Bloggers */
  }
      {inactiveBloggers.length > 0 && <div>
          <h2 className="text-slate-900 mb-4">Inactive Bloggers</h2>
          <div className="space-y-4">
            {inactiveBloggers.map((blogger) => <Card key={blogger.id} className="bg-white border border-slate-200 p-6 opacity-60">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center text-white font-semibold">
                        {blogger.name.split(" ").map((n) => n[0]).join("").substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-slate-900">{blogger.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="w-3 h-3" />
                          {blogger.email}
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        Inactive
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        {blogger.postsCount} blog posts published
                      </div>

                      <div className="flex gap-2">
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleToggleStatus(blogger)}
    className="text-green-600 hover:text-green-700"
  >
                          Activate
                        </Button>
                        <Button
    size="sm"
    variant="outline"
    onClick={() => handleDelete(blogger.id)}
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
      {bloggers.length === 0 && <Card className="bg-white border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-slate-900 mb-2">No bloggers added yet</h3>
          <p className="text-slate-600 mb-6">
            Add your first blogger to start creating content for students
          </p>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Blogger
          </Button>
        </Card>}

      {
    /* Add/Edit Blogger Modal */
  }
      <Dialog open={showAddModal} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingBlogger ? "Edit Blogger" : "Add New Blogger"}
            </DialogTitle>
            <DialogDescription>
              {editingBlogger ? "Update blogger information and credentials." : "Fill in the details to add a new blogger to your university."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="grid md:grid-cols-2 gap-6">
              {
    /* Name */
  }
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
    id="name"
    placeholder="Enter blogger's full name"
    value={formData.name}
    onChange={(e) => handleInputChange("name", e.target.value)}
    className="mt-2"
  />
              </div>

              {
    /* Email */
  }
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
    id="email"
    type="email"
    placeholder="blogger@example.com"
    value={formData.email}
    onChange={(e) => handleInputChange("email", e.target.value)}
    className="mt-2"
  />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {
    /* University Name */
  }
              <div>
                <Label htmlFor="universityName">University Name *</Label>
                <Input
    id="universityName"
    placeholder="Enter university name"
    value={formData.universityName}
    onChange={(e) => handleInputChange("universityName", e.target.value)}
    className="mt-2"
  />
              </div>

              {
    /* Phone */
  }
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
    id="phone"
    placeholder="+92-300-1234567"
    value={formData.phone}
    onChange={(e) => handleInputChange("phone", e.target.value)}
    className="mt-2"
  />
              </div>
            </div>

            {
    /* Info Box */
  }
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Key className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-blue-900 mb-1">
                    Auto-Generated Login Credentials
                  </div>
                  <p className="text-sm text-blue-700">
                    Login credentials will be automatically generated after adding the blogger. 
                    Make sure to save and share these credentials with the blogger.
                  </p>
                </div>
              </div>
            </div>

            {
    /* Action Buttons */
  }
            <div className="flex gap-3 pt-4 border-t border-slate-200">
              <Button onClick={resetForm} variant="outline" className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button onClick={handleAddBlogger} className="gap-2 flex-1">
                <Plus className="w-4 h-4" />
                {editingBlogger ? "Update Blogger" : "Add Blogger"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {
    /* Credentials Display Modal */
  }
      <Dialog open={!!showCredentials} onOpenChange={(open) => !open && setShowCredentials(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Blogger Credentials Generated</DialogTitle>
            <DialogDescription>
              Save these credentials securely. They will be needed for blogger login.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex gap-3">
                <Key className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-green-900 mb-1">
                    Blogger Added Successfully!
                  </div>
                  <p className="text-sm text-green-700">
                    Please share these login credentials with the blogger securely.
                  </p>
                </div>
              </div>
            </div>

            {showCredentials && <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-4">
                  <Label className="text-slate-600 text-xs">Login ID</Label>
                  <div className="text-slate-900 font-mono text-lg mt-1">
                    {showCredentials.loginId}
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4">
                  <Label className="text-slate-600 text-xs">Password</Label>
                  <div className="text-slate-900 font-mono text-lg mt-1">
                    {showCredentials.password}
                  </div>
                </div>
              </div>}

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Make sure to save these credentials. 
                The password will not be shown again in plain text for security reasons.
              </p>
            </div>

            <Button
    onClick={() => setShowCredentials(null)}
    className="w-full"
  >
              I've Saved the Credentials
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
}
export {
  BloggerManagement
};
