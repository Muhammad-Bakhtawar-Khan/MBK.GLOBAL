
import { useEffect } from "react";

const configuredUrl = import.meta.env.VITE_SITE_URL as string | undefined;

export const SITE_URL = (
  configuredUrl || "https://mbkglobal.vercel.app"
).replace(/\/+$/, "");

const SITE_NAME = "MBK.GLOBAL";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=1200&q=90";

type SeoInput = {
  title: string;
  description: string;
  pathname?: string;
  type?: "website" | "article";
  image?: string;
  noIndex?: boolean;
  breadcrumb?: string[];
  schema?: Record<string, unknown>;
};

function upsertMeta(
  selector: string,
  attribute: "name" | "property",
  value: string,
  content: string
) {
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.content = content;
}

function setCanonical(url: string) {
  let canonical =
    document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

const organization = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "MBK Global",
  url: SITE_URL,
  description:
    "MBK.GLOBAL is the digital brand of Muhammad Bakhtawar Khan, focused on web systems, application development, AI, APIs, cybersecurity, SEO and digital innovation.",
  logo: `${SITE_URL}/favicon.svg`,
  image: DEFAULT_IMAGE,
  founder: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: "Muhammad Bakhtawar Khan",
    url: SITE_URL,
  },
  knowsAbout: [
    "Web Development",
    "Application Development",
    "Artificial Intelligence",
    "API Development",
    "Reverse Engineering",
    "Cybersecurity",
    "Web Security",
    "Code Analysis",
    "Search Engine Optimization",
    "Cloud Computing",
    "Digital Innovation",
  ],
};

function getBreadcrumb(
  pathname: string,
  supplied?: string[]
) {
  const parts = pathname.split("/").filter(Boolean);

  const labels =
    supplied ||
    parts.map((part) =>
      part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    );

  return [
    { name: "Home", url: `${SITE_URL}/` },
    ...labels.map((name, index) => ({
      name,
      url: `${SITE_URL}/${parts
        .slice(0, index + 1)
        .join("/")}`,
    })),
  ];
}

