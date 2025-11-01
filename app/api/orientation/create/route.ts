import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { GoogleGenerativeAI } from '@google/generative-ai'

const prisma = new PrismaClient()
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    // Vérifier l'éligibilité (similaire à /eligibility)
    if (user.subscriptionType !== 'ANNUAL') {
      return NextResponse.json({ error: 'Abonnement annuel requis' }, { status: 403 })
    }

    if (user.subscriptionStartDate) {
      const daysSince = Math.floor(
        (Date.now() - new Date(user.subscriptionStartDate).getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSince < 14) {
        return NextResponse.json({ error: 'Période de rétractation en cours' }, { status: 403 })
      }
    }

    const { questionnaire } = await request.json()

    if (!questionnaire) {
      return NextResponse.json({ error: 'Questionnaire manquant' }, { status: 400 })
    }

    // ========== PASSAGE 1 : GÉNÉRATION DU BILAN COMPLET (5 SECTIONS) ==========

    const model = genAI.getGenerativeModel({ 
      model: 'models/gemini-pro',
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      }
    })

    const prompt1 = `🎯 MISSION : Vous êtes un Conseiller d'Orientation Pédagogique Expert.

Vous devez générer un Bilan Pédagogique et d'Orientation sur Mesure complet, professionnel, et humain. Analysez de manière critique les données fournies par l'élève et ses parents (performance académique, soft skills, ambitions, contexte international) pour produire un document structuré et actionnable.

📥 DONNÉES D'ENTRÉE :
${JSON.stringify(questionnaire, null, 2)}

🔍 STRUCTURE DU BILAN REQUIS :

Le Bilan doit être rédigé de manière claire, encourageante et nuancée, en évitant le langage générique. Il doit être séparé en 5 sections principales :

**1. SYNTHÈSE DU PROFIL ET DE LA TRAJECTOIRE**

- Synthèse Générale : Présenter l'élève (âge, genre, niveau) et résumer les principales forces et les domaines de vigilance identifiés.
- Analyse de la Trajectoire : Décrire la dynamique de performance (progression vs. déclin) en Première et Terminale. Analyser le classement en classe pour évaluer la position relative de l'élève.

**2. ADÉQUATION PERFORMANCE VS. AMBITION**

- Analyse de l'Alignement : Évaluer de manière critique la cohérence entre la performance académique (notes, classement, tests SAT/TOEIC) et le niveau d'ambition post-bac (Top 5, Top 15, Prépa sélective, Étranger).
- Bilan Linguistique et International : Valider l'adéquation du niveau de langues et des scores SAT/TOEFL avec les exigences des études à l'étranger ou des filières sélectives.
- Identification des Écarts : Pointer, le cas échéant, les matières où un écart de niveau est le plus problématique pour l'orientation souhaitée.

**3. DIAGNOSTIC MÉTHODOLOGIQUE ET COMPORTEMENTAL**

- Habitudes de Travail : Évaluer l'équilibre de la charge de travail (semaine/week-end) et le niveau d'autonomie. Proposer des pistes méthodologiques basées sur le style d'apprentissage déclaré (Visuel, Auditif, Kinesthésique).
- Soft Skills et Potentiel : Analyser les activités extrascolaires (niveau d'excellence, leadership, persévérance) pour identifier les compétences transférables et les valoriser dans la candidature (lettres de motivation, dossiers).

**4. RECOMMANDATIONS PÉDAGOGIQUES PRIORITAIRES**

- Proposer 3 à 5 actions concrètes et immédiates pour consolider le dossier. Ces actions doivent être spécifiques (Ex: "Augmenter le temps de travail personnel en Mathématiques de 2h/semaine", "Obtenir le niveau C1 en Anglais avant décembre", "Structurer un projet personnel lié à l'activité X").
- Prioriser les matières faibles qui menacent l'objectif d'orientation.

**5. SCÉNARIOS D'ORIENTATION (PLAN A, B, C)**

- Plan A (Idéal) : Valider l'orientation la plus ambitieuse souhaitée et lister les conditions impératives à remplir.
- Plan B (Sécurité) : Proposer une filière ou des établissements légèrement moins sélectifs, mais parfaitement alignés avec les intérêts de l'élève, si le Plan A s'avère trop risqué.
- Conclusion : Rédiger une conclusion encourageante, centrée sur le potentiel et les prochaines étapes de la démarche d'orientation.

**FORMAT DE RÉPONSE :**
Rédigez un document complet en Markdown, structuré avec des titres clairs (##, ###), des listes à puces, et un ton professionnel mais bienveillant. Longueur cible : 1500-2000 mots.`

    const result1 = await model.generateContent(prompt1)
    const bilanInitial = result1.response.text()

    // ========== PASSAGE 2 : REVUE PSYCHOPÉDAGOGIQUE ==========

    const prompt2 = `🔍 REVUE 1 - FILTRE PSYCHOPÉDAGOGIQUE (Soft Skills et Nuances)

Vous êtes un psychopédagogue expert. Relisez le bilan suivant et AMÉLIOREZ-LE selon ces critères :

**BILAN INITIAL À AMÉLIORER :**
${bilanInitial}

**DONNÉES ORIGINALES (pour contexte) :**
${JSON.stringify(questionnaire, null, 2)}

**CRITÈRES DE REVUE :**

1. **Ton et Motivation** : Est-ce que le langage est encourageant ? Les difficultés sont-elles présentées comme des défis à relever plutôt que des faiblesses insurmontables ?

2. **Valorisation du Non-Académique** : Les soft skills (leadership, rigueur, créativité) tirés des activités extrascolaires sont-ils suffisamment mis en avant et connectés aux exigences de l'orientation souhaitée ?

3. **Besoins Spécifiques** : Les recommandations prennent-elles en compte le style d'apprentissage et les éventuels besoins spécifiques (TDA/H, DYS) mentionnés ?

**INSTRUCTIONS :**
- Gardez la structure en 5 sections
- Améliorez le ton pour le rendre plus encourageant et personnalisé
- Renforcez les liens entre soft skills et orientation
- Ajoutez de l'empathie sans perdre en professionnalisme
- Retournez le bilan COMPLET et AMÉLIORÉ en Markdown`

    const result2 = await model.generateContent(prompt2)
    const bilanRevuePsycho = result2.response.text()

    // ========== PASSAGE 3 : REVUE RÉALITÉ DU TERRAIN ==========

    const prompt3 = `🔍 REVUE 2 - FILTRE RÉALITÉ DU TERRAIN / CONSEIL D'ADMISSION

Vous êtes un conseiller d'admission universitaire avec 15 ans d'expérience. Relisez le bilan suivant et AFFINEZ-LE selon ces critères :

**BILAN APRÈS REVUE PSYCHOPÉDAGOGIQUE :**
${bilanRevuePsycho}

**DONNÉES ORIGINALES (pour contexte) :**
${JSON.stringify(questionnaire, null, 2)}

**CRITÈRES DE REVUE :**

1. **Faisabilité** : Les recommandations et les scénarios d'orientation sont-ils réalistes et actualisés par rapport aux exigences réelles de Parcoursup ou des admissions internationales ?

2. **Cohérence des Chiffres** : La critique de l'alignement Performance/Ambition est-elle factuelle et basée uniquement sur les données objectives (notes, rangs, scores SAT) ?

3. **Clarté des Actions** : Les actions sont-elles spécifiques, mesurables, atteignables, pertinentes et temporellement définies (SMART) ?

**INSTRUCTIONS :**
- Gardez la structure en 5 sections
- Assurez-vous que TOUTES les recommandations sont concrètes et réalisables
- Vérifiez que les Plans A/B/C sont réalistes compte tenu du profil
- Ajoutez des échéances précises aux actions (Ex: "d'ici décembre 2025")
- Retournez le bilan FINAL, COMPLET et OPTIMISÉ en Markdown`

    const result3 = await model.generateContent(prompt3)
    const bilanFinal = result3.response.text()

    // Le bilan final est le résultat du triple passage
    const resultatHumanise = bilanFinal
    
    // Analyse simplifiée pour la colonne JSON (on garde une structure minimale)
    const analyse = {
      passagesEffectues: 3,
      syntheseRapide: "Bilan complet généré avec triple validation (Initial + Psychopédagogique + Réalité du Terrain)",
      timestamp: new Date().toISOString()
    }

    // ========== SAUVEGARDE EN BASE ==========

    const now = new Date()
    const expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000) // +1 an

    const bilan = await prisma.orientationBilan.create({
      data: {
        userId: user.id,
        questionnaire: questionnaire as any,
        analyse: analyse as any,
        resultat: resultatHumanise,
        createdAt: now,
        expiresAt: expiresAt,
      },
    })

    return NextResponse.json({
      success: true,
      bilanId: bilan.id,
      message: 'Bilan généré avec succès',
    })
  } catch (error: any) {
    console.error('Erreur lors de la génération du bilan:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur lors de la génération' },
      { status: 500 }
    )
  }
}

