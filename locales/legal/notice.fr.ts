import { type LegalSection } from "@/lib/models/legal";

// Legal notice and privacy, version of 15 October 2026. Word for word from
// docs/legal-handoff/content/mentions-legales.fr.md, laid out as in the mockup
// (docs/legal-handoff/reference/legal.html): the publisher's details in an identity card,
// each processing of personal data as a row with its retention period. A test compares the
// texts with the source (tests/unit/legal-content.test.ts). English mirror: notice.en.ts.

export const sections: LegalSection[] = [
  {
    id: "sec-01",
    number: "01",
    title: "Éditeur",
    blocks: [
      {
        type: "p",
        text: "Ce site est édité par Valentin Bourreau, entrepreneur individuel (EI), sous le nom commercial valentinbourreau. Activité\u00a0: développement logiciel et ingénierie front-end en freelance.",
      },
      {
        type: "identity",
        rows: [
          { key: "siren", value: "130\u202f933\u202f922" },
          { key: "siret du siège", value: "130\u202f933\u202f922\u202f00010" },
          { key: "code ape", value: "62.02A, conseil en systèmes et logiciels informatiques" },
          { key: "tva", value: "non applicable, article 293\u00a0B du CGI" },
          { key: "adresse", value: "520 route de Voivres, 72210 Fillé, France" },
          { key: "publication", value: "Valentin Bourreau, directeur de la publication" },
          {
            key: "contact",
            value: "[contact@valentinbourreau.com](mailto:contact@valentinbourreau.com)",
          },
        ],
      },
    ],
  },
  {
    id: "sec-02",
    number: "02",
    title: "Hébergement",
    blocks: [
      {
        type: "p",
        text: "Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com).",
      },
    ],
  },
  {
    id: "sec-03",
    number: "03",
    title: "Prestations",
    blocks: [
      {
        type: "p",
        text: "Les prestations de Valentin Bourreau sont réservées aux professionnels et régies par ses [conditions générales de prestation](/fr/cgv/), jointes à chaque devis. Les présentes mentions ne s’appliquent qu’au site.",
      },
    ],
  },
  {
    id: "sec-04",
    number: "04",
    title: "Propriété intellectuelle",
    blocks: [
      {
        type: "p",
        text: "Les textes, le portrait et le code source sont l’œuvre de Valentin Bourreau. Tous droits réservés.",
      },
      {
        type: "p",
        text: "Les polices Geist et Geist Mono sont distribuées par Vercel sous licence SIL Open Font License 1.1. Les logos et noms de clients ou de technologies cités appartiennent à leurs titulaires respectifs.",
      },
    ],
  },
  {
    id: "sec-05",
    number: "05",
    title: "Données personnelles",
    blocks: [
      {
        type: "p",
        text: "Ce site n’a ni compte ni publicité. Valentin Bourreau est le responsable des traitements décrits ci-dessous.",
      },
      {
        type: "processing",
        items: [
          {
            title: "Formulaire de contact",
            retention: "3\u00a0ans après le dernier échange",
            text: "Quand vous envoyez une demande, le site enregistre ce que vous avez saisi\u00a0: votre besoin, le démarrage souhaité, votre message, votre nom, votre adresse e-mail, votre entreprise si vous l’indiquez, la langue de la page et, quand il est connu, le site depuis lequel vous êtes arrivé (son nom de domaine, ou l’origine indiquée dans le lien suivi). Au fil de nos échanges, des notes de suivi peuvent y être ajoutées\u00a0: état de la demande, montant estimé, date de relance. Ces données servent uniquement à vous répondre et à suivre votre demande. Elles sont conservées au plus trois ans après notre dernier échange, puis supprimées. Vous pouvez demander leur suppression à tout moment.",
          },
          {
            title: "Clients",
            retention: "devis, factures\u00a0: 10\u00a0ans · suivi\u00a0: 3\u00a0ans",
            text: "Si votre demande aboutit à un devis, les données de votre entreprise et de vos interlocuteurs (dénomination, SIREN, adresse, nom, e-mail, fonction) servent à établir les devis et les factures, à exécuter la prestation et à tenir la comptabilité. Les devis et factures sont conservés dix ans à compter de la clôture de l’exercice, comme l’impose le Code de commerce. Les autres données de suivi suivent la règle des trois ans après notre dernier échange.",
          },
          {
            title: "Protection contre les robots",
            retention: "aucun enregistrement",
            text: "À l’envoi du formulaire, Vercel BotID analyse des signaux techniques de votre navigateur pour distinguer une personne d’un robot. Aucun de ces signaux n’est enregistré avec votre demande.",
          },
          {
            title: "Mesure d’audience",
            retention: "empreinte\u00a0: 24\u00a0h · totaux anonymes\u00a0: sans limite",
            text: "Vercel Web Analytics compte les pages vues, pour savoir comment le site est utilisé. D’après Vercel, l’outil ne dépose aucun cookie, reconnaît une visite grâce à une empreinte de la requête supprimée au bout de 24\u00a0heures, et enregistre avec chaque page vue la page, le site d’origine, le pays et la région, le navigateur, le système d’exploitation et le type d’appareil. Chaque jour, le site recopie dans sa base de données des totaux anonymes (nombre de visites et de pages vues par jour, par page, par site d’origine, par pays et par type d’appareil) et les conserve sans limite de durée. Ces totaux ne permettent d’identifier personne.",
          },
          {
            title: "Formulaire\u00a0: mesure d’utilisation",
            retention: "compteurs anonymes",
            text: "Le site compte, par jour, combien de fois le formulaire de contact est ouvert, combien de fois chaque étape est atteinte et combien de messages sont envoyés. Ce sont de simples compteurs\u00a0: aucun identifiant, aucune adresse IP ni aucun contenu saisi n’y est associé, et ils ne permettent d’identifier personne.",
          },
          {
            title: "Hébergement",
            retention: "durée fixée par Vercel",
            text: "Comme tout hébergeur, Vercel traite l’adresse IP et les données techniques de chaque requête pour servir les pages et protéger le service, pendant la durée qu’il fixe.",
          },
          {
            title: "E-mail",
            retention: "réponse uniquement",
            text: "Si vous écrivez à l’adresse de contact, votre message et votre adresse ne servent qu’à vous répondre.",
          },
        ],
      },
      {
        type: "p",
        text: "**Base légale.** Pour le formulaire\u00a0: les mesures prises à votre demande avant un éventuel contrat. Pour les clients\u00a0: l’exécution du contrat et les obligations légales comptables et fiscales. Pour le reste\u00a0: l’intérêt légitime à faire fonctionner le site, à le sécuriser et à connaître son audience.",
      },
      {
        type: "p",
        text: "**Destinataires et transferts.** Vercel Inc. (hébergement, mesure d’audience, protection contre les robots) et Neon Inc. (base de données où sont stockées les demandes) agissent comme sous-traitants. Ces sociétés sont établies aux États-Unis\u00a0: des données peuvent donc être traitées hors de l’Union européenne, selon les garanties prévues par leurs accords de traitement des données. Les factures transitent par la plateforme de facturation électronique agréée [[à compléter]] et peuvent être transmises à l’administration fiscale, comme la loi l’exige. Personne d’autre que Valentin Bourreau ne lit les demandes.",
      },
    ],
  },
  {
    id: "sec-06",
    number: "06",
    title: "Cookies et stockage local",
    blocks: [
      {
        type: "p",
        text: "Le site conserve dans votre navigateur, et seulement quand vous agissez\u00a0: la langue choisie (un cookie nommé `NEXT_LOCALE`, conservé un an), le thème clair ou sombre (stockage local) et, après l’envoi du formulaire, la date de cet envoi (stockage local), pour vous confirmer que votre message est parti. Un article protégé par un mot de passe dépose, une fois le bon mot de passe saisi, un cookie nommé `post_access_` suivi du nom de l’article, conservé 30\u00a0jours\u00a0: il prouve seulement que ce navigateur peut lire cet article, et il est strictement nécessaire pour l’ouvrir. Rien de cela ne sert à vous suivre ni ne nécessite de consentement.",
      },
    ],
  },
  {
    id: "sec-07",
    number: "07",
    title: "Vos droits",
    blocks: [
      {
        type: "p",
        text: "Conformément au RGPD, vous pouvez demander l’accès à vos données, leur rectification ou leur suppression, ou vous opposer à leur traitement, en écrivant à [contact@valentinbourreau.com](mailto:contact@valentinbourreau.com). Les données que la loi impose de conserver, comme les factures, ne peuvent être supprimées avant la fin de leur durée légale.",
      },
      {
        type: "p",
        text: "Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).",
      },
    ],
  },
];
