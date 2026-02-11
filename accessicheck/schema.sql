-- ============================================================================
-- AccessiCheck — Schéma Supabase (PostgreSQL)
-- SaaS d'audit d'accessibilité web pour l'European Accessibility Act (EAA)
-- ============================================================================

-- ============================================================================
-- 1. EXTENSIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. TYPES ENUM
-- ============================================================================

CREATE TYPE region AS ENUM ('wallonie', 'bruxelles', 'flandre');
CREATE TYPE plan_tier AS ENUM ('starter', 'pro', 'enterprise');
CREATE TYPE language AS ENUM ('fr', 'nl');
CREATE TYPE audit_status AS ENUM ('pending', 'running', 'completed', 'failed');
CREATE TYPE violation_impact AS ENUM ('critical', 'major', 'minor');
CREATE TYPE violation_status AS ENUM ('new', 'in_progress', 'fixed', 'ignored');
CREATE TYPE declaration_status AS ENUM ('draft', 'published');
CREATE TYPE conformity_level AS ENUM ('full', 'partial', 'non_compliant');
CREATE TYPE org_role AS ENUM ('owner', 'admin', 'member');

-- ============================================================================
-- 3. FONCTIONS
-- ============================================================================

-- Trigger réutilisable : met à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 4. TABLES
-- ============================================================================

-- 4.1 Profiles (extension de auth.users)
CREATE TABLE public.profiles (
  id                 UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name          TEXT        NOT NULL DEFAULT '',
  preferred_language language    NOT NULL DEFAULT 'fr',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Organizations
CREATE TABLE public.organizations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  website    TEXT,
  region     region      NOT NULL,
  plan       plan_tier   NOT NULL DEFAULT 'starter',
  language   language    NOT NULL DEFAULT 'fr',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.3 Organization Members (jonction users ↔ orgs)
CREATE TABLE public.organization_members (
  id              UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID     NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id         UUID     NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role            org_role NOT NULL DEFAULT 'member',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE(organization_id, user_id)
);

-- 4.4 Sites
CREATE TABLE public.sites (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID        NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name            TEXT        NOT NULL,
  url             TEXT        NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.5 Audits
CREATE TABLE public.audits (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id        UUID         NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  status         audit_status NOT NULL DEFAULT 'pending',
  score          SMALLINT     CHECK (score >= 0 AND score <= 100),
  critical_count INTEGER      NOT NULL DEFAULT 0,
  major_count    INTEGER      NOT NULL DEFAULT 0,
  minor_count    INTEGER      NOT NULL DEFAULT 0,
  pages_scanned  INTEGER      NOT NULL DEFAULT 0,
  started_at     TIMESTAMPTZ,
  completed_at   TIMESTAMPTZ,
  created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- 4.6 Pages (résultats immuables — pas de updated_at)
CREATE TABLE public.pages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id    UUID        NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  title       TEXT,
  status_code SMALLINT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.7 Violations
CREATE TABLE public.violations (
  id                UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id          UUID             NOT NULL REFERENCES public.audits(id) ON DELETE CASCADE,
  page_id           UUID             NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  axe_rule_id       TEXT             NOT NULL,
  wcag_criterion    TEXT             NOT NULL,
  en_clause         TEXT             NOT NULL,
  impact            violation_impact NOT NULL,
  description_fr    TEXT             NOT NULL,
  description_nl    TEXT             NOT NULL,
  recommendation_fr TEXT             NOT NULL DEFAULT '',
  recommendation_nl TEXT             NOT NULL DEFAULT '',
  html_snippet      TEXT,
  css_selector      TEXT,
  status            violation_status NOT NULL DEFAULT 'new',
  created_at        TIMESTAMPTZ      NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ      NOT NULL DEFAULT now()
);

-- 4.8 Declarations
CREATE TABLE public.declarations (
  id               UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id          UUID               NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  audit_id         UUID               REFERENCES public.audits(id) ON DELETE SET NULL,
  version          INTEGER            NOT NULL DEFAULT 1,
  status           declaration_status NOT NULL DEFAULT 'draft',
  language         language           NOT NULL DEFAULT 'fr',
  conformity_level conformity_level   NOT NULL DEFAULT 'non_compliant',
  content_html     TEXT               NOT NULL DEFAULT '',
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ        NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ        NOT NULL DEFAULT now()
);

-- ============================================================================
-- 5. FONCTIONS DEPENDANTES DES TABLES
-- ============================================================================

-- Trigger : crée un profil automatiquement à l'inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, preferred_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE((NEW.raw_user_meta_data ->> 'language')::public.language, 'fr')
  );
  RETURN NEW;
END;
$$;

-- Fonction RLS : retourne les IDs d'organisations du user courant
CREATE OR REPLACE FUNCTION public.get_user_org_ids()
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT organization_id
  FROM public.organization_members
  WHERE user_id = auth.uid();
$$;

-- RPC : créer une organisation + membership owner atomiquement
CREATE OR REPLACE FUNCTION public.create_organization(
  org_name TEXT,
  org_website TEXT DEFAULT NULL,
  org_region region DEFAULT 'bruxelles',
  org_plan plan_tier DEFAULT 'starter',
  org_language language DEFAULT 'fr'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  new_org_id uuid;
BEGIN
  INSERT INTO public.organizations (name, website, region, plan, language)
  VALUES (org_name, org_website, org_region, org_plan, org_language)
  RETURNING id INTO new_org_id;

  INSERT INTO public.organization_members (organization_id, user_id, role)
  VALUES (new_org_id, auth.uid(), 'owner');

  RETURN new_org_id;
END;
$$;

-- ============================================================================
-- 6. TRIGGERS
-- ============================================================================

-- updated_at automatique sur les tables modifiables
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.sites
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.audits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.violations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.declarations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Création automatique du profil à l'inscription
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. INDEX
-- ============================================================================

-- Index sur les clés étrangères
CREATE INDEX idx_org_members_org_id ON public.organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_sites_org_id ON public.sites(organization_id);
CREATE INDEX idx_audits_site_id ON public.audits(site_id);
CREATE INDEX idx_pages_audit_id ON public.pages(audit_id);
CREATE INDEX idx_violations_audit_id ON public.violations(audit_id);
CREATE INDEX idx_violations_page_id ON public.violations(page_id);
CREATE INDEX idx_declarations_site_id ON public.declarations(site_id);
CREATE INDEX idx_declarations_audit_id ON public.declarations(audit_id);

-- Index d'optimisation des requêtes fréquentes
CREATE INDEX idx_audits_site_status ON public.audits(site_id, status);
CREATE INDEX idx_audits_site_created ON public.audits(site_id, created_at DESC);
CREATE INDEX idx_violations_audit_status ON public.violations(audit_id, status);
CREATE INDEX idx_violations_audit_impact ON public.violations(audit_id, impact);
CREATE INDEX idx_violations_wcag ON public.violations(wcag_criterion);
CREATE INDEX idx_pages_audit_url ON public.pages(audit_id, url);

-- Index unique partiel : 1 seule déclaration publiée par langue par site
CREATE UNIQUE INDEX idx_declarations_one_published_per_lang
  ON public.declarations(site_id, language)
  WHERE status = 'published';

-- ============================================================================
-- 8. ROW LEVEL SECURITY
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.declarations ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.organizations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members FORCE ROW LEVEL SECURITY;
ALTER TABLE public.sites FORCE ROW LEVEL SECURITY;
ALTER TABLE public.audits FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pages FORCE ROW LEVEL SECURITY;
ALTER TABLE public.violations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.declarations FORCE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------------
-- 8.1 Profiles
-- ---------------------------------------------------------------------------

CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ---------------------------------------------------------------------------
-- 8.2 Organizations
-- ---------------------------------------------------------------------------

CREATE POLICY "organizations_select" ON public.organizations
  FOR SELECT USING (id IN (SELECT public.get_user_org_ids()));

CREATE POLICY "organizations_insert" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "organizations_update" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "organizations_delete" ON public.organizations
  FOR DELETE USING (
    id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- ---------------------------------------------------------------------------
-- 8.3 Organization Members
-- ---------------------------------------------------------------------------

CREATE POLICY "org_members_select" ON public.organization_members
  FOR SELECT USING (organization_id IN (SELECT public.get_user_org_ids()));

CREATE POLICY "org_members_insert" ON public.organization_members
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "org_members_update" ON public.organization_members
  FOR UPDATE USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

CREATE POLICY "org_members_delete" ON public.organization_members
  FOR DELETE USING (
    user_id = auth.uid()
    OR organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- ---------------------------------------------------------------------------
-- 8.4 Sites
-- ---------------------------------------------------------------------------

CREATE POLICY "sites_select" ON public.sites
  FOR SELECT USING (organization_id IN (SELECT public.get_user_org_ids()));

CREATE POLICY "sites_insert" ON public.sites
  FOR INSERT WITH CHECK (organization_id IN (SELECT public.get_user_org_ids()));

CREATE POLICY "sites_update" ON public.sites
  FOR UPDATE USING (organization_id IN (SELECT public.get_user_org_ids()))
  WITH CHECK (organization_id IN (SELECT public.get_user_org_ids()));

CREATE POLICY "sites_delete" ON public.sites
  FOR DELETE USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members
      WHERE user_id = auth.uid() AND role IN ('admin', 'owner')
    )
  );

-- ---------------------------------------------------------------------------
-- 8.5 Audits
-- ---------------------------------------------------------------------------

CREATE POLICY "audits_select" ON public.audits
  FOR SELECT USING (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "audits_insert" ON public.audits
  FOR INSERT WITH CHECK (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "audits_update" ON public.audits
  FOR UPDATE USING (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "audits_delete" ON public.audits
  FOR DELETE USING (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

-- ---------------------------------------------------------------------------
-- 8.6 Pages
-- ---------------------------------------------------------------------------

CREATE POLICY "pages_select" ON public.pages
  FOR SELECT USING (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

CREATE POLICY "pages_insert" ON public.pages
  FOR INSERT WITH CHECK (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

CREATE POLICY "pages_update" ON public.pages
  FOR UPDATE USING (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

CREATE POLICY "pages_delete" ON public.pages
  FOR DELETE USING (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

-- ---------------------------------------------------------------------------
-- 8.7 Violations (utilise audit_id dénormalisé)
-- ---------------------------------------------------------------------------

CREATE POLICY "violations_select" ON public.violations
  FOR SELECT USING (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

CREATE POLICY "violations_insert" ON public.violations
  FOR INSERT WITH CHECK (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

CREATE POLICY "violations_update" ON public.violations
  FOR UPDATE USING (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

CREATE POLICY "violations_delete" ON public.violations
  FOR DELETE USING (
    audit_id IN (
      SELECT id FROM public.audits
      WHERE site_id IN (
        SELECT id FROM public.sites
        WHERE organization_id IN (SELECT public.get_user_org_ids())
      )
    )
  );

-- ---------------------------------------------------------------------------
-- 8.8 Declarations
-- ---------------------------------------------------------------------------

CREATE POLICY "declarations_select" ON public.declarations
  FOR SELECT USING (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "declarations_insert" ON public.declarations
  FOR INSERT WITH CHECK (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "declarations_update" ON public.declarations
  FOR UPDATE USING (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

CREATE POLICY "declarations_delete" ON public.declarations
  FOR DELETE USING (
    site_id IN (
      SELECT id FROM public.sites
      WHERE organization_id IN (SELECT public.get_user_org_ids())
    )
  );

-- ============================================================================
-- 9. GRANTS
-- ============================================================================

-- Autoriser les rôles Supabase à utiliser les types enum
GRANT USAGE ON SCHEMA public TO authenticated, anon;

-- Autoriser les fonctions RPC
GRANT EXECUTE ON FUNCTION public.get_user_org_ids() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_organization(TEXT, TEXT, region, plan_tier, language) TO authenticated;
