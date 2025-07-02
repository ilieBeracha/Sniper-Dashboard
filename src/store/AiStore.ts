import { create } from "zustand";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText, type Message } from "ai";
import { f3cPrompt, getUserFullProfile } from "@/services/ai";
import { userStore } from "@/store/userStore";

const openai = createOpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY });

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
  fetchUserProfile: (user_id: string) => Promise<void>;
  initializeAi: (userFullProfile: string) => Promise<void>;
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

  fetchUserProfile: async (user_id) => {
    const { data, error } = await getUserFullProfile(user_id);
    if (error) throw error;

    set({ userFullProfile: data });

    await get().initializeAi(data); // ✅ must pass data into the prompt
  },

  initializeAi: async (userFullProfile: string) => {
    const systemMessage: Message = {
      id: `system-${Date.now()}`,
      role: "system",
      content:
        f3cPrompt +
        "\n\nF3C Records:\n" +
        userFullProfile +
        "\n\nUser: " +
        JSON.stringify(userStore.getState().user, null, 2) +
        "\n\nAnswer only using this data. and keep in mind that user is relevant to the conversation. he is the one who is asking the questions. and has a full training profile. with identifiers",
    };
    set({ chatMessages: [systemMessage] });
  },

  generateAnswer: async (prompt: string) => {
    const { chatMessages } = get();

    const messages: Message[] = [...chatMessages, { id: `user-${Date.now()}`, role: "user", content: prompt }];

    set({ isLoading: true, isError: false, chatMessages: messages });

    try {
      const { text } = await generateText({
        model: openai("gpt-3.5-turbo"),
        messages: messages.map(({ role, content }) => ({ role, content })),
      });

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: text,
      };

      set({
        aiResponse: text,
        chatMessages: [...messages, aiMessage],
        isLoading: false,
      });

      return text;
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
