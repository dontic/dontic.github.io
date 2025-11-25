import { useState } from 'react';

interface WaitlistSignupProps {
  buttonText?: string;
  placeholder?: string;
  waitlistName?: string;
}

const WaitlistSignup = ({
  buttonText = 'Get Early Access',
  placeholder = 'Enter your email',
  waitlistName = 'docker_course',
}: WaitlistSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('https://waitlist.hlab.es/waitlist/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          waitlist_name: waitlistName,
          email: email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage('Thanks for joining! Check your email for updates.');
        setEmail('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Failed to join waitlist. Please try again.');
    }
  };

  return (
    <>
      <style>{`
        .waitlist-button {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          color: white;
          padding: 1rem 2rem;
          border-radius: 16px;
          font-size: 1.125rem;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative;
          overflow: hidden;
          cursor: pointer;
          border: none;
          white-space: nowrap;
        }

        .waitlist-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #10b981, #3b82f6);
          background-size: 300% 300%;
          animation: gradient-shift 6s ease infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .waitlist-button:hover::before {
          opacity: 1;
        }

        .waitlist-button:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.5);
        }

        .waitlist-button:hover .arrow-icon {
          transform: translateX(4px);
        }

        .waitlist-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .waitlist-button:disabled:hover {
          transform: none;
          box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
        }

        .waitlist-button:disabled:hover::before {
          opacity: 0;
        }

        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      <div className="flagship-cta opacity-0 w-full">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch justify-center w-full">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className={`px-4 py-3 border ${status === 'error' ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 w-full sm:w-auto`}
            disabled={status === 'loading' || status === 'success'}
            required
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="waitlist-button flex-shrink-0"
          >
            <span className="relative z-10 whitespace-nowrap">
              {status === 'loading' ? 'Joining...' : status === 'success' ? 'Joined!' : buttonText}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              className="w-5 h-5 relative z-10 transition-transform duration-300 arrow-icon"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
            </svg>
          </button>
        </form>

        {message && (
          <p className={`mt-3 text-sm text-center ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </>
  );
};

export default WaitlistSignup;
