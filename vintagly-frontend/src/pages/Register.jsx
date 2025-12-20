import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(
        "http://localhost:8186/public/auth/register",
        { username: email, password, firstName, lastName, role: "customer" },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(response.data || 'User registered successfully. Check your email.');
    } catch (error) {
      console.error(error);
      setMessage('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Features */}
        <div className="space-y-8">
          {[
            {
              title: 'Elegant & Authentic',
              desc: 'Authentic treasures, curated with care.',
            },
            {
              title: 'Luxury & premium',
              desc: 'Discover, collect, and cherish the beauty of time.',
            },
            {
              title: 'Join millions giving timeless treasures a new story.',
              desc: 'Your trusted marketplace for vintage authenticity.',
            },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-[#8c5d36] rounded-full flex items-center justify-center mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#5d4827] mb-2">{feature.title}</h3>
                <p className="text-[#6b4423]">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-auto border-2 border-[#d8b370]">
          <h2 className="text-3xl font-bold text-[#5d4827] mb-3">Create your Free Account</h2>

          <div className="space-y-4 mb-6">
            {/* Social Signups */}
            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#d8b370] rounded-lg hover:bg-[#f4decb] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-[#5d4827] font-medium">Sign up with Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-[#d8b370] rounded-lg hover:bg-[#f4decb] transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span className="text-[#5d4827] font-medium">Sign up with Apple</span>
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-[#d8b370]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-[#846953]">or</span>
            </div>
          </div>

          {message && (
            <p className="text-green-700 mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#5d4827] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 border-2 border-[#d8b370] rounded-lg focus:ring-2 focus:ring-[#8c5d36] focus:border-[#8c5d36] outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-[#5d4827] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border-2 border-[#d8b370] rounded-lg focus:ring-2 focus:ring-[#8c5d36] focus:border-[#8c5d36] outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#5d4827] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full px-4 py-3 border-2 border-[#d8b370] rounded-lg focus:ring-2 focus:ring-[#8c5d36] focus:border-[#8c5d36] outline-none transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#5d4827] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#d8b370] rounded-lg focus:ring-2 focus:ring-[#8c5d36] focus:border-[#8c5d36] outline-none transition-all pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#846953] hover:text-[#5d4827]"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 mt-1 text-[#8c5d36] border-[#d8b370] rounded focus:ring-[#8c5d36]"
                required
              />
              <label htmlFor="terms" className="text-sm text-[#846953]">
                By signing up, you are creating a Vintagly account, and you agree to Vintagly's{' '}
                <a href="#" className="text-[#8c5d36] hover:underline font-medium">Terms of Use</a> and{' '}
                <a href="#" className="text-[#8c5d36] hover:underline font-medium">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8c5d36] text-white py-3 rounded-lg font-semibold hover:bg-[#734f2e] transition-all shadow-lg hover:shadow-xl"
            >
              Create an account
            </button>
          </form>

          <p className="text-center text-sm text-[#846953] mt-6">
            Already have an account?{' '}
            <a href="/login" className="text-[#8c5d36] hover:underline font-semibold">
              Sign in here
            </a>
          </p>
        </div>
      </div>
      
    </div>
  );
}