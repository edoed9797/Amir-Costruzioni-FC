import { supabase } from '../lib/supabase';

        // Training session management service
        export const trainingService = {
          // Get team training sessions
          async getTeamTrainingSessions(teamId, limit = null) {
            try {
              let query = supabase?.from('training_sessions')?.select('*')?.eq('team_id', teamId)?.order('session_date', { ascending: true })

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

          // Get upcoming training sessions
          async getUpcomingTrainingSessions(teamId, limit = 5) {
            try {
              const { data, error } = await supabase?.from('training_sessions')?.select('*')?.eq('team_id', teamId)?.gte('session_date', new Date()?.toISOString())?.order('session_date', { ascending: true })?.limit(limit)

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get training session with attendance
          async getTrainingSessionWithAttendance(sessionId) {
            try {
              const [sessionResult, attendanceResult] = await Promise.all([
                supabase?.from('training_sessions')?.select('*')?.eq('id', sessionId)?.single(),
                supabase?.from('training_attendance')?.select(`
                    *,
                    user_profiles(full_name, avatar_url)
                  `)?.eq('training_id', sessionId)
              ])

              if (sessionResult?.error) throw sessionResult?.error
              if (attendanceResult?.error) throw attendanceResult?.error

              return {
                session: sessionResult?.data,
                attendance: attendanceResult?.data || []
              };
            } catch (error) {
              throw error
            }
          },

          // Create training session
          async createTrainingSession(teamId, sessionData) {
            try {
              const { data, error } = await supabase?.from('training_sessions')?.insert({
                  team_id: teamId,
                  ...sessionData
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Update training session
          async updateTrainingSession(sessionId, updates) {
            try {
              const { data, error } = await supabase?.from('training_sessions')?.update({
                  ...updates,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', sessionId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Delete training session
          async deleteTrainingSession(sessionId) {
            try {
              const { error } = await supabase?.from('training_sessions')?.delete()?.eq('id', sessionId)

              if (error) throw error
              return true
            } catch (error) {
              throw error
            }
          },

          // Mark attendance
          async markAttendance(trainingId, playerId, attended, notes = '') {
            try {
              const { data, error } = await supabase?.from('training_attendance')?.upsert({
                  training_id: trainingId,
                  player_id: playerId,
                  attended,
                  notes
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Get player training attendance stats
          async getPlayerAttendanceStats(playerId, teamId) {
            try {
              const { data, error } = await supabase?.from('training_attendance')?.select(`
                  attended,
                  training_sessions!inner(team_id)
                `)?.eq('player_id', playerId)?.eq('training_sessions.team_id', teamId)

              if (error) throw error

              const total = data?.length || 0
              const attended = data?.filter(record => record?.attended)?.length || 0
              const percentage = total > 0 ? Math.round((attended / total) * 100) : 0

              return {
                total,
                attended,
                missed: total - attended,
                percentage
              }
            } catch (error) {
              throw error
            }
          }
        }