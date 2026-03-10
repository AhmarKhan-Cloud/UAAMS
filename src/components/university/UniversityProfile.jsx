import { useState } from "react";
import { Save, Upload, Building, Phone, MapPin, Users } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
function UniversityProfile({ universityId, initialName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem(`universityProfile_${universityId}`);
    return saved ? JSON.parse(saved) : {
      universityName: initialName,
      shortName: "",
      type: "public",
      established: "",
      email: "",
      phone: "",
      website: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      about: "",
      mission: "",
      vision: "",
      totalStudents: "",
      totalPrograms: "",
      ranking: "",
      accreditation: "HEC",
      representativeName: "",
      representativePosition: "",
      representativeEmail: "",
      representativePhone: "",
      logo: ""
    };
  });
  const handleSave = () => {
    localStorage.setItem(`universityProfile_${universityId}`, JSON.stringify(profileData));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };
  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("logo", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">University Profile</h1>
          <p className="text-slate-600">Manage your university information and representative details</p>
        </div>
        {!isEditing ? <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button> : <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Changes
            </Button>
          </div>}
      </div>

      {
    /* Logo Section */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden">
            {profileData.logo ? <img src={profileData.logo} alt="University Logo" className="w-full h-full object-cover" /> : <Building className="w-12 h-12 text-white" />}
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 mb-2">University Logo</h3>
            <p className="text-slate-600 text-sm mb-3">Upload your university logo (recommended: 400x400px)</p>
            {isEditing && <label className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
    type="file"
    accept="image/*"
    onChange={handleLogoUpload}
    className="hidden"
  />
              </label>}
          </div>
        </div>
      </Card>

      {
    /* Basic Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Basic Information</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">University Name</label>
            <Input
    value={profileData.universityName}
    onChange={(e) => handleChange("universityName", e.target.value)}
    disabled={!isEditing}
    placeholder="Full university name"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Short Name / Acronym</label>
            <Input
    value={profileData.shortName}
    onChange={(e) => handleChange("shortName", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., NUST, LUMS"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">University Type</label>
            <select
    value={profileData.type}
    onChange={(e) => handleChange("type", e.target.value)}
    disabled={!isEditing}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Year Established</label>
            <Input
    type="number"
    value={profileData.established}
    onChange={(e) => handleChange("established", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 1991"
  />
          </div>
        </div>
      </Card>

      {
    /* Contact Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-blue-600" />
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Official Email</label>
            <Input
    type="email"
    value={profileData.email}
    onChange={(e) => handleChange("email", e.target.value)}
    disabled={!isEditing}
    placeholder="info@university.edu.pk"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Phone Number</label>
            <Input
    type="tel"
    value={profileData.phone}
    onChange={(e) => handleChange("phone", e.target.value)}
    disabled={!isEditing}
    placeholder="+92-51-1234567"
  />
          </div>
          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2 text-sm">Website</label>
            <Input
    type="url"
    value={profileData.website}
    onChange={(e) => handleChange("website", e.target.value)}
    disabled={!isEditing}
    placeholder="https://www.university.edu.pk"
  />
          </div>
        </div>
      </Card>

      {
    /* Address */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Address
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2 text-sm">Street Address</label>
            <Input
    value={profileData.address}
    onChange={(e) => handleChange("address", e.target.value)}
    disabled={!isEditing}
    placeholder="Main campus address"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">City</label>
            <Input
    value={profileData.city}
    onChange={(e) => handleChange("city", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., Islamabad"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Province</label>
            <select
    value={profileData.province}
    onChange={(e) => handleChange("province", e.target.value)}
    disabled={!isEditing}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  >
              <option value="">Select Province</option>
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="Khyber Pakhtunkhwa">Khyber Pakhtunkhwa</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
              <option value="Azad Kashmir">Azad Kashmir</option>
              <option value="Islamabad Capital Territory">Islamabad Capital Territory</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Postal Code</label>
            <Input
    value={profileData.postalCode}
    onChange={(e) => handleChange("postalCode", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 44000"
  />
          </div>
        </div>
      </Card>

      {
    /* About University */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">About University</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">About</label>
            <textarea
    value={profileData.about}
    onChange={(e) => handleChange("about", e.target.value)}
    disabled={!isEditing}
    placeholder="Brief description of your university..."
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    rows={4}
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Mission Statement</label>
            <textarea
    value={profileData.mission}
    onChange={(e) => handleChange("mission", e.target.value)}
    disabled={!isEditing}
    placeholder="University mission..."
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    rows={3}
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Vision Statement</label>
            <textarea
    value={profileData.vision}
    onChange={(e) => handleChange("vision", e.target.value)}
    disabled={!isEditing}
    placeholder="University vision..."
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    rows={3}
  />
          </div>
        </div>
      </Card>

      {
    /* Statistics */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">University Statistics</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Total Students</label>
            <Input
    type="number"
    value={profileData.totalStudents}
    onChange={(e) => handleChange("totalStudents", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 15000"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Total Programs</label>
            <Input
    type="number"
    value={profileData.totalPrograms}
    onChange={(e) => handleChange("totalPrograms", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 50"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">National Ranking</label>
            <Input
    value={profileData.ranking}
    onChange={(e) => handleChange("ranking", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., Top 10"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Accreditation</label>
            <Input
    value={profileData.accreditation}
    onChange={(e) => handleChange("accreditation", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., HEC, PEC"
  />
          </div>
        </div>
      </Card>

      {
    /* Representative Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Representative Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Representative Name</label>
            <Input
    value={profileData.representativeName}
    onChange={(e) => handleChange("representativeName", e.target.value)}
    disabled={!isEditing}
    placeholder="Full name"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Position / Designation</label>
            <Input
    value={profileData.representativePosition}
    onChange={(e) => handleChange("representativePosition", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., Admission Officer"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Representative Email</label>
            <Input
    type="email"
    value={profileData.representativeEmail}
    onChange={(e) => handleChange("representativeEmail", e.target.value)}
    disabled={!isEditing}
    placeholder="representative@university.edu.pk"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Representative Phone</label>
            <Input
    type="tel"
    value={profileData.representativePhone}
    onChange={(e) => handleChange("representativePhone", e.target.value)}
    disabled={!isEditing}
    placeholder="+92-300-1234567"
  />
          </div>
        </div>
      </Card>
    </div>;
}
export {
  UniversityProfile
};
