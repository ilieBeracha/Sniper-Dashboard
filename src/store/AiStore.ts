import { create } from "zustand";
import { type Message } from "ai";
import { askAssistant } from "@/services/embeddingService";

interface AiStore {
  isLoading: boolean;
  isError: boolean;
  aiResponse: string;
  chatMessages: Message[];
  userFullProfile: any;

  setIsLoading: (loading: boolean) => void;
  setIsError: (error: boolean) => void;
  setAiResponse: (response: string) => void;
  setChatMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  resetChat: () => void;
  generateAnswer: (prompt: string) => Promise<string>;
}

export const useAiStore = create<AiStore>((set, get) => ({
  isLoading: false,
  isError: false,
  aiResponse: "",
  chatMessages: [],
  userFullProfile: null,

  setIsLoading: (isLoading) => set({ isLoading }),
  setIsError: (isError) => set({ isError }),
  setAiResponse: (aiResponse) => set({ aiResponse }),
  setChatMessages: (chatMessages) => set({ chatMessages }),
  addMessage: (message) => set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  clearMessages: () => set({ chatMessages: [] }),
  resetChat: () => set({ chatMessages: [], aiResponse: "", isLoading: false, isError: false }),

  generateAnswer: async (prompt: string): Promise<string> => {
    const { chatMessages } = get();

    console.log(chatMessages);

    const messages: Message[] = [...chatMessages, { id: `user-${Date.now()}`, role: "user", content: prompt }];

    console.log(messages);
    set({ isLoading: true, isError: false, chatMessages: messages });
    
    try {
      const text = await askAssistant(prompt);
      console.log(text);
      
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: text || "",
      };
      console.log(aiMessage);

      set({
        aiResponse: text || "",
        chatMessages: [...messages, aiMessage],
        isLoading: false,
      });

      return text || "";
    } catch (err) {
      console.error("Error generating text:", err);
      set({
        isError: true,
        isLoading: false,
        aiResponse: "⚠️ Error generating response.",
      });
      throw err;
    }
  },
}));
