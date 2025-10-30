interface WebsiteDesignCTAProps {
  buttonText?: string;
  heading?: string;
  description?: string;
}

const WebsiteDesignCTA = ({
  buttonText = 'Learn More',
  heading = 'Need a Website or WebApp?',
  description = 'Check out my web development services to get a beautiful, modern website or app for your business.',
}: WebsiteDesignCTAProps) => {
  const handleClick = () => {
    window.open('/website-design/', '_blank');
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
            <div className="text-xl font-semibold text-default mb-4 text-center">{heading}</div>
            <div className="text-default text-center">{description}</div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleClick}
              data-umami-event="website-design-cta-click"
              className="px-6 py-3 bg-blue-400 text-white font-medium rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteDesignCTA;
