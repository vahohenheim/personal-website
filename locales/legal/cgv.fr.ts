import { type TermsDocument } from "@/lib/models/legal";

// The general terms of service (conditions générales de prestation), version 1.1, in French
// only: the English page shows this same text. Word for word from
// docs/legal-handoff/content/cgv.fr.md, with French typography added (non-breaking spaces,
// narrow ones in the SIREN and SIRET) and the internal references turned into links. A test
// compares the two (tests/unit/legal-content.test.ts). See docs/features/legal-pages.md.

export const cgv: TermsDocument = {
  identity: [
    { key: "prestataire", value: "Valentin Bourreau, entrepreneur individuel (EI)" },
    { key: "nom commercial", value: "valentinbourreau" },
    { key: "siren", value: "130\u202f933\u202f922" },
    { key: "siret", value: "130\u202f933\u202f922\u202f00010" },
    { key: "code ape", value: "62.02A" },
    { key: "adresse", value: "520 route de Voivres, 72210 Fillé, France" },
    {
      key: "contact",
      value: "[contact@valentinbourreau.com](mailto:contact@valentinbourreau.com)",
    },
  ],
  designation: "Ci-après «\u00a0le Prestataire\u00a0».",
  toc: {
    label: "sommaire",
    summary: "sommaire · {count} articles",
    navLabel: "Sommaire des CGP",
  },
  anchor: "Lien vers l’article {n}",
  sections: [
    {
      id: "art-01",
      number: "01",
      title: "Objet et champ d’application",
      blocks: [
        {
          type: "p",
          text: "Les présentes conditions générales de prestation («\u00a0CGP\u00a0») encadrent les prestations de développement logiciel, d’ingénierie front-end, de création de sites et d’applications web, de maintenance, de conseil, d’audit et d’accompagnement technique réalisées par le Prestataire.",
        },
        {
          type: "p",
          text: "Elles s’adressent exclusivement aux professionnels («\u00a0le Client\u00a0») et s’appliquent à toute commande, sauf dérogation écrite et signée par les deux parties.",
        },
        {
          type: "p",
          text: "Toute commande vaut acceptation des CGP. Les conditions générales d’achat du Client ne s’appliquent que si le Prestataire les a acceptées par écrit.",
        },
      ],
    },
    {
      id: "art-02",
      number: "02",
      title: "Documents contractuels",
      blocks: [
        {
          type: "p",
          text: "Le contrat est formé, par ordre de priorité décroissant\u00a0:",
        },
        {
          type: "ol",
          items: [
            "du devis signé par le Client et de ses éventuels avenants\u00a0;",
            "des présentes CGP, dans leur version jointe au devis ou mentionnée sur celui-ci\u00a0;",
            "le cas échéant, d’un accord de traitement des données ([article 14](#art-14)).",
          ],
        },
        {
          type: "p",
          text: "En cas de contradiction, le document de rang supérieur prévaut.",
        },
      ],
    },
    {
      id: "art-03",
      number: "03",
      title: "Devis et commande",
      blocks: [
        {
          type: "p",
          text: "Chaque prestation fait l’objet d’un devis précisant son périmètre, son mode d’exécution (forfait ou régie), son prix, son calendrier prévisionnel et ses conditions de paiement.",
        },
        {
          type: "p",
          text: "Un devis est valable 30\u00a0jours à compter de son émission, sauf mention contraire.",
        },
        {
          type: "p",
          text: "La commande est ferme à réception du devis signé, portant la mention «\u00a0Bon pour accord\u00a0» et l’acceptation des CGP, et, lorsqu’il est prévu, du paiement de l’acompte. Le Prestataire commence les travaux à cette date.",
        },
      ],
    },
    {
      id: "art-04",
      number: "04",
      title: "Modes d’exécution",
      blocks: [
        {
          type: "subsection",
          id: "art-04-1",
          number: "4.1",
          title: "Forfait",
          blocks: [
            {
              type: "p",
              text: "Le Prestataire s’engage à livrer les éléments décrits au devis, pour un prix fixé à l’avance. Toute demande hors périmètre fait l’objet d’un devis complémentaire ou d’un avenant ([article 7](#art-07)).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-04-2",
          number: "4.2",
          title: "Régie",
          blocks: [
            {
              type: "p",
              text: "Le Prestataire met ses compétences à disposition du Client pour un nombre de jours estimé, facturé au temps réellement passé, sur la base du taux journalier (TJM) indiqué au devis. Une journée correspond à 7\u00a0heures de travail effectif, fractionnable en demi-journées. Le Prestataire tient un relevé des jours travaillés, transmis avec chaque facture.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-04-3",
          number: "4.3",
          title: "Indépendance",
          blocks: [
            {
              type: "p",
              text: "Le Prestataire exerce en toute indépendance. Il organise librement son travail, ses horaires et son lieu d’exécution, y compris à distance et depuis l’étranger, et n’est soumis à aucun lien de subordination envers le Client. Les réunions et jalons sont fixés d’un commun accord.",
            },
            {
              type: "p",
              text: "Le Prestataire est tenu à une obligation de moyens.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-04-4",
          number: "4.4",
          title: "Maintenance mensuelle",
          blocks: [
            {
              type: "p",
              text: "La maintenance mensuelle est un abonnement à prix fixe, dont le contenu est décrit au devis\u00a0: hébergement, mises à jour, temps d’intervention inclus. Elle commence à la date fixée au devis, pour une durée d’un mois, puis se renouvelle tacitement de mois en mois.",
            },
            {
              type: "p",
              text: "Chaque partie peut y mettre fin par écrit, avec un préavis de 30\u00a0jours. Le mois en cours reste dû. Le temps d’intervention inclus et non utilisé dans le mois n’est pas reporté\u00a0; au-delà, les interventions font l’objet d’un devis ou sont facturées au TJM indiqué au devis.",
            },
            {
              type: "p",
              text: "Le Prestataire peut réviser le prix une fois par an, en le notifiant par écrit au moins 30\u00a0jours avant la date d’effet. Le Client peut alors mettre fin à la maintenance avant cette date, sans préavis.",
            },
            {
              type: "p",
              text: "Lorsque la maintenance comprend l’hébergement, le site ou l’application reste déployé sur les comptes du Prestataire pendant toute sa durée. Le nom de domaine est enregistré au nom du Client. Le Prestataire ne garantit pas une disponibilité supérieure à celle de l’hébergeur retenu. À la fin de la maintenance, ou à tout moment sur demande écrite du Client, le Prestataire lui transfère le code, les comptes et le déploiement dans un délai raisonnable.",
            },
          ],
        },
      ],
    },
    {
      id: "art-05",
      number: "05",
      title: "Obligations du Client",
      blocks: [
        {
          type: "p",
          text: "Le Client s’engage à\u00a0:",
        },
        {
          type: "ul",
          items: [
            "fournir en temps utile les informations, contenus, maquettes, accès et environnements nécessaires\u00a0;",
            "désigner un interlocuteur disposant du pouvoir de décision\u00a0;",
            "répondre aux demandes de validation dans les délais convenus\u00a0;",
            "détenir les droits sur les contenus et éléments qu’il fournit, et garantir le Prestataire contre toute réclamation à ce titre.",
          ],
        },
        {
          type: "p",
          text: "Tout retard imputable au Client décale d’autant le calendrier, sans que la responsabilité du Prestataire puisse être engagée.",
        },
      ],
    },
    {
      id: "art-06",
      number: "06",
      title: "Livraison et recette",
      blocks: [
        {
          type: "p",
          text: "Pour les prestations au forfait, le Prestataire notifie chaque livraison au Client. Celui-ci dispose de 10\u00a0jours ouvrés pour signaler par écrit les anomalies constatées au regard du devis.",
        },
        {
          type: "p",
          text: "Le Prestataire corrige les anomalies avérées dans un délai raisonnable, puis soumet une nouvelle livraison selon la même procédure.",
        },
        {
          type: "p",
          text: "La recette est réputée acquise à la première des dates suivantes\u00a0: validation écrite du Client, expiration du délai de 10\u00a0jours ouvrés sans réserve écrite, ou mise en production par le Client.",
        },
        {
          type: "p",
          text: "Pour un site ou une application, le devis précise le nombre de tours de retours inclus. Un tour de retours regroupe, en un seul envoi écrit, les demandes de modification du Client sur une livraison. Les tours supplémentaires et les demandes hors périmètre relèvent de l’[article 7](#art-07).",
        },
      ],
    },
    {
      id: "art-07",
      number: "07",
      title: "Modifications du périmètre",
      blocks: [
        {
          type: "p",
          text: "Toute modification du périmètre, du calendrier ou des livrables demandée par le Client fait l’objet d’un devis complémentaire ou d’un avenant, accepté par écrit avant exécution.",
        },
      ],
    },
    {
      id: "art-08",
      number: "08",
      title: "Prix",
      blocks: [
        {
          type: "p",
          text: "Les prix sont exprimés en euros, hors taxes. TVA non applicable, article 293\u00a0B du CGI, tant que le Prestataire bénéficie de la franchise en base. Si celle-ci prend fin, la TVA au taux en vigueur s’ajoute aux prix à compter de cette date.",
        },
        {
          type: "p",
          text: "Les frais de déplacement, d’hébergement et les licences ou services tiers ne sont pas inclus, sauf mention au devis. Ils sont refacturés au réel, après accord préalable du Client.",
        },
      ],
    },
    {
      id: "art-09",
      number: "09",
      title: "Facturation et paiement",
      blocks: [
        {
          type: "p",
          text: "Sauf mention contraire au devis\u00a0:",
        },
        {
          type: "ul",
          items: [
            "**forfait**\u00a0: acompte de 30\u00a0% à la commande, solde à la recette\u00a0; pour les projets de plus de deux mois, les factures intermédiaires suivent les jalons définis au devis\u00a0;",
            "**régie**\u00a0: facturation mensuelle, en fin de mois, des jours réellement travaillés\u00a0;",
            "**maintenance mensuelle**\u00a0: facturation mensuelle, en début de mois.",
          ],
        },
        {
          type: "p",
          text: "Les factures sont payables à 30\u00a0jours à compter de leur date d’émission, par virement bancaire sur le compte indiqué sur la facture. Aucun escompte n’est accordé en cas de paiement anticipé.",
        },
      ],
    },
    {
      id: "art-10",
      number: "10",
      title: "Retard de paiement",
      blocks: [
        {
          type: "p",
          text: "Tout retard de paiement entraîne de plein droit, sans rappel préalable\u00a0:",
        },
        {
          type: "ul",
          items: [
            "des pénalités de retard calculées au taux appliqué par la Banque centrale européenne à son opération de refinancement la plus récente, majoré de 10\u00a0points, à compter du lendemain de la date d’échéance\u00a0;",
            "une indemnité forfaitaire pour frais de recouvrement de 40\u00a0€ (articles L441-10 et D441-5 du Code de commerce), sans préjudice d’une indemnisation complémentaire sur justificatifs.",
          ],
        },
        {
          type: "p",
          text: "Le retard de paiement d’une facture rend immédiatement exigibles toutes les sommes dues au titre du contrat.",
        },
      ],
    },
    {
      id: "art-11",
      number: "11",
      title: "Suspension",
      blocks: [
        {
          type: "p",
          text: "En cas de non-paiement d’une facture à son échéance, le Prestataire adresse au Client une mise en demeure par écrit (courrier recommandé ou e-mail avec accusé de réception).",
        },
        {
          type: "p",
          text: "Si la mise en demeure reste sans effet pendant 15\u00a0jours, le Prestataire peut, sans indemnité pour le Client\u00a0:",
        },
        {
          type: "ul",
          items: [
            "suspendre l’exécution de toutes ses prestations en cours\u00a0;",
            "retirer la licence d’utilisation provisoire prévue à l’[article 12.2](#art-12-2)\u00a0;",
            "interrompre l’accès aux environnements, dépôts de code et déploiements qu’il opère sous ses propres comptes.",
          ],
        },
        {
          type: "p",
          text: "La suspension ne porte jamais atteinte aux données du Client, qui restent intactes. Les prestations reprennent dans un délai raisonnable après le paiement intégral des sommes dues, pénalités comprises. Le calendrier est décalé de la durée de la suspension.",
        },
      ],
      emphasis: true,
    },
    {
      id: "art-12",
      number: "12",
      title: "Propriété intellectuelle",
      blocks: [
        {
          type: "subsection",
          id: "art-12-1",
          number: "12.1",
          title: "Cession des droits",
          blocks: [
            {
              type: "p",
              text: "Sous réserve du paiement intégral du prix, le Prestataire cède au Client, à titre exclusif, les droits patrimoniaux d’auteur sur les livrables spécifiquement créés pour lui et identifiés au devis\u00a0: droits de reproduction, de représentation, d’adaptation, de modification, de traduction et de distribution, sur tout support, pour le monde entier et pour toute la durée légale de protection, aux fins d’exploitation décrites au devis.",
            },
            {
              type: "p",
              text: "Le prix de cette cession est inclus dans le prix de la prestation.",
            },
            {
              type: "p",
              text: "La cession prend effet à la date du paiement intégral. Les dépôts de code, comptes et déploiements opérés par le Prestataire sont alors transférés au Client, sauf pendant une maintenance mensuelle qui comprend l’hébergement, où le transfert suit l’[article 4.4](#art-04-4).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-2",
          number: "12.2",
          title: "Avant paiement intégral",
          blocks: [
            {
              type: "p",
              text: "Jusqu’au paiement intégral, le Client bénéficie d’une licence d’utilisation des livrables non exclusive, non transférable et révocable, limitée aux besoins de la recette et de l’exploitation prévue au devis. Cette licence peut être retirée dans les conditions de l’[article 11](#art-11).",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-3",
          number: "12.3",
          title: "Éléments préexistants et outils génériques",
          blocks: [
            {
              type: "p",
              text: "Le Prestataire reste titulaire des éléments qu’il a créés indépendamment de la mission ou qui ne sont pas spécifiques au Client\u00a0: composants, bibliothèques, utilitaires, configurations, modèles de code, méthodes et savoir-faire. Lorsqu’ils sont intégrés aux livrables, le Prestataire concède au Client, à compter du paiement intégral, une licence non exclusive, gratuite, mondiale et pour la durée des droits, limitée à l’exploitation des livrables. Le Prestataire reste libre de les réutiliser.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-4",
          number: "12.4",
          title: "Logiciels libres et services tiers",
          blocks: [
            {
              type: "p",
              text: "Les composants open source et services tiers intégrés aux livrables restent soumis à leurs licences et conditions propres, que le Client s’engage à respecter.",
            },
          ],
        },
        {
          type: "subsection",
          id: "art-12-5",
          number: "12.5",
          title: "Références",
          blocks: [
            {
              type: "p",
              text: "Sauf refus écrit du Client ou engagement de confidentialité, le Prestataire peut mentionner le nom et le logo du Client, et présenter les travaux réalisés à titre de référence, une fois ceux-ci rendus publics.",
            },
          ],
        },
      ],
      emphasis: true,
    },
    {
      id: "art-13",
      number: "13",
      title: "Confidentialité",
      blocks: [
        {
          type: "p",
          text: "Chaque partie garde confidentielles les informations non publiques communiquées par l’autre partie à l’occasion du contrat, et ne les utilise que pour son exécution. Cette obligation dure pendant le contrat et trois ans après sa fin.",
        },
      ],
    },
    {
      id: "art-14",
      number: "14",
      title: "Données personnelles",
      blocks: [
        {
          type: "p",
          text: "Lorsque l’exécution de la prestation conduit le Prestataire à traiter des données personnelles pour le compte du Client, il agit en qualité de sous-traitant au sens de l’article 28 du RGPD\u00a0: il ne traite ces données que sur instruction documentée du Client, en assure la sécurité et la confidentialité, et les supprime ou les restitue en fin de mission. Les parties concluent si nécessaire un accord de traitement des données.",
        },
        {
          type: "p",
          text: "Les données du Client et de ses interlocuteurs collectées par le Prestataire pour gérer la relation commerciale sont traitées selon la politique décrite dans les [mentions légales de valentinbourreau.com](/fr/legal/#sec-05).",
        },
      ],
    },
    {
      id: "art-15",
      number: "15",
      title: "Responsabilité",
      blocks: [
        {
          type: "p",
          text: "Le Prestataire est tenu à une obligation de moyens. Sa responsabilité ne peut être engagée qu’en cas de faute prouvée.",
        },
        {
          type: "p",
          text: "Il n’est pas responsable\u00a0:",
        },
        {
          type: "ul",
          items: [
            "des dommages indirects, tels que perte de chiffre d’affaires, de clientèle, de données ou d’image\u00a0;",
            "des dysfonctionnements causés par les contenus, infrastructures, hébergements ou services tiers choisis ou fournis par le Client\u00a0;",
            "des modifications apportées aux livrables par le Client ou par un tiers.",
          ],
        },
        {
          type: "p",
          text: "Le Client reste responsable de la sauvegarde de ses données et de ses environnements.",
        },
        {
          type: "p",
          text: "En tout état de cause, la responsabilité totale du Prestataire est limitée au montant hors taxes effectivement payé par le Client au titre du devis concerné au cours des douze derniers mois.",
        },
      ],
    },
    {
      id: "art-16",
      number: "16",
      title: "Force majeure",
      blocks: [
        {
          type: "p",
          text: "Aucune partie n’est responsable d’un manquement causé par un cas de force majeure au sens de l’article 1218 du Code civil. Les obligations concernées sont suspendues pendant sa durée. Si la force majeure dure plus de 30\u00a0jours, chaque partie peut résilier le contrat par écrit, les prestations réalisées restant dues.",
        },
      ],
    },
    {
      id: "art-17",
      number: "17",
      title: "Durée et résiliation",
      blocks: [
        {
          type: "p",
          text: "Le contrat prend fin à l’achèvement des prestations prévues au devis.",
        },
        {
          type: "ul",
          items: [
            "**Régie**\u00a0: chaque partie peut y mettre fin par écrit, avec un préavis de 15\u00a0jours. Les jours travaillés jusqu’à la fin du préavis sont dus.",
            "**Forfait**\u00a0: si le Client met fin au contrat avant son terme, il règle les travaux réalisés à la date de la résiliation, au prorata du devis. L’acompte reste acquis au Prestataire.",
            "**Maintenance mensuelle**\u00a0: chaque partie peut y mettre fin selon l’[article 4.4](#art-04-4).",
            "**Manquement grave**\u00a0: en cas de manquement d’une partie non corrigé 30\u00a0jours après une mise en demeure, l’autre partie peut résilier le contrat par écrit, sans préjudice des dommages et intérêts.",
          ],
        },
        {
          type: "p",
          text: "Les articles [10](#art-10), [12](#art-12), [13](#art-13) et [15](#art-15) survivent à la fin du contrat.",
        },
      ],
    },
    {
      id: "art-18",
      number: "18",
      title: "Sous-traitance",
      blocks: [
        {
          type: "p",
          text: "Le Prestataire peut faire appel à un sous-traitant, après accord écrit du Client. Il reste alors responsable de la bonne exécution des prestations.",
        },
      ],
    },
    {
      id: "art-19",
      number: "19",
      title: "Droit applicable et litiges",
      blocks: [
        {
          type: "p",
          text: "Le contrat est soumis au droit français.",
        },
        {
          type: "p",
          text: "En cas de différend, les parties recherchent d’abord une solution amiable, pendant 30\u00a0jours à compter de la notification écrite du différend.",
        },
        {
          type: "p",
          text: "À défaut d’accord, et dans la mesure où la loi le permet, le litige est porté devant les juridictions compétentes du ressort de la cour d’appel d’Angers.",
        },
      ],
    },
    {
      id: "art-20",
      number: "20",
      title: "Dispositions générales",
      blocks: [
        {
          type: "p",
          text: "Si une clause est déclarée nulle, les autres clauses restent en vigueur. Le fait de ne pas se prévaloir d’une clause ne vaut pas renonciation à s’en prévaloir plus tard.",
        },
        {
          type: "p",
          text: "Les CGP sont rédigées en français. En cas de traduction, la version française prévaut.",
        },
        {
          type: "p",
          text: "Le Prestataire peut modifier les CGP. La version applicable est celle jointe au devis signé, ou mentionnée sur celui-ci.",
        },
      ],
    },
  ],
};
