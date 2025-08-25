import { supabase } from '../lib/supabase';

        // Statistics management service
        export const statisticsService = {
          // Get player statistics
          async getPlayerStatistics(playerId, teamId = null, season = null) {
            try {
              let query = supabase?.from('player_statistics')?.select('*')?.eq('player_id', playerId)

              if (teamId) {
                query = query?.eq('team_id', teamId)
              }

              if (season) {
                query = query?.eq('season', season)
              }

              const { data, error } = await query?.order('season', { ascending: false })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get team statistics for current season
          async getTeamStatistics(teamId, season) {
            try {
              const { data, error } = await supabase?.from('player_statistics')?.select(`
                  *,
                  user_profiles(full_name, avatar_url)
                `)?.eq('team_id', teamId)?.eq('season', season)?.order('goals', { ascending: false })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get top scorers
          async getTopScorers(teamId, season, limit = 10) {
            try {
              const { data, error } = await supabase?.from('player_statistics')?.select(`
                  *,
                  user_profiles(full_name, avatar_url)
                `)?.eq('team_id', teamId)?.eq('season', season)?.gt('goals', 0)?.order('goals', { ascending: false })?.limit(limit)

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get top assisters
          async getTopAssisters(teamId, season, limit = 10) {
            try {
              const { data, error } = await supabase?.from('player_statistics')?.select(`
                  *,
                  user_profiles(full_name, avatar_url)
                `)?.eq('team_id', teamId)?.eq('season', season)?.gt('assists', 0)?.order('assists', { ascending: false })?.limit(limit)

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Update player statistics
          async updatePlayerStatistics(playerId, teamId, season, updates) {
            try {
              const { data, error } = await supabase?.from('player_statistics')?.upsert({
                  player_id: playerId,
                  team_id: teamId,
                  season,
                  ...updates,
                  updated_at: new Date()?.toISOString()
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Add goal to player statistics
          async addGoal(playerId, teamId, season) {
            try {
              // First, get current stats
              const { data: currentStats } = await supabase?.from('player_statistics')?.select('goals')?.eq('player_id', playerId)?.eq('team_id', teamId)?.eq('season', season)?.single()

              const currentGoals = currentStats?.goals || 0

              const { data, error } = await supabase?.from('player_statistics')?.upsert({
                  player_id: playerId,
                  team_id: teamId,
                  season,
                  goals: currentGoals + 1,
                  updated_at: new Date()?.toISOString()
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Add assist to player statistics
          async addAssist(playerId, teamId, season) {
            try {
              // First, get current stats
              const { data: currentStats } = await supabase?.from('player_statistics')?.select('assists')?.eq('player_id', playerId)?.eq('team_id', teamId)?.eq('season', season)?.single()

              const currentAssists = currentStats?.assists || 0

              const { data, error } = await supabase?.from('player_statistics')?.upsert({
                  player_id: playerId,
                  team_id: teamId,
                  season,
                  assists: currentAssists + 1,
                  updated_at: new Date()?.toISOString()
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Get match statistics summary
          async getMatchStatisticsSummary(teamId, season) {
            try {
              const [matchesResult, goalsResult] = await Promise.all([
                // Get match stats
                supabase?.from('matches')?.select('status, team_score, opponent_score')?.eq('team_id', teamId)?.eq('status', 'completed'),
                
                // Get total goals from player stats
                supabase?.from('player_statistics')?.select('goals, assists')?.eq('team_id', teamId)?.eq('season', season)
              ])

              if (matchesResult?.error) throw matchesResult?.error
              if (goalsResult?.error) throw goalsResult?.error

              const matches = matchesResult?.data || []
              const playerStats = goalsResult?.data || []

              let wins = 0
              let draws = 0
              let losses = 0
              let goalsFor = 0
              let goalsAgainst = 0

              matches?.forEach(match => {
                goalsFor += match?.team_score || 0
                goalsAgainst += match?.opponent_score || 0

                if (match?.team_score > match?.opponent_score) {
                  wins++
                } else if (match?.team_score < match?.opponent_score) {
                  losses++
                } else {
                  draws++
                }
              })

              const totalGoals = playerStats?.reduce((sum, stats) => sum + (stats?.goals || 0), 0)
              const totalAssists = playerStats?.reduce((sum, stats) => sum + (stats?.assists || 0), 0)

              return {
                matchesPlayed: matches?.length,
                wins,
                draws,
                losses,
                goalsFor,
                goalsAgainst,
                goalDifference: goalsFor - goalsAgainst,
                points: wins * 3 + draws,
                totalGoals,
                totalAssists,
                winPercentage: matches?.length > 0 ? Math.round((wins / matches?.length) * 100) : 0
              };
            } catch (error) {
              throw error
            }
          }
        }