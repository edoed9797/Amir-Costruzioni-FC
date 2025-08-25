import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // Get initial session - Use Promise chain
    supabase?.auth?.getSession()?.then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)
        }
        setLoading(false)
      })

    // Listen for auth changes - NEVER ASYNC callback
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session?.user)
          fetchUserProfile(session?.user?.id)  // Fire-and-forget, NO AWAIT
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const fetchUserProfile = (userId) => {
    supabase?.from('user_profiles')?.select('*')?.eq('id', userId)?.single()?.then(({ data, error }) => {
        if (error) {
          setError('Failed to fetch user profile')
          return
        }
        setUserProfile(data)
      })
  }

  const signIn = async (email, password) => {
    try {
      setError('')
      setLoading(true)
      
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error }
      }
      setError('Something went wrong. Please try again.')
      console.error('JavaScript error in signIn:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData = {}) => {
    try {
      setError('')
      setLoading(true)
      
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.fullName || email?.split('@')?.[0],
            role: userData?.role || 'player'
          }
        }
      })
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      return { data }
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        setError('Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.')
        return { error }
      }
      setError('Something went wrong. Please try again.')
      console.error('JavaScript error in signUp:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setError('')
      const { error } = await supabase?.auth?.signOut()
      if (error) {
        setError(error?.message)
      }
    } catch (error) {
      setError('Failed to sign out')
      console.error('JavaScript error in signOut:', error)
    }
  }

  const updateProfile = async (updates) => {
    try {
      setError('')
      if (!user?.id) return { error: 'No user found' }
      
      const { data, error } = await supabase?.from('user_profiles')?.update(updates)?.eq('id', user?.id)?.select()?.single()
      
      if (error) {
        setError(error?.message)
        return { error }
      }
      
      setUserProfile(data)
      return { data }
    } catch (error) {
      setError('Failed to update profile')
      return { error }
    }
  }

  const clearError = () => setError('')

  const value = {
    user,
    userProfile,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
    clearError
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}