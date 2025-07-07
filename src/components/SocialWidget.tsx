
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Script from 'next/script';
import { Rss } from 'lucide-react';

export function SocialWidget() {
    return (
        <Card className="shadow-lg overflow-hidden w-full">
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Rss className="h-6 w-6 text-primary mr-3" />
                    Seguinos en Redes
                </CardTitle>
                <CardDescription>
                    Mantenete al tanto de nuestras actualizaciones y participá de la conversación.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Script 
                    src="https://static.elfsight.com/platform/platform.js" 
                    strategy="lazyOnload" 
                    data-elfsight-app-lazy-init 
                />
                <div 
                    className="elfsight-app-c225f74d-3f36-42ac-a5c1-2bb07fed927d" 
                    data-elfsight-app-lazy
                />
            </CardContent>
        </Card>
    );
}
