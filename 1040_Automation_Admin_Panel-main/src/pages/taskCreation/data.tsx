import { Icons } from "@/components/ui/icons";

export const companyClientList = [
  { companyName: 'Company A', clientName: 'Client 1', softwareType: 'VPN+RDC' },
  { companyName: 'Company B', clientName: 'Client 2', softwareType: 'RDC' }
];

export const subClientList = [
  { subClientName: 'Sub Client 1' },
  { subClientName: 'Sub Client 2' }
];

export const softwareTypes = [
  { value: 'VPN+RDC', label: 'VPN + RDC' },
  { value: 'RDC', label: 'RDC Only' },
  { value: 'Splashtop', label: 'Splashtop' }
];

export const mockTimeline = [
  {
    label: 'Files Uploaded',
    date: '2025-05-23 10:30:00',
    icon: <Icons.page className="h-6 w-6 text-green-600" />,
    downloadable: false,
    active: true,
    downloadLabel: ''
  },
  {
    label: 'Pending',
    date: '2025-05-23 10:35:00',
    icon: <Icons.spinner className="h-6 w-6 animate-spin text-yellow-600" />,
    downloadable: false,
    active: true,
    downloadLabel: ''
  },
  {
    label: 'Workbook Created',
    date: '2025-05-23 10:40:00',
    icon: <Icons.post className="h-6 w-6 text-green-600" />,
    downloadable: true,
    active: true,
    downloadLabel: 'Workbook'
  },
  {
    label: 'Drake Report Created',
    date: '2025-05-23 10:45:00',
    icon: <Icons.post className="h-6 w-6 text-green-600" />,
    downloadable: true,
    active: true,
    downloadLabel: 'Drake Report'
  },
  {
    label: 'Lead Sheet Created',
    date: '',
    icon: <Icons.post className="h-6 w-6 text-gray-400" />,
    downloadable: true,
    active: false,
    downloadLabel: 'Lead Sheet'
  },
  {
    label: 'Completed',
    date: '',
    icon: <Icons.check className="h-6 w-6 text-gray-400" />,
    downloadable: false,
    active: false,
    downloadLabel: ''
  }
];

export const initialMockTasks = [
  {
    client: 'Acme Corporation',
    subClient: 'Subsidiary A',
    software: 'Drake',
    softwareType: 'VPN+RDC',
    status: 'uploading',
    lastProcessDate: '2025-06-10'
  },
  {
    client: 'Beta Industries',
    subClient: 'Branch B',
    software: 'Drake',
    softwareType: 'RDC',
    status: 'pending',
    lastProcessDate: '2025-06-10'
  },
  {
    client: 'Gamma Solutions',
    subClient: 'Division C',
    software: 'Drake',
    softwareType: 'Splashtop',
    status: 'workbook',
    lastProcessDate: '2025-06-10'
  },
  {
    client: 'Delta Corp',
    subClient: 'Unit D',
    software: 'Drake',
    softwareType: 'VPN+RDC',
    status: 'drake',
    lastProcessDate: '2025-06-10'
  },
  {
    client: 'Epsilon Ltd',
    subClient: 'Group E',
    software: 'Drake',
    softwareType: 'RDC',
    status: 'leadsheet',
    lastProcessDate: '2025-06-10'
  },
  {
    client: 'Zeta Inc',
    subClient: 'Section F',
    software: 'Drake',
    softwareType: 'Splashtop',
    status: 'completed',
    lastProcessDate: '2025-06-10'
  }
];

export const initialFormState = {
  taskId: 'XXXXXXXXXX',
  companyName: '',
  clientName: '',
  subClientName: '',
  taxYear: '',
  residentState: '',
  software: '',
  softwareType: '',
  softwareUser: '',
  softwarePass: '',
  vpnUser: '',
  vpnPass: '',
  rdcUser: '',
  rdcComputer: '',
  rdcPass: '',
  splashtopEmail: '',
  splashtopPass: '',
  remoteIp: ''
};