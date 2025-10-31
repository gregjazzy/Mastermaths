# 🎮 Intégration Discord - Master Maths

## ✅ Ce que tu as déjà
- Discord communautaire existant
- Lien Discord dans le Dashboard (ligne 217-229 DashboardStudent.tsx)

---

## 🚀 Ce qu'on peut faire MAINTENANT (30 min - 2h)

### 1. **Widget Discord Intégré** (30 min)
Au lieu d'un simple lien, intègre le Discord directement dans l'app.

#### Implémentation
```tsx
// components/DiscordWidget.tsx
'use client'

export default function DiscordWidget() {
  return (
    <div className="card">
      <h3 className="font-bold text-xl mb-4">💬 Communauté Discord</h3>
      <iframe 
        src="https://discord.com/widget?id=YOUR_SERVER_ID&theme=dark" 
        width="100%" 
        height="500" 
        allowtransparency="true" 
        frameBorder="0" 
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        className="rounded-lg"
      />
    </div>
  )
}
```

**Où l'ajouter** :
- Dashboard (onglet "Communauté")
- Page dédiée `/communaute`
- Sidebar sur les pages de leçons

---

### 2. **Notifications Discord → App** (1h)
Afficher les derniers messages Discord dans l'app.

#### Via Discord Webhooks
```tsx
// app/api/discord/recent/route.ts
export async function GET() {
  const response = await fetch(
    `https://discord.com/api/v10/channels/YOUR_CHANNEL_ID/messages?limit=5`,
    {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
      }
    }
  )
  
  const messages = await response.json()
  return Response.json(messages)
}
```

```tsx
// components/DiscordFeed.tsx
'use client'

export default function DiscordFeed() {
  const [messages, setMessages] = useState([])
  
  useEffect(() => {
    fetch('/api/discord/recent')
      .then(r => r.json())
      .then(setMessages)
  }, [])
  
  return (
    <div className="space-y-3">
      {messages.map(msg => (
        <div key={msg.id} className="bg-[#5865F2]/10 p-3 rounded">
          <p className="font-semibold">{msg.author.username}</p>
          <p className="text-sm">{msg.content}</p>
        </div>
      ))}
    </div>
  )
}
```

---

### 3. **Bouton "Aide Rapide" sur Leçons** (30 min)
Lien direct vers canal #aide du Discord depuis chaque leçon.

```tsx
// Dans LessonViewer.tsx
<button 
  onClick={() => window.open('https://discord.gg/YOUR_INVITE?channel=AIDE_CHANNEL_ID', '_blank')}
  className="btn-secondary"
>
  💬 Poser une question sur Discord
</button>
```

---

### 4. **Rôles Discord Synchronisés** (2h)
Donner des rôles Discord selon les badges/niveau dans l'app.

#### Via Discord OAuth2 + API
```typescript
// Quand l'utilisateur connecte son Discord
async function syncDiscordRole(userId: string, discordId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { user_badges: true }
  })
  
  // Définir les rôles selon les badges
  const roles = []
  if (user.totalMasteryPoints > 5000) {
    roles.push('MASTER_ROLE_ID') // Rôle "Master"
  }
  if (user.currentStreak > 30) {
    roles.push('STREAK_MASTER_ROLE_ID')
  }
  
  // Ajouter les rôles via Discord API
  await fetch(
    `https://discord.com/api/v10/guilds/YOUR_SERVER_ID/members/${discordId}/roles/${roleId}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
      }
    }
  )
}
```

---

## 💎 Ce qu'on peut faire PLUS TARD (1-2 semaines)

### 5. **Bot Discord Intégré à l'App**
Un bot qui répond avec les données de l'app.

#### Commandes Discord
```
/progress @user → Affiche la progression d'un élève
/leaderboard → Top 10 du classement
/streak → Ton streak actuel
/next-lesson → Recommande la prochaine leçon
/stats → Tes statistiques globales
```

#### Implémentation (Discord.js)
```javascript
// bot/commands/progress.js
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('progress')
    .setDescription('Affiche ta progression'),
  async execute(interaction) {
    // Récupérer les données via API Master Maths
    const response = await fetch(`https://mastermaths.fr/api/discord/user/${interaction.user.id}`)
    const data = await response.json()
    
    await interaction.reply({
      embeds: [{
        title: `📊 Progression de ${interaction.user.username}`,
        fields: [
          { name: '🏆 PMU Total', value: data.totalMasteryPoints.toString(), inline: true },
          { name: '🔥 Streak', value: `${data.currentStreak} jours`, inline: true },
          { name: '📚 Leçons', value: `${data.lessonsCompleted}/150`, inline: true }
        ],
        color: 0x00BCD4
      }]
    })
  }
}
```

---

### 6. **Notifications Bidirectionnelles**
App → Discord et Discord → App

#### App → Discord
```typescript
// Quand un élève débloque un badge Légendaire
async function notifyDiscord(userId: string, badge: Badge) {
  await fetch(process.env.DISCORD_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: '🏆 Badge Légendaire Débloqué !',
        description: `${user.name} vient de débloquer **${badge.name}** !`,
        color: 0xFFD700,
        thumbnail: { url: badge.iconUrl }
      }]
    })
  })
}
```

#### Discord → App
```typescript
// Webhook Discord qui notifie l'app
export async function POST(request: Request) {
  const { user_id, event_type } = await request.json()
  
  if (event_type === 'new_question') {
    // Créer une notification dans l'app
    await prisma.notification.create({
      data: {
        userId: user_id,
        type: 'DISCORD_MENTION',
        message: 'Tu as été mentionné sur Discord !',
        link: discordMessageUrl
      }
    })
  }
}
```

---

## 🎯 Roadmap Discord Integration

### Phase 1 : Cette Semaine (2-3h)
- ✅ Widget Discord sur Dashboard
- ✅ Bouton "Aide Discord" sur chaque leçon
- ✅ Feed Discord des derniers messages

**Résultat** : Discord visible et accessible dans l'app

---

### Phase 2 : Semaine Prochaine (1-2 jours)
- ✅ Rôles Discord synchronisés avec badges
- ✅ Authentification Discord OAuth

**Résultat** : Communauté unifiée App ↔ Discord

---

### Phase 3 : Mois Prochain (1 semaine)
- ✅ Bot Discord avec commandes
- ✅ Notifications bidirectionnelles
- ✅ Leaderboard Discord

**Résultat** : Écosystème complet et engageant

---

## 📊 Impact sur le Score

| Feature | Avant | Avec Discord Intégré |
|---------|-------|---------------------|
| Communauté | ❌ 0/10 | ✅ 9/10 |
| Engagement | 🟡 7/10 | ✅ 10/10 |
| Rétention | 🟡 7/10 | ✅ 9/10 |
| Viralité | 🟡 5/10 | ✅ 9/10 |

**Score Global** : 57/90 → **73/90** (+16 points !)

Avec Discord intégré, **tu passes devant Khan Academy** ! 🏆

---

## 🚀 Ce qu'on fait MAINTENANT ?

### Quick Win #1 : Widget Discord (20 min)
Je peux l'ajouter maintenant sur le Dashboard ?

### Quick Win #2 : Bouton "Aide Discord" (10 min)
Sur chaque page de leçon ?

### Quick Win #3 : Améliorer le lien Discord actuel (5 min)
Ajouter un compteur "🟢 245 membres en ligne" ?

**Dis-moi ce que tu veux prioriser ! 🎯**

