import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ExamSettings = () => {
  const { toast } = useToast();
  const [gengoDuration, setGengoDuration] = useState(60);
  const [bunkaDuration, setBunkaDuration] = useState(60);

  const updateDuration = async (category: string, duration: number) => {
    try {
      const { error } = await supabase
        .from('exams')
        .update({ duration })
        .eq('category', category);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: `Durasi ujian ${category} berhasil diperbarui`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui durasi ujian",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Durasi Ujian Gengo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Durasi (menit)</Label>
            <Input
              type="number"
              value={gengoDuration}
              onChange={(e) => setGengoDuration(parseInt(e.target.value))}
              min="1"
              max="180"
            />
          </div>
          <Button onClick={() => updateDuration('Gengo', gengoDuration)}>
            Perbarui Durasi Gengo
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Durasi Ujian Bunka</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Durasi (menit)</Label>
            <Input
              type="number"
              value={bunkaDuration}
              onChange={(e) => setBunkaDuration(parseInt(e.target.value))}
              min="1"
              max="180"
            />
          </div>
          <Button onClick={() => updateDuration('Bunka', bunkaDuration)}>
            Perbarui Durasi Bunka
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};