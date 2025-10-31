'use client'

import { useState } from 'react'
import LeaderboardWidget from '@/components/LeaderboardWidget'
import Navbar from '@/components/Navbar'

type LeaderboardType = 'historical' | 'monthly' | 'weekly'

export default function HallOfFamePage() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>('historical')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500">
      <Navbar />
      <div className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🏆 Hall of Fame Master Maths
          </h1>
          <p className="text-white/80">
            Les meilleurs élèves de Master Maths - Classements basés sur les Points de Maîtrise (PMU)
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-1 inline-flex gap-1">
            <button
              onClick={() => setActiveTab('historical')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${activeTab === 'historical'
                  ? 'bg-white text-master-dark shadow-lg'
                  : 'text-white hover:bg-white/10'
                }
              `}
            >
              🏆 Historique
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${activeTab === 'monthly'
                  ? 'bg-white text-master-dark shadow-lg'
                  : 'text-white hover:bg-white/10'
                }
              `}
            >
              📅 Mensuel
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`
                px-6 py-3 rounded-lg font-semibold transition-all
                ${activeTab === 'weekly'
                  ? 'bg-white text-master-dark shadow-lg'
                  : 'text-white hover:bg-white/10'
                }
              `}
            >
              ⚡ Hebdomadaire
            </button>
          </div>
        </div>

        {/* Info boxes */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">🥇</div>
            <h3 className="font-bold text-white mb-1">Top 10 Historique</h3>
            <p className="text-white/70 text-sm">
              Accès à un cours particulier gratuit mensuel
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-white mb-1">Top 5% Mensuel</h3>
            <p className="text-white/70 text-sm">
              Cours particulier gratuit + badge exclusif
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-3xl mb-2">⚡</div>
            <h3 className="font-bold text-white mb-1">Champion Hebdo</h3>
            <p className="text-white/70 text-sm">
              Reconnaissance et motivation constante
            </p>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          {activeTab === 'historical' && (
            <LeaderboardWidget type="historical" limit={100} />
          )}
          {activeTab === 'monthly' && (
            <LeaderboardWidget type="monthly" limit={100} />
          )}
          {activeTab === 'weekly' && (
            <LeaderboardWidget type="weekly" limit={100} />
          )}
        </div>

        {/* Discord Link */}
        <div className="mt-8 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 inline-block">
            <h3 className="text-white font-bold text-xl mb-2">
              💬 Rejoignez la communauté Discord
            </h3>
            <p className="text-white/70 mb-4">
              Discutez avec les meilleurs élèves, partagez vos astuces et challenges
            </p>
            <a
              href="https://discord.gg/mastermaths"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg"
            >
              Rejoindre Discord
            </a>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 text-white">
          <h3 className="font-bold text-lg mb-3">Comment gagner des PMU ?</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="mb-2"><span className="font-semibold">📹 Vidéos :</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>100 PMU pour une vidéo complétée (95%+)</li>
                <li>1 PMU par % de progression</li>
              </ul>
            </div>
            <div>
              <p className="mb-2"><span className="font-semibold">📝 QCM :</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>200 PMU pour 100% de réussite</li>
                <li>150 PMU pour 80-99%</li>
                <li>100 PMU pour 50-79%</li>
              </ul>
            </div>
            <div>
              <p className="mb-2"><span className="font-semibold">🏅 Badges :</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>50-500 PMU selon la rareté</li>
                <li>1000 PMU pour badges secrets</li>
              </ul>
            </div>
            <div>
              <p className="mb-2"><span className="font-semibold">🔥 Connexions :</span></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>10 PMU par jour de streak</li>
                <li>Bonus progressifs pour longues séries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}


