import { useState } from 'react';

interface WaitlistProps {
  buttonText?: string;
  placeholder?: string;
  waitlistName?: string;
}

const Waitlist = ({
  buttonText = 'Join the waitlist!',
  placeholder = 'Enter your email',
  waitlistName = 'daniel_course',
}: WaitlistProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // The form will not submit if the email is invalid due to the "required" and "type=email" attributes
    setStatus('loading');

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
        setMessage('Thanks for joining the waitlist!');
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
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className={`px-4 py-2 border ${status === 'error' ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow`}
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

      {message && <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}
    </div>
  );
};

export default Waitlist;
