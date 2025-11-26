import React from 'react'
import { Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import useAuthStore from '../store/useAuthStore'

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}
