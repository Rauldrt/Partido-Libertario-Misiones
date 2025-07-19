
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Sparkles, Lightbulb, Bot } from 'lucide-react';

export default function AiAssistantPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="h-8 w-8 mr-3 text-primary" />
          Asistente de Contenido IA
        </h1>
        <p className="text-muted-foreground mt-2">
          Tu centro de inteligencia para la creación y optimización de contenido.
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>¡Bienvenido al Asistente de IA!</CardTitle>
          <CardDescription>
            Esta es la base para una potente herramienta que te ayudará a gestionar el contenido del sitio de forma más inteligente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Bot className="h-4 w-4" />
            <AlertTitle>Visión a Futuro</AlertTitle>
            <AlertDescription>
              <p>Imaginá un asistente con el que podés chatear para:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Pedir ideas para nuevas noticias o eventos.</li>
                <li>Generar borradores de artículos a partir de un simple tema.</li>
                <li>Optimizar los títulos y resúmenes para que sean más atractivos.</li>
                <li>Analizar el contenido existente y sugerir mejoras.</li>
                <li>Guiar a los nuevos administradores sobre cómo crear contenido efectivo.</li>
              </ul>
            </AlertDescription>
          </Alert>

           <Alert variant="destructive" className="bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400">
            <Lightbulb className="h-4 w-4 !text-green-500" />
            <AlertTitle>Próximos Pasos</AlertTitle>
            <AlertDescription>
              <p>Este es nuestro lienzo. El siguiente paso será construir una interfaz de chat aquí mismo, permitiéndote interactuar directamente con la IA para empezar a hacer realidad esta visión.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
