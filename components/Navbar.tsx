import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold hover:text-blue-100 transition-colors">
            Medical Card Eligibility
          </Link>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-blue-100 transition-colors">
              Home
            </Link>
            <Link href="/admin/login" className="hover:text-blue-100 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
