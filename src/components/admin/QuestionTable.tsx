import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuestionModal } from "./QuestionModal";

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

interface QuestionTableProps {
  questions: Question[];
  onRefresh: () => void;
}

export const QuestionTable = ({ questions, onRefresh }: QuestionTableProps) => {
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const filteredQuestions = questions.filter(q => 
    filterCategory === "all" || q.category === filterCategory
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus soal ini?")) return;
    
    try {
      const { error } = await supabase.from('questions').delete().eq('id', id);
      if (error) throw error;
      
      toast({ title: "Berhasil", description: "Soal berhasil dihapus" });
      onRefresh();
    } catch (error) {
      toast({ title: "Error", description: "Gagal menghapus soal", variant: "destructive" });
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    onRefresh();
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="font-noto">Daftar Soal</CardTitle>
            <div className="flex gap-4">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="Gengo">Gengo</SelectItem>
                  <SelectItem value="Bunka">Bunka</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} className="font-poppins">
                <Plus className="w-4 h-4 mr-2" />
                Tambah Soal
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-poppins">ID</TableHead>
                <TableHead className="font-poppins">Kategori</TableHead>
                <TableHead className="font-poppins">Pertanyaan</TableHead>
                <TableHead className="font-poppins">Jawaban Benar</TableHead>
                <TableHead className="font-poppins">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-mono text-xs">
                    {question.id.substring(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <Badge variant={question.category === "Gengo" ? "default" : "secondary"}>
                      {question.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate font-poppins">
                    {question.question_text}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {question.correct_option}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(question)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(question.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {filteredQuestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground font-poppins">
              Tidak ada soal ditemukan
            </div>
          )}
        </CardContent>
      </Card>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        question={editingQuestion}
      />
    </>
  );
};