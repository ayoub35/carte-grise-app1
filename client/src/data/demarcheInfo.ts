export const demarcheInfo = {
  changement_titulaire: {
    explanation: "Vous avez acheté un véhicule d'occasion ? Cette démarche vous permet de devenir propriétaire officiel du véhicule auprès de l'ANTS. Elle est obligatoire pour éviter les amendes et vous protéger légalement.",
    details: [
      "Changez le titulaire de la carte grise après un achat",
      "Obligatoire pour tout achat de véhicule d'occasion",
      "Délai: 1 mois après l'achat",
      "Coût: 30€ (ou 19.50€ pour un professionnel)",
      "Certificat d'immatriculation prérempli et signé automatiquement"
    ],
    cerfas: [
      {
        name: "Formulaire de demande",
        cerfa: "Cerfa 13750*05",
        url: "https://www.ants.gouv.fr/"
      },
      {
        name: "Mandat d'immatriculation",
        cerfa: "Cerfa 13757*04",
        url: "https://www.ants.gouv.fr/"
      }
    ],
    faq: [
      {
        question: "Quel est le délai pour faire le changement de titulaire?",
        answer: "Vous devez effectuer cette démarche dans le mois suivant l'achat du véhicule. Passé ce délai, vous risquez une amende."
      },
      {
        question: "Puis-je conduire avant de changer le titulaire?",
        answer: "Non, vous devez avoir terminé cette démarche avant de circuler avec le véhicule."
      },
      {
        question: "L'ancienne carte grise doit-elle être barrée?",
        answer: "Oui, le vendeur doit dater, barrer et signer l'ancienne carte grise (les deux pages). C'est obligatoire pour la validité du transfert."
      },
      {
        question: "Le contrôle technique est-il obligatoire pour tous les véhicules?",
        answer: "Non, seulement pour les voitures de plus de 4 ans et les motos de plus de 5 ans. Le contrôle doit dater de moins de 6 mois."
      },
      {
        question: "Que faire si je ne retrouve pas tous les documents?",
        answer: "Contactez-nous via WhatsApp ou téléphone. Nous pouvons vous aider à obtenir les documents manquants."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  duplicata_carte_grise: {
    explanation: "Votre carte grise est perdue, volée ou endommagée? Demandez un duplicata (copie officielle) auprès de l'ANTS pour continuer à circuler légalement.",
    details: [
      "Valide immédiatement pour circuler",
      "Procédure simplifiée et rapide",
      "Cerfas préremplis et signés automatiquement",
      "Coût: 30€ (ou 19.50€ pour un professionnel)"
    ],
    cerfas: [
      {
        name: "Formulaire duplicata",
        cerfa: "Cerfa 13750*05",
        url: "https://www.ants.gouv.fr/"
      },
      {
        name: "Mandat d'immatriculation",
        cerfa: "Cerfa 13757*04",
        url: "https://www.ants.gouv.fr/"
      },
      {
        name: "Déclaration perte/vol",
        cerfa: "Cerfa 13753*04",
        url: "https://www.ants.gouv.fr/"
      }
    ],
    faq: [
      {
        question: "Combien de temps faut-il pour recevoir le duplicata?",
        answer: "Comptez environ 1-2 semaines. Avec l'option express, vous le recevez en 24h (+5€)."
      },
      {
        question: "Puis-je circuler pendant la demande?",
        answer: "Oui, dès validation de votre demande, vous recevez un justificatif temporaire permettant la circulation."
      },
      {
        question: "La copie de l'ancienne carte grise est-elle obligatoire?",
        answer: "Non, c'est facultatif. Elle aide à l'identification du véhicule mais n'est pas requise si vous l'avez perdue."
      },
      {
        question: "Quand faut-il fournir la déclaration de perte/vol?",
        answer: "Elle est obligatoire uniquement en cas de vol ou de perte déclarée à la police. Elle doit être tamponnée par la police ou gendarmerie."
      },
      {
        question: "Le contrôle technique est-il obligatoire?",
        answer: "Non, sauf pour les voitures de plus de 4 ans et les motos de plus de 5 ans. Le contrôle doit dater de moins de 6 mois."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  immatriculation_provisoire: {
    explanation: "Vous avez acheté un véhicule à l'étranger? L'immatriculation provisoire (plaques WW) vous permet de circuler en France pendant 4 mois pour faire les contrôles techniques et immatriculer le véhicule.",
    details: [
      "Valide 4 mois en France",
      "Permet la mise en conformité du véhicule",
      "Obligation avant l'immatriculation définitive",
      "Coût: 30€ (ou 19.50€ pour un professionnel)"
    ],
    faq: [
      {
        question: "Puis-je circuler dans toute l'Europe avec les plaques WW?",
        answer: "Non, les plaques WW (immatriculation provisoire) sont valides uniquement en France."
      },
      {
        question: "Que se passe-t-il après 4 mois?",
        answer: "Vous devez faire immatriculer le véhicule en carte grise française définitive."
      },
      {
        question: "Le contrôle technique est-il obligatoire?",
        answer: "Oui, pour tout véhicule étranger immatriculé en France, le contrôle technique est obligatoire."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  enregistrement_cession: {
    explanation: "Vous avez vendu votre véhicule? Cette démarche déclare la vente et vous dégage de toute responsabilité. Elle est gratuite mais obligatoire.",
    details: [
      "Déclarez la vente à l'État",
      "Libère l'ancien propriétaire de responsabilité",
      "Gratuit (frais de service: 30€)",
      "À faire dans le mois de la vente"
    ],
    cerfas: [
      {
        name: "Certificat de cession d'un véhicule d'occasion",
        cerfa: "Cerfa 15776*02",
        downloadId: "cerfa15776"
      }
    ],
    faq: [
      {
        question: "Que se passe-t-il si je ne déclare pas la vente?",
        answer: "Vous restez responsable légalement du véhicule (amendes, accidents, etc.). C'est risqué!"
      },
      {
        question: "Puis-je déclarer la vente après le délai d'un mois?",
        answer: "Oui, mais en retard. Vous restez responsable pendant ce temps. Déclarez dès que possible."
      },
      {
        question: "Le gouvernement taxe cette démarche?",
        answer: "Non, c'est une déclaration administrative gratuite. Vous ne payez que nos frais de service."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  changement_adresse_carte_grise: {
    explanation: "Vous avez déménagé? Mettez à jour l'adresse sur votre carte grise. Cette démarche est obligatoire et gratuite.",
    details: [
      "Mise à jour rapide de l'adresse",
      "Gratuit (frais de service: 30€)",
      "À faire avant de circuler à la nouvelle adresse",
      "Validation en quelques jours"
    ],
    faq: [
      {
        question: "Combien de temps ai-je pour déclarer mon déménagement?",
        answer: "Vous avez 1 mois après votre déménagement pour faire cette démarche."
      },
      {
        question: "Puis-je circuler avec une ancienne adresse?",
        answer: "Techniquement oui, mais en cas d'amende ou accident, l'ancienne adresse peut causer des problèmes."
      },
      {
        question: "Le gouvernement taxe cette démarche?",
        answer: "Non, c'est gratuit auprès de l'État. Vous ne payez que nos frais de service."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  fiche_identification_vehicule: {
    explanation: "Besoin d'une preuve d'identification officielle de votre véhicule? La fiche d'identification est un document officiel qui certifie votre propriété.",
    details: [
      "Document officiel d'identification du véhicule",
      "Gratuit auprès de l'État (frais de service: 30€)",
      "Valide légalement",
      "Reçu en quelques jours"
    ],
    faq: [
      {
        question: "À quoi sert la fiche d'identification?",
        answer: "C'est une preuve officielle de propriété et d'identification du véhicule, utile pour les démarches administratives."
      },
      {
        question: "Est-ce la même chose que la carte grise?",
        answer: "Non, c'est un document distinct mais tout aussi officiel."
      },
      {
        question: "Combien coûte cette démarche?",
        answer: "Le gouvernement ne taxe pas cette démarche. Vous ne payez que nos frais de service (30€)."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  declaration_achat: {
    explanation: "Professionnel de l'automobile? Déclarez l'achat de véhicules auprès du gouvernement. Démarche spécifique aux professionnels.",
    details: [
      "Obligatoire pour les professionnels",
      "Chaque achat doit être déclaré",
      "Traçabilité administrative",
      "Frais de service: 30€ (19.50€ pour vous)"
    ],
    cerfas: [
      {
        name: "Déclaration d'achat d'un véhicule d'occasion",
        cerfa: "Cerfa 13751*02",
        downloadId: "cerfa13751"
      }
    ],
    faq: [
      {
        question: "Suis-je obligé de déclarer chaque achat?",
        answer: "Oui, chaque achat de véhicule doit être déclaré auprès de l'administration."
      },
      {
        question: "Quel délai pour déclarer?",
        answer: "La déclaration doit être faite rapidement après l'achat, généralement avant la revente."
      },
      {
        question: "Quel est le coût?",
        answer: "Aucune taxe gouvernementale. Vous payez uniquement 19.50€ de frais de service (tarif professionnel)."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  cession_vehicule_professionnel: {
    explanation: "Professionnel? Déclarez la vente ou cession d'un véhicule auprès de l'administration. Démarche simplifiée pour les pros.",
    details: [
      "Déclarez la cession de véhicule",
      "Obligatoire pour les professionnels",
      "Gratuit auprès de l'État",
      "Frais de service: 19.50€ (tarif professionnel)"
    ],
    faq: [
      {
        question: "Dois-je déclarer chaque vente?",
        answer: "Oui, pour rester conforme à la réglementation."
      },
      {
        question: "Quel délai?",
        answer: "Faites la déclaration rapidement après la cession."
      },
      {
        question: "Le gouvernement taxe cette démarche?",
        answer: "Non, c'est gratuit. Vous payez seulement 19.50€ de frais de service."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  w_garage: {
    explanation: "Professionnel de l'automobile? Obtenez ou renouvelez votre autorisation 'W garage' pour pouvoir vendre des véhicules en France.",
    details: [
      "Autorisation officielle pour les pros de l'auto",
      "Obligatoire pour vendre des véhicules",
      "Renouvellement régulier nécessaire",
      "Coût gouvernemental: environ 150€-300€ + frais de service 19.50€"
    ],
    faq: [
      {
        question: "Suis-je obligé d'avoir un W garage?",
        answer: "Oui, si vous êtes professionnel et que vous vendez des véhicules."
      },
      {
        question: "Quelle est la durée de validité?",
        answer: "Généralement 3 à 5 ans selon les conditions. Vous devrez le renouveler régulièrement."
      },
      {
        question: "Quel est le coût total?",
        answer: "Le gouvernement taxe cette démarche (150€-300€). Vous payez aussi 19.50€ de frais de service."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  carte_grise_vehicule_etranger: {
    explanation: "Vous avez acheté un véhicule d'origine étrangère? Cette démarche vous permet de l'immatriculer et d'obtenir une carte grise française.",
    details: [
      "Immatriculation d'un véhicule étranger",
      "Conformité française obligatoire",
      "Contrôle technique requis",
      "Coût gouvernemental: environ 200€-400€ + frais de service 30€"
    ],
    documentsRequired: [
      "Carte grise étrangère (recto/verso)",
      "Certificat de conformité européen (recto/verso)",
      "Demande d'immatriculation et mandat (générés automatiquement et déjà complétés lors de votre commande)",
      "Facture d'achat ou certificat de cession du véhicule",
      "Permis de conduire (recto/verso)",
      "Justificatif de domicile datant de moins de 6 mois",
      "Pièce d'identité valide (recto/verso)",
      "Attestation d'assurance du véhicule",
      "Contrôle technique de moins de 6 mois, réalisé dans un pays de l'Union européenne",
      "Quitus fiscal ou certificat 846A pour les véhicules provenant d'un pays hors UE"
    ],
    faq: [
      {
        question: "Quels documents du pays d'origine ai-je besoin?",
        answer: "Le certificat de conformité CoC (Certificate of Conformity) du fabricant, ou un rapport d'inspection si indisponible."
      },
      {
        question: "Puis-je utiliser la carte grise étrangère en France?",
        answer: "Non, vous devez l'immatriculer en France avant de circuler régulièrement."
      },
      {
        question: "Le contrôle technique est obligatoire?",
        answer: "Oui, pour vérifier la conformité du véhicule aux normes françaises."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  carte_grise_collection: {
    explanation: "Vous possédez un véhicule ancien (30+ ans)? Cette démarche spéciale vous permet de l'immatriculer en tant que véhicule de collection avec avantages fiscaux.",
    details: [
      "Pour véhicules de 30+ ans",
      "Avantages fiscaux et d'assurance",
      "Coût réduit (environ 100€-150€)",
      "Frais de service: 30€"
    ],
    documentsRequired: [
      "Carte grise originale barrée et signée",
      "Formulaires d'immatriculation et mandat (préremplis après votre commande)",
      "Certificat de cession (+ récépissé d'achat si garage)",
      "Permis de conduire (recto/verso)",
      "Pièce d'identité valide (recto/verso)",
      "Justificatif de domicile datant de moins de 6 mois",
      "Attestation d'assurance du véhicule",
      "Contrôle technique de moins de 6 mois",
      "Attestation FFVE (datation et caractéristiques du véhicule)",
      "Preuve de propriété si pas de carte grise: facture d'achat, déclaration de cession ou testament"
    ],
    faq: [
      {
        question: "Pourquoi un régime spécial pour les anciennes voitures?",
        answer: "Les véhicules de collection bénéficient d'avantages fiscaux et d'assurance spéciale pour leur préservation."
      },
      {
        question: "Quel âge minimum pour être collection?",
        answer: "Le véhicule doit avoir au minimum 30 ans."
      },
      {
        question: "Quels sont les avantages?",
        answer: "Taxation réduite, assurance spécialisée, et reconnaissance officielle du statut de collection."
      },
      {
        question: "Que faire si je n'ai pas de carte grise?",
        answer: "C'est fréquent pour les véhicules importés ou immobilisés longtemps. Vous devez fournir une preuve de propriété conforme: facture d'achat, déclaration de cession, ou testament. Si aucun document n'existe, la possession peut valoir titre selon l'article 2276 du Code civil."
      },
      {
        question: "L'attestation FFVE est-elle obligatoire?",
        answer: "Elle est obligatoire si elle date d'avant 2017, sinon elle est fortement recommandée pour prouver l'authenticité et les caractéristiques de votre véhicule de collection."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  ajout_mention_collection: {
    explanation: "Vous avez un véhicule ancien et souhaitez ajouter la mention 'collection'? Cette démarche ajoute la mention collection à une carte grise existante.",
    details: [
      "Ajout de la mention collection existante",
      "Même avantages que carte grise collection",
      "Procédure simplifiée",
      "Coût: environ 50€-100€ + frais de service 30€"
    ],
    documentsRequired: [
      "Carte grise actuelle ou déclaration de perte/vol (Cerfa 13753)",
      "Permis de conduire (recto/verso)",
      "Justificatif de domicile datant de moins de 6 mois",
      "Formulaires d'immatriculation et mandat (générés automatiquement après votre commande)",
      "Pièce d'identité valide (recto/verso)",
      "Attestation d'assurance du véhicule",
      "Contrôle technique en cours de validité",
      "Attestation FFVE"
    ],
    faq: [
      {
        question: "Puis-je ajouter la mention collection après coup?",
        answer: "Oui, si votre véhicule est éligible (30+ ans)."
      },
      {
        question: "Est-ce plus rapide que refaire une nouvelle carte grise?",
        answer: "Oui, c'est une procédure simplifiée et plus rapide."
      },
      {
        question: "Les avantages sont identiques?",
        answer: "Oui, vous bénéficiez des mêmes avantages qu'avec une carte grise collection complète."
      },
      {
        question: "Que faire si j'ai perdu ma carte grise?",
        answer: "Vous devez fournir une déclaration de perte/vol (Cerfa 13753) à la place de la carte grise originale."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  succession: {
    explanation: "Vous avez hérité d'un véhicule? Cette démarche change le propriétaire du véhicule suite à un décès et transfère la propriété à l'héritier. Vous disposez d'un délai de 3 mois après le décès pour mettre la carte grise à votre nom.",
    details: [
      "Succession d'un véhicule",
      "Transfert légal de propriété",
      "Délai: 3 mois maximum après le décès",
      "Coût: environ 150€-250€ + frais de service 30€"
    ],
    documentsAvecNotaire: [
      "Carte grise originale barrée",
      "Demande de certificat d'immatriculation (Cerfa rempli automatiquement)",
      "Copie du permis de conduire du futur titulaire",
      "Attestation d'assurance du véhicule",
      "Justificatif d'identité",
      "Justificatif de domicile de moins de 6 mois",
      "Contrôle technique valide (véhicules de plus de 4 ans)",
      "Attestation du notaire chargé de la succession OU acte de notoriété",
      "Si plusieurs héritiers: document notarial d'accord OU lettres de renonciation",
      "Si vente plus de 3 mois après décès: attestation sur l'honneur de non-circulation",
      "Si tierce personne: procuration signée + pièce d'identité de l'héritier"
    ],
    documentsSansNotaire: [
      "Copie de l'acte de décès",
      "Attestation conjointe de tous les héritiers confirmant: absence de testament, absence d'autres héritiers, absence de contrat de mariage, absence de litige",
      "Carte grise originale barrée",
      "Demande de certificat d'immatriculation (Cerfa rempli automatiquement)",
      "Copie du permis de conduire",
      "Attestation d'assurance du véhicule",
      "Justificatif d'identité",
      "Justificatif de domicile de moins de 6 mois",
      "Contrôle technique valide (véhicules de plus de 4 ans)",
      "Si cohéritiers: lettre de désistement au profit de l'héritier demandeur",
      "Si vente plus de 3 mois après décès: attestation sur l'honneur de non-circulation"
    ],
    faq: [
      {
        question: "Quel est le délai pour immatriculer un véhicule hérité?",
        answer: "Vous disposez d'un délai maximal de 3 mois après le décès pour mettre la carte grise à votre nom."
      },
      {
        question: "Puis-je conduire le véhicule avant la succession?",
        answer: "Non, vous devez avoir légalement les droits de propriété et la carte grise à votre nom."
      },
      {
        question: "Dois-je passer par un notaire?",
        answer: "Pas obligatoirement. Pour les successions simples sans testament ni litige, une attestation conjointe des héritiers suffit."
      },
      {
        question: "Que faire si je vends le véhicule hérité?",
        answer: "Tous les documents relatifs à la succession doivent être remis à l'acquéreur. Si la vente a lieu plus de 3 mois après le décès, une attestation sur l'honneur de non-circulation est requise."
      },
      {
        question: "Combien de temps pour finaliser?",
        answer: "Généralement 2-4 semaines après soumission des documents complets."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  premiere_immatriculation_neuf: {
    explanation: "Vous venez d'acheter un véhicule neuf? Cette démarche effectue la première immatriculation et crée votre carte grise.",
    details: [
      "Première immatriculation d'un neuf",
      "Création de la carte grise",
      "Certificat de conformité requis",
      "Coût: environ 200€-350€ + frais de service 30€"
    ],
    documentsRequired: [
      "Pièce d'identité valide (recto/verso)",
      "Permis de conduire correspondant à la catégorie du véhicule",
      "Justificatif de domicile datant de moins de 6 mois",
      "Cerfa 13749 (formulaire '3 en 1') ou en remplacement: Cerfa 13750*05 + facture d'achat/certificat de cession + certificat de conformité européen (recto/verso) + quitus fiscal ou certificat 846A",
      "Mandat d'immatriculation (généré automatiquement après votre commande)",
      "Justificatif d'assurance du véhicule"
    ],
    faq: [
      {
        question: "Dois-je faire cette démarche avant de circuler?",
        answer: "Non, vous recevez une plaque d'essai du concessionnaire. Mais l'immatriculation définitive est obligatoire rapidement."
      },
      {
        question: "Qui fournit le certificat de conformité?",
        answer: "Le fabricant ou le concessionnaire vous le fournit avec le véhicule."
      },
      {
        question: "Combien de temps pour recevoir la carte grise?",
        answer: "Comptez 1-2 semaines. Avec l'option express: 24h (+5€)."
      },
      {
        question: "Que faire si je n'ai pas le Cerfa 13749?",
        answer: "Vous pouvez fournir les documents séparés en remplacement: Cerfa 13750*05, facture d'achat, certificat de conformité européen, et quitus fiscal ou certificat 846A."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  changement_etat_civil: {
    explanation: "Suite à un mariage, PACS ou divorce? Vous devez mettre à jour votre nom sur la carte grise du véhicule.",
    details: [
      "Mise à jour suite à mariage/PACS/divorce",
      "Obligatoire pour la validité de la carte grise",
      "Procédure rapide",
      "Coût gouvernemental: gratuit + frais de service 30€"
    ],
    documentsRequired: [
      "Ancien certificat d'immatriculation (carte grise)",
      "Formulaires d'immatriculation et mandat (générés automatiquement et préremplis après votre commande)",
      "Permis de conduire (recto/verso)",
      "Justificatif de domicile datant de moins de 6 mois",
      "Pièce d'identité valide (recto/verso)",
      "Attestation d'assurance du véhicule",
      "Document officiel prouvant le changement d'état civil parmi les suivants:",
      "  • Acte de mariage (original ou copie certifiée)",
      "  • Convention de PACS (original ou copie certifiée)",
      "  • Jugement de divorce ou convention de partage (original ou copie certifiée)",
      "  • Acte de décès du conjoint (pour veuvage)",
      "  • Acte de naissance mis à jour (pour changement de nom)",
      "  • Jugement du tribunal (pour changement d'état civil)",
      "  • Acte d'état civil rectifié délivré par le service d'état civil compétent"
    ],
    faq: [
      {
        question: "Quel document civil ai-je besoin?",
        answer: "L'acte de mariage, de PACS ou le jugement de divorce."
      },
      {
        question: "Puis-je circuler avec l'ancienne carte grise?",
        answer: "Techniquement oui, mais changez rapidement. Cela peut poser des problèmes en cas d'accident ou amende."
      },
      {
        question: "Combien de temps pour finaliser?",
        answer: "Généralement 1-2 semaines."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  changement_caracteristiques_techniques: {
    explanation: "Vous avez modifié votre véhicule (couleur, moteur, pneus spécialisés)? Signalez les changements techniques à l'État.",
    details: [
      "Déclaration des modifications techniques",
      "Contrôle technique requis",
      "Mise à jour obligatoire",
      "Coût: environ 100€-200€ + frais de service 30€"
    ],
    documentsRequired: [
      "Formulaire de demande de certificat d'immatriculation (Cerfa 13750*05) signé",
      "Mandat d'immatriculation (Cerfa 13757*03) signé",
      "Copie recto/verso d'une pièce d'identité en cours de validité",
      "Copie recto/verso du permis de conduire correspondant au véhicule",
      "Un justificatif de domicile moins de 6 mois",
      "Attestation d'assurance valable à la date de la demande",
      "Contrôle technique en cours de validité (pour les véhicules de plus de 4 ans)",
      "Certificat de conformité mentionnant la ou les modifications techniques à enregistrer",
      "Attestation d'installation d'un kit de conversion E85 (si conversion bioéthanol)",
      "Procès-verbal d'agrément du dispositif de conversion E85 (si conversion bioéthanol)"
    ],
    faq: [
      {
        question: "Quelles modifications doivent être déclarées?",
        answer: "Les changements significatifs: moteur, suspension, couleur, pneus spécialisés, toit, etc."
      },
      {
        question: "Puis-je circuler avant la déclaration?",
        answer: "Non, les modifications doivent être déclarées légalement avant utilisation."
      },
      {
        question: "Un contrôle technique est obligatoire?",
        answer: "Oui, pour certaines modifications, afin de vérifier la conformité."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  changement_raison_sociale: {
    explanation: "Votre entreprise a changé de nom? Mettez à jour le nom de votre entreprise sur la carte grise du véhicule professionnel.",
    details: [
      "Mise à jour du nom de l'entreprise",
      "Pour véhicules professionnels",
      "Procédure administrative",
      "Coût: gratuit auprès de l'État + frais de service 30€"
    ],
    faq: [
      {
        question: "Dois-je avoir le K-BIS à jour?",
        answer: "Oui, un K-BIS de moins de 3 mois prouvant le changement de raison sociale."
      },
      {
        question: "Combien de temps pour la mise à jour?",
        answer: "Généralement 1-2 semaines."
      },
      {
        question: "Est-ce obligatoire?",
        answer: "Oui, la carte grise doit correspondre à la raison sociale actuelle de votre entreprise."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  correction_erreur_carte_grise: {
    explanation: "Votre carte grise contient une erreur (nom, modèle, couleur)? Faites corriger l'erreur auprès de l'administration.",
    details: [
      "Correction d'erreurs administratives",
      "Doit être prouvée par un justificatif",
      "Procédure rapide",
      "Coût: gratuit auprès de l'État + frais de service 30€"
    ],
    faq: [
      {
        question: "Que considère-t-on comme une erreur?",
        answer: "Erreurs de nom, modèle du véhicule, couleur, numéro VIN, etc."
      },
      {
        question: "Comment prouver l'erreur?",
        answer: "Vous avez besoin d'un document officiels prouvant l'erreur (certificat de conformité, facture d'achat, etc.)."
      },
      {
        question: "Combien de temps pour corriger?",
        answer: "Généralement 1-2 semaines après validation."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  ajout_retrait_cotitulaire: {
    explanation: "Vous voulez ajouter ou retirer un co-propriétaire sur votre véhicule? Cette démarche change les droits de propriété du véhicule.",
    details: [
      "Ajout ou retrait d'un co-titulaire",
      "Changement des droits de propriété",
      "Consentement du co-titulaire requis",
      "Coût: environ 50€-100€ + frais de service 30€"
    ],
    documentsRequired: [
      "Carte grise actuelle",
      "Demande d'immatriculation + mandat (préremplis après votre commande)",
      "Pièce d'identité du titulaire (recto/verso)",
      "Pièce d'identité du cotitulaire (recto/verso)",
      "Permis de conduire du titulaire",
      "Justificatif de domicile datant de moins de 6 mois",
      "Attestation d'assurance du véhicule",
      "Contrôle technique valide (si applicable)",
      "Certificat de cession signé par tous les cotitulaires (pour retrait ou changement de titulaire)"
    ],
    faq: [
      {
        question: "Le co-titulaire doit-il consentir?",
        answer: "Oui, son consentement écrit et signé est obligatoire."
      },
      {
        question: "Puis-je retirer quelqu'un sans son accord?",
        answer: "Non, il faut son consentement. Vous devez vous adresser à un tribunal en cas de désaccord."
      },
      {
        question: "Combien coûte l'ajout/retrait?",
        answer: "Environ 50€-100€ auprès de l'État, plus 30€ de frais de service."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  },
  lever_immobilisation: {
    explanation: "Votre véhicule est marqué comme immobilisé administrativement? Cette démarche retire le marquage d'immobilisation suite à la résolution de la situation (paiement de dettes, amendes, etc.).",
    details: [
      "Levée d'immobilisation administrative",
      "Permet la circulation libre du véhicule",
      "Après paiement des dettes ou amendes",
      "Coût: 39.90€"
    ],
    faq: [
      {
        question: "Pourquoi un véhicule est-il immobilisé?",
        answer: "Un véhicule peut être immobilisé en raison de dettes fiscales, amendes non payées, défaut d'assurance ou autres raisons administratives."
      },
      {
        question: "Puis-je conduire un véhicule immobilisé?",
        answer: "Non, circuler avec un véhicule immobilisé est illégal et peut entraîner une amende et une mise en fourrière."
      },
      {
        question: "Comment obtenir la levée d'immobilisation?",
        answer: "Vous devez d'abord résoudre la situation qui a causé l'immobilisation (payer les dettes/amendes), puis faire la demande officielle de levée."
      },
      {
        question: "Quel document faut-il pour prouver la levée?",
        answer: "Vous avez besoin d'une lettre officielle de l'administration ou des autorités compétentes confirmant que l'immobilisation a été levée."
      },
      {
        question: "Combien de temps faut-il?",
        answer: "Comptez généralement 1-2 semaines après soumission des documents."
      }
    ],
    antsUrl: "https://www.ants.gouv.fr/"
  }
} as const;
