import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Home } from "lucide-react";
import { createUser } from "../services/operations/authApi";
import { toast } from "react-hot-toast";

const Signup: React.FC = () => {
  const [userType, setUserType] = useState<"volunteer" | "host">("volunteer");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: userType,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < 8) {
      toast("Password must be at least 8 characters long", {
        icon: "⚠️",
        style: { background: "#fef3c7", color: "#92400e" },
      });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const dataToSend = { ...formData, role: userType };
      const res = await createUser(dataToSend);
      if (res && res.data?.success) {
        setFormData({ name: "", email: "", password: "", confirmPassword: "", role: userType });
        navigate("/login");
      }
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-honey/10 via-teal/5 to-white dark:from-honey/5 dark:via-teal/5 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl" variants={fadeInUp} initial="initial" animate="animate">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🐝</div>
            <h1 className="text-2xl font-bold text-charcoal dark:text-white mb-2">Join GhumoBee</h1>
            <p className="text-gray-600 dark:text-gray-300">Create your account and start your journey</p>
          </div>
          <motion.div className="mb-6" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.3 }}>
            <label className="block text-sm font-medium text-charcoal dark:text-white mb-3">I want to join as a:</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => { setUserType("volunteer"); setFormData((prev) => ({ ...prev, role: "volunteer" })); }} className={`p-4 rounded-lg border-2 transition-all ${userType === "volunteer" ? "border-honey bg-honey/10 text-charcoal dark:text-white" : "border-gray-200 dark:border-gray-600 hover:border-honey/50"}`}>
                <User className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Volunteer</div>
                <div className="text-xs text-gray-500">Find opportunities</div>
              </button>
              <button type="button" onClick={() => { setUserType("host"); setFormData((prev) => ({ ...prev, role: "host" })); }} className={`p-4 rounded-lg border-2 transition-all ${userType === "host" ? "border-teal bg-teal/10 text-charcoal dark:text-white" : "border-gray-200 dark:border-gray-600 hover:border-teal/50"}`}>
                <Home className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium">Host</div>
                <div className="text-xs text-gray-500">List opportunities</div>
              </button>
            </div>
          </motion.div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Full Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white" placeholder="Enter your email" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white" placeholder="Enter your password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white" placeholder="Confirm your password" />
              </div>
            </div>
            <motion.button type="submit" className="w-full px-6 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-all" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              Create Account
            </motion.button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Already have an account?
              <Link to="/login" className="ml-2 text-honey hover:text-yellow-500 font-medium">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
