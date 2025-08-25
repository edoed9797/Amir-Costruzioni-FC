import { supabase } from '../lib/supabase';

        // Event management service
        export const eventService = {
          // Get team events
          async getTeamEvents(teamId, startDate = null, endDate = null) {
            try {
              let query = supabase?.from('events')?.select('*')?.eq('team_id', teamId)?.order('start_date', { ascending: true })

              if (startDate) {
                query = query?.gte('start_date', startDate)
              }

              if (endDate) {
                query = query?.lte('start_date', endDate)
              }

              const { data, error } = await query

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get upcoming events
          async getUpcomingEvents(teamId, limit = 10) {
            try {
              const { data, error } = await supabase?.from('events')?.select('*')?.eq('team_id', teamId)?.gte('start_date', new Date()?.toISOString())?.order('start_date', { ascending: true })?.limit(limit)

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get events for specific month
          async getMonthEvents(teamId, year, month) {
            try {
              const startDate = new Date(year, month - 1, 1)?.toISOString()
              const endDate = new Date(year, month, 0, 23, 59, 59)?.toISOString()

              const { data, error } = await supabase?.from('events')?.select('*')?.eq('team_id', teamId)?.gte('start_date', startDate)?.lte('start_date', endDate)?.order('start_date', { ascending: true })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Create event
          async createEvent(teamId, eventData) {
            try {
              const { data, error } = await supabase?.from('events')?.insert({
                  team_id: teamId,
                  ...eventData
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Update event
          async updateEvent(eventId, updates) {
            try {
              const { data, error } = await supabase?.from('events')?.update({
                  ...updates,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', eventId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Delete event
          async deleteEvent(eventId) {
            try {
              const { error } = await supabase?.from('events')?.delete()?.eq('id', eventId)

              if (error) throw error
              return true
            } catch (error) {
              throw error
            }
          },

          // Get events by type
          async getEventsByType(teamId, eventType) {
            try {
              const { data, error } = await supabase?.from('events')?.select('*')?.eq('team_id', teamId)?.eq('event_type', eventType)?.order('start_date', { ascending: true })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          }
        }