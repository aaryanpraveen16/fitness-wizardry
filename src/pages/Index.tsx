
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  // For now, this is the landing page that will redirect to onboarding
  // Later, this could check if the user is logged in and redirect to dashboard instead
  
  const handleGetStarted = () => {
    navigate('/onboarding');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center">
        {/* Left content */}
        <div className="flex-1 p-8 md:p-16 flex flex-col justify-center">
          <div className="max-w-xl space-y-6">
            <div className="inline-block">
              <div className="size-12 rounded-xl fitness-gradient flex items-center justify-center font-bold text-xl">
                MB
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Your Personal <span className="text-primary">Fitness Journey</span> Starts Here
            </h1>
            
            <p className="text-lg text-gray-600">
              Track workouts, monitor nutrition, and achieve your fitness goals with personalized AI guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="gap-2"
              >
                Get Started <ArrowRight className="size-5" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right content - Graphics */}
        <div className="flex-1 p-8 flex justify-center">
          <div className="relative w-full max-w-md aspect-square rounded-xl bg-gradient-to-br from-fitness-teal via-fitness-blue to-fitness-purple flex items-center justify-center overflow-hidden">
            <div className="text-white text-4xl font-bold">Fitness Graphics</div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-accent/30 blur-xl"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/30 blur-xl"></div>
          </div>
        </div>
      </section>
      
      {/* Features preview */}
      <section className="bg-muted/50 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <div className="size-6 rounded-full fitness-gradient"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Workout Tracking</h3>
              <p className="text-gray-600">Log your exercises, sets, and progress with our easy-to-use interface.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="size-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <div className="size-6 rounded-full fitness-gradient"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Nutrition Planning</h3>
              <p className="text-gray-600">Track your meals and macros to optimize your diet for your fitness goals.</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="size-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <div className="size-6 rounded-full fitness-gradient"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Reports</h3>
              <p className="text-gray-600">Visualize your improvements over time with detailed analytics and charts.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-6 px-6 text-center">
        <p className="text-sm text-gray-500">© 2023 MyFitnessBuddy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
