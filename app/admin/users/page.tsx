'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Edit, Trash2, Shield, Mail, Calendar, Award } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  name: string | null
  status: string
  isSubscribed: boolean
  subscriptionType: string | null
  subscriptionEndDate: string | null
  totalMasteryPoints: number
  currentStreak: number
  createdAt: string
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur chargement utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchUsers()
        toast.success('Statut mis à jour !')
      } else {
        toast.error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la mise à jour')
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await fetchUsers()
        toast.success('Utilisateur supprimé !')
      } else {
        toast.error('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur lors de la suppression')
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (user.name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'ALL' || user.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      FREE: 'bg-gray-100 text-gray-800',
      DEMO: 'bg-blue-100 text-blue-800',
      PREMIUM: 'bg-purple-100 text-purple-800'
    }
    return styles[status as keyof typeof styles] || styles.FREE
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-master-dark flex items-center gap-3">
                <Shield className="w-8 h-8 text-blue-500" />
                Gestion des Utilisateurs
              </h1>
              <p className="text-gray-600 mt-2">
                {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par email ou nom..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filtre statut */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="FREE">FREE</option>
              <option value="DEMO">DEMO</option>
              <option value="PREMIUM">PREMIUM</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Liste des utilisateurs */}
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="card hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    {/* Infos utilisateur */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-lg text-master-dark">
                          {user.name || 'Sans nom'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{user.email}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Inscription
                          </p>
                          <p className="font-medium">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500 flex items-center gap-1">
                            <Award className="w-4 h-4" />
                            Points
                          </p>
                          <p className="font-medium">{user.totalMasteryPoints} PMU</p>
                        </div>
                        
                        <div>
                          <p className="text-gray-500">Streak</p>
                          <p className="font-medium">{user.currentStreak} jour{user.currentStreak > 1 ? 's' : ''}</p>
                        </div>
                        
                        {user.isSubscribed && (
                          <div>
                            <p className="text-gray-500">Abonnement</p>
                            <p className="font-medium text-purple-600">
                              {user.subscriptionType === 'ANNUAL' ? 'Annuel' : 'Mensuel'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {/* Changer statut */}
                      <select
                        value={user.status}
                        onChange={(e) => handleChangeStatus(user.id, e.target.value)}
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-purple-500 focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="FREE">FREE</option>
                        <option value="DEMO">DEMO</option>
                        <option value="PREMIUM">PREMIUM</option>
                      </select>

                      {/* Supprimer */}
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className="card text-center py-12">
                  <p className="text-gray-500">Aucun utilisateur trouvé</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-gradient-to-br from-gray-100 to-gray-200">
                <p className="text-sm text-gray-600 mb-1">FREE</p>
                <p className="text-3xl font-bold text-gray-800">
                  {users.filter(u => u.status === 'FREE').length}
                </p>
              </div>
              <div className="card bg-gradient-to-br from-blue-100 to-blue-200">
                <p className="text-sm text-blue-600 mb-1">DEMO</p>
                <p className="text-3xl font-bold text-blue-800">
                  {users.filter(u => u.status === 'DEMO').length}
                </p>
              </div>
              <div className="card bg-gradient-to-br from-purple-100 to-purple-200">
                <p className="text-sm text-purple-600 mb-1">PREMIUM</p>
                <p className="text-3xl font-bold text-purple-800">
                  {users.filter(u => u.status === 'PREMIUM').length}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

