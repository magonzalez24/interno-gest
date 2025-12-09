Coloca aquí tus imágenes estáticas del proyecto.

Estructura recomendada:

- Logos: `src/assets/images/logos/`
- Ilustraciones: `src/assets/images/illustrations/`
- Iconos personalizados: `src/assets/images/icons/`

Ejemplo de uso en un componente de React:

```tsx
import exampleImage from "@/assets/images/example.png";

const ExampleImageComponent = () => {
  return (
    <img
      src={exampleImage}
      alt="Ejemplo de imagen"
      className="h-32 w-32 rounded-lg object-cover shadow-md"
    />
  );
};

export default ExampleImageComponent;
```


