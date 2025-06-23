import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import Login from '@/views/auth/Login.vue'
import { useAuthStore } from '@/stores/auth'
import { nextTick } from 'vue'

// Mock router
jest.mock('vue-router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}))

describe('Login.vue', () => {
  const renderComponent = () => {
    const wrapper = mount(Login, {
      global: {
        plugins: [createTestingPinia({
          createSpy: jest.fn,
          stubActions: false
        })],
        stubs: {
          ForgotPasswordModal: true // Stub the modal component
        }
      }
    })
    
    const authStore = useAuthStore()
    // Mock login method
    authStore.login = jest.fn()
    
    return { wrapper, authStore }
  }
  
  it('should render correctly', () => {
    const { wrapper } = renderComponent()
    expect(wrapper.find('h2').text()).toContain('Accedi al tuo account')
    expect(wrapper.find('input[type="email"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })
  
  it('should show error message when store has error', async () => {
    const { wrapper, authStore } = renderComponent()
    
    // Simulate an error in the store
    authStore.error = 'Email o password non corretti'
    await nextTick()
    
    expect(wrapper.find('.text-red-800').text()).toContain('Email o password non corretti')
  })
  
  it('should disable submit button when loading', async () => {
    const { wrapper, authStore } = renderComponent()
    
    // Simulate loading state
    authStore.loading = true
    await nextTick()
    
    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(submitButton.text()).toContain('Accesso in corso')
  })
  
  it('should call login method with email and password on form submit', async () => {
    const { wrapper, authStore } = renderComponent()
    
    // Mock successful login
    authStore.login.mockResolvedValue(true)
    
    // Fill the form
    await wrapper.find('input[type="email"]').setValue('test@example.com')
    await wrapper.find('input[type="password"]').setValue('password123')
    
    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    
    // Check if login was called with correct params
    expect(authStore.login).toHaveBeenCalledWith('test@example.com', 'password123')
  })
  
  it('should not call login if fields are empty', async () => {
    const { wrapper, authStore } = renderComponent()
    
    // Submit form with empty fields
    await wrapper.find('form').trigger('submit.prevent')
    
    // Login should not be called
    expect(authStore.login).not.toHaveBeenCalled()
  })
})
