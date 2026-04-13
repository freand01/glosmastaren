import React, { useState, useEffect, useRef } from 'react';
import LZString from 'lz-string';
import { 
  BookOpen, 
  PlusCircle, 
  Gamepad2, 
  Keyboard, 
  RefreshCcw, 
  Check, 
  X, 
  Award,
  ChevronRight,
  ChevronLeft,
  Settings,
  Volume2,
  Headphones,
  Shuffle,
  Ghost,
  Mic,
  ArrowRightLeft,
  Link as LinkIcon,
  Download,
  Upload,
  Copy,
  Sparkles,
  Printer
} from 'lucide-react';

// --- GLOBAL TTS HELPER ---
const playAudio = (text, lang = 'es-ES') => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang; 
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Din webbläsare stöder tyvärr inte uppläsning.");
  }
};

// --- INITIAL DUMMY DATA ---
const defaultWords = [
  { id: 1, term: "The Cat", translation: "Katten" },
  { id: 2, term: "The Dog", translation: "Hunden" },
  { id: 3, term: "The House", translation: "Huset" },
  { id: 4, term: "The Sun", translation: "Solen" },
];

export default function App() {
  const [words, setWords] = useState([]);
  const [ttsLanguage, setTtsLanguage] = useState('en-US');
  const [direction, setDirection] = useState('term-to-trans'); 
  const [currentView, setCurrentView] = useState('dashboard');
  const [isLoaded, setIsLoaded] = useState(false);

  // --- INITIAL LOAD ---
  useEffect(() => {
    const loadInitialData = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const listData = urlParams.get('list');

      if (listData) {
        try {
          let decodedString;
          // Försök först dekomprimera med LZString (nya metoden)
          const decompressed = LZString.decompressFromEncodedURIComponent(listData);
          
          if (decompressed) {
            decodedString = decompressed;
          } else {
            // Fallback till gamla metoden (atob) för gamla länkar
            decodedString = decodeURIComponent(atob(listData));
          }

          const parsedData = JSON.parse(decodedString);
          
          if (parsedData.words && Array.isArray(parsedData.words)) {
            setWords(parsedData.words);
            if (parsedData.lang) setTtsLanguage(parsedData.lang);
            window.history.replaceState({}, document.title, window.location.pathname);
            setIsLoaded(true);
            return; 
          }
        } catch (e) {
          console.error("Kunde inte läsa in delningslänken", e);
          alert("Länken verkar vara trasig eller för gammal.");
        }
      }

      const savedWords = localStorage.getItem('glosmastaren_words');
      const savedLang = localStorage.getItem('glosmastaren_lang');
      
      if (savedWords) setWords(JSON.parse(savedWords));
      else setWords(defaultWords);
      
      if (savedLang) setTtsLanguage(savedLang);
      
      setIsLoaded(true);
    };

    loadInitialData();
  }, []);

  // --- AUTOSPARA ---
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('glosmastaren_words', JSON.stringify(words));
      localStorage.setItem('glosmastaren_lang', ttsLanguage);
    }
  }, [words, ttsLanguage, isLoaded]);

  const toggleDirection = () => {
    setDirection(prev => prev === 'term-to-trans' ? 'trans-to-term' : 'term-to-trans');
  };

  if (!isLoaded) return <div className="min-h-screen bg-indigo-50 flex items-center justify-center font-bold text-indigo-400 text-2xl animate-pulse">Laddar spel...</div>;

  const Navigation = () => (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg shadow-indigo-100/50 border-4 border-white px-6 py-4 flex flex-col md:flex-row justify-between items-center rounded-3xl md:rounded-full mb-10 mt-6 gap-4 z-10 relative">
      <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentView('dashboard')}>
        <div className="bg-indigo-500 p-3 rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all shadow-[0_4px_0_0_#312e81]">
          <BookOpen className="text-white" size={28} />
        </div>
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 tracking-tight">Glosmästaren</h1>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
        <button onClick={toggleDirection} className="flex items-center gap-2 bg-indigo-100 text-indigo-700 border-2 border-indigo-200 px-4 py-3 rounded-2xl font-bold hover:bg-indigo-200 hover:border-indigo-300 transition-all shadow-sm active:scale-95" title="Vänd håll på översättningen">
          <span className="w-16 text-right hidden sm:block">{direction === 'term-to-trans' ? 'Glosa' : 'Svenska'}</span>
          <ArrowRightLeft size={18} className="text-indigo-500" />
          <span className="w-16 text-left hidden sm:block">{direction === 'term-to-trans' ? 'Svenska' : 'Glosa'}</span>
        </button>
        <div className="w-1 h-8 bg-slate-200 rounded-full mx-2 hidden md:block"></div>
        <button onClick={() => setCurrentView('dashboard')} className={`px-5 py-3 rounded-2xl font-black transition-all ${currentView === 'dashboard' ? 'bg-indigo-500 text-white shadow-[0_4px_0_0_#312e81] translate-y-[-2px]' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}>Spela</button>
        <button onClick={() => setCurrentView('add')} className={`px-5 py-3 rounded-2xl font-black transition-all ${currentView === 'add' ? 'bg-indigo-500 text-white shadow-[0_4px_0_0_#312e81] translate-y-[-2px]' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}>Gloslista</button>
        <button onClick={() => setCurrentView('share')} className={`px-5 py-3 rounded-2xl font-black transition-all ${currentView === 'share' ? 'bg-indigo-500 text-white shadow-[0_4px_0_0_#312e81] translate-y-[-2px]' : 'bg-transparent text-slate-500 hover:bg-slate-100'}`}>Dela/Spara</button>
      </div>
    </nav>
  );

  return (
    <>
      {/* --- VANLIGA APPEN (Döljs när man skriver ut) --- */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 font-sans text-slate-800 pb-16 print:hidden">
        <div className="max-w-6xl mx-auto px-4">
          <Navigation />
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-500">
            {currentView === 'dashboard' && <Dashboard setCurrentView={setCurrentView} wordsCount={words.length} />}
            {currentView === 'add' && <ManageWords words={words} setWords={setWords} ttsLanguage={ttsLanguage} setTtsLanguage={setTtsLanguage} />}
            {currentView === 'share' && <ShareSaveView words={words} setWords={setWords} ttsLanguage={ttsLanguage} setTtsLanguage={setTtsLanguage} />}
            {currentView === 'flashcards' && <Flashcards words={words} onBack={() => setCurrentView('dashboard')} ttsLanguage={ttsLanguage} direction={direction} />}
            {currentView === 'quiz' && <QuizMode words={words} onBack={() => setCurrentView('dashboard')} direction={direction} />}
            {currentView === 'type' && <TypingMode words={words} onBack={() => setCurrentView('dashboard')} direction={direction} />}
            {currentView === 'match' && <MatchingMode words={words} onBack={() => setCurrentView('dashboard')} />}
            {currentView === 'scramble' && <ScrambleMode words={words} onBack={() => setCurrentView('dashboard')} direction={direction} />}
            {currentView === 'hangman' && <HangmanMode words={words} onBack={() => setCurrentView('dashboard')} direction={direction} />}
            {currentView === 'listen' && <ListenTypeMode words={words} onBack={() => setCurrentView('dashboard')} ttsLanguage={ttsLanguage} direction={direction} />}
            {currentView === 'speak' && <SpeakMode words={words} onBack={() => setCurrentView('dashboard')} ttsLanguage={ttsLanguage} direction={direction} />}
          </div>
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .backface-hidden { backface-visibility: hidden; }
          .rotate-y-180 { transform: rotateY(180deg); }
          @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
          .animate-float { animation: float 3s ease-in-out infinite; }
        `}} />
      </div>

      {/* --- UTSKRIFTSVY (Visas BARA när man skriver ut) --- */}
      <div className="hidden print:block p-8 bg-white text-black font-sans min-h-screen">
        <div className="flex items-center gap-3 mb-8 border-b-4 border-slate-800 pb-4">
          <BookOpen size={40} className="text-slate-800" />
          <h1 className="text-4xl font-black text-slate-800 tracking-tight">Glosmästaren</h1>
        </div>
        
        <table className="w-full text-lg border-collapse">
          <thead>
            <tr>
              <th className="border-b-4 border-slate-300 p-4 text-left font-black w-1/2 text-2xl uppercase tracking-widest text-slate-500">
                {direction === 'term-to-trans' ? 'Glosa' : 'Svenska'}
              </th>
              <th className="border-b-4 border-slate-300 p-4 text-left font-black w-1/2 text-2xl uppercase tracking-widest text-slate-500">
                {direction === 'term-to-trans' ? 'Svenska' : 'Glosa'}
              </th>
            </tr>
          </thead>
          <tbody>
            {words.map((word) => (
              <tr key={word.id} className="break-inside-avoid">
                <td className="border-b-2 border-slate-100 p-4 font-bold text-xl text-slate-800">
                  {direction === 'term-to-trans' ? word.term : word.translation}
                </td>
                <td className="border-b-2 border-slate-100 p-4 font-bold text-xl text-slate-800">
                  {direction === 'term-to-trans' ? word.translation : word.term}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="mt-12 text-center text-slate-400 font-bold uppercase tracking-widest text-sm">
          Totalt {words.length} ord • Utskriven från Glosmästaren
        </div>
      </div>
    </>
  );
}

// --- VYER (VIEWS) ---
function Dashboard({ setCurrentView, wordsCount }) {
  const modes = [
    { id: 'flashcards', title: 'Flashcards', desc: 'Vänd på kort och lär dig grunderna.', icon: <RefreshCcw size={36} />, theme: 'bg-blue-500 border-blue-600 shadow-blue-200' },
    { id: 'quiz', title: 'Flervalsquiz', desc: 'Välj rätt översättning av fyra möjliga.', icon: <Check size={36} />, theme: 'bg-purple-500 border-purple-600 shadow-purple-200' },
    { id: 'match', title: 'Matchning', desc: 'Para ihop ord och översättning snabbt.', icon: <Gamepad2 size={36} />, theme: 'bg-pink-500 border-pink-600 shadow-pink-200' },
    { id: 'type', title: 'Skrivläge', desc: 'Testa dig själv. Skriv in rätt översättning.', icon: <Keyboard size={36} />, theme: 'bg-orange-500 border-orange-600 shadow-orange-200' },
    { id: 'scramble', title: 'Sortera', desc: 'Bygg ihop glosan med blandade bokstäver.', icon: <Shuffle size={36} />, theme: 'bg-teal-500 border-teal-600 shadow-teal-200' },
    { id: 'hangman', title: 'Hänga gubbe', desc: 'Klassikern! Gissa glosan bokstav för bokstav.', icon: <Ghost size={36} />, theme: 'bg-red-500 border-red-600 shadow-red-200' },
    { id: 'listen', title: 'Lyssna & Skriv', desc: 'Lyssna på uttalet och stava ordet.', icon: <Headphones size={36} />, theme: 'bg-cyan-500 border-cyan-600 shadow-cyan-200' },
    { id: 'speak', title: 'Tala', desc: 'Träna uttal! Säg ordet i mikrofonen.', icon: <Mic size={36} />, theme: 'bg-lime-500 border-lime-600 shadow-lime-200' },
  ];
  return (
    <div>
      <header className="mb-12 text-center mt-8">
        <div className="inline-flex items-center justify-center p-3 bg-yellow-100 text-yellow-600 rounded-2xl mb-4 transform -rotate-6 shadow-sm border-2 border-yellow-200"><Sparkles size={28} /></div>
        <h2 className="text-5xl font-black text-slate-800 mb-4 tracking-tight">Vad vill du spela?</h2>
        <p className="text-xl text-slate-600 font-medium">Du har <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-xl font-black border-2 border-indigo-200 transform rotate-2">{wordsCount} glosor</span> redo att bemästras!</p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {modes.map((mode) => (
          <button key={mode.id} onClick={() => setCurrentView(mode.id)} className={`group flex flex-col relative w-full p-6 rounded-[2rem] text-white border-b-[8px] transition-all duration-200 hover:-translate-y-2 hover:border-b-[12px] active:translate-y-[4px] active:border-b-[4px] text-left shadow-xl outline-none ${mode.theme}`}>
            <div className="bg-white/20 p-4 rounded-2xl self-start mb-6 backdrop-blur-sm">{mode.icon}</div>
            <h3 className="text-2xl font-black mb-2 tracking-tight">{mode.title}</h3>
            <p className="text-white/80 font-medium leading-tight">{mode.desc}</p>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white opacity-10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ManageWords({ words, setWords, ttsLanguage, setTtsLanguage }) {
  const [term, setTerm] = useState('');
  const [translation, setTranslation] = useState('');
  const handleAdd = (e) => {
    e.preventDefault();
    if (!term.trim() || !translation.trim()) return;
    setWords([...words, { id: Date.now(), term: term.trim(), translation: translation.trim() }]);
    setTerm(''); setTranslation('');
  };
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-4 border-white animate-in fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h2 className="text-4xl font-black mb-2 text-slate-800 tracking-tight">Gloslistan</h2>
          <p className="text-slate-500 font-medium text-lg">Lägg till orden du vill spela med.</p>
        </div>
        <div className="relative w-full sm:w-auto bg-slate-50 p-3 rounded-3xl border-2 border-slate-100">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 px-2">Språk för uppläsning</label>
          <div className="relative">
            <select value={ttsLanguage} onChange={(e) => setTtsLanguage(e.target.value)} className="appearance-none w-full bg-white border-2 border-slate-200 text-slate-700 font-bold rounded-2xl px-4 py-3 pr-10 focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 outline-none transition-all cursor-pointer shadow-sm hover:bg-slate-50">
              <option value="es-ES">🇪🇸 Spanska</option>
              <option value="en-US">🇬🇧 Engelska</option>
              <option value="de-DE">🇩🇪 Tyska</option>
              <option value="fr-FR">🇫🇷 Franska</option>
              <option value="sv-SE">🇸🇪 Svenska</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"><ChevronRight size={16} className="rotate-90" /></div>
          </div>
        </div>
      </div>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 mb-10 bg-slate-100 p-4 rounded-[2rem] border-2 border-slate-200/60 shadow-inner">
        <div className="flex-1"><input type="text" value={term} onChange={(e) => setTerm(e.target.value)} className="w-full p-4 rounded-2xl border-4 border-white shadow-sm focus:border-indigo-400 focus:ring-0 outline-none font-bold text-lg text-slate-700 bg-white placeholder-slate-400 transition-colors" placeholder="Glosan (t.ex. Cat)" /></div>
        <div className="flex-1"><input type="text" value={translation} onChange={(e) => setTranslation(e.target.value)} className="w-full p-4 rounded-2xl border-4 border-white shadow-sm focus:border-indigo-400 focus:ring-0 outline-none font-bold text-lg text-slate-700 bg-white placeholder-slate-400 transition-colors" placeholder="Svenska (t.ex. Katt)" /></div>
        <div className="flex items-end"><button type="submit" className="w-full sm:w-auto h-full bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-4 rounded-2xl border-b-[6px] border-indigo-700 active:border-b-0 active:translate-y-[6px] transition-all font-black text-lg flex justify-center items-center gap-2"><PlusCircle size={24} /> <span className="sm:hidden">Lägg till</span></button></div>
      </form>
      <div className="space-y-4">
        {words.length === 0 ? <div className="text-center py-12 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200 text-slate-400 font-bold text-xl">Inga glosor än! Börja skriva ovan. 👆</div> : words.map((word, index) => (
          <div key={word.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 bg-white border-4 border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50 transition-all gap-4">
            <div className="flex gap-3 sm:gap-6 items-center w-full">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black shrink-0">{index + 1}</div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 flex-1">
                <span className="font-black text-xl text-slate-700 w-full sm:w-1/3 truncate">{word.term}</span>
                <button onClick={() => playAudio(word.term, ttsLanguage)} className="bg-indigo-50 p-2 rounded-xl text-indigo-500 hover:bg-indigo-500 hover:text-white transition-colors shrink-0 self-start sm:self-auto"><Volume2 size={20} /></button>
                <span className="text-slate-300 hidden sm:block">➔</span>
                <span className="font-bold text-lg text-slate-500 flex-1 break-all">{word.translation}</span>
              </div>
            </div>
            <button onClick={() => setWords(words.filter(w => w.id !== word.id))} className="bg-red-50 p-3 rounded-xl text-red-500 hover:bg-red-500 hover:text-white border-b-4 border-red-200 hover:border-red-700 active:border-b-0 active:translate-y-[4px] transition-all shrink-0 self-end sm:self-auto"><X size={24} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShareSaveView({ words, setWords, ttsLanguage, setTtsLanguage }) {
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef(null);
  const generateShareLink = () => {
    if (words.length === 0) return alert("Du måste ha några glosor i listan innan du kan dela den.");
    const payload = { words, lang: ttsLanguage };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payload));
    const baseUrl = window.location.origin + window.location.pathname;
    const finalUrl = `${baseUrl}?list=${compressed}`;
    navigator.clipboard.writeText(finalUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 3000); }).catch(() => prompt("Kopiera denna länk:", finalUrl));
  };
  const downloadJSON = () => {
    if (words.length === 0) return alert("Listan är tom.");
    const payload = { words, lang: ttsLanguage };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr); dlAnchorElem.setAttribute("download", "min_gloslista.json"); dlAnchorElem.click();
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target.result);
        if (result.words && Array.isArray(result.words)) { setWords(result.words); if (result.lang) setTtsLanguage(result.lang); alert("Gloslistan laddades in!"); }
      } catch (error) { alert("Kunde inte läsa filen."); }
    };
    reader.readAsText(file); e.target.value = '';
  };
  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 sm:p-10 rounded-[2.5rem] shadow-xl text-white border-b-[8px] border-indigo-800">
        <div className="flex items-center gap-4 mb-6"><div className="p-4 bg-white/20 rounded-2xl"><LinkIcon size={40} /></div><h3 className="text-3xl font-black tracking-tight">Dela listan</h3></div>
        <p className="text-indigo-100 font-medium mb-10 text-lg leading-relaxed">Skapa en magisk länk. Eleverna klickar på länken och börjar spela direkt — ingen inloggning krävs!</p>
        <button onClick={generateShareLink} className={`w-full font-black py-6 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all border-b-[6px] active:border-b-0 active:translate-y-[6px] ${copied ? 'bg-green-400 text-white border-green-600' : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}`}>{copied ? <Check size={28} /> : <Copy size={28} />}{copied ? "Länken är kopierad!" : "Skapa & Kopiera Länk"}</button>
      </div>
      <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border-4 border-white">
        <div className="flex items-center gap-4 mb-6"><div className="p-4 bg-slate-100 text-slate-500 rounded-2xl"><Download size={40} /></div><h3 className="text-3xl font-black text-slate-800 tracking-tight">Exportera & Spara</h3></div>
        <p className="text-slate-500 font-medium mb-8 text-lg leading-relaxed">Spara en backup på datorn, öppna en gammal lista, eller skriv ut glosorna på papper.</p>
        <div className="flex flex-col gap-4">
          <button onClick={() => window.print()} className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-b-4 border-indigo-200 font-bold py-5 rounded-2xl transition-all active:border-b-0 active:translate-y-[4px] flex items-center justify-center gap-3 text-lg"><Printer size={24} /> Skriv ut gloslista</button>
          <button onClick={downloadJSON} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-b-4 border-slate-300 font-bold py-5 rounded-2xl transition-all active:border-b-0 active:translate-y-[4px] flex items-center justify-center gap-3 text-lg"><Download size={24} /> Ladda ner fil (.json)</button>
          <button onClick={() => fileInputRef.current?.click()} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border-b-4 border-slate-300 font-bold py-5 rounded-2xl transition-all active:border-b-0 active:translate-y-[4px] flex items-center justify-center gap-3 text-lg"><Upload size={24} /> Öppna fil från datorn</button>
          <input type="file" accept=".json" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
        </div>
      </div>
    </div>
  );
}

// --- SPEL-MODULER (SAMMA SOM TIDIGARE) ---
function Flashcards({ words, onBack, ttsLanguage, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  if (words.length === 0) return <EmptyState onBack={onBack} />;
  const handleNext = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex((prev) => (prev + 1) % words.length), 150); };
  const handlePrev = () => { setIsFlipped(false); setTimeout(() => setCurrentIndex((prev) => (prev - 1 + words.length) % words.length), 150); };
  const sides = getCardSides(words[currentIndex], direction);
  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center">
      <div className="w-full"><GameHeader current={currentIndex + 1} total={words.length} onBack={onBack} /></div>
      <div className="w-full h-[24rem] perspective-1000 cursor-pointer mb-10 transition-transform duration-300 hover:-translate-y-2" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`w-full h-full relative preserve-3d transition-transform duration-500 ease-out ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute w-full h-full backface-hidden bg-white border-8 border-blue-50 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10">
            <h2 className="text-6xl font-black text-slate-800 text-center mb-8">{sides.front}</h2>
            <button onClick={(e) => { e.stopPropagation(); playAudio(sides.front, sides.isFrontForeign ? ttsLanguage : 'sv-SE'); }} className="bg-blue-100 p-5 rounded-full text-blue-600 hover:bg-blue-500 hover:text-white transition-colors shadow-sm"><Volume2 size={32} /></button>
            <span className="absolute bottom-6 text-slate-400 font-bold uppercase tracking-widest text-sm">Klicka för att vända</span>
          </div>
          <div className="absolute w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-10 rotate-y-180 border-8 border-blue-400 text-white">
            <h2 className="text-6xl font-black text-center mb-8">{sides.back}</h2>
            <button onClick={(e) => { e.stopPropagation(); playAudio(sides.back, sides.isBackForeign ? ttsLanguage : 'sv-SE'); }} className="bg-white/20 p-5 rounded-full text-white hover:bg-white/40 transition-colors shadow-sm"><Volume2 size={32} /></button>
          </div>
        </div>
      </div>
      <div className="flex gap-6 w-full max-w-sm justify-between"><button onClick={handlePrev} className="bg-white text-indigo-600 flex-1 flex justify-center p-5 rounded-2xl shadow-sm border-b-[6px] border-slate-200 hover:bg-slate-50 active:border-b-0 active:translate-y-[6px] transition-all"><ChevronLeft size={36} /></button><button onClick={handleNext} className="bg-indigo-500 text-white flex-1 flex justify-center p-5 rounded-2xl shadow-sm border-b-[6px] border-indigo-700 hover:bg-indigo-400 active:border-b-0 active:translate-y-[6px] transition-all"><ChevronRight size={36} /></button></div>
    </div>
  );
}

