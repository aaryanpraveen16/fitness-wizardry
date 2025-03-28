
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const OnboardingSlides = [
  {
    title: "Welcome to MyFitnessBuddy!",
    description: "Your personal AI fitness companion to help you reach your goals",
    imagePlaceholder: "Welcome"
  },
  {
    title: "Track Your Workouts",
    description: "Log exercises, sets, and reps to monitor your fitness journey",
    imagePlaceholder: "Workout"
  },
  {
    title: "Personalized AI Guidance",
    description: "Get smart recommendations based on your progress and goals",
    imagePlaceholder: "AI"
  },
  {
    title: "Nutrition & Habit Tracking",
    description: "Monitor your diet and build healthy habits for long-term success",
    imagePlaceholder: "Nutrition"
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const handleNext = () => {
    if (currentSlide < OnboardingSlides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      navigate('/signup');
    }
  };
  
  const handleSkip = () => {
    navigate('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-3xl mx-auto auth-card">
        <CardContent className="p-0">
          <Carousel className="w-full">
            <CarouselContent>
              {OnboardingSlides.map((slide, index) => (
                <CarouselItem key={index} onClick={() => setCurrentSlide(index)}>
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="size-32 rounded-full fitness-gradient flex items-center justify-center mb-6">
                      <div className="text-white text-xl font-bold">{slide.imagePlaceholder}</div>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-muted-foreground mb-6">{slide.description}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          
            <div className="flex justify-center mt-4 gap-1">
              {OnboardingSlides.map((_, index) => (
                <div
                  key={index}
                  className={`size-2 rounded-full transition-all ${
                    currentSlide === index ? "bg-primary w-6" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </Carousel>
          
          <div className="flex justify-between p-6">
            <Button variant="ghost" onClick={handleSkip}>
              Skip
            </Button>
            <Button onClick={handleNext}>
              {currentSlide === OnboardingSlides.length - 1 ? "Get Started" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
