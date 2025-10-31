'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Target, ChevronRight, ChevronLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { QuestionnaireOrientation } from '@/types/orientation'
import { Step2Performance } from '@/components/Step2Performance'

export default function OrientationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [loading, setLoading] = useState(true)
  const [eligible, setEligible] = useState(false)
  const [eligibilityMessage, setEligibilityMessage] = useState('')
  const [existingBilan, setExistingBilan] = useState<any>(null)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [hasDraft, setHasDraft] = useState(false)
  
  // État du questionnaire
  const [formData, setFormData] = useState<Partial<QuestionnaireOrientation>>({
    matieresPrefereees: ['', '', ''],
    matieresDisfficiles: ['', '', ''],
    filieresSouhaitees: [''],
    activitesExtrascolaires: [''],
    qualitesComportementales: ['', '', ''],
    premiere: {
      t1: {} as any,
      t2: {} as any,
      t3: {} as any,
    },
    terminale: {
      t1: {} as any,
      t2: {} as any,
      t3: {} as any,
    },
    certifications: {
      anglaisNiveau: '',
      autresLangues: [],
    },
  })

  // Clé de sauvegarde locale
  const DRAFT_KEY = 'orientation_questionnaire_draft'
  const STEP_KEY = 'orientation_questionnaire_step'

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      checkEligibility()
      loadDraft() // Charger le brouillon si disponible
    }
  }, [status])

  // Sauvegarder automatiquement le brouillon
  useEffect(() => {
    if (eligible && !existingBilan) {
      saveDraft()
    }
  }, [formData, currentStep, eligible, existingBilan])

  const loadDraft = () => {
    try {
      const savedData = localStorage.getItem(DRAFT_KEY)
      const savedStep = localStorage.getItem(STEP_KEY)
      
      if (savedData) {
        const parsed = JSON.parse(savedData)
        setFormData(parsed)
        setHasDraft(true)
        
        if (savedStep) {
          setCurrentStep(parseInt(savedStep))
        }
        
        toast.success('Brouillon récupéré ! Vous pouvez reprendre où vous vous êtes arrêté.', { duration: 4000 })
      }
    } catch (error) {
      console.error('Erreur lors du chargement du brouillon:', error)
    }
  }

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData))
      localStorage.setItem(STEP_KEY, currentStep.toString())
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error)
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(DRAFT_KEY)
    localStorage.removeItem(STEP_KEY)
    setHasDraft(false)
    toast.success('Brouillon supprimé')
  }

  const checkEligibility = async () => {
    try {
      const response = await fetch('/api/orientation/eligibility')
      const data = await response.json()
      
      if (response.ok) {
        setEligible(data.eligible)
        setEligibilityMessage(data.message)
        setExistingBilan(data.existingBilan || null)
      } else {
        setEligible(false)
        setEligibilityMessage(data.error || 'Erreur de vérification')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    const loadingToast = toast.loading('Envoi du questionnaire en cours...')

    try {
      const response = await fetch('/api/orientation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionnaire: formData }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.dismiss(loadingToast)
        toast.success('Questionnaire envoyé avec succès ! Votre bilan sera généré sous une semaine maximum. Vous recevrez un email de notification. 📧', { duration: 7000 })
        
        // Effacer le brouillon après génération réussie
        clearDraft()
        
        router.push(`/orientation/resultat/${data.bilanId}`)
      } else {
        throw new Error(data.error || 'Erreur lors de la génération')
      }
    } catch (error: any) {
      console.error('Erreur:', error)
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Erreur lors de la génération')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-master-turquoise animate-spin" />
      </div>
    )
  }

  if (!eligible) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full card text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-master-dark mb-4">
            Bilan d'Orientation Non Disponible
          </h1>
          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {eligibilityMessage}
          </p>
          <button
            onClick={() => router.push('/upgrade')}
            className="btn-primary"
          >
            Voir les offres Premium
          </button>
        </div>
      </div>
    )
  }

  if (existingBilan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full card text-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-master-dark mb-4">
            Vous avez déjà un bilan d'orientation
          </h1>
          <p className="text-gray-600 mb-2">
            Créé le {new Date(existingBilan.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Expire le {new Date(existingBilan.expiresAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })}
          </p>
          <button
            onClick={() => router.push(`/orientation/resultat/${existingBilan.id}`)}
            className="btn-primary"
          >
            Consulter mon bilan
          </button>
        </div>
      </div>
    )
  }

  const totalSteps = 6

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Retour au dashboard</span>
        </button>
        
        {/* En-tête Premium */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl mb-6 shadow-lg">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Obtenez votre Bilan d'Orientation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Un bilan personnalisé pour éclairer vos choix d'études supérieures et maximiser vos chances de réussite
          </p>
          
          {/* Bénéfices clés */}
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
              <div className="text-3xl mb-2">🎯</div>
              <div className="font-semibold text-gray-900 mb-1">Analyse Approfondie</div>
              <div className="text-sm text-gray-600">De vos résultats et potentiel</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-blue-100">
              <div className="text-3xl mb-2">🚀</div>
              <div className="font-semibold text-gray-900 mb-1">Plan d'Action</div>
              <div className="text-sm text-gray-600">Concret et personnalisé</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-purple-100">
              <div className="text-3xl mb-2">🎓</div>
              <div className="font-semibold text-gray-900 mb-1">Rapport Détaillé</div>
              <div className="text-sm text-gray-600">Complet et personnalisé</div>
            </div>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep} sur {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Formulaire multi-étapes */}
        <div className="card">
          {currentStep === 1 && <Step1InfosGenerales formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <Step2Performance formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <Step3MethodesTravail formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <Step4Langues formData={formData} setFormData={setFormData} />}
          {currentStep === 5 && <Step5Aspirations formData={formData} setFormData={setFormData} />}
          {currentStep === 6 && <Step6VieExtrascolaire formData={formData} setFormData={setFormData} />}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className="btn-outline flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn-primary flex items-center gap-2"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    Générer mon bilan
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer Disclaimers - Discret en bas */}
        <div className="mt-12 space-y-3">
          {/* Sauvegarde */}
          <details className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900">
              💾 Sauvegarde automatique
            </summary>
            <div className="px-4 pb-3 text-xs text-gray-600">
              Vos réponses sont sauvegardées localement. Vous pouvez revenir plus tard.
              {hasDraft && (
                <button onClick={clearDraft} className="ml-2 text-purple-600 hover:underline">
                  Effacer et recommencer
                </button>
              )}
            </div>
          </details>

          {/* Confidentialité */}
          <details className="bg-white/50 backdrop-blur-sm rounded-lg border border-gray-200">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:text-gray-900">
              🔒 Confidentialité RGPD
            </summary>
            <div className="px-4 pb-3 text-xs text-gray-600">
              Vos données sont strictement confidentielles. Seul le bilan final est conservé. Aucun partage avec des tiers.
            </div>
          </details>
        </div>
      </div>
    </div>
  )
}

