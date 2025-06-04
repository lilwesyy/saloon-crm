// API Response Types
export interface LoginResponse {
  token: string
  user: User
  message?: string
}

export interface RegisterResponse {
  message: string
  user: User
}

export interface User {
  id: string
  nome: string
  cognome: string
  email: string
  ruolo: 'admin' | 'manager' | 'operatore' | 'receptionist'
  fotoProfilo?: string
  telefono?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiError {
  message: string
  error?: string
}
