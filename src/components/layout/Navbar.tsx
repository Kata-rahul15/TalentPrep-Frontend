import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Benefits', href: '#benefits' },
    { name: 'FAQ', href: '#faq' },
  ]

  const handleLinkClick = (href: string) => {
    setIsOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-border shadow-[0_1px_3px_rgba(0,0,0,0.02)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-10">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-[1.35rem] tracking-tight text-gray-900">
              TalentPrep
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                className="relative font-medium text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors duration-200 py-1 group"
              >
                {link.name}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/login"
              className="font-medium text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="font-semibold text-[13.5px] text-gray-700 hover:text-gray-950 transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-b border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href) }}
                  className="block px-3 py-3 rounded-xl text-[15px] font-semibold text-gray-700 hover:text-primary hover:bg-secondary-bg transition-colors"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 px-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-gray-700 py-3 rounded-xl border border-gray-200 bg-white text-center hover:bg-gray-50 transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="font-semibold text-white py-3 rounded-xl bg-primary hover:bg-primary-hover text-center transition-colors text-sm shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
