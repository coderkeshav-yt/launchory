
import { useState, useEffect } from 'react';
import { ArrowLeft, Filter, Search, Briefcase, Code, Layers, Filter as FilterIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from "@/components/ui/use-toast";

// Extended project data for the full projects page
const allProjects = [
  {
    title: 'Neural Interface System',
    description: 'AI-powered neural interface for seamless human-computer interaction',
    image: '/images/project1.jpg',
    link: 'https://example.com/project1',
    category: 'AI',
    tags: ['Interface', 'AI', 'Neural'],
    date: '2024-03-15',
  },
  {
    title: 'Quantum Computing Platform',
    description: 'Next-generation quantum computing framework for complex simulations',
    image: '/images/project2.jpg',
    link: 'https://example.com/project2',
    category: 'Computing',
    tags: ['Quantum', 'Computing', 'Framework'],
    date: '2024-02-22',
  },
  {
    title: 'Augmented Reality Ecosystem',
    description: 'Immersive AR experience platform with real-time environmental mapping',
    image: '/images/project3.jpg',
    link: 'https://example.com/project3',
    category: 'AR/VR',
    tags: ['AR', 'Mapping', 'Platform'],
    date: '2024-01-10',
  },
  {
    title: 'Blockchain Security Framework',
    description: 'Enterprise-grade security solution for blockchain applications and networks',
    image: 'https://placehold.co/600x400/1a1f2c/FFFFFF?text=Blockchain',
    link: 'https://example.com/project4',
    category: 'Blockchain',
    tags: ['Security', 'Blockchain', 'Enterprise'],
    date: '2023-12-05',
  },
  {
    title: 'Smart City Infrastructure',
    description: 'Integrated IoT system for modern urban planning and management',
    image: 'https://placehold.co/600x400/1a1f2c/FFFFFF?text=SmartCity',
    link: 'https://example.com/project5',
    category: 'IoT',
    tags: ['Smart City', 'IoT', 'Urban'],
    date: '2023-11-18',
  },
  {
    title: 'Healthcare Analytics Platform',
    description: 'Advanced data analysis tools for healthcare providers and researchers',
    image: 'https://placehold.co/600x400/1a1f2c/FFFFFF?text=Healthcare',
    link: 'https://example.com/project6',
    category: 'Healthcare',
    tags: ['Healthcare', 'Analytics', 'Data'],
    date: '2023-10-30',
  },
  {
    title: 'Financial Trading Algorithm',
    description: 'High-frequency trading system with predictive market analysis',
    image: 'https://placehold.co/600x400/1a1f2c/FFFFFF?text=Finance',
    link: 'https://example.com/project7',
    category: 'Finance',
    tags: ['Trading', 'Algorithm', 'Finance'],
    date: '2023-09-12',
  },
  {
    title: 'Renewable Energy Grid',
    description: 'Smart energy distribution network optimized for renewable sources',
    image: 'https://placehold.co/600x400/1a1f2c/FFFFFF?text=Energy',
    link: 'https://example.com/project8',
    category: 'Energy',
    tags: ['Renewable', 'Energy', 'Grid'],
    date: '2023-08-05',
  },
  {
    title: 'Autonomous Vehicle System',
    description: 'Self-driving technology with advanced environmental perception',
    image: 'https://placehold.co/600x400/1a1f2c/FFFFFF?text=Automotive',
    link: 'https://example.com/project9',
    category: 'Automotive',
    tags: ['Autonomous', 'Vehicle', 'AI'],
    date: '2023-07-22',
  },
];

const categories = [...new Set(allProjects.map(project => project.category))];

// Project component to display each project
const Project = ({ title, description, image, link, category, tags, isVisible }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="h-full"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-card/80 to-card border-border/40 shadow-lg hover:shadow-xl transition-all duration-500 h-full group">
        <div className="relative h-48 overflow-hidden">
          <div className="absolute top-2 right-2 z-20">
            <Badge variant="secondary" className="bg-accent/80 text-white">
              {category}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
          <img 
            src={image || "https://placehold.co/600x400/1a1f2c/FFFFFF?text=Project"} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="font-space text-gradient text-xl">{title}</CardTitle>
          <CardDescription className="text-muted-foreground/80">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1 mt-2">
            {tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-end">
          <a 
            href={link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors font-medium"
          >
            View Project
            <Search className="h-3.5 w-3.5" />
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Category filter component
const CategoryMenu = ({ categories, selectedCategory, onChange }) => {
  const categoryIcons = {
    'AI': <Code size={16} />,
    'Computing': <Layers size={16} />,
    'AR/VR': <Briefcase size={16} />,
    'Blockchain': <Layers size={16} />,
    'IoT': <Briefcase size={16} />,
    'Healthcare': <Briefcase size={16} />,
    'Finance': <Layers size={16} />,
    'Energy': <Briefcase size={16} />,
    'Automotive': <Layers size={16} />,
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategory === null ? "secondary" : "outline"}
        size="sm"
        className="flex items-center gap-1"
        onClick={() => onChange(null)}
      >
        <FilterIcon size={14} />
        All Projects
      </Button>

      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "secondary" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onChange(category)}
        >
          {categoryIcons[category] || <Briefcase size={14} />}
          {category}
        </Button>
      ))}
    </div>
  );
};

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const projectsPerPage = 6;
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Projects loaded",
        description: "Explore our portfolio of innovative solutions",
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [toast]);

  // Filter projects based on search term and category
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
  
  // Get current projects for pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center mb-8"
            >
              <div className="inline-block mb-4">
                <Badge variant="outline" className="text-accent bg-accent/10 border-accent/20">
                  Our Portfolio
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold font-space text-gradient mb-4">Explore Our Projects</h1>
              <p className="text-muted-foreground text-lg">
                Discover our complete portfolio of innovative solutions designed to transform industries
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto"
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search projects..."
                  className="pl-9 bg-card/50 backdrop-blur-sm"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="w-full md:w-[180px] bg-card/50 backdrop-blur-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sort By</SelectLabel>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </motion.div>
          </div>
        </section>
      
        {/* Projects listing section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/" className="flex items-center gap-1">
                      <ArrowLeft className="h-4 w-4" />
                      Back to Home
                    </Link>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Showing {filteredProjects.length} projects
                  </span>
                </div>
              </div>
              
              {/* Category filters */}
              <CategoryMenu 
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={setSelectedCategory}
              />
            </motion.div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <div className="h-48">
                      <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex gap-1 mt-2">
                        <Skeleton className="h-4 w-10" />
                        <Skeleton className="h-4 w-10" />
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Skeleton className="h-4 w-24 ml-auto" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {currentProjects.map((project, index) => (
                    <Project
                      key={index}
                      title={project.title}
                      description={project.description}
                      image={project.image}
                      link={project.link}
                      category={project.category}
                      tags={project.tags}
                      isVisible={!isLoading}
                    />
                  ))}
                </div>
                
                {filteredProjects.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted/50 mb-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-xl text-muted-foreground">No projects found matching your search criteria.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory(null);
                      }}
                    >
                      Clear filters
                    </Button>
                  </motion.div>
                )}
                
                {filteredProjects.length > projectsPerPage && (
                  <Pagination className="mt-8">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(3, Math.ceil(filteredProjects.length / projectsPerPage)) }, (_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            onClick={() => paginate(i + 1)}
                            isActive={currentPage === i + 1}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      {Math.ceil(filteredProjects.length / projectsPerPage) > 3 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink 
                              onClick={() => paginate(Math.ceil(filteredProjects.length / projectsPerPage))}
                              isActive={currentPage === Math.ceil(filteredProjects.length / projectsPerPage)}
                            >
                              {Math.ceil(filteredProjects.length / projectsPerPage)}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredProjects.length / projectsPerPage)))}
                          className={currentPage === Math.ceil(filteredProjects.length / projectsPerPage) ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectsPage;
