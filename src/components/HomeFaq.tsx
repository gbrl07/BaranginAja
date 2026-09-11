'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

const FAQS = [
  {
    question: "Bagaimana cara melakukan transaksi di BaranginAja?",
    answer: "Sangat mudah! Pilih barang yang kamu butuhkan, klik tombol 'Pesan via WhatsApp', lalu kamu akan terhubung langsung dengan Admin operasional BaranginAja. Admin akan memandu konfirmasi pembayaran dan opsi pengiriman/COD."
  },
  {
    question: "Apakah aman jual dan beli barang bekas di sini?",
    answer: "100% Aman! BaranginAja memverifikasi akun penjual berbasis kampus di Surabaya. Dana transaksi ditahan oleh sistem/admin dan baru dicairkan ke penjual setelah pembeli menerima dan mengonfirmasi barang dalam kondisi sesuai deskripsi."
  },
  {
    question: "Bagaimana sistem pengiriman barangnya?",
    answer: "Kamu bisa memilih opsi COD (ketemuan di kampus/sekitar kos) tanpa biaya ongkir, atau menggunakan Kurir Platform BaranginAja yang siap mengantar barang langsung ke alamat kosmu di wilayah Surabaya dengan tarif yang sangat hemat."
  },
  {
    question: "Saya ingin lulus / pindahan kos, gimana cara jualan barang?",
    answer: "Daftar sebagai Penjual dalam 1 menit, unggah foto barang kosmu (kipas, kasur, lemari, buku), tentukan harga input. Sistem kami akan menambahkan markup wajar dan menampilkan barangmu ke ribuan mahasiswa se-Surabaya!"
  }
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-[95%] sm:w-[98%] max-w-[2560px] mx-auto mt-20 mb-12">
      <div className="bg-white rounded-2xl p-6 sm:p-12 border border-gray-100 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Pertanyaan Sering Diajukan
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Masih Punya Pertanyaan?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Segala hal yang perlu kamu ketahui tentang jual beli barang kos di BaranginAja.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  suppressHydrationWarning
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-gray-50/50 transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-gray-900">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 py-4 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-10 pt-8 border-t border-gray-100 text-center flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-xs text-gray-500 font-medium">Butuh bantuan lebih lanjut dari tim kami?</p>
          <a
            href="https://wa.me/6281234567890?text=Halo%20Admin%20BaranginAja,%20saya%20mau%20tanya%20tentang%20layanan"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-[#007AAD] hover:bg-[#005C82] text-white font-bold text-xs rounded-full inline-flex items-center gap-2 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" /> Hubungi Admin via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
