import avatarImage from '~/assets/images/avatar.jpeg';

interface DockerCourseCTAProps {
  buttonText?: string;
  heading?: string;
  description?: string;
}

const DockerCourseCTA = ({ buttonText, heading, description }: DockerCourseCTAProps) => {
  // Detect locale from URL
  const isSpanish = typeof window !== 'undefined' && window.location.pathname.includes('/es/');

  // Set default values based on locale
  const defaultButtonText = isSpanish ? 'Aprende más sobre Docker' : 'Take my Docker course';
  const defaultHeading = isSpanish ? '¿Quieres dominar Docker?' : 'Want to Master Docker?';
  const defaultDescription = isSpanish
    ? 'Únete a mi curso de Docker y aprende a crear, desplegar y gestionar aplicaciones con Docker como un profesional.'
    : 'Join my Docker course and learn to build, deploy, and manage applications with Docker like a pro.';

  // Use provided props or fall back to locale-specific defaults
  const finalButtonText = buttonText ?? defaultButtonText;
  const finalHeading = heading ?? defaultHeading;
  const finalDescription = description ?? defaultDescription;

  const handleClick = () => {
    window.location.href = '/#flagship-product';
  };

  return (
    <div className="w-full justify-center flex mt-16">
      <div
        className="p-1 rounded-xl shadow-lg max-w-lg relative"
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
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `}
        </style>

        {/* Avatar hovering on top of the card */}
        <div
          style={{
            position: 'absolute',
            top: '-43px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: '3px',
              background:
                'linear-gradient(45deg, #ec4899, #ef4444, #eab308, #22c55e, #3b82f6, #6366f1, #a855f7, #ec4899)',
              backgroundSize: '400% 400%',
              animation: 'gradient-move 3s ease infinite, float 3s ease-in-out infinite',
              width: '86px',
              height: '86px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={avatarImage.src}
              alt="Avatar"
              style={{
                width: '80px',
                height: '80px',
                display: 'block',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          </div>
        </div>

        <div className="bg-page rounded-lg p-6 pt-12 transition ease duration-300">
          <div className="mx-auto p-2 mb-4">
            <div className="text-xl font-semibold text-default mb-4 text-center">{finalHeading}</div>
            <div className="text-default text-center">{finalDescription}</div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleClick}
              data-umami-event="docker-course-cta-click"
              className="px-6 py-3 bg-blue-400 text-white font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {finalButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DockerCourseCTA;

