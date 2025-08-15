import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const QuestionManager = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    category: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('questions').insert(newQuestion);
      if (error) throw error;
      
      toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" });
      setNewQuestion({
        category: "",
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: ""
      });
    } catch (error) {
      toast({ title: "Error", description: "Gagal menambah soal", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Soal Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Kategori</Label>
              <Select value={newQuestion.category} onValueChange={(value) => setNewQuestion({...newQuestion, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Gengo">Gengo</SelectItem>
                  <SelectItem value="Bunka">Bunka</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Jawaban Benar</Label>
              <Select value={newQuestion.correct_option} onValueChange={(value) => setNewQuestion({...newQuestion, correct_option: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jawaban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A</SelectItem>
                  <SelectItem value="B">B</SelectItem>
                  <SelectItem value="C">C</SelectItem>
                  <SelectItem value="D">D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label>Pertanyaan</Label>
            <Textarea value={newQuestion.question_text} onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Pilihan A</Label>
              <Input value={newQuestion.option_a} onChange={(e) => setNewQuestion({...newQuestion, option_a: e.target.value})} />
            </div>
            <div>
              <Label>Pilihan B</Label>
              <Input value={newQuestion.option_b} onChange={(e) => setNewQuestion({...newQuestion, option_b: e.target.value})} />
            </div>
            <div>
              <Label>Pilihan C</Label>
              <Input value={newQuestion.option_c} onChange={(e) => setNewQuestion({...newQuestion, option_c: e.target.value})} />
            </div>
            <div>
              <Label>Pilihan D</Label>
              <Input value={newQuestion.option_d} onChange={(e) => setNewQuestion({...newQuestion, option_d: e.target.value})} />
            </div>
          </div>
          
          <Button type="submit" className="w-full">Tambah Soal</Button>
        </form>
      </CardContent>
    </Card>
  );
};