import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dumbbell, Brain, Heart, Target, Trophy, Users, Zap } from "lucide-react";
import { useRef } from 'react';

const OnboardingSlides = [
  {
    title: "Welcome to MyFitnessBuddy!",
    description: "Your personal AI fitness companion to help you reach your goals",
    icon: <Dumbbell className="size-12 text-primary" />,
    features: [
      "Personalized workout plans",
      "AI-powered progress tracking",
      "Nutrition guidance"
    ]
  },
  {
    title: "Smart Workout Planning",
    description: "Get customized workout plans that adapt to your progress",
    icon: <Brain className="size-12 text-primary" />,
    features: [
      "Dynamic exercise recommendations",
      "Real-time form feedback",
      "Progress-based adjustments"
    ]
  },
  {
    title: "Health & Wellness Focus",
    description: "Track your overall health metrics and wellness journey",
    icon: <Heart className="size-12 text-primary" />,
    features: [
      "Comprehensive health tracking",
      "Wellness score monitoring",
      "Lifestyle habit building"
    ]
  },
  {
    title: "Goal Setting & Achievement",
    description: "Set meaningful goals and celebrate your victories",
    icon: <Target className="size-12 text-primary" />,
    features: [
      "SMART goal setting",
      "Milestone tracking",
      "Achievement badges"
    ]
  },
  {
    title: "Community & Support",
    description: "Connect with like-minded fitness enthusiasts",
    icon: <Users className="size-12 text-primary" />,
    features: [
      "Community challenges",
      "Progress sharing",
      "Support groups"
    ]
  },
  {
    title: "Power of AI",
    description: "Experience the future of fitness with AI-powered insights",
    icon: <Zap className="size-12 text-primary" />,
    features: [
      "Smart recommendations",
      "Predictive analytics",
      "Personalized insights"
    ]
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    if (currentSlide < OnboardingSlides.length - 1) {
      setCurrentSlide(curr => curr + 1);
      // Scroll to the next slide
      if (carouselRef.current) {
        const nextSlide = carouselRef.current.querySelector(`[data-index="${currentSlide + 1}"]`);
        if (nextSlide) {
          nextSlide.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  const handleDotClick = (index: number) => {
    setCurrentSlide(index);
    // Scroll to the selected slide
    if (carouselRef.current) {
      const selectedSlide = carouselRef.current.querySelector(`[data-index="${index}"]`);
      if (selectedSlide) {
        selectedSlide.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-3xl mx-auto auth-card">
        <CardContent className="p-0">
          <Carousel className="w-full" ref={carouselRef}>
            <CarouselContent>
              {OnboardingSlides.map((slide, index) => (
                <CarouselItem key={index} data-index={index}>
                  <div className="p-6 flex flex-col items-center text-center">
                    <div className="size-32 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                      {slide.icon}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{slide.title}</h2>
                    <p className="text-muted-foreground mb-6">{slide.description}</p>
                    
                    <div className="w-full max-w-md space-y-3">
                      {slide.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-left">
                          <Trophy className="size-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
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
                  onClick={() => handleDotClick(index)}
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