// ========================================
// COMPOSANTS DES ÉTAPES
// ========================================

function Step1InfosGenerales({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-master-dark mb-4">
        📋 Informations Générales
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Âge de l'élève *</label>
          <input
            type="number"
            required
            min="14"
            max="20"
            className="input"
            value={formData.age || ''}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Genre *</label>
          <select
            required
            className="input"
            value={formData.genre || ''}
            onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
          >
            <option value="">Sélectionner</option>
            <option value="H">Homme</option>
            <option value="F">Femme</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Lycée *</label>
          <input
            type="text"
            required
            className="input"
            placeholder="Ex: Lycée Henri IV"
            value={formData.lycee || ''}
            onChange={(e) => setFormData({ ...formData, lycee: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          3 Matières Préférées *
        </label>
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            type="text"
            required
            className="input mb-2"
            placeholder={`Matière ${index + 1}`}
            value={formData.matieresPrefereees?.[index] || ''}
            onChange={(e) => {
              const newArray = [...(formData.matieresPrefereees || ['', '', ''])]
              newArray[index] = e.target.value
              setFormData({ ...formData, matieresPrefereees: newArray })
            }}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          3 Matières les Plus Difficiles *
        </label>
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            type="text"
            required
            className="input mb-2"
            placeholder={`Matière ${index + 1}`}
            value={formData.matieresDisfficiles?.[index] || ''}
            onChange={(e) => {
              const newArray = [...(formData.matieresDisfficiles || ['', '', ''])]
              newArray[index] = e.target.value
              setFormData({ ...formData, matieresDisfficiles: newArray })
            }}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Troubles de l'apprentissage ou besoins spécifiques (optionnel)
        </label>
        <textarea
          className="input"
          rows={2}
          placeholder="Ex: Dyslexie, TDA/H, aménagements nécessaires..."
          value={formData.troublesApprentissage || ''}
          onChange={(e) => setFormData({ ...formData, troublesApprentissage: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Soutien scolaire / Cours particuliers (optionnel)
        </label>
        <textarea
          className="input"
          rows={2}
          placeholder="Ex: Cours de maths 2h/semaine, soutien en physique..."
          value={formData.aideExterieure || ''}
          onChange={(e) => setFormData({ ...formData, aideExterieure: e.target.value })}
        />
      </div>
    </div>
  )
}

function Step3MethodesTravail({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-master-dark mb-4">
        ⏰ Méthodes de Travail
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Heures de travail par jour (semaine) *
          </label>
          <input
            type="text"
            required
            className="input"
            placeholder="Ex: 2-3h"
            value={formData.heuresTravailjournalier || ''}
            onChange={(e) => setFormData({ ...formData, heuresTravailjournalier: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Heures de travail le week-end *
          </label>
          <input
            type="text"
            required
            className="input"
            placeholder="Ex: 4-5h"
            value={formData.heuresTravailWeekend || ''}
            onChange={(e) => setFormData({ ...formData, heuresTravailWeekend: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Autonomie dans le travail *
        </label>
        <textarea
          required
          className="input"
          rows={2}
          placeholder="Ex: Très autonome, s'organise seul / Besoin de rappels et de structure..."
          value={formData.autonomie || ''}
          onChange={(e) => setFormData({ ...formData, autonomie: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Style d'apprentissage *
        </label>
        <textarea
          required
          className="input"
          rows={2}
          placeholder="Ex: Visuel (schémas, mindmaps), Auditif (podcasts, discussions), Kinesthésique (pratique, manipulation)..."
          value={formData.styleApprentissage || ''}
          onChange={(e) => setFormData({ ...formData, styleApprentissage: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Principale source de stress *
        </label>
        <textarea
          required
          className="input"
          rows={2}
          placeholder="Ex: Examens écrits, oral, charge de travail, prise de parole..."
          value={formData.sourceStress || ''}
          onChange={(e) => setFormData({ ...formData, sourceStress: e.target.value })}
        />
      </div>
    </div>
  )
}

function Step4Langues({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-master-dark mb-4">
        🌍 Compétences Linguistiques
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Niveau d'Anglais (CECRL) *
        </label>
        <select
          required
          className="input"
          value={formData.certifications?.anglaisNiveau || ''}
          onChange={(e) => setFormData({
            ...formData,
            certifications: { ...formData.certifications, anglaisNiveau: e.target.value }
          })}
        >
          <option value="">Sélectionner</option>
          <option value="A2">A2 - Élémentaire</option>
          <option value="B1">B1 - Intermédiaire</option>
          <option value="B2">B2 - Intermédiaire Avancé</option>
          <option value="C1">C1 - Avancé</option>
          <option value="C2">C2 - Maîtrise</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">TOEIC Score</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: 850/990"
            value={formData.certifications?.toeicScore || ''}
            onChange={(e) => setFormData({
              ...formData,
              certifications: { ...formData.certifications, toeicScore: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">TOEFL Score</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: 95/120"
            value={formData.certifications?.toeflScore || ''}
            onChange={(e) => setFormData({
              ...formData,
              certifications: { ...formData.certifications, toeflScore: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">IELTS Score</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: 7.5/9"
            value={formData.certifications?.ieltsScore || ''}
            onChange={(e) => setFormData({
              ...formData,
              certifications: { ...formData.certifications, ieltsScore: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cambridge English</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: CAE Grade A"
            value={formData.certifications?.cambridgeTest || ''}
            onChange={(e) => setFormData({
              ...formData,
              certifications: { ...formData.certifications, cambridgeTest: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">SAT Score Total</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: 1450/1600"
            value={formData.certifications?.satScoreTotal || ''}
            onChange={(e) => setFormData({
              ...formData,
              certifications: { ...formData.certifications, satScoreTotal: e.target.value }
            })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">ACT Score</label>
          <input
            type="text"
            className="input"
            placeholder="Ex: 32/36"
            value={formData.certifications?.actScoreComposite || ''}
            onChange={(e) => setFormData({
              ...formData,
              certifications: { ...formData.certifications, actScoreComposite: e.target.value }
            })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Autres Langues (optionnel)
        </label>
        <textarea
          className="input"
          rows={2}
          placeholder="Ex: Espagnol B2 (pratiqué en famille), Allemand A2..."
          value={formData.autresLanguesTexte || ''}
          onChange={(e) => setFormData({ ...formData, autresLanguesTexte: e.target.value })}
        />
      </div>
    </div>
  )
}

function Step5Aspirations({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-master-dark mb-4">
        🎯 Aspirations Post-Bac
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Filières souhaitées * (une par ligne)
        </label>
        <textarea
          required
          className="input"
          rows={4}
          placeholder="Ex:&#10;- Prépa MPSI&#10;- École d'ingénieur post-bac (INSA, UTC)&#10;- Université (PASS/L.AS)&#10;- BUT Informatique"
          value={formData.filieresSouhaitees?.[0] || ''}
          onChange={(e) => setFormData({ ...formData, filieresSouhaitees: [e.target.value] })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Niveau d'ambition *
        </label>
        <select
          required
          className="input"
          value={formData.niveauAmbition || ''}
          onChange={(e) => setFormData({ ...formData, niveauAmbition: e.target.value })}
        >
          <option value="">Sélectionner</option>
          <option value="Top 5 France">Top 5 France (X, ENS, HEC, etc.)</option>
          <option value="Top 15 France">Top 15 France</option>
          <option value="Top 50 France">Top 50 France</option>
          <option value="Établissements de bon niveau">Établissements de bon niveau</option>
          <option value="Toutes options">Toutes options</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Études à l'étranger envisagées ? *
        </label>
        <select
          required
          className="input"
          value={formData.etudesEtranger ? 'oui' : 'non'}
          onChange={(e) => setFormData({ ...formData, etudesEtranger: e.target.value === 'oui' })}
        >
          <option value="non">Non</option>
          <option value="oui">Oui</option>
        </select>
      </div>

      {formData.etudesEtranger && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Pays/Régions envisagés
          </label>
          <textarea
            className="input"
            rows={2}
            placeholder="Ex: USA, UK, Canada, Suisse, Pays-Bas..."
            value={formData.paysEnvisages?.join(', ') || ''}
            onChange={(e) => setFormData({
              ...formData,
              paysEnvisages: e.target.value.split(',').map(s => s.trim())
            })}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">
          Contraintes financières (optionnel)
        </label>
        <textarea
          className="input"
          rows={2}
          placeholder="Ex: Budget limité pour études à l'étranger, besoin de bourse..."
          value={formData.contraintesFinancieres || ''}
          onChange={(e) => setFormData({ ...formData, contraintesFinancieres: e.target.value })}
        />
      </div>
    </div>
  )
}

function Step6VieExtrascolaire({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-master-dark mb-4">
        🌟 Vie Extrascolaire & Soft Skills
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Activités extrascolaires * (une par ligne)
        </label>
        <textarea
          required
          className="input"
          rows={4}
          placeholder="Ex:&#10;- Piano (10 ans de pratique)&#10;- Football en club (niveau régional)&#10;- Bénévolat aux Restos du Cœur"
          value={formData.activitesExtrascolaires?.[0] || ''}
          onChange={(e) => setFormData({ ...formData, activitesExtrascolaires: [e.target.value] })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Excellence particulière (optionnel)
        </label>
        <textarea
          className="input"
          rows={3}
          placeholder="Ex: Capitaine de l'équipe de basket, médaille d'or aux Olympiades de maths, projet entrepreneurial..."
          value={formData.excellenceParticuliere || ''}
          onChange={(e) => setFormData({ ...formData, excellenceParticuliere: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          3 Principales Qualités Comportementales *
        </label>
        {[0, 1, 2].map((index) => (
          <input
            key={index}
            type="text"
            required
            className="input mb-2"
            placeholder={`Qualité ${index + 1} (Ex: Rigueur, Curiosité, Esprit d'équipe)`}
            value={formData.qualitesComportementales?.[index] || ''}
            onChange={(e) => {
              const newArray = [...(formData.qualitesComportementales || ['', '', ''])]
              newArray[index] = e.target.value
              setFormData({ ...formData, qualitesComportementales: newArray })
            }}
          />
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Accomplissement dont vous êtes le plus fier *
        </label>
        <textarea
          required
          className="input"
          rows={3}
          placeholder="Ex: Avoir obtenu 18/20 en maths au bac blanc, avoir organisé un événement caritatif qui a levé 5000€..."
          value={formData.accomplissementFier || ''}
          onChange={(e) => setFormData({ ...formData, accomplissementFier: e.target.value })}
        />
      </div>
    </div>
  )
}

