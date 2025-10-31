// ========================================
// TYPES POUR LE BILAN D'ORIENTATION IA
// ========================================

export interface PerformanceTrimestre {
  // Notes et classements de l'élève
  moyenneGenerale: string
  classementGeneral: string
  mathsNote: string
  mathsClassement: string
  lv1Note: string
  lv1Classement: string
  lv2Note: string
  lv2Classement: string
  specialite1Note: string
  specialite1Classement: string
  specialite2Note: string
  specialite2Classement: string
  specialite3Note?: string // Seulement en Première
  specialite3Classement?: string
  matiereFailbleNote: string
  matiereFaibleClassement: string
  
  // Moyennes de la classe (optionnel)
  moyenneGeneraleClasse?: string
  mathsNoteClasse?: string
  lv1NoteClasse?: string
  lv2NoteClasse?: string
  specialite1NoteClasse?: string
  specialite2NoteClasse?: string
  specialite3NoteClasse?: string
  matiereFaibleNoteClasse?: string
  
  // Noms des matières
  specialite1Nom: string
  specialite2Nom: string
  specialite3Nom?: string
  matiereFaibleNom: string
}

export interface PerformanceAnnee {
  t1: PerformanceTrimestre
  t2: PerformanceTrimestre
  t3: PerformanceTrimestre
}

export interface CertificationsLangues {
  anglaisNiveau: string // CECRL: A2, B1, B2, C1, C2
  toeicScore?: string
  toeicDate?: string
  toeflScore?: string
  toeflDate?: string
  ieltsScore?: string
  ieltsDate?: string
  cambridgeTest?: string
  cambridgeScore?: string
  cambridgeDate?: string
  
  autresLangues: Array<{
    langue: string
    niveau: string
    pratiqueCourante: string
  }>
  
  satScoreTotal?: string
  satScoreMath?: string
  satScoreReading?: string
  actScoreComposite?: string
}

export interface QuestionnaireOrientation {
  // ========== 1. Informations Générales ==========
  age: string
  genre: string
  lycee: string // NOUVEAU : Nom du lycée
  matieresPrefereees: string[] // 3 matières
  matieresDisfficiles: string[] // 3 matières
  troublesApprentissage?: string
  aideExterieure?: string
  
  // ========== 2. Performance Académique ==========
  premiere: PerformanceAnnee
  terminale: PerformanceAnnee
  contexteClasse: string // "Élevé", "Moyen", "Faible"
  
  // ========== 3. Méthodes de Travail ==========
  heuresTravailjournalier: string
  heuresTravailWeekend: string
  autonomie: string
  styleApprentissage: string
  sourceStress: string
  
  // ========== 4. Compétences Linguistiques ==========
  certifications: CertificationsLangues
  
  // ========== 5. Aspirations Post-Bac ==========
  filieresSouhaitees: string[] // Ex: ["Prépa MPSI", "École d'ingénieur post-bac"]
  niveauAmbition: string // Ex: "Top 5 France", "Top 15", etc.
  etudesEtranger: boolean
  paysEnvisages?: string[]
  contraintesFinancieres?: string
  
  // ========== 6. Vie Extrascolaire ==========
  activitesExtrascolaires: string[]
  excellenceParticuliere?: string
  qualitesComportementales: string[] // 3 qualités
  accomplissementFier: string
}

export interface AnalyseIA {
  // Passage 1 : Analyse structurée
  syntheseAcademique: {
    forcesPrincipales: string[]
    faiblesses: string[]
    trajectoire: string // "Ascendante", "Stable", "Descendante"
    potentiel: string
  }
  
  recommandationsFilières: Array<{
    filiere: string
    adequation: number // 0-100
    justification: string
    etablissementsRecommandes: string[]
  }>
  
  competencesNonAcademiques: {
    softSkills: string[]
    activitesValorisables: string[]
    pointsDifferenciants: string[]
  }
  
  planActionSuggere: {
    courtTerme: string[] // 3 mois
    moyenTerme: string[] // 6-12 mois
    longTerme: string[] // 1-2 ans
  }
  
  alertes?: string[] // Points de vigilance
}

export interface BilanOrientationComplet {
  id: string
  userId: string
  questionnaire: QuestionnaireOrientation
  analyse: AnalyseIA
  resultat: string // Message humanisé final (Passage 2)
  createdAt: string
  expiresAt: string
}

