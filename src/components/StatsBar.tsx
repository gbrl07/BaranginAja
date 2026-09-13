'use client';

const stats = [
  {
    value: '10.000+',
    label: 'Total Barang',
  },
  {
    value: '15+',
    label: 'Kampus Terintegrasi',
  },
  {
    value: '100%',
    label: 'Bebas Komisi',
  },
  {
    value: '4.9 / 5.0',
    label: 'Kepuasan Pengguna',
  },
];

export default function StatsBar() {
  return (
    <section className="w-[92%] sm:w-auto max-w-5xl mx-auto -mt-9 sm:-mt-11 md:-mt-13 lg:-mt-15 relative z-20 mb-12 sm:mb-16">
      <div 
        className="bg-white rounded-2xl py-6 sm:py-7 px-6 sm:px-8 border border-neutral-100/80"
        style={{ boxShadow: '0 16px 36px -4px rgba(0, 0, 0, 0.1), 0 6px 16px -2px rgba(0, 0, 0, 0.05)' }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-0 lg:divide-x lg:divide-[#EAE7DF]">
          {stats.map((item, index) => (
            <div 
              key={index}
              className={`flex items-center justify-start sm:justify-center gap-3 sm:gap-3.5 ${
                index === 0 ? 'lg:pr-4 xl:pr-6' : index === stats.length - 1 ? 'lg:pl-4 xl:pl-6' : 'lg:px-4 xl:px-6'
              }`}
            >
              {/* Kiri: Angka / Metrik (Warna Cream #7A664D, Tidak Bold) */}
              <span className="text-2xl sm:text-3xl font-medium text-[#7A664D] tracking-tight leading-none shrink-0">
                {item.value}
              </span>

              {/* Kanan: Label / Penjelasan (Warna Cream #7A664D, Tidak Bold) */}
              <div className="text-left text-xs sm:text-[13px] font-normal text-[#7A664D] leading-tight max-w-[115px]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
