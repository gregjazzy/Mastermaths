import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, TrendingUp, Award } from 'lucide-react'

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
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Maîtrisez les mathématiques
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto">
            La plateforme d'excellence en Maths pour le lycée par le Prof des familles exigeantes
          </p>
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
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-master-turquoise rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Cours structurés
              </h3>
              <p className="text-white/80">
                Une arborescence claire : Cours → Chapitres → Sous-chapitres → Leçons. 
                Navigation intuitive pour un apprentissage progressif.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-master-turquoise rounded-full flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Suivi détaillé
              </h3>
              <p className="text-white/80">
                Suivez votre progression vidéo par vidéo, QCM par QCM. 
                Visualisez vos forces et identifiez les points à améliorer.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="w-16 h-16 bg-master-turquoise rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Corrections vidéo
              </h3>
              <p className="text-white/80">
                Des vidéos de correction automatiquement déclenchées quand vous en avez besoin. 
                Comprenez vos erreurs et progressez rapidement.
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

