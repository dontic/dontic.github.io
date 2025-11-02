import { useState, useEffect } from 'react';

interface NewsletterSignupProps {
  buttonText?: string;
  placeholder?: string;
}

const translations = {
  en: {
    title: 'Hey look! A newsletter!',
    description:
      'Each week, I share lessons learned, actionable business tips, practical life advice, and highlights from my journey, directly to your inbox.',
    buttonText: 'Subscribe',
    placeholder: 'Enter your email',
    submitting: 'Submitting...',
    successMessage: 'Thanks for joining the newsletter!',
    errorMessage: 'Failed to join newsletter. Please try again.',
    privacyText:
      "By submitting this form, you'll be signed up to my free newsletter. You can opt-out at any time with no hard feelings 😉 Here's our",
    privacyLink: 'privacy policy',
    privacyEnd: 'if you like reading.',
  },
  es: {
    title: '¡Mira! ¡Una newsletter!',
    description:
      'Cada semana, comparto lecciones aprendidas, consejos prácticos de negocios, consejos de vida y lo más destacado de mi viaje, directamente en tu bandeja de entrada.',
    buttonText: 'Suscribirse',
    placeholder: 'Introduce tu correo electrónico',
    submitting: 'Enviando...',
    successMessage: '¡Gracias por unirte al boletín!',
    errorMessage: 'No se pudo unir al boletín. Por favor, inténtalo de nuevo.',
    privacyText:
      'Al enviar este formulario, te suscribirás a mi boletín gratuito. Puedes darte de baja en cualquier momento sin resentimientos 😉 Aquí está nuestra',
    privacyLink: 'política de privacidad',
    privacyEnd: 'si te gusta leer.',
  },
};

const NewsletterSignup = ({ buttonText, placeholder }: NewsletterSignupProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [locale, setLocale] = useState<'en' | 'es'>('en');

  useEffect(() => {
    // Detect locale from URL
    const path = window.location.pathname;
    if (path.includes('/es/')) {
      setLocale('es');
    } else {
      setLocale('en');
    }
  }, []);

  const t = translations[locale];

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
          waitlist_name: 'daniel_newsletter',
          email: email,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setMessage(t.successMessage);
        setEmail('');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : t.errorMessage);
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

        <div className="bg-page rounded-lg p-6 transition ease duration-300">
          <div className="mx-auto p-2 mb-4">
            <div className="text-xl font-semibold text-default mb-4 text-center">{t.title}</div>
            <div className="text-default text-center">{t.description}</div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-3 mb-6 sm:flex-row sm:space-y-0 sm:space-x-2 sm:justify-center"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={placeholder || t.placeholder}
              className={`px-4 py-2 border ${status === 'error' ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-xs`}
              disabled={status === 'loading'}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-blue-400 text-white font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {status === 'loading' ? t.submitting : buttonText || t.buttonText}
            </button>
          </form>

          <div className="text-center text-xs text-gray-500">
            <p>
              {t.privacyText}{' '}
              <a
                href={locale === 'es' ? '/es/privacy/' : '/privacy/'}
                target="_blank"
                className="text-blue-500 hover:text-blue-600"
              >
                {t.privacyLink}
              </a>{' '}
              {t.privacyEnd}
            </p>
          </div>

          {message && (
            <p className={`mt-2 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;
