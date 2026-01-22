import Layout from "@/components/Layout";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import ProjectCard from "@/components/ProjectCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { 
  ChefHat, 
  Bath, 
  Home, 
  Plus, 
  Palette,
  Star,
  Quote
} from "lucide-react";
// Using gallery images instead of assets
const bathroomProject = "/avondale/1224 Avondale Ave SE High Res_05.jpg";
const livingRoomProject = "/fox-croft-photos/12-Foxcroft Rd NW-12.jpg";
const heroKitchen = "/fox-croft-photos/05-Foxcroft Rd NW-5.jpg";

const services = [
  {
    icon: <ChefHat size={32} />,
    title: "Kitchen Remodeling",
    description: "Transform your kitchen into the heart of your home with custom cabinetry, modern appliances, and thoughtful design.",
    href: "/services",
    image: heroKitchen
  },
  {
    icon: <Bath size={32} />,
    title: "Bathroom Renovation",
    description: "Create your personal spa retreat with luxurious fixtures, custom tile work, and optimal functionality.",
    href: "/services",
    image: bathroomProject
  },
  {
    icon: <Home size={32} />,
    title: "Whole Home Remodel",
    description: "Reimagine your entire living space with comprehensive renovation that maximizes comfort and style.",
    href: "/services",
    image: livingRoomProject
  }
];

const featuredProjects = [
  {
    title: "Modern Farmhouse Kitchen",
    location: "Atlanta, Georgia",
    image: heroKitchen,
    href: "/gallery",
    category: "Kitchen"
  },
  {
    title: "Spa-Inspired Bathroom",
    location: "Charleston, South Carolina", 
    image: bathroomProject,
    href: "/gallery",
    category: "Bathroom"
  },
  {
    title: "Open Concept Living",
    location: "Atlanta, Georgia",
    image: livingRoomProject,
    href: "/gallery", 
    category: "Whole Home"
  }
];

const whyChooseItems = [
  {
    title: "Space-Efficient Design Excellence",
    text:
      "Our luxury pools are engineered to maximize enjoyment while respecting your space. Each design thoughtfully balances elegant proportions with premium features, proving that exceptional swimming experiences adapt beautifully to any property.",
  },
  {
    title: "Premium Quality, Perfect Scale",
    text:
      "Experience world-class pool construction tailored to your space. Our white glove approach means every inch is crafted with precision, using premium materials and finishes that define luxury, perfectly proportioned to your home.",
  },
  {
    title: "Transparent Pricing, No Surprises",
    text:
      "The investment we outline upfront is exactly what you'll pay at completion. No hidden fees, no unexpected costs, no budget creep. We honor our commitments and provide complete financial transparency from consultation to installation.",
  },
  {
    title: "Efficient Installation Timeline",
    text:
      "Our streamlined process means faster installation without sacrificing quality. We deliver on promised timelines with proven project management, experienced crews, and realistic scheduling. Your backyard oasis arrives when we say it will.",
  },
];

const Index = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeWhyIndex, setActiveWhyIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const whyImageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const visibilityRatiosRef = useRef<number[]>(new Array(whyChooseItems.length).fill(0));
  const testimonialRef = useRef<HTMLDivElement>(null);
  
  const fullText = "More than just pool builders, we create backyard sanctuaries";

  // Custom hook for fade-in animation
  const useFadeIn = () => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.1 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Typewriter animation effect
  const typeText = useCallback(() => {
    if (isTyping) return;
    
    setIsTyping(true);
    setDisplayedText("");
    
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 50); // Adjust speed here (lower = faster)
    
    return () => clearInterval(typeInterval);
  }, [fullText, isTyping]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (!Number.isNaN(idx)) {
            visibilityRatiosRef.current[idx] = entry.intersectionRatio;
          }
        });

        const ratios = visibilityRatiosRef.current;
        let bestIdx = 0;
        let bestRatio = -1;
        for (let i = 0; i < ratios.length; i++) {
          if (ratios[i] > bestRatio) {
            bestRatio = ratios[i];
            bestIdx = i;
          }
        }

        if (bestIdx !== activeWhyIndex) {
          setIsTransitioning(true);
          setTimeout(() => {
            setActiveWhyIndex(bestIdx);
            setTimeout(() => {
              setIsTransitioning(false);
            }, 50);
          }, 250);
        }
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    whyImageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeWhyIndex]);

  // Testimonial intersection observer for typewriter effect
  useEffect(() => {
    const testimonialObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTyping && displayedText === "") {
            typeText();
          }
        });
      },
      { threshold: 0.3 }
    );

    if (testimonialRef.current) {
      testimonialObserver.observe(testimonialRef.current);
    }

    return () => testimonialObserver.disconnect();
  }, [typeText, isTyping, displayedText]);

  // Create fade-in animations for each section
  const designedSection = useFadeIn();
  const gallerySection = useFadeIn();
  const whyChooseHeader = useFadeIn();
  const servicesSection = useFadeIn();
  const ourGallerySection = useFadeIn();
  const galleryCarousel = useFadeIn();

  return (
    <Layout>
      {/* Hero Section */}
      <Hero 
        title="Luxury Compact Pools, Expertly Crafted"
        subtitle="Elegant swimming pools designed to fit your space and elevate your lifestyle."
        backgroundVideoSrc="/foxcroft-hero.mp4"
        darkerOverlay={true}
      />

      {/* Our Services */}
      <section className="py-20 bg-bg-alt">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={designedSection.ref}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-start transition-all duration-1000 ${
              designedSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div>
              <h2 className="text-5xl md:text-4xl lg:text-5xl font-bold text-text-strong mb-8 leading-tight" style={{ fontFamily: "'PP Editorial Old', serif", fontWeight: 400 }}>
                Luxury<br />
                <span className="italic">Pools</span>
              </h2>
            </div>
            <div>
                    <p className="text-base text-text mb-8 leading-relaxed">
                      Vanta Pools is the choice for discerning homeowners who demand luxury in perfectly scaled spaces. Our pools don't just fit seamlessly into your property; they inspire relaxation, endure as timeless features, and embody the unique lifestyle of those who appreciate thoughtful design and quality craftsmanship.
                    </p>
              <div className="flex flex-col sm:flex-row gap-8">
                <Link to="/" className="flex items-center gap-3 text-text-strong hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="w-4 h-4 bg-text-strong"></div>
                  <span className="text-sm font-medium uppercase tracking-wide">Get In Touch</span>
                </Link>
                <Link to="/" className="flex items-center gap-3 text-text-strong hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="w-4 h-4 border-2 border-text-strong bg-bg-alt"></div>
                  <span className="text-sm font-medium uppercase tracking-wide">Discover Portfolio</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Gallery Images with Parallax - Full Width */}
      <div 
        className="overflow-hidden w-full pb-20" 
        style={{backgroundColor: '#eae3d7'}}
      >
        {/* First Row - moves left */}
        <div 
          className="flex gap-2 mb-2 px-6"
          style={{
            transform: `translateX(${scrollY * -0.1}px)`,
            willChange: 'transform'
          }}
        >
          {[
            '/pool-pics/pool-pics-1.png',
            '/pool-pics/pool-pics-2.png',
            '/pool-pics/pool-pics-3.png',
            '/pool-pics/pool-pics-4.png',
            '/pool-pics/pool-pics-5.png',
            '/pool-pics/pool-pics-6.png'
          ].map((src, idx) => (
            <div key={idx} className="flex-shrink-0 w-96 h-72 overflow-hidden">
              <img 
                src={src}
                alt={`Pool ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Second Row - moves right */}
        <div 
          className="flex gap-2 justify-end px-6"
          style={{
            transform: `translateX(${scrollY * 0.1}px)`,
            willChange: 'transform'
          }}
        >
          {[
            '/pool-pics/pool-pics-7.png',
            '/pool-pics/pool-pics-8.png',
            '/pool-pics/pool-pics-9.png',
            '/pool-pics/pool-pics-10.png',
            '/pool-pics/pool-pics-11.png'
          ].map((src, idx) => (
            <div key={`row2-${idx}`} className="flex-shrink-0 w-96 h-72 overflow-hidden">
              <img 
                src={src}
                alt={`Pool ${idx + 7}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Vanta Pools - Header */}
      <section className="pt-20 pb-40" style={{backgroundColor: '#eae3d7'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={whyChooseHeader.ref}
            className={`text-center transition-all duration-1000 ${
              whyChooseHeader.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-text-strong mb-4" style={{ fontFamily: "'PP Editorial Old', serif", fontWeight: 400 }}>
              Why Choose Vanta Pools
            </h2>
            <p className="text-xl text-text max-w-2xl mx-auto">
              Four reasons luxury pools are perfect for modern living: space-efficient design, premium quality, transparent pricing, and efficient installation.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Vanta Pools - Scrollytelling with full-width images */}
      <section className="relative" style={{backgroundColor: '#F5F1ED'}}>
        {/* Full-width background images */}
        <div className="absolute inset-0">
          {[
            '/pool-pics/pool-pics-12.png', // Transparent & Frequent Communication
            '/pool-pics/pool-pics-13.png', // Price Certainty You Can Trust
            '/pool-pics/pool-pics-14.png', // High-Touch Organization
            '/pool-pics/pool-pics-15.png'  // Timeline Expectations
          ].map((src, idx) => (
            <div
              key={idx}
              ref={(el) => (whyImageRefs.current[idx] = el)}
              data-index={idx}
              className="h-[70vh] md:h-[80vh] lg:h-[70vh] w-full overflow-hidden relative"
            >
              <img
                src={src}
                alt={`Why Choose Vanta Pools ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-text-strong/40"></div>
              {/* Gold stamp for first 2 sections */}
              {idx < 2 && (
                <img
                  src="/gold-stamp.png"
                  alt="Gold Award Winner"
                  className="absolute bottom-8 right-8 w-20 md:w-24 lg:w-28 z-10"
                />
              )}
              {/* Silver stamp for 3rd section */}
              {idx === 2 && (
                <img
                  src="/silver-stamp.png"
                  alt="Silver Award Winner"
                  className="absolute bottom-8 right-8 w-20 md:w-24 lg:w-28 z-10"
                />
              )}
            </div>
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-10 pt-12 pb-0 md:pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: Sticky text that updates with scroll */}
              <div className="sticky top-1/2 -translate-y-1/2 self-start mt-24 md:mt-40 lg:mt-56">
                <div 
                  className={`transition-all duration-300 ease-in-out transform ${
                    isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
                  }`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                    {whyChooseItems[activeWhyIndex].title}
                  </h3>
                  <p className="text-lg text-white/90 leading-relaxed">
                    {whyChooseItems[activeWhyIndex].text}
                  </p>
                </div>
              </div>

              {/* Right: Spacer to maintain layout */}
              <div className="h-[240vh] md:h-[280vh]">
                {/* This div maintains the scroll height for the sticky positioning */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="pt-16 md:pt-0 pb-16" style={{backgroundColor: '#F5F1ED'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            ref={servicesSection.ref}
            className={`transition-all duration-1000 ${
              servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
          {/* Content row */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Text content - 1/4 of row */}
            <div className="space-y-6 lg:col-span-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-strong" style={{ fontFamily: "'PP Editorial Old', serif", fontWeight: 400 }}>
                What We <span className="italic">Create</span>
              </h2>
              <div>
                <p className="text-base text-text leading-relaxed">
                  We design and install luxury pools tailored to your space, lifestyle, and vision. Our team delivers exceptional aquatic experiences with premium features, elegant aesthetics, and thoughtful design that maximizes every square foot.
                </p>
              </div>
              
              <div className="flex items-center gap-3 mt-6">
                <Link to="/" className="flex items-center gap-3 text-text-strong hover:opacity-80 transition-opacity cursor-pointer">
                  <div className="w-4 h-4 bg-text-strong"></div>
                  <span className="text-sm font-medium uppercase tracking-wide">VIEW POOL DESIGNS</span>
                </Link>
              </div>
            </div>

            {/* Featured New Builds - two horizontal cards stacked */}
            <div className="lg:col-span-3 space-y-10">
              {/* Project 1: Featured Pool */}
              <div>
                <div className="w-full h-56 md:h-64 overflow-hidden bg-bg-muted">
                  <img 
                    src="/pool-pics/pool-pics-16.png"
                    alt="Featured Pool Design"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <Link to="/" className="flex items-center gap-3 text-text-strong hover:opacity-80 transition-opacity">
                    <div className="w-4 h-4 border-2 border-text-strong bg-transparent"></div>
                    <span className="text-sm font-medium uppercase tracking-wide">Featured Pool Design</span>
                  </Link>
                </div>
              </div>

              {/* Project 2: Luxury Pool */}
              <div>
                <div className="w-full h-56 md:h-64 overflow-hidden bg-bg-muted">
                  <img 
                    src="/pool-pics/pool-pics-17.png"
                    alt="Luxury Pool Installation"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4">
                  <Link to="/" className="flex items-center gap-3 text-text-strong hover:opacity-80 transition-opacity">
                    <div className="w-4 h-4 border-2 border-text-strong bg-transparent"></div>
                    <span className="text-sm font-medium uppercase tracking-wide">Luxury Pool Installation</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section ref={testimonialRef} className="relative flex items-center justify-center overflow-hidden" style={{ height: '130vh' }}>
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url('/pool-pics/pool-pics-18.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-text-strong/40"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: 'white' }}>
            {displayedText.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                {index < displayedText.split('\n').length - 1 && <br />}
              </span>
            ))}
            {isTyping && <span className="animate-pulse">|</span>}
          </h2>
        </div>
      </section>

      {/* Our Gallery */}
      <section className="py-24 relative overflow-hidden" style={{backgroundColor: '#eae3d7'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading and copy */}
          <div 
            ref={ourGallerySection.ref}
            className={`max-w-xl transition-all duration-1000 ${
              ourGallerySection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-strong mb-6" style={{ fontFamily: "'PP Editorial Old', serif", fontWeight: 400 }}>
              Our Gallery
            </h2>
            <p className="text-sm text-text mb-6">
              Explore our gallery to see stunning pool installations from across our portfolio. 
              Discover thoughtful designs, premium finishes, and transformative spaces that showcase how luxury adapts beautifully to any setting.
            </p>
            <Link to="/" className="flex items-center gap-3 text-text-strong hover:opacity-80 transition-opacity">
              <div className="w-4 h-4 bg-text-strong"></div>
              <span className="text-sm font-medium uppercase tracking-wide">VIEW ALL IMAGES</span>
            </Link>
          </div>
        </div>

        {/* Edge-to-edge carousel */}
        <div 
          ref={galleryCarousel.ref}
          className={`-mx-4 sm:-mx-6 lg:-mx-8 mt-8 lg:mt-12 transition-all duration-1000 ${
            galleryCarousel.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
            <CarouselContent>
              {[
                '/pool-pics/pool-pics-1.png',
                '/pool-pics/pool-pics-2.png',
                '/pool-pics/pool-pics-3.png',
                '/pool-pics/pool-pics-4.png',
                '/pool-pics/pool-pics-5.png',
                '/pool-pics/pool-pics-6.png',
                '/pool-pics/pool-pics-7.png',
                '/pool-pics/pool-pics-8.png',
                '/pool-pics/pool-pics-9.png',
                '/pool-pics/pool-pics-10.png',
                '/pool-pics/pool-pics-11.png',
                '/pool-pics/pool-pics-12.png',
                '/pool-pics/pool-pics-13.png',
                '/pool-pics/pool-pics-14.png',
                '/pool-pics/pool-pics-15.png',
                '/pool-pics/pool-pics-16.png',
                '/pool-pics/pool-pics-17.png',
                '/pool-pics/pool-pics-18.png',
                '/pool-pics/pool-pics-19.png'
              ].map((src, idx) => (
                <CarouselItem key={idx} className="basis-[85%] md:basis-[75%] lg:basis-[70%]">
                  <div className="w-full h-[26rem] md:h-[32rem] lg:h-[36rem] overflow-hidden">
                    <img
                      src={src}
                      alt={`Pool ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="right-40 bottom-6 top-auto left-auto -translate-y-0 bg-white/90 hover:bg-white text-text-strong shadow-sm ring-2 ring-accent-sand/30 hover:ring-accent-sand/50" />
            <CarouselNext className="right-28 bottom-6 top-auto -translate-y-0 bg-white/90 hover:bg-white text-text-strong shadow-sm ring-2 ring-accent-sand/30 hover:ring-accent-sand/50" />
          </Carousel>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
