
export interface LivelloFedelta {
  nome: string
  puntiRichiesti: number
  scontoPercentuale: number
  moltiplicatorePunti: number
  descrizione?: string
}

export interface RegoleFedelta {
  scadenzaPunti: number
  puntiMinimiRiscatto: number
  maxPuntiPerGiorno: number
  maxScontoPerOrdine: number
  cumulabileConPromozioni: boolean
  automatico: boolean
}

export interface StatisticheProgramma {
  membriAttivi: number
  puntiDistribuiti: number
  premiRiscattati: number
  fatturatoGenerato: number
  livelloMedioPunti: number
  tassoRiscatto: number
}

export interface ProgrammaFedelta {
  _id: string
  nome: string
  descrizione?: string
  tipoPunti: 'spesa' | 'visite' | 'servizi'
  puntiPerEuro: number
  attivo: boolean
  livelli: LivelloFedelta[]
  regole: RegoleFedelta
  dataCreazione: Date
  dataAggiornamento: Date
  statistiche?: StatisticheProgramma
}

export interface MembroFedelta {
  _id: string
  cliente: {
    _id: string
    nome: string
    cognome: string
    email: string
    telefono?: string
  }
  programma: string
  puntiAttuali: number
  livelloAttuale: string
  puntiTotaliGuadagnati: number
  premiRiscattati: number
  dataIscrizione: Date
  dataUltimaAttivita: Date
  attivo: boolean
}

export interface StoricoPunti {
  _id: string
  membro: string
  tipo: 'guadagno' | 'riscatto' | 'scadenza' | 'bonus'
  punti: number
  motivo: string
  data: Date
  ordine?: string
  appuntamento?: string
}

export interface ProgrammaFedeltaFilters {
  search?: string
  attivo?: string
  tipoPunti?: string
  dataCreazioneDa?: Date
  dataCreazioneA?: Date
}

export interface MembroFedeltaFilters {
  search?: string
  programma?: string
  livello?: string
  attivo?: string
  puntiMinimi?: number
  puntiMassimi?: number
  dataIscrizioneDa?: Date
  dataIscrizioneA?: Date
}

export interface CreateProgrammaFedeltaData {
  nome: string
  descrizione?: string
  tipoPunti: 'spesa' | 'visite' | 'servizi'
  puntiPerEuro: number
  attivo: boolean
  livelli: Omit<LivelloFedelta, '_id'>[]
  regole: RegoleFedelta
}

export interface UpdateProgrammaFedeltaData extends Partial<CreateProgrammaFedeltaData> {
  dataAggiornamento: Date
}

export interface AssegnaPuntiData {
  membro: string
  punti: number
  motivo: string
  ordine?: string
  appuntamento?: string
}

export interface RiscattaPuntiData {
  membro: string
  punti: number
  motivo: string
  valoreRiscatto: number
}

export interface ProgrammaFedeltaStats {
  totalPrograms: number
  totalMembers: number
  totalRewards: number
  totalPointsIssued: number
  averagePointsPerMember: number
  monthlyGrowth: number
}

export interface MembroFedeltaStats {
  puntiGuadagnatiOggi: number
  puntiGuadagnatiMese: number
  premiRiscattatiMese: number
  posizioneLivello: number
  puntiProssimoLivello: number
  percentualeProgresso: number
}

// API Response types
export interface ProgrammaFedeltaResponse {
  success: boolean
  data: ProgrammaFedelta
  message?: string
}

export interface ProgrammiFedeltaResponse {
  success: boolean
  data: ProgrammaFedelta[]
  total: number
  page: number
  limit: number
  message?: string
}

export interface MembriFedeltaResponse {
  success: boolean
  data: MembroFedelta[]
  total: number
  page: number
  limit: number
  message?: string
}

export interface StatisticheProgrammaResponse {
  success: boolean
  data: StatisticheProgramma
  message?: string
}

export interface StoricoPuntiResponse {
  success: boolean
  data: StoricoPunti[]
  total: number
  page: number
  limit: number
  message?: string
}

// Error types
export interface ProgrammaFedeltaError {
  code: string
  message: string
  details?: any
}
