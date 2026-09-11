'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  Building2, 
  Search, 
  Compass,
  Loader2,
  HelpCircle
} from 'lucide-react';

export interface LocationData {
  lat: number;
  lng: number;
  alamat_kos: string;
}

const SURABAYA_PRESETS = [
  { nama: 'ITS Sukolilo (Kos Keputih)', lat: -7.282, lng: 112.795, alamat: 'Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya' },
  { nama: 'ITS Gebang Kos Area', lat: -7.284, lng: 112.788, alamat: 'Jl. Gebang Putih No. 45, Sukolilo, Surabaya' },
  { nama: 'UNAIR Kampus C (Mulyorejo)', lat: -7.268, lng: 112.784, alamat: 'Jl. Mulyorejo Indah No. 88, Mulyorejo, Surabaya' },
  { nama: 'UNAIR Kampus B (Gubeng)', lat: -7.272, lng: 112.758, alamat: 'Jl. Dharmawangsa No. 29, Gubeng, Surabaya' },
  { nama: 'UNESA Ketintang (Kos Gayungan)', lat: -7.315, lng: 112.727, alamat: 'Jl. Ketintang Barat No. 14, Gayungan, Surabaya' },
  { nama: 'UPN Veteran (Rungkut)', lat: -7.332, lng: 112.789, alamat: 'Jl. Gunung Anyar Emas No. 3, Rungkut, Surabaya' },
];

