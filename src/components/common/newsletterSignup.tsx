import { useState } from 'react';

interface NewsletterSignupProps {
  buttonText?: string;
  placeholder?: string;
}

const NewsletterSignup = ({
  buttonText = 'Join my newsletter!',
  placeholder = 'Enter your email',
}: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // The form will not submit if the email is invalid due to the "required" and "type=email" attributes
    setStatus('loading');

    try {
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.');
    }
  };

  return (
    <div className="w-full justify-center flex">
      <div
        className="p-1 rounded-xl shadow-lg max-w-lg"
        style={{
          background: 'linear-gradient(45deg, #ec4899, #ef4444, #eab308, #22c55e, #3b82f6, #6366f1, #a855f7, #ec4899)',
          backgroundSize: '400% 400%',
          animation: 'gradient-move 3s ease infinite',
        }}
      >
        <style>
          {`
          @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
        </style>

        <div className="bg-page rounded-lg p-6">
          <div className="mx-auto p-2 mb-4">
            <div className="text-xl font-semibold text-default mb-4 text-center">Oh look! Another newsletter!</div>
            <div className="text-default text-center">
              Join thousands of developers getting weekly insights, tips, and tutorials delivered straight to your
              inbox.
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 mb-6 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder}
              className={`px-4 py-2 border ${status === 'error' ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-xs`}
              disabled={status === 'loading'}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-blue-400 text-white font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {status === 'loading' ? 'Submitting...' : buttonText}
            </button>
          </form>

          {message && (
            <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
