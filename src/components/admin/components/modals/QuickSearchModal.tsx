/**
 * @file QuickSearchModal.tsx
 * @description Komponen Modal Pencarian Cepat SIM Admin (Sama seperti Search pada Navbar Landing Page).
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

interface QuickSearchModalProps {
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function QuickSearchModal({
  isSearchModalOpen,
  setIsSearchModalOpen,
  searchQuery,
  setSearchQuery,
}: QuickSearchModalProps) {
  return (
    <AnimatePresence>
      {isSearchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchModalOpen(false)}
            className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-xs cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] p-3 z-10"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsSearchModalOpen(false);
              }}
              className="flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-[#64748B] ml-3 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari order, user, barang, atau kampus di SIM..."
                className="flex-1 bg-transparent border-none outline-none text-[#0F172A] placeholder-[#64748B] text-xs font-bold py-2.5 px-2"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-full cursor-pointer transition"
                  title="Bersihkan Pencarian"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="bg-[#0F172A] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cari
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
