import { db } from "./index";
import { pricing, faqs } from "./schema";

async function seed() {
  console.log("Seeding database...");

  // Seed pricing data
  const existingPricing = await db.select().from(pricing);
  if (existingPricing.length === 0) {
    await db.insert(pricing).values([
      {
        documentType: "carte_grise",
        basePrice: "29.00",
        professionalPrice: "19.00",
        description: "Demande de certificat d'immatriculation (carte grise)",
      },
      {
        documentType: "cession",
        basePrice: "25.00",
        professionalPrice: "15.00",
        description: "Certificat de cession de véhicule",
      },
      {
        documentType: "duplicata",
        basePrice: "35.00",
        professionalPrice: "25.00",
        description: "Duplicata de certificat d'immatriculation",
      },
      {
        documentType: "changement_adresse",
        basePrice: "15.00",
        professionalPrice: "10.00",
        description: "Changement d'adresse sur la carte grise",
      },
    ]);
    console.log("✓ Pricing data seeded");
  }

  // Seed FAQ data
  const existingFaqs = await db.select().from(faqs);
  if (existingFaqs.length === 0) {
    await db.insert(faqs).values([
      {
        category: "général",
        question: "Comment soumettre un document ?",
        answer: "Connectez-vous à votre compte, cliquez sur 'Nouveau document', remplissez le formulaire et téléchargez vos fichiers. Vous serez guidé étape par étape.",
        order: 1,
      },
      {
        category: "général",
        question: "Quels types de documents puis-je soumettre ?",
        answer: "Vous pouvez soumettre des demandes de carte grise, certificats de cession, duplicatas, et changements d'adresse.",
        order: 2,
      },
      {
        category: "paiement",
        question: "Quels moyens de paiement acceptez-vous ?",
        answer: "Nous acceptons les cartes bancaires via notre système de paiement sécurisé Stripe.",
        order: 1,
      },
      {
        category: "paiement",
        question: "Puis-je obtenir une facture ?",
        answer: "Oui, une facture est automatiquement générée après chaque paiement et est disponible dans votre espace personnel.",
        order: 2,
      },
      {
        category: "professionnel",
        question: "Comment devenir client professionnel ?",
        answer: "Contactez-nous via le formulaire de contact en précisant que vous souhaitez un compte professionnel. Nous activerons votre compte avec les tarifs réduits.",
        order: 1,
      },
      {
        category: "professionnel",
        question: "Quelle est la réduction pour les professionnels ?",
        answer: "Les professionnels bénéficient d'une réduction jusqu'à 30% sur tous nos services.",
        order: 2,
      },
    ]);
    console.log("✓ FAQ data seeded");
  }

  console.log("Database seeding completed!");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
