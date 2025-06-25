import { config } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

// Mock global objects
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Global test configuration
config.global.plugins = [createTestingPinia({ createSpy: jest.fn })]

// Mock router
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
    query: {},
    path: '/',
  }),
}))

// Mock axios
jest.mock('axios', () => ({
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    })),
  },
}))
