import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, User, GraduationCap, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ExamInfo = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    examCode: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Insert student record
      const { data: student, error } = await supabase
        .from('students')
        .insert({
          name: formData.name,
          class: formData.class,
          exam_code: formData.examCode,
          category: category!
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Berhasil",
        description: "Data berhasil disimpan. Memulai ujian...",
      });

      // Navigate to exam page
      navigate(`/exam/${student.id}`);
    } catch (error) {
      console.error('Error creating student:', error);
      toast({
        title: "Error",
        description: "Gagal menyimpan data. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Ujian {category}
          </h1>
          <p className="text-muted-foreground">
            Masukkan informasi Anda untuk memulai ujian
          </p>
        </div>

        {/* Form Card */}
        <Card className="shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">Data Peserta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="class" className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Kelas
                </Label>
                <Input
                  id="class"
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({...formData, class: e.target.value})}
                  placeholder="Contoh: 12 IPA 1"
                  required
                  className="focus-ring"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="examCode" className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Kode Ujian
                </Label>
                <Input
                  id="examCode"
                  type="text"
                  value={formData.examCode}
                  onChange={(e) => setFormData({...formData, examCode: e.target.value})}
                  placeholder="Masukkan kode ujian"
                  required
                  className="focus-ring"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Mulai Ujian"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamInfo;