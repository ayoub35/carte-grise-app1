export type DocumentTypeConfig = {
  id: string;
  name: string;
  category: 'popular' | 'professional' | 'other';
  requiredDocuments: string[];
  description: string;
  hasGovernmentTax: boolean;
  hidden?: boolean;
};

export const DOCUMENT_TYPES: DocumentTypeConfig[] = [
  // Les plus populaires (6)
  {
    id: 'changement_titulaire',
    name: 'Changement de titulaire',
    category: 'popular',
    requiredDocuments: ['ancienne_carte_grise', 'piece_identite', 'permis_conduire', 'justificatif_domicile', 'justificatif_identite_valide', 'certificat_cession', 'attestation_assurance', 'controle_technique'],
    description: 'Vous avez acheté un véhicule d\'occasion. Régularisez la propriété.',
    hasGovernmentTax: true
  },
  {
    id: 'duplicata_carte_grise',
    name: 'Duplicata carte grise',
    category: 'popular',
    requiredDocuments: ['copie_carte_grise_facultative', 'formulaire_immatriculation_duplicata', 'mandat_immatriculation', 'piece_identite', 'justificatif_domicile', 'attestation_assurance', 'permis_conduire', 'declaration_perte_tampon', 'controle_technique'],
    description: 'Carte grise perdue, volée ou abîmée. Demandez un duplicata.',
    hasGovernmentTax: true
  },
  {
    id: 'immatriculation_provisoire',
    name: 'Immatriculation provisoire (WW)',
    category: 'popular',
    requiredDocuments: ['carte_grise_etrangere', 'justificatif_propriete', 'quitus_fiscal_ou_certificat_846a', 'permis_conduire', 'justificatif_domicile', 'justificatif_identite_valide'],
    description: 'Vous avez acheté un véhicule à l\'étranger. Obtenez une immat provisoire (4 mois).',
    hasGovernmentTax: false
  },
  {
    id: 'enregistrement_cession',
    name: 'Enregistrement de cession',
    category: 'popular',
    requiredDocuments: ['piece_identite', 'certificat_immatriculation', 'certificat_cession_rempli'],
    description: 'Vous avez vendu un véhicule. Déclarez la vente.',
    hasGovernmentTax: false
  },
  {
    id: 'changement_adresse_carte_grise',
    name: 'Changement d\'adresse',
    category: 'popular',
    requiredDocuments: ['piece_identite', 'justificatif_domicile', 'certificat_immatriculation'],
    description: 'Vous avez changé d\'adresse. Mettez à jour votre carte grise.',
    hasGovernmentTax: true
  },
  {
    id: 'fiche_identification_vehicule',
    name: 'Fiche d\'identification',
    category: 'popular',
    requiredDocuments: ['certificat_immatriculation', 'piece_identite'],
    description: 'Obtenez une fiche d\'identification de votre véhicule.',
    hasGovernmentTax: false
  },
  
  // Pour les pros de l'auto (3)
  {
    id: 'declaration_achat',
    name: 'Déclaration d\'achat',
    category: 'professional',
    requiredDocuments: ['kbis', 'piece_identite_professionnel', 'certificat_ou_achat_achat_da', 'cerfa_declaration_achat_13751', 'mandat_professionnel'],
    description: 'Professionnel de l\'auto : Déclarez l\'achat d\'un véhicule.',
    hasGovernmentTax: false
  },
  {
    id: 'cession_vehicule_professionnel',
    name: 'Cession de véhicule',
    category: 'professional',
    requiredDocuments: ['kbis', 'piece_identite_professionnel', 'certificat_immatriculation', 'mandat_professionnel'],
    description: 'Professionnel : Vendez ou cédez un véhicule.',
    hasGovernmentTax: false
  },
  {
    id: 'w_garage',
    name: 'W garage',
    category: 'professional',
    requiredDocuments: ['kbis', 'piece_identite_professionnel', 'autorisation_garage', 'mandat_professionnel'],
    description: 'Professionnel : Obtenez ou renouvelez un W garage.',
    hasGovernmentTax: true
  },

  // Autres démarches (14)
  {
    id: 'carte_grise_vehicule_etranger',
    name: 'Carte grise véhicule étranger',
    category: 'other',
    requiredDocuments: ['piece_identite', 'justificatif_domicile', 'certificat_cession', 'certificat_conformite_ou_inspection', 'controle_technique'],
    description: 'Immatriculez un véhicule étranger en France.',
    hasGovernmentTax: true
  },
  {
    id: 'carte_grise_collection',
    name: 'Carte grise collection',
    category: 'other',
    requiredDocuments: ['certificat_immatriculation', 'piece_identite', 'justificatif_domicile', 'justificatif_anciennete'],
    description: 'Immatriculez un véhicule de collection (30+ ans).',
    hasGovernmentTax: true,
    hidden: true
  },
  {
    id: 'ajout_mention_collection',
    name: 'Ajout mention collection',
    category: 'other',
    requiredDocuments: ['certificat_immatriculation', 'piece_identite', 'justificatif_anciennete'],
    description: 'Ajoutez la mention collection à votre véhicule.',
    hasGovernmentTax: true,
    hidden: true
  },
  {
    id: 'succession',
    name: 'Succession',
    category: 'other',
    requiredDocuments: ['piece_identite', 'acte_deces', 'jugement_succession', 'certificat_immatriculation', 'justificatif_domicile'],
    description: 'Procédure de succession pour un véhicule.',
    hasGovernmentTax: true
  },
  {
    id: 'premiere_immatriculation_neuf',
    name: 'Premiere immatriculation véhicule neuf',
    category: 'other',
    requiredDocuments: ['piece_identite', 'justificatif_domicile', 'certificat_conformite', 'facture_achat'],
    description: 'Première immatriculation d\'un véhicule neuf.',
    hasGovernmentTax: true
  },
  {
    id: 'changement_etat_civil',
    name: 'Changement état civil',
    category: 'other',
    requiredDocuments: ['piece_identite', 'certificat_immatriculation', 'acte_changement_etat_civil'],
    description: 'Mariage, PACS, divorce. Mettez à jour votre carte grise.',
    hasGovernmentTax: true
  },
  {
    id: 'changement_caracteristiques_techniques',
    name: 'Changement caractéristiques techniques',
    category: 'other',
    requiredDocuments: ['piece_identite', 'certificat_immatriculation', 'certificat_conformite', 'controle_technique'],
    description: 'Modification des caractéristiques techniques du véhicule.',
    hasGovernmentTax: true
  },
  {
    id: 'changement_raison_sociale',
    name: 'Changement de raison sociale',
    category: 'other',
    requiredDocuments: ['kbis', 'piece_identite_professionnel', 'certificat_immatriculation'],
    description: 'Modification de la raison sociale du propriétaire.',
    hasGovernmentTax: true
  },
  {
    id: 'correction_erreur_carte_grise',
    name: 'Correction erreur carte grise',
    category: 'other',
    requiredDocuments: ['piece_identite', 'certificat_immatriculation', 'justificatif_erreur'],
    description: 'Corrigez une erreur sur votre carte grise.',
    hasGovernmentTax: true
  },
  {
    id: 'ajout_retrait_cotitulaire',
    name: 'Ajout/retrait d\'un cotitulaire',
    category: 'other',
    requiredDocuments: ['piece_identite', 'certificat_immatriculation', 'piece_identite_cotitulaire', 'justificatif_domicile'],
    description: 'Ajoutez ou retirez un cotitulaire.',
    hasGovernmentTax: true
  },
  {
    id: 'lever_immobilisation',
    name: 'Lever d\'immobilisation',
    category: 'other',
    requiredDocuments: ['piece_identite', 'certificat_immatriculation', 'justificatif_levee_immobilisation'],
    description: 'Retirez un marquage d\'immobilisation administrative de votre véhicule.',
    hasGovernmentTax: false
  },
];

