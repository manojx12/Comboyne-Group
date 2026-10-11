/**
 * Photography manifest.
 *
 * All photographs below are TEMPORARY, ILLUSTRATIVE stock images from Unsplash
 * (Unsplash License: free for commercial use, no attribution required, though
 * credit is given). They do not show Comboyne Group facilities, vehicles, staff
 * or completed projects and must never be described as such.
 *
 * Replace each entry with genuine company photography when available; see
 * docs/ASSET-SOURCES.md for the brief, crops and alt-text requirements.
 */
import manifest from '../generated/images.json';

/** A graded photograph and the responsive widths written by scripts/build-images.mjs. */
export interface ImageAsset {
  name: string;
  width: number;
  height: number;
  widths: number[];
}

const asset = (name: keyof typeof manifest): ImageAsset => ({ name, ...manifest[name] });

/** URL of one generated variant, e.g. /img/warehouse-racking-1200.avif */
export const imageUrl = (img: ImageAsset, width: number, format: 'avif' | 'webp' | 'jpg') =>
  `/img/${img.name}-${width}.${format}`;

const heroOfficeWorkstations = asset('hero-office-workstations');
const transportBoxTruck = asset('transport-box-truck');
const warehouseRacking = asset('warehouse-racking');
const officeChairsOnShelving = asset('office-chairs-on-shelving');
const openPlanFitOut = asset('open-plan-fit-out');
const rowsOfChairs = asset('rows-of-chairs');
const chairBaseDetail = asset('chair-base-detail');
const officeDeskRows = asset('office-desk-rows');
const ivecoTruck = asset('iveco-truck');

export interface Photo {
  src: ImageAsset;
  alt: string;
  /** True for stock photography standing in for real company images. */
  illustrative: boolean;
  /** Photographer credit for stock images. */
  credit?: {
    name: string;
    profileUrl: string;
    photoUrl: string;
  };
  /** Where a non-stock photo came from, shown instead of a photographer credit. */
  sourceNote?: string;
}

const unsplash = (name: string, username: string, slug: string) => ({
  name,
  profileUrl: `https://unsplash.com/@${username}`,
  photoUrl: `https://unsplash.com/photos/${slug}`,
});

export const photos = {
  // From the previous Comboyne Group website; identified by the client as a Comboyne Group truck
  // (11 October 2026). Only 800 x 480, the largest version that exists online: show it framed at up to
  // ~720 CSS px, never full-bleed. Replace with a high-resolution original when available.
  ivecoTruck: {
    src: ivecoTruck,
    alt: 'A white IVECO Stralis rigid truck with a box body and a matching trailer, parked on a highway shoulder',
    illustrative: false,
    sourceNote: "Comboyne Group truck. Photo from the company's previous website.",
  },
  heroOfficeWorkstations: {
    src: heroOfficeWorkstations,
    alt: 'Rows of black task chairs at long timber workstations in an open-plan commercial office',
    illustrative: true,
    credit: unsplash('Jose Losada', 'joselosada', 'black-and-brown-chairs-and-tables-DyFjxmHt3Es'),
  },
  transportBoxTruck: {
    src: transportBoxTruck,
    alt: 'A rigid box truck parked against a pale building, photographed in black and white',
    illustrative: true,
    credit: unsplash('Maxim Tolchinskiy', 'shaikhulud', 'white-truck-parked-near-white-building-crHhZlES310'),
  },
  warehouseRacking: {
    src: warehouseRacking,
    alt: 'Tall pallet racking stacked with cartons inside a warehouse with skylights',
    illustrative: true,
    credit: unsplash('Ali Mkumbwa', 'mkumbwajr', 'a-large-stack-of-boxes-in-a-warehouse-DU2ybvshovg'),
  },
  officeChairsOnShelving: {
    src: officeChairsOnShelving,
    alt: 'Office chairs of different styles stored on white shelving',
    illustrative: true,
    credit: unsplash('David Kristianto', 'davidkristianto', 'office-chairs-are-displayed-on-shelving-eV0yG81R3Sc'),
  },
  openPlanFitOut: {
    src: openPlanFitOut,
    alt: 'An open-plan office with rows of white desks, task chairs and frosted glass partitions',
    illustrative: true,
    credit: unsplash('Adolfo Félix', 'adolfofelix', 'office-workspace-with-white-desks-PG8NyM_Mcts'),
  },
  rowsOfChairs: {
    src: rowsOfChairs,
    alt: 'Rows of identical dark moulded chairs arranged in a large room',
    illustrative: true,
    credit: unsplash('Jonas Jacobsson', 'jonasjacobsson', 'black-chair-lot-2xaF4TbjXT0'),
  },
  chairBaseDetail: {
    src: chairBaseDetail,
    alt: 'Low-angle close-up of office chair bases and castors beneath a desk',
    illustrative: true,
    credit: unsplash('dlxmedia.hu', 'dlxmedia', 'chairs-are-lined-up-under-a-desk--sWdHWJYEgA'),
  },
  officeDeskRows: {
    src: officeDeskRows,
    alt: 'An open-plan office with long rows of desks and computers under linear lights',
    illustrative: true,
    credit: unsplash('Petr', 'mpetrucho', 'office-workspace-with-rows-of-desks-Ugnm0F4e00U'),
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;
