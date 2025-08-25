import { supabase } from '../lib/supabase';

        // Announcement management service
        export const announcementService = {
          // Get team announcements
          async getTeamAnnouncements(teamId, limit = null) {
            try {
              let query = supabase?.from('announcements')?.select(`
                  *,
                  user_profiles(full_name)
                `)?.eq('team_id', teamId)?.order('is_pinned', { ascending: false })?.order('created_at', { ascending: false })

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

          // Get active announcements (not expired)
          async getActiveAnnouncements(teamId, limit = null) {
            try {
              let query = supabase?.from('announcements')?.select(`
                  *,
                  user_profiles(full_name)
                `)?.eq('team_id', teamId)?.or(`expires_at.is.null,expires_at.gt.${new Date()?.toISOString()}`)?.order('is_pinned', { ascending: false })?.order('created_at', { ascending: false })

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

          // Get pinned announcements
          async getPinnedAnnouncements(teamId) {
            try {
              const { data, error } = await supabase?.from('announcements')?.select(`
                  *,
                  user_profiles(full_name)
                `)?.eq('team_id', teamId)?.eq('is_pinned', true)?.or(`expires_at.is.null,expires_at.gt.${new Date()?.toISOString()}`)?.order('created_at', { ascending: false })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Create announcement
          async createAnnouncement(teamId, announcementData) {
            try {
              const { data, error } = await supabase?.from('announcements')?.insert({
                  team_id: teamId,
                  ...announcementData
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Update announcement
          async updateAnnouncement(announcementId, updates) {
            try {
              const { data, error } = await supabase?.from('announcements')?.update({
                  ...updates,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', announcementId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Pin/unpin announcement
          async togglePinAnnouncement(announcementId, isPinned) {
            try {
              const { data, error } = await supabase?.from('announcements')?.update({
                  is_pinned: isPinned,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', announcementId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Delete announcement
          async deleteAnnouncement(announcementId) {
            try {
              const { error } = await supabase?.from('announcements')?.delete()?.eq('id', announcementId)

              if (error) throw error
              return true
            } catch (error) {
              throw error
            }
          },

          // Get announcements by priority
          async getAnnouncementsByPriority(teamId, priority) {
            try {
              const { data, error } = await supabase?.from('announcements')?.select(`
                  *,
                  user_profiles(full_name)
                `)?.eq('team_id', teamId)?.eq('priority', priority)?.or(`expires_at.is.null,expires_at.gt.${new Date()?.toISOString()}`)?.order('created_at', { ascending: false })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          }
        }