import { Injectable, inject, signal, computed} from "@angular/core";
import { Router } from "@angular/router";
import { SupabaseService } from "./supabase";
import { User } from "../models/user";

@Injectable({ providedIn: 'root' })

export class AuthService {
    private supabase = inject(SupabaseService);
    private route = inject(Router);

    user = signal<User | null>(null);
    isAuthenticated = computed(() => this.user() !== null);
    userEmail = computed(() => this.user()?.email ?? 'Invitado');

    constructor() {
        this.checkSession();
    }

    async checkSession() {
        const { data: { user } } = await this.supabase.getClient().auth.getUser();
        if (user) {
            this.user.set({
                id: user.id,
                email: user.email ?? '',
            });
        }
    }

    async login(email: string, password: string): Promise<boolean> {
        const { data, error } = await this.supabase.getClient().auth.signInWithPassword({
            email,
            password
        });

        if (error) {return false}

        if (data.user && data.user.email) {
            this.user.set({
                id: data.user.id,
                email: data.user.email,
            });
            return true;
        }

        return false;
    }

    async logout() {
        await this.supabase.getClient().auth.signOut();
        this.user.set(null);
        this.route.navigate(['/login']);
    }

    async register(newUser: User, password: string): Promise<void> {
        
        const { data, error} = await this.supabase.getClient().auth.signUp({
            email: newUser.email,
            password
        });

        if (error) {
            if (error.status === 422 && error.message.includes('User already registered')){
                throw new Error('Email ya registrado');
            }
        }

        const uid = data.user?.id;

        if (!uid){
            throw new Error('Error al registrar usuario')
        };

        const { id, ...rest } = newUser as any;
        const payload = { uid, ...rest };

        const { error: insertError } = await this.supabase.getClient().from('dataUsers').insert(payload);

        if (insertError) {
            console.log('Insert error:', insertError);
            throw new Error('Error al registrar usuario')
        }

        this.user.set({ id: uid, email: newUser.email ?? '' });

    }
}