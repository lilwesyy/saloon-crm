const cron = require('node-cron');
const ReminderService = require('./reminder.service');

class SchedulerService {
  constructor() {
    this.tasks = new Map();
    this.isRunning = false;
  }

  /**
   * Avvia il scheduler per i reminder automatici
   */
  start() {
    if (this.isRunning) {
      console.log('Scheduler già in esecuzione');
      return;
    }

    console.log('Avvio scheduler per reminder automatici...');

    // Esegue ogni 15 minuti per controllare reminder da inviare
    const reminderTask = cron.schedule('*/15 * * * *', async () => {
      try {
        console.log('Esecuzione controllo reminder automatici...');
        
        // Controlla e invia reminder per tutti i tipi
        const results = await Promise.all([
          ReminderService.eseguiReminder('24h'),
          ReminderService.eseguiReminder('2h'),
          ReminderService.eseguiReminder('30m')
        ]);

        const totalSent = results.reduce((sum, result) => sum + result.inviati, 0);
        if (totalSent > 0) {
          console.log(`Reminder automatici inviati: ${totalSent}`);
        }

      } catch (error) {
        console.error('Errore durante l\'esecuzione dei reminder automatici:', error);
      }
    }, {
      scheduled: false // Non avvia immediatamente
    });

    this.tasks.set('reminder', reminderTask);
    reminderTask.start();
    this.isRunning = true;

    console.log('Scheduler avviato con successo');
  }

  /**
   * Ferma il scheduler
   */
  stop() {
    if (!this.isRunning) {
      console.log('Scheduler non è in esecuzione');
      return;
    }

    console.log('Fermata scheduler...');
    
    this.tasks.forEach((task, name) => {
      task.stop();
      console.log(`Task '${name}' fermato`);
    });

    this.tasks.clear();
    this.isRunning = false;
    console.log('Scheduler fermato');
  }

  /**
   * Riavvia il scheduler
   */
  restart() {
    this.stop();
    setTimeout(() => {
      this.start();
    }, 1000);
  }

  /**
   * Ottiene lo stato del scheduler
   */
  getStatus() {
    const taskStatus = {};
    this.tasks.forEach((task, name) => {
      taskStatus[name] = {
        running: task.running || false,
        options: task.options || {}
      };
    });

    return {
      isRunning: this.isRunning,
      tasksCount: this.tasks.size,
      tasks: taskStatus,
      uptime: this.isRunning ? Date.now() : null
    };
  }

  /**
   * Aggiunge un task personalizzato
   */
  addTask(name, cronExpression, callback, options = {}) {
    if (this.tasks.has(name)) {
      throw new Error(`Task '${name}' già esistente`);
    }

    const task = cron.schedule(cronExpression, callback, {
      scheduled: false,
      ...options
    });

    this.tasks.set(name, task);

    if (this.isRunning) {
      task.start();
    }

    return task;
  }

  /**
   * Rimuove un task
   */
  removeTask(name) {
    const task = this.tasks.get(name);
    if (task) {
      task.stop();
      this.tasks.delete(name);
      return true;
    }
    return false;
  }

  /**
   * Esegue immediatamente tutti i reminder per test
   */
  async executeReminderTest() {
    try {
      console.log('Esecuzione test reminder...');
      
      const results = await Promise.all([
        ReminderService.eseguiReminder('24h'),
        ReminderService.eseguiReminder('2h'),
        ReminderService.eseguiReminder('30m')
      ]);

      return {
        success: true,
        results: results,
        totalSent: results.reduce((sum, result) => sum + result.inviati, 0),
        timestamp: new Date()
      };

    } catch (error) {
      console.error('Errore durante test reminder:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }
}

// Istanza singleton
const schedulerService = new SchedulerService();

module.exports = schedulerService;
