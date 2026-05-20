import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { environment } from "../../enviroments/enviroment";

@Injectable({ providedIn: "root" })

export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const url = environment.supabaseUrl;
    const key = environment.supabaseKey;

    this.supabase = createClient(url, key);
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }
}