function QuizMode({ words, onBack, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  if (words.length < 4) return <EmptyState onBack={onBack} message="Du behöver minst 4 glosor för att spela quizet." />;
  useEffect(() => {
    if (isFinished) return;
    const currentWord = words[currentIndex];
    const shuffledOthers = [...words].filter(w => w.id !== currentWord.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([currentWord, ...shuffledOthers].sort(() => 0.5 - Math.random()));
    setSelectedAnswer(null);
  }, [currentIndex, words, isFinished]);
  const handleSelect = (option) => {
    if (selectedAnswer) return;
    const isCorrect = option.id === words[currentIndex].id;
    setSelectedAnswer({ optionId: option.id, isCorrect });
    if (isCorrect) setScore(s => s + 1);
    setTimeout(() => { if (currentIndex + 1 < words.length) setCurrentIndex(c => c + 1); else setIsFinished(true); }, 1500);
  };
  if (isFinished) return <ScoreScreen score={score} total={words.length} onBack={onBack} bg="from-purple-500 to-indigo-500" />;
  const sides = getCardSides(words[currentIndex], direction);
  return (
    <div className="max-w-3xl mx-auto">
      <GameHeader current={currentIndex + 1} total={words.length} score={score} onBack={onBack} />
      <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-purple-100/50 border-4 border-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 h-3 bg-slate-100 w-full"><div className="h-full bg-purple-500 transition-all duration-500 rounded-r-full" style={{ width: `${(currentIndex / words.length) * 100}%` }}></div></div>
        <div className="bg-purple-50 py-10 rounded-[2rem] border-4 border-purple-100 mb-10 mt-4"><p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-2">Vad betyder</p><h2 className="text-5xl sm:text-6xl font-black text-purple-900">{sides.front}</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {options.map(option => {
            const optSide = getCardSides(option, direction);
            let btnClass = "p-6 rounded-[2rem] text-2xl font-black transition-all border-b-[8px] active:border-b-0 active:translate-y-[8px] ";
            if (!selectedAnswer) btnClass += "bg-white text-slate-700 border-2 border-slate-200 border-b-slate-300 hover:border-purple-300 hover:border-b-purple-400 hover:bg-purple-50";
            else if (option.id === words[currentIndex].id) btnClass += "bg-green-500 text-white border-green-700 border-b-[2px] translate-y-[6px]"; 
            else if (selectedAnswer.optionId === option.id) btnClass += "bg-red-500 text-white border-red-700 border-b-[2px] translate-y-[6px]"; 
            else btnClass += "bg-slate-100 text-slate-400 border-slate-200 border-b-[2px] opacity-50";
            return <button key={option.id} onClick={() => handleSelect(option)} className={btnClass} disabled={!!selectedAnswer}>{optSide.back}</button>;
          })}
        </div>
      </div>
    </div>
  );
}

