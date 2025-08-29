import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const Calendar = React.forwardRef(({ className, classNames, showOutsideDays = true, ...props }, ref) => {
  // Simplified calendar component - in production you'd want to use react-day-picker
  return (
    <div className={cn("p-3", className)} {...props} ref__={ref}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-semibold">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }, (_, i) => (
            <Button
              key={i}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 font-normal"
              onClick={() => props.onSelect?.(new Date())}
            >
              {((i - 6) % 31) + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});
Calendar.displayName = "Calendar"
