import { useState, useEffect } from "react";
import { Save, Upload, User, Phone, MapPin, BookOpen, Award, GraduationCap } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
function StudentProfile({ studentId, initialName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem(`studentProfile_${studentId}`);
    return saved ? JSON.parse(saved) : {
      fullName: initialName,
      fatherName: "",
      cnic: "",
      dateOfBirth: "",
      gender: "male",
      bloodGroup: "",
      religion: "Islam",
      nationality: "Pakistani",
      email: "",
      phone: "",
      alternatePhone: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
      matricBoard: "",
      matricRollNo: "",
      matricYear: "",
      matricTotalMarks: "1100",
      matricObtainedMarks: "",
      matricPercentage: "",
      interBoard: "",
      interRollNo: "",
      interYear: "",
      interTotalMarks: "1100",
      interObtainedMarks: "",
      interPercentage: "",
      interGroup: "",
      preferredPrograms: [],
      preferredCities: [],
      achievements: "",
      extraCurricular: "",
      profilePicture: ""
    };
  });
  const calculatePercentage = (obtained, total) => {
    const obt = parseFloat(obtained);
    const tot = parseFloat(total);
    if (obt && tot && tot > 0) {
      return (obt / tot * 100).toFixed(2);
    }
    return "";
  };
  useEffect(() => {
    if (profileData.matricObtainedMarks && profileData.matricTotalMarks) {
      const percentage = calculatePercentage(profileData.matricObtainedMarks, profileData.matricTotalMarks);
      if (percentage !== profileData.matricPercentage) {
        setProfileData((prev) => ({ ...prev, matricPercentage: percentage }));
      }
    }
  }, [profileData.matricObtainedMarks, profileData.matricTotalMarks]);
  useEffect(() => {
    if (profileData.interObtainedMarks && profileData.interTotalMarks) {
      const percentage = calculatePercentage(profileData.interObtainedMarks, profileData.interTotalMarks);
      if (percentage !== profileData.interPercentage) {
        setProfileData((prev) => ({ ...prev, interPercentage: percentage }));
      }
    }
  }, [profileData.interObtainedMarks, profileData.interTotalMarks]);
  const handleSave = () => {
    localStorage.setItem(`studentProfile_${studentId}`, JSON.stringify(profileData));
    setIsEditing(false);
    alert("Profile updated successfully!");
  };
  const handleChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("profilePicture", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const programs = [
    "Computer Science",
    "Software Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Business Administration",
    "Economics",
    "Medicine",
    "Pharmacy",
    "Architecture"
  ];
  const cities = [
    "Islamabad",
    "Rawalpindi",
    "Lahore",
    "Karachi",
    "Faisalabad",
    "Multan",
    "Peshawar",
    "Quetta",
    "Abbottabad",
    "Sialkot"
  ];
  return <div className="space-y-6">
      {
    /* Header */
  }
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-2">Student Profile</h1>
          <p className="text-slate-600">Manage your personal and academic information</p>
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
    /* Profile Picture */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center overflow-hidden">
            {profileData.profilePicture ? <img src={profileData.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <User className="w-12 h-12 text-white" />}
          </div>
          <div className="flex-1">
            <h3 className="text-slate-900 mb-2">Profile Picture</h3>
            <p className="text-slate-600 text-sm mb-3">Upload your photo (recommended: square image, max 2MB)</p>
            {isEditing && <label className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                Upload Picture
                <input
    type="file"
    accept="image/*"
    onChange={handleProfilePictureUpload}
    className="hidden"
  />
              </label>}
          </div>
        </div>
      </Card>

      {
    /* Personal Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Personal Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Full Name</label>
            <Input
    value={profileData.fullName}
    onChange={(e) => handleChange("fullName", e.target.value)}
    disabled={!isEditing}
    placeholder="Your full name"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Father's Name</label>
            <Input
    value={profileData.fatherName}
    onChange={(e) => handleChange("fatherName", e.target.value)}
    disabled={!isEditing}
    placeholder="Father's full name"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">CNIC / B-Form Number</label>
            <Input
    value={profileData.cnic}
    onChange={(e) => handleChange("cnic", e.target.value)}
    disabled={!isEditing}
    placeholder="12345-1234567-1"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Date of Birth</label>
            <Input
    type="date"
    value={profileData.dateOfBirth}
    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
    disabled={!isEditing}
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Gender</label>
            <select
    value={profileData.gender}
    onChange={(e) => handleChange("gender", e.target.value)}
    disabled={!isEditing}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Blood Group</label>
            <select
    value={profileData.bloodGroup}
    onChange={(e) => handleChange("bloodGroup", e.target.value)}
    disabled={!isEditing}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Religion</label>
            <Input
    value={profileData.religion}
    onChange={(e) => handleChange("religion", e.target.value)}
    disabled={!isEditing}
    placeholder="Religion"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Nationality</label>
            <Input
    value={profileData.nationality}
    onChange={(e) => handleChange("nationality", e.target.value)}
    disabled={!isEditing}
    placeholder="Nationality"
  />
          </div>
        </div>
      </Card>

      {
    /* Contact Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-emerald-600" />
          Contact Information
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Email Address</label>
            <Input
    type="email"
    value={profileData.email}
    onChange={(e) => handleChange("email", e.target.value)}
    disabled={!isEditing}
    placeholder="your.email@example.com"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Phone Number</label>
            <Input
    type="tel"
    value={profileData.phone}
    onChange={(e) => handleChange("phone", e.target.value)}
    disabled={!isEditing}
    placeholder="+92-300-1234567"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Alternate Phone</label>
            <Input
    type="tel"
    value={profileData.alternatePhone}
    onChange={(e) => handleChange("alternatePhone", e.target.value)}
    disabled={!isEditing}
    placeholder="+92-300-7654321"
  />
          </div>
        </div>
      </Card>

      {
    /* Address */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-600" />
          Address
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-slate-700 mb-2 text-sm">Street Address</label>
            <Input
    value={profileData.address}
    onChange={(e) => handleChange("address", e.target.value)}
    disabled={!isEditing}
    placeholder="House #, Street, Area"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">City</label>
            <Input
    value={profileData.city}
    onChange={(e) => handleChange("city", e.target.value)}
    disabled={!isEditing}
    placeholder="City name"
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
    placeholder="Postal code"
  />
          </div>
        </div>
      </Card>

      {
    /* Matric Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          Matriculation / SSC Information
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Board</label>
            <Input
    value={profileData.matricBoard}
    onChange={(e) => handleChange("matricBoard", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., FBISE"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Roll Number</label>
            <Input
    value={profileData.matricRollNo}
    onChange={(e) => handleChange("matricRollNo", e.target.value)}
    disabled={!isEditing}
    placeholder="Roll number"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Passing Year</label>
            <Input
    type="number"
    value={profileData.matricYear}
    onChange={(e) => handleChange("matricYear", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 2023"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Total Marks</label>
            <Input
    type="number"
    value={profileData.matricTotalMarks}
    onChange={(e) => handleChange("matricTotalMarks", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 1100"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Obtained Marks</label>
            <Input
    type="number"
    value={profileData.matricObtainedMarks}
    onChange={(e) => handleChange("matricObtainedMarks", e.target.value)}
    disabled={!isEditing}
    placeholder="Marks obtained"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Percentage</label>
            <Input
    value={profileData.matricPercentage}
    disabled={true}
    placeholder="Auto-calculated"
    className="bg-slate-50"
  />
          </div>
        </div>
      </Card>

      {
    /* Intermediate Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-emerald-600" />
          Intermediate / HSSC / A-Level Information
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Board</label>
            <Input
    value={profileData.interBoard}
    onChange={(e) => handleChange("interBoard", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., FBISE / Cambridge"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Roll Number</label>
            <Input
    value={profileData.interRollNo}
    onChange={(e) => handleChange("interRollNo", e.target.value)}
    disabled={!isEditing}
    placeholder="Roll number"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Passing Year</label>
            <Input
    type="number"
    value={profileData.interYear}
    onChange={(e) => handleChange("interYear", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 2025"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Group / Subjects</label>
            <select
    value={profileData.interGroup}
    onChange={(e) => handleChange("interGroup", e.target.value)}
    disabled={!isEditing}
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
  >
              <option value="">Select Group</option>
              <option value="Pre-Engineering">Pre-Engineering</option>
              <option value="Pre-Medical">Pre-Medical</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Commerce">Commerce</option>
              <option value="Humanities">Humanities</option>
              <option value="General Science">General Science</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Total Marks</label>
            <Input
    type="number"
    value={profileData.interTotalMarks}
    onChange={(e) => handleChange("interTotalMarks", e.target.value)}
    disabled={!isEditing}
    placeholder="e.g., 1100"
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Obtained Marks</label>
            <Input
    type="number"
    value={profileData.interObtainedMarks}
    onChange={(e) => handleChange("interObtainedMarks", e.target.value)}
    disabled={!isEditing}
    placeholder="Marks obtained"
  />
          </div>
          <div className="md:col-span-3">
            <label className="block text-slate-700 mb-2 text-sm">Percentage</label>
            <Input
    value={profileData.interPercentage}
    disabled={true}
    placeholder="Auto-calculated"
    className="bg-slate-50"
  />
          </div>
        </div>
      </Card>

      {
    /* Preferences */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          Preferences & Interests
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Preferred Programs</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {programs.map((program) => <label key={program} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
    type="checkbox"
    checked={profileData.preferredPrograms.includes(program)}
    onChange={(e) => {
      if (e.target.checked) {
        handleChange("preferredPrograms", [...profileData.preferredPrograms, program]);
      } else {
        handleChange("preferredPrograms", profileData.preferredPrograms.filter((p) => p !== program));
      }
    }}
    disabled={!isEditing}
    className="w-4 h-4"
  />
                  <span className="text-sm text-slate-700">{program}</span>
                </label>)}
            </div>
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Preferred Cities</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {cities.map((city) => <label key={city} className="flex items-center gap-2 p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <input
    type="checkbox"
    checked={profileData.preferredCities.includes(city)}
    onChange={(e) => {
      if (e.target.checked) {
        handleChange("preferredCities", [...profileData.preferredCities, city]);
      } else {
        handleChange("preferredCities", profileData.preferredCities.filter((c) => c !== city));
      }
    }}
    disabled={!isEditing}
    className="w-4 h-4"
  />
                  <span className="text-sm text-slate-700">{city}</span>
                </label>)}
            </div>
          </div>
        </div>
      </Card>

      {
    /* Additional Information */
  }
      <Card className="bg-white border border-slate-200 p-6">
        <h3 className="text-slate-900 mb-4">Additional Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Academic Achievements & Awards</label>
            <textarea
    value={profileData.achievements}
    onChange={(e) => handleChange("achievements", e.target.value)}
    disabled={!isEditing}
    placeholder="List your academic achievements, awards, scholarships, etc..."
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    rows={4}
  />
          </div>
          <div>
            <label className="block text-slate-700 mb-2 text-sm">Extra-Curricular Activities</label>
            <textarea
    value={profileData.extraCurricular}
    onChange={(e) => handleChange("extraCurricular", e.target.value)}
    disabled={!isEditing}
    placeholder="Sports, societies, volunteer work, hobbies, etc..."
    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
    rows={4}
  />
          </div>
        </div>
      </Card>
    </div>;
}
export {
  StudentProfile
};
