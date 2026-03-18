import { lazy, Suspense } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import Layout from './layouts/Layout';

// Lazy load Pages
const Home = lazy(() => import('./pages/Home'));
const Landing = lazy(() => import('./pages/Landing'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const ManualJCalculator = lazy(() => import('./pages/seo/ManualJCalculator'));
const HVACTonnageCalculator = lazy(() => import('./pages/seo/HVACTonnageCalculator'));
const BTUCalculator = lazy(() => import('./pages/seo/BTUCalculator'));
const BlogIndex = lazy(() => import('./pages/blog/BlogIndex'));
const PostWrapper = lazy(() => import('./pages/blog/PostWrapper'));
const HTMLSitemap = lazy(() => import('./pages/seo/HTMLSitemap'));
const NotFound = lazy(() => import('./pages/seo/NotFound'));

// Dynamic Programmatic SEO Pages
const LocationSizing = lazy(() => import('./pages/seo/LocationSizing'));
const BuildingTypeSizing = lazy(() => import('./pages/seo/BuildingTypeSizing'));
const CombinedSizing = lazy(() => import('./pages/seo/CombinedSizing'));
const EquipmentComparison = lazy(() => import('./pages/seo/EquipmentComparison'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-cyan-600 animate-spin"></div>
  </div>
);

const blogPosts = import.meta.glob('./pages/blog/*.mdx');
const lazyPosts = Object.fromEntries(
  Object.entries(blogPosts).map(([path, loader]) => [path, lazy(loader as () => Promise<{ default: React.ComponentType }> )])
);

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
      <p className="text-slate-500 mb-6 font-mono text-sm bg-slate-50 p-4 rounded-lg w-full overflow-auto text-left">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition"
      >
        Try again
      </button>
    </div>
  );
}

function slugToTitle(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function DynamicPost() {
  const { post } = useParams();
  const path = `/blog/${post}`;
  const importPath = `./pages/blog/${post}.mdx`;
  
  // Find the pre-memoized component
  const Content = lazyPosts[importPath];

  if (!Content) return <NotFound />;

  const title = post ? `${slugToTitle(post)} — CoreLoad HVAC` : 'CoreLoad HVAC Blog';

  return (
    <PostWrapper
      title={title}
      description={`In-depth HVAC engineering guide: ${post ? slugToTitle(post) : 'Professional analysis'}.`}
      path={path}
    >
      <Suspense fallback={<PageLoader />}>
        <Content />
      </Suspense>
    </PostWrapper>
  );
}

export default function App() {
  return (
    <Layout>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/manual-j-calculator" element={<ManualJCalculator />} />
            <Route path="/hvac-tonnage-calculator" element={<HVACTonnageCalculator />} />
            <Route path="/btu-calculator" element={<BTUCalculator />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/html-sitemap" element={<HTMLSitemap />} />

            {/* Dynamic Blog Posts Router */}
            <Route path="/blog/:post" element={<DynamicPost />} />

            {/* Programmatic SEO Routes */}
            <Route path="/load-calculation/:state/:city" element={<LocationSizing />} />
            <Route path="/load-calculation/:state/:city/:building" element={<CombinedSizing />} />
            <Route path="/sizing/:building" element={<BuildingTypeSizing />} />
            <Route path="/compare/:comparison" element={<EquipmentComparison />} />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}
