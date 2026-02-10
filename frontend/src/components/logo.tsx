import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <img
                src="/logo.PNG"
                alt="KriGo Logo"
                className="h-9 w-auto object-contain transition-all mix-blend-multiply dark:invert dark:hue-rotate-[180deg] dark:contrast-[1.2] dark:brightness-[1.1] dark:mix-blend-screen"
            />
            {showText && (
                <span className="text-xl font-black tracking-tighter text-foreground font-heading uppercase italic">
                    Kri<span className="text-primary">Go</span>
                </span>
            )}
        </div>
    );
}
