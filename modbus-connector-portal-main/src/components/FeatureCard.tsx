
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
  index?: number;
}

const FeatureCard = ({
  icon: Icon,
  title,
  description,
  className,
  iconClassName,
  index = 0,
}: FeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-background p-6 shadow-sm transition-all hover:shadow-md",
        className
      )}
    >
      <div className="absolute -right-4 -top-4 h-24 w-24 bg-primary/10 blur-2xl filter group-hover:bg-primary/20 transition-all"></div>
      
      <div className={cn(
        "mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors",
        "group-hover:bg-primary/20",
        iconClassName
      )}>
        <Icon className="h-5 w-5" />
      </div>
      
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
