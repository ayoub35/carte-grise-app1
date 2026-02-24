export function getPricingForDemarche(demarcheId: string, isProfessional: boolean = false): number | null {
  const entry = PRICING_TABLE.find(p => p.id === demarcheId);
  if (!entry) return null;
  
  if (isProfessional) {
    return entry.professionnel;
  }
  return entry.particulier;
}

export function getMinPricingForDemarche(demarcheId: string): number | null {
  const entry = PRICING_TABLE.find(p => p.id === demarcheId);
  if (!entry) return null;
  
  // Return the minimum price between professional and regular
  const prices = [entry.particulier, entry.professionnel].filter(p => p !== null) as number[];
  return prices.length > 0 ? Math.min(...prices) : null;
}

export const PRICING_TABLE = [
  {
    name: "CHANGEMENT TITULAIRE",
    particulier: 29.90,
    professionnel: 29.90,
    id: "changement_titulaire"
  },
  {
    name: "DEMANDE DE DUPLICATA",
    particulier: 29.90,
    professionnel: null,
    id: "duplicata_carte_grise"
  },
  {
    name: "W.W (CERTIFICAT D'IMMATRICULATION PROVISOIRE)",
    particulier: 64.90,
    professionnel: null,
    id: "immatriculation_provisoire"
  },
  {
    name: "CESSION DE VEHICULE",
    particulier: 19.90,
    professionnel: 14.90,
    id: "enregistrement_cession"
  },
  {
    name: "CHANGEMENT D'ADRESSE",
    particulier: 14.90,
    professionnel: null,
    id: "changement_adresse_carte_grise"
  },
  {
    name: "FICHE D'IDENTIFICATION DU VEHICULE",
    particulier: 19.90,
    professionnel: 19.90,
    id: "fiche_identification_vehicule"
  },
  {
    name: "DECLARATION D'ACHAT",
    particulier: null,
    professionnel: 14.90,
    id: "declaration_achat"
  },
  {
    name: "CESSION VEHICULE PROFESSIONNEL",
    particulier: null,
    professionnel: 14.90,
    id: "cession_vehicule_professionnel"
  },
  {
    name: "W GARAGE",
    particulier: null,
    professionnel: 49.90,
    id: "w_garage"
  },
  {
    name: "CTI VOITURE ETRANGER",
    particulier: 79.90,
    professionnel: null,
    id: "carte_grise_vehicule_etranger"
  },
  {
    name: "CARTE GRISE COLLECTION",
    particulier: 49.90,
    professionnel: null,
    id: "carte_grise_collection"
  },
  {
    name: "AJOUT MENTION COLLECTION",
    particulier: 59.90,
    professionnel: null,
    id: "ajout_mention_collection"
  },
  {
    name: "SUCCESSION",
    particulier: 79.90,
    professionnel: null,
    id: "succession"
  },
  {
    name: "PREMIERE IMMATRICULATION NEUF",
    particulier: 79.90,
    professionnel: null,
    id: "premiere_immatriculation_neuf"
  },
  {
    name: "CHANGEMENT DE STATUT MATRIMONIAL",
    particulier: 49.90,
    professionnel: null,
    id: "changement_etat_civil"
  },
  {
    name: "CHANGEMENT DE CARACTERISTIQUES",
    particulier: 49.90,
    professionnel: 49.90,
    id: "changement_caracteristiques_techniques"
  },
  {
    name: "CHANGEMENT RAISON SOCIALE",
    particulier: null,
    professionnel: 44.90,
    id: "changement_raison_sociale"
  },
  {
    name: "AJOUT/RETRAIT COTITULAIRE",
    particulier: 39.90,
    professionnel: null,
    id: "ajout_retrait_cotitulaire"
  },
  {
    name: "FICHE DE LEVER D'IMMOBILISATION",
    particulier: 49.90,
    professionnel: null,
    id: "lever_immobilisation"
  },
  {
    name: "CORRECTION ERREUR CARTE GRISE",
    particulier: 34.90,
    professionnel: null,
    id: "correction_erreur_carte_grise"
  }
];
