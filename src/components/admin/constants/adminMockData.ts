/**
 * @file adminMockData.ts
 * @description Konstanta & State Awal Form untuk SIM Admin BaranginAja.
 */

export const MONTH_NAMES = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export const INITIAL_CREATE_USER_FORM = {
  nama_lengkap: '',
  email: '',
  password: '',
  no_hp: '',
  alamat_kos: '',
  kampus_id: '',
  role: 'BUYER' as const,
  status_verifikasi: 'VERIFIED' as const,
  is_seller: false,
  nama_bank: '',
  no_rekening: '',
  nama_pemilik_rekening: '',
};

export const INITIAL_EDIT_USER_FORM = {
  userId: '',
  nama_lengkap: '',
  email: '',
  password: '',
  no_hp: '',
  alamat_kos: '',
  kampus_id: '',
  role: 'BUYER' as const,
  status_verifikasi: 'VERIFIED' as const,
  is_seller: false,
  nama_bank: '',
  no_rekening: '',
  nama_pemilik_rekening: '',
};

export const INITIAL_NEW_CAMPUS_FORM = {
  nama_kampus: '',
  kota: 'Surabaya',
};

export const INITIAL_EDIT_CAMPUS_FORM = {
  id: '',
  nama_kampus: '',
  kota: 'Surabaya',
  aktif: true,
};
