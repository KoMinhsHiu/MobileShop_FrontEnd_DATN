import { useState, useEffect, useMemo } from 'react';

export interface Province {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code: number;
  districts: District[];
}

export interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: Ward[];
}

export interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}

export interface AddressData {
  provinces: Province[];
  districts: District[];
  wards: Ward[];
  selectedProvince: string;
  selectedDistrict: string;
  selectedWard: string;
  loading: {
    provinces: boolean;
    districts: boolean;
    wards: boolean;
  };
}

export const useAddress = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [loading, setLoading] = useState({
    provinces: true,
    districts: false,
    wards: false,
  });

  // Load provinces data on mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoading(prev => ({ ...prev, provinces: true }));
        
        // Import provinces data from JSON file
        const provincesData = await import('../../../public/data/provinces.json');
        
        // Sort provinces by name
        const sortedProvinces = [...provincesData.default].sort((a, b) => 
          a.name.localeCompare(b.name, 'vi')
        );
        
        setProvinces(sortedProvinces);
        setLoading(prev => ({ ...prev, provinces: false }));
      } catch (error) {
        console.error('Error loading provinces:', error);
        setLoading(prev => ({ ...prev, provinces: false }));
      }
    };

    loadProvinces();
  }, []);

  // Handle province selection
  const handleProvinceChange = (provinceCode: string) => {
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setWards([]);
    
    if (provinceCode) {
      setLoading(prev => ({ ...prev, districts: true }));
      
      const province = provinces.find(p => p.code.toString() === provinceCode);
      if (province) {
        const sortedDistricts = [...province.districts].sort((a, b) => 
          a.name.localeCompare(b.name, 'vi')
        );
        setDistricts(sortedDistricts);
      }
      
      setLoading(prev => ({ ...prev, districts: false }));
    } else {
      setDistricts([]);
    }
  };

  // Handle district selection
  const handleDistrictChange = (districtCode: string) => {
    setSelectedDistrict(districtCode);
    setSelectedWard('');
    setWards([]);
    
    if (districtCode) {
      setLoading(prev => ({ ...prev, wards: true }));
      
      const district = districts.find(d => d.code.toString() === districtCode);
      if (district) {
        const sortedWards = [...district.wards].sort((a, b) => 
          a.name.localeCompare(b.name, 'vi')
        );
        setWards(sortedWards);
      }
      
      setLoading(prev => ({ ...prev, wards: false }));
    } else {
      setWards([]);
    }
  };

  // Handle ward selection
  const handleWardChange = (wardCode: string) => {
    setSelectedWard(wardCode);
  };

  // Get selected province name
  const selectedProvinceName = useMemo(() => {
    const province = provinces.find(p => p.code.toString() === selectedProvince);
    return province ? province.name : '';
  }, [provinces, selectedProvince]);

  // Get selected district name
  const selectedDistrictName = useMemo(() => {
    const district = districts.find(d => d.code.toString() === selectedDistrict);
    return district ? district.name : '';
  }, [districts, selectedDistrict]);

  // Get selected ward name
  const selectedWardName = useMemo(() => {
    const ward = wards.find(w => w.code.toString() === selectedWard);
    return ward ? ward.name : '';
  }, [wards, selectedWard]);

  // Reset all selections
  const resetAddress = () => {
    setSelectedProvince('');
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
  };

  return {
    provinces,
    districts,
    wards,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    selectedProvinceName,
    selectedDistrictName,
    selectedWardName,
    loading,
    handleProvinceChange,
    handleDistrictChange,
    handleWardChange,
    resetAddress,
  };
};
