import { type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

/** A boxed aside on the surface colour, opened by a mono label. */
const PostCalloutComponent = ({ label, children }: { label: string; children: ReactNode }) => {
  return (
    <Card className="my-2 max-w-[68ch] gap-2 bg-surface p-5">
      <p className="type-meta text-muted-foreground">{label}</p>
      <CardContent className="flex flex-col gap-3 type-small text-text2">{children}</CardContent>
    </Card>
  );
};

export default PostCalloutComponent;
