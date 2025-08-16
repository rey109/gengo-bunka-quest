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
      <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700 delay-200">
        <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight font-noto">
          Sudah siap untuk tes??
        </h1>
        <p className="text-xl text-muted-foreground max-w-md font-poppins font-light">
          Pilih kategori ujian dan mulai perjalanan belajar Anda
        </p>
      </div>

      {/* Category Selection */}
      <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl animate-in slide-in-from-bottom-4 duration-700 delay-400">
        <Card className="p-8 cursor-pointer group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl" onClick={() => navigate('/exam-info/Gengo')}>
          {/* Japanese circle accent */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full"></div>
          <div className="text-center space-y-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <BookOpen className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground font-noto">言語</h2>
              <h3 className="text-xl font-medium text-foreground font-poppins">Gengo</h3>
              <p className="text-muted-foreground font-poppins">Test kemampuan bahasa Jepang Anda</p>
            </div>
            <Button variant="category" size="category" className="w-full font-poppins font-medium">
              Pilih Gengo
            </Button>
          </div>
        </Card>

        <Card className="p-8 cursor-pointer group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl" onClick={() => navigate('/exam-info/Bunka')}>
          {/* Japanese circle accent */}
          <div className="absolute top-4 right-4 w-12 h-12 bg-primary/10 rounded-full"></div>
          <div className="text-center space-y-6 relative z-10">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg">
              <Globe className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground font-noto">文化</h2>
              <h3 className="text-xl font-medium text-foreground font-poppins">Bunka</h3>
              <p className="text-muted-foreground font-poppins">Test pengetahuan budaya Jepang Anda</p>
            </div>
            <Button variant="category" size="category" className="w-full font-poppins font-medium">
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