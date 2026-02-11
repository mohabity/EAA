# AccessiCheck — SaaS d'audit d'accessibilité web (EAA)
## Contexte
AccessiCheck est un SaaS d'audit d'accessibilité web pour la conformité à l'European
Accessibility Act (Directive UE 2019/882) ciblant le marché belge.
## Stack technique
- Next.js 14 (App Router, Server Components par défaut)
- TypeScript strict (pas de "any")
- Tailwind CSS (pas de CSS modules)
- Supabase (PostgreSQL + Auth + Row Level Security)
- Déploiement : Vercel
## Règles de code
- TOUT le code DOIT être accessible WCAG 2.1 AA (on vend de l'accessibilité !)
- Contrastes minimum 4.5:1 pour le texte, 3:1 pour les éléments graphiques
- Navigation 100% clavier, labels ARIA sur tous les éléments interactifs
- Pas de contenu qui dépend uniquement de la couleur
- Focus visible sur tous les éléments interactifs
- Interface bilingue FR/NL : jamais de texte en dur, utilise les clés i18n (next-intl)
- Composants React fonctionnels avec hooks
- "use client" seulement quand c'est nécessaire
- Commente les parties complexes en français
## Normes de référence
- EN 301 549 v3.2.1 (norme européenne harmonisée, basée sur WCAG 2.1/2.2 niveau AA)
- La norme EN 301 549 mappe vers les critères WCAG avec le préfixe "9." pour le web
  (ex: WCAG 1.1.1 → EN 301 549 clause 9.1.1.1)
## Base de données
- Supabase avec RLS activé — jamais de requête sans authentification
- Les violations ont des champs _fr et _nl pour les descriptions bilingues
- L'utilisateur a une région (Wallonie / Bruxelles / Flandre) qui affecte les subsides
## Secteurs cibles
- E-commerce (63 000+ boutiques en Belgique)
- Banques et services financiers
- Transports
## Contexte réglementaire
- L'EAA est en vigueur depuis le 28 juin 2025
- Sanctions en Belgique : jusqu'à 200 000€ ou 6% du CA
- ~94% des sites belges ne sont pas encore conformes
- Les micro-entreprises (<10 employés) ont un délai jusqu'au 28 juin 2030
## Workflow Git
- Commite après chaque feature fonctionnelle
- Messages de commit en français
- Crée une branche pour les changements importants
