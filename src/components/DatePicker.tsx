import { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format, addDays, startOfWeek, isBefore, startOfToday } from 'date-fns';
import { ClockIcon } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DatePickerProps {
  onSelect: (date: string | null) => void;
  initialDate?: string | null;
}

export default function DatePicker({ onSelect, initialDate }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = startOfToday();
  const tomorrow = addDays(today, 1);
  const nextMonday = addDays(startOfWeek(today), 8); // Next week Monday
  const nextSunday = addDays(startOfWeek(today), 7); // This weekend

  const presets = [
    { label: 'No due date', value: null },
    { label: `Today (${format(today, 'EEE')})`, value: today },
    { label: `Tomorrow (${format(tomorrow, 'EEE')})`, value: tomorrow },
    { label: 'Next week (Mon)', value: nextMonday },
    { label: 'This weekend (Sun)', value: nextSunday },
  ];

  const handleDateSelect = (date: Date | undefined) => {
    const newDate = date || null;
    setSelectedDate(newDate);
    onSelect(newDate ? newDate.toISOString() : null);
    setIsOpen(false);
  };

  const formatDisplayDate = (date: Date | null) => {
    if (!date) return 'No due date';
    return format(date, 'MMM d');
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {isOpen && (
        <div className="absolute z-10 bottom-full mb-2 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="flex flex-wrap gap-2 p-3 border-b">
            {presets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleDateSelect(preset.value || undefined)}
                className={`px-3 py-1.5 text-sm rounded-md border border-gray-200 hover:bg-gray-50
                  ${(!selectedDate && !preset.value) || (selectedDate === preset.value) ? 'bg-gray-100' : 'bg-white'}`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <DayPicker
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
            disabled={[{ before: today }]}
            className="p-3"
            showOutsideDays
            fixedWeeks
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 px-3 py-2 rounded-md"
      >
        <ClockIcon className="w-4 h-4" />
        {formatDisplayDate(selectedDate)}
      </button>
    </div>
  );
} 