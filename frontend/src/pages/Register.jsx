import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Registration successful!');
        login(data);
        navigate(location.state?.from || '/', { replace: true });
      } else {
        toast.error(data.message || 'Unable to register.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Unable to register. Please try again.');
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex min-h-[560px] w-full overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl">
        {/* Left column – hero image (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.pexels.com/photos/691046/pexels-photo-691046.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Elegant rings collection"
            className="h-full w-full rounded-l-2xl object-cover"
          />
        </div>

        {/* Right column – register form */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-10 md:w-1/2">
          <div className="mb-6 text-center">
            <h2 className="flex items-center justify-center text-3xl font-bold">
              <Icon icon="mdi:diamond-stone" className="mr-2 text-primary" aria-hidden="true" />
              Create Your Account
            </h2>
            <p className="mt-2 text-sm text-base-content/60">Join Aviora for exclusive access to our finest jewelry</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label font-medium" htmlFor="register-name">Full Name</label>
              <input id="register-name" className="input input-bordered w-full px-4 py-3" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-control mb-4">
              <label className="label font-medium" htmlFor="register-email">Email</label>
              <input id="register-email" className="input input-bordered w-full px-4 py-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-control mb-4">
              <label className="label font-medium" htmlFor="register-password">Password</label>
              <input id="register-password" className="input input-bordered w-full px-4 py-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              <Icon icon="mdi:account-plus-outline" aria-hidden="true" /> Register
            </button>
          </form>

          <p className="mt-4 text-center text-base-content/60">Already have an account? <Link to="/login" state={location.state} className="link link-primary">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
