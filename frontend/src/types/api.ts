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
  _id: string
  nome: string
  cognome: string
  email: string
  ruolo: 'admin' | 'operator'
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  error?: string
}
