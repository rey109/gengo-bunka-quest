import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Clock, AlertTriangle, Maximize, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
}

interface Student {
  id: string;
  name: string;
  category: string;
  violations: number;
}

const Exam = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [violations, setViolations] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Anti-cheat: Tab change detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isFullscreen) {
        handleViolation();
      }
    };

    const handleBlur = () => {
      if (isFullscreen) {
        handleViolation();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [isFullscreen]);

  // Prevent page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && isFullscreen) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAutoSubmit();
    }
  }, [timeLeft, isFullscreen]);

  // Load student and questions data
  useEffect(() => {
    const loadExamData = async () => {
      try {
        // Get student data
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', studentId)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);
        setViolations(studentData.violations);

        // Get questions for the category
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .eq('category', studentData.category);

        if (questionsError) throw questionsError;
        setQuestions(questionsData || []);

        // Get exam duration
        const { data: examData, error: examError } = await supabase
          .from('exams')
          .select('duration')
          .eq('category', studentData.category)
          .single();

        if (examError) throw examError;
        setTimeLeft((examData.duration || 60) * 60);

      } catch (error) {
        console.error('Error loading exam data:', error);
        toast({
          title: "Error",
          description: "Gagal memuat data ujian",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    if (studentId) {
      loadExamData();
    }
  }, [studentId, navigate, toast]);

  const handleViolation = useCallback(async () => {
    const newViolations = violations + 1;
    setViolations(newViolations);
    setShowWarning(true);

    try {
      await supabase
        .from('students')
        .update({ violations: newViolations })
        .eq('id', studentId);

      toast({
        title: "Peringatan!",
        description: `Pelanggaran ${newViolations}/3. Jangan tinggalkan tab ujian!`,
        variant: "destructive"
      });

      if (newViolations >= 3) {
        handleAutoSubmit();
      }
    } catch (error) {
      console.error('Error updating violations:', error);
    }

    setTimeout(() => setShowWarning(false), 3000);
  }, [violations, studentId, toast]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
      toast({
        title: "Error",
        description: "Gagal masuk mode fullscreen",
        variant: "destructive"
      });
    }
  };

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleAutoSubmit = async () => {
    await handleSubmit(true);
  };

  const handleSubmit = async (isAuto = false) => {
    try {
      setIsLoading(true);

      // Calculate score
      let correctCount = 0;
      const answerPromises = questions.map(async (question) => {
        const selectedAnswer = answers[question.id];
        const isCorrect = selectedAnswer === question.correct_option;
        if (isCorrect) correctCount++;

        return supabase
          .from('answers')
          .upsert({
            student_id: studentId,
            question_id: question.id,
            answer: selectedAnswer,
            is_correct: isCorrect
          });
      });

      await Promise.all(answerPromises);

      // Save score
      const percentage = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
      
      const { data: examData } = await supabase
        .from('exams')
        .select('id')
        .eq('category', student?.category)
        .single();

      if (examData) {
        await supabase
          .from('scores')
          .upsert({
            student_id: studentId,
            exam_id: examData.id,
            score: correctCount,
            total_questions: questions.length,
            percentage: percentage
          });
      }

      // Mark as submitted
      await supabase
        .from('students')
        .update({ is_submitted: true })
        .eq('id', studentId);

      toast({
        title: isAuto ? "Ujian Berakhir" : "Ujian Selesai",
        description: isAuto ? "Waktu habis, jawaban otomatis dikirim" : "Jawaban berhasil dikirim",
      });

      // Exit fullscreen
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }

      navigate('/exam-complete');
    } catch (error) {
      console.error('Error submitting exam:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim jawaban",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-lg">Memuat ujian...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isFullscreen) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-elegant">
          <CardHeader>
            <CardTitle className="text-center">Siap Memulai Ujian?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Selamat datang, <strong>{student?.name}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Ujian: {student?.category} • {questions.length} soal
              </p>
              <p className="text-sm text-muted-foreground">
                Waktu: {Math.floor(timeLeft / 60)} menit
              </p>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Ujian akan dimulai dalam mode fullscreen. Jangan tinggalkan tab atau aplikasi 
                selama ujian berlangsung. Pelanggaran akan dipantau.
              </AlertDescription>
            </Alert>

            <Button 
              onClick={enterFullscreen}
              size="lg"
              className="w-full"
            >
              <Maximize className="w-4 h-4 mr-2" />
              Mulai Ujian
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fullscreen-exam p-6">
      {/* Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 bg-destructive/20 z-50 flex items-center justify-center warning-pulse">
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-bold text-destructive mb-2">PERINGATAN!</h2>
              <p className="text-muted-foreground">
                Anda telah meninggalkan tab ujian. Pelanggaran: {violations}/3
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ujian {student?.category}</h1>
          <p className="text-muted-foreground">{student?.name}</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-lg font-mono">
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          {violations > 0 && (
            <div className="text-destructive font-medium">
              Pelanggaran: {violations}/3
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Soal {currentQuestionIndex + 1} dari {questions.length}</span>
          <span>{Math.round(progress)}% selesai</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      {currentQuestion && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQuestion.question_text}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {['A', 'B', 'C', 'D'].map((option) => {
              const optionText = currentQuestion[`option_${option.toLowerCase()}` as keyof Question] as string;
              const isSelected = answers[currentQuestion.id] === option;
              
              return (
                <Button
                  key={option}
                  variant={isSelected ? "default" : "outline"}
                  className="w-full justify-start text-left h-auto p-4"
                  onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                >
                  <span className="font-bold mr-3">{option}.</span>
                  <span>{optionText}</span>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Sebelumnya
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              Selanjutnya
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit()}
              variant="success"
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Selesai"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Exam;