export function applySeo(input: SeoInput) {
  const pathname = input.pathname || window.location.pathname || "/";
  const normalizedPath =
    pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}`;

  const url = `${SITE_URL}${normalizedPath}`;
  const image = input.image || DEFAULT_IMAGE;

  document.title = input.title;

  upsertMeta(
    'meta[name="description"]',
    "name",
    "description",
    input.description
  );

  upsertMeta(
    'meta[name="robots"]',
    "name",
    "robots",
    input.noIndex
      ? "noindex,follow"
      : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
  );

  upsertMeta(
    'meta[property="og:title"]',
    "property",
    "og:title",
    input.title
  );

  upsertMeta(
    'meta[property="og:description"]',
    "property",
    "og:description",
    input.description
  );

  upsertMeta(
    'meta[property="og:type"]',
    "property",
    "og:type",
    input.type || "website"
  );

  upsertMeta(
    'meta[property="og:url"]',
    "property",
    "og:url",
    url
  );

  upsertMeta(
    'meta[property="og:image"]',
    "property",
    "og:image",
    image
  );

  upsertMeta(
    'meta[property="og:site_name"]',
    "property",
    "og:site_name",
    SITE_NAME
  );

  upsertMeta(
    'meta[name="twitter:card"]',
    "name",
    "twitter:card",
    "summary_large_image"
  );

  upsertMeta(
    'meta[name="twitter:title"]',
    "name",
    "twitter:title",
    input.title
  );

  upsertMeta(
    'meta[name="twitter:description"]',
    "name",
    "twitter:description",
    input.description
  );

  upsertMeta(
    'meta[name="twitter:image"]',
    "name",
    "twitter:image",
    image
  );

  setCanonical(url);

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: "MBK Global",
      url: SITE_URL,
      description: organization.description,
      logo: organization.logo,
      image: organization.image,
      founder: {
        "@id": `${SITE_URL}/#person`,
      },
      knowsAbout: organization.knowsAbout,
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Muhammad Bakhtawar Khan",
      alternateName: [
        "MBK",
        "Bakhtawar Khan",
        "MBK Global",
        "MBK.GLOBAL",
      ],
      url: SITE_URL,
      mainEntityOfPage: {
        "@id": `${SITE_URL}/#website`,
      },
      description:
        "Muhammad Bakhtawar Khan is an entrepreneur and digital technology professional interested in web development, AI, cybersecurity, SEO and digital innovation.",
      knowsAbout: organization.knowsAbout,
      worksFor: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      alternateName: [
        "MBK Global",
        "Muhammad Bakhtawar Khan",
      ],
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-PK",
    },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: input.title,
      description: input.description,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
      about: {
        "@id": `${SITE_URL}/#person`,
      },
      inLanguage: "en-PK",
    },
  ];

  if (pathname !== "/" && !input.noIndex) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: getBreadcrumb(
        normalizedPath,
        input.breadcrumb
      ).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    });
  }

  const routeSchemas: Record<
    string,
    Record<string, unknown>
  > = {
    "/about": {
      "@type": "AboutPage",
      name: "About MBK.GLOBAL",
      mainEntity: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    "/services": {
      "@type": "CollectionPage",
      name: "MBK.GLOBAL Digital Services",
      about: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    "/work": {
      "@type": "CollectionPage",
      name: "MBK.GLOBAL Portfolio",
      about: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
    "/insights": {
      "@type": "Blog",
      name: "MBK.GLOBAL Insights",
      description:
        "Articles and insights about web development, AI, SEO and digital technology.",
    },
    "/contact": {
      "@type": "ContactPage",
      name: "Contact MBK.GLOBAL",
      mainEntity: {
        "@id": `${SITE_URL}/#organization`,
      },
    },
  };

  if (routeSchemas[normalizedPath]) {
    graph.push({
      ...routeSchemas[normalizedPath],
      "@id": `${url}#route`,
      url,
      isPartOf: {
        "@id": `${SITE_URL}/#website`,
      },
    });
  }

  if (input.schema) {
    graph.push(input.schema);
  }

  let script = document.getElementById(
    "mbk-seo-schema"
  ) as HTMLScriptElement | null;

  if (!script) {
    script = document.createElement("script");
    script.id = "mbk-seo-schema";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph,
  });
}

export function useSeo(input: SeoInput) {
  useEffect(() => {
    applySeo(input);
  }, [
    input.title,
    input.description,
    input.pathname,
    input.type,
    input.image,
    input.noIndex,
  ]);
}

export function initializeAnalytics() {
  const gaId = import.meta.env
    .VITE_GA_MEASUREMENT_ID as string | undefined;

  const gtmId = import.meta.env
    .VITE_GTM_ID as string | undefined;

  const googleVerification = import.meta.env
    .VITE_GOOGLE_SITE_VERIFICATION as string | undefined;

  const bingVerification = import.meta.env
    .VITE_BING_SITE_VERIFICATION as string | undefined;

  if (googleVerification) {
    upsertMeta(
      'meta[name="google-site-verification"]',
      "name",
      "google-site-verification",
      googleVerification
    );
  }

  if (bingVerification) {
    upsertMeta(
      'meta[name="msvalidate.01"]',
      "name",
      "msvalidate.01",
      bingVerification
    );
  }

  if (gtmId && !document.getElementById("mbk-gtm")) {
    const script = document.createElement("script");
    script.id = "mbk-gtm";
    script.async = true;
    script.src =
      `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.head.appendChild(script);
  }

  if (gaId && !document.getElementById("mbk-ga")) {
    const script = document.createElement("script");
    script.id = "mbk-ga";
    script.async = true;
    script.src =
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];

    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    };

    window.gtag("js", new Date());
    window.gtag("config", gaId, {
      anonymize_ip: true,
    });
  }
}

declare global {
  interface Window {
    dataLayer: unknown[][];
    gtag: (...args: unknown[]) => void;
  }
}
