import { supabase } from '../lib/supabase';

        // Team management service
        export const teamService = {
          // Get user's teams
          async getUserTeams(userId) {
            try {
              const { data, error } = await supabase?.from('team_members')?.select(`
                  team_id,
                  position,
                  jersey_number,
                  teams!inner(
                    id,
                    name,
                    league,
                    season,
                    logo_url,
                    description,
                    home_venue
                  )
                `)?.eq('user_id', userId)?.eq('is_active', true)

              if (error) throw error
              return data?.map(item => item?.teams) || [];
            } catch (error) {
              throw error
            }
          },

          // Get team details
          async getTeam(teamId) {
            try {
              const { data, error } = await supabase?.from('teams')?.select('*')?.eq('id', teamId)?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Get team members
          async getTeamMembers(teamId) {
            try {
              const { data, error } = await supabase?.from('team_members')?.select(`
                  id,
                  position,
                  jersey_number,
                  joined_date,
                  user_profiles!inner(
                    id,
                    full_name,
                    email,
                    role,
                    avatar_url,
                    phone
                  )
                `)?.eq('team_id', teamId)?.eq('is_active', true)?.order('jersey_number', { ascending: true, nullsLast: true })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Add team member
          async addTeamMember(teamId, userId, position, jerseyNumber) {
            try {
              const { data, error } = await supabase?.from('team_members')?.insert({
                  team_id: teamId,
                  user_id: userId,
                  position,
                  jersey_number: jerseyNumber
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Update team member
          async updateTeamMember(memberId, updates) {
            try {
              const { data, error } = await supabase?.from('team_members')?.update(updates)?.eq('id', memberId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Remove team member
          async removeTeamMember(memberId) {
            try {
              const { error } = await supabase?.from('team_members')?.update({ is_active: false })?.eq('id', memberId)

              if (error) throw error
              return true
            } catch (error) {
              throw error
            }
          }
        }