import { ContactForm } from '@/components/ContactForm';
import { Section } from '@/components/ui/Section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

export default function ContactPage() {
  return (
    <Section id="contact">
      <div className="text-center mb-12">
        <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Ponete en Contacto</h1>
        <p className="font-body text-xl text-muted-foreground mt-2">
          Estamos para escucharte. Envianos tu consulta, propuesta o sumate a nuestro equipo.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-start">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">Envianos un Mensaje</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-headline text-lg font-semibold">Nuestra Sede</h3>
                  <p className="font-body text-muted-foreground">Calle 123, Posadas, Misiones</p>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-headline text-lg font-semibold">Correo Electrónico</h3>
                  <p className="font-body text-muted-foreground">info@misioneslibertad.com.ar</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-headline text-lg font-semibold">Teléfono</h3>
                  <p className="font-body text-muted-foreground">(0376) 4XXXXXX</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
             <CardHeader>
              <CardTitle className="font-headline text-2xl">Horarios de Atención</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-muted-foreground">Lunes a Viernes: 9:00 - 18:00 hs</p>
              <p className="font-body text-muted-foreground">Sábados: 9:00 - 13:00 hs (Consultar previamente)</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}
