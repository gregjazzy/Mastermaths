'use client'

import { useState } from 'react'

interface Step2PerformanceProps {
  formData: any
  setFormData: (data: any) => void
}

export function Step2Performance({ formData, setFormData }: Step2PerformanceProps) {
  const [activeAnnee, setActiveAnnee] = useState<'premiere' | 'terminale'>('premiere')
  const [activeTrimestre, setActiveTrimestre] = useState<'t1' | 't2' | 't3'>('t1')
  
  const data = formData[activeAnnee] || { t1: {}, t2: {}, t3: {} }
  const currentData = data[activeTrimestre] || {}
  
  const updateField = (field: string, value: string) => {
    setFormData({
      ...formData,
      [activeAnnee]: {
        ...data,
        [activeTrimestre]: {
          ...currentData,
          [field]: value
        }
      }
    })
  }
  
  const matieres = [
    { key: 'moyenneGenerale', label: 'Moyenne Générale', required: true },
    { key: 'maths', label: 'Mathématiques', required: true },
    { key: 'lv1', label: 'LV1 (Anglais)', required: true },
    { key: 'lv2', label: 'LV2', required: false },
    { key: 'specialite1', label: 'Spécialité 1', required: true, editable: true, nameField: 'specialite1Nom' },
    { key: 'specialite2', label: 'Spécialité 2', required: true, editable: true, nameField: 'specialite2Nom' },
  ]
  
  if (activeAnnee === 'premiere') {
    matieres.push({ 
      key: 'specialite3', 
      label: 'Spécialité 3', 
      required: false, 
      editable: true,
      nameField: 'specialite3Nom'
    })
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-master-dark mb-4">
        📊 Performance Académique
      </h2>
      
      <p className="text-sm text-gray-600">
        Renseignez vos notes et classements par trimestre. Les moyennes de classe sont optionnelles mais permettent une analyse plus précise.
      </p>
      
      {/* Sélection Année */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'premiere', label: 'Première' },
          { key: 'terminale', label: 'Terminale' }
        ].map((annee) => (
          <button
            key={annee.key}
            type="button"
            onClick={() => setActiveAnnee(annee.key as 'premiere' | 'terminale')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeAnnee === annee.key
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {annee.label}
          </button>
        ))}
      </div>
      
      {/* Sélection Trimestre */}
      <div className="flex gap-2">
        {['t1', 't2', 't3'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTrimestre(t as 't1' | 't2' | 't3')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTrimestre === t
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Trimestre {t.replace('t', '')}
          </button>
        ))}
      </div>
      
      {/* Tableau de notes */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-blue-50">
                <th className="border-b border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">Matière</th>
                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Note /20</th>
                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">Classement</th>
                <th className="border-b border-gray-200 px-4 py-3 text-center font-semibold text-gray-600 text-sm">
                  Moy. Classe <span className="text-xs font-normal">(opt.)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {matieres.map((matiere, index) => (
                <tr key={matiere.key} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="border-b border-gray-200 px-4 py-3 font-medium text-gray-900">
                    {matiere.editable ? (
                      <input
                        type="text"
                        className="input text-sm w-full"
                        placeholder={`Ex: ${matiere.key === 'specialite1' ? 'Physique-Chimie' : matiere.key === 'specialite2' ? 'SVT' : 'NSI'}`}
                        value={currentData[matiere.nameField!] || ''}
                        onChange={(e) => updateField(matiere.nameField!, e.target.value)}
                        required={matiere.required}
                      />
                    ) : (
                      <span>{matiere.label}</span>
                    )}
                  </td>
                  <td className="border-b border-gray-200 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      className="input text-center w-20 mx-auto"
                      placeholder="--"
                      value={currentData[`${matiere.key}Note`] || ''}
                      onChange={(e) => updateField(`${matiere.key}Note`, e.target.value)}
                      required={matiere.required}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-2">
                    <input
                      type="text"
                      className="input text-center w-28 mx-auto"
                      placeholder="ex: 5/32"
                      value={currentData[`${matiere.key}Classement`] || ''}
                      onChange={(e) => updateField(`${matiere.key}Classement`, e.target.value)}
                      required={matiere.required}
                    />
                  </td>
                  <td className="border-b border-gray-200 px-2 py-2">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="20"
                      className="input text-center w-20 mx-auto bg-gray-50"
                      placeholder="--"
                      value={currentData[`${matiere.key}NoteClasse`] || ''}
                      onChange={(e) => updateField(`${matiere.key}NoteClasse`, e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-2xl">💡</div>
        <div className="flex-1 text-sm text-gray-700">
          <p className="font-semibold mb-1">Conseils de saisie :</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Renseignez vos notes avec 2 décimales si nécessaire (ex: 15.75)</li>
            <li>Pour le classement, indiquez votre rang sur le total d'élèves (ex: 8/32)</li>
            <li>Les moyennes de classe permettent une analyse comparative précise (optionnel mais recommandé)</li>
            <li>Remplissez les 3 trimestres des deux années pour un bilan complet</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

