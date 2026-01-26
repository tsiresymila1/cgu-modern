import { supabase } from './supabase';

export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AppPages {
  home: string;
  privacy_policy: string;
  data_deletion: string;
}

export interface AppConfig {
  id: string;
  name: string;
  slug: string;
  theme: Theme;
  pages: AppPages;
  redirect_url?: string;
}

export interface GlobalPages {
  home: string;
}

export async function getApps(): Promise<AppConfig[]> {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching apps:', error);
    return [];
  }
  
  return data as AppConfig[];
}

export async function getAppBySlug(slug: string): Promise<AppConfig | undefined> {
  const { data, error } = await supabase
    .from('apps')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) {
    console.error(`Error fetching app ${slug}:`, error);
    return undefined;
  }
  
  return data as AppConfig;
}

// Global home content will be dynamic later or keep it semi-static for now.
// For now, let's keep it static but we could add a 'settings' table.
export function getGlobalContent(): GlobalPages {
  return {
    home: "# Legal & Privacy Platform\n\nWelcome to the unified legal portal for our suite of applications. Here you can find Terms of Service, Privacy Policies, and Data Deletion instructions for all our products.\n\n## Our Commitment\nWe are committed to transparency, data minimization, and user control.\n\n### Contact Us\nFor general legal inquiries, please contact: **tsiresymila@gmail.com**"
  };
}
