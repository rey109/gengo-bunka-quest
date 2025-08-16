import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  category: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question?: Question | null;
}

export const QuestionModal = ({ isOpen, onClose, question }: QuestionModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    category: "",
    question_text: "",
    option_a: "",
    option_b: "",
    option_c: "",
    option_d: "",
    correct_option: ""
  });

  useEffect(() => {
    if (question) {
      setFormData({
        category: question.category,
        question_text: question.question_text,
        option_a: question.option_a,
        option_b: question.option_b,
        option_c: question.option_c,
        option_d: question.option_d,
        correct_option: question.correct_option
      });
    } else {
      setFormData({
        category: "",
        question_text: "",
        option_a: "",
        option_b: "",
        option_c: "",
        option_d: "",
        correct_option: ""
      });
    }
  }, [question, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (question) {
        // Update existing question
        const { error } = await supabase
          .from('questions')
          .update(formData)
          .eq('id', question.id);
        if (error) throw error;
        toast({ title: "Berhasil", description: "Soal berhasil diperbarui" });
      } else {
        // Create new question
        const { error } = await supabase
          .from('questions')
          .insert(formData);
        if (error) throw error;
        toast({ title: "Berhasil", description: "Soal berhasil ditambahkan" });
      }
      
      onClose();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: question ? "Gagal memperbarui soal" : "Gagal menambah soal", 
        variant: "destructive" 
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-noto">
            {question ? "Edit Soal" : "Tambah Soal Baru"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-poppins">Kategori</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({...formData, category: value})}
              >
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
              <Label className="font-poppins">Jawaban Benar</Label>
              <Select 
                value={formData.correct_option} 
                onValueChange={(value) => setFormData({...formData, correct_option: value})}
              >
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
            <Label className="font-poppins">Pertanyaan</Label>
            <Textarea 
              value={formData.question_text} 
              onChange={(e) => setFormData({...formData, question_text: e.target.value})}
              className="min-h-24"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-poppins">Pilihan A</Label>
              <Input 
                value={formData.option_a} 
                onChange={(e) => setFormData({...formData, option_a: e.target.value})} 
              />
            </div>
            <div>
              <Label className="font-poppins">Pilihan B</Label>
              <Input 
                value={formData.option_b} 
                onChange={(e) => setFormData({...formData, option_b: e.target.value})} 
              />
            </div>
            <div>
              <Label className="font-poppins">Pilihan C</Label>
              <Input 
                value={formData.option_c} 
                onChange={(e) => setFormData({...formData, option_c: e.target.value})} 
              />
            </div>
            <div>
              <Label className="font-poppins">Pilihan D</Label>
              <Input 
                value={formData.option_d} 
                onChange={(e) => setFormData({...formData, option_d: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="font-poppins">
              Batal
            </Button>
            <Button type="submit" className="font-poppins">
              {question ? "Perbarui" : "Tambah"} Soal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};