"use client"
import React, { useState, useEffect } from 'react';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#13111C] to-[#0F0A1D] text-white">
      {/* Navigation */}
      <nav className="py-6 px-4 md:px-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative h-10 w-10">
            <svg className="animate-rotate" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="40" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
              <path d="M50 10 C70 25, 80 40, 70 80" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-xl">DrawDraw</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-gray-300 hover:text-white transition-colors">How it works</a>
          <a href="#faq" className="text-sm text-gray-300 hover:text-white transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href="#" 
            className="hidden sm:flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors px-3 py-1.5 rounded-md"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </a>
          
          <a 
            href="#" 
            className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white px-3 py-1.5 rounded-md transition-all duration-300"
          >
            <UserPlus className="w-4 h-4" />
            <span>Sign Up</span>
          </a>
          
          <a 
            href="#" 
            className="group bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            Start Drawing
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-28 relative">
        <div className={`opacity-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : ''}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl">
            <span className="text-gradient">Draw together</span>, from anywhere
          </h1>
          
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mb-10">
            The simplest way to visualize your ideas. DrawDraw is a free, collaborative online whiteboard built for teams and classrooms.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
            >
              Start Drawing
              <ArrowRight className="w-5 h-5" />
            </a>
            
            <a 
              href="#how-it-works" 
              className="glass-card px-8 py-4 rounded-lg font-medium flex items-center justify-center"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className={`mt-16 glass-card rounded-xl overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.15)] transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative">
            <div className="absolute top-0 left-0 right-0 h-12 bg-[#1E1B2C] flex items-center p-3 gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <div className="ml-4 bg-[#14121B] rounded px-20 py-1 text-xs text-gray-500 text-center">vats-drawdraw.netlify.app</div>
            </div>
            <div className="pt-12">
              <div className="bg-[#14121B] p-8 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                <div className="draw-svg w-full max-w-2xl">
                  <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path style={{"--animation-order": "0"} as React.CSSProperties} d="M100,100 L200,50 L300,150 L400,100 L500,150" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
                    <path style={{"--animation-order": "1"} as React.CSSProperties} d="M100,150 C150,100 200,200 250,150 S350,50 400,100" stroke="#A78BFA" strokeWidth="3" strokeLinecap="round" />
                    <path style={{"--animation-order": "2"} as React.CSSProperties} d="M150,200 L250,200 L250,250 L150,250 Z" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" />
                    <path style={{"--animation-order": "3"} as React.CSSProperties} d="M400,200 L450,250 L350,250" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
                    <circle style={{"--animation-order": "4"} as React.CSSProperties} cx="500" cy="225" r="30" stroke="#10B981" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0A0A16] relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Why use DrawDraw?</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            DrawDraw combines simplicity with powerful features to make visualization effortless
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Real-time collaboration",
                desc: "Work together with your team in real-time, no matter where everyone is located",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                ),
              },
              {
                title: "Infinite canvas",
                desc: "Never run out of space. Your canvas grows as your ideas expand",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="3" y1="15" x2="21" y2="15"></line>
                    <line x1="9" y1="3" x2="9" y2="21"></line>
                    <line x1="15" y1="3" x2="15" y2="21"></line>
                  </svg>
                ),
              },
              {
                title: "Export options",
                desc: "Export your work as PNG, SVG, or PDF to use in documents and presentations",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                ),
              },
              {
                title: "Rich shape library",
                desc: "Diagrams, flowcharts, mind maps, and more with our extensive shape library",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                    <polyline points="2 17 12 22 22 17"></polyline>
                    <polyline points="2 12 12 17 22 12"></polyline>
                  </svg>
                ),
              },
              {
                title: "Dark mode",
                desc: "Easy on the eyes with a beautiful dark theme that's perfect for long sessions",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                ),
              },
              {
                title: "100% Free",
                desc: "No subscription fees, no paywalls. All features available for everyone",
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                ),
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="glass-card rounded-xl p-6 hover:shadow-[0_0_20px_rgba(147,51,234,0.2)] transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="feature-icon mb-4 w-14 h-14">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">How It Works</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16">
            Get started in seconds with these three easy steps
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create your board",
                desc: "Open DrawDraw in your browser. No sign-up or installation required."
              },
              {
                step: "02",
                title: "Draw and design",
                desc: "Use our intuitive tools to sketch, create diagrams, add text or images."
              },
              {
                step: "03",
                title: "Share with anyone",
                desc: "Generate a link and share your board with teammates or friends instantly."
              }
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="text-5xl font-bold text-blue-500 opacity-50 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <a 
              href="#" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
            >
              Try it now
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-[#0A0A16]">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-center mb-16">
            Got questions? We've got answers
          </p>

          <div className="space-y-6">
            {[
              {
                q: "Is DrawDraw really free?",
                a: "Yes! DrawDraw is 100% free with no hidden fees or premium features. We believe in making creative tools accessible to everyone."
              },
              {
                q: "Do I need to create an account?",
                a: "No account needed! Just open the app and start drawing. However, creating a free account lets you save and organize your work."
              },
              {
                q: "How many people can collaborate on one board?",
                a: "There's no limit! Whether it's 2 people or 100, DrawDraw handles real-time collaboration smoothly."
              },
              {
                q: "Can I use DrawDraw offline?",
                a: "Currently, DrawDraw requires an internet connection. We're working on an offline mode for future updates."
              },
              {
                q: "Is my data secure?",
                a: "Absolutely. All your drawings are encrypted and we don't share your data with third parties."
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6">
                <h3 className="font-bold text-xl mb-3">{item.q}</h3>
                <p className="text-gray-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-3xl transform -skew-y-12 -z-10"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to bring your ideas to life?</h2>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Join thousands of teams and individuals who use DrawDraw for brainstorming, teaching, planning, and creating.
          </p>
          
          <a 
            href="#" 
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-lg font-medium text-lg transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
          >
            Start Drawing Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#060610] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="h-8 w-8">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="40" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
                  <path d="M50 10 C70 25, 80 40, 70 80" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold">DrawDraw</span>
            </div>

            <div className="flex gap-8 mb-6 md:mb-0">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Home</a>
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it works</a>
              <a href="#faq" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-gray-800 text-sm text-gray-400 text-center">
            <p>© 2025 DrawDraw. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;