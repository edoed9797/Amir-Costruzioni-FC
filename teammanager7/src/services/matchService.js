import { supabase } from '../lib/supabase';

        // Match management service
        export const matchService = {
          // Get team matches
          async getTeamMatches(teamId, limit = null) {
            try {
              let query = supabase?.from('matches')?.select('*')?.eq('team_id', teamId)?.order('match_date', { ascending: true })

              if (limit) {
                query = query?.limit(limit)
              }

              const { data, error } = await query

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get upcoming matches
          async getUpcomingMatches(teamId, limit = 5) {
            try {
              const { data, error } = await supabase?.from('matches')?.select('*')?.eq('team_id', teamId)?.gte('match_date', new Date()?.toISOString())?.order('match_date', { ascending: true })?.limit(limit)

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get recent matches
          async getRecentMatches(teamId, limit = 5) {
            try {
              const { data, error } = await supabase?.from('matches')?.select('*')?.eq('team_id', teamId)?.lt('match_date', new Date()?.toISOString())?.order('match_date', { ascending: false })?.limit(limit)

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get live match
          async getLiveMatch(teamId) {
            try {
              const { data, error } = await supabase?.from('matches')?.select('*')?.eq('team_id', teamId)?.eq('status', 'live')?.single()

              if (error && error?.code !== 'PGRST116') throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Create match
          async createMatch(teamId, matchData) {
            try {
              const { data, error } = await supabase?.from('matches')?.insert({
                  team_id: teamId,
                  ...matchData
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Update match
          async updateMatch(matchId, updates) {
            try {
              const { data, error } = await supabase?.from('matches')?.update({
                  ...updates,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', matchId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Delete match
          async deleteMatch(matchId) {
            try {
              const { error } = await supabase?.from('matches')?.delete()?.eq('id', matchId)

              if (error) throw error
              return true
            } catch (error) {
              throw error
            }
          },

          // Get match events
          async getMatchEvents(matchId) {
            try {
              const { data, error } = await supabase?.from('match_events')?.select(`
                  *,
                  user_profiles(full_name)
                `)?.eq('match_id', matchId)?.order('minute', { ascending: true })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Add match event
          async addMatchEvent(matchId, eventData) {
            try {
              const { data, error } = await supabase?.from('match_events')?.insert({
                  match_id: matchId,
                  ...eventData
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          }
        }