import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileQuestion, Clock, Users } from "lucide-react";
import { QuestionTable } from "@/components/admin/QuestionTable";
import { ExamSettings } from "@/components/admin/ExamSettings";
import { ScoreViewer } from "@/components/admin/ScoreViewer";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-foreground font-noto">管理パネル</h1>
          <Button variant="outline" onClick={handleLogout} className="font-poppins">
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions" className="flex items-center gap-2 font-poppins">
              <FileQuestion className="w-4 h-4" />
              Kelola Soal
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2 font-poppins">
              <Clock className="w-4 h-4" />
              Pengaturan
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center gap-2 font-poppins">
              <Users className="w-4 h-4" />
              Lihat Nilai
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <QuestionTable questions={questions} onRefresh={fetchQuestions} />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pengaturan Ujian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExamSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scores">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Nilai & Pengumuman
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScoreViewer />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;