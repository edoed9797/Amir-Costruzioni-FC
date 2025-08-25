-- Location: supabase/migrations/20250825131841_sports_team_management_system.sql
        -- Schema Analysis: Fresh project - no existing schema
        -- Integration Type: Complete new sports team management system
        -- Dependencies: None - fresh implementation

        -- 1. Create custom types
        CREATE TYPE public.user_role AS ENUM ('admin', 'coach', 'player', 'manager');
        CREATE TYPE public.match_status AS ENUM ('scheduled', 'live', 'completed', 'cancelled', 'postponed');
        CREATE TYPE public.training_type AS ENUM ('team_training', 'tactical_session', 'fitness', 'individual');
        CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
        CREATE TYPE public.event_type AS ENUM ('match', 'training', 'meeting', 'social', 'other');
        CREATE TYPE public.announcement_priority AS ENUM ('low', 'medium', 'high', 'urgent');
        CREATE TYPE public.match_event_type AS ENUM ('goal', 'assist', 'yellow_card', 'red_card', 'substitution');

        -- 2. Core Tables - User Management
        CREATE TABLE public.user_profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id),
            email TEXT NOT NULL UNIQUE,
            full_name TEXT NOT NULL,
            phone TEXT,
            role public.user_role DEFAULT 'player'::public.user_role,
            avatar_url TEXT,
            date_of_birth DATE,
            address TEXT,
            emergency_contact_name TEXT,
            emergency_contact_phone TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 3. Team Management
        CREATE TABLE public.teams (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            league TEXT,
            season TEXT,
            logo_url TEXT,
            description TEXT,
            home_venue TEXT,
            founded_year INTEGER,
            created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 4. Team Membership
        CREATE TABLE public.team_members (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
            position TEXT,
            jersey_number INTEGER,
            joined_date DATE DEFAULT CURRENT_DATE,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(team_id, user_id),
            UNIQUE(team_id, jersey_number)
        );

        -- 5. Match Management
        CREATE TABLE public.matches (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            opponent_name TEXT NOT NULL,
            match_date TIMESTAMPTZ NOT NULL,
            venue TEXT NOT NULL,
            competition TEXT,
            is_home BOOLEAN DEFAULT true,
            status public.match_status DEFAULT 'scheduled'::public.match_status,
            team_score INTEGER DEFAULT 0,
            opponent_score INTEGER DEFAULT 0,
            notes TEXT,
            created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 6. Match Events (goals, cards, etc.)
        CREATE TABLE public.match_events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            match_id UUID REFERENCES public.matches(id) ON DELETE CASCADE,
            player_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            event_type public.match_event_type NOT NULL,
            minute INTEGER,
            description TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 7. Training Sessions
        CREATE TABLE public.training_sessions (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            training_type public.training_type DEFAULT 'team_training'::public.training_type,
            session_date TIMESTAMPTZ NOT NULL,
            location TEXT,
            duration_minutes INTEGER DEFAULT 90,
            max_attendees INTEGER,
            notes TEXT,
            created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 8. Training Attendance
        CREATE TABLE public.training_attendance (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            training_id UUID REFERENCES public.training_sessions(id) ON DELETE CASCADE,
            player_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
            attended BOOLEAN DEFAULT false,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(training_id, player_id)
        );

        -- 9. Payment Management
        CREATE TABLE public.payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
            description TEXT NOT NULL,
            amount DECIMAL(10,2) NOT NULL,
            due_date DATE NOT NULL,
            paid_date DATE,
            status public.payment_status DEFAULT 'pending'::public.payment_status,
            payment_method TEXT,
            transaction_id TEXT,
            notes TEXT,
            created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 10. Events Calendar
        CREATE TABLE public.events (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            event_type public.event_type DEFAULT 'other'::public.event_type,
            start_date TIMESTAMPTZ NOT NULL,
            end_date TIMESTAMPTZ,
            location TEXT,
            all_day BOOLEAN DEFAULT false,
            created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 11. Announcements
        CREATE TABLE public.announcements (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            priority public.announcement_priority DEFAULT 'medium'::public.announcement_priority,
            is_pinned BOOLEAN DEFAULT false,
            expires_at TIMESTAMPTZ,
            author_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        -- 12. Player Statistics
        CREATE TABLE public.player_statistics (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            player_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
            team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
            season TEXT NOT NULL,
            matches_played INTEGER DEFAULT 0,
            goals INTEGER DEFAULT 0,
            assists INTEGER DEFAULT 0,
            yellow_cards INTEGER DEFAULT 0,
            red_cards INTEGER DEFAULT 0,
            minutes_played INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(player_id, team_id, season)
        );

        -- 13. Indexes for Performance
        CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
        CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
        CREATE INDEX idx_team_members_team_id ON public.team_members(team_id);
        CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
        CREATE INDEX idx_matches_team_id ON public.matches(team_id);
        CREATE INDEX idx_matches_date ON public.matches(match_date);
        CREATE INDEX idx_matches_status ON public.matches(status);
        CREATE INDEX idx_match_events_match_id ON public.match_events(match_id);
        CREATE INDEX idx_training_sessions_team_id ON public.training_sessions(team_id);
        CREATE INDEX idx_training_sessions_date ON public.training_sessions(session_date);
        CREATE INDEX idx_training_attendance_training_id ON public.training_attendance(training_id);
        CREATE INDEX idx_payments_team_id ON public.payments(team_id);
        CREATE INDEX idx_payments_user_id ON public.payments(user_id);
        CREATE INDEX idx_payments_status ON public.payments(status);
        CREATE INDEX idx_events_team_id ON public.events(team_id);
        CREATE INDEX idx_events_date ON public.events(start_date);
        CREATE INDEX idx_announcements_team_id ON public.announcements(team_id);
        CREATE INDEX idx_announcements_priority ON public.announcements(priority);
        CREATE INDEX idx_player_statistics_player_id ON public.player_statistics(player_id);

        -- 14. Enable RLS
        ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.training_attendance ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.player_statistics ENABLE ROW LEVEL SECURITY;

        -- 15. RLS Policies - Pattern 1 for user_profiles (core user table)
        CREATE POLICY "users_manage_own_user_profiles"
        ON public.user_profiles
        FOR ALL
        TO authenticated
        USING (id = auth.uid())
        WITH CHECK (id = auth.uid());

        -- 16. Helper Functions for Team Access
        CREATE OR REPLACE FUNCTION public.is_team_member(team_uuid UUID)
        RETURNS BOOLEAN
        LANGUAGE sql
        STABLE
        SECURITY DEFINER
        AS $$
        SELECT EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.team_id = team_uuid 
            AND tm.user_id = auth.uid() 
            AND tm.is_active = true
        )
        $$;

        CREATE OR REPLACE FUNCTION public.is_team_admin_or_coach(team_uuid UUID)
        RETURNS BOOLEAN
        LANGUAGE sql
        STABLE
        SECURITY DEFINER
        AS $$
        SELECT EXISTS (
            SELECT 1 FROM public.team_members tm
            JOIN public.user_profiles up ON tm.user_id = up.id
            WHERE tm.team_id = team_uuid 
            AND tm.user_id = auth.uid() 
            AND up.role IN ('admin', 'coach', 'manager')
            AND tm.is_active = true
        )
        $$;

        -- 17. RLS Policies for Team-based Access
        CREATE POLICY "team_members_view_teams"
        ON public.teams
        FOR SELECT
        TO authenticated
        USING (public.is_team_member(id));

        CREATE POLICY "admins_coaches_manage_teams"
        ON public.teams
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(id))
        WITH CHECK (public.is_team_admin_or_coach(id));

        CREATE POLICY "team_members_view_team_members"
        ON public.team_members
        FOR SELECT
        TO authenticated
        USING (public.is_team_member(team_id));

        CREATE POLICY "admins_coaches_manage_team_members"
        ON public.team_members
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        CREATE POLICY "team_members_view_matches"
        ON public.matches
        FOR SELECT
        TO authenticated
        USING (public.is_team_member(team_id));

        CREATE POLICY "admins_coaches_manage_matches"
        ON public.matches
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        CREATE POLICY "team_members_view_match_events"
        ON public.match_events
        FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM public.matches m
            WHERE m.id = match_id AND public.is_team_member(m.team_id)
        ));

        CREATE POLICY "admins_coaches_manage_match_events"
        ON public.match_events
        FOR ALL
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM public.matches m
            WHERE m.id = match_id AND public.is_team_admin_or_coach(m.team_id)
        ))
        WITH CHECK (EXISTS (
            SELECT 1 FROM public.matches m
            WHERE m.id = match_id AND public.is_team_admin_or_coach(m.team_id)
        ));

        CREATE POLICY "team_members_view_training_sessions"
        ON public.training_sessions
        FOR SELECT
        TO authenticated
        USING (public.is_team_member(team_id));

        CREATE POLICY "admins_coaches_manage_training_sessions"
        ON public.training_sessions
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        CREATE POLICY "team_members_view_training_attendance"
        ON public.training_attendance
        FOR SELECT
        TO authenticated
        USING (EXISTS (
            SELECT 1 FROM public.training_sessions ts
            WHERE ts.id = training_id AND public.is_team_member(ts.team_id)
        ));

        CREATE POLICY "players_manage_own_training_attendance"
        ON public.training_attendance
        FOR ALL
        TO authenticated
        USING (player_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.training_sessions ts
            WHERE ts.id = training_id AND public.is_team_admin_or_coach(ts.team_id)
        ))
        WITH CHECK (player_id = auth.uid() OR EXISTS (
            SELECT 1 FROM public.training_sessions ts
            WHERE ts.id = training_id AND public.is_team_admin_or_coach(ts.team_id)
        ));

        CREATE POLICY "users_view_own_payments"
        ON public.payments
        FOR SELECT
        TO authenticated
        USING (user_id = auth.uid() OR public.is_team_admin_or_coach(team_id));

        CREATE POLICY "admins_manage_payments"
        ON public.payments
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        CREATE POLICY "team_members_view_events"
        ON public.events
        FOR SELECT
        TO authenticated
        USING (public.is_team_member(team_id));

        CREATE POLICY "admins_coaches_manage_events"
        ON public.events
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        CREATE POLICY "team_members_view_announcements"
        ON public.announcements
        FOR SELECT
        TO authenticated
        USING (public.is_team_member(team_id));

        CREATE POLICY "admins_coaches_manage_announcements"
        ON public.announcements
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        CREATE POLICY "team_members_view_player_statistics"
        ON public.player_statistics
        FOR SELECT
        TO authenticated
        USING (player_id = auth.uid() OR public.is_team_member(team_id));

        CREATE POLICY "admins_coaches_manage_player_statistics"
        ON public.player_statistics
        FOR ALL
        TO authenticated
        USING (public.is_team_admin_or_coach(team_id))
        WITH CHECK (public.is_team_admin_or_coach(team_id));

        -- 18. Functions for automatic profile creation
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER
        SECURITY DEFINER
        LANGUAGE plpgsql
        AS $$
        BEGIN
          INSERT INTO public.user_profiles (id, email, full_name, role)
          VALUES (
            NEW.id, 
            NEW.email, 
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'player'::public.user_role)
          );
          RETURN NEW;
        END;
        $$;

        -- Trigger for new user creation
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

        -- 19. Mock Data for Testing
        DO $$
        DECLARE
            coach_uuid UUID := gen_random_uuid();
            player1_uuid UUID := gen_random_uuid();
            player2_uuid UUID := gen_random_uuid();
            team_uuid UUID := gen_random_uuid();
            match_uuid UUID := gen_random_uuid();
            training_uuid UUID := gen_random_uuid();
        BEGIN
            -- Create auth users with required fields
            INSERT INTO auth.users (
                id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
                created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
                is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
                recovery_token, recovery_sent_at, email_change_token_new, email_change,
                email_change_sent_at, email_change_token_current, email_change_confirm_status,
                reauthentication_token, reauthentication_sent_at, phone, phone_change,
                phone_change_token, phone_change_sent_at
            ) VALUES
                (coach_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'coach@team.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
                 '{"full_name": "Coach Martinez", "role": "coach"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
                (player1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'alex.thompson@team.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
                 '{"full_name": "Alex Thompson", "role": "player"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
                (player2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
                 'jamie.rodriguez@team.com', crypt('password123', gen_salt('bf', 10)), now(), now(), now(),
                 '{"full_name": "Jamie Rodriguez", "role": "player"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
                 false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

            -- Create team
            INSERT INTO public.teams (id, name, league, season, description, home_venue, created_by) VALUES
                (team_uuid, 'Red Devils FC', 'Metro 7-a-side League', '2024-25', 
                 'Competitive football team focusing on teamwork and skill development', 
                 'Central Sports Complex', coach_uuid);

            -- Add team members
            INSERT INTO public.team_members (team_id, user_id, position, jersey_number) VALUES
                (team_uuid, coach_uuid, 'Coach', null),
                (team_uuid, player1_uuid, 'Midfielder', 10),
                (team_uuid, player2_uuid, 'Forward', 9);

            -- Create matches
            INSERT INTO public.matches (id, team_id, opponent_name, match_date, venue, competition, is_home, created_by) VALUES
                (match_uuid, team_uuid, 'Thunder Bolts', '2025-08-28 19:00:00+00', 'Central Sports Complex', 'League Match', true, coach_uuid),
                (gen_random_uuid(), team_uuid, 'Lightning FC', '2025-09-02 18:30:00+00', 'Riverside Stadium', 'Cup Quarter Final', false, coach_uuid),
                (gen_random_uuid(), team_uuid, 'Storm United', '2025-09-05 20:00:00+00', 'Central Sports Complex', 'League Match', true, coach_uuid);

            -- Create training sessions
            INSERT INTO public.training_sessions (id, team_id, title, training_type, session_date, location, max_attendees, created_by) VALUES
                (training_uuid, team_uuid, 'Team Training', 'team_training', '2025-08-26 18:00:00+00', 'Training Ground A', 16, coach_uuid),
                (gen_random_uuid(), team_uuid, 'Tactical Session', 'tactical_session', '2025-08-29 19:00:00+00', 'Indoor Facility', 14, coach_uuid);

            -- Create payments
            INSERT INTO public.payments (team_id, user_id, description, amount, due_date, status, created_by) VALUES
                (team_uuid, player1_uuid, 'Monthly Team Fee', 45.00, '2025-08-20', 'overdue', coach_uuid),
                (team_uuid, player1_uuid, 'Tournament Entry Fee', 25.00, '2025-09-01', 'pending', coach_uuid),
                (team_uuid, player2_uuid, 'Monthly Team Fee', 45.00, '2025-08-20', 'paid', coach_uuid);

            -- Create announcements
            INSERT INTO public.announcements (team_id, title, content, priority, is_pinned, author_id) VALUES
                (team_uuid, 'Important: New Training Schedule', 
                 'Starting next week, we will be moving our regular training sessions to Tuesdays and Thursdays at 7:00 PM. The new schedule will allow us better preparation time before weekend matches. Please make sure to update your calendars accordingly. If you have any conflicts with the new timing, please reach out to the coaching staff as soon as possible so we can discuss alternatives.',
                 'high', true, coach_uuid),
                (team_uuid, 'Team Dinner This Saturday',
                 'Join us for our monthly team dinner this Saturday at 8 PM at Mario''s Restaurant. It''s a great opportunity to bond with teammates outside of football. Please RSVP by Thursday.',
                 'medium', false, coach_uuid),
                (team_uuid, 'New Kit Collection',
                 'The new season kits have arrived! You can collect them from the equipment room after training sessions. Make sure to try them on for proper fit.',
                 'low', false, coach_uuid);

            -- Create events
            INSERT INTO public.events (team_id, title, description, event_type, start_date, location, created_by) VALUES
                (team_uuid, 'Team Meeting', 'Monthly team meeting to discuss upcoming matches', 'meeting', '2025-08-30 19:00:00+00', 'Clubhouse', coach_uuid),
                (team_uuid, 'Team Dinner', 'Monthly team dinner at Mario''s Restaurant', 'social', '2025-08-31 20:00:00+00', 'Mario''s Restaurant', coach_uuid);

            -- Create player statistics
            INSERT INTO public.player_statistics (player_id, team_id, season, matches_played, goals, assists) VALUES
                (player1_uuid, team_uuid, '2024-25', 12, 3, 5),
                (player2_uuid, team_uuid, '2024-25', 15, 8, 2);

        EXCEPTION
            WHEN foreign_key_violation THEN
                RAISE NOTICE 'Foreign key error: %', SQLERRM;
            WHEN unique_violation THEN
                RAISE NOTICE 'Unique constraint error: %', SQLERRM;
            WHEN OTHERS THEN
                RAISE NOTICE 'Unexpected error: %', SQLERRM;
        END $$;