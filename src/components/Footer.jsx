import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2.5 text-sm text-slate-500">
          <Logo className="h-6 w-6" />
          <span>&copy; {new Date().getFullYear()} Revisely. Revise smarter, not longer.</span>
        </div>
        <nav className="flex gap-6 text-sm text-slate-500">
          <a href="#" className="transition-colors hover:text-slate-900">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-slate-900">
            Terms
          </a>
          <a href="#" className="transition-colors hover:text-slate-900">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
