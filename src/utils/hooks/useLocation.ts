import { useState, useEffect } from 'react';
import { locationsAPI, Province, Commune } from '@/utils/api/locations';

export interface LocationData {
  provinces: Province[];
  communes: Commune[];
  selectedProvince: string;
  selectedCommune: string;
  loading: {
    provinces: boolean;
    communes: boolean;
  };
}

export const useLocation = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communes, setCommunes] = useState<Commune[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedCommune, setSelectedCommune] = useState<string>('');
  const [loading, setLoading] = useState({
    provinces: true,
    communes: false,
  });

  // Load provinces data on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(prev => ({ ...prev, provinces: true }));
        
        const response = await locationsAPI.getProvinces();
        
        if (response.status === 200 && response.data) {
          // Sort provinces by name
          const sortedProvinces = [...response.data].sort((a, b) => 
            a.name.localeCompare(b.name, 'vi')
          );
          setProvinces(sortedProvinces);
        }
        
        setLoading(prev => ({ ...prev, provinces: false }));
      } catch (error) {
        console.error('Error loading provinces:', error);
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, []);

  // Handle province selection
  const handleProvinceChange = async (provinceCode: string) => {
    console.log('🔄 handleProvinceChange called with:', provinceCode);
    
    setSelectedProvince(provinceCode);
    setSelectedCommune('');
    setCommunes([]);
    
    if (provinceCode) {
      setLoading(prev => ({ ...prev, communes: true }));
      
      try {
        // provinceCode here is actually the province.code (not province.id)
        // We use province.code to fetch communes
        console.log('🌐 Fetching communes for province code:', provinceCode);
        const response = await locationsAPI.getCommunesByProvince(parseInt(provinceCode));
        
        console.log('📦 Communes API response:', response);
        
        if (response.status === 200 && response.data) {
          // Sort communes by name
          const sortedCommunes = [...response.data].sort((a, b) => 
            a.name.localeCompare(b.name, 'vi')
          );
          
          console.log('✅ Setting communes:', sortedCommunes.length, sortedCommunes);
          setCommunes(sortedCommunes);
        } else {
          console.warn('⚠️ Invalid communes response:', response);
        }
      } catch (error) {
        console.error('❌ Error loading communes:', error);
      } finally {
        setLoading(prev => ({ ...prev, communes: false }));
      }
    }
  };

  // Handle commune selection
  const handleCommuneChange = (communeCode: string) => {
    console.log('🏘️ handleCommuneChange called with:', communeCode);
    
    const selectedCommune = communes.find(c => c.code.toString() === communeCode);
    console.log('🔍 Selected commune details:', selectedCommune);
    
    setSelectedCommune(communeCode);
  };

  // Get selected province name
  const getSelectedProvinceName = () => {
    const province = provinces.find(p => p.code.toString() === selectedProvince);
    return province ? province.name : '';
  };

  // Get selected commune name
  const getSelectedCommuneName = () => {
    const commune = communes.find(c => c.code.toString() === selectedCommune);
    return commune ? commune.name : '';
  };

  // Reset all selections
  const resetLocation = () => {
    setSelectedProvince('');
    setSelectedCommune('');
    setCommunes([]);
  };

  return {
    provinces,
    communes,
    selectedProvince,
    selectedCommune,
    loading,
    handleProvinceChange,
    handleCommuneChange,
    getSelectedProvinceName,
    getSelectedCommuneName,
    resetLocation,
  };
};
