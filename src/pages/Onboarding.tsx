
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

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

const fitnessProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0 && parseInt(val) < 120, {
    message: "Please enter a valid age between 1-120",
  }),
  gender: z.enum(["male", "female", "other", "prefer-not-to-say"]),
  height: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Please enter a valid height",
  }),
  weight: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Please enter a valid weight",
  }),
  fitnessGoal: z.enum(["lose-weight", "build-muscle", "improve-endurance", "maintain"]),
  activityLevel: z.enum(["sedentary", "lightly-active", "moderately-active", "very-active", "extremely-active"]),
  medicalConditions: z.string().optional(),
  dietaryPreferences: z.array(z.string()).optional(),
});

type FitnessProfileFormValues = z.infer<typeof fitnessProfileSchema>;

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showProfileForm, setShowProfileForm] = useState(false);
  
  const form = useForm<FitnessProfileFormValues>({
    resolver: zodResolver(fitnessProfileSchema),
    defaultValues: {
      name: "",
      age: "",
      gender: "prefer-not-to-say",
      height: "",
      weight: "",
      fitnessGoal: "build-muscle",
      activityLevel: "moderately-active",
      medicalConditions: "",
      dietaryPreferences: [],
    },
  });
  
  const handleNext = () => {
    if (currentSlide < OnboardingSlides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      setShowProfileForm(true);
    }
  };
  
  const handleSkip = () => {
    if (showProfileForm) {
      navigate('/dashboard');
    } else {
      setShowProfileForm(true);
    }
  };
  
  const onSubmit = (values: FitnessProfileFormValues) => {
    console.log("Form values:", values);
    
    // In a real app, we would save these values to a database or context
    // For now, we'll just store them in localStorage
    localStorage.setItem('fitnessProfile', JSON.stringify(values));
    
    toast.success("Profile created successfully!");
    navigate('/dashboard');
  };

  if (showProfileForm) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="w-full max-w-3xl mx-auto auth-card">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Your Fitness Profile</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="fitnessGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Fitness Goal</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lose-weight">Lose Weight</SelectItem>
                          <SelectItem value="build-muscle">Build Muscle</SelectItem>
                          <SelectItem value="improve-endurance">Improve Endurance</SelectItem>
                          <SelectItem value="maintain">Maintain Current Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                          <SelectItem value="lightly-active">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="extremely-active">Extremely Active (very hard exercise & physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="medicalConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medical Conditions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List any relevant medical conditions or injuries" {...field} />
                      </FormControl>
                      <FormDescription>
                        This helps us personalize your experience safely.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={handleSkip}>
                    Skip for now
                  </Button>
                  <Button type="submit">
                    Complete Profile
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

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
