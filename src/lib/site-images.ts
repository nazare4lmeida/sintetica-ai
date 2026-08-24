/**
 * Banco de imagens locais usadas pelos sites gerados.
 * Os arquivos ficam em public/site-images para não depender de um host externo.
 */

const u = (id: string, _width = 1200) => `/site-images/${id}.jpg`;

export interface ImagePack {
  hero: string;
  about: string;
  location: string;
  gallery: string[];
  services: string[];
  avatars: string[];
}

const AVATARS = [
  u("photo-1521737604893-d14cc237f11d", 200),
  u("photo-1522337360788-8b13dee7a37e", 200),
  u("photo-1487958449943-2429e8be8625", 200),
];

export const IMAGE_PACKS: Record<string, ImagePack> = {
  barbearia: {
    hero: u("photo-1503951914875-452162b0f3f1", 1600),
    about: u("photo-1585747860715-2ba37e788b70"),
    location: u("photo-1517248135467-4c7edcad34c4"),
    gallery: [
      u("photo-1503951914875-452162b0f3f1", 800),
      u("photo-1585747860715-2ba37e788b70", 800),
      u("photo-1599351431202-1e0f0137899a", 800),
      u("photo-1621605815971-fbc98d665033", 800),
      u("photo-1493256338651-d82f7acb2b38", 800),
      u("photo-1622286342621-4bd786c2447c", 800),
    ],
    services: [
      u("photo-1503951914875-452162b0f3f1", 600),
      u("photo-1585747860715-2ba37e788b70", 600),
      u("photo-1605497788044-5a32c7078486", 600),
    ],
    avatars: AVATARS,
  },
  restaurante: {
    hero: u("photo-1414235077428-338989a2e8c0", 1600),
    about: u("photo-1552693673-1bf958298935"),
    location: u("photo-1516975080664-ed2fc6a32937"),
    gallery: [
      u("photo-1567521464027-f127ff144326", 800),
      u("photo-1414235077428-338989a2e8c0", 800),
      u("photo-1552693673-1bf958298935", 800),
      u("photo-1516975080664-ed2fc6a32937", 800),
      u("photo-1497215728101-856f4ea42174", 800),
      u("photo-1600880292203-757bb62b4baf", 800),
    ],
    services: [
      u("photo-1567521464027-f127ff144326", 600),
      u("photo-1552693673-1bf958298935", 600),
      u("photo-1516975080664-ed2fc6a32937", 600),
    ],
    avatars: AVATARS,
  },
  beleza: {
    hero: u("photo-1560066984-138dadb4c035", 1600),
    about: u("photo-1522337360788-8b13dee7a37e"),
    location: u("photo-1595476108010-b4d1f102b1b1"),
    gallery: [
      u("photo-1560066984-138dadb4c035", 800),
      u("photo-1595476108010-b4d1f102b1b1", 800),
      u("photo-1522337360788-8b13dee7a37e", 800),
      u("photo-1556909212-d5b604d0c90d", 800),
      u("photo-1521791136064-7986c2920216", 800),
      u("photo-1503951914875-452162b0f3f1", 800),
    ],
    services: [
      u("photo-1560066984-138dadb4c035", 600),
      u("photo-1595476108010-b4d1f102b1b1", 600),
      u("photo-1556909212-d5b604d0c90d", 600),
    ],
    avatars: AVATARS,
  },
  clinica: {
    hero: u("photo-1576091160399-112ba8d25d1d", 1600),
    about: u("photo-1538108149393-fbbd81895907"),
    location: u("photo-1629909613654-28e377c37b09"),
    gallery: [
      u("photo-1576091160399-112ba8d25d1d", 800),
      u("photo-1538108149393-fbbd81895907", 800),
      u("photo-1629909613654-28e377c37b09", 800),
      u("photo-1519415943484-9fa1873496d4", 800),
      u("photo-1512699355324-f07e3106dae5", 800),
      u("photo-1497366216548-37526070297c", 800),
    ],
    services: [
      u("photo-1576091160399-112ba8d25d1d", 600),
      u("photo-1538108149393-fbbd81895907", 600),
      u("photo-1629909613654-28e377c37b09", 600),
    ],
    avatars: AVATARS,
  },
  loja: {
    hero: u("photo-1441986300917-64674bd600d8", 1600),
    about: u("photo-1483985988355-763728e1935b"),
    location: u("photo-1441984904996-e0b6ba687e04"),
    gallery: [
      u("photo-1441986300917-64674bd600d8", 800),
      u("photo-1483985988355-763728e1935b", 800),
      u("photo-1441984904996-e0b6ba687e04", 800),
      u("photo-1452587925148-ce544e77e70d", 800),
      u("photo-1554048612-b6a482bc67e5", 800),
      u("photo-1560472354-b33ff0c44a43", 800),
    ],
    services: [
      u("photo-1441986300917-64674bd600d8", 600),
      u("photo-1483985988355-763728e1935b", 600),
      u("photo-1452587925148-ce544e77e70d", 600),
    ],
    avatars: AVATARS,
  },
  portfolio: {
    hero: u("photo-1452587925148-ce544e77e70d", 1600),
    about: u("photo-1600607687939-ce8a6c25118c"),
    location: u("photo-1497366216548-37526070297c"),
    gallery: [
      u("photo-1452587925148-ce544e77e70d", 800),
      u("photo-1600607687939-ce8a6c25118c", 800),
      u("photo-1600880292203-757bb62b4baf", 800),
      u("photo-1470259078422-826894b933aa", 800),
      u("photo-1519415943484-9fa1873496d4", 800),
      u("photo-1512699355324-f07e3106dae5", 800),
    ],
    services: [
      u("photo-1452587925148-ce544e77e70d", 600),
      u("photo-1600607687939-ce8a6c25118c", 600),
      u("photo-1470259078422-826894b933aa", 600),
    ],
    avatars: AVATARS,
  },
  generico: {
    hero: u("photo-1497366216548-37526070297c", 1600),
    about: u("photo-1497215728101-856f4ea42174"),
    location: u("photo-1560472354-b33ff0c44a43"),
    gallery: [
      u("photo-1497366216548-37526070297c", 800),
      u("photo-1497215728101-856f4ea42174", 800),
      u("photo-1560472354-b33ff0c44a43", 800),
      u("photo-1519415943484-9fa1873496d4", 800),
      u("photo-1512699355324-f07e3106dae5", 800),
      u("photo-1600880292203-757bb62b4baf", 800),
    ],
    services: [
      u("photo-1497366216548-37526070297c", 600),
      u("photo-1497215728101-856f4ea42174", 600),
      u("photo-1519415943484-9fa1873496d4", 600),
    ],
    avatars: AVATARS,
  },
};

export const getPack = (key: string): ImagePack =>
  IMAGE_PACKS[key] ?? (IMAGE_PACKS["generico"] as ImagePack);

/** Todas as imagens disponíveis (usadas pelo seletor visual do editor). */
export const ALL_IMAGES: string[] = Array.from(
  new Set(
    Object.values(IMAGE_PACKS).flatMap((pack) => [
      pack.hero,
      pack.about,
      pack.location,
      ...pack.gallery,
      ...pack.services,
      ...pack.avatars,
    ]),
  ),
);