export const REQUIRED_DOCUMENTS = {
  // Documents d'identité
  'piece_identite': { 
    label: 'Pièce d\'identité', 
    description: 'Carte nationale d\'identité, passeport ou titre de séjour (format recto-verso)' 
  },
  'piece_identite_professionnel': { 
    label: 'Pièce d\'identité du représentant', 
    description: 'Pièce d\'identité du gérant, président ou représentant légal' 
  },
  'piece_identite_cotitulaire': { 
    label: 'Pièce d\'identité du cotitulaire', 
    description: 'Pièce d\'identité de la personne à ajouter/retirer' 
  },

  // Justificatifs de domicile
  'justificatif_domicile': { 
    label: 'Justificatif de domicile', 
    description: 'Facture EDF/GDF, quittance de loyer, relevé bancaire (moins de 3 mois)' 
  },

  // Documents immatriculation
  'certificat_immatriculation': { 
    label: 'Certificat d\'immatriculation', 
    description: 'Carte grise actuelle (original ou copie)' 
  },
  'certificat_cession': { 
    label: 'Certificat de cession', 
    description: 'Formulaire CERFA 15776 rempli et signé par le vendeur' 
  },
  'certificat_cession_rempli': { 
    label: 'Certificat de cession rempli', 
    description: 'CERFA 15776 complété avec vos coordonnées et signature' 
  },

  // Certificats de conformité
  'certificat_conformite': { 
    label: 'Certificat de conformité (CoC)', 
    description: 'Document du fabricant (véhicule neuf ou importé)' 
  },
  'certificat_conformite_ou_inspection': { 
    label: 'Certificat de conformité ou rapport d\'inspection', 
    description: 'CoC du fabricant OU rapport technique pour véhicule étranger' 
  },

  // Contrôle technique
  'controle_technique': { 
    label: 'Contrôle technique', 
    description: 'Rapport de contrôle technique valide (moins de 6 mois)' 
  },

  // Fiscalité
  'quitus_fiscal': { 
    label: 'Quitus fiscal', 
    description: 'Preuve que le vendeur a payé les taxes (délivré par la préfecture)' 
  },

  // Documents professionnels
  'kbis': { 
    label: 'KBIS', 
    description: 'Extrait Kbis de moins de 3 mois' 
  },
  'mandat_professionnel': { 
    label: 'Mandat du représentant', 
    description: 'Signature et autorisation du gérant ou responsable' 
  },
  'autorisation_garage': { 
    label: 'Autorisation garage (W)', 
    description: 'Document de reconnaissance "W garage"' 
  },

  // Documents administratifs
  'declaration_perte': { 
    label: 'Déclaration de perte/vol', 
    description: 'Déclaration auprès de la gendarmerie ou police' 
  },
  'acte_deces': { 
    label: 'Acte de décès', 
    description: 'Acte d\'état civil du décédé' 
  },
  'jugement_succession': { 
    label: 'Jugement de succession', 
    description: 'Ordonnance de clôture ou jugement d\'homologation' 
  },
  'acte_changement_etat_civil': { 
    label: 'Acte de changement d\'état civil', 
    description: 'Acte de mariage, jugement de divorce, acte de PACS' 
  },
  'justificatif_anciennete': { 
    label: 'Justificatif d\'ancienneté', 
    description: 'Preuve que le véhicule a plus de 30 ans (certificat d\'immatriculation ancien)' 
  },
  'justificatif_erreur': { 
    label: 'Justificatif de l\'erreur', 
    description: 'Document prouvant l\'erreur sur la carte grise' 
  },
  'facture_achat': { 
    label: 'Facture d\'achat', 
    description: 'Facture du concessionnaire ou preuve d\'achat' 
  },
  
  // Documents spécifiques à l'immatriculation provisoire (WW)
  'carte_grise_etrangere': { 
    label: 'Copie de la carte grise étrangère', 
    description: 'Copie du certificat d\'immatriculation ou document équivalent du pays d\'origine' 
  },
  'justificatif_propriete': { 
    label: 'Justificatif de propriété du véhicule', 
    description: 'Facture d\'achat ou certificat de cession' 
  },
  'quitus_fiscal_ou_certificat_846a': { 
    label: 'Quitus fiscal ou certificat 846A', 
    description: 'Quitus fiscal des impôts (UE, ou preuve ANTS de demande de quitus) ou certificat 846A des douanes (hors UE) pour les véhicules importés' 
  },

  // Documents spécifiques au changement de titulaire
  'ancienne_carte_grise': { 
    label: 'Ancienne carte grise', 
    description: 'Copie datée, barrée et signée par le vendeur (format recto-verso)' 
  },
  'permis_conduire': { 
    label: 'Permis de conduire', 
    description: 'Permis de conduire valide en cours de validité' 
  },
  'justificatif_identite_valide': { 
    label: 'Justificatif d\'identité en cours de validité', 
    description: 'Carte nationale d\'identité, passeport ou titre de séjour (ne doit pas être expiré)' 
  },
  'attestation_assurance': { 
    label: 'Attestation d\'assurance', 
    description: 'Preuve d\'assurance du véhicule (attestation fournie par l\'assureur)' 
  },

  // Documents spécifiques au duplicata de carte grise
  'copie_carte_grise_facultative': { 
    label: 'Copie de la carte grise', 
    description: 'Copie de l\'ancienne carte grise (facultatif - peut aider à l\'identification)' 
  },
  'formulaire_immatriculation_duplicata': { 
    label: 'Formulaire de demande d\'immatriculation (Cerfa 13750*05)', 
    description: 'Cerfa n°13750*05 avec case "duplicata" cochée' 
  },
  'mandat_immatriculation': { 
    label: 'Mandat d\'immatriculation (Cerfa 13757*04)', 
    description: 'Cerfa n°13757*04 rempli et signé' 
  },
  'declaration_perte_tampon': { 
    label: 'Déclaration de perte ou de vol (Cerfa 13753*04)', 
    description: 'Cerfa n°13753*04 tamponné par la police ou gendarmerie (en cas de vol/perte)' 
  },
  'justificatif_levee_immobilisation': { 
    label: 'Justificatif de levée d\'immobilisation', 
    description: 'Lettre ou document officiel de l\'administration ou des autorités confirmant la levée de l\'immobilisation' 
  },
  
  // Documents pour Déclaration d'Achat
  'certificat_ou_achat_achat_da': { 
    label: 'Certificat de cession OU Certificat d\'achat', 
    description: 'Soit le CERFA 15776 (certificat de cession) soit le certificat d\'achat du vendeur' 
  },
  'cerfa_declaration_achat_13751': { 
    label: 'CERFA Déclaration d\'achat', 
    description: 'Cerfa n°13751*02 rempli et signé' 
  },
};
