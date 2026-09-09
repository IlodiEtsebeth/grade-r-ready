import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ChecklistStatus } from "./content";

export type Child = {
  id: string;
  name: string;
  age: number | null;
  school: string | null;
  created_at: string;
};

export type ChecklistRow = {
  item_id: string;
  status: ChecklistStatus;
  note: string | null;
  photo_path: string | null;
  updated_at: string;
};

export type ActivityRow = {
  activity_id: string;
  done: boolean;
  note: string | null;
  photo_path: string | null;
  updated_at: string;
};

async function requireUserId() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) throw new Error("Not signed in");
  return data.user.id;
}

export function useChild() {
  return useQuery({
    queryKey: ["child"],
    queryFn: async (): Promise<Child | null> => {
      const { data, error } = await supabase
        .from("children")
        .select("id,name,age,school,created_at")
        .order("created_at", { ascending: true })
        .limit(1);
      if (error) throw error;
      return (data?.[0] as Child) ?? null;
    },
  });
}

export function useSaveChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id?: string; name: string; age: number; school: string }) => {
      const parent_id = await requireUserId();
      if (input.id) {
        const { error } = await supabase
          .from("children")
          .update({ name: input.name, age: input.age, school: input.school })
          .eq("id", input.id);
        if (error) throw error;
        return input.id;
      }
      const { data, error } = await supabase
        .from("children")
        .insert({ parent_id, name: input.name, age: input.age, school: input.school })
        .select("id")
        .single();
      if (error) throw error;
      return data.id as string;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["child"] }),
  });
}

export function useChecklist(childId?: string) {
  return useQuery({
    queryKey: ["checklist", childId],
    enabled: !!childId,
    queryFn: async (): Promise<ChecklistRow[]> => {
      const { data, error } = await supabase
        .from("checklist_progress")
        .select("item_id,status,note,photo_path,updated_at")
        .eq("child_id", childId!);
      if (error) throw error;
      return (data ?? []) as ChecklistRow[];
    },
  });
}

export function useSaveChecklistItem(childId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      itemId: string;
      status?: ChecklistStatus;
      note?: string | null;
      photoPath?: string | null;
    }) => {
      const parent_id = await requireUserId();
      const payload = {
        child_id: childId!,
        parent_id,
        item_id: input.itemId,
        updated_at: new Date().toISOString(),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...(input.note !== undefined ? { note: input.note } : {}),
        ...(input.photoPath !== undefined ? { photo_path: input.photoPath } : {}),
      };
      const { error } = await supabase
        .from("checklist_progress")
        .upsert(payload, { onConflict: "child_id,item_id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["checklist", childId] }),
  });
}

export function useActivities(childId?: string) {
  return useQuery({
    queryKey: ["activities", childId],
    enabled: !!childId,
    queryFn: async (): Promise<ActivityRow[]> => {
      const { data, error } = await supabase
        .from("activity_progress")
        .select("activity_id,done,note,photo_path,updated_at")
        .eq("child_id", childId!);
      if (error) throw error;
      return (data ?? []) as ActivityRow[];
    },
  });
}

export function useSaveActivity(childId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      activityId: string;
      done?: boolean;
      note?: string | null;
      photoPath?: string | null;
    }) => {
      const parent_id = await requireUserId();
      const payload = {
        child_id: childId!,
        parent_id,
        activity_id: input.activityId,
        updated_at: new Date().toISOString(),
        ...(input.done !== undefined ? { done: input.done } : {}),
        ...(input.note !== undefined ? { note: input.note } : {}),
        ...(input.photoPath !== undefined ? { photo_path: input.photoPath } : {}),
      };
      const { error } = await supabase
        .from("activity_progress")
        .upsert(payload, { onConflict: "child_id,activity_id" });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["activities", childId] }),
  });
}

export async function uploadPhoto(file: File) {
  const userId = await requireUserId();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("activity-photos").upload(path, file);
  if (error) throw error;
  return path;
}

export async function photoUrl(path: string) {
  const { data } = await supabase.storage.from("activity-photos").createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}

/** Signed URL for a stored photo, re-fetched well before the 1 hour link expires. */
export function usePhotoUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: ["photo-url", path],
    enabled: !!path,
    queryFn: () => photoUrl(path!),
    staleTime: 1000 * 60 * 45,
  });
}
