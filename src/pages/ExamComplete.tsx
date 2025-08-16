import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home } from "lucide-react";

const ExamComplete = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Exit fullscreen mode if still active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(console.error);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4 animate-page-enter">
      <Card className="w-full max-w-md shadow-elegant">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <CheckCircle className="w-24 h-24 text-success animate-success-bounce" />
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground font-noto">
              Sudah terkirim
            </h1>
            <p className="text-lg text-muted-foreground font-poppins">
              Terima kasih sudah mengerjakan
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              Jawaban Anda telah berhasil dikirim dan tersimpan. 
              Hasil ujian akan diumumkan oleh pengajar.
            </p>
          </div>

          {/* Back to Home */}
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamComplete;