
import { cn } from "../../lib/utils";
import { Link, LinkProps } from "react-router-dom";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: React.PropsWithChildren<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}>) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: React.PropsWithChildren<{
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}>) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...(props as any)} />
      <MobileSidebar {...(props as any)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & { children?: React.ReactNode }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-3 py-4 hidden md:flex md:flex-col bg-white/80 dark:bg-[#0F172A]/90 backdrop-blur-2xl border-r border-slate-200 dark:border-white/5 w-[300px] flex-shrink-0 relative z-20",
        className
      )}
      animate={{
        width: animate ? (open ? "280px" : "68px") : "280px",
      }}
      {...props}
    >
      {children}
      {animate && (
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-10 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-[#0F172A] dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white transition-colors focus:outline-none"
          aria-label="Toggle Sidebar"
        >
          <motion.div
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={12} strokeWidth={2} />
          </motion.div>
        </button>
      )}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open, setOpen } = useSidebar();
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "-100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "fixed h-full w-full inset-0 bg-white dark:bg-[#020617] p-6 z-[100] flex flex-col justify-between md:hidden",
            className
          )}
        >
          <div
            className="absolute right-6 top-6 z-50 text-slate-700 dark:text-slate-200 cursor-pointer p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-full"
            onClick={() => setOpen(!open)}
          >
            <X />
          </div>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
} & Omit<LinkProps, "to">) => {
  const { open, animate } = useSidebar();
  return (
    <Link
      to={link.href}
      className={cn(
        "flex items-center gap-3 group/sidebar py-2.5 px-2.5 rounded-xl transition-all duration-200",
        open ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      <div className="text-slate-500 dark:text-slate-400 group-hover/sidebar:text-blue-600 dark:group-hover/sidebar:text-blue-400 transition-colors relative z-10 flex-shrink-0">
        {link.icon}
      </div>
      
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-slate-600 dark:text-slate-300 text-sm font-medium group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0 relative z-10"
      >
        {link.label}
      </motion.span>
    </Link>
  );
};