function TypingMode({ words, onBack, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  if (words.length === 0) return <EmptyState onBack={onBack} />;
  const sides = getCardSides(words[currentIndex], direction);
  const handleSubmit = (e) => {
    e.preventDefault(); if (feedback || !input.trim()) return;
    const isCorrect = input.trim().toLowerCase() === sides.back.trim().toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) setScore(s => s + 1);
    setTimeout(() => { setFeedback(null); setInput(''); if (currentIndex + 1 < words.length) setCurrentIndex(c => c + 1); else setIsFinished(true); }, 2000);
  };
  if (isFinished) return <ScoreScreen score={score} total={words.length} onBack={onBack} bg="from-orange-500 to-red-500" />;
  return (
    <div className="max-w-2xl mx-auto">
      <GameHeader current={currentIndex + 1} total={words.length} score={score} onBack={onBack} />
      <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-orange-100/50 border-4 border-white text-center">
        <p className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-4">Skriv översättningen för</p>
        <div className="py-12 bg-orange-50 rounded-[2rem] border-4 border-orange-100 mb-10"><h2 className="text-5xl sm:text-6xl font-black text-orange-900">{sides.front}</h2></div>
        <form onSubmit={handleSubmit} className="relative mt-8">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={feedback !== null} placeholder="Klicka och skriv..." autoFocus className={`w-full text-center text-3xl font-bold p-6 rounded-[2rem] border-[6px] outline-none transition-colors shadow-inner ${feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-800' : feedback === 'incorrect' ? 'border-red-500 bg-red-50 text-red-800' : 'border-slate-200 focus:border-orange-400 bg-slate-50'}`} />
          {!feedback ? <button type="submit" className="mt-8 w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-5 rounded-2xl shadow-sm border-b-[8px] border-orange-700 active:border-b-0 active:translate-y-[8px] transition-all text-2xl uppercase tracking-wider">Rätta</button> : <div className={`mt-8 p-6 rounded-[2rem] text-2xl font-black border-4 animate-in zoom-in ${feedback === 'correct' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{feedback === 'correct' ? 'Snyggt!' : `Rätt svar: ${sides.back}`}</div>}
        </form>
      </div>
    </div>
  );
}

function ListenTypeMode({ words, onBack, ttsLanguage, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  if (words.length === 0) return <EmptyState onBack={onBack} />;
  const sides = getCardSides(words[currentIndex], direction);
  const handleSubmit = (e) => {
    e.preventDefault(); if (feedback || !input.trim()) return;
    const isCorrect = input.trim().toLowerCase() === sides.back.trim().toLowerCase();
    setFeedback(isCorrect ? 'correct' : 'incorrect'); if (isCorrect) setScore(s => s + 1);
    setTimeout(() => { setFeedback(null); setInput(''); if (currentIndex + 1 < words.length) setCurrentIndex(c => c + 1); else setIsFinished(true); }, 2000);
  };
  if (isFinished) return <ScoreScreen score={score} total={words.length} onBack={onBack} bg="from-cyan-400 to-blue-500" />;
  return (
    <div className="max-w-2xl mx-auto">
      <GameHeader current={currentIndex + 1} total={words.length} score={score} onBack={onBack} />
      <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-cyan-100/50 border-4 border-white text-center">
        <div className="mb-10 mt-4"><button onClick={() => playAudio(sides.front, sides.isFrontForeign ? ttsLanguage : 'sv-SE')} className="w-40 h-40 mx-auto bg-cyan-500 hover:bg-cyan-400 text-white rounded-full flex items-center justify-center shadow-lg border-b-[8px] border-cyan-700 active:border-b-0 active:translate-y-[8px] transition-all group"><Volume2 size={80} className="group-hover:scale-110 transition-transform" /></button><p className="mt-8 text-cyan-600 font-black uppercase tracking-widest text-lg">Klicka för att lyssna</p></div>
        <form onSubmit={handleSubmit} className="relative mt-8">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={feedback !== null} placeholder="Vad hörde du?" autoFocus className={`w-full text-center text-3xl font-bold p-6 rounded-[2rem] border-[6px] outline-none transition-colors shadow-inner ${feedback === 'correct' ? 'border-green-500 bg-green-50 text-green-800' : feedback === 'incorrect' ? 'border-red-500 bg-red-50 text-red-800' : 'border-slate-200 focus:border-cyan-400 bg-slate-50'}`} />
          {!feedback ? <button type="submit" className="mt-8 w-full bg-cyan-500 hover:bg-cyan-400 text-white font-black py-5 rounded-2xl shadow-sm border-b-[8px] border-cyan-700 active:border-b-0 active:translate-y-[8px] transition-all text-2xl uppercase tracking-wider">Rätta</button> : <div className={`mt-8 p-6 rounded-[2rem] text-2xl font-black border-4 animate-in zoom-in ${feedback === 'correct' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{feedback === 'correct' ? 'Perfekt!' : `Nästan! Ordet var: ${sides.back}`}</div>}
        </form>
      </div>
    </div>
  );
}

function SpeakMode({ words, onBack, ttsLanguage, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [transcript, setTranscript] = useState('');
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return <EmptyState onBack={onBack} message="Din webbläsare stöder tyvärr inte taligenkänning. Försök med Chrome/Edge." />;
  if (words.length === 0) return <EmptyState onBack={onBack} />;
  const sides = getCardSides(words[currentIndex], direction);
  const startListening = () => {
    if (isListening || feedback) return;
    const recognition = new SpeechRecognition();
    recognition.lang = sides.isBackForeign ? ttsLanguage : 'sv-SE';
    recognition.onstart = () => { setIsListening(true); setTranscript(''); };
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      const ok = speechResult.toLowerCase().replace(/[.,!?¿¡]/g, "").trim() === sides.back.toLowerCase().replace(/[.,!?¿¡]/g, "").trim();
      setFeedback(ok ? 'correct' : 'incorrect'); if (ok) setScore(s => s + 1);
      setTimeout(() => { setFeedback(null); setTranscript(''); if (currentIndex + 1 < words.length) setCurrentIndex(c => c + 1); else setIsFinished(true); }, 3000);
    };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };
  if (isFinished) return <ScoreScreen score={score} total={words.length} onBack={onBack} bg="from-lime-400 to-green-500" />;
  return (
    <div className="max-w-2xl mx-auto">
      <GameHeader current={currentIndex + 1} total={words.length} score={score} onBack={onBack} />
      <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-lime-100/50 border-4 border-white text-center">
        <p className="text-lime-600 font-bold uppercase tracking-widest text-sm mb-4">Säg översättningen högt</p>
        <div className="py-12 bg-lime-50 rounded-[2rem] border-4 border-lime-100 mb-10"><h2 className="text-5xl sm:text-6xl font-black text-lime-900">{sides.front}</h2></div>
        <div className="flex flex-col items-center justify-center min-h-[180px]">
          {feedback ? <div className={`p-8 rounded-[2rem] w-full text-2xl font-black border-4 animate-in zoom-in ${feedback === 'correct' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}><p className="text-lg font-bold opacity-70 mb-2 uppercase tracking-wider">Datorn hörde: "{transcript}"</p>{feedback === 'correct' ? 'Perfekt uttal!' : `Rätt svar är: ${sides.back}`}</div> : <><button onClick={startListening} disabled={isListening} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 scale-125 animate-pulse text-white shadow-[0_0_40px_rgba(239,68,68,0.5)] border-4 border-red-300' : 'bg-lime-500 hover:bg-lime-400 border-b-[8px] border-lime-700 active:border-b-0 active:translate-y-[8px] text-white'}`}><Mic size={56} className={isListening ? 'animate-bounce' : ''} /></button><p className={`mt-8 font-black uppercase tracking-widest text-xl ${isListening ? 'text-red-500' : 'text-slate-400'}`}>{isListening ? "Prata nu!" : "Klicka på micken"}</p></>}
        </div>
      </div>
    </div>
  );
}

function ScrambleMode({ words, onBack, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrambled, setScrambled] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState(null);
  if (words.length === 0) return <EmptyState onBack={onBack} />;
  const sides = getCardSides(words[currentIndex], direction);
  useEffect(() => {
    if (!isFinished && words.length > 0) {
      const chars = sides.back.replace(/\s+/g, '').toUpperCase().split('');
      setScrambled(chars.map((char, i) => ({ char, id: i })).sort(() => 0.5 - Math.random()));
      setSelected([]); setFeedback(null);
    }
  }, [currentIndex, words, isFinished, direction]);
  const handleSelect = (item) => { if (feedback) return; setScrambled(scrambled.filter(l => l.id !== item.id)); setSelected([...selected, item]); };
  const handleDeselect = (item) => { if (feedback) return; setSelected(selected.filter(l => l.id !== item.id)); setScrambled([...scrambled, item]); };
  const checkAnswer = () => {
    const answer = selected.map(s => s.char).join('');
    const correct = sides.back.replace(/\s+/g, '').toUpperCase();
    if (answer === correct) { setFeedback('correct'); setScore(s => s + 1); } else setFeedback('incorrect');
    setTimeout(() => { if (currentIndex + 1 < words.length) setCurrentIndex(c => c + 1); else setIsFinished(true); }, 1500);
  };
  if (isFinished) return <ScoreScreen score={score} total={words.length} onBack={onBack} bg="from-teal-400 to-emerald-500" />;
  return (
    <div className="max-w-3xl mx-auto text-center">
      <GameHeader current={currentIndex + 1} total={words.length} score={score} onBack={onBack} />
      <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-teal-100/50 border-4 border-white">
        <p className="text-teal-600 font-bold uppercase tracking-widest text-sm mb-4">Bygg ordet för</p><h2 className="text-5xl font-black text-slate-800 mb-10">{sides.front}</h2>
        <div className="flex flex-wrap justify-center gap-3 mb-10 min-h-[5rem] p-6 bg-slate-50 rounded-[2rem] border-4 border-dashed border-slate-200">{selected.map(item => <button key={item.id} onClick={() => handleDeselect(item)} className="w-16 h-16 flex items-center justify-center bg-teal-500 text-white font-black text-3xl rounded-2xl border-b-[6px] border-teal-700 active:border-b-0 active:translate-y-[6px] transition-all">{item.char}</button>)}</div>
        <div className="flex flex-wrap justify-center gap-3 mb-10">{scrambled.map(item => <button key={item.id} onClick={() => handleSelect(item)} className="w-16 h-16 flex items-center justify-center bg-white text-slate-700 font-black text-3xl rounded-2xl border-2 border-slate-200 border-b-[6px] border-b-slate-300 hover:bg-teal-50 hover:border-teal-200 hover:border-b-teal-300 active:border-b-[2px] active:translate-y-[4px] transition-all">{item.char}</button>)}</div>
        {scrambled.length === 0 && !feedback && <button onClick={checkAnswer} className="w-full bg-teal-500 hover:bg-teal-400 text-white font-black py-5 rounded-2xl shadow-sm border-b-[8px] border-teal-700 active:border-b-0 active:translate-y-[8px] transition-all text-2xl uppercase tracking-wider animate-in zoom-in">Rätta</button>}
        {feedback && <div className={`p-6 rounded-[2rem] text-2xl font-black border-4 animate-in zoom-in ${feedback === 'correct' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{feedback === 'correct' ? 'Helt rätt!' : `Fel! Rätt svar är: ${sides.back}`}</div>}
      </div>
    </div>
  );
}

function HangmanMode({ words, onBack, direction }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guessed, setGuessed] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wordStatus, setWordStatus] = useState(null); 
  if (words.length === 0) return <EmptyState onBack={onBack} />;
  const maxMistakes = 6; const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ".split("");
  const sides = getCardSides(words[currentIndex], direction); const targetWord = sides.back.toUpperCase();
  const handleGuess = (letter) => {
    if (wordStatus || guessed.includes(letter)) return;
    const newGuessed = [...guessed, letter]; setGuessed(newGuessed);
    if (!targetWord.includes(letter)) { if (mistakes + 1 >= maxMistakes) { setWordStatus('lost'); setTimeout(nextWord, 3000); } setMistakes(m => m + 1); }
    else { if (targetWord.split('').every(char => char === ' ' || newGuessed.includes(char))) { setWordStatus('won'); setScore(s => s + 1); setTimeout(nextWord, 3000); } }
  };
  const nextWord = () => { if (currentIndex + 1 < words.length) { setCurrentIndex(c => c + 1); setGuessed([]); setMistakes(0); setWordStatus(null); } else setIsFinished(true); };
  if (isFinished) return <ScoreScreen score={score} total={words.length} onBack={onBack} bg="from-red-500 to-pink-600" />;
  return (
    <div className="max-w-3xl mx-auto text-center">
      <GameHeader current={currentIndex + 1} total={words.length} score={score} onBack={onBack} />
      <div className="bg-white p-8 sm:p-12 rounded-[3rem] shadow-xl shadow-red-100/50 border-4 border-white">
         <div className="flex justify-between items-center mb-8 bg-red-50 p-4 rounded-2xl border-4 border-red-100"><span className="text-red-500 font-bold uppercase tracking-widest text-sm">Gissa ordet för</span><span className="bg-white text-red-600 px-4 py-2 rounded-xl font-black shadow-sm">Försök kvar: {maxMistakes - mistakes}</span></div>
         <h2 className="text-4xl sm:text-5xl font-black text-slate-800 mb-10">{sides.front}</h2>
         <div className="flex justify-center gap-3 sm:gap-4 mb-12 flex-wrap">{targetWord.split('').map((char, i) => char === ' ' ? <div key={i} className="w-6 sm:w-10"></div> : <div key={i} className={`w-12 h-16 sm:w-16 sm:h-20 flex items-center justify-center text-4xl font-black rounded-2xl border-b-8 ${guessed.includes(char) || wordStatus === 'lost' ? 'border-slate-300 text-slate-800 bg-slate-100' : 'border-slate-200 text-transparent bg-slate-50'}`}>{guessed.includes(char) || wordStatus === 'lost' ? char : '_'}</div>)}</div>
         <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">{alphabet.map(letter => {
           const isGuessed = guessed.includes(letter);
           let btnClass = "w-12 h-14 sm:w-14 sm:h-16 flex justify-center items-center rounded-2xl font-black text-xl transition-all border-b-[6px] ";
           if (isGuessed && targetWord.includes(letter)) btnClass += "bg-green-500 text-white border-green-700 active:border-b-[6px] translate-y-[6px] border-b-0"; 
           else if (isGuessed) btnClass += "bg-slate-200 text-slate-400 border-slate-300 opacity-50 border-b-0 translate-y-[6px]"; 
           else btnClass += "bg-white text-slate-700 border-2 border-slate-200 border-b-slate-300 hover:bg-slate-50 active:border-b-0 active:translate-y-[6px]"; 
           return <button key={letter} disabled={isGuessed || wordStatus !== null} onClick={() => handleGuess(letter)} className={btnClass}>{letter}</button>;
         })}</div>
         {wordStatus && <div className={`mt-8 p-6 rounded-[2rem] text-2xl font-black border-4 animate-in zoom-in ${wordStatus === 'won' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>{wordStatus === 'won' ? 'Puh, snyggt räddat!' : 'Ajdå, gubben hängdes!'}</div>}
      </div>
    </div>
  );
}

function MatchingMode({ words, onBack }) {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  if (words.length < 2) return <EmptyState onBack={onBack} message="Du behöver minst 2 glosor." />;
  useEffect(() => {
    const gameWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 6);
    let generatedCards = [];
    gameWords.forEach(word => { generatedCards.push({ id: `${word.id}-term`, text: word.term, wordId: word.id, type: 'term' }); generatedCards.push({ id: `${word.id}-trans`, text: word.translation, wordId: word.id, type: 'trans' }); });
    setCards(generatedCards.sort(() => 0.5 - Math.random()));
  }, [words]);
  const handleCardClick = (card) => {
    if (matchedPairs.includes(card.wordId) || selectedCards.some(c => c.id === card.id) || selectedCards.length === 2) return;
    const newSelected = [...selectedCards, card]; setSelectedCards(newSelected);
    if (newSelected.length === 2) {
      if (newSelected[0].wordId === newSelected[1].wordId && newSelected[0].type !== newSelected[1].type) {
        setTimeout(() => { setMatchedPairs(prev => { const updated = [...prev, newSelected[0].wordId]; if (updated.length === cards.length / 2) setIsFinished(true); return updated; }); setSelectedCards([]); }, 500);
      } else setTimeout(() => setSelectedCards([]), 1000);
    }
  };
  if (isFinished) return <ScoreScreen score={cards.length / 2} total={cards.length / 2} onBack={onBack} bg="from-pink-400 to-rose-500" title="Briljant!" />;
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4"><button onClick={onBack} className="flex items-center gap-2 bg-white text-slate-600 font-bold px-5 py-3 rounded-2xl shadow-sm border-b-4 border-slate-200 hover:bg-slate-50 active:border-b-0 active:translate-y-[4px] transition-all"><ChevronLeft size={24} /> Meny</button><div className="bg-pink-100 text-pink-700 font-black px-6 py-3 rounded-2xl border-4 border-pink-200 shadow-sm">Hittade par: {matchedPairs.length} / {cards.length / 2}</div></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">{cards.map(card => {
        const isMatched = matchedPairs.includes(card.wordId); const isSelected = selectedCards.some(c => c.id === card.id);
        let btnClasses = "h-32 sm:h-40 p-4 rounded-[2rem] flex items-center justify-center text-xl sm:text-2xl font-black transition-all border-b-[8px] ";
        if (isMatched) btnClasses += "bg-slate-100 border-slate-200 text-slate-300 opacity-0 cursor-default transform scale-90"; 
        else if (isSelected) btnClasses += "bg-pink-500 border-pink-700 text-white translate-y-[4px] border-b-[4px]"; 
        else btnClasses += "bg-white text-slate-700 border-2 border-slate-200 border-b-slate-300 hover:border-pink-300 hover:border-b-pink-400 active:border-b-0 active:translate-y-[8px]"; 
        return <button key={card.id} onClick={() => handleCardClick(card)} className={btnClasses} disabled={isMatched} style={{visibility: isMatched ? 'hidden' : 'visible'}}>{card.text}</button>;
      })}</div>
    </div>
  );
}