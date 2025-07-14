
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Construction } from 'lucide-react';

export default function PromocionaPage() {
  return (
    <Section id="work-in-progress" className="py-20 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <Briefcase className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">Promocioná tu Trabajo u Oficio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center text-muted-foreground bg-muted p-6 rounded-lg">
                <Construction className="mr-4 h-8 w-8" />
                <p className="font-body text-lg">
                    Estamos trabajando ansiosamente para que puedas disfrutar de esta sección.
                </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
