import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <main className="min-h-screen bg-navy-dark flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">
          Article Not Found
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This article doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/articles"
          className="inline-block px-8 py-4 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200"
        >
          Browse All Articles
        </Link>
      </div>
    </main>
  );
}
