import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Eye,
  User,
  LogOut,
  AlertCircle,
  Save,
  Loader2,
  Check
} from "lucide-react"

interface NotificationSettings {
  email_achievements: boolean
  email_mentorship: boolean
  email_courses: boolean
  email_connections: boolean
  push_enabled: boolean
}

interface PrivacySettings {
  profile_public: boolean
  show_achievements: boolean
  show_projects: boolean
  show_skills: boolean
}

export default function Settings() {
  const { user, token, logout } = useAuth()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("notifications")
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_achievements: true,
    email_mentorship: true,
    email_courses: true,
    email_connections: true,
    push_enabled: true
  })

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profile_public: true,
    show_achievements: true,
    show_projects: true,
    show_skills: true
  })

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePrivacyToggle = (key: keyof PrivacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSaveNotifications = async () => {
    if (!token) return
    setIsSaving(true)
    try {
      // Mock save - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Notification settings saved successfully!"
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Could not save notification settings",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePrivacy = async () => {
    if (!token) return
    setIsSaving(true)
    try {
      // Mock save - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Privacy settings saved successfully!"
      })
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast({
        title: "Error",
        description: "Could not save privacy settings",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    // Validation
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive"
      })
      return
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (passwordData.new_password.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      // Mock password change - replace with actual API call when available
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Success",
        description: "Password changed successfully!"
      })
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      })
      setShowPasswordForm(false)
    } catch (error) {
      console.error("Failed to change password:", error)
      toast({
        title: "Error",
        description: "Could not change password",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out"
      })
    }
  }

  return (
    <div className="container max-w-screen-2xl p-6 lg:p-12 space-y-8">
      {/* Header */}
      <div className="border-b border-cyan-700 pb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-cyan-400" />
          Settings
        </h1>
        <p className="text-cyan-200 text-sm">Manage your account preferences and security</p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Sidebar Navigation */}
        <div className="md:col-span-1">
          <div className="space-y-2 sticky top-8">
            {[
              { id: "notifications", label: "Notifications", icon: Bell },
              { id: "privacy", label: "Privacy", icon: Eye },
              { id: "security", label: "Security", icon: Lock },
              { id: "account", label: "Account", icon: User }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? "bg-cyan-600 text-white font-semibold"
                      : "text-gray-300 hover:bg-blue-900/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3 space-y-6">
          {/* Notifications Settings */}
          {activeTab === "notifications" && (
            <Card className="bg-blue-800/50 border-cyan-700">
              <CardHeader className="bg-blue-700/50 border-b border-cyan-700">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  Notification Settings
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Control how you receive updates and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {/* Email Notifications */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Email Notifications</h3>

                  {[
                    { key: "email_achievements", label: "Achievement unlocked", desc: "Get notified when you earn badges" },
                    { key: "email_mentorship", label: "Mentorship updates", desc: "Updates about your mentor connections" },
                    { key: "email_courses", label: "Course recommendations", desc: "Personalized course suggestions" },
                    { key: "email_connections", label: "Connection requests", desc: "When someone wants to connect" }
                  ].map(item => (
                    <div key={item.key} className="flex items-start justify-between p-4 rounded-lg bg-blue-900/30 border border-cyan-700/30">
                      <div>
                        <p className="text-white font-medium">{item.label}</p>
                        <p className="text-gray-400 text-sm">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[item.key as keyof NotificationSettings]}
                          onChange={() => handleNotificationToggle(item.key as keyof NotificationSettings)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Push Notifications */}
                <div className="pt-4 border-t border-cyan-700/30">
                  <div className="flex items-start justify-between p-4 rounded-lg bg-blue-900/30 border border-cyan-700/30">
                    <div>
                      <p className="text-white font-medium">Browser notifications</p>
                      <p className="text-gray-400 text-sm">Real-time push notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.push_enabled}
                        onChange={() => handleNotificationToggle("push_enabled")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={handleSaveNotifications}
                  disabled={isSaving}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-10"
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save Notification Settings"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === "privacy" && (
            <Card className="bg-blue-800/50 border-cyan-700">
              <CardHeader className="bg-blue-700/50 border-b border-cyan-700">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-cyan-400" />
                  Privacy Settings
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Control who can see your profile and information
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                {[
                  { key: "profile_public", label: "Public profile", desc: "Allow others to view your profile" },
                  { key: "show_achievements", label: "Show achievements", desc: "Display your badges and achievements" },
                  { key: "show_projects", label: "Show projects", desc: "Display your portfolio projects" },
                  { key: "show_skills", label: "Show skills", desc: "Display your skills and expertise" }
                ].map(item => (
                  <div key={item.key} className="flex items-start justify-between p-4 rounded-lg bg-blue-900/30 border border-cyan-700/30">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings[item.key as keyof PrivacySettings]}
                        onChange={() => handlePrivacyToggle(item.key as keyof PrivacySettings)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-cyan-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                  </div>
                ))}

                <Button
                  onClick={handleSavePrivacy}
                  disabled={isSaving}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-10"
                >
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSaving ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <Card className="bg-blue-800/50 border-cyan-700">
              <CardHeader className="bg-blue-700/50 border-b border-cyan-700">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-cyan-400" />
                  Security Settings
                </CardTitle>
                <CardDescription className="text-cyan-200">
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                {!showPasswordForm ? (
                  <Button
                    onClick={() => setShowPasswordForm(true)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-10"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                ) : (
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-cyan-100">Current Password</Label>
                      <Input
                        type="password"
                        value={passwordData.current_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, current_password: e.target.value })
                        }
                        placeholder="Enter your current password"
                        className="bg-blue-700 border-cyan-600 text-white h-10 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-cyan-100">New Password</Label>
                      <Input
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, new_password: e.target.value })
                        }
                        placeholder="Enter new password"
                        className="bg-blue-700 border-cyan-600 text-white h-10 focus:border-cyan-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-cyan-100">Confirm New Password</Label>
                      <Input
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, confirm_password: e.target.value })
                        }
                        placeholder="Confirm new password"
                        className="bg-blue-700 border-cyan-600 text-white h-10 focus:border-cyan-500"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isSaving}
                        className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold h-10"
                      >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                        {isSaving ? "Updating..." : "Update Password"}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false)
                          setPasswordData({
                            current_password: "",
                            new_password: "",
                            confirm_password: ""
                          })
                        }}
                        className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold h-10"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}

                <div className="pt-4 border-t border-cyan-700/30">
                  <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-lg flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold">Password security tip</p>
                      <p className="text-yellow-200/80 mt-1">
                        Use a strong password with a mix of uppercase, lowercase, numbers, and special characters.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Settings */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <Card className="bg-blue-800/50 border-cyan-700">
                <CardHeader className="bg-blue-700/50 border-b border-cyan-700">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-cyan-400" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="p-4 rounded-lg bg-blue-900/30 border border-cyan-700/30">
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium text-lg">{user?.email}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-900/30 border border-cyan-700/30">
                    <p className="text-gray-400 text-sm">Full Name</p>
                    <p className="text-white font-medium text-lg">{user?.name}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-blue-900/30 border border-cyan-700/30">
                    <p className="text-gray-400 text-sm">Account Status</p>
                    <p className="text-green-400 font-medium text-lg flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      Active
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-red-900/20 border-red-700/30">
                <CardHeader className="border-b border-red-700/30">
                  <CardTitle className="text-red-400">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold h-10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
