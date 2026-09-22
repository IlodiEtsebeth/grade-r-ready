import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "./ui-strings";

const STORAGE_KEY = "grade-r-ready:lang";

function readStoredLang(): Lang {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "af" ? "af" : "en";
}

function writeStoredLang(lang: Lang) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, lang);
}

/** The signed-in parent's saved language preference, if any (null if signed out). */
function useProfileLanguage() {
  return useQuery({
    queryKey: ["profile-language"],
    queryFn: async (): Promise<Lang | null> => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("language")
        .eq("id", userData.user.id)
        .maybeSingle();
      if (error) throw error;
      return (data?.language as Lang) ?? "en";
    },
  });
}

function useSaveProfileLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lang: Lang) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return; // not signed in yet — nothing to persist server-side
      const { error } = await supabase
        .from("profiles")
        .update({ language: lang })
        .eq("id", userData.user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile-language"] }),
  });
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readStoredLang());
  const { data: profileLang } = useProfileLanguage();
  const saveProfileLang = useSaveProfileLanguage();

  // Once we know the signed-in parent's saved preference, it wins over
  // whatever was in localStorage (e.g. a different device, or a toggle
  // change made elsewhere).
  useEffect(() => {
    if (profileLang && profileLang !== lang) {
      setLangState(profileLang);
      writeStoredLang(profileLang);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileLang]);

  function setLang(next: Lang) {
    setLangState(next);
    writeStoredLang(next);
    saveProfileLang.mutate(next);
  }

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
