export interface ClientData {
  id: string;
  clientName: string;
  companyName: string; // <-- add this line
  softwareName: string;
  clientNetworkAccess: string;
}

export interface SubClientData {
  id: string;
  clientName: string;
  subClientFirstName: string;
  subClientLastName: string;
  subClientSSN: string;
  subClientSpouseName?: string;
  subClientSpouseSSN?: string;
  filingStatus: string;
  dependents: Array<{ name: string; ssn: string }>;
}

export interface CombinedData {
  slno: number;
  clientName: string;
  companyName: string;
  taxSoftware: string;
  clientId: string;
  subClientId: string | null;
  subClientName?: string;
  subClientSSN?: string; // <-- Add this line
}
