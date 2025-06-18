import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/providers/axiosInstance';

interface SoftwareType {
  id: string | number;
  name: string;
}
interface NetworkAccessType {
  id: string | number;
  name: string;
}

interface TypesContextValue {
  softwareTypes: SoftwareType[];
  networkAccessTypes: NetworkAccessType[];
}

const TypesContext = createContext<TypesContextValue>({
  softwareTypes: [],
  networkAccessTypes: [],
});

export const TypesProvider = ({ children }) => {
  const [softwareTypes, setSoftwareTypes] = useState<SoftwareType[]>([]);
  const [networkAccessTypes, setNetworkAccessTypes] = useState<NetworkAccessType[]>([]);

  useEffect(() => {
    axiosInstance.get('/api/tools/software-types').then(res => {
      setSoftwareTypes(res.data);
    });
    axiosInstance.get('/api/tools/network-access-types').then(res => {
      setNetworkAccessTypes(res.data);
    });
  }, []);

  return (
    <TypesContext.Provider value={{ softwareTypes, networkAccessTypes }}>
      {children}
    </TypesContext.Provider>
  );
};

export const useTypes = () => useContext(TypesContext);
