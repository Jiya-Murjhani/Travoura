import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ItineraryRequest, 
  SavedItinerary, 
  ChatMessage 
} from "../types/itinerary";
import { 
  generateItinerary, 
  refineItinerary, 
  getMyItineraries 
} from "../services/itinerary";

export const useGetMyItineraries = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["myItineraries", user?.id],
    queryFn: () => getMyItineraries(),
    enabled: !!user?.id,
  });
};

export default function useItinerary() {
  const [itinerary, setItinerary] = useState<SavedItinerary | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async (request: ItineraryRequest) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateItinerary(request);
      setItinerary(result);
      setChatHistory([]);
      toast.success("Itinerary generated successfully!");
    } catch (err: any) {
      console.error("Generate Itinerary Error:", err);
      const errorMessage = err.message || "Failed to generate itinerary";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const refine = async (message: string) => {
    if (!itinerary) {
      toast.error("No itinerary is currently active to refine.");
      return;
    }

    setIsRefining(true);
    setError(null);
    
    const userMessage: ChatMessage = { role: "user", message };
    const previousChatHistory = [...chatHistory];
    const updatedChatHistory = [...previousChatHistory, userMessage];
    
    // Optimistically update chat to show user message
    setChatHistory(updatedChatHistory);

    try {
      const updatedResponse = await refineItinerary({
        itinerary_id: itinerary.id,
        user_message: message,
        conversation_history: previousChatHistory
      });
      
      const assistantMessage: ChatMessage = { 
        role: "assistant", 
        message: "Your itinerary has been automatically updated with the refinements!" 
      }; 
      
      setChatHistory([...updatedChatHistory, assistantMessage]);

      setItinerary({
        ...itinerary,
        ...updatedResponse,
      });

      toast.success("Itinerary refined successfully!");
    } catch (err: any) {
      console.error("Refine Itinerary Error:", err);
      const errorMessage = err.message || "Failed to refine itinerary";
      setError(errorMessage);
      toast.error(errorMessage);
      
      // Rollback optimistic update
      setChatHistory(previousChatHistory);
    } finally {
      setIsRefining(false);
    }
  };

  const reset = () => {
    setItinerary(null);
    setChatHistory([]);
    setError(null);
  };

  return {
    itinerary,
    chatHistory,
    isGenerating,
    isRefining,
    error,
    generate,
    refine,
    reset,
  };
}
