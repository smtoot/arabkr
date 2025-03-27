
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, LogIn, UserCircle, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    if (!profile) return 'U';
    return `${profile.first_name?.charAt(0) || ''}${profile.last_name?.charAt(0) || ''}`;
  };

  const getProfileName = () => {
    if (!profile) return 'User';
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name} ${profile.last_name}`.trim();
    }
    return 'User';
  };

  const navItems = [
    { name: 'الرئيسية', path: '/' },
    { name: 'المعلمون', path: '/teachers' },
    { name: 'الدروس', path: '/lessons' },
    { name: 'من نحن', path: '/about' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 bg-background/80 backdrop-blur-sm shadow-sm' : 'py-5 bg-transparent'
      }`}
      dir="rtl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-primary font-bold text-xl tracking-tight"
            aria-label="Home"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              هانجوك
            </motion.div>
          </Link>
          
          {/* Desktop Navigation */}
          <motion.ul 
            className="hidden md:flex space-x-8" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {navItems.map((item, index) => (
              <motion.li 
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                className="ml-8 last:ml-0" // Right-to-left margin
              >
                <Link 
                  to={item.path} 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
          
          {/* Auth Buttons or User Menu */}
          <div className="hidden md:flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} alt={getProfileName()} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getProfileName()}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <UserCircle className="ml-2 h-4 w-4" />
                    <span>لوحة التحكم</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="ml-2 h-4 w-4" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="ml-2 h-4 w-4" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-4">
                <Link to="/auth/login">
                  <Button variant="outline" className="ml-2">
                    <LogIn className="ml-2 h-4 w-4" /> تسجيل الدخول
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button>إنشاء حساب</Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          className="md:hidden absolute top-full left-0 right-0 bg-background border-b"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container mx-auto px-4 py-4">
            <ul className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.li 
                  key={item.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.05 * (index + 1) }}
                >
                  <Link 
                    to={item.path} 
                    className="block py-2 text-base font-medium text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.li>
              ))}

              {user ? (
                <>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Link 
                      to="/dashboard" 
                      className="block py-2 text-base font-medium text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      لوحة التحكم
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-right py-2 text-base font-medium text-destructive"
                    >
                      تسجيل الخروج
                    </button>
                  </motion.li>
                </>
              ) : (
                <>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }}
                  >
                    <Link 
                      to="/auth/login" 
                      className="block py-2 text-base font-medium text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      تسجيل الدخول
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }}
                  >
                    <Link 
                      to="/auth/register" 
                      className="block py-2 text-base font-medium text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      إنشاء حساب
                    </Link>
                  </motion.li>
                </>
              )}
            </ul>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
