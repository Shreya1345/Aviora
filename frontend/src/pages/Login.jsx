import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data);
        toast.success('Logged in successfully.');
        navigate(data.role === 'admin' ? '/admin' : location.state?.from || '/', { replace: true });
      } else {
        toast.error(data.message || 'Unable to log in.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to log in. Please try again.');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex min-h-[560px] w-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
        {/* Left column – hero image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.pexels.com/photos/1395306/pexels-photo-1395306.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Luxury jewelry display"
            className="h-full w-full rounded-l-2xl object-cover"
          />
        </div>

        {/* Right column – login form */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-10 md:w-1/2">
          <div className="mb-6 text-center">
            <h2 className="flex items-center justify-center text-3xl font-bold">
              <Icon icon="mdi:diamond-stone" className="mr-2 text-primary" aria-hidden="true" />
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-base-content/60">Sign in to access your exclusive collection</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label font-medium" htmlFor="login-email">Email</label>
              <input id="login-email" className="input input-bordered w-full px-4 py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-control mb-4">
              <label className="label font-medium" htmlFor="login-password">Password</label>
              <input id="login-password" className="input input-bordered w-full px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <Icon icon="mdi:login" aria-hidden="true" /> Login
            </button>
          </form>

          <p className="mt-4 text-center text-base-content/60">Don't have an account? <Link to="/register" state={location.state} className="link link-primary">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
