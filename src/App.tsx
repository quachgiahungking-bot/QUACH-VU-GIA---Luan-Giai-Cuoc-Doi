import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Moon, Sun, Star, Compass, User, Clock, Calendar, Search, ChevronDown, ChevronUp, Palette, Share2, Check, Copy, Download, Link } from 'lucide-react';
import { getAstrologyReading, AstrologySection } from './services/geminiService';

const themes = [
  { id: 'theme-gold', name: 'Hoàng Kim & Huyết Trần', color: '#d4af37' },
  { id: 'theme-emerald', name: 'Ngọc Bích & Thâm Lâm', color: '#50c878' },
  { id: 'theme-amethyst', name: 'Tử Đằng & Ngân Kim', color: '#9966cc' },
];

const CollapsibleSection = ({ section, isExpanded, onToggle }: { section: AstrologySection, isExpanded: boolean, onToggle: () => void }) => {
  return (
    <div className="border border-mystic-border rounded-lg mb-4 overflow-hidden bg-mystic-surface">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-mystic-surface-hover hover:opacity-90 transition-colors text-left"
      >
        <span className="font-serif text-xl font-semibold text-mystic-primary">{section.title}</span>
        {isExpanded ? <ChevronUp className="text-mystic-primary" /> : <ChevronDown className="text-mystic-primary" />}
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 markdown-body border-t border-mystic-border opacity-80">
              <ReactMarkdown>{section.content}</ReactMarkdown>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [currentTheme, setCurrentTheme] = useState('theme-gold');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  React.useEffect(() => {
    document.body.className = currentTheme;
  }, [currentTheme]);

  const [birthTime, setBirthTime] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [calendarType, setCalendarType] = useState('Dương lịch');
  const [gender, setGender] = useState('Nam');
  
  const [isLoading, setIsLoading] = useState(false);
  const [reading, setReading] = useState<AstrologySection[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSectionTitle, setExpandedSectionTitle] = useState<string | null>(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const shareText = `Lá số Tử vi & Chiêm tinh - QUÁCH VŨ GIA GROUP\nGiờ sinh: ${birthTime} | Ngày sinh: ${birthDate} (${calendarType}) | Giới tính: ${gender}\n\nXem ngay tại: ${window.location.href}`;

  const handleSystemShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Giải Mã Vận Mệnh - QUÁCH VŨ GIA GROUP',
          text: shareText,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) { }
  };

  const handleCopyFullText = async () => {
    if (!reading) return;
    const fullText = reading.map(section => `## ${section.title}\n${section.content}`).join('\n\n');
    try {
      await navigator.clipboard.writeText(`Lá số Tử vi & Chiêm tinh - QUÁCH VŨ GIA GROUP\nGiờ: ${birthTime} | Ngày: ${birthDate} (${calendarType}) | Giới tính: ${gender}\n\n${fullText}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) { }
  };

  const handleDownloadFile = () => {
    if (!reading) return;
    const fullText = reading.map(section => `## ${section.title}\n${section.content}`).join('\n\n');
    const content = `Lá số Tử vi & Chiêm tinh - QUÁCH VŨ GIA GROUP\n\nTHÔNG TIN BẢN MỆNH:\nGiờ sinh: ${birthTime}\nNgày sinh: ${birthDate} (${calendarType})\nGiới tính: ${gender}\n\n=========================================\n\n${fullText}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `La_So_Tu_Vi_${birthDate.replace(/\//g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowShareMenu(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthTime || !birthDate) {
      setError('Vui lòng nhập đầy đủ giờ sinh và ngày sinh!');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setReading(null);
    setExpandedSectionTitle(null);

    try {
      const result = await getAstrologyReading(birthTime, birthDate, calendarType, gender);
      setReading(result);
      if (result && result.length > 0) {
        setExpandedSectionTitle(result[0].title);
      }
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra. Hãy thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-20 transition-colors duration-500">
      {/* Brand Header */}
      <div className="w-full text-center py-4 border-b border-mystic-border bg-mystic-bg/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-6">
        <div className="w-8"></div>
        <h2 className="text-mystic-primary font-serif tracking-[0.3em] font-semibold text-lg drop-shadow-md">
          QUÁCH VŨ GIA GROUP
        </h2>
        
        <div className="relative">
          <button 
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="text-mystic-primary hover:text-mystic-primary-light transition-colors p-2"
          >
            <Palette size={20} />
          </button>
          
          <AnimatePresence>
            {showThemeMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-48 bg-mystic-surface border border-mystic-border rounded-lg shadow-xl overflow-hidden z-50"
              >
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setCurrentTheme(theme.id);
                      setShowThemeMenu(false);
                    }}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-mystic-surface-hover text-mystic-text text-sm transition-colors border-b border-mystic-border last:border-b-0"
                  >
                    <span 
                      className="w-4 h-4 rounded-full shadow-inner"
                      style={{ backgroundColor: theme.color }}
                    />
                    {theme.name}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-mystic-primary/10 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-20 left-10 md:left-20 opacity-10 pointer-events-none -z-10 text-mystic-primary">
        <Sun size={120} strokeWidth={1} />
      </div>
      <div className="absolute top-40 right-10 md:right-20 opacity-10 pointer-events-none -z-10 text-mystic-primary">
        <Moon size={80} strokeWidth={1} />
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-16">
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center justify-center gap-3 mb-4 text-mystic-primary"
          >
            <Compass size={32} />
            <span className="uppercase tracking-[0.2em] text-sm font-semibold">Bát Tự & Chiêm Tinh</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-serif text-mystic-text mb-4 drop-shadow-lg"
          >
            Đại sư Chiêm tinh & Tử vi
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-mystic-text-muted max-w-2xl mx-auto italic"
          >
            Gắn kết tinh hoa Ngũ Hành phương Đông và tinh tú phương Tây, lý giải vận mệnh, khai mở thời cơ cho cuộc sống của bạn.
          </motion.p>
        </header>

        <motion.main
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {!reading && !isLoading && (
            <div className="mystic-card p-6 md:p-10 max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl text-center mb-8 text-mystic-primary">Nhập Dữ Liệu Bản Mệnh</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-mystic-text-muted">
                      <Clock size={16} /> Giờ sinh
                    </label>
                    <input 
                      type="time" 
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full p-3 bg-mystic-bg text-mystic-text border border-mystic-border rounded-lg focus:outline-none focus:border-mystic-primary focus:ring-1 focus:ring-mystic-primary transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-mystic-text-muted">
                      <Calendar size={16} /> Ngày sinh
                    </label>
                    <input 
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full p-3 bg-mystic-bg text-mystic-text border border-mystic-border rounded-lg focus:outline-none focus:border-mystic-primary focus:ring-1 focus:ring-mystic-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-mystic-text-muted">
                      <Star size={16} /> Loại Lịch
                    </label>
                    <select 
                      value={calendarType}
                      onChange={(e) => setCalendarType(e.target.value)}
                      className="w-full p-3 bg-mystic-bg text-mystic-text border border-mystic-border rounded-lg focus:outline-none focus:border-mystic-primary focus:ring-1 focus:ring-mystic-primary transition-colors cursor-pointer"
                    >
                      <option value="Dương lịch">Dương Lịch</option>
                      <option value="Âm lịch">Âm Lịch</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-mystic-text-muted">
                      <User size={16} /> Giới Tính
                    </label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full p-3 bg-mystic-bg text-mystic-text border border-mystic-border rounded-lg focus:outline-none focus:border-mystic-primary focus:ring-1 focus:ring-mystic-primary transition-colors cursor-pointer"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <p className="text-mystic-primary-light text-center py-2 bg-mystic-accent/20 rounded-lg border border-mystic-accent/50">{error}</p>
                )}

                <button 
                  type="submit" 
                  className="w-full mt-8 bg-mystic-primary text-mystic-bg uppercase tracking-widest font-semibold py-4 rounded-lg hover:bg-mystic-primary-light transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--theme-shadow-primary)]"
                >
                  <Search size={18} /> Giải Mã Vận Mệnh
                </button>
              </form>
            </div>
          )}

          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="w-32 h-32 border-[1px] border-dashed border-mystic-primary rounded-full"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                    className="absolute top-2 left-2 w-28 h-28 border-[1px] border-mystic-accent rounded-full opacity-50"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Star size={32} className="text-mystic-primary" />
                  </div>
                </div>
                <p className="mt-8 font-serif text-xl italic text-mystic-text-muted">Đang kết nối với các tinh tú...</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {reading && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mystic-card p-6 md:p-12"
              >
                <div className="text-center mb-10 pb-6 border-b border-mystic-border">
                  <h2 className="font-serif text-3xl mb-2 text-gradient-gold">Luận Giải Vận Mệnh</h2>
                  <p className="text-mystic-text-muted uppercase tracking-widest text-xs">
                    {birthTime} | {birthDate} | {calendarType} | {gender}
                  </p>
                </div>
                
                <div className="space-y-4">
                  {reading.map((section, index) => (
                    <CollapsibleSection 
                      key={index} 
                      section={section} 
                      isExpanded={expandedSectionTitle === section.title}
                      onToggle={() => {
                        setExpandedSectionTitle(
                          expandedSectionTitle === section.title ? null : section.title
                        );
                      }}
                    />
                  ))}
                </div>

                <div className="mt-12 text-center pt-8 border-t border-mystic-border flex flex-col sm:flex-row justify-center items-center gap-4">
                  <button 
                    onClick={() => {
                      setReading(null);
                      setBirthTime('');
                      setBirthDate('');
                    }}
                    className="inline-block w-full sm:w-auto border border-mystic-primary text-mystic-primary uppercase tracking-widest font-semibold px-8 py-3 rounded-full hover:bg-mystic-primary/10 transition-colors"
                  >
                    Xem lá số khác
                  </button>
                  <div className="relative w-full sm:w-auto">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center justify-center gap-2 w-full border bg-mystic-primary text-mystic-bg border-mystic-primary uppercase tracking-widest font-semibold px-8 py-3 rounded-full hover:bg-mystic-primary-light transition-colors"
                    >
                      <Share2 size={18} />
                      Chia sẻ & Lưu
                    </button>
                    
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-full left-0 sm:left-1/2 sm:-translate-x-1/2 mb-2 w-64 bg-mystic-surface border border-mystic-border rounded-lg shadow-xl overflow-hidden z-50 text-left"
                        >
                          {navigator.share && (
                            <button onClick={handleSystemShare} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-mystic-surface-hover text-mystic-text text-sm transition-colors border-b border-mystic-border">
                              <Share2 size={16} /> Chia sẻ qua ứng dụng
                            </button>
                          )}
                          <button onClick={handleCopyLink} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-mystic-surface-hover text-mystic-text text-sm transition-colors border-b border-mystic-border">
                            {copiedLink ? <Check size={16} className="text-green-500" /> : <Link size={16} />} 
                            {copiedLink ? 'Đã sao chép link' : 'Sao chép liên kết'}
                          </button>
                          <button onClick={handleCopyFullText} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-mystic-surface-hover text-mystic-text text-sm transition-colors border-b border-mystic-border">
                            {copiedText ? <Check size={16} className="text-green-500" /> : <Copy size={16} />} 
                            {copiedText ? 'Đã sao chép toàn bài' : 'Sao chép toàn bộ bài luận'}
                          </button>
                          <button onClick={handleDownloadFile} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-mystic-surface-hover text-mystic-text text-sm transition-colors">
                            <Download size={16} /> Lưu thành dạng TXT
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>
      </div>
    </div>
  );
}

