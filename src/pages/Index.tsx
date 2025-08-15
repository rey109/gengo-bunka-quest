import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BookOpen, Globe } from "lucide-react";
import indonesianFlag from "@/assets/indonesian-flag.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4">
      {/* Indonesian Flag Icon */}
      <div className="mb-8 animate-in fade-in duration-700">
        <img 
          src={indonesianFlag} 
          alt="Indonesian Flag" 
          className="w-24 h-24 rounded-full shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-105" 
        />
      </div>

      {/* Main Heading */}
      <div className="text-center mb-12 animate-in slide-in-from-bottom-4 duration-700 delay-200">
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
          Sudah siap untuk tes??
        </h1>
        <p className="text-lg text-muted-foreground max-w-md">
          Pilih kategori ujian dan mulai perjalanan belajar Anda
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl animate-in slide-in-from-bottom-4 duration-700 delay-400">
        <Card className="p-6 hover-lift cursor-pointer group" onClick={() => navigate('/exam-info/Gengo')}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Gengo</h2>
            <p className="text-muted-foreground">Test kemampuan bahasa Jepang Anda</p>
            <Button variant="category" size="category" className="w-full">
              Pilih Gengo
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover-lift cursor-pointer group" onClick={() => navigate('/exam-info/Bunka')}>
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">Bunka</h2>
            <p className="text-muted-foreground">Test pengetahuan budaya Jepang Anda</p>
            <Button variant="category" size="category" className="w-full">
              Pilih Bunka
            </Button>
          </div>
        </Card>
      </div>

      {/* Admin Link */}
      <div className="mt-12 animate-in fade-in duration-700 delay-600">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/admin')}
          className="text-muted-foreground hover:text-foreground"
        >
          Panel Admin
        </Button>
      </div>
    </div>
  );
};

export default Index;