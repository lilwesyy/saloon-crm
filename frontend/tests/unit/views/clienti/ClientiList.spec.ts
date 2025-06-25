import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useRouter } from 'vue-router';
import ClientiList from '@/views/clienti/ClientiList.vue';
import { useClientiStore } from '@/stores/clienti';

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ClientiList.vue', () => {
  let wrapper;
  let store;
  
  beforeEach(() => {
    // Create a fresh pinia store for each test
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    
    // Create wrapper and store reference
    wrapper = mount(ClientiList, {
      global: {
        plugins: [pinia],
        stubs: ['router-link', 'FontAwesomeIcon'],
      },
    });
    
    store = useClientiStore();
    
    // Mock store actions and state
    store.clienti = [
      { 
        _id: '1', 
        nome: 'Mario', 
        cognome: 'Rossi', 
        email: 'mario.rossi@example.com', 
        telefono: '3331234567' 
      },
      { 
        _id: '2', 
        nome: 'Laura', 
        cognome: 'Bianchi', 
        email: 'laura.bianchi@example.com', 
        telefono: '3387654321' 
      }
    ];
    store.total = 2;
    store.loading = false;
  });

  it('renders client list when data is loaded', () => {
    // Check if the component renders correctly
    expect(wrapper.exists()).toBe(true);
    
    // Check if client data is displayed
    expect(wrapper.text()).toContain('Mario Rossi');
    expect(wrapper.text()).toContain('Laura Bianchi');
    expect(wrapper.text()).toContain('3331234567');
    expect(wrapper.text()).toContain('3387654321');
  });

  it('calls fetchClienti on mount', () => {
    expect(store.fetchClienti).toHaveBeenCalled();
  });

  it('shows loading state when loading', async () => {
    store.loading = true;
    await wrapper.vm.$nextTick();
    
    // Check if loading indicator is displayed
    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true);
  });

  it('shows empty state when no clients', async () => {
    store.clienti = [];
    store.total = 0;
    await wrapper.vm.$nextTick();
    
    // Check if empty state is displayed
    expect(wrapper.text()).toContain('Nessun cliente trovato');
  });

  it('handles client deletion', async () => {
    // Find and click the delete button for the first client
    const deleteButton = wrapper.find('[data-testid="delete-client-1"]');
    await deleteButton.trigger('click');
    
    // Check if confirmation dialog appears
    expect(wrapper.find('[data-testid="confirm-dialog"]').exists()).toBe(true);
    
    // Confirm deletion
    const confirmButton = wrapper.find('[data-testid="confirm-delete"]');
    await confirmButton.trigger('click');
    
    // Check if store action was called
    expect(store.deleteCliente).toHaveBeenCalledWith('1');
  });

  it('navigates to client details when clicked', async () => {
    const router = useRouter();
    
    // Find and click on a client row
    const clientRow = wrapper.find('[data-testid="client-row-1"]');
    await clientRow.trigger('click');
    
    // Check if router navigation was triggered
    expect(router.push).toHaveBeenCalledWith({
      name: 'cliente-detail',
      params: { id: '1' }
    });
  });
});
