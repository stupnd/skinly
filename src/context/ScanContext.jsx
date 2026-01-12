import { createContext, useContext } from 'react'
import { useUserScan } from '../hooks/useUserScan'

const ScanContext = createContext(null)

export const ScanProvider = ({ children }) => {
  const { hasScan, loading } = useUserScan()

  return (
    <ScanContext.Provider value={{ hasScan, loading }}>
      {children}
    </ScanContext.Provider>
  )
}

export const useScan = () => {
  const context = useContext(ScanContext)
  if (!context) {
    throw new Error('useScan must be used within a ScanProvider')
  }
  return context
}
