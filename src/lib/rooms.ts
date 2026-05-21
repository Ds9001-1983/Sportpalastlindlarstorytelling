// Geteilte Room-Reihenfolge (synchron zu story-spec.json).
// Beat/Subline kommen aus den i18n-Messages (hero.rooms.<id>).

export interface RoomConfig {
  id: string;
  assetId: string;
  heightVh: number;
  tint: string; // Platzhalter-Tönung bis echte Frames existieren
}

export const ROOMS: RoomConfig[] = [
  { id: 'ankunft', assetId: 'seq_ankunft', heightVh: 300, tint: '#15171c' },
  { id: 'entschluss', assetId: 'seq_entschluss', heightVh: 250, tint: '#181614' },
  { id: 'kraft_egym', assetId: 'seq_kraft_egym', heightVh: 250, tint: '#1c1512' },
  { id: 'kurse_energie', assetId: 'seq_kurse_energie', heightVh: 250, tint: '#1a1714' },
  { id: 'functional', assetId: 'seq_functional', heightVh: 250, tint: '#1d1410' },
  { id: 'regeneration', assetId: 'seq_regeneration', heightVh: 250, tint: '#161a18' },
  { id: 'verwandlung', assetId: 'seq_verwandlung', heightVh: 300, tint: '#20180f' },
  { id: 'ankunft_ziel', assetId: 'seq_ankunft_ziel', heightVh: 300, tint: '#1c1a14' },
];
