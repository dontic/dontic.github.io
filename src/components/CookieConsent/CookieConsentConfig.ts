import type { CookieConsentConfig } from "vanilla-cookieconsent";

// Declare gtag as a global function
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Helper function to safely call gtag
const safeGtag = (...args: any[]) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
};

export const config: CookieConsentConfig = {
  // Set the root element where the cookie consent will be injected
  // This is done so it works with view transitions
  root: "#cc-container",
  guiOptions: {
    consentModal: {
      layout: "bar inline",
      position: "bottom",
      equalWeightButtons: false,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "right",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      readOnly: true,
    },
    analytics: {
      enabled: true,
      services: {
        ga: {
          label: "Google Analytics",
          onAccept: () => {
            // Enable Google Analytics
            console.log("Google Analytics enabled");
            safeGtag("consent", "update", {
              analytics_storage: "granted",
            });
          },
          onReject: () => {
            // Disable Google Analytics
            console.log("Google Analytics disabled");
            safeGtag("consent", "update", {
              analytics_storage: "denied",
            });
          },
          // Array of cookies to erase when the service is disabled/rejected
          cookies: [
            {
              name: /^(_ga|_gid)/,
            },
          ],
        },
      },
    },
  },
  language: {
    default: "en",
    autoDetect: "browser",
    translations: {
      en: {
        consentModal: {
          title: "Hello traveler, it's cookie time!",
          description:
            "We use cookies primarily for analytics to enhance your experience. By accepting, you agree to our use of these cookies. You can manage your preferences or learn more about our cookie policy.",
          acceptAllBtn: "Accept all",
          // acceptNecessaryBtn: "Only necessary",
          showPreferencesBtn: "Manage preferences",
          footer:
            '<a href="#link">Privacy Policy</a>\n<a href="#link">Terms and conditions</a>',
        },
        preferencesModal: {
          title: "Consent Preferences Center",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          serviceCounterLabel: "Service|Services",
          sections: [
            {
              title: "Understanding Cookies",
              description:
                "Cookies are small data files used to store information on your device. They help us improve our site and your experience.",
            },
            {
              title:
                'Essential Cookies <span class="pm__badge">Always Active</span>',
              description:
                "These cookies are essential for the operation of our site. They don't collect personal data and are necessary for features like accessing secure areas.",
              linkedCategory: "necessary",
            },
            {
              title: "Analytics Cookies",
              description:
                "We use analytics cookies to understand how visitors interact with our website. This helps us to improve the user experience and the services we offer.",
              linkedCategory: "analytics",
            },
            {
              title: "More Information",
              description:
                'For more details about our cookie practices, please visit our <a class="cc__link" href="/privacy-policy">Privacy Policy</a> page.',
            },
          ],
        },
      },
      es: {
        consentModal: {
          title: "Es la hora de las galletas!",
          description:
            "Utilizamos cookies principalmente para análisis para mejorar su experiencia. Al aceptar, acepta nuestro uso de estas cookies. Puede gestionar sus preferencias o obtener más información sobre nuestra política de cookies.",
          acceptAllBtn: "Aceptar",
          // acceptNecessaryBtn: "Solo necesarias",
          showPreferencesBtn: "Gestionar preferencias",
          footer:
            '<a href="#link">Política de privacidad</a>\n<a href="#link">Términos y condiciones</a>',
        },
        preferencesModal: {
          title: "Preferencias de Consentimiento",
          acceptAllBtn: "Aceptar todo",
          acceptNecessaryBtn: "Solo necesarias",
          savePreferencesBtn: "Guardar preferencias",
          closeIconLabel: "Cerrar",
          serviceCounterLabel: "Servicios",
          sections: [
            {
              title: "Entendiendo las Cookies",
              description:
                "Las cookies son pequeños archivos de datos utilizados para almacenar información en su dispositivo. Nos ayudan a mejorar nuestro sitio y su experiencia.",
            },
            {
              title:
                'Cookies Esenciales <span class="pm__badge">Siempre activo</span>',
              description:
                "Estas cookies son esenciales para el funcionamiento de nuestro sitio. No recopilan datos personales y son necesarias para funciones como el acceso a áreas seguras.",
              linkedCategory: "necessary",
            },
            {
              title: "Cookies de Análisis",
              description:
                "Utilizamos cookies de análisis para comprender cómo interactúan los visitantes con nuestro sitio web. Esto nos ayuda a mejorar la experiencia del usuario y los servicios que ofrecemos.",
              linkedCategory: "analytics",
            },
            {
              title: "Más Información",
              description:
                'Para obtener más detalles sobre nuestras prácticas de cookies, visite nuestra página de <a class="cc__link" href="/privacy-policy">Política de Privacidad</a>.',
            },
          ],
        },
      },
    },
  },
};
