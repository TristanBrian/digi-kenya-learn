import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Info, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
}

const priorityConfig: Record<string, { color: string; icon: any; label: string }> = {
  urgent: { color: "bg-destructive text-destructive-foreground", icon: AlertTriangle, label: "Urgent" },
  high: { color: "bg-primary text-primary-foreground", icon: Megaphone, label: "Important" },
  normal: { color: "bg-secondary text-secondary-foreground", icon: Info, label: "Info" },
  low: { color: "bg-muted text-muted-foreground", icon: Info, label: "Notice" },
};

export function AnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements" as any)
      .select("*")
      .eq("published", true)
      .or("target_audience.eq.all,target_audience.eq.students")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setAnnouncements(data as unknown as Announcement[]);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        Announcements
      </h2>

      {announcements.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-1">No Announcements</h3>
            <p className="text-muted-foreground text-sm">
              There are no announcements at this time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {announcements.map((a) => {
            const config = priorityConfig[a.priority] || priorityConfig.normal;
            const Icon = config.icon;
            return (
              <Card key={a.id} className={a.priority === "urgent" ? "border-destructive/30" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${config.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{a.title}</CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(a.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge className={config.color}>{config.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">{a.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
