import { cn } from "@/lib/utils"

function AspectRatio({
  ratio,
  className,
  ...props
}: { ratio: number; className?: string; [key: string]: any }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={{ "--ratio": ratio } as any}
      className={cn("relative aspect-(--ratio)", className)}
      {...(props as any)}
    />
  )
}

export { AspectRatio }
