
import { cn } from "@/lib/utils";

const Section = ({ children, className, id }) => {
  return (
    <section
      id={id}
      className={cn("section-padding w-full max-w-7xl mx-auto", className)}
    >
      {children}
    </section>
  );
};  
export default Section;