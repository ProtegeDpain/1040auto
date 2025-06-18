import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ClientForm from './components/ClientForm';
import SubClientForm from './components/SubClientForm';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Trash2 } from 'lucide-react';
import { RiFileList2Line } from 'react-icons/ri';
import DataTable from '@/components/shared/data-table';
import { Input } from '@/components/ui/input';
import ClientAddIcon from './icons/client-add-icon';
import SubClientAdditionIcon from './icons/sub-client-add-icon';
import { ClientData, CombinedData, SubClientData } from './types/types';
import { RoleGuard } from '@/components/role-gaurd';
import { ROLES } from '@/constants/roles';
const ClientRegistration = () => {
  const [isClientFormOpen, setIsClientFormOpen] = useState(false);
  const [isSubClientFormOpen, setIsSubClientFormOpen] = useState(false);
  const [editClientData, setEditClientData] = useState<ClientData | null>(null);
  const [editSubClientData, setEditSubClientData] =
    useState<SubClientData | null>(null);
  const [clients, setClients] = useState<ClientData[]>([]);
  const [subClients, setSubClients] = useState<SubClientData[]>([]);
  const [clientNameFilter, setClientNameFilter] = useState('');
  const [subClientNameFilter, setSubClientNameFilter] = useState('');
  const [ssnFilter, setSSNFilter] = useState('');
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'client' | 'subClient';
    id: string;
  } | null>(null);

  const handleClientSubmit = (data: any) => {
    if (editClientData) {
      setClients(
        clients.map((c) =>
          c.id === editClientData.id ? { ...data, id: c.id } : c
        )
      );
      setEditClientData(null);
    } else {
      setClients([...clients, { ...data, id: crypto.randomUUID() }]);
    }
    setIsClientFormOpen(false);
  };

  const handleSubClientSubmit = (data: any) => {
    if (editSubClientData) {
      setSubClients(
        subClients.map((sc) =>
          sc.id === editSubClientData.id ? { ...data, id: sc.id } : sc
        )
      );
      setEditSubClientData(null);
    } else {
      setSubClients([...subClients, { ...data, id: crypto.randomUUID() }]);
    }
    setIsSubClientFormOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'client') {
      setClients(clients.filter((c) => c.id !== deleteTarget.id));
      setSubClients(
        subClients.filter(
          (sc) =>
            sc.clientName !==
            clients.find((c) => c.id === deleteTarget.id)?.clientName
        )
      );
    } else {
      setSubClients(subClients.filter((sc) => sc.id !== deleteTarget.id));
    }
    setIsDeletePopupOpen(false);
    setDeleteTarget(null);
  };

  const combinedData: CombinedData[] = useMemo(() => {
    const result: CombinedData[] = [];
    let slno = 1;

    clients.forEach((client) => {
      const relatedSubClients = subClients.filter(
        (sc) => sc.clientName === client.clientName
      );
      if (relatedSubClients.length === 0) {
        result.push({
          slno: slno++,
          clientName: client.clientName,
          companyName: client.companyName, // <-- add companyName
          subClientName: undefined,
          subClientSSN: undefined, // <-- add subClientSSN
          taxSoftware: client.softwareName,
          clientId: client.id,
          subClientId: null
        });
      } else {
        relatedSubClients.forEach((sc) => {
          result.push({
            slno: slno++,
            clientName: client.clientName,
            companyName: client.companyName, // <-- add companyName
            subClientName: `${sc.subClientFirstName} ${sc.subClientLastName}`,
            subClientSSN: sc.subClientSSN || '', // <-- add subClientSSN
            taxSoftware: client.softwareName,
            clientId: client.id,
            subClientId: sc.id
          });
        });
      }
    });

    return result.filter(
      (item) =>
        item.clientName
          .toLowerCase()
          .includes(clientNameFilter.toLowerCase()) &&
        (item.subClientName
          ? item.subClientName
              .toLowerCase()
              .includes(subClientNameFilter.toLowerCase())
          : subClientNameFilter === '') &&
        (ssnFilter
          ? (item.subClientSSN || '')
              .replace(/[-\s]/g, '')
              .includes(ssnFilter.replace(/[-\s]/g, ''))
          : true)
    );
  }, [clients, subClients, clientNameFilter, subClientNameFilter, ssnFilter]);

  const columns: ColumnDef<CombinedData>[] = [
    {
      accessorKey: 'slno',
      header: () => <div className="text-center font-semibold">Sl. No.</div>,
      cell: ({ row }) => (
        <div className="py-2 text-center">{row.original.slno}</div>
      )
    },
    {
      accessorKey: 'companyName',
      header: () => <div className="text-left font-semibold">Company Name</div>,
      cell: ({ row }) => (
        <div className="px-2 py-2">{row.original.companyName || '-'}</div>
      )
    },
    {
      accessorKey: 'clientName',
      header: () => <div className="text-left font-semibold">Client Name</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-between px-2 py-2">
          <span className="truncate">{row.original.clientName}</span>
          <div className="flex gap-2">
            <RoleGuard allowedRoles={[ROLES.ADMIN]}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const client = clients.find(
                    (c) => c.id === row.original.clientId
                  );
                  setEditClientData(client || null);
                  setIsClientFormOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteTarget({ type: 'client', id: row.original.clientId });
                  setIsDeletePopupOpen(true);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </RoleGuard>
          </div>
        </div>
      )
    },
    {
      accessorKey: 'subClientName',
      header: () => (
        <div className="text-left font-semibold">Sub Client Name</div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-between px-2 py-2">
          <span className="truncate">{row.original.subClientName || '-'}</span>
          {row.original.subClientId && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const subClient = subClients.find(
                    (sc) => sc.id === row.original.subClientId
                  );
                  setEditSubClientData(subClient || null);
                  setIsSubClientFormOpen(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDeleteTarget({
                    type: 'subClient',
                    id: row.original.subClientId!
                  });
                  setIsDeletePopupOpen(true);
                }}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )
    },
    {
      accessorKey: 'subClientSSN',
      header: () => (
        <div className="text-left font-semibold">Sub Client SSN</div>
      ),
      cell: ({ row }) => (
        <div className="px-2 py-2">{row.original.subClientSSN || '-'}</div>
      )
    },
    {
      accessorKey: 'taxSoftware',
      header: () => (
        <div className="text-center font-semibold">Tax Software</div>
      ),
      cell: ({ row }) => (
        <div className="py-2 text-center">{row.original.taxSoftware}</div>
      )
    }
  ];

  return (
    <div className="min-h-screen overflow-y-auto bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-full flex-col gap-6 md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)] lg:flex-row">
        {/* DataTable Section - Left Side */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 md:text-3xl lg:text-left">
            Client Registration System
          </h1>

          <div className="mx-3 mb-6 flex flex-col gap-4 sm:flex-row">
            <Input
              placeholder="Search by Client Name"
              value={clientNameFilter}
              onChange={(e) => setClientNameFilter(e.target.value)}
              className="w-full rounded-lg border-gray-300 bg-gray-100 px-4 py-2 sm:w-1/2"
            />
            <Input
              placeholder="Search by Sub Client Name"
              value={subClientNameFilter}
              onChange={(e) => setSubClientNameFilter(e.target.value)}
              className="w-full rounded-lg border-gray-300 bg-gray-100 px-4 py-2 sm:w-1/2"
            />
            <Input
              placeholder="Search by Sub Client SSN"
              value={ssnFilter}
              onChange={(e) => setSSNFilter(e.target.value)}
              className="w-full rounded-lg border-gray-300 bg-gray-100 px-4 py-2 sm:w-1/2"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {combinedData.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center rounded-lg bg-gray-50 py-12">
                <RiFileList2Line className="mb-4 h-12 w-12 text-gray-400 md:h-16 md:w-16" />
                <p className="text-base text-gray-500 md:text-lg">
                  No clients or sub-clients registered yet
                </p>
                <p className="mt-2 text-sm text-gray-400">
                  Add a new client or sub-client to get started
                </p>
              </div>
            ) : (
              <DataTable<CombinedData, unknown>
                columns={columns}
                data={combinedData}
                pageCount={Math.ceil(combinedData.length / 10)}
                pageSizeOptions={[10, 20, 30, 40, 50]}
              />
            )}
          </div>
        </div>

        {/* Action Cards & Guidelines - Right Side */}
        <div className="flex w-full flex-col gap-6 overflow-y-auto rounded-lg bg-white p-6 shadow-sm lg:w-[30%]">
          <div className="grid grid-cols-1 gap-6">
            {/* Add New Client Card */}
            <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#1b9bd8] md:h-16 md:w-16">
                  <SubClientAdditionIcon className="h-6 w-6 text-white md:h-8 md:w-8" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-xl">
                  Add New Client
                </h3>
                <p className="mb-6 text-sm text-gray-600 md:text-base">
                  Register a new primary client with network access, and
                  software details.
                </p>
                <Button
                  onClick={() => setIsClientFormOpen(true)}
                  className="w-full bg-[#1b9bd8] py-2 font-medium text-white hover:bg-[#1b8bd8] md:py-3"
                >
                  Open Client Form
                </Button>
              </div>
            </div>

            {/* Add New Sub Client Card */}
            <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-100 p-6">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-600 md:h-16 md:w-16">
                  <ClientAddIcon className="h-6 w-6 text-white md:h-8 md:w-8" />
                </div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900 md:text-xl">
                  Add New Sub Client
                </h3>
                <p className="mb-6 text-sm text-gray-600 md:text-base">
                  Register a sub-client with personal details, spouse
                  information, and filing status.
                </p>
                <Button
                  onClick={() => setIsSubClientFormOpen(true)}
                  className="w-full bg-green-600 py-2 font-medium text-white hover:bg-green-700 md:py-3"
                >
                  Open Sub Client Form
                </Button>
              </div>
            </div>
          </div>

          {/* Registration Guidelines */}
          <div className="flex-shrink-0 rounded-lg bg-gray-50 p-6">
            <h4 className="mb-3 text-base font-medium text-gray-900 md:text-lg">
              Registration Guidelines
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 md:text-base">
              <li className="flex items-start">
                <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
                <span>
                  Primary clients require tax year and network access
                  configuration
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></span>
                <span>
                  Sub-clients are associated with primary clients and include
                  personal tax information
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-purple-500"></span>
                <span>
                  Dependents can be added after sub-client registration is
                  complete
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Client Form Modal */}
      <ClientForm
        isOpen={isClientFormOpen}
        onSubmit={handleClientSubmit}
        onCancel={() => {
          setIsClientFormOpen(false);
          setEditClientData(null);
        }}
        editData={editClientData}
      />

      {/* SubClient Form Modal */}
      <SubClientForm
        isOpen={isSubClientFormOpen}
        onSubmit={handleSubClientSubmit}
        onCancel={() => {
          setIsSubClientFormOpen(false);
          setEditSubClientData(null);
        }}
        //@ts-ignore
        editData={editSubClientData}
        clients={clients.map((c) => ({
          id: c.id,
          companyName: c.companyName,
          name: c.clientName
        }))}
      />

      {/* Delete Confirmation Popup */}
      {isDeletePopupOpen && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete{' '}
              {deleteTarget.type === 'client'
                ? `the client "${clients.find((c) => c.id === deleteTarget.id)?.clientName}"? This will also remove all associated sub-clients.`
                : `the sub-client "${(() => {
                    const sc = subClients.find(
                      (sc) => sc.id === deleteTarget.id
                    );
                    return sc
                      ? `${sc.subClientFirstName} ${sc.subClientLastName}`
                      : '';
                  })()}"?`}
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeletePopupOpen(false);
                  setDeleteTarget(null);
                }}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientRegistration;
