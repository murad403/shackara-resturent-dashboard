"use server";
import { cookies } from "next/headers"

export const saveToken = async (access: string, refresh: string): Promise<void> => {
  (await cookies()).set("access", access);
  (await cookies()).set("refresh", refresh);
}

export const getCurrentUser = async (): Promise<{ access: string | undefined, refresh: string | undefined }> => {
  const access = (await cookies()).get("access")?.value;
  const refresh = (await cookies()).get("refresh")?.value;
  return { access, refresh };
};

export const removeToken = async () => {
  (await cookies()).delete("access");
  (await cookies()).delete("refresh");
}