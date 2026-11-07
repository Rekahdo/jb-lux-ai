import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'product' | 'profile';
  slug?: string;
  price?: number;
  currency?: string;
  availability?: 'InStock' | 'PreOrder' | 'OutOfStock';
  category?: string;
  structuredData?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  type = 'website',
  slug,
  price,
  currency = 'NGN',
  availability = 'InStock',
  category,
  structuredData,
}) => {
  const siteName = import.meta.env.VITE_STORE_NAME || 'JB Lux Enterprises';
  const defaultTitle = `${siteName} | Luxury Urban Apparel & Menswear`;
  const defaultDescription =
    'Premium clothing brand offering stylish urban apparel and menswear in wholesale and retail. Gbode Ventures Plaza, Nnamdi Azikiwe St, Lagos Island, Nigeria.';
  const defaultImage = '/src/assets/images/hero_luxury_apparel_1793964581310.jpg';

  const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const metaDescription = description || defaultDescription;
  const ogImage = image || defaultImage;

  // Resolve absolute URL where possible using VITE_APP_URL or window.location.origin
  const currentOrigin =
    import.meta.env.VITE_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : 'https://jbluxenterprises.com');
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const canonicalUrl = `${currentOrigin}${currentPath}${slug ? `#${slug}` : ''}`;
  const absoluteImageUrl = ogImage.startsWith('http') ? ogImage : `${currentOrigin}${ogImage}`;

  // Default JSON-LD Organization & Store schema
  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: 'JB Lux Enterprises',
    image: absoluteImageUrl,
    description: metaDescription,
    url: currentOrigin,
    telephone: '+234 906 124 0069',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Gbode Ventures Plaza, Nnamdi Azikiwe Street',
      addressLocality: 'Lagos Island',
      addressRegion: 'Lagos',
      addressCountry: 'NG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '6.4549',
      longitude: '3.3886',
    },
    priceRange: '₦₦₦',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:30',
      },
    ],
  };

  // Product schema if price/product type
  const productSchema =
    type === 'product' && price
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: title || siteName,
          image: absoluteImageUrl,
          description: metaDescription,
          brand: {
            '@type': 'Brand',
            name: 'JB Lux',
          },
          category: category || 'Apparel & Accessories > Clothing > Men\'s Clothing',
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: currency,
            price: price.toString(),
            availability: `https://schema.org/${availability}`,
            seller: {
              '@type': 'Organization',
              name: 'JB Lux Enterprises',
            },
          },
        }
      : null;

  const activeSchema = structuredData || productSchema || defaultSchema;

  return (
    <Helmet>
      {/* Primary HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={metaDescription} />
      <meta name="robots" content="index, follow" />
      <meta
        name="keywords"
        content="JB Lux, JB Lux Enterprises, Lagos Island clothing, Gbode Ventures Plaza, Nigerian menswear, urban luxury streetwear, Senator suit, Agbada, wholesale fashion Lagos, men fashion Nigeria, Nnamdi Azikiwe street"
      />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:alt" content={fullTitle} />
      <meta property="og:locale" content="en_NG" />

      {/* Product-specific OG tags */}
      {price && <meta property="product:price:amount" content={price.toString()} />}
      {price && <meta property="product:price:currency" content={currency} />}

      {/* Twitter / X Social Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={absoluteImageUrl} />
      <meta name="twitter:image:alt" content={fullTitle} />

      {/* Structured Data (Schema.org JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(activeSchema)}
      </script>
    </Helmet>
  );
};
