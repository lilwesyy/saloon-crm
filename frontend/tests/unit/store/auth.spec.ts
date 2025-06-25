import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import AuthService from '@/services/auth.service'
import router from '@/router'

// Mock the router
jest.mock('@/router', () => ({
  push: jest.fn()
}))

// Mock the auth service
jest.mock('@/services/auth.service', () => ({
  default: {
    login: jest.fn(),
    getCurrentUser: jest.fn(),
    register: jest.fn(),
    updatePassword: jest.fn(),
    requestPasswordReset: jest.fn(),
    resetPassword: jest.fn()
  }
}))

const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    jest.clearAllMocks()
  })

  it('should initialize with default values', () => {
    const store = useAuthStore()
    expect(store.currentUser).toBeNull()
    expect(store.token).toBeNull()
    expect(store.loading).toBe(false)
    expect(store.error).toBeNull()
    expect(store.isLoggedIn).toBe(false)
    expect(store.isAdmin).toBe(false)
    expect(store.userName).toBe('')
  })

  describe('login', () => {
    it('should set user data and token when login succeeds', async () => {
      const mockUser = {
        id: '123',
        nome: 'Test',
        cognome: 'User',
        email: 'test@example.com',
        ruolo: 'admin' as const
      }
      
      const mockResponse = {
        user: mockUser,
        token: 'test-token'
      }
      
      // Mock login success
      mockedAuthService.login.mockResolvedValue(mockResponse)
      
      const store = useAuthStore()
      const result = await store.login('test@example.com', 'password')
      
      expect(mockedAuthService.login).toHaveBeenCalledWith('test@example.com', 'password')
      expect(store.currentUser).toEqual(mockUser)
      expect(store.token).toBe('test-token')
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
      expect(result).toBe(true)
      expect(router.push).toHaveBeenCalledWith('/')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'test-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('should set error and clear user data when login fails', async () => {
      // Mock login error
      const errorMsg = 'Invalid credentials'
      mockedAuthService.login.mockRejectedValue(new Error(errorMsg))
      
      const store = useAuthStore()
      const result = await store.login('wrong@example.com', 'wrongpass')
      
      expect(store.currentUser).toBeNull()
      expect(store.token).toBeNull()
      expect(store.loading).toBe(false)
      expect(store.error).toBe(errorMsg)
      expect(result).toBe(false)
      expect(router.push).not.toHaveBeenCalled()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('logout', () => {
    it('should clear user data and navigate to login', () => {
      const store = useAuthStore()
      
      // Set some data first
      store.$patch({
        currentUser: { nome: 'Test', cognome: 'User' },
        token: 'test-token'
      })
      
      // Logout
      store.logout()
      
      expect(store.currentUser).toBeNull()
      expect(store.token).toBeNull()
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(router.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('checkAuth', () => {
    it('should restore session from localStorage if token exists', async () => {
      const mockUser = {
        _id: '123',
        nome: 'Test',
        cognome: 'User',
        email: 'test@example.com',
        ruolo: 'admin'
      }
      
      // Mock localStorage having a token and user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'saved-token'
        if (key === 'user') return JSON.stringify(mockUser)
        return null
      })
      
      const store = useAuthStore()
      const result = await store.checkAuth()
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user')
      expect(store.token).toBe('saved-token')
      expect(store.currentUser).toEqual(mockUser)
      expect(result).toBe(true)
      expect(mockedAuthService.getCurrentUser).not.toHaveBeenCalled() // Should not call API if user exists in localStorage
    })

    it('should fetch user from API if only token exists', async () => {
      const mockUser = {
        id: '123',
        nome: 'Test',
        cognome: 'User',
        email: 'test@example.com',
        ruolo: 'admin' as const
      }
      
      // Mock localStorage having a token but no user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'saved-token'
        return null
      })
      
      // Mock user service response
      mockedAuthService.getCurrentUser.mockResolvedValue(mockUser)
      
      const store = useAuthStore()
      const result = await store.checkAuth()
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.getItem).toHaveBeenCalledWith('user')
      expect(store.token).toBe('saved-token')
      expect(store.currentUser).toEqual(mockUser)
      expect(mockedAuthService.getCurrentUser).toHaveBeenCalled()
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
      expect(result).toBe(true)
    })

    it('should return false and clear data if no token exists', async () => {
      // Mock localStorage not having a token
      localStorageMock.getItem.mockReturnValue(null)
      
      const store = useAuthStore()
      const result = await store.checkAuth()
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('token')
      expect(store.token).toBeNull()
      expect(store.currentUser).toBeNull()
      expect(result).toBe(false)
      expect(mockedAuthService.getCurrentUser).not.toHaveBeenCalled()
    })

    it('should return false and clear data if API call fails', async () => {
      // Mock localStorage having a token but no user
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'saved-token'
        return null
      })
      
      // Mock user service failure
      mockedAuthService.getCurrentUser.mockRejectedValue(new Error('Invalid token'))
      
      const store = useAuthStore()
      const result = await store.checkAuth()
      
      expect(store.token).toBeNull()
      expect(store.currentUser).toBeNull()
      expect(result).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })
})
