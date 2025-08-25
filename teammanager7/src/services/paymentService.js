import { supabase } from '../lib/supabase';

        // Payment management service
        export const paymentService = {
          // Get user payments
          async getUserPayments(userId, teamId = null) {
            try {
              let query = supabase?.from('payments')?.select('*')?.eq('user_id', userId)?.order('due_date', { ascending: true })

              if (teamId) {
                query = query?.eq('team_id', teamId)
              }

              const { data, error } = await query

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get team payments (for admins/coaches)
          async getTeamPayments(teamId) {
            try {
              const { data, error } = await supabase?.from('payments')?.select(`
                  *,
                  user_profiles(full_name, email)
                `)?.eq('team_id', teamId)?.order('due_date', { ascending: true })

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get overdue payments
          async getOverduePayments(userId, teamId = null) {
            try {
              let query = supabase?.from('payments')?.select('*')?.eq('user_id', userId)?.eq('status', 'overdue')?.order('due_date', { ascending: true })

              if (teamId) {
                query = query?.eq('team_id', teamId)
              }

              const { data, error } = await query

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Get payment alerts (upcoming and overdue)
          async getPaymentAlerts(userId, teamId = null) {
            try {
              const today = new Date()
              const oneWeekFromNow = new Date()
              oneWeekFromNow?.setDate(today?.getDate() + 7)

              let query = supabase?.from('payments')?.select('*')?.eq('user_id', userId)?.in('status', ['pending', 'overdue'])?.or(`due_date.lt.${today?.toISOString()},due_date.lte.${oneWeekFromNow?.toISOString()}`)?.order('due_date', { ascending: true })

              if (teamId) {
                query = query?.eq('team_id', teamId)
              }

              const { data, error } = await query

              if (error) throw error
              return data || []
            } catch (error) {
              throw error
            }
          },

          // Create payment
          async createPayment(teamId, userId, paymentData) {
            try {
              const { data, error } = await supabase?.from('payments')?.insert({
                  team_id: teamId,
                  user_id: userId,
                  ...paymentData
                })?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Update payment
          async updatePayment(paymentId, updates) {
            try {
              const { data, error } = await supabase?.from('payments')?.update({
                  ...updates,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', paymentId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Mark payment as paid
          async markPaymentAsPaid(paymentId, paymentMethod = '', transactionId = '') {
            try {
              const { data, error } = await supabase?.from('payments')?.update({
                  status: 'paid',
                  paid_date: new Date()?.toISOString(),
                  payment_method: paymentMethod,
                  transaction_id: transactionId,
                  updated_at: new Date()?.toISOString()
                })?.eq('id', paymentId)?.select()?.single()

              if (error) throw error
              return data
            } catch (error) {
              throw error
            }
          },

          // Delete payment
          async deletePayment(paymentId) {
            try {
              const { error } = await supabase?.from('payments')?.delete()?.eq('id', paymentId)

              if (error) throw error
              return true
            } catch (error) {
              throw error
            }
          },

          // Get payment statistics for team
          async getPaymentStats(teamId) {
            try {
              const { data, error } = await supabase?.from('payments')?.select('status, amount')?.eq('team_id', teamId)

              if (error) throw error

              const stats = {
                total: 0,
                paid: 0,
                pending: 0,
                overdue: 0,
                totalAmount: 0,
                paidAmount: 0,
                pendingAmount: 0,
                overdueAmount: 0
              }

              data?.forEach(payment => {
                stats.total++
                stats.totalAmount += parseFloat(payment?.amount)

                switch (payment?.status) {
                  case 'paid':
                    stats.paid++
                    stats.paidAmount += parseFloat(payment?.amount)
                    break
                  case 'pending':
                    stats.pending++
                    stats.pendingAmount += parseFloat(payment?.amount)
                    break
                  case 'overdue':
                    stats.overdue++
                    stats.overdueAmount += parseFloat(payment?.amount)
                    break
                }
              })

              return stats
            } catch (error) {
              throw error
            }
          }
        }