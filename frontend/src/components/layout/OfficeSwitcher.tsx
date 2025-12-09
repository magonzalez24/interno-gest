import { useOffices } from '@/contexts/OfficeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const OfficeSwitcher = () => {
  const { offices, selectedOffice, setSelectedOffice } = useOffices();

  if (offices.length <= 1) {
    return null;
  }

  return (
    <Select
      value={selectedOffice?.id || ''}
      onValueChange={(value) => {
        const office = offices.find(o => o.id === value);
        if (office) {
          setSelectedOffice(office);
        }
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Seleccionar sede" />
      </SelectTrigger>
      <SelectContent>
        {offices.map((office) => (
          <SelectItem key={office.id} value={office.id}>
            {office.name} ({office.country})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

