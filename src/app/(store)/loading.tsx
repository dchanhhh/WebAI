import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="py-16 lg:py-24">
      <div className="h-6 w-40 animate-pulse bg-surface-2" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] animate-pulse bg-surface-2" />
            <div className="mt-3 h-3 w-16 animate-pulse bg-surface-2" />
            <div className="mt-2 h-4 w-full animate-pulse bg-surface-2" />
            <div className="mt-2 h-4 w-20 animate-pulse bg-surface-2" />
          </div>
        ))}
      </div>
    </Container>
  );
}