export default function MapLocationPickerModal({
  isOpen,
  onClose,
  initialLat,
  initialLng,
  initialAddress,
  onSelectLocation
}: {
  isOpen: boolean;
  onClose: () => void;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onSelectLocation: (data: LocationData) => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [lat, setLat] = useState<number>(initialLat || -7.282);
  const [lng, setLng] = useState<number>(initialLng || 112.795);
  const [address, setAddress] = useState<string>(initialAddress || SURABAYA_PRESETS[0].alamat);
  const [geolocating, setGeolocating] = useState(false);
  const [geoError, setGeoError] = useState('');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialLat) setLat(initialLat);
    if (initialLng) setLng(initialLng);
    if (initialAddress) setAddress(initialAddress);
  }, [initialLat, initialLng, initialAddress]);

  // Fetch address via reverse geocoding
  const fetchAddress = useCallback(async (targetLat: number, targetLng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${targetLat}&lon=${targetLng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          setAddress(data.display_name);
        }
      }
    } catch (e) {
      console.error('Reverse geocoding error:', e);
    }
  }, []);

  // Custom marker pin generator
  const createMarkerIcon = (L: any) => {
    return L.divIcon({
      className: 'custom-leaflet-marker-pin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
          <div style="background-color: #0C1D32; color: #ffffff; font-size: 10px; font-weight: 800; padding: 3px 10px; border-radius: 9999px; box-shadow: 0 4px 12px rgba(0,0,0,0.35); border: 1.5px solid #ffffff; white-space: nowrap; margin-bottom: 2px;">
            📍 Titik Kos Terpilih
          </div>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="#007AAD" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 3px 6px rgba(0,0,0,0.4));">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="#FFFFFF"></circle>
          </svg>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
    });
  };

  // Initialize interactive Leaflet map when modal is open
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    let isCancelled = false;

    // Dynamically load Leaflet on client side
    import('leaflet').then((L) => {
      if (isCancelled || !mapContainerRef.current) return;

      // Clean up previous map instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create new Leaflet Map centered on lat, lng
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
      }).setView([lat, lng], 15);

      mapInstanceRef.current = map;

      // Free OpenStreetMap Tile Layer (Zero API key needed)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);

      // Custom marker pin
      const icon = createMarkerIcon(L);
      const marker = L.marker([lat, lng], { draggable: true, icon }).addTo(map);
      markerRef.current = marker;

      // Click anywhere on interactive map to update marker & coordinates
      map.on('click', (e: any) => {
        const newLat = e.latlng.lat;
        const newLng = e.latlng.lng;
        setLat(newLat);
        setLng(newLng);
        marker.setLatLng([newLat, newLng]);
        fetchAddress(newLat, newLng);
      });

      // Drag marker pin on map
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setLat(position.lat);
        setLng(position.lng);
        fetchAddress(position.lat, position.lng);
      });

      // Fix Leaflet tile rendering inside dynamic modal
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // Update map view & marker position when lat/lng state changes externally
  const updateMapPosition = (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([newLat, newLng], 16, { animate: true, duration: 1 });
      markerRef.current.setLatLng([newLat, newLng]);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Browser Anda tidak mendukung Geolocation API.');
      return;
    }

    setGeolocating(true);
    setGeoError('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        updateMapPosition(userLat, userLng);
        setGeolocating(false);
        fetchAddress(userLat, userLng);
      },
      (err) => {
        setGeolocating(false);
        setGeoError('Gagal mengambil lokasi GPS. Pastikan izin lokasi perangkat diaktifkan.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSearchLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setGeoError('');

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ' Surabaya')}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const resultLat = parseFloat(data[0].lat);
          const resultLng = parseFloat(data[0].lon);
          updateMapPosition(resultLat, resultLng);
          setAddress(data[0].display_name);
        } else {
          setGeoError(`Alamat "${searchQuery}" tidak ditemukan. Coba gunakan nama jalan / daerah lain.`);
        }
      }
    } catch (err) {
      setGeoError('Gagal mencari lokasi. Periksa koneksi internet Anda.');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectPreset = (preset: typeof SURABAYA_PRESETS[0]) => {
    updateMapPosition(preset.lat, preset.lng);
    setAddress(preset.alamat);
  };

  const handleConfirm = () => {
    onSelectLocation({
      lat,
      lng,
      alamat_kos: address
    });
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="map-location-picker-modal-dialog-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0C1D32]/65 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Window */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white border border-[#EAE7DF] rounded-3xl max-w-3xl w-full text-[#0C1D32] relative shadow-2xl overflow-hidden z-10 my-auto max-h-[92vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-5 bg-[#0C1D32] text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#007AAD] text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight uppercase">Peta Interaktif Titik Lokasi Kos</h3>
                  <p className="text-xs text-gray-300">Klik/geser peta &amp; marker untuk menentukan titik GPS presisi tanpa API Key berbayar.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-gray-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
              
              {/* Top Controls: Search Bar & GPS Auto Detect */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search Form */}
                <form onSubmit={handleSearchLocation} className="flex-1 relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3.5 text-gray pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari jalan / nama tempat di Surabaya..."
                    className="w-full pl-10 pr-24 py-2.5 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#007AAD] transition-all"
                  />
                  <button
                    suppressHydrationWarning
                    type="submit"
                    disabled={searching}
                    className="absolute right-1.5 px-3 py-1.5 bg-[#007AAD] hover:bg-[#005C82] text-white text-[11px] font-extrabold uppercase rounded-lg transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1"
                  >
                    {searching ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Cari'}
                  </button>
                </form>

                {/* GPS Auto-Detect Button */}
                <button
                  suppressHydrationWarning
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={geolocating}
                  className="px-4 py-2.5 bg-[#0C1D32] hover:bg-[#007AAD] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Compass className={`w-4 h-4 text-[#007AAD] ${geolocating ? 'animate-spin' : ''}`} />
                  <span>{geolocating ? 'MENDETEKSI GPS...' : 'GPS Saya'}</span>
                </button>

              </div>

              {geoError && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-3 rounded-xl border border-red-200">{geoError}</p>
              )}

              {/* Real Interactive Leaflet Map Container */}
              <div className="relative rounded-2xl overflow-hidden border border-[#EAE7DF] shadow-inner bg-[#E5E3DF] min-h-[300px] h-[340px] w-full">
                
                {/* Leaflet Map Target Div */}
                <div ref={mapContainerRef} className="w-full h-full z-0" />

                {/* Hint banner */}
                <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md border border-[#EAE7DF] px-3 py-1.5 rounded-full shadow-md text-[10px] font-extrabold text-[#0C1D32] flex items-center gap-1.5 pointer-events-none">
                  <HelpCircle className="w-3.5 h-3.5 text-[#007AAD]" />
                  <span>Geser peta / klik untuk geser pin</span>
                </div>

              </div>

              {/* Presets Selection */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#007AAD]" />
                  <span>Pilih Area Kos / Kampus Populer Surabaya:</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {SURABAYA_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        lat === preset.lat && lng === preset.lng
                          ? 'bg-[#007AAD]/10 border-[#007AAD] text-[#007AAD]'
                          : 'bg-[#F5F5F3] hover:bg-[#EFEFEA] border-[#EAE7DF] text-[#0C1D32]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black truncate">{preset.nama}</p>
                        <p className="text-[10px] text-gray truncate">{preset.alamat}</p>
                      </div>
                      {lat === preset.lat && lng === preset.lng && (
                        <CheckCircle2 className="w-4 h-4 text-[#007AAD] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Detailed Address Field */}
              <div>
                <label className="block text-[10px] font-extrabold text-[#0C1D32] uppercase tracking-wider mb-1.5">
                  Alamat Kos Lengkap (Hasil Geocoding Otomatis / Bisa Diubah)
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Contoh: Jl. Keputih Tegal Timur No. 12, Sukolilo, Surabaya (Kos Putra Biru)"
                  className="w-full p-3 bg-[#F5F5F3] hover:bg-[#EFEFEA] focus:bg-white border border-[#EAE7DF] rounded-xl text-xs font-bold text-[#0C1D32] focus:outline-none focus:ring-1 focus:ring-[#0C1D32] transition-all"
                />
              </div>

              {/* Coordinates Display Badge */}
              <div className="p-3 bg-[#0C1D32]/5 border border-[#0C1D32]/10 rounded-xl flex items-center justify-between text-[11px] font-mono text-[#0C1D32]">
                <span>Koordinat Titik GPS Terpilih:</span>
                <span className="font-black text-[#007AAD] bg-white px-2.5 py-1 rounded-lg border border-[#007AAD]/20 shadow-2xs">
                  {lat.toFixed(6)}, {lng.toFixed(6)}
                </span>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 sm:p-5 bg-[#F8F7F3] border-t border-[#EAE7DF] flex items-center justify-end gap-3 shrink-0">
              <button
                suppressHydrationWarning
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-white border border-[#EAE7DF] text-xs font-bold text-gray hover:text-[#0C1D32] rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                suppressHydrationWarning
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 bg-[#007AAD] hover:bg-[#005C82] text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2 shadow-md cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>SIMPAN TITIK LOKASI INI</span>
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
