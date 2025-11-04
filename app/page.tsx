import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, FileText, Trophy, Compass, Rocket, MessageCircle } from 'lucide-react'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/cours')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-master-dark via-master-blue to-master-turquoise">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/10 backdrop-blur-md z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo Master Maths - Sans bordure */}
            <div className="relative w-16 h-16 bg-white rounded-xl shadow-lg p-3 flex-shrink-0">
              <Image
                src="/images/master-maths-logo.svg"
                alt="Master Maths"
                fill
                className="object-contain"
                priority
                quality={100}
              />
            </div>
            <h1 className="text-3xl font-bold">
              <span className="text-white">Master</span>
              <span className="text-master-turquoise-light ml-2">Maths</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-white hover:text-master-turquoise-light transition-colors">
              Se connecter
            </Link>
            <Link href="/auth/register" className="bg-master-turquoise hover:bg-master-turquoise-dark text-white px-6 py-2 rounded-lg font-semibold transition-all">
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Maths : Objectif Excellence
          </h1>
          <h2 className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            La plateforme du Professeur de référence pour les familles exigeantes.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register"
              className="bg-white text-master-dark hover:bg-gray-100 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
            >
              Commencer gratuitement
            </Link>
            <Link 
              href="/upgrade"
              className="bg-master-turquoise hover:bg-master-turquoise-dark text-white px-8 py-4 rounded-lg font-bold text-lg transition-all"
            >
              Voir les offres
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ligne 1 - Position 1 : Catalogue & Fiches */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 bg-master-turquoise rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Catalogue & Fiches de Révision 📘
              </h3>
              <p className="text-white/80 text-sm">
                Cours et exercices vidéos structurés par chapitre et par méthode, avec accès aux synthèses et aux fiches de révision.
              </p>
            </div>

            {/* Ligne 1 - Position 2 : Correction DS */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 bg-master-turquoise rounded-full flex items-center justify-center mb-4">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Correction Détaillée des DS 📝
              </h3>
              <p className="text-white/80 text-sm">
                Correction précise de vos Devoirs Surveillés pour identifier les erreurs et les axes de progression.
              </p>
            </div>

            {/* Ligne 1 - Position 3 : Bilan & Roadmap */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 bg-master-turquoise rounded-full flex items-center justify-center mb-4">
                <Compass className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Bilan Mensuel & Roadmap 🧭
              </h3>
              <p className="text-white/80 text-sm">
                Bilan de progression mensuel détaillé, tableau de bord (roadmap) pour une vision globale et suivi personnalisé.
              </p>
            </div>

            {/* Ligne 2 - Position 1 : Orientation */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 bg-master-turquoise rounded-full flex items-center justify-center mb-4">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Orientation Post-Bac & IA 🚀
              </h3>
              <p className="text-white/80 text-sm">
                Conseils d'orientation post-bac personnalisés et analyse des métiers face aux enjeux de l'IA.
              </p>
            </div>

            {/* Ligne 2 - Position 2 : Banque de sujets */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 bg-master-turquoise rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Banque de Sujets d'Élite 🏆
              </h3>
              <p className="text-white/80 text-sm">
                Accès exclusif aux sujets des meilleurs lycées pour un entraînement intensif en conditions d'examen.
              </p>
            </div>

            {/* Ligne 2 - Position 3 : Support */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="w-14 h-14 bg-master-turquoise rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Support Prof & Communauté 💬
              </h3>
              <p className="text-white/80 text-sm">
                Lives Q/R hebdomadaires et support continu via le Forum Discord pour une aide immédiate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center bg-white/10 backdrop-blur-md rounded-2xl p-12 border border-white/20">
          <h2 className="text-4xl font-bold text-white mb-6">
            Prêt à commencer ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Rejoignez des milliers d'étudiants qui excellent en mathématiques avec Master Maths
          </p>
          <Link 
            href="/auth/register"
            className="inline-block bg-master-turquoise hover:bg-master-turquoise-dark text-white px-12 py-4 rounded-lg font-bold text-lg transition-all shadow-xl hover:shadow-2xl"
          >
            Créer mon compte gratuitement
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/20">
        <div className="max-w-6xl mx-auto text-center text-white/70">
          <p>&copy; 2024 Master Maths. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}

