import { Helmet } from 'react-helmet-async';
import { SITE_CONFIG } from '../lib/constants';

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface SEOHeadProps {
    title: string;
    description?: string;
    path?: string;
    ogImage?: string;
    breadcrumbs?: BreadcrumbItem[];
}

export default function SEOHead({
    title,
    description = SITE_CONFIG.description,
    path = "/",
    ogImage = `${SITE_CONFIG.domain}${SITE_CONFIG.ogImage}`,
    breadcrumbs
}: SEOHeadProps) {
    // Generate clean canonical URL (strip query params and trailing slashes)
    const cleanPath = path === '/' ? '' : path.replace(/\/$/, '').split('?')[0];
    const url = `${SITE_CONFIG.domain}${cleanPath}`;

    const breadcrumbSchema = breadcrumbs ? JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": crumb.name,
            "item": crumb.url
        }))
    }) : null;

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content={SITE_CONFIG.brand} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Dynamic Breadcrumbs */}
            {breadcrumbSchema && (
                <script type="application/ld+json">{breadcrumbSchema}</script>
            )}
        </Helmet>
    );
}
