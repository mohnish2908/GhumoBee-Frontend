import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { login } from "../services/operations/authApi";
import { AppDispatch } from "../store/store";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // --- LOGIN FLOW ---
    const res = await dispatch(login(formData));
    if (res?.data?.success) {
      navigate("/personal-info");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-honey/10 via-teal/5 to-white dark:from-honey/5 dark:via-teal/5 dark:to-gray-900">
      <div className="max-w-md mx-auto px-4 py-12">
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🐝</div>
            <h1 className="text-2xl font-bold text-charcoal dark:text-white mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to your account
            </p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal dark:text-white mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-honey focus:border-transparent bg-white dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                {/* <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-honey focus:ring-honey border-gray-300 dark:border-gray-600 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label> */}
              </div>
              <Link
                to="/forgot-password"
                className="font-medium text-honey hover:text-yellow-500"
              >
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              className="w-full px-6 py-4 bg-honey hover:bg-yellow-500 text-charcoal font-semibold rounded-lg transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Log In
            </motion.button>
          </form>

          {/* Social Login */}
          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                <span className="text-lg mr-2">🔍</span>
                Google
              </button>
              <button className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                <span className="text-lg mr-2">📘</span>
                Facebook
              </button>
            </div>
          </div> */}

          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Don't have an account?
              <Link to="/signup" className="ml-2 text-honey hover:text-yellow-500 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
