import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface TimetableEntry {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  lecturer_name: string | null;
  room: string | null;
  subject: { name: string; code: string } | null;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function TimetableView({ gradeLevel }: { gradeLevel: string }) {
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTimetable();
  }, [gradeLevel]);

  const loadTimetable = async () => {
    const { data } = await supabase
      .from("timetable_entries" as any)
      .select("id, day_of_week, start_time, end_time, lecturer_name, room, subject:subjects(name, code)")
      .eq("grade_level", gradeLevel)
      .order("start_time", { ascending: true });

    if (data) setEntries(data as unknown as TimetableEntry[]);
    setLoading(false);
  };

  const formatTime = (t: string) => t?.slice(0, 5) || "";

  const getEntriesForDay = (day: string) =>
    entries.filter((e) => e.day_of_week === day);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-1">No Timetable Available</h3>
          <p className="text-muted-foreground text-sm">
            Your class timetable hasn't been published yet. Check back later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        Weekly Timetable
      </h2>

      <div className="grid gap-4">
        {DAYS.map((day) => {
          const dayEntries = getEntriesForDay(day);
          if (dayEntries.length === 0) return null;

          return (
            <Card key={day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">{day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="text-sm font-mono text-muted-foreground w-28 shrink-0">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {(entry.subject as any)?.name || "TBA"}
                      </p>
                      {entry.lecturer_name && (
                        <p className="text-xs text-muted-foreground">{entry.lecturer_name}</p>
                      )}
                    </div>
                    {entry.room && (
                      <Badge variant="outline" className="shrink-0">
                        <MapPin className="h-3 w-3 mr-1" />
                        {entry.room}
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
