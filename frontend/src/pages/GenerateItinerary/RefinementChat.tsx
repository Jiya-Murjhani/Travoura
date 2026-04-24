import { useState, useRef, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Loader2, Bot } from "lucide-react";
import useItinerary from "@/hooks/useItinerary";

const SUGGESTIONS = [
  "Make Day 1 more relaxed",
  "Add more food experiences",
  "Replace Day 2 with outdoor activities",
  "Adjust for a tighter budget"
];

export default function RefinementChat({ open, onOpenChange }: { open: boolean, onOpenChange: (o: boolean) => void }) {
  const { chatHistory, isRefining, refine } = useItinerary();
  const [inputVal, setInputVal] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isRefining]);

  const handleSubmit = (msg: string) => {
    if (!msg.trim() || isRefining) return;
    setInputVal("");
    refine(msg.trim());
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white border-l border-gray-100 shadow-2xl">
        <SheetHeader className="p-4 border-b border-gray-100 bg-white/95 backdrop-blur z-10 sticky top-0 text-left">
          <SheetTitle className="flex items-center gap-2 text-gray-900 font-bold">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Refine Your Itinerary
          </SheetTitle>
          <SheetDescription className="text-gray-500 text-sm">
            Describe any changes and the AI will update your itinerary.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 p-4 bg-gray-50/50">
          <div className="flex flex-col space-y-4 pb-4">

            {/* Chat History */}
            {chatHistory.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-70">
                <Bot className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 max-w-[200px]">
                  Send a message below to tweak your travel plans instantly.
                </p>
              </div>
            )}

            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {msg.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1 pb-0.5">
                      <span className="text-[9px] font-black text-indigo-700 tracking-tighter">AI</span>
                    </div>
                  )}

                  <div className={`px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-indigo-600 text-white rounded-2xl rounded-tr-sm" 
                      : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-2xl rounded-tl-sm"
                  }`}>
                    {msg.message}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isRefining && (
              <div className="flex w-full justify-start animate-in fade-in duration-300">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1 pb-0.5">
                    <span className="text-[9px] font-black text-indigo-700 tracking-tighter">AI</span>
                  </div>
                  <div className="px-4 py-3 bg-white border border-gray-100 shadow-sm rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[44px]">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Action Bottom Area */}
        <div className="p-4 bg-white border-t border-gray-100 z-10 space-y-3">
          
          {/* Suggestions */}
          {chatHistory.length === 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 mask-fade-edges">
              {SUGGESTIONS.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(sug)}
                  disabled={isRefining}
                  className="whitespace-nowrap px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-full border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-colors disabled:opacity-50"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative flex items-center">
            <textarea
              rows={2}
              placeholder="E.g. Add more historical museums in Day 2"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={isRefining}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(inputVal);
                }
              }}
              className="w-full rounded-xl py-3 pl-4 pr-12 bg-gray-50 border border-gray-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-colors resize-none disabled:opacity-50"
            />
            <button
              onClick={() => handleSubmit(inputVal)}
              disabled={!inputVal.trim() || isRefining}
              className="absolute right-3 bottom-0 top-0 my-auto h-8 w-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
            >
              {isRefining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 ml-0.5" />}
            </button>
          </div>
          <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
             Press <kbd className="bg-gray-100 border border-gray-200 px-1 py-0.5 rounded text-[9px] font-sans">Enter</kbd> to send
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
