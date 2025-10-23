'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2, Save } from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string | null
  accessLevel: string
  order: number
  _count?: {
    chapters: number
  }
}

export default function CoursesAdminPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    accessLevel: 'FREE' as 'FREE' | 'DEMO' | 'PREMIUM',
    order: 1
  })

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/admin/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses)
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingCourse 
        ? `/api/admin/courses/${editingCourse.id}`
        : '/api/admin/courses'
      
      const response = await fetch(url, {
        method: editingCourse ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        await fetchCourses()
        resetForm()
        alert(editingCourse ? 'Cours modifié !' : 'Cours créé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description || '',
      accessLevel: course.accessLevel as any,
      order: course.order
    })
    setShowForm(true)
  }

  const handleDelete = async (courseId: string) => {
    if (!confirm('Supprimer ce cours et tout son contenu ?')) return

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchCourses()
        alert('Cours supprimé !')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      accessLevel: 'FREE',
      order: courses.length + 1
    })
    setEditingCourse(null)
    setShowForm(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-master-turquoise"></div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-master-turquoise hover:underline flex items-center gap-2 mb-2">
              <ArrowLeft className="w-4 h-4" />
              Retour admin
            </Link>
            <h1 className="text-3xl font-bold text-master-dark">
              📚 Gestion des Cours
            </h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau cours
          </button>
        </div>

        {/* Formulaire */}
        {showForm && (
          <div className="card mb-8 bg-blue-50 border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-4">
              {editingCourse ? '✏️ Modifier le cours' : '➕ Créer un cours'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre du cours *</label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Ex: Mathématiques Terminale S"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Description du cours..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Niveau d'accès *</label>
                  <select
                    required
                    className="input"
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({...formData, accessLevel: e.target.value as any})}
                  >
                    <option value="FREE">🆓 FREE (Gratuit)</option>
                    <option value="DEMO">⚡ DEMO (29€/mois)</option>
                    <option value="PREMIUM">👑 PREMIUM (79€/mois)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    className="input"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  {editingCourse ? 'Mettre à jour' : 'Créer le cours'}
                </button>
                <button type="button" onClick={resetForm} className="btn-outline">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Liste des cours */}
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-500 mb-4">Aucun cours créé</p>
              <button onClick={() => setShowForm(true)} className="btn-primary">
                Créer le premier cours
              </button>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="card hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-master-dark">
                        {course.title}
                      </h3>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${course.accessLevel === 'FREE' ? 'bg-gray-200 text-gray-700' : ''}
                        ${course.accessLevel === 'DEMO' ? 'bg-blue-200 text-blue-700' : ''}
                        ${course.accessLevel === 'PREMIUM' ? 'bg-amber-200 text-amber-700' : ''}
                      `}>
                        {course.accessLevel === 'FREE' && '🆓 FREE'}
                        {course.accessLevel === 'DEMO' && '⚡ DEMO'}
                        {course.accessLevel === 'PREMIUM' && '👑 PREMIUM'}
                      </span>
                      <span className="text-sm text-gray-500">
                        Ordre: {course.order}
                      </span>
                    </div>
                    
                    {course.description && (
                      <p className="text-gray-600 mb-3">{course.description}</p>
                    )}
                    
                    <p className="text-sm text-gray-500">
                      📖 {course._count?.chapters || 0} chapitres • ID: {course.id}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


