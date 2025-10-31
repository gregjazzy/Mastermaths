// Composant de tableau de notes pour le bilan d'orientation
import { useState } from 'react'

interface NotesTableauProps {
  annee: 'premiere' | 'terminale'
  formData: any
  setFormData: (data: any) => void
}

export function NotesTableau({ annee, formData, setFormData }: NotesTableauProps) {
  const [activeT rimestre, setActiveTrimestre] = useState<'t1' | 't2' | 't3'>('t1')
  
  const data = formData[annee] || { t1: {}, t2: {}, t3: {} }
  const currentData = data[activeTrimestre] || {}
  
  const updateField = (field: string, value: string) => {
    setFormData({
      ...formData,
      [annee]: {
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
    { key: 'lv1', label: 'LV1', required: true },
    { key: 'lv2', label: 'LV2', required: false },
    { key: 'specialite1', label: currentData.specialite1Nom || 'Spécialité 1', required: true, editable: true },
    { key: 'specialite2', label: currentData.specialite2Nom || 'Spécialité 2', required: true, editable: true },
  ]
  
  if (annee === 'premiere') {
    matieres.push({ 
      key: 'specialite3', 
      label: currentData.specialite3Nom || 'Spécialité 3', 
      required: false, 
      editable: true 
    })
  }
  
  return (
    <div className="space-y-4">
      {/* Sélection du trimestre */}
      <div className="flex gap-2 mb-4">
        {['t1', 't2', 't3'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setActiveTrimestre(t as 't1' | 't2' | 't3')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTrimestre === t
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Trimestre {t.replace('t', '')}
          </button>
        ))}
      </div>
      
      {/* Tableau de notes */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Matière</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Note /20</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold">Classement</th>
              <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-sm text-gray-600">
                Moy. Classe <span className="text-xs">(optionnel)</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {matieres.map((matiere) => (
              <tr key={matiere.key} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2 font-medium">
                  {matiere.editable ? (
                    <input
                      type="text"
                      className="input text-sm"
                      placeholder="Nom de la spécialité"
                      value={currentData[`${matiere.key}Nom`] || ''}
                      onChange={(e) => updateField(`${matiere.key}Nom`, e.target.value)}
                      required={matiere.required}
                    />
                  ) : (
                    matiere.label
                  )}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    className="input text-center w-20"
                    placeholder="--"
                    value={currentData[`${matiere.key}Note`] || ''}
                    onChange={(e) => updateField(`${matiere.key}Note`, e.target.value)}
                    required={matiere.required}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="text"
                    className="input text-center w-24"
                    placeholder="ex: 5/30"
                    value={currentData[`${matiere.key}Classement`] || ''}
                    onChange={(e) => updateField(`${matiere.key}Classement`, e.target.value)}
                    required={matiere.required}
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    className="input text-center w-20 bg-gray-50"
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
      
      <div className="text-xs text-gray-500 mt-2">
        💡 Les moyennes de classe sont optionnelles mais permettent une analyse comparative plus précise
      </div>
    </div>
  )
}

