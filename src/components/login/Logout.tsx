import React from 'react'
import { useAuth } from '@/context/auth';

export default function Logout() {
  const auth = useAuth();
  return (
    <button className="btn btn-secondary" onClick={() => {auth.logout()}}>Sign Out</button>
  )
}
