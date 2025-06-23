import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import AppuntamentiCalendar from '@/views/appuntamenti/AppuntamentiCalendar.vue';
import { useAppuntamentiStore } from '@/stores/appuntamenti';

// Mock date for consistent testing
const mockDate = new Date('2025-06-15T12:00:00Z');
vi.setSystemTime(mockDate);

// Mock router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('AppuntamentiCalendar.vue', () => {
  let wrapper;
  let store;
  
  beforeEach(() => {
    // Create a fresh pinia store for each test
    const pinia = createTestingPinia({
      createSpy: vi.fn,
    });
    
    // Create wrapper and store reference
    wrapper = mount(AppuntamentiCalendar, {
      global: {
        plugins: [pinia],
        stubs: ['router-link', 'FontAwesomeIcon'],
      },
    });
    
    store = useAppuntamentiStore();
    
    // Mock store actions and state
    store.appuntamenti = [
      {
        _id: '101',
        data: '2025-06-15',
        cliente: {
          _id: '1',
          nome: 'Mario',
          cognome: 'Rossi'
        },
        servizio: {
          _id: '201',
          nome: 'Taglio',
          durata: 30
        },
        stato: 'confermato',
        orario: {
          inizio: '14:00',
          fine: '14:30'
        }
      },
      {
        _id: '102',
        data: '2025-06-15',
        cliente: {
          _id: '2',
          nome: 'Laura',
          cognome: 'Bianchi'
        },
        servizio: {
          _id: '202',
          nome: 'Piega',
          durata: 45
        },
        stato: 'confermato',
        orario: {
          inizio: '15:00',
          fine: '15:45'
        }
      }
    ];
    store.loading = false;
  });

  it('renders calendar with appointments', () => {
    // Check if the component renders correctly
    expect(wrapper.exists()).toBe(true);
    
    // Check if appointments are displayed
    expect(wrapper.text()).toContain('Mario Rossi');
    expect(wrapper.text()).toContain('Taglio');
    expect(wrapper.text()).toContain('14:00');
    
    expect(wrapper.text()).toContain('Laura Bianchi');
    expect(wrapper.text()).toContain('Piega');
    expect(wrapper.text()).toContain('15:00');
  });

  it('calls fetchAppuntamenti on mount', () => {
    expect(store.fetchAppuntamenti).toHaveBeenCalled();
  });

  it('shows loading state when loading', async () => {
    store.loading = true;
    await wrapper.vm.$nextTick();
    
    // Check if loading indicator is displayed
    expect(wrapper.find('[data-testid="loading-indicator"]').exists()).toBe(true);
  });

  it('changes date and refetches appointments', async () => {
    // Find and click the next day button
    const nextDayButton = wrapper.find('[data-testid="next-day-button"]');
    await nextDayButton.trigger('click');
    
    // Check if store action was called with new date
    expect(store.fetchAppuntamenti).toHaveBeenCalledWith(expect.any(Object));
  });

  it('opens appointment details when appointment is clicked', async () => {
    // Find and click on an appointment
    const appointmentCard = wrapper.find('[data-testid="appointment-101"]');
    await appointmentCard.trigger('click');
    
    // Check if appointment details modal is displayed
    expect(wrapper.find('[data-testid="appointment-details"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Mario Rossi');
    expect(wrapper.text()).toContain('Taglio');
  });

  it('shows new appointment form when add button is clicked', async () => {
    // Find and click add appointment button
    const addButton = wrapper.find('[data-testid="new-appointment-button"]');
    await addButton.trigger('click');
    
    // Check if new appointment form is displayed
    expect(wrapper.find('[data-testid="appointment-form"]').exists()).toBe(true);
  });
});
