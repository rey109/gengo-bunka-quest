import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, FileQuestion, Clock, Users, Bell } from "lucide-react";
import { QuestionManager } from "@/components/admin/QuestionManager";
import { ExamSettings } from "@/components/admin/ExamSettings";
import { ScoreViewer } from "@/components/admin/ScoreViewer";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card shadow-soft border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Panel Admin</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4" />
              Soal Ujian
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pengaturan
            </TabsTrigger>
            <TabsTrigger value="scores" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Nilai
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="w-5 h-5" />
                  Manajemen Soal Ujian
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QuestionManager />
              </CardContent>
            </Card>
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