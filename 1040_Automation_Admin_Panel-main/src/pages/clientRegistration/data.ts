// Dummy data for the client management system

export interface Client {
  id: string;
  name: string;
  softwareName: string;
  clientNetworkAccess: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubClient {
  id: string;
  clientId: string;
  name: string;
  middleInitial?: string;
  lastName?: string;
  ssn: string;
  spouseName?: string;
  spouseMiddleInitial?: string;
  spouseLastName?: string;
  spouseSSN?: string;
  filingStatus: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Dependent {
  id: string;
  subClientId: string;
  name: string;
  middleInitial?: string;
  lastName?: string;
  ssn: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TableRow {
  slno: number;
  clientName: string;
  subClientName: string;
  taxSoftware: string;
  clientId: string;
  subClientId: string;
}

export const dummyClients: Client[] = [
  {
    id: '1',
    name: 'ABC Corporation',
    softwareName: 'Drake',
    clientNetworkAccess: 'rdc',
    isArchived: false,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'XYZ Enterprises',
    softwareName: 'Drake',
    clientNetworkAccess: 'vpn-rdc',
    isArchived: false,
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'Tech Solutions LLC',
    softwareName: 'Drake',
    clientNetworkAccess: 'vpn',
    isArchived: false,
    createdAt: '2024-02-05T09:45:00Z',
    updatedAt: '2024-02-05T09:45:00Z'
  },
  {
    id: '4',
    name: 'Global Services Inc',
    softwareName: 'Drake',
    clientNetworkAccess: 'rdc',
    isArchived: false,
    createdAt: '2024-02-10T16:20:00Z',
    updatedAt: '2024-02-10T16:20:00Z'
  }
];

export const dummySubClients: SubClient[] = [
  {
    id: '1',
    clientId: '1',
    name: 'John',
    middleInitial: 'A',
    lastName: 'Smith',
    ssn: '123-45-6789',
    spouseName: 'Jane',
    spouseMiddleInitial: 'B',
    spouseLastName: 'Smith',
    spouseSSN: '987-65-4321',
    filingStatus: 'married-filing-jointly',
    isArchived: false,
    createdAt: '2024-01-16T11:00:00Z',
    updatedAt: '2024-01-16T11:00:00Z'
  },
  {
    id: '2',
    clientId: '1',
    name: 'Robert Johnson',
    ssn: '456-78-9012',
    spouseName: '',
    spouseSSN: '',
    filingStatus: 'single',
    isArchived: false,
    createdAt: '2024-01-17T13:30:00Z',
    updatedAt: '2024-01-17T13:30:00Z'
  },
  {
    id: '3',
    clientId: '2',
    name: 'Michael Davis',
    ssn: '789-01-2345',
    spouseName: 'Sarah Davis',
    spouseSSN: '234-56-7890',
    filingStatus: 'married-filing-separately',
    isArchived: false,
    createdAt: '2024-01-21T10:15:00Z',
    updatedAt: '2024-01-21T10:15:00Z'
  },
  {
    id: '4',
    clientId: '3',
    name: 'Lisa Wilson',
    ssn: '345-67-8901',
    spouseName: '',
    spouseSSN: '',
    filingStatus: 'head-of-household',
    isArchived: false,
    createdAt: '2024-02-06T14:45:00Z',
    updatedAt: '2024-02-06T14:45:00Z'
  },
  {
    id: '5',
    clientId: '3',
    name: 'David Brown',
    ssn: '567-89-0123',
    spouseName: 'Emma Brown',
    spouseSSN: '890-12-3456',
    filingStatus: 'married-filing-jointly',
    isArchived: false,
    createdAt: '2024-02-07T09:20:00Z',
    updatedAt: '2024-02-07T09:20:00Z'
  },
  {
    id: '6',
    clientId: '4',
    name: 'Jennifer Taylor',
    ssn: '678-90-1234',
    spouseName: '',
    spouseSSN: '',
    filingStatus: 'single',
    isArchived: false,
    createdAt: '2024-02-11T15:10:00Z',
    updatedAt: '2024-02-11T15:10:00Z'
  }
];

export const dummyDependents: Dependent[] = [
  {
    id: '1',
    subClientId: '1',
    name: 'Emily',
    middleInitial: 'C',
    lastName: 'Smith',
    ssn: '111-22-3333',
    isArchived: false,
    createdAt: '2024-01-16T11:30:00Z',
    updatedAt: '2024-01-16T11:30:00Z'
  },
  {
    id: '2',
    subClientId: '1',
    name: 'James Smith',
    ssn: '444-55-6666',
    isArchived: false,
    createdAt: '2024-01-16T11:35:00Z',
    updatedAt: '2024-01-16T11:35:00Z'
  },
  {
    id: '3',
    subClientId: '4',
    name: 'Alex Wilson',
    ssn: '777-88-9999',
    isArchived: false,
    createdAt: '2024-02-06T15:00:00Z',
    updatedAt: '2024-02-06T15:00:00Z'
  },
  {
    id: '4',
    subClientId: '4',
    name: 'Sophia Wilson',
    ssn: '000-11-2222',
    isArchived: false,
    createdAt: '2024-02-06T15:05:00Z',
    updatedAt: '2024-02-06T15:05:00Z'
  },
  {
    id: '5',
    subClientId: '5',
    name: 'Oliver Brown',
    ssn: '333-44-5555',
    isArchived: false,
    createdAt: '2024-02-07T09:45:00Z',
    updatedAt: '2024-02-07T09:45:00Z'
  }
];

// Generate table data by combining clients and subclients
export const generateTableData = (): TableRow[] => {
  const tableData: TableRow[] = [];
  let slno = 1;

  dummySubClients.forEach((subClient) => {
    const client = dummyClients.find((c) => c.id === subClient.clientId);
    if (client) {
      tableData.push({
        slno: slno++,
        clientName: client.name,
        subClientName: subClient.name,
        taxSoftware:
          client.softwareName.charAt(0).toUpperCase() +
          client.softwareName.slice(1),
        clientId: client.id,
        subClientId: subClient.id
      });
    }
  });

  return tableData;
};

// Helper functions to get data by ID
export const getClientById = (id: string): Client | undefined => {
  return dummyClients.find((client) => client.id === id);
};

export const getSubClientById = (id: string): SubClient | undefined => {
  return dummySubClients.find((subClient) => subClient.id === id);
};

export const getDependentsBySubClientId = (
  subClientId: string
): Dependent[] => {
  return dummyDependents.filter(
    (dependent) => dependent.subClientId === subClientId
  );
};

export const getSubClientsByClientId = (clientId: string): SubClient[] => {
  return dummySubClients.filter((subClient) => subClient.clientId === clientId);
};

export interface SubClientFormValue {
  companyName: string;
  filingStatus: string;
  residentState: string;
  clientName: string;
  // ...existing code...
}
