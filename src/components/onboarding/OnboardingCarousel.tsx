
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface OnboardingSlideProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const OnboardingSlide = ({ title, description, icon }: OnboardingSlideProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-6 text-center h-full">
      <div className="w-20 h-20 rounded-full fitness-gradient flex items-center justify-center">
        {icon}
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-muted-foreground max-w-md">{description}</p>
    </div>
  );
};

const OnboardingCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Welcome to MyFitnessBuddy!",
      description: "Your personal companion for achieving your fitness goals",
      icon: <span className="text-3xl">💪</span>,
    },
    {
      title: "Track Your Workouts",
      description: "Log your exercises, sets, reps and monitor your progress over time",
      icon: <span className="text-3xl">📊</span>,
    },
    {
      title: "AI-Driven Goal Adjustments",
      description: "Get personalized recommendations based on your performance and progress",
      icon: <span className="text-3xl">🧠</span>,
    },
    {
      title: "Nutrition & Habit Tracking",
      description: "Monitor your diet and build healthy habits that last",
      icon: <span className="text-3xl">🥗</span>,
    },
  ];

  const nextSlide = () => {
    if (currentSlide === slides.length - 1) {
      navigate("/signup");
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(0, prev - 1));
  };

  const skipOnboarding = () => {
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            width: `${slides.length * 100}%`,
          }}
        >
          {slides.map((slide, index) => (
            <div key={index} style={{ width: `${100 / slides.length}%` }}>
              <OnboardingSlide
                title={slide.title}
                description={slide.description}
                icon={slide.icon}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 my-4">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              currentSlide === index ? "w-8 bg-primary" : "w-2 bg-muted"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center p-4">
        <div>
          {currentSlide > 0 ? (
            <Button variant="ghost" onClick={prevSlide} size="sm">
              <ChevronLeft className="mr-2 size-4" /> Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={skipOnboarding} size="sm">
              Skip
            </Button>
          )}
        </div>
        <Button onClick={nextSlide}>
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
          {currentSlide !== slides.length - 1 && <ChevronRight className="ml-2 size-4" />}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCarousel;
