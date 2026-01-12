import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useUserScan = () => {
  const { user, isAuthenticated } = useAuth()
  const [hasScan, setHasScan] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUserScan = async () => {
      if (!isAuthenticated || !user) {
        setHasScan(false)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('skin_type, analysis_data')
          .eq('id', user.id)
          .single()

        if (error) {
          // If profile doesn't exist, user has no scan
          if (error.code === 'PGRST116') {
            setHasScan(false)
          } else {
            console.error('Error checking user scan:', error)
            setHasScan(false)
          }
        } else {
          // Check if user has either skin_type or analysis_data
          setHasScan(!!(data?.skin_type || data?.analysis_data))
        }
      } catch (err) {
        console.error('Error in checkUserScan:', err)
        setHasScan(false)
      } finally {
        setLoading(false)
      }
    }

    checkUserScan()
  }, [user, isAuthenticated])

  return { hasScan, loading }
}
