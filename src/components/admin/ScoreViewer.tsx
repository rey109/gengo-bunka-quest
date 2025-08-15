import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const ScoreViewer = () => {
  const { toast } = useToast();
  const [category, setCategory] = useState("Gengo");
  const [scores, setScores] = useState([]);

  const loadScores = async () => {
    try {
      const { data, error } = await supabase
        .from('scores')
        .select(`
          *,
          students (name, class),
          exams (category)
        `)
        .order('percentage', { ascending: false });
      
      if (error) throw error;
      setScores(data || []);
    } catch (error) {
      console.error('Error loading scores:', error);
    }
  };

  const publishScores = async () => {
    try {
      const { error } = await supabase
        .from('scores')
        .update({ is_published: true })
        .eq('exams.category', category);
      
      if (error) throw error;
      
      toast({
        title: "Berhasil",
        description: `Nilai ${category} berhasil dipublikasikan`
      });
      loadScores();
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mempublikasikan nilai",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadScores();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Gengo">Gengo</SelectItem>
            <SelectItem value="Bunka">Bunka</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={publishScores} variant="success">
          Publikasikan Nilai {category}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Nilai {category}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scores.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Belum ada data nilai
              </p>
            ) : (
              scores.map((score: any, index) => (
                <div key={score.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                  <div>
                    <span className="font-medium">#{index + 1} {score.students?.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">({score.students?.class})</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{score.percentage.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">
                      {score.score}/{score.total_questions} benar
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};