import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { AppEditorClient } from '@/components/admin/AppEditorClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function AppEditorPage({ params }: Props) {
    const { slug } = await params;
    const isNew = slug === 'new';
    
    let initialData = {
        name: '',
        slug: '',
        theme: { primary: '#3ecf8e', secondary: '#3ecf8e', accent: '#3ecf8e' },
        pages: { home: '', privacy_policy: '', data_deletion: '' }
    };

    if (!isNew) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('apps')
            .select('*')
            .eq('slug', slug)
            .single();
        
        if (error || !data) {
            notFound();
        }
        initialData = data;
    }

    return (
        <AppEditorClient initialData={initialData} isNew={isNew} />
    );
}
