import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface DayStripProps {
  dates: Date[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function DayStrip({ dates, selectedIndex, onSelect }: DayStripProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [scrollOffset, setScrollOffset] = useState(0);
  
  // Initialize scroll offset to show the selected date
  useEffect(() => {
    if (selectedIndex < scrollOffset) {
      setScrollOffset(selectedIndex);
    } else if (selectedIndex >= scrollOffset + 4) {
      setScrollOffset(Math.max(0, selectedIndex - 3));
    }
  }, [selectedIndex]);
  
  // Calculate which 4 dates to show based on scroll offset
  const visibleDates = dates.slice(scrollOffset, scrollOffset + 4);
  const canScrollLeft = scrollOffset > 0;
  const canScrollRight = scrollOffset < dates.length - 4;
  
  const handleScrollLeft = () => {
    if (canScrollLeft) {
      setScrollOffset(scrollOffset - 1);
    }
  };
  
  const handleScrollRight = () => {
    if (canScrollRight) {
      setScrollOffset(scrollOffset + 1);
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    // Find if this date already exists in our dates array
    const existingIndex = dates.findIndex(d => 
      d.toDateString() === date.toDateString()
    );
    
    if (existingIndex !== -1) {
      onSelect(existingIndex);
      // Scroll to show the selected date if it's not visible
      if (existingIndex < scrollOffset) {
        setScrollOffset(existingIndex);
      } else if (existingIndex >= scrollOffset + 4) {
        setScrollOffset(Math.max(0, existingIndex - 3));
      }
    } else {
      // Calculate days difference from the first date in our array
      const firstDate = dates[0];
      const diffTime = date.getTime() - firstDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0) {
        onSelect(diffDays);
        // Scroll to show the selected date
        if (diffDays >= scrollOffset + 4) {
          setScrollOffset(Math.max(0, diffDays - 3));
        }
      }
    }
    
    setShowDatePicker(false);
  };
  
  const selectedDate = dates[selectedIndex] || new Date();
  
  return (
    <div className="mb-5">
      {/* Date Picker Button - Top Right */}
      <div className="flex justify-end mb-3">
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/92 text-[#12204c] shadow-md border border-black/8 hover:scale-105 active:scale-95 transition-all"
          >
            <Calendar className="size-5" />
            <span className="text-sm font-medium">Select Date</span>
          </button>
          
          {/* Date Picker Popover */}
          {showDatePicker && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowDatePicker(false)}
              />
              
              {/* Popover */}
              <div className="absolute top-full right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 p-4">
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  defaultMonth={selectedDate}
                  modifiersClassNames={{
                    selected: 'bg-purple-600 text-white hover:bg-purple-700',
                    today: 'font-bold text-purple-600',
                  }}
                  className="!m-0"
                />
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Arrow Navigation + Day Cards */}
      <div className="flex items-center gap-3">
        {/* Left Arrow - Previous Day */}
        <button
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          className={`flex-shrink-0 p-2 rounded-xl transition-all ${
            canScrollLeft
              ? 'bg-white/92 text-[#12204c] shadow-md border border-black/8 hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Previous day"
        >
          <ChevronLeft className="size-5" />
        </button>
        
        {/* Day Cards */}
        <div className="flex-1 grid grid-cols-4 gap-3">
          {visibleDates.map((date, idx) => {
            const actualIndex = scrollOffset + idx;
            const isSelected = actualIndex === selectedIndex;
            
            // Check if this date is today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateOnly = new Date(date);
            dateOnly.setHours(0, 0, 0, 0);
            const isToday = dateOnly.getTime() === today.getTime();
            
            const label = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            return (
              <button
                key={actualIndex}
                onClick={() => onSelect(actualIndex)}
                className={`min-h-[104px] rounded-2xl p-4 font-bold transition-all ${
                  isSelected
                    ? 'text-white shadow-lg border-transparent'
                    : 'bg-white/92 text-[#12204c] shadow-md border border-black/8 hover:scale-105'
                }`}
                style={
                  isSelected
                    ? {
                        background: 'linear-gradient(180deg, #7f5cf6 0%, #6b66ff 100%)',
                        boxShadow: '0 16px 28px rgba(104, 94, 232, .28)',
                      }
                    : undefined
                }
              >
                <div className="text-sm mb-1">{label}</div>
                <div className="text-base">{dateStr}</div>
              </button>
            );
          })}
        </div>
        
        {/* Right Arrow - Next Day */}
        <button
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          className={`flex-shrink-0 p-2 rounded-xl transition-all ${
            canScrollRight
              ? 'bg-white/92 text-[#12204c] shadow-md border border-black/8 hover:scale-105 active:scale-95'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Next day"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </div>
  );
}