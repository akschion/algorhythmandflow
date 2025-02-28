import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useState } from "react";

export function SearchBar() {
  const [, setLocation] = useLocation();
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      setLocation(`/blog?search=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Input
        type="search"
        placeholder="Search posts..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}
