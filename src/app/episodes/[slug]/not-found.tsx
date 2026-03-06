import Link from "next/link";

export default function EpisodeNotFound() {
  return (
    <main className="min-h-screen bg-navy-dark flex items-center justify-center">
      <div className="text-center px-6">
        <div className="text-6xl mb-6">🎙️</div>
        <h1
          className="text-3xl font-bold text-white mb-4"
          style={{ fontFamily: "var(--font-playfair), serif" }}
        >
          Episode Not Found
        </h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          This episode doesn&apos;t exist or hasn&apos;t been published yet.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/episodes"
            className="px-6 py-3 bg-gold hover:bg-gold-light text-navy-dark font-bold rounded-lg transition-all duration-200"
          >
            Browse Episodes
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-navy-light/30 border border-navy-light/30 text-gray-300 font-semibold rounded-lg hover:border-gold/50 transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
