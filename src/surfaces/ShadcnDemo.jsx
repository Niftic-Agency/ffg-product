import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from '@/components/ui/field';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Living gallery for the themed shadcn instance (@/components/ui/*).
// Doubles as the verification surface — route: /shadcn-demo.
const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'];
const BADGE_VARIANTS = ['default', 'secondary', 'outline', 'destructive', 'ghost', 'link'];
const SIZES = ['xs', 'sm', 'default', 'lg'];

export default function ShadcnDemo() {
  return (
    <div style={{ minHeight: '100vh', padding: '48px', background: 'var(--background)', color: 'var(--foreground)' }}>
      <Toaster />
      <div style={{ maxWidth: 880, margin: '0 auto', display: 'grid', gap: 40 }}>
        <header>
          <h1 style={{ fontFamily: 'var(--font-serif, serif)', fontWeight: 300, fontSize: 32, margin: 0 }}>
            FFG · shadcn instance
          </h1>
          <p style={{ color: 'var(--muted-foreground)', margin: '6px 0 0' }}>
            Themed components from <code>@ffg</code> · <code>@/components/ui/*</code>
          </p>
        </header>

        <section style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Button — variants</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
          <h2 style={{ fontSize: 18, margin: '8px 0 0' }}>Button — sizes</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
            {SIZES.map((s) => (
              <Button key={s} size={s}>
                {s}
              </Button>
            ))}
            <Button disabled>disabled</Button>
          </div>
        </section>

        <Separator />

        <section style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Badge — variants</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {BADGE_VARIANTS.map((v) => (
              <Badge key={v} variant={v}>
                {v}
              </Badge>
            ))}
          </div>
        </section>

        <Separator />

        <section style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Field · Input · Label</h2>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="demo-email">Email</FieldLabel>
              <Input id="demo-email" type="email" placeholder="you@example.com" />
              <FieldDescription>We'll never share your email.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="demo-name">Name</FieldLabel>
              <Input id="demo-name" placeholder="Jane Doe" />
            </Field>
          </FieldGroup>
        </section>

        <Separator />

        <section style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Toggle · ToggleGroup</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
            <Toggle>Toggle</Toggle>
            <ToggleGroup variant="outline" defaultValue={['bold']} multiple>
              <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
              <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
              <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </section>

        <Separator />

        <section style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Carousel</h2>
          <Carousel style={{ width: '100%' }}>
            <CarouselContent>
              {[1, 2, 3, 4, 5].map((n) => (
                <CarouselItem key={n} style={{ flexBasis: '50%' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: 120,
                      borderRadius: 'var(--radius, 8px)',
                      border: '1px solid var(--border)',
                      fontSize: 28,
                      fontWeight: 300,
                    }}
                  >
                    {n}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <Separator />

        <section style={{ display: 'grid', gap: 16 }}>
          <h2 style={{ fontSize: 18, margin: 0 }}>Sonner (toast)</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            <Button variant="outline" onClick={() => toast('Event created', { description: 'Sunday, June 22 at 9:00 AM' })}>
              Show toast
            </Button>
            <Button variant="outline" onClick={() => toast.success('Saved successfully')}>
              Success toast
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
