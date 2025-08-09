
import { getContactSubmissions } from '@/lib/contact-service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ContactTable } from './ContactTable';

export default async function ManageContactPage() {
  const submissions = await getContactSubmissions();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Mensajes de Contacto</CardTitle>
        <CardDescription>
          Aquí puedes ver todos los mensajes enviados desde el formulario de contacto del sitio web.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ContactTable initialData={submissions} />
      </CardContent>
    </Card>
  );
}
