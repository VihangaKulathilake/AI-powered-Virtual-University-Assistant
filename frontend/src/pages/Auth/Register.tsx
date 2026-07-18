import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const getPasswordStrength = (pw: string) => {
  if (pw.length === 0) return null;
  if (pw.length < 6) return { label: 'Too short', color: 'bg-red-500', width: '20%' };
  if (pw.length < 8) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
  if (!/[A-Z]/.test(pw) || !/[0-9]/.test(pw)) return { label: 'Fair', color: 'bg-yellow-500', width: '65%' };
  return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      setSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.2s' }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">

          {/* Logo & Title */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/20">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Create your account</h1>
            <p className="text-sm text-slate-400 mt-1">Join UniAssist at University of Kelaniya</p>
          </div>

          {/* Success Banner */}
          {success && (
            <div className="flex items-start gap-3 p-3.5 mb-5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>Account created! Redirecting you to login...</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="flex items-start gap-3 p-3.5 mb-5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="register-name" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Vihanga Kulathilake"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@stu.kln.ac.lk"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Strength Bar */}
              {strength && (
                <div className="mt-2">
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="register-confirm" className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="register-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 pr-11 bg-slate-950 border rounded-xl text-sm text-slate-200 placeholder-slate-600 outline-none transition-all ${
                    confirmPassword
                      ? passwordsMatch
                        ? 'border-emerald-500/50 focus:border-emerald-500'
                        : 'border-red-500/50 focus:border-red-500'
                      : 'border-slate-800 focus:border-indigo-500'
                  } focus:ring-1 focus:ring-indigo-500`}
                />
                {confirmPassword && (
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {passwordsMatch
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : <AlertCircle className="w-4 h-4 text-red-400" />
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit"
              type="submit"
              disabled={isLoading || !name.trim() || !email.trim() || !password || !confirmPassword}
              className="w-full py-3 mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
              Sign in
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-5">
          University of Kelaniya · UniAssist AI Platform
        </p>
      </div>
    </div>
  );
};

export default Register;
