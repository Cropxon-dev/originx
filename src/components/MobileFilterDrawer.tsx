import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, X, ChevronDown,
  Brain, Globe2, MapPin, Wallet, Users, MessageSquare, FileText,
  BarChart3, Cog, Code, Building, ShoppingCart, Gamepad2, Heart, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface FilterOption {
  id: string;
  label: string;
}

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  path: string;
  color: string;
  apiCount: number;
  modules: { name: string; apis: number; description: string }[];
}

interface MobileFilterDrawerProps {
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (id: string | null) => void;
  selectedModule: string | null;
  setSelectedModule: (name: string | null) => void;
  expandedCategories: string[];
  toggleCategory: (id: string) => void;
  selectedFilters: Record<string, string[]>;
  toggleFilter: (group: string, id: string) => void;
  totalActiveFilters: number;
  clearAllFilters: () => void;
  pricingFilters: FilterOption[];
  providerFilters: FilterOption[];
  authFilters: FilterOption[];
  slaFilters: FilterOption[];
  regionFilters: FilterOption[];
  complianceFilters: FilterOption[];
}

export function MobileFilterDrawer({
  categories,
  selectedCategory,
  setSelectedCategory,
  selectedModule,
  setSelectedModule,
  expandedCategories,
  toggleCategory,
  selectedFilters,
  toggleFilter,
  totalActiveFilters,
  clearAllFilters,
  pricingFilters,
  providerFilters,
  authFilters,
  slaFilters,
  regionFilters,
  complianceFilters,
}: MobileFilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Filters
          {totalActiveFilters > 0 && (
            <Badge variant="secondary" className="text-xs h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {totalActiveFilters}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[85vw] max-w-sm p-0">
        <SheetHeader className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters & Categories
            </SheetTitle>
            {totalActiveFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-5rem)]">
          <div className="p-4 space-y-6">
            {/* Filter Groups */}
            <FilterGroup
              title="Pricing"
              options={pricingFilters}
              selected={selectedFilters.pricing}
              onToggle={(id) => toggleFilter("pricing", id)}
            />

            <FilterGroup
              title="Provider Type"
              options={providerFilters}
              selected={selectedFilters.provider}
              onToggle={(id) => toggleFilter("provider", id)}
            />

            <FilterGroup
              title="Auth Type"
              options={authFilters}
              selected={selectedFilters.auth}
              onToggle={(id) => toggleFilter("auth", id)}
            />

            <FilterGroup
              title="SLA & Reliability"
              options={slaFilters}
              selected={selectedFilters.sla}
              onToggle={(id) => toggleFilter("sla", id)}
            />

            <FilterGroup
              title="Region"
              options={regionFilters}
              selected={selectedFilters.region}
              onToggle={(id) => toggleFilter("region", id)}
            />

            <FilterGroup
              title="Compliance"
              options={complianceFilters}
              selected={selectedFilters.compliance}
              onToggle={(id) => toggleFilter("compliance", id)}
            />

            {/* Category Navigation */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(
                          selectedCategory === category.id ? null : category.id
                        );
                        toggleCategory(category.id);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-accent/10 text-accent"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <category.icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {category.apiCount}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            expandedCategories.includes(category.id)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedCategories.includes(category.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-6 pl-4 border-l border-border space-y-1 py-2">
                            {category.modules.map((module) => (
                              <button
                                key={module.name}
                                onClick={() => {
                                  setSelectedModule(
                                    selectedModule === module.name
                                      ? null
                                      : module.name
                                  );
                                  setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-2 rounded-lg text-sm transition-colors ${
                                  selectedModule === module.name
                                    ? "bg-accent/10 text-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                }`}
                              >
                                <span>{module.name}</span>
                                <span className="text-xs">{module.apis}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background">
          <Button className="w-full" onClick={() => setIsOpen(false)}>
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FilterGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="flex items-center gap-3 cursor-pointer group p-1"
          >
            <Checkbox
              checked={selected.includes(option.id)}
              onCheckedChange={() => onToggle(option.id)}
            />
